import { Request, Response } from "express";
import { chatbotService } from "@/services";
import { AuthenticatedRequest } from "@/middlewares";

export const createChatbot = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { name, prompt } = req.body;
    const { userId } = req;
    const chatbot = await chatbotService.createChatbot(userId, name, prompt);
    res.status(201).json(chatbot);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getChatbot = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const chatbot = await chatbotService.getChatbot(parseInt(id));
    res.status(200).json(chatbot);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const interactWithChatbot = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { message, threadId } = req.body;
    const response = await chatbotService.interactWithChatbot(
      parseInt(id),
      message,
      threadId ? threadId : ""
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
