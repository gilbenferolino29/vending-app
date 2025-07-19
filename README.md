# Vending Machine Backend

## Overview

This project implements a backend service for a simple Vending Machine using Node.js, Express, and TypeScript. It simulates the core functionalities of a vending machine, including managing drink inventory, processing purchases, handling payments, dispensing change, and refilling stock.

The design emphasizes clear separation of concerns, object-oriented principles, and robust error handling, with a focus on maintainability and testability.

## Features

- **Drink Management:** Tracks various drinks with their prices and quantities.
- **Slot-Based Inventory:** Drinks are organized by specific slots (e.g., A1, B2) for a more realistic vending machine interaction.
- **Purchase Logic:**
  - Allows users to buy drinks by specifying a slot and payment amount.
  - Validates stock availability and sufficient payment.
  - Calculates and dispenses change.
  - Handles cases where the machine cannot provide exact change.
- **Refill Functionality:** Enables refilling of drink stock for specific slots, respecting a defined refill threshold.
- **Inventory Inquiry:** Provides an API to view the current stock of all drinks and the machine's internal cash/coin balance.
- **API Endpoints:** A set of RESTful API endpoints for interaction.
- **Robust Error Handling:** Provides meaningful error messages for invalid requests or business logic failures.
- **Type Safety:** Built with TypeScript for enhanced code quality and fewer runtime errors.
- **Modular Architecture:** Organized into distinct layers (models, routes, middleware, constants) for clarity and scalability.
- **Comprehensive Testing:** Includes unit tests for core logic and integration tests for API endpoints.

## Project Structure

├── src/
│ ├── constants/ # Defines shared constants like VENDING_MACHINE_SLOTS
│ │ └── vendingMachineSlots.ts
│ ├── middleware/ # Express middleware for request validation
│ │ └── validationMiddleware.ts
│ ├── models/ # Core business logic (Drink and VendingMachine classes)
│ │ ├── Drink.ts
│ │ └── VendingMachine.ts
│ ├── routes/ # Express router for API endpoints
│ │ ├── vendingMachineRoutes.ts
│ │ └── vendingMachineRoutes.test.ts # Integration tests for routes
│ ├── index.ts # Main Express application entry point
│ └── tests/ # (Optional: for broader test categories)
│ └── ...
├── .gitignore # Specifies intentionally untracked files to ignore
├── jest.config.js # Jest testing framework configuration
├── package.json # Project metadata and dependencies
├── tsconfig.json # TypeScript compiler configuration
└── README.md # This file

## Getting Started

Follow these instructions to set up and run the Vending Machine Backend on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (Node Package Manager, usually comes with Node.js)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/your-username/vending-machine-backend.git](https://github.com/your-username/vending-machine-backend.git)
    cd vending-machine-backend
    ```

    _(Remember to replace `your-username/vending-machine-backend.git` with your actual repository URL)_

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Application

1.  **Build the TypeScript code:**

    ```bash
    npm run build
    ```

    This compiles the TypeScript files from `src/` to JavaScript files in the `dist/` directory.

2.  **Start the server:**

    ```bash
    npm start
    ```

    The server will start on `http://localhost:3000` by default.

    For development with automatic restarts on code changes (using `nodemon` and `ts-node`):

    ```bash
    npm run dev
    ```

## API Endpoints

The API is served at `http://localhost:3000/api`. All requests and responses are in JSON format.

### 1. Get Inventory

Retrieves the current stock of all drinks and the machine's internal coin/cash balance.

- **URL:** `/api/inventory`
- **Method:** `GET`
- **Request Body:** None
- **Response (200 OK):**
  ```json
  {
    "drinks": [
      { "name": "Coke", "price": 10, "quantity": 9, "slot": "A1" },
      { "name": "Pepsi", "price": 25, "quantity": 10, "slot": "A2" }
      // ... more drinks
    ],
    "coins": 120,
    "cash": 200
  }
  ```

### 2. Buy a Drink

Allows purchasing a drink from a specified slot with a given payment amount.

- **URL:** `/api/buy`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "slot": "A1", // Required: The slot identifier of the drink to purchase (e.g., "A1", "B2")
    "paymentAmount": 20 // Required: The total amount paid by the user (number)
  }
  ```
- **Response (200 OK - Success):**
  ```json
  {
    "success": true,
    "message": "You purchased Coke from slot A1. Your change is 10 PHP.",
    "change": 10,
    "purchasedDrink": {
      "name": "Coke",
      "price": 10,
      "quantity": 9, // Updated quantity after purchase
      "slot": "A1"
    }
  }
  ```
- **Response (400 Bad Request - Failure):**
  ```json
  // Example: Invalid slot
  {
    "success": false,
    "message": "Invalid slot: \"Z9\". Slot is required and must be one of the following: A1, A2, B1, B2, C1, C2, D1, D2."
  }
  // Example: Insufficient payment
  {
    "success": false,
    "message": "Payment is not enough. Price: 25 PHP. Paid: 10 PHP.",
    "change": 10
  }
  // Example: Out of stock
  {
    "success": false,
    "message": "Coke (Slot: A1) is out of stock.",
    "change": 10
  }
  // Example: Insufficient change
  {
    "success": false,
    "message": "Vending machine does not have enough change. Please use exact amount or smaller denominations.",
    "change": 50 // Full payment returned
  }
  ```

### 3. Refill Drink Stock

Refills the quantity of a specific drink slot back to its maximum capacity (`10`). Refill is only allowed if the current stock is at or below a predefined threshold (`3`).

- **URL:** `/api/refill`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "slot": "A1" // Required: The slot identifier of the drink to refill
  }
  ```
- **Response (200 OK - Success):**
  ```json
  {
    "success": true,
    "message": "Coke (Slot: A1) refilled. New quantity: 10.",
    "newQuantity": 10,
    "drinkName": "Coke",
    "slot": "A1"
  }
  ```
- **Response (400 Bad Request - Failure):**
  ```json
  // Example: Invalid slot
  {
    "success": false,
    "message": "Invalid slot: \"Z9\". Slot is required and must be one of the following: A1, A2, B1, B2, C1, C2, D1, D2."
  }
  // Example: Stock above threshold
  {
    "success": false,
    "message": "Pepsi (Slot: A2) current stock (5) is above refill threshold (3)."
  }
  ```

## Running Tests

To execute the unit and integration tests:

```bash
npm test
```
