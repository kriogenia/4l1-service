/* istanbul ignore file */
import { app } from "@/App";
import request from "supertest";
import { mocked } from "ts-jest/utils";
import { verify } from "@/services/GoogleAuth";
import { SessionDto, UserDto } from "@/models/dto";

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
	session: SessionDto,
	user: UserDto
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
 * @returns request ready to be sent or populated
 */
 export const getRequest = (endpoint: string, token: string) => {
	return request(app).get(endpoint).set("Authorization", `Bearer ${token}`);
}

/**
 * Builds a test POST request to the specified endpoint with the authorization token
 * retrieved in the openSession
 * @param endpoint of the request
 * @param token authorization token
 * @returns request ready to be sent or populated
 */
 export const postRequest = (endpoint: string, token: string) => {
	return request(app).post(endpoint).set("Authorization", `Bearer ${token}`);
}

/**
 * Builds a test PATCH request to the specified endpoint with the authorization token
 * retrieved in the openSession
 * @param endpoint of the request
 * @param token authorization token
 * @returns request ready to be sent or populated
 */
 export const patchRequest = (endpoint: string, token: string) => {
	return request(app).patch(endpoint).set("Authorization", `Bearer ${token}`);
}