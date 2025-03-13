import {NextFunction, Request, Response} from "express";

export const auth = async (req: Request, res: Response, _next: NextFunction): Promise<void>  => {
    const accessToken: string = req.cookies["access-token"] as string;

    if (!accessToken) {
        res.status(401).send("No token provided");
        return;
    }
};