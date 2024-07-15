import OpenAI from "openai";

const configuration = {
  apiKey: process.env.OPENAI_API_KEY,
};
const openai = new OpenAI(configuration);

async function createCompletion(
  prompt: string,
  message: string
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: message },
      ],
    });
    return response.choices[0].message.content || "";
  } catch (error) {
    console.log(error);
  }
}

export const openaiRepository = {
  createCompletion,
};
