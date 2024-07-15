import express from "express";
import { PrismaClient } from "@prisma/client";
import chatbotRoutes from "./routes/chatbot-router";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.use("/api/chatbot", chatbotRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
