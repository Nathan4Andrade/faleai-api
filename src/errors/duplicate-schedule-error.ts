import { ApplicationError } from "@/protocols";

export function duplicateScheduleError(): ApplicationError {
  return {
    name: "DuplicateScheduleError",
    message: "There is already a schedule registered with this data",
  };
}
