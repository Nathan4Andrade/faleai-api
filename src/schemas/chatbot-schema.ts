import Joi from "joi";
import { CreateChatbotParams } from "@/services";

export const createBotSchema = Joi.object<CreateChatbotParams>({
  name: Joi.string().required(),
  prompt: Joi.string().required(),
});

export const interactWithChatbotSchema = Joi.object({
  message: Joi.string().required(),
  threadId: Joi.string().optional(),
});

export const chatbotIdSchema = Joi.object({
  id: Joi.number().required(),
});
