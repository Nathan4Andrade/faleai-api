import { Request, Response } from "express";
import { chatbotService } from "@/services";

export const createChatbot = async (req: Request, res: Response) => {
  try {
    const { name, prompt } = req.body;
    const chatbot = await chatbotService.createChatbot(name, prompt);
    res.status(201).json(chatbot);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getChatbot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const chatbot = await chatbotService.getChatbot(parseInt(id));
    res.status(200).json(chatbot);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const interactWithChatbot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const response = await chatbotService.interactWithChatbot(
      parseInt(id),
      message
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
