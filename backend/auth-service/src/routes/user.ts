import express, {Request, Response, Router} from "express";
import {logRequests} from "@/middleware/logRequests.js";
import {verifyUser} from "@/middleware/verifyUser.js";
import User from "@/types/User.js";
import {mapUserToFrontend} from "@/lib/mapper.js";

const userRouter: Router = express.Router();

userRouter.get("/", logRequests, verifyUser, async (req: Request, res: Response): Promise<void> => {
    const user: User = mapUserToFrontend(req.user);
    res.json(user);
});

export default userRouter;