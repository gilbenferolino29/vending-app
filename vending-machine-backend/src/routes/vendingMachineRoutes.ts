import { Router, Request, Response } from "express";
import { VendingMachine } from "../models/VendingMachine"; // Adjust path if needed
import { VendingMachineSlot } from "../constants/vendingMachineSlots";
import {
  validatePaymentAmount,
  validateSlot,
} from "../middlewares/validationMiddleware";

// This instance will be shared across all requests handled by this router.
let vendingMachineInstance = new VendingMachine();
const router = Router();

// For Testing
// A function to get the current vending machine instance
export const getVendingMachineInstance = () => vendingMachineInstance;

// A function to reset the vending machine instance for testing
export const resetVendingMachineInstance = () => {
  vendingMachineInstance = new VendingMachine();
  vendingMachineInstance.reset(); // Call the reset method
};

// GET /inventory - View current stock of drinks and machine balance
router.get("/inventory", (req: Request, res: Response) => {
  try {
    const inventory = vendingMachineInstance.getInventory();
    res.status(200).json(inventory);
  } catch (error: any) {
    console.error("Error fetching inventory:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// POST /buy - Buy a drink
router.post(
  "/buy",
  validateSlot,
  validatePaymentAmount,
  (req: Request, res: Response) => {
    const { slot, paymentAmount } = req.body;

    try {
      const result = vendingMachineInstance.buyDrink(
        slot as VendingMachineSlot,
        paymentAmount
      );
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      console.error("Error buying drink:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
);

// POST /refill - Refill drink stocks
router.post("/refill", validateSlot, (req: Request, res: Response) => {
  const { slot } = req.body;

  try {
    const result = vendingMachineInstance.refillDrink(
      slot as VendingMachineSlot
    );
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error: any) {
    console.error("Error refilling drink:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

export default router;
