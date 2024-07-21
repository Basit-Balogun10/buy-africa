import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { FilterQuery, PipelineStage, Types } from "mongoose";
import { IAuthenticatedRequest } from "../../middleware/authMiddleware.js";
import { ProductService } from "../../services/product.js";
import Product, { IProduct } from "../../models/product.js";

export const createProduct = asyncHandler(
    async (req: Request, res: Response) => {
        const product = req.body as IProduct;

        if (!product) {
            res.status(400).json({
                error: "Invalid request. Please provide the product details",
            });
            return;
        }

        try {
            const newProduct = await ProductService.createProduct(product);

            res.status(201).json(newProduct);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Unable to create product" });
        }
    }
);

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params;

    if (!productId) {
        res.status(400).json({
            error: "Invalid request. Please provide product ID",
        });
    }

    try {
        const product = await ProductService.getProductById(productId);

        res.status(200).json({ product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unable to get product" });
    }
});

export const getProducts = asyncHandler(
    async (req: IAuthenticatedRequest, res: Response) => {
        const {
            category,
            vendorId,
            storeId,
            searchQuery,
            minPrice,
            maxPrice,
            sortBy,
            order = "order",
            excludeUnavailable,
            isForBuyer,
            cursor,
            limit = 20,
            isRefresh,
        } = JSON.parse(req.query.options as string);
        const parsedLimit = parseInt(limit as string, 10);

        const filter: FilterQuery<IProduct> = {};

        // Filter by category
        if (category) {
            filter.category = category as string;
        }

        // Filter by vendor
        if (vendorId) {
            filter.vendor = new Types.ObjectId(vendorId as string);
        }

        // Filter by store
        if (storeId) {
            filter.market = new Types.ObjectId(storeId as string);
        }

        // Filter by price (pricePerUnit, minPriceOfVariants, and maxPriceOfVariants)
        if (minPrice || maxPrice) {
            const priceFilter = [];

            if (minPrice) {
                priceFilter.push(
                    { pricePerUnit: { $exists: true, $gte: minPrice } },
                    { maxPriceOfVariants: { $exists: true, $gte: minPrice } }
                );
            }

            if (maxPrice) {
                priceFilter.push(
                    { pricePerUnit: { $exists: true, $lte: maxPrice } },
                    { minPriceOfVariants: { $exists: true, $lte: maxPrice } }
                );
            }

            if (filter.$or) {
                filter.$or = [...priceFilter, ...filter.$or];
            } else {
                filter.$or = priceFilter;
            }
        }

        // Search through aliases, name, and shortDesc
        if (searchQuery) {
            const searchRegex = new RegExp(searchQuery as string, "i");
            filter.$or = [
                ...(filter.$or || []),
                { aliases: { $regex: searchRegex } },
                { name: { $regex: searchRegex } },
                { shortDesc: { $regex: searchRegex } },
            ];
        }

        // Filter by availability
        if (excludeUnavailable) {
            filter.isAvailable = true;
            filter.$or = [
                ...(filter.$or || []),
                { "farmer.isOnline": true },
                { "vendor.isOnline": true },
            ];
        }

        if (isForBuyer) {
            
        }

        if (cursor) {
            const [createdAtString, idString] = (cursor as string).split("_");
            const createdAt = new Date(createdAtString);
            const id = new Types.ObjectId(idString);

            filter.$or = [
                ...(filter.$or || []),
                { createdAt: { $lt: createdAt } },
                { createdAt, _id: { $lt: id } },
            ];
        }

        const sortCriteria: { [key: string]: -1 | 1 } = {};

        // Always sort by rating in the specified order
        sortCriteria.rating = order === "desc" ? -1 : 1;

        // If sortBy is 'price', also sort by pricePerUnit and variants.price
        if (sortBy === "price") {
            sortCriteria.pricePerUnit = order === "desc" ? -1 : 1;
            sortCriteria.maxPriceOfVariants = order === "desc" ? -1 : 1;
        }

        const aggregationStages: PipelineStage[] = [{ $match: filter }];

        if (isRefresh) {
            aggregationStages.push({ $sample: { size: parsedLimit + 1 } });
        } else {
            aggregationStages.push({ $limit: parsedLimit + 1 });
        }

        aggregationStages.push(
            {
                $lookup: {
                    from: "stores",
                    localField: "store",
                    foreignField: "_id",
                    as: "store",
                },
            },
            { $unwind: { path: "$market", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "vendors",
                    localField: "vendor",
                    foreignField: "_id",
                    as: "vendor",
                },
            },
            { $unwind: { path: "$vendor", preserveNullAndEmptyArrays: true } },
            { $sort: { ...sortCriteria, createdAt: -1, _id: -1 } }
        );

        try {
            const products = await Product.aggregate(aggregationStages).exec();

            const hasMore = products.length > parsedLimit;
            const nextCursor = hasMore
                ? `${products[
                      parsedLimit
                  ]?.createdAt?.toISOString()}_${products[
                      parsedLimit
                  ]._id.toString()}`
                : null;

            console.log("products: ", products);
            res.json({
                products: hasMore ? products.slice(0, -1) : products,
                nextCursor,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Unable to get products" });
        }
    }
);

export const updateProduct = asyncHandler(
    async (req: Request, res: Response) => {
        const { productId } = req.params;
        const updatedFields = req.body;

        if (!productId || !updatedFields) {
            res.status(400).json({
                error: "Invalid request. Please provide product ID and the updated fields",
            });
            return;
        }
        try {
            const product = await Product.findById(productId);

            if (!product) {
                res.status(404).json({
                    error: "Product with the provided ID not found",
                });
                return;
            }

            const updatedProduct = await ProductService.updateProduct(
                productId,
                updatedFields,
                product
            );

            res.status(200).json(updatedProduct);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Unable to update product" });
        }
    }
);

export const deleteProduct = asyncHandler(
    async (req: Request, res: Response) => {
        const { productId } = req.params;

        if (!productId) {
            res.status(400).json({
                error: "Invalid request. Please provide product ID",
            });
        }

        try {
            await ProductService.deleteProductById(productId);

            res.status(204).end();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Unable to delete product" });
        }
    }
);
