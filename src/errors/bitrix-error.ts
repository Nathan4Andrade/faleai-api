import { ApplicationError } from "@/protocols";

export function bitrixError(details: string): ApplicationError {
  return {
    name: "BitrixError",
    message: `${details}`,
  };
}
