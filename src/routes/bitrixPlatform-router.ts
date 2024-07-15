import { Router } from "express";

import { bitrixPlatformSchema } from "@/schemas";
import { authenticateToken, validateBody, validateParams } from "@/middlewares";
import { createOrUpdateBitrixPlatform, getMyBitrixData } from "@/controllers";

const bitrixPlatformRouter = Router();

bitrixPlatformRouter
  .all("/*", authenticateToken)
  .post(
    "/createOrUpdate",
    validateBody(bitrixPlatformSchema),
    createOrUpdateBitrixPlatform
  )
  .get("/getMyData", getMyBitrixData);

export { bitrixPlatformRouter };
