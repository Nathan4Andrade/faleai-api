import { ApplicationError } from "@/protocols";

export function deleteScheduleError(): ApplicationError {
  return {
    name: "DeleteScheduleError",
    message: "Schedule has employees, change them before deleting it.",
  };
}
