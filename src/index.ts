import express, { Request, Response } from "express"

const PORT = 3333

const app = express()

app.get("/", (_: Request, res: Response) => {
  res.send("hello world")
})

// eslint-disable-next-line no-console
app.listen(3333, () => console.info(`server listening on port:${PORT}`))
