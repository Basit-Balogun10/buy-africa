import { FilterQuery, Types } from "mongoose";
import Account, {
    IAccount,
    IBuyer,
    IUser,
    IVendor,
    Buyer,
    UserModel,
    Vendor,
} from "../models/account.js";
import { AccountRole } from "../types/index.js";

export class AccountService {
    static async createAccount(
        baseProfile: IAccount,
        profileByRole: Partial<IBuyer & IVendor>
    ) {
        const newAccount = await Account.create(baseProfile);

        let newUser: IUser = {} as IUser;

        try {
            if (baseProfile.role === AccountRole.BUYER) {
                newUser = await Buyer.create({
                    account: newAccount._id,
                });
            } else if (baseProfile.role === AccountRole.VENDOR) {
                newUser = await Vendor.create({
                    account: newAccount._id,
                    ...profileByRole,
                    products: [],
                });
            }
        } catch (error) {
            console.error("Unable to create new user by role: ", error);
            await newAccount.deleteOne();

            throw error;
        }

        return { newAccount, newUser };
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

    static async getUserById(
        userRole: AccountRole,
        userId: string
    ): Promise<{ baseProfile: IAccount; profileByRole: IUser } | null> {
        const userModel = this.getUserModelByRole(userRole);
        const user = await (userModel as UserModel)
            .findById(userId)
            .populate("account")
            .lean();

        if (!user) return null;

        const { account, ...rest } = user.toObject();

        return {
            baseProfile: account,
            profileByRole: rest,
        };
    }

    static async getUserByQuery(
        userRole: AccountRole,
        filterQuery: FilterQuery<IUser>
    ) {
        const userModel = this.getUserModelByRole(userRole);
        const user = await (userModel as UserModel)
            .findOne(filterQuery)
            .populate("account");

        if (!user) return null;

        const { account, ...rest } = user.toObject();

        return {
            baseProfile: account,
            profileByRole: rest,
        };
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

    static getUserModelByRole(role: AccountRole) {
        switch (role) {
            case AccountRole.BUYER:
                return Buyer;
            case AccountRole.VENDOR:
                return Vendor;
            default:
                console.error("Invalid account role: ", role);
                throw new Error("Invalid account role");
        }
    }

    static async getAssociatedUserObject(
        account: IAccount
    ): Promise<IUser | null> {
        switch (account.role) {
            case AccountRole.BUYER:
                return await Buyer.findOne({ account: account.id });
            case AccountRole.VENDOR:
                return await Vendor.findOne({ account: account.id });
        }
    }
}
