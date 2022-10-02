import request from "supertest"

import App from "@app"
import IndexRoute from "@routes/index.route"

describe("Testing Index routes", () => {
  describe("[GET] /api/", () => {
    it("happy path", () => {
      const indexRoute = new IndexRoute()
      const app = new App([indexRoute])

      return request(app.app).get(`/api/${indexRoute.path}`).expect(200)
    })
  })
})
