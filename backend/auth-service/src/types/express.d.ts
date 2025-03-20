import {IUser} from "@/interfaces/IUser.js";
import {ITenant} from "@/interfaces/ITenant.js";

declare module "express-serve-static-core" {
    interface Request {
        user?: IUser;
        tenant?: ITenant;
    }
}