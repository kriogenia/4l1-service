import { Action, Notification, NotificationModel } from "@/models/Notification";
import { Role, User, UserModel } from "@/models/User";
import { create, removeSharingLocation } from "@/services/NotificationService";
import * as db from "@test-util/MongoMemory";

/* Test database deployment and management */
beforeAll(db.connect);
afterEach(db.clear);
afterAll(db.close);

let author: User;

beforeEach(async () => {
	author = await UserModel.create({
		displayName: "name",
		googleId: "patient",
		role: Role.Patient
	});
});

describe("The create operation", () => {

	it ("should build and persist a notification", async () => {
		const bond1 = UserModel.create({
			googleId: "bond1",
			displayName: "bond1",
			role: Role.Keeper
		});
		const bond2 = UserModel.create({
			googleId: "bond2",
			displayName: "bond2",
			role: Role.Keeper
		});
		await UserModel.findByIdAndUpdate(author._id, {
			bonds: [ (await bond1)._id, (await bond2)._id ]
		});

		const time = Date.now();
		expect.assertions(5);
		return create(Action.BOND_CREATED, author._id).then(
			(persisted: Notification) => {
				expect(persisted.id).not.toBeNull();
				expect(persisted.action).toEqual(Action.BOND_CREATED);
				expect(persisted.instigator).toEqual(author.displayName);
				expect(persisted.timestamp).toBeGreaterThanOrEqual(time);
				expect(persisted.interested.length).toBe(3);
		});

	});

});

describe("The removal of sharing location notifications", () => {

	it("should remove the matching notification", async () => {
		const notification: Notification = await NotificationModel.create({
			action: Action.LOCATION_SHARING_START,
			instigator: "name",
			timestamp: 0,
			tags: [ author._id ],
			interested: [ author._id ]
		});

		const removed = await removeSharingLocation(author._id);
		expect(removed.dto().toString()).toEqual(notification.dto().toString());

		const inDb = await NotificationModel.findById(notification._id);
		expect(inDb).toBeNull();
	});

});