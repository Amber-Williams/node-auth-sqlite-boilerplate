/* eslint-disable  @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express"

import BaseError from "@exceptions/BaseError"

const catchAsync =
  (func: (...args: any[]) => Promise<void>) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      return await func(req, res, next)
    } catch (error) {
      res.sendStatus((error as BaseError).httpCode)
    }
  }

export default catchAsync
