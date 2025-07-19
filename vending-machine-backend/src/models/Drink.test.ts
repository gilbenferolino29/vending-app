import { VENDING_MACHINE_SLOTS } from "../constants/vendingMachineSlots";
import { Drink } from "./Drink";

describe("Drink", () => {
  const validSlot = VENDING_MACHINE_SLOTS.A1;

  it("should create a drink instance with valid properties", () => {
    const drink = new Drink("Coke", 10, 5, validSlot);
    expect(drink).toBeInstanceOf(Drink);
    expect(drink.name).toBe("Coke");
    expect(drink.price).toBe(10);
    expect(drink.quantity).toBe(5);
    expect(drink.slot).toBe(validSlot);
  });

  it("should throw error if price is zero or negative", () => {
    expect(() => new Drink("Water", 0, 10, validSlot)).toThrow(
      "Drink price must be positive."
    );
    expect(() => new Drink("Water", -5, 10, validSlot)).toThrow(
      "Drink price must be positive."
    );
  });

  it("should throw error if quantity is negative", () => {
    expect(() => new Drink("Juice", 20, -1, validSlot)).toThrow(
      "Drink quantity cannot be negative."
    );
  });

  it("should throw error if slot is invalid", () => {
    // We expect a type error from TypeScript if we try to pass an invalid string directly
    // This runtime check is for when JS code might bypass TS types (e.g., from external input)
    expect(() => new Drink("Soda", 15, 5, "Z9" as any)).toThrow(/Invalid slot/);
  });
});
