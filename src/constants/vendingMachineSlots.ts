/**
 * Defines the available slots in the vending machine using an enum.
 */
export const VENDING_MACHINE_SLOTS =  {
  A1: "A1",
  A2: "A2",
  A3: "A3",

  B1: "B1",
  B2: "B2",
  B3: "B3",

  C1: "C1",
  C2: "C2",
  C3: "C3",

  D1: "D1",
  D2: "D2",
  D3: "D3"
} as const;

export type VendingMachineSlot = typeof VENDING_MACHINE_SLOTS[keyof typeof VENDING_MACHINE_SLOTS];