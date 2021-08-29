import { app } from "@/App";
import request from "supertest";
import { mocked } from "ts-jest/utils";
import { verify } from "@/services/GoogleAuth";
import { SessionPackage } from "@/interfaces";
import { LeanDocument } from "mongoose";
import { User } from "@/models/User";

/* Mock GoogleAuth */
jest.mock("@/services/GoogleAuth");
const mockVerify = mocked(verify);
mockVerify.mockImplementation((token) => Promise.resolve(token));

/**
 * Opens a new session and executes the callback function
 * with the retrieved token
 * @param done callback
 */
export const openSession = (done: (response: {
	session: SessionPackage,
	user: LeanDocument<User>
}) => void): void => {
	request(app).get("/auth/signin/token").send()
		.then((response) => {
			done(response.body);
		})
		.catch(e => { throw e });
};

/**
 * Builds a test GET request to the specified endpoint with the authorization token
 * retrieved in the openSession
 * @param endpoint of the request
 * @param token authorization token
 * @returns request ready to be sent
 */
 export const getRequest = (endpoint: string, token: string) => {
	return request(app).get(endpoint).set("Authorization", `Bearer ${token}`);
}

/**
 * Builds a test PUT request to the specified endpoint with the authorization token
 * retrieved in the openSession
 * @param endpoint of the request
 * @param token authorization token
 * @returns request ready to be sent
 */
 export const putRequest = (endpoint: string, token: string) => {
	return request(app).put(endpoint).set("Authorization", `Bearer ${token}`);
}