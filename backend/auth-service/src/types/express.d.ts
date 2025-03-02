import {IUser} from "../interfaces/IUser";
import {ITenant} from "../interfaces/ITenant";

declare module "express-serve-static-core" {
    interface Request {
        user?: IUser;
        tenant?: ITenant;
    }
}