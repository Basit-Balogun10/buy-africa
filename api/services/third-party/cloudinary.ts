import {
    AdminAndResourceOptions,
    DeliveryType,
    ResourceType,
    UploadApiOptions,
} from "cloudinary";
import { cloudinary } from "../../config/index.js";

export type CloudinaryAssetDeletionOptions = {
    resource_type: ResourceType;
    invalidate?: boolean;
    type?: DeliveryType;
};

export enum CloudinaryPublicIDSuffix {
    COVER_IMAGE = "cover-image",
    PRODUCT_IMAGE = "product-image",
    PRODUCT_VARIANT_IMAGE = "product-variant-image",
    PROFILE_IMAGE = "profile-image",
}

export enum CloudinaryBulkDeletionMethod {
    DELETE_BY_PREFIX = "prefix",
    DELETE_BY_PUBLIC_IDS = "public_ids",
}

export class CloudinaryService {
    static async uploadImage(file: string, options: UploadApiOptions) {
        const result = await cloudinary.uploader.upload(file, {
            display_name: options.display_name,
            folder: options.folder,
            public_id: options.public_id,
            type: options.type || "authenticated",
        });

        console.log("Cloudinary image upload result: ", result);

        return result;
    }

    
}
