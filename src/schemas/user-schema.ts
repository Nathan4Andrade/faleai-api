import Joi from "joi";
import { CreateUserParams } from "@/services/user-service";

export const createUserSchema = Joi.object<CreateUserParams>({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const userIdSchema = Joi.object({
  id: Joi.number().required(),
});
