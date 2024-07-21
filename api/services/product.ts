import Product, { IProduct } from "../models/product.js";
import { ProductVariant } from "../types/index.js";
import {
    CloudinaryPublicIDSuffix,
    CloudinaryService,
} from "./third-party/cloudinary.js";

export class ProductService {
    static async createProduct(product: IProduct) {
        const newProduct = await Product.create(product);

        // Upload product's defaultImageURL to Cloudinary
        const productImageUploadResponse = await CloudinaryService.uploadImage(
            newProduct.defaultImageURL,
            {
                display_name: newProduct.name,
                public_id: `${newProduct._id}_${CloudinaryPublicIDSuffix.PRODUCT_IMAGE}`,
                folder: "product-images",
            }
        );

        newProduct.defaultImageURL = productImageUploadResponse.secure_url;

        // Check newProduct.variants and upload each variant's imageURL to Cloudinary
        if (
            newProduct.hasVariants &&
            newProduct.variants &&
            newProduct?.variants?.length > 0
        ) {
            newProduct?.variants?.forEach(async (variant, i) => {
                const variantImageUploadResponse =
                    await CloudinaryService.uploadImage(variant.imageURL, {
                        display_name: `${newProduct.name}-${variant.name}`,
                        public_id: `${newProduct._id}_${variant._id}_${CloudinaryPublicIDSuffix.PRODUCT_VARIANT_IMAGE}`,
                        folder: "product-variant-images",
                    });

                if (newProduct.variants) {
                    newProduct.variants[i].imageURL =
                        variantImageUploadResponse.secure_url;
                }
            });
        }

        await newProduct.save();
        return newProduct;
    }

    static async getProductById(productId: string) {
        return await Product.findById(productId).populate([
            "store",
            "vendor",
        ]);
    }

    static async getProducts(count: number, random: boolean) {
        if (random) {
            return await Product.aggregate([{ $sample: { size: count } }]);
        } else {
            return await Product.find({})
                .populate(["store", "vendor"])
                .limit(count);
        }
    }

    static async getProductsByVendorId(vendorId: string) {
        return await Product.find({ vendor: vendorId });
    }

    static async getProductsByMarketId(marketId: string) {
        return await Product.find({ market: marketId });
    }

    // static async updateProduct(
    //     productId: string,
    //     updatedFields: Partial<IProduct>,
    //     productToUpdate: IProduct
    // ) {
    //     // Check if defaultImageURL has changed
    //     if (
    //         updatedFields.defaultImageURL &&
    //         updatedFields.defaultImageURL !== productToUpdate.defaultImageURL
    //     ) {
    //         const productImageUploadResponse =
    //             await CloudinaryService.uploadImage(
    //                 updatedFields.defaultImageURL,
    //                 {
    //                     display_name: updatedFields.name as string,
    //                     public_id: `${productId}_${CloudinaryPublicIDSuffix.PRODUCT_IMAGE}`,
    //                     folder: "product-images",
    //                 }
    //             );

    //         updatedFields.defaultImageURL =
    //             productImageUploadResponse.secure_url;
    //     }

    //     // Check if variants have changed (added, updated, or deleted)
    //     if (
    //         updatedFields.variants &&
    //         updatedFields?.variants?.length > 0 &&
    //         productToUpdate.hasVariants &&
    //         productToUpdate.variants &&
    //         productToUpdate?.variants?.length > 0
    //     ) {
    //         const productVariantIds = productToUpdate.variants.map(
    //             (variant) => variant._id
    //         );
    //         // Deep compare variants to find added, updated, or deleted variants
    //         // Newly added variants won't have an _id field
    //         const addedVariants = updatedFields?.variants
    //             ?.filter((variant) => !variant._id)
    //             ?.map((variant, index) => ({ ...variant, index }));
    //         const deletedVariants = productToUpdate?.variants?.filter(
    //             (variant) =>
    //                 !updatedFields?.variants
    //                     ?.map((v) => v._id)
    //                     .includes(variant._id)
    //         );
    //         const possiblyUpdatedVariants = updatedFields?.variants?.filter(
    //             (variant) => productVariantIds.includes(variant._id)
    //         );

    //         // Upload added variants' imageURL to Cloudinary
    //         addedVariants?.forEach(async (variant) => {
    //             const variantImageUploadResponse =
    //                 await CloudinaryService.uploadImage(variant.imageURL, {
    //                     display_name: `${productToUpdate.name}-${variant.name}`,
    //                     public_id: `${productId}_${variant._id}_${CloudinaryPublicIDSuffix.PRODUCT_VARIANT_IMAGE}`,
    //                     folder: "product-variant-images",
    //                 });

    //             if (updatedFields.variants) {
    //                 updatedFields.variants[variant.index].imageURL =
    //                     variantImageUploadResponse.secure_url;
    //             }
    //         });

    //         // Delete deleted variants' imageURL from Cloudinary
    //         deletedVariants?.forEach(async (variant) => {
    //             await CloudinaryService.deleteResource(
    //                 `${productId}_${variant._id}_${CloudinaryPublicIDSuffix.PRODUCT_VARIANT_IMAGE}`,
    //                 {
    //                     resource_type: "image",
    //                 }
    //             );
    //         });

    //         // Check if possibly updated variants' imageURL has changed
    //         possiblyUpdatedVariants?.forEach(async (variant, i) => {
    //             if (
    //                 variant.imageURL &&
    //                 variant.imageURL !==
    //                     (productToUpdate?.variants &&
    //                         productToUpdate?.variants[i]?.imageURL)
    //             ) {
    //                 const variantImageUploadResponse =
    //                     await CloudinaryService.uploadImage(variant.imageURL, {
    //                         display_name: `${productToUpdate.name}-${variant.name}`,
    //                         public_id: `${productId}_${variant._id}_${CloudinaryPublicIDSuffix.PRODUCT_VARIANT_IMAGE}`,
    //                         folder: "product-variant-images",
    //                     });

    //                 const updatedVariant: ProductVariant | undefined =
    //                     updatedFields?.variants?.find(
    //                         (v) => v._id === variant._id
    //                     );
    //                 if (updatedVariant) {
    //                     updatedVariant.imageURL =
    //                         variantImageUploadResponse.secure_url;
    //                 }
    //             }
    //         });
    //     }

    //     return await Product.findByIdAndUpdate(
    //         productId,
    //         { $set: updatedFields },
    //         { new: true }
    //     );
    // }

    // static async deleteProductById(productId: string) {
    //     // Delete product's defaultImageURL from Cloudinary
    //     await CloudinaryService.deleteResource(
    //         `${productId}_${CloudinaryPublicIDSuffix.PRODUCT_IMAGE}`,
    //         { resource_type: "image" }
    //     );

    //     // Delete product's variants' imageURL from Cloudinary (if it has variants)
    //     const product = await Product.findById(productId);
    //     if (
    //         product &&
    //         product.hasVariants &&
    //         product.variants &&
    //         product.variants.length > 0
    //     ) {
    //         product?.variants?.forEach(async (variant) => {
    //             await CloudinaryService.deleteResource(
    //                 `${productId}_${variant._id}_${CloudinaryPublicIDSuffix.PRODUCT_VARIANT_IMAGE}`,
    //                 {
    //                     resource_type: "image",
    //                 }
    //             );
    //         });

    //         return await product.deleteOne();
    //     }
    // }

    // static async deleteProductsByIds(productIds: IProduct[]) {
    //     // Delete products' defaultImageURLs from Cloudinary
    //     const productImagePublicIDs = productIds.map(
    //         (productId) =>
    //             `${productId}_${CloudinaryPublicIDSuffix.PRODUCT_IMAGE}`
    //     );

    //     productImagePublicIDs.forEach(async (publicId) => {
    //         await CloudinaryService.deleteResource(publicId, {
    //             resource_type: "image",
    //         });
    //     });

    //     // Delete products' variants' imageURLs from Cloudinary (if they have variants) - then delete the product
    //     const products = await Product.find({ _id: { $in: productIds } });

    //     products.forEach(async (product) => {
    //         if (
    //             product &&
    //             product.hasVariants &&
    //             product.variants &&
    //             product?.variants?.length > 0
    //         ) {
    //             product?.variants?.forEach(async (variant) => {
    //                 await CloudinaryService.deleteResource(
    //                     `${product._id}_${variant._id}_${CloudinaryPublicIDSuffix.PRODUCT_VARIANT_IMAGE}`,
    //                     {
    //                         resource_type: "image",
    //                     }
    //                 );
    //             });
    //         }

    //         await product.deleteOne();
    //     });
    // }
}
