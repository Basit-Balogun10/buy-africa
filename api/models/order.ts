import { model, Schema } from 'mongoose';
import {
  DocumentWithTimeStamps,
  OrderProductVariant,
  ProductPreference,
} from '../types/index.js';
import { IProduct } from "./product.js";
import { IBuyer, IVendor } from './account.js';
import { IStore } from './store.js';

export type OrderItem = {
  isReady?: boolean;
  product: IProduct;
  quantity: number;
  price: number;
  selectedVariants: OrderProductVariant[];
  selectedPreferences: ProductPreference[];
};
export interface IOrder extends DocumentWithTimeStamps {
  buyer: Schema.Types.ObjectId | IBuyer;
  items: OrderItem[];
  serviceFee: number;
  store?: Schema.Types.ObjectId | IStore;
  subTotal: number;
  total: number;
  vendor?: Schema.Types.ObjectId | IVendor;
}

const orderSchema = new Schema<IOrder>(
  {
    buyer: { type: Schema.Types.ObjectId, ref: 'Buyer', required: true },
    items: {
      type: [
        {
          isReady: { type: Boolean, required: false },
          product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
          quantity: { type: Number, required: true },
          price: { type: Number, required: true },
          selectedVariants: {
            type: [
              {
                id: { type: String, required: true },
                imageURL: { type: String, required: true },
                name: { type: String, required: true },
                isReady: { type: Boolean, required: true },
                price: { type: Number, required: true },
                quantity: { type: Number, required: true },
              },
            ],
          },
          selectedPreferences: {
            type: [
              {
                id: { type: String, required: true },
                name: { type: String, required: true },
                isReady: { type: Boolean, required: true },
                price: { type: Number, required: true },
              },
            ],
          },
        },
      ],
      required: true,
    },
    store: { type: Schema.Types.ObjectId, ref: 'Store', required: false },
    serviceFee: { type: Number, required: true },
    subTotal: { type: Number, required: true },
    total: { type: Number, required: true },
    vendor: { type: Schema.Types.ObjectId, ref: 'Vendor', required: false },
  },

  { _id: true, timestamps: true },
);

const Order = model<IOrder>('Order', orderSchema);

export default Order;
