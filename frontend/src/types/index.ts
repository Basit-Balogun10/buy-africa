interface MongoDBDocument {
  _id?: string
}

interface MongoDBDocumentWithTimestamps extends MongoDBDocument {
  createdAt?: string
  updatedAt?: string
}

export enum UserRole {
  BUYER = 'buyer',
  VENDOR = 'vendor'
}

export interface IAccount extends MongoDBDocumentWithTimestamps {
  email: string
  name: string
  role: UserRole
}

export enum WelcomePageActiveViewIndex {
  LOGIN,
  VERIFY_AUTH_CODE
}

export interface IBuyer extends MongoDBDocumentWithTimestamps {
  account: string | IAccount
}

export interface IVendor extends MongoDBDocumentWithTimestamps {
  account: string | IAccount
  products: IProduct[]
}

export type IUserFields = Partial<IAccount & MongoDBDocument>

export type User = {
  baseProfile: IUserFields
  profileByRole: IUserFields
  token: string
}

export interface IProduct extends MongoDBDocumentWithTimestamps {
  name: string
  vendor?: string
  store?: string
  aliases: string[]
  preferences: ProductPreference[]
  defaultImageURL: string
  shortDesc: string
  rating: number
  ratingsCount: number
  unit?: string
  pricePerUnit?: number
  hasVariants: boolean
  variants?: ProductVariant[]
  minPriceOfVariants?: number
  maxPriceOfVariants?: number
  longDesc?: string
  isAvailable: boolean
  category: 'Agriculture' | 'Electronics' | 'Pets'
}

export type ProductVariant = {
  _id: string
  imageURL: string
  name: string
  price: number
}

export type ProductPreference = {
  _id: string
  name: string
  price: number
}

export type OrderProductVariant = ProductVariant & {
  quantity: number
}

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
  CANCELLED = 'cancelled'
}
export interface Message {
  role: 'assistant' | 'user'
  content:
    | string
    | Array<{
        source?: {
          type: string
          media_type: string
          data: string
        }
        text?: string
        type: 'image' | 'text'
      }>
}

export enum PaystackPaymentChannels {
  CARD = 'card',
  BANK = 'bank',
  USSD = 'ussd',
  QR = 'qr',
  MOBILE_MONEY = 'mobile_money',
  BANK_TRANSFER = 'bank_transfer',
  EFT = 'eft'
}

export type PaystackPaymentDetails = {
  reference: string
  callback_url: string
  amount: number
  email: string
  channels: PaystackPaymentChannels[]
  metadata: {
    cancel_action: string
  }
}
