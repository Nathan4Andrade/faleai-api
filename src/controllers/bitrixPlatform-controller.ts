import { Response } from "express";
import httpStatus from "http-status";
import { bitrixPlatformServices, userService } from "@/services";
import { AuthenticatedRequest } from "@/middlewares";

export async function createOrUpdateBitrixPlatform(
  req: AuthenticatedRequest,
  res: Response
) {
  const { url } = req.body;
  const { userId } = req;

  const bitrixPlatform =
    await bitrixPlatformServices.createOrUpdateBitrixPlatform(url, userId);

  return res.status(httpStatus.OK).send(bitrixPlatform);
}

export async function getMyBitrixData(
  req: AuthenticatedRequest,
  res: Response
) {
  const { userId } = req;

  const bitrixData = await bitrixPlatformServices.getMyBitrixData(userId);

  return res.status(httpStatus.OK).send(bitrixData);
}
