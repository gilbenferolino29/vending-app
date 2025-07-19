import { Router, Request, Response } from 'express';
import { VendingMachine } from '../models/VendingMachine'; // Adjust path if needed

// This instance will be shared across all requests handled by this router.
const vendingMachine = new VendingMachine();

const router = Router();

// GET /inventory - View current stock of drinks and machine balance
router.get('/inventory', (req: Request, res: Response) => {
  try {
    const inventory = vendingMachine.getInventory();
    res.status(200).json(inventory);
  } catch (error: any) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// POST /buy - Buy a drink
router.post('/buy', (req: Request, res: Response) => {
  const { drinkName, paymentAmount } = req.body;

  // Basic input validation
  if (!drinkName || typeof drinkName !== 'string') {
    return res.status(400).json({ success: false, message: 'Drink name is required and must be a string.' });
  }
  if (typeof paymentAmount !== 'number' || paymentAmount <= 0) {
    return res.status(400).json({ success: false, message: 'Valid payment amount (positive number) is required.' });
  }

  try {
    const result = vendingMachine.buyDrink(drinkName, paymentAmount);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error: any) {
    console.error('Error buying drink:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// POST /refill - Refill drink stocks
router.post('/refill', (req: Request, res: Response) => {
  const { drinkName } = req.body;

  // Basic input validation
  if (!drinkName || typeof drinkName !== 'string') {
    return res.status(400).json({ success: false, message: 'Drink name is required and must be a string for refill.' });
  }

  try {
    const result = vendingMachine.refillDrink(drinkName);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error: any) {
    console.error('Error refilling drink:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

export default router;