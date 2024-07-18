import { Router } from "express";

import { createUserSchema, userIdSchema } from "@/schemas";
import { validateBody, authenticateToken, validateParams } from "@/middlewares";
import { usersPost, userGetById, userGet } from "@/controllers";

const userRouter = Router();

userRouter
  .post("/", validateBody(createUserSchema), usersPost)
  .all("/*", authenticateToken)
  .get("/:id", validateParams(userIdSchema), userGetById)
  .get("/", userGet);

export { userRouter };
