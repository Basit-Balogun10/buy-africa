import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { FilterQuery, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import Order, { IOrder } from '../../models/order.js';
import Product, { IProduct } from '../../models/product.js';
import Cart, { ICart } from '../../models/cart.js';
import { OrderService } from '../../services/order.js';
import { IAuthenticatedRequest } from '../../middleware/authMiddleware.js';
import {
  AccountRole,
  OrderStatus,
} from '../../types/index.js';

export const getOrders = asyncHandler(async (req: IAuthenticatedRequest, res: Response) => {
  const {
    buyer,
    searchQuery,
    minTotal,
    maxTotal,
    sortBy,
    order = 'desc',
    cursor,
    limit = 20,
    datePreset,
    startDate,
    endDate,
  } = JSON.parse(req.query.options as string);

  if (!buyer) {
    res.status(400).json({ error: 'Invalid Request. Please provide a buyer' });
    return;
  }

  const parsedLimit = parseInt(limit as string, 10);

  const filter: FilterQuery<IOrder> = {
    ...(buyer && { buyer: new Types.ObjectId(buyer as string) }),
  };

  // Build filters based on the provided query parameters
  if (minTotal || maxTotal) {
    const totalFilter = [];
    if (minTotal) {
      totalFilter.push({ total: { $gte: minTotal } });
    }
    if (maxTotal) {
      totalFilter.push({ total: { $lte: maxTotal } });
    }
    if (filter.$or) {
      filter.$or = [...totalFilter, ...filter.$or];
    } else {
      filter.$or = totalFilter;
    }
  }

  // Filter by date preset
  if (datePreset) {
    const now = new Date();
    switch (datePreset) {
      case 'today':
        filter.createdAt = {
          $gte: new Date(now.setHours(0, 0, 0, 0)),
          $lte: new Date(now.setHours(23, 59, 59, 999)),
        };
        break;
      case 'last24Hours':
        filter.createdAt = {
          $gte: new Date(now.setHours(now.getHours() - 24)),
        };
        break;
      case 'last3Days':
        filter.createdAt = {
          $gte: new Date(now.setDate(now.getDate() - 3)),
        };
        break;
      case 'thisWeek':
        filter.createdAt = {
          $gte: new Date(now.setDate(now.getDate() - now.getDay())),
          $lte: new Date(now.setDate(now.getDate() - now.getDay() + 6)),
        };
        break;
      case 'lastWeek':
        filter.createdAt = {
          $gte: new Date(now.setDate(now.getDate() - now.getDay() - 7)),
          $lte: new Date(now.setDate(now.getDate() - now.getDay())),
        };
        break;
      case '2WeeksAgo':
        filter.createdAt = {
          $gte: new Date(now.setDate(now.getDate() - now.getDay() - 14)),
          $lte: new Date(now.setDate(now.getDate() - now.getDay() - 7)),
        };
        break;
      case 'thisMonth':
        filter.createdAt = {
          $gte: new Date(now.setDate(1)),
          $lte: new Date(now.setMonth(now.getMonth() + 1, 0)),
        };
        break;
      case 'lastMonth':
        filter.createdAt = {
          $gte: new Date(now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear(), now.getMonth() === 0 ? 11 : now.getMonth() - 1, 1),
          $lte: new Date(now.getMonth() === 0 ? now.getFullYear() : now.getFullYear(), now.getMonth() === 0 ? 0 : now.getMonth(), 0),
        };
        break;
      case 'thisQuarter':
        filter.createdAt = {
          $gte: new Date(now.setMonth(now.getMonth() - (now.getMonth() % 3), 1)),
          $lte: new Date(now.setMonth(now.getMonth() - (now.getMonth() % 3) + 3, 0)),
        };
        break;
      case 'last6Months':
        filter.createdAt = {
          $gte: new Date(now.setMonth(now.getMonth() - 6)),
        };
        break;
      case 'thisYear':
        filter.createdAt = {
          $gte: new Date(now.setMonth(0, 1)),
          $lte: new Date(now.setMonth(11, 31)),
        };
        break;
      case 'lastYear':
        filter.createdAt = {
          $gte: new Date(now.setFullYear(now.getFullYear() - 1, 0, 1)),
          $lte: new Date(now.setFullYear(now.getFullYear(), 0, 0)),
        };
        break;
      default:
        break;
    }
  }

  // Filter by date range
  if (startDate && endDate) {
    filter.createdAt = {
      $gte: new Date(startDate as string),
      $lte: new Date(endDate as string),
    };
  }

  if (searchQuery) {
    const searchRegex = new RegExp(searchQuery as string, 'i');

    filter.$or = [
      ...(filter.$or || []),
      ...(buyer
        ? [
            { _id: { $regex: searchRegex } },
            { 'store.name': { $regex: searchRegex } },
            { 'vendor.businessName': { $regex: searchRegex } },
            { 'items.product.name': { $regex: searchRegex } },
          ]
        : []),
    ];
  }

  if (cursor) {
    const [createdAtString, idString] = (cursor as string).split('_');
    const createdAt = new Date(createdAtString);
    const id = new Types.ObjectId(idString);
    filter.$or = [...(filter.$or || []), { createdAt: { $lt: createdAt } }, { createdAt, _id: { $lt: id } }];
  }

  const sortCriteria: { [key: string]: 'asc' | 'desc' } = {
    createdAt: order === 'desc' ? 'desc' : 'asc',
    _id: order === 'desc' ? 'desc' : 'asc',
  };

  if (sortBy) {
    sortCriteria[sortBy as string] = order === 'desc' ? 'desc' : 'asc';
  }

  try {
    const orders = await Order.find(filter)
      .populate([
        { path: 'buyer', populate: { path: 'account' } },
      ])
      .sort(sortCriteria)
      .limit(parsedLimit + 1)
      .lean()
      .exec();

    const hasMore = orders.length > parsedLimit;
    const nextCursor = hasMore && `${orders[parsedLimit]?.createdAt?.toISOString()}_${orders[parsedLimit]._id.toString()}`;

    res.json({ orders: hasMore ? orders.slice(0, -1) : orders, nextCursor });
  } catch (error) {
    console.error('Unable to get orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export const createOrder = asyncHandler(async (req: IAuthenticatedRequest, res: Response) => {
  const { cartId, productId } = req.body;

  // check if request body contains userEmail, pickupCoordinates and deliveryCoordinates
  if (!cartId || !productId) {
    res.status(400).json({ error: 'Invalid Request. Please provide the cart Id or product ID' });
  }

  try {
    const { cartId, productId, ...orderDetails } = req.body;
    let updatedOrderDetails: Partial<IOrder>;
    let cart: ICart | null = null;
    let product: IProduct| null = null;

    if (productId) {
        product = await Product.findById(productId);

        if (!product) {
          res.status(404).json({ error: 'Product not found' });
        }
    } else if (cartId) {
        cart = await Cart.findById(cartId);

        if (!cart) {
            res.status(404).json({ error: "Cart not found" });
        }
    }

    updatedOrderDetails = {
        ...orderDetails,
        buyer: req!.user!._id,
        ...(cart ? { cart: cart._id } : {}),
        ...(product ? { product: product._id } : {}),
        transactionId: uuidv4(),
        status: OrderStatus.RECEIVED,
    };

    const newOrder = await OrderService.createOrder(updatedOrderDetails);

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Unable to create order: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const orderId = req.params?.orderId;

  if (!orderId) {
    res.status(400).json({ error: 'Invalid Request. Please provide order ID' });
  }

  try {
    const order = await OrderService.getOrderById(orderId);

    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    console.error('Unable to get order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export const updateOrder = asyncHandler(async (req: IAuthenticatedRequest, res: Response) => {
  const orderId = req.params?.orderId;
  const updatedFields: Partial<IOrder> = req.body;

  if (!orderId || !updatedFields) {
    res.status(400).json({ error: 'Invalid Request. Please provide order ID and the updated Fields' });
  }

  try {
    const order = await OrderService.getOrderById(orderId);

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    } else if (order.currentStatus === OrderStatus.CANCELLED) {
      res.status(403).json({ errorMsg: `Order has been cancelled by the ${AccountRole.BUYER}`, orderAlreadyCancelled: true });
    }

    const { currentStatus } = updatedFields;

    const updatedOrder = await OrderService.updateOrder(orderId, updatedFields);

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Unable to update order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});