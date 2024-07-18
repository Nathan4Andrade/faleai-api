import OpenAI from "openai";
import { MessageContent } from "openai/resources/beta/threads/messages";

const configuration = {
  apiKey: process.env.OPENAI_API_KEY,
};
const openai = new OpenAI(configuration);

// async function createCompletion(
//   prompt: string,
//   message: string
// ): Promise<string> {
//   try {
//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         { role: "system", content: prompt },
//         { role: "user", content: message },
//       ],
//     });
//     return response.choices[0].message.content || "";
//   } catch (error) {
//     console.log(error);
//   }
// }

async function createAssistant(
  name: string,
  description: string,
  prompt: string
): Promise<string> {
  try {
    const response = await openai.beta.assistants.create({
      instructions: prompt,
      name: name,
      tools: [],
      description: description,
      model: "gpt-4-turbo",
    });

    const assistantId = response.id;
    return assistantId;
  } catch (error) {
    console.log(error);
  }
}

async function createThread(): Promise<string> {
  const emptyThread = await openai.beta.threads.create();
  return emptyThread.id;
}

async function createMessage(
  threadId: string,
  message: string
): Promise<string> {
  const newMessage = await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: message,
  });

  return newMessage.id;
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function createRun(
  threadId: string,
  assisId: string,
  timeout: number = 60000,
  interval: number = 5000
): Promise<string> {
  let run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assisId,
  });

  const startTime = Date.now();

  while (run.status !== "completed") {
    if (Date.now() - startTime > timeout) {
      throw new Error("Timeout waiting for the run to complete");
    }

    console.log(`Current status: ${run.status}`);
    await sleep(interval); // Aguarde antes de verificar novamente

    try {
      run = await openai.beta.threads.runs.retrieve(threadId, run.id); // Atualize o status do run
    } catch (error) {
      console.error("Error fetching run status:", error);
      throw new Error("Failed to fetch run status");
    }
  }

  // Quando o status for "completed", liste as mensagens
  const messages = await openai.beta.threads.messages.list(run.thread_id);
  for (const message of messages.data.reverse()) {
    // @ts-ignore
    console.log(message.content[0].text.value);
  }

  return run.id;
}

async function listMessages(threadId: string): Promise<MessageType[]> {
  const threadMessages = await openai.beta.threads.messages.list(threadId);

  let messages: MessageType[] = [];

  for (const message of threadMessages.data) {
    const messageContent: MessageType = {
      id: message.id,
      role: message.role,
      // @ts-ignore
      content: message.content[0].text.value,
    };

    messages.push(messageContent);
  }

  return messages;
}

export type MessageType = {
  id: string;
  role: string;
  content: any;
};

async function createThreadAndRun(assisId: string, message: string) {
  const run = await openai.beta.threads.createAndRun({
    assistant_id: assisId,
    thread: {
      messages: [{ role: "user", content: message }],
    },
  });

  const runResponse = {
    runId: run.id,
    threadId: run.thread_id,
  };
  return runResponse;
}

export const openaiRepository = {
  // createCompletion,
  createAssistant,
  createThreadAndRun,
  createThread,
  createMessage,
  createRun,
  listMessages,
};
