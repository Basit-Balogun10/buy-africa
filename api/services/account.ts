import { FilterQuery, Types } from "mongoose";
import Account, { IAccount } from "../models/account";

export class AccountService {
    static async createAccount(account: IAccount) {
        return await Account.create(account);
    }

    static async getAccountById(accountId: string) {
        return await Account.findById(accountId);
    }

    static async getAccountByEmail(email: string) {
        return await Account.findOne({ email });
    }

    static async getAccountByQuery(filterQuery: FilterQuery<IAccount>) {
        return await Account.findOne(filterQuery);
    }

    static async updateAccount(
        AccountId: string,
        updatedFields: Partial<IAccount>
    ) {
        return await Account.findByIdAndUpdate(
            AccountId,
            { $set: updatedFields },
            { new: true }
        );
    }
}
