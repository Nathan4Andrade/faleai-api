import { ApplicationError } from "@/protocols";

export function departmentDeleteError(): ApplicationError {
  return {
    name: "DepartmentDeleteError",
    message: "Department has employees, change them before deleting it.",
  };
}
