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
});
