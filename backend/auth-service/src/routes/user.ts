import express, {Request, Response, Router} from "express";
import {verifyUser} from "../middleware/verifyUser";
import {logRequests} from "../middleware/logRequests";
import User from "../types/User";
import {mapUserToFrontend} from "../lib/mapper";

const userRouter: Router = express.Router();

userRouter.get("/", logRequests, verifyUser, async (req: Request, res: Response): Promise<void> => {
    const user: User = mapUserToFrontend(req.user);
    res.json(user);
});

export default userRouter;