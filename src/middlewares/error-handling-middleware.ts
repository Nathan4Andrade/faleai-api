import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { ApplicationError, RequestError } from "@/protocols";

export function handleApplicationErrors(
  err: RequestError | ApplicationError | Error,
  _req: Request,
  res: Response,
  next: NextFunction
) {
  if (
    err.name === "LimitRecordsError" ||
    err.name === "PermissionError" ||
    err.name === "NotEnoughExtraHoursError" ||
    err.name === "LimitTeamError"
  ) {
    return res.status(httpStatus.FORBIDDEN).send({
      message: err.message,
    });
  }

  if (
    err.name === "ConflictError" ||
    err.name === "DuplicatedUserError" ||
    err.name === "DuplicateDepartmentError" ||
    err.name === "DuplicateScheduleError" ||
    err.name === "DuplicatePointError"
  ) {
    return res.status(httpStatus.CONFLICT).send({
      message: err.message,
    });
  }

  if (
    err.name === "InvalidCredentialsError" ||
    err.name === "JsonWebTokenError" ||
    err.name === "UnauthorizedError"
  ) {
    return res.status(httpStatus.UNAUTHORIZED).send({
      message: err.message,
    });
  }

  if (
    err.name === "InvalidDataError" ||
    err.name === "ChangeStatusError" ||
    err.name === "DepartmentDeleteError" ||
    err.name === "DeleteScheduleError" ||
    err.name === "BitrixError"
  ) {
    return res.status(httpStatus.BAD_REQUEST).send({
      name: err.name,
      message: err.message,
    });
  }

  if (err.name === "NotFoundError") {
    return res.status(httpStatus.NOT_FOUND).send({
      message: err.message,
    });
  }

  if (err.name === "PaymentError") {
    return res.status(httpStatus.PAYMENT_REQUIRED).send({
      message: err.message,
    });
  }

  if (err.hasOwnProperty("status") && err.name === "RequestError") {
    return res.status((err as RequestError).status).send({
      message: err.message,
    });
  }

  /* eslint-disable-next-line no-console */
  console.error(err);
  res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
    error: "InternalServerError",
    message: "Internal Server Error",
  });
}
