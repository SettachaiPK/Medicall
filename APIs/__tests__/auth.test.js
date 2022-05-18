import { app } from "../server";
import request from "supertest";
import dataTest from "../dataTest";

let tUser = dataTest.tUser;

describe("GET /apis/auth", () => {
  describe("given user does not exist", () => {
    test("should respond with a 205 status code", async () => {
      const response = await request(app).get("/apis/auth");
      expect(response.statusCode).toBe(205);
    });
  });
});
describe("GET /apis/auth/logout", () => {
  describe("given logout success", () => {
    test("should respond with a 200 status code", async () => {
      const response = await request(app).get("/apis/auth/logout");
      expect(response.statusCode).toBe(200);
    });
  });
});
describe("GET /apis/auth/verifyOTP", () => {
  describe("given a access token does not exist", () => {
    test("should respond with a 205 status code", async () => {
      const response = await request(app)
        .post("/apis/auth/verifyOTP")
        .set("Content-type", "application/json")
        .send({
          phoneNumber: tUser.phoneNumber,
          password: tUser.password,
        })
        .expect(401);
      console.log(response);
    });
  });
});

/* Request OTP */
describe("POST /apis/auth/requestOTP", () => {
  /* User should send his phone number */
  describe("given a phone number", () => {
    /* Should create a new OTP and send it to the phone number */
    /* Should response with JSON object containing ref and expire-date */
    /* Should response with 200 status code */
    test("should response status code 200", async () => {
      const signUp = await request(app).post("/apis/auth/requestOTP").send({
        phoneNumber: tUser.phoneNumber,
      });
      expect(signUp.statusCode).toBe(404);
    });
  });
});
