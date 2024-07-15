import { ApplicationError } from "@/protocols";

export function limitRecordsError(): ApplicationError {
  return {
    name: "limitRecordsError",
    message: "The limit of records has been reached for this point",
  };
}
