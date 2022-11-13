import { Request, Response, NextFunction } from "express"

const attachCookiesMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.locals.cookies = req.cookies
  next()
}

export default attachCookiesMiddleware
