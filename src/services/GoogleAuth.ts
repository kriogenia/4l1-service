import { errorHandler } from "@/shared/ErrorHandler";
import { badRequestError } from "@/shared/errors";
import { msg_invalid_google_id } from "@/shared/strings";
import { OAuth2Client } from "google-auth-library";

/**
 * Validates the GoogleIdToken of the user and return its id
 * @param token GoogleIdToken to validate
 * @returns unique Google Id of the user
 */
export const verify = async (token: string) => {
	const client = new OAuth2Client(process.env.GOOGLE_SERVER_ID);
	return client.verifyIdToken({
		idToken: token,
		audience: process.env.GOOGLE_SERVER_ID
	})
	.then((ticket) => ticket.getPayload().sub)
	.catch((e: Error) => {
		errorHandler.handleError(e);
		throw badRequestError(msg_invalid_google_id);
	});
}
