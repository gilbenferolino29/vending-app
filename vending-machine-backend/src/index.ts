import express, { Request, Response } from "express";
import { VendingMachine } from "./models/VendingMachine";
import vendingMachineRoutes from "./routes/vendingMachineRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Vending Machine Backend is running!");
});

app.use("/api", vendingMachineRoutes);

// Export the app instance for testing purposes
export default app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
