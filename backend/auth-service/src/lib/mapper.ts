import { ITenant } from "../interfaces/ITenant";
import Tenant from "../types/Tenant"
import User from "../types/User";
import {IUser} from "../interfaces/IUser";

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