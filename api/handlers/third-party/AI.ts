import { Response } from "express";
import asyncHandler from "express-async-handler";
import { IAuthenticatedRequest } from "../../middleware/authMiddleware.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AppConfig } from "../../config/index.js";

// Import handlers
import {
    createProduct,
    getProduct,
    getProducts,
} from "../../handlers/product/index.js";

import {
    createCart,
    getCarts,
    getCart,
    updateCart,
} from "../../handlers/cart/index.js";

import {
    createOrder,
    getOrders,
    getOrder,
    updateOrder,
} from "../../handlers/order/index.js";

// Initialize Gemini API (replace with your actual API key)
const genAI = new GoogleGenerativeAI(AppConfig.GEMINI_API_KEY);

const SYSTEM_PROMPT = `
You are an AI assistant tasked with generating appropriate API request objects based on user input. Here are the available routes and their functions:

Products:
1. GET /api/v1/products: Retrieve a list of products
2. GET /api/v1/products/:id: Retrieve a specific product
3. POST /api/v1/products: Create a new product
4. PUT /api/v1/products/:id: Update a specific product
5. DELETE /api/v1/products/:id: Delete a specific product

Orders:
6. GET /api/v1/orders: Retrieve a list of orders
7. GET /api/v1/orders/:id: Retrieve a specific order
8. POST /api/v1/orders: Create a new order
9. PUT /api/v1/orders/:id: Update a specific order
10. DELETE /api/v1/orders/:id: Delete a specific order

Carts:
11. GET /api/v1/carts: Retrieve the current user's cart
12. POST /api/v1/carts: Create a new cart or add item to cart
13. PUT /api/v1/carts/:itemId: Update a specific item in the cart
14. DELETE /api/v1/carts/:itemId: Remove a specific item from the cart
15. DELETE /api/v1/carts: Clear the entire cart

Based on the user's input, generate a JSON object representing the appropriate API request. The object should include:
- method: The HTTP method (GET, POST, PUT, DELETE)
- route: The appropriate route from the list above
- params: Any URL parameters (if applicable)
- query: Any query parameters (if applicable)
- body: The request body (if applicable)

Respond ONLY with the JSON object, nothing else.
`;

// Function to get the appropriate handler
const getHandler = (method: string, route: string) => {
    const routeMap: { [key: string]: Function } = {
        "GET /api/v1/products": getProducts,
        "GET /api/v1/products/:id": getProduct,
        "POST /api/v1/products": createProduct,

        "GET /api/v1/orders": getOrders,
        "GET /api/v1/orders/:id": getOrder,
        "POST /api/v1/orders": createOrder,
        "PUT /api/v1/orders/:id": updateOrder,

        "GET /api/v1/carts": getCarts,
        "GET /api/v1/carts/:id": getCart,
        "POST /api/v1/carts": createCart,
        "PUT /api/v1/carts/:id": updateCart,
    };

    const key = `${method} ${route}`;
    return routeMap[key];
};

export const converseWithAI = asyncHandler(
    async (req: IAuthenticatedRequest, res: Response) => {
        try {
            const userInput = req.body.message;

            // Generate request object using Gemini
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent([
                SYSTEM_PROMPT,
                userInput,
            ]);
            const generatedRequestText = result.response.text();

            // Parse the generated request object
            let generatedRequest;
            try {
                generatedRequest = JSON.parse(generatedRequestText);
            } catch (parseError) {
                throw new Error("Invalid JSON response from AI");
            }

            // Validate the generated request object
            if (!generatedRequest.method || !generatedRequest.route) {
                throw new Error("Invalid request object generated by AI");
            }

            // Process the generated request
            const { method, route, params, query, body } = generatedRequest;

            // Get the appropriate handler
            const handler = getHandler(method, route);

            if (!handler) {
                throw new Error(`No handler found for ${method} ${route}`);
            }

            // Create a new request object with the generated data
            const newReq = {
                ...req,
                params,
                query,
                body,
            };

            // Call the handler
            await handler(newReq, res);
        } catch (error) {
            console.error("Error in converseWithAI:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
);
