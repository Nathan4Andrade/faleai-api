import { ApplicationError } from "@/protocols";

export function notEnoughExtraHoursError(): ApplicationError {
  return {
    name: "NotEnoughExtraHoursError",
    message: "Employee does not have enough extra hours",
  };
}
