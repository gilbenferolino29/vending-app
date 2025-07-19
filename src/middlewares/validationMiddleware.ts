// src/middleware/validationMiddleware.ts
import { Request, Response, NextFunction } from "express";
import {
  VENDING_MACHINE_SLOTS,
  VendingMachineSlot,
} from "../constants/vendingMachineSlots";

/**
 * Middleware to validate if a 'slot' parameter in the request body is valid.
 * Assumes 'slot' is expected in req.body.
 */
export const validateSlot = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { slot } = req.body;

  if (
    !slot ||
    typeof slot !== "string" ||
    !Object.values(VENDING_MACHINE_SLOTS).includes(slot as VendingMachineSlot)
  ) {
    return res.status(400).json({
      success: false,
      message: `Invalid slot: "${slot}". Slot is required and must be one of the following: ${Object.values(
        VENDING_MACHINE_SLOTS
      ).join(", ")}.`,
    });
  }

  // If validation passes, cast the slot to the correct type for downstream use
  // and pass control to the next middleware/route handler.
  req.body.slot = slot as VendingMachineSlot;
  next();
};

/**
 * Middleware to validate if a 'paymentAmount' parameter in the request body is valid.
 * Assumes 'paymentAmount' is expected in req.body.
 */
export const validatePaymentAmount = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { paymentAmount } = req.body;

  if (typeof paymentAmount !== "number" || paymentAmount <= 0) {
    return res.status(400).json({
      success: false,
      message: "Valid payment amount (positive number) is required.",
    });
  }
  next();
};
