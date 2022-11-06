import BaseError, { HttpStatusCode } from "@exceptions/BaseError"

export class HTTP400Error extends BaseError {
  constructor(description = "bad request") {
    super("BAD REQUEST", HttpStatusCode.BAD_REQUEST, true, description)
  }
}

export class HTTP404Error extends BaseError {
  constructor(description = "not found") {
    super("NOT FOUND", HttpStatusCode.NOT_FOUND, true, description)
  }
}

export class HTTP401Error extends BaseError {
  constructor(description = "unauthorized") {
    super("UNATHORIZED", HttpStatusCode.UNATHORIZED, true, description)
  }
}

export class HTTP409Error extends BaseError {
  constructor(description = "duplicate") {
    super("CONFLICT", HttpStatusCode.CONFLICT, true, description)
  }
}

export class HTTP500Error extends BaseError {
  constructor(name, isOperational = true, description = "internal server error") {
    super(name, HttpStatusCode.INTERNAL_SERVER, isOperational, description)
  }
}
