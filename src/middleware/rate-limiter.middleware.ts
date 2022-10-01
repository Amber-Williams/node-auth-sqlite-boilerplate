import rateLimit from "express-rate-limit"

import { formatMinsToMillisec } from "../utils/date"

const apiLimiter = rateLimit({
  windowMs: formatMinsToMillisec(10),
  max: 10, // Limit each IP to n requests per window time
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

export default apiLimiter
