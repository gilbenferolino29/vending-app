import express, { Request, Response } from "express";

import vendingMachineRoutes from "./routes/vendingMachineRoutes";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Vending Machine Backend is running!");
});

app.use(
  cors({
    origin: "*", // Allows requests from any origin (e.g., any domain or port)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api", vendingMachineRoutes);

// Export the app instance for testing purposes
export default app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
