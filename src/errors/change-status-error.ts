import { ApplicationError } from "@/protocols";

export function changeStatusError(details: string): ApplicationError {
  return {
    name: "ChangeStatusError",
    message: `${details}`,
  };
}
