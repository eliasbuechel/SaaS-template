export interface ITenant {
    id: string;
    shopifyStoreDomain: string;
    shopifyAccessToken: string;
    userId: string;
    createdAt: Date;
    updatedAt?: Date;
}