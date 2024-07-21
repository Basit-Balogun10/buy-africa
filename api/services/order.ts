import Order, { IOrder } from "../models/order.js";

export class OrderService {
    static async createOrder(order: Partial<IOrder>) {
        return await Order.create({
            ...order,
        });
    }

    static async getOrderById(orderId: string) {
        return await Order.findById(orderId).populate([
            { path: "buyer", populate: { path: "account" } },
            { path: "store", populate: { path: "account" } },
            { path: "vendor", populate: { path: "account" } },
        ]);
    }

    static async getOrders(userEmail: string) {
        return await Order.find({ userEmail });
    }

    static async updateOrder(orderId: string, updatedFields: Partial<IOrder>) {
        return await Order.findByIdAndUpdate(
            orderId,
            { $set: updatedFields },
            { new: true }
        );
    }
}
