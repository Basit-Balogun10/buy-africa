import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { ICart } from '../../models/cart.js';
import { CartService } from '../../services/cart.js';
import { IAuthenticatedRequest } from '../../middleware/authMiddleware.js';

export const getCarts = asyncHandler(async (req: IAuthenticatedRequest, res: Response) => {
  console.log("GETTING CARTS...")

  try {
    const carts = await CartService.getCarts(req!.user!._id as string)
      
    res.json(carts);
  } catch (error) {
    console.error('Unable to get carts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


export const createCart = asyncHandler(
    async (req: IAuthenticatedRequest, res: Response) => {
        const { cartInfo } = req.body;

        if (!cartInfo) {
            res.status(400).json({
                error: "Invalid Request. Please provide the cartInfo",
            });
        }

        try {
            const updatedCartInfo = {
                ...cartInfo,
                owner: req.account!.id,
            };

            const newCart = await CartService.createCart(updatedCartInfo);

            res.status(201).json(newCart);
        } catch (error) {
            console.error("Unable to create cart: ", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
);


export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const cartId = req.params?.cartId;

  if (!cartId) {
    res.status(400).json({ error: 'Invalid Request. Please provide cart ID' });
  }

  try {
    const cart = await CartService.getCartById(cartId);

    if (cart) {
      res.status(200).json(cart);
    } else {
      res.status(404).json({ error: 'Cart not found' });
    }
  } catch (error) {
    console.error('Unable to get cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export const updateCart = asyncHandler(async (req: IAuthenticatedRequest, res: Response) => {
  const cartId = req.params?.cartId;
  const updatedFields: Partial<ICart> = req.body;

  if (!cartId || !updatedFields) {
    res.status(400).json({ error: 'Invalid Request. Please provide cart ID and the updated Fields' });
  }

  try {
    const cart = await CartService.getCartById(cartId);

    if (!cart) {
      res.status(404).json({ error: 'Cart not found' });
      return;
    }

    const updatedCart = await CartService.updateCart(cartId, updatedFields);

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error('Unable to update cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});