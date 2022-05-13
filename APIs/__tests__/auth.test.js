import { app } from "../server";
import request from "supertest";
describe("GET /apis/auth", () => {
  describe("given a access token exist", () => {
    test("should respond with a 205 status code", async () => {
      const response = await request(app).get("/apis/auth");
      expect(response.statusCode).toBe(205);
    });
  });
});
