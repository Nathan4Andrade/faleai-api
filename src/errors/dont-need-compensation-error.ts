import { ApplicationError } from "@/protocols";

export function dontNeedCompensationError(): ApplicationError {
  return {
    name: "DontNeedCompensationError",
    message: "Employee does not need to compensate this day!",
  };
}
