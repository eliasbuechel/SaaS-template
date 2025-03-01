export interface IUser {
    id: string;
    email: string;
    googleId?: string;
    createdAt: Date;
    updatedAt?: Date;
}