import { Request, Response } from "express"

import catchAsync from "@utils/catchAsync"

class IndexController {
  public index = catchAsync(async (_: Request, res: Response) => {
    res.sendStatus(200)
  })
}

export default IndexController
