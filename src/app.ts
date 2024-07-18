import "reflect-metadata";
import "express-async-errors";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import { handleApplicationErrors } from "@/middlewares";
import {
  authenticationRouter,
  bitrixPlatformRouter,
  chatbotRouter,
  userRouter,
} from "@/routes";
import { loadEnv, connectDb, disconnectDB } from "@/config";

loadEnv();

const app = express();

app.set("trust proxy", true);

app
  .use(cors())
  .use(express.json())
  .get("/api/health", (_req, res) => res.send("OK!"))
  .use("/api/auth", authenticationRouter)
  .use("/api/bitrix-platform", bitrixPlatformRouter)
  .use("/api/user", userRouter)
  .use("/api/chatbot", chatbotRouter)
  .use(handleApplicationErrors);

export function init(): Promise<Express> {
  connectDb();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectDB();
}

export default app;
