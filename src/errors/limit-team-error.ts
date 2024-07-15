import { ApplicationError } from "@/protocols";

export function limitTeamError(): ApplicationError {
  return {
    name: "LimitTeamError",
    message: "The limit of users has been reached for this manager team",
  };
}
