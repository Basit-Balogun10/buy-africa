import { Document } from "mongoose";

export type DocumentWithTimeStamps = Document & {
    createdAt: Date;
    updatedAt: Date;
};

export enum AccountRole {
    BUYER = "buyer",
    VENDOR = "vendor",
}

export type ProductVariant = {
    _id: string;
    imageURL: string;
    name: string;
    price: number;
};

export type ProductPreference = {
    _id: string;
    name: string;
    price: number;
};

export type OrderProductVariant = ProductVariant & {
    quantity: number;
};

export enum OrderStatus {
  PENDING = 'pending',
  RECEIVED = 'received',
  PROCESSING = 'processing',
  READY_FOR_PICKUP = 'ready_for_pickup',
  LOOKING_FOR_A_NEW_RIDER = 'looking_for_a_new_rider',
  RIDER_ACCEPTED = 'rider_accepted',
  RIDER_AT_VENDOR = 'rider_at_vendor',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  RIDER_ARRIVED = 'rider_arrived',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaystackPaymentChannels {
    CARD = "card",
    BANK = "bank",
    USSD = "ussd",
    QR = "qr",
    MOBILE_MONEY = "mobile_money",
    BANK_TRANSFER = "bank_transfer",
    EFT = "eft",
}

export type PaystackPaymentDetails = {
    reference: string;
    callback_url: string;
    amount: number;
    email: string;
    channels: PaystackPaymentChannels[];
    metadata: {
        cancel_action: string;
    };
};

export enum PaystackTransferWebhookEvent {
    SUCCESS = "transfer.success",
    FAILED = "transfer.failed",
    REVERSED = "transfer.reversed",
}