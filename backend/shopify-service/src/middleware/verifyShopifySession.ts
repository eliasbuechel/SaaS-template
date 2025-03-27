import { Request, Response, NextFunction } from "express";
import ENV from "@/lib/config/env.js";
import logger from "@/utils/logger.js";
import axios, { AxiosResponse, HttpStatusCode } from "axios";
import { Session } from "@shopify/shopify-api";
import { setResponseWithErrorLog } from "@/utils/messageHandling.js";
import "@shopify/shopify-api/adapters/node";

export const verifyShopifySession = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response: AxiosResponse = await axios.get(
      `${ENV.INTERNAL_AUTH_SERVICE_URL}/api/auth/shopify/session`,
      {
        headers: {
          Authorization: `Bearer ${ENV.INTERNAL_AUTH_COMMUNICATION_SECRET}`,
          Cookie: req.headers.cookie || "",
        },
      },
    );

    if (response.status !== HttpStatusCode.Ok) {
      logger.error(
        `Error while retrieving shopify session. Received response status ${response.status}`,
      );
      return undefined;
    }

    const sessionData = response.data;
    logger.debug(`Received session data: ${sessionData}`);
    const session = new Session(sessionData.id);
    Object.assign(session, sessionData);

    if (!session) throw Error("Not able to create Session with sessionData.");

    req.shopifySession = session;
    next();
  } catch (error) {
    setResponseWithErrorLog(
      res,
      500,
      "Internal server error.",
      "Error while retrieving shopify session.",
      error,
    );
    return;
  }
};
