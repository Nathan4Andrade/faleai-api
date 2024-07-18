import { Request, Response } from "express";
import httpStatus from "http-status";
import { userService } from "@/services";
import { AuthenticatedRequest } from "@/middlewares";

export async function usersPost(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await userService.createUser(email, password);

  return res.status(httpStatus.CREATED).json({
    id: user.id,
    email: user.email,
  });
}

export async function userGetById(req: Request, res: Response) {
  const { id } = req.params;

  const user = await userService.getUser(Number(id));

  return res.status(httpStatus.OK).json({
    id: user.id,
    email: user.email,
  });
}

export async function userGet(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const user = await userService.getUser(userId);
  return res.status(httpStatus.OK).json(user);
}
