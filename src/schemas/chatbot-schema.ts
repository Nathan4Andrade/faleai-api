import Joi from "joi";
import { CreateChatbotParams } from "@/services";

export const createBotSchema = Joi.object<CreateChatbotParams>({
  name: Joi.string().required(),
  prompt: Joi.string().required(),
});
