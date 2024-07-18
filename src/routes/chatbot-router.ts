import { Router } from "express";
import {
  createChatbot,
  getChatbot,
  interactWithChatbot,
} from "../controllers/chatbot-controller";
import { authenticateToken, validateBody, validateParams } from "@/middlewares";
import {
  chatbotIdSchema,
  createBotSchema,
  interactWithChatbotSchema,
} from "@/schemas";

const chatbotRouter = Router();

chatbotRouter
  .all("/*", authenticateToken)
  .post("/create", validateBody(createBotSchema), createChatbot)
  .get("/:id", validateParams(chatbotIdSchema), getChatbot)
  .post(
    "/interact/:id",
    validateParams(chatbotIdSchema),
    validateBody(interactWithChatbotSchema),
    interactWithChatbot
  );

export { chatbotRouter };
