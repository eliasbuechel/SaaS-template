export interface ITenant {
    id: string;
    shopifyStoreDomain: string;
    shopifySessionId: string;
    userId: string;
    createdAt: Date;
    updatedAt?: Date;
}