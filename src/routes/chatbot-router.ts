import { Router } from "express";
import {
  createChatbot,
  getChatbot,
  interactWithChatbot,
} from "../controllers/chatbot-controller";
import { authenticateToken, validateBody } from "@/middlewares";
import { createBotSchema } from "@/schemas";

const chatbotRouter = Router();

chatbotRouter
  .all("/*", authenticateToken)
  .post("/create", validateBody(createBotSchema), createChatbot)
  .get("/:id", getChatbot)
  .post("/interact/:id", interactWithChatbot);

export { chatbotRouter };
