import { getRequest, openSession } from "@test-util/SessionSetUp";
import * as db from "@test-util/MongoMemory";
import { SessionPackage } from "@/interfaces";
import { LeanDocument } from "mongoose";
import { Role, User, UserModel } from "@/models/User";
import { StatusCodes } from "http-status-codes";
import { DEFAULT_BATCH_SIZE } from "@/services/FeedService";
import { FeedModel, Message, MessageType } from "@/models/Message";
import { FEED } from "@/sockets/feed";
import { ERR_MSG } from "@/shared/errors";

beforeAll(db.connect);
afterEach(db.clear);
afterAll(db.close);

const endpoint = "/feed/messages";

describe("Calling GET " + endpoint, () => {

	let session: SessionPackage;
	let user: LeanDocument<User>;

	beforeEach((done) => {
		openSession((response) => {
			session = response.session;
			user = response.user;
			if (session && user) {
				done();
			}
		});
	});

	it(`should return the last ${DEFAULT_BATCH_SIZE} messages of Patients`, async () => {
		await UserModel.findByIdAndUpdate(user._id, {
			role: Role.Patient
		});
		fillDb(user, `${FEED}:${user._id as string}`);

		const response = await getRequest(endpoint, session.auth)
			.send()
			.expect(StatusCodes.OK);

		const messages: LeanDocument<Message>[] = response.body.messages;	
		expect(messages.length).toBe(DEFAULT_BATCH_SIZE);
		expect(messages.map((msg) => msg.timestamp).every((t) => t > 0)).toBeTruthy();
	});

	// TODO give a look to this tests, it fails half the times
	it(`should return the last ${DEFAULT_BATCH_SIZE} messages of Keepers`, async () => {
		const patient = await UserModel.create({
			googleId: "patient",
			role: Role.Patient
		});
		await UserModel.findByIdAndUpdate(user._id, {
			role: Role.Keeper,
			cared: patient
		});
		fillDb(user, `${FEED}:${patient._id as string}`);

		const response = await getRequest(endpoint, session.auth)
			.send()
			.expect(StatusCodes.OK);

		const messages: LeanDocument<Message>[] = response.body.messages;	
		expect(messages.length).toEqual(DEFAULT_BATCH_SIZE);
		expect(messages.map((msg) => msg.timestamp).every((t) => t > 0)).toBeTruthy();
	});

	it("should return the requested page of messages", async () => {
		await UserModel.findByIdAndUpdate(user._id, {
			role: Role.Patient
		});
		fillDb(user, `${FEED}:${user._id as string}`);

		const response = await getRequest(`${endpoint}/2`, session.auth)
			.send()
			.expect(StatusCodes.OK);

		const messages: LeanDocument<Message>[] = response.body.messages;	
		expect(messages.length).toBe(1);
		expect(messages[0].timestamp).toBe(0);
	});

	it(`should return the default page when requested an invalid page`, async () => {
		await UserModel.findByIdAndUpdate(user._id, {
			role: Role.Patient
		});
		fillDb(user, `${FEED}:${user._id as string}`);

		const response = await getRequest(`${endpoint}/-1`, session.auth)
			.send()
			.expect(StatusCodes.OK);

		const messages: LeanDocument<Message>[] = response.body.messages;	
		expect(messages.length).toBe(DEFAULT_BATCH_SIZE);
		expect(messages.map((msg) => msg.timestamp).every((t) => t > 0)).toBeTruthy();
	});

	it("should return an error when requested by a blank user", async () => {
		const response = await getRequest(endpoint, session.auth)
			.send()
			.expect(StatusCodes.BAD_REQUEST);

		expect(response.body.message).toEqual(ERR_MSG.invalid_role);
	});

	it("should return an error when requested by a not bonded Keeper", async () => {
		await UserModel.findByIdAndUpdate(user._id, {
			role: Role.Keeper
		});
		const response = await getRequest(endpoint, session.auth)
			.send()
			.expect(StatusCodes.BAD_REQUEST);

		expect(response.body.message).toEqual(ERR_MSG.keeper_not_bonded);
	});

});

const fillDb = (user: LeanDocument<User>, room: string) => {
	return new Promise((resolve, _reject) => {
		FeedModel.create(new Array(DEFAULT_BATCH_SIZE + 1).fill({})
			.map((_, index) => {
				return {
					message: index.toString(),
					user: user._id,
					username: "name",
					timestamp: index,
					type: MessageType.Text,
					room: room
				}
			}), resolve);
	})
}