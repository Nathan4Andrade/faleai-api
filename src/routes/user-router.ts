import { Router } from "express";

import { createUserSchema } from "@/schemas";
import { validateBody } from "@/middlewares";
import { usersPost } from "@/controllers";

const userRouter = Router();

userRouter.post("/", validateBody(createUserSchema), usersPost);

export { userRouter };
