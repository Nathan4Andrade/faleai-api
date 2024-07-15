import { ApplicationError } from "@/protocols";

export function duplicateDepartmentError(): ApplicationError {
  return {
    name: "DuplicateDepartmentError",
    message: "There is already a department registered with this data",
  };
}
