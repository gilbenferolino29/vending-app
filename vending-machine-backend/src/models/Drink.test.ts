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

});
