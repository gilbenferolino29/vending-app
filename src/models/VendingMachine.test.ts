import { VendingMachine } from "./VendingMachine";
import { VENDING_MACHINE_SLOTS } from "../constants/vendingMachineSlots";

describe("VendingMachine", () => {
  let vendingMachine: VendingMachine;

  beforeEach(() => {
    // Reset the vending machine to a known initial state before each test
    vendingMachine = new VendingMachine();
  });

  it("should initialize with correct drinks, coins, and cash", () => {
    const inventory = vendingMachine.getInventory();
    expect(inventory.drinks.length).toBeGreaterThan(0);
    expect(inventory.drinks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Coke",
          price: 10,
          quantity: 10,
          slot: VENDING_MACHINE_SLOTS.A1,
        }),
        expect.objectContaining({
          name: "Pepsi",
          price: 25,
          quantity: 10,
          slot: VENDING_MACHINE_SLOTS.A2,
        }),
      ])
    );
    expect(inventory.coins).toBe(100);
    expect(inventory.cash).toBe(200);
  });

  describe("buyDrink", () => {
    it("should successfully buy a drink and return correct change", () => {
      const initialCokeQuantity = vendingMachine
        .getInventory()
        .drinks.find((d) => d.name === "Coke")?.quantity;
      const initialCoins = vendingMachine.getInventory().coins;

      const result = vendingMachine.buyDrink(VENDING_MACHINE_SLOTS.A1, {
        totalPayment: 20,
        coins: 20,
        cash: 10,
      }); // Coke is 10 PHP
      expect(result.success).toBe(true);
      expect(result.message).toBe(
        `You purchased Coke from slot ${VENDING_MACHINE_SLOTS.A1}. Your change is 10 PHP.`
      );
      expect(result.change).toBe(10);
      expect(result.purchasedDrink?.name).toBe("Coke");
      expect(result.purchasedDrink?.quantity).toBe(initialCokeQuantity ?? 0);

      const updatedInventory = vendingMachine.getInventory();
      // Machine balance increases by payment amount and then decreases by change amount
      expect(updatedInventory.coins).toBe(initialCoins + 20 - 10);
      expect(
        updatedInventory.drinks.find((d) => d.name === "Coke")?.quantity
      ).toBe((initialCokeQuantity ?? 0) - 1);
    });

    it("should return failure if drink slot not found", () => {
      const result = vendingMachine.buyDrink("Z9" as any, {
        totalPayment: 10,
        coins: 10,
        cash: 0,
      }); // Invalid slot
      expect(result.success).toBe(false);
      expect(result.message).toBe("Drink not found.");
      expect(result.change).toBe(10); // Payment is returned as change
    });

    it("should return failure if drink is out of stock", () => {
      // Empty the Coke stock
      const coke = vendingMachine
        .getInventory()
        .drinks.find((d) => d.name === "Coke");
      if (coke) coke.quantity = 0; // Directly manipulate for test setup

      const result = vendingMachine.buyDrink(VENDING_MACHINE_SLOTS.A1, {
        totalPayment: 10,
        coins: 10,
        cash: 0,
      });
      expect(result.success).toBe(false);
      expect(result.message).toContain("is out of stock");
      expect(result.change).toBe(10);
    });

    it("should return failure if payment is not enough", () => {
      const result = vendingMachine.buyDrink(VENDING_MACHINE_SLOTS.A1, {
        totalPayment: 5,
        coins: 5,
        cash: 0,
      }); // Coke is 10 PHP
      expect(result.success).toBe(false);
      expect(result.message).toContain("Payment is not enough");
      expect(result.change).toBe(5);
    });

    it("should return failure if machine does not have enough change", () => {
      // Manipulate machine balance to have insufficient coins for change
      vendingMachine["coins"] = 0; // Access private property for test setup (less ideal but effective for in-memory)
      vendingMachine["cash"] = 5; // Total balance 5

      const result = vendingMachine.buyDrink(VENDING_MACHINE_SLOTS.A1, {
        totalPayment: 50,
        coins: 0,
        cash: 50,
      }); // Buy Coke (10 PHP), needs 40 PHP change
      expect(result.success).toBe(false);
      expect(result.message).toContain("not have enough change");
      expect(result.change).toBe(50); // Full payment returned
    });
  });

  describe("refillDrink", () => {
    it("should successfully refill a drink if stock is at or below threshold", () => {
      const coke = vendingMachine
        .getInventory()
        .drinks.find((d) => d.name === "Coke");
      if (coke) coke.quantity = 3; // Set to threshold

      const result = vendingMachine.refillDrink(VENDING_MACHINE_SLOTS.A1);
      expect(result.success).toBe(true);
      expect(result.message).toContain("refilled. New quantity: 10.");
      expect(result.newQuantity).toBe(10);

      const updatedInventory = vendingMachine.getInventory();
      expect(
        updatedInventory.drinks.find((d) => d.name === "Coke")?.quantity
      ).toBe(10);
    });

    it("should return failure if drink not found for refill", () => {
      const result = vendingMachine.refillDrink("Z9" as any);
      expect(result.success).toBe(false);
      expect(result.message).toBe("Drink not found.");
      expect(result.newQuantity).toBeUndefined();
    });

    it("should return failure if stock is above refill threshold", () => {
      const coke = vendingMachine
        .getInventory()
        .drinks.find((d) => d.name === "Coke");
      if (coke) coke.quantity = 5; // Above threshold (3)

      const result = vendingMachine.refillDrink(VENDING_MACHINE_SLOTS.A1);
      expect(result.success).toBe(false);
      expect(result.message).toContain("is above refill threshold");
      expect(result.newQuantity).toBeUndefined();
      expect(
        vendingMachine.getInventory().drinks.find((d) => d.name === "Coke")
          ?.quantity
      ).toBe(5); // Quantity unchanged
    });
  });

  describe("addCoins and addCash", () => {
    it("should correctly add coins", () => {
      vendingMachine.addCoins(50);
      expect(vendingMachine.getInventory().coins).toBe(150);
    });

    it("should correctly add cash", () => {
      vendingMachine.addCash(100);
      expect(vendingMachine.getInventory().cash).toBe(300);
    });

    it("should throw error for negative addCoins amount", () => {
      expect(() => vendingMachine.addCoins(-10)).toThrow(
        "Cannot add negative coin amount."
      );
    });

    it("should throw error for negative addCash amount", () => {
      expect(() => vendingMachine.addCash(-10)).toThrow(
        "Cannot add negative cash amount."
      );
    });
  });
});
