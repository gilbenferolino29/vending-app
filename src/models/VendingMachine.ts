// src/models/VendingMachine.ts
import {
  VENDING_MACHINE_SLOTS,
  VendingMachineSlot,
} from "../constants/vendingMachineSlots";
import { Drink, DrinkData } from "./Drink";

/**
 * Manages the state and operations of the vending machine.
 */
export class VendingMachine {
  private drinks: Map<VendingMachineSlot, Drink>; // Stores drinks, keyed by slot for quick lookup
  private coins: number; // Total PHP from coins
  private cash: number; // Total PHP from cash

  // Constants for refill logic
  private static readonly MAX_STOCK_PER_DRINK = 10;
  private static readonly REFILL_THRESHOLD = 3;

  /**
   * Creates an instance of VendingMachine with initial inventory and balance.
   */
  constructor() {
    this.drinks = new Map<VendingMachineSlot, Drink>();
    this.coins = 0;
    this.cash = 0;

    // Initialize products and starting inventory as per assignment
    this.addDrink(new Drink("Coke", 10, 10, VENDING_MACHINE_SLOTS.A1));
    this.addDrink(new Drink("Pepsi", 25, 10, VENDING_MACHINE_SLOTS.A2));
    this.addDrink(new Drink("Dew", 30, 10, VENDING_MACHINE_SLOTS.B1));
    this.addDrink(new Drink("Sprite", 20, 10, VENDING_MACHINE_SLOTS.B2));
    this.addDrink(new Drink("Fanta", 15, 10, VENDING_MACHINE_SLOTS.C1));
    this.addDrink(new Drink("Dr. Pepper", 35, 10, VENDING_MACHINE_SLOTS.C2));
    this.addDrink(new Drink("Mountain Dew", 30, 10, VENDING_MACHINE_SLOTS.D1));
    this.addDrink(new Drink("Root Beer", 25, 10, VENDING_MACHINE_SLOTS.D2));

    // Initial Balance
    this.addCoins(100); // 1 coin = 1 PHP
    this.addCash(200); // PHP 200
  }

  /**
   * Adds a drink to the vending machine's inventory.
   * If the drink already exists, its quantity will be updated.
   * @param drink The Drink object to add.
   */
  private addDrink(drink: Drink): void {
    this.drinks.set(drink.slot, drink);
  }

  /**
   * Adds coins to the machine's balance.
   * @param amount The amount of coins (in PHP).
   */
  public addCoins(amount: number): void {
    if (amount < 0) throw new Error("Cannot add negative coin amount.");
    this.coins += amount;
  }

  /**
   * Adds cash to the machine's balance.
   * @param amount The amount of cash (in PHP).
   */
  public addCash(amount: number): void {
    if (amount < 0) throw new Error("Cannot add negative cash amount.");
    this.cash += amount;
  }

  /**
   * Retrieves the current inventory (drinks, coins, cash).
   * @returns An object containing current drink stock and machine balance.
   */
  public getInventory(): { drinks: Drink[]; coins: number; cash: number } {
    return {
      drinks: Array.from(this.drinks.values()), // Convert Map values to an array
      coins: this.coins,
      cash: this.cash,
    };
  }

  /**
   * Processes a drink purchase.
   * @param slot The slot of the drink to buy.
   * @param paymentAmount The total payment amount (coins + cash).
   * @returns An object with transaction details: { success: boolean, message: string, change: number, purchasedDrink?: Drink }
   */
  public buyDrink(
    slot: VendingMachineSlot,
    payment: {
      totalPayment: number;
      coins: number;
      cash: number;
    }
  ): {
    success: boolean;
    message: string;
    change: number;
    purchasedDrink?: DrinkData;
  } {
    const drink = this.drinks.get(slot);
    const paymentAmount = payment.totalPayment;

    if (!drink) {
      return {
        success: false,
        message: "Drink not found.",
        change: paymentAmount,
      };
    }
    if (drink.quantity === 0) {
      return {
        success: false,
        message: `${drink.name} is out of stock.`,
        change: paymentAmount,
      };
    }
    if (paymentAmount < drink.price) {
      return {
        success: false,
        message: `Payment is not enough. Price: ${drink.price} PHP. Paid: ${paymentAmount} PHP.`,
        change: paymentAmount,
      };
    }

    const change = paymentAmount - drink.price;

    // Check if machine has enough change.
    // In this simplified model, we assume 1 coin = 1 PHP and cash is also in PHP.
    // So total machine balance is simply coins + cash.
    if (this.coins + this.cash < change) {
      return {
        success: false,
        message: `Vending machine does not have enough change. Please use exact amount or smaller denominations.`,
        change: paymentAmount,
      };
    }

    // Process sale
    drink.decreaseQuantity(); // Decrement stock
    this.coins += payment.coins;
    this.cash += payment.cash;
    this.coins -= change; // Dispense change from coins

    return {
      success: true,
      message: `You purchased ${drink.name} from slot ${slot}. Your change is ${change} PHP.`,
      change: change,
      purchasedDrink: { ...drink, quantity: drink.quantity + 1 }, // Return the drink details before quantity decreased for display
    };
  }

  /**
   * Refills the stock of a specific drink.
   * @param slot The name of the drink to refill.
   * @returns An object with refill details: { success: boolean, message: string, newQuantity?: number }
   */
  public refillDrink(slot: VendingMachineSlot): {
    success: boolean;
    message: string;
    newQuantity?: number;
  } {
    const drink = this.drinks.get(slot);

    if (!drink) {
      return { success: false, message: "Drink not found." };
    }

    if (drink.quantity > VendingMachine.REFILL_THRESHOLD) {
      return {
        success: false,
        message: `${drink.name} current stock (${drink.quantity}) is above refill threshold (${VendingMachine.REFILL_THRESHOLD}).`,
      };
    }

    // Calculate how much to add to reach MAX_STOCK_PER_DRINK
    const amountToAdd = VendingMachine.MAX_STOCK_PER_DRINK - drink.quantity;
    drink.increaseQuantity(amountToAdd);

    return {
      success: true,
      message: `${drink.name} (Slot: ${slot}) refilled. New quantity: ${drink.quantity}.`,
      newQuantity: drink.quantity,
    };
  }

  /**
   * Resets the vending machine to its initial state.
   * (Useful for testing or starting over)
   */
  public reset(): void {
    this.drinks.clear();
    this.coins = 0;
    this.cash = 0;

    // Re-initialize using constants
    this.addDrink(new Drink("Coke", 10, 10, VENDING_MACHINE_SLOTS.A1));
    this.addDrink(new Drink("Pepsi", 25, 10, VENDING_MACHINE_SLOTS.A2));
    this.addDrink(new Drink("Dew", 30, 10, VENDING_MACHINE_SLOTS.B1));
    this.addDrink(new Drink("Sprite", 20, 10, VENDING_MACHINE_SLOTS.B2));
    this.addDrink(new Drink("Fanta", 15, 10, VENDING_MACHINE_SLOTS.C1));
    this.addDrink(new Drink("Dr. Pepper", 35, 10, VENDING_MACHINE_SLOTS.C2));
    this.addDrink(new Drink("Mountain Dew", 30, 10, VENDING_MACHINE_SLOTS.D1));
    this.addDrink(new Drink("Root Beer", 25, 10, VENDING_MACHINE_SLOTS.D2));

    this.addCoins(100);
    this.addCash(200);
  }
}
