import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { unauthorizedError } from "@/errors";
import { authenticationRepository, userRepository } from "@/repositories";

export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.header("Authorization");
  if (!authHeader) throw unauthorizedError();

  const token = authHeader.split(" ")[1];
  if (!token) throw unauthorizedError();

  const { userId } = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;

  const session = await authenticationRepository.findSession(token);
  if (!session) throw unauthorizedError();

  const user = await userRepository.findUserById(userId);

  req.userId = user.id;

  next();
}

export type AuthenticatedRequest = Request & JWTPayload & RolePayload;

type JWTPayload = {
  userId: number;
};

type RolePayload = {
  role: string;
};