import {
  VENDING_MACHINE_SLOTS,
  VendingMachineSlot,
} from "../constants/vendingMachineSlots";

export interface DrinkData {
  name: string;
  price: number;
  quantity: number;
  slot: VendingMachineSlot;
}

/**
 * Represents a single type of drink in the vending machine.
 */
export class Drink implements DrinkData {
  public name: string;
  public price: number;
  public quantity: number;
  public slot: VendingMachineSlot;

  /**
   * Creates an instance of Drink.
   * @param name The name of the drink (e.g., "Coke", "Pepsi").
   * @param price The price of the drink in PHP.
   * @param quantity The current stock quantity of the drink.
   */
  constructor(
    name: string,
    price: number,
    quantity: number,
    slot: VendingMachineSlot
  ) {
    if (price <= 0) {
      throw new Error("Drink price must be positive.");
    }
    if (quantity < 0) {
      throw new Error("Drink quantity cannot be negative.");
    }
    // Validate slot against known constants
    if (!Object.values(VENDING_MACHINE_SLOTS).includes(slot)) {
      throw new Error(
        `Invalid slot: ${slot}. Must be one of ${Object.values(
          VENDING_MACHINE_SLOTS
        ).join(", ")}.`
      );
    }

    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.slot = slot;
  }

  /**
   * Decreases the quantity of the drink by a specified amount.
   * @param amount The amount to decrease the quantity by. Defaults to 1.
   * @returns True if quantity was successfully decreased, false otherwise (e.g., not enough stock).
   */
  public decreaseQuantity(amount: number = 1): boolean {
    if (this.quantity >= amount) {
      this.quantity -= amount;
      return true;
    }
    return false;
  }

  /**
   * Increases the quantity of the drink by a specified amount.
   * @param amount The amount to increase the quantity by. Defaults to 1.
   */
  public increaseQuantity(amount: number = 1): void {
    this.quantity += amount;
  }
}
