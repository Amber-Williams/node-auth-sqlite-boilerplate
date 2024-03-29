import bcrypt from "bcrypt"
import request from "supertest"

import App from "@app"
import database from "@database"
import User from "@models/user.model"
import UserRoute from "@routes/users.route"
import AuthService from "@services/auth.service"
import { ICreateAuthTokens } from "@typings/auth.type"
import { ICreateUser, Roles } from "@typings/users.type"

const userData: ICreateUser = {
  email: "test@email.com",
  password: "q1w2e3r4!",
  username: "tester",
}

const getMockedUser = async (): Promise<ICreateAuthTokens> => {
  return {
    userId: "1",
    email: userData.email,
    password: await bcrypt.hash(userData.password, 10),
    username: userData.username,
    role: "admin" as Roles,
  }
}

const getAdminCookies = async (user: ICreateAuthTokens) => {
  const authService = new AuthService()
  const { access, refresh, identity } = await authService.createAuthTokens(user)
  return [`rid=${refresh};aid=${access};id=${identity};`]
}

describe("Testing Users routes", () => {
  describe("Create user - [POST] /api/users", () => {
    it("happy path", async () => {
      const usersRoute = new UserRoute()
      const userRepository = database.dataSource.getRepository(User)
      const mockedUser = await getMockedUser()

      userRepository.findOne = jest.fn().mockReturnValue(null)
      userRepository.save = jest.fn().mockReturnValue(mockedUser)

      const app = new App([usersRoute])
      return request(app.app)
        .post(`/api${usersRoute.path}`)
        .set("Cookie", await getAdminCookies(mockedUser))
        .send(userData)
        .expect(201)
    })
  })

  describe("Get all users - [GET] /api/users", () => {
    it("happy path", async () => {
      const usersRoute = new UserRoute()
      const userRepository = database.dataSource.getRepository(User)
      const mockedUser = await getMockedUser()

      userRepository.find = jest.fn().mockReturnValue([
        {
          id: 1,
          email: "a@email.com",
          password: await bcrypt.hash("q1w2e3r4!", 10),
          username: "a",
        },
        {
          id: 2,
          email: "b@email.com",
          password: await bcrypt.hash("a1s2d3f4!", 10),
          username: "b",
        },
        {
          id: 3,
          email: "c@email.com",
          password: await bcrypt.hash("z1x2c3v4!", 10),
          username: "c",
        },
      ])

      const app = new App([usersRoute])
      return request(app.app)
        .get(`/api${usersRoute.path}`)
        .set("Cookie", await getAdminCookies(mockedUser))
        .expect(200)
    })
  })

  describe("Get one user - [GET] /api/users/:id", () => {
    it("happy path", async () => {
      const userId = 1
      const usersRoute = new UserRoute()
      const userRepository = database.dataSource.getRepository(User)
      const mockedUser = await getMockedUser()

      userRepository.findOne = jest.fn().mockReturnValue({
        id: userId,
        email: "a@email.com",
        password: await bcrypt.hash("q1w2e3r4!", 10),
        username: "a",
      })

      const app = new App([usersRoute])
      return request(app.app)
        .get(`/api${usersRoute.path}/${userId}`)
        .set("Cookie", await getAdminCookies(mockedUser))
        .expect(200)
    })
  })

  describe("Update user - [PUT] /api/users/:id", () => {
    it("happy path", async () => {
      const userId = 1
      const userData: ICreateUser = {
        email: "test@email.com",
        password: "1q2w3e4r!",
        username: "test",
      }
      const mockedUser = await getMockedUser()
      const usersRoute = new UserRoute()
      const mockedUserEntity = User

      mockedUserEntity.update = jest.fn().mockReturnValue({
        generatedMaps: [],
        raw: [],
        affected: 1,
      })
      const userRepository = database.dataSource.getRepository(mockedUserEntity)

      userRepository.findOne = jest.fn().mockReturnValue({
        id: userId,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
        username: userData.username,
        update: jest.fn().mockReturnValue({
          id: userId,
          email: userData.email,
          password: await bcrypt.hash(userData.password, 10),
          username: userData.username,
        }),
      })

      const app = new App([usersRoute])
      return request(app.app)
        .put(`/api${usersRoute.path}/${userId}`)
        .set("Cookie", await getAdminCookies(mockedUser))
        .send(userData)
        .expect(200)
    })
  })

  describe("Delete user - [DELETE] /api/users/:id", () => {
    it("happy path", async () => {
      const userId = 1
      const usersRoute = new UserRoute()
      const userRepository = database.dataSource.getRepository(User)
      const mockedUser = await getMockedUser()

      userRepository.findOne = jest.fn().mockReturnValue({
        id: userId,
        email: "a@email.com",
        password: await bcrypt.hash("q1w2e3r4!", 10),
        username: "a",
      })

      const app = new App([usersRoute])
      return request(app.app)
        .delete(`/api${usersRoute.path}/${userId}`)
        .set("Cookie", await getAdminCookies(mockedUser))
        .expect(200)
    })
  })
})
