import { model, Schema } from "mongoose";
import { DocumentWithTimeStamps } from "../types";
export interface IStore extends DocumentWithTimeStamps {
    name: string;
    website: string;
}

const storeSchema = new Schema<IStore>(
    {
        name: { type: String, required: true },
        website: { type: String, required: true },
    },

    { _id: true, timestamps: true }
);

const Store = model<IStore>("Store", storeSchema);

export default Store;
