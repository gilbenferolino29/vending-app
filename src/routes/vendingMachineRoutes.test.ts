// src/routes/vendingMachineRoutes.test.ts
import request from "supertest";
import app from "../index"; // Import the Express app instance
import { VendingMachine } from "../models/VendingMachine"; // To access the internal state for assertions
import { VENDING_MACHINE_SLOTS } from "../constants/vendingMachineSlots";
import { resetVendingMachineInstance } from "./vendingMachineRoutes";

describe("Vending Machine API Integration Tests", () => {
  // Before each test, reset the vending machine's internal state
  beforeEach(() => {
    // Reset the vending machine's internal state before each test
    resetVendingMachineInstance();
  });

  // --- GET /api/inventory ---
  it("GET /api/inventory should return initial inventory", async () => {
    const res = await request(app).get("/api/inventory");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("drinks");
    expect(res.body.drinks.length).toBeGreaterThan(0);
    expect(res.body).toHaveProperty("coins", 100);
    expect(res.body).toHaveProperty("cash", 200);
    expect(res.body.drinks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Coke",
          price: 10,
          quantity: 10,
          slot: VENDING_MACHINE_SLOTS.A1,
        }),
      ])
    );
  });

  // --- POST /api/buy ---
  it("POST /api/buy should successfully purchase a drink and update inventory", async () => {
    // Get initial inventory for assertions
    const initialInventoryRes = await request(app).get("/api/inventory");
    const initialCokeQuantity = initialInventoryRes.body.drinks.find(
      (d: any) => d.slot === VENDING_MACHINE_SLOTS.A1
    ).quantity;
    const initialCoins = initialInventoryRes.body.coins;

    const res = await request(app)
      .post("/api/buy")
      .send({ slot: VENDING_MACHINE_SLOTS.A1, paymentAmount: 20 }); // Coke: 10 PHP

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain(
      `You purchased Coke from slot ${VENDING_MACHINE_SLOTS.A1}. Your change is 10 PHP.`
    );
    expect(res.body.change).toBe(10);
    expect(res.body.purchasedDrink.name).toBe("Coke");
    expect(res.body.purchasedDrink.slot).toBe(VENDING_MACHINE_SLOTS.A1);
    expect(res.body.purchasedDrink.quantity).toBe(initialCokeQuantity);

    // Verify updated inventory
    const updatedInventoryRes = await request(app).get("/api/inventory");
    expect(
      updatedInventoryRes.body.drinks.find(
        (d: any) => d.slot === VENDING_MACHINE_SLOTS.A1
      ).quantity
    ).toBe(initialCokeQuantity - 1);
    expect(updatedInventoryRes.body.coins).toBe(initialCoins + 20 - 10);
  });

  it("POST /api/buy should return 400 for invalid slot", async () => {
    const res = await request(app)
      .post("/api/buy")
      .send({ slot: "Z9", paymentAmount: 10 });

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("Invalid slot");
  });

  it("POST /api/buy should return 400 for insufficient payment", async () => {
    const res = await request(app)
      .post("/api/buy")
      .send({ slot: VENDING_MACHINE_SLOTS.A1, paymentAmount: 5 }); // Coke is 10 PHP

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("Payment is not enough");
    expect(res.body.change).toBe(5);
  });

  it("POST /api/buy should return 400 if drink is out of stock", async () => {
    // First, buy all 10 Cokes to make it out of stock
    for (let i = 0; i < 10; i++) {
      await request(app)
        .post("/api/buy")
        .send({ slot: VENDING_MACHINE_SLOTS.A1, paymentAmount: 10 });
    }

    const res = await request(app)
      .post("/api/buy")
      .send({ slot: VENDING_MACHINE_SLOTS.A1, paymentAmount: 10 });

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("is out of stock");
    expect(res.body.change).toBe(10);
  });

  it("POST /api/buy should return 400 if machine has insufficient change", async () => {
    // Reset ensures initial state. Now deplete machine coins.
    // Assuming initial coins are 100. Let's buy items to reduce it.
    // Buy Coke (10 PHP) 9 times, leaving 1 Coke and 10 coins.
    for (let i = 0; i < 9; i++) {
      await request(app)
        .post("/api/buy")
        .send({ slot: VENDING_MACHINE_SLOTS.A1, paymentAmount: 10 });
    }

    const { getVendingMachineInstance } = require("./vendingMachineRoutes"); // Dynamic import to get current instance
    const vm = getVendingMachineInstance();
    vm["coins"] = 5; // Directly set coins to a low value
    vm["cash"] = 0; // Ensure cash is also low

    // Try to buy Dew (30 PHP) with 50 PHP, needs 20 PHP change.
    // Machine only has 5 PHP.
    const res = await request(app)
      .post("/api/buy")
      .send({ slot: VENDING_MACHINE_SLOTS.B1, paymentAmount: 50 }); // Dew is 30 PHP

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("not have enough change");
    expect(res.body.change).toBe(50); // Full payment returned
  });

  // --- POST /api/refill ---
  it("POST /api/refill should successfully refill a drink", async () => {
    // Reduce Coke stock below refill threshold
    await request(app)
      .post("/api/buy")
      .send({ slot: VENDING_MACHINE_SLOTS.A1, paymentAmount: 10 }); // Coke quantity 9
    await request(app)
      .post("/api/buy")
      .send({ slot: VENDING_MACHINE_SLOTS.A1, paymentAmount: 10 }); // Coke quantity 8
    await request(app)
      .post("/api/buy")
      .send({ slot: VENDING_MACHINE_SLOTS.A1, paymentAmount: 10 }); // Coke quantity 7
    await request(app)
      .post("/api/buy")
      .send({ slot: VENDING_MACHINE_SLOTS.A1, paymentAmount: 10 }); // Coke quantity 6
    await request(app)
      .post("/api/buy")
      .send({ slot: VENDING_MACHINE_SLOTS.A1, paymentAmount: 10 }); // Coke quantity 5
    await request(app)
      .post("/api/buy")
      .send({ slot: VENDING_MACHINE_SLOTS.A1, paymentAmount: 10 }); // Coke quantity 4
    await request(app)
      .post("/api/buy")
      .send({ slot: VENDING_MACHINE_SLOTS.A1, paymentAmount: 10 }); // Coke quantity 3 (Threshold!)

    const res = await request(app)
      .post("/api/refill")
      .send({ slot: VENDING_MACHINE_SLOTS.A1 });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain(
      `Coke (Slot: ${VENDING_MACHINE_SLOTS.A1}) refilled. New quantity: 10.`
    );
    expect(res.body.newQuantity).toBe(10);

    // Verify updated inventory
    const updatedInventoryRes = await request(app).get("/api/inventory");
    expect(
      updatedInventoryRes.body.drinks.find(
        (d: any) => d.slot === VENDING_MACHINE_SLOTS.A1
      ).quantity
    ).toBe(10);
  });

  it("POST /api/refill should return 400 for invalid slot", async () => {
    const res = await request(app).post("/api/refill").send({ slot: "Z9" });

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("Invalid slot");
  });

  it("POST /api/refill should return 400 if stock is above refill threshold", async () => {
    // Initial stock is 10, which is above threshold (3)
    const res = await request(app)
      .post("/api/refill")
      .send({ slot: VENDING_MACHINE_SLOTS.A1 });

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain(
      "current stock (10) is above refill threshold"
    );
  });
});
