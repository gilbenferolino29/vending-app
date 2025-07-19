
export interface DrinkData {
  name: string;
  price: number;
  quantity: number;
}

/**
 * Represents a single type of drink in the vending machine.
 */
export class Drink implements DrinkData{
  public name: string;
  public price: number;
  public quantity: number;

  /**
   * Creates an instance of Drink.
   * @param name The name of the drink (e.g., "Coke", "Pepsi").
   * @param price The price of the drink in PHP.
   * @param quantity The current stock quantity of the drink.
   */
  constructor(name: string, price: number, quantity: number) {
    if (price <= 0) {
      throw new Error("Drink price must be positive.");
    }
    if (quantity < 0) {
      throw new Error("Drink quantity cannot be negative.");
    }

    this.name = name;
    this.price = price;
    this.quantity = quantity;
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