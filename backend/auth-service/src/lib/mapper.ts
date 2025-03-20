import {ITenant} from "@/interfaces/ITenant.js";
import Tenant from "@/types/Tenant.js";
import {IUser} from "@/interfaces/IUser.js";
import User from "@/types/User.js";

export const mapTenantToFrontend = (tenant: ITenant): Tenant => {
    return {
        id: tenant.id,
        shopifyStoreDomain: tenant.shopifyStoreDomain,
        createdAt: tenant.createdAt.toISOString(),
        updatedAt: tenant.updatedAt ? tenant.updatedAt.toISOString() : undefined
    };
};

export const mapUserToFrontend = (user: IUser): User => {
    return {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
    };
};