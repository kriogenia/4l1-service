import { MessageType, TaskMessageModel } from "@/models/Message";
import { Action, Notification, NotificationModel } from "@/models/Notification";
import { Role, User, UserModel } from "@/models/User";
import { create, DEFAULT_MAX_AGE, getUnread, removeCreatedTask, 
	removeSharingLocation, setAllRead, setReadByUser } from "@/services/NotificationService";
import { DAY_IN_MILLIS } from "@/shared/values";
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
				expect(persisted.interested.length).toBe(2);
		});

	});

});

describe("The retrieval of unread notifications", () => {

	beforeEach((done) => {
		const notifications: Partial<Notification>[] = new Array(10).fill({}).map((_, index) => {
			return {
				action: Action.BOND_CREATED,
				instigator: author._id,
				timestamp: Date.now() - index * DAY_IN_MILLIS,
				interested: (index % 2 === 0) ? [ author._id ] : []
			}
		});
		NotificationModel.create(notifications, done);
	});

	it ("should retrieve the specified notifications of the last 7 days if no age is specified", async () => {
		const maxAge = DEFAULT_MAX_AGE;
		return getUnread(author._id).then((notifications) => {
			expect(notifications.length).toBe(4);
			notifications.forEach((n) => {
				expect(n.timestamp).toBeGreaterThanOrEqual(Date.now() - maxAge * DAY_IN_MILLIS)
			});
		})
	});

	it ("should retrieve all the unread notifications with a big enough age", async () => {
		const maxAge = 100;
		return getUnread(author._id, maxAge).then((notifications) => {
			expect(notifications.length).toBe(5);
			notifications.forEach((n) => {
				expect(n.timestamp).toBeGreaterThanOrEqual(Date.now() - maxAge * DAY_IN_MILLIS)
			});
		})
	});

});

describe("Setting the notifications of an user as read", () => {

	it("should let only those that still have interesteds", async () => {
		const other = await UserModel.create({
			googleId: "other",
			displayName: "other",
			role: Role.Keeper
		});
		const notifications: Partial<Notification>[] = new Array(10).fill({}).map((_, index) => {
			return {
				action: Action.BOND_CREATED,
				instigator: "name",
				timestamp: 0,
				interested: (index % 2 === 0) ? [ author._id ] : [ author._id, other._id ]
			}
		});
		await NotificationModel.create(notifications);

		await setAllRead(author._id);

		const ofAuthor = await NotificationModel.find({ interested: { $all: [ author._id ] } });
		expect(ofAuthor.length).toBe(0);
		const ofOther = await NotificationModel.find({ interested: { $all: [ other._id ] } });
		expect(ofOther.length).toBe(5);
	});

});

describe("Setting a notification as read by an user", () => {

	it("should do it and keep the notification if still have interesteds", async () => {
		const other = UserModel.create({
			googleId: "other",
			displayName: "other",
			role: Role.Keeper
		});
		const notification: Notification = await NotificationModel.create({
			action: Action.LOCATION_SHARING_START,
			instigator: "name",
			timestamp: 0,
			interested: [ author._id, (await other)._id ]
		});

		await setReadByUser(notification._id, author._id);

		const inDb = await NotificationModel.findById(notification._id);
		expect(inDb.interested.length).toBe(1);
		expect(inDb.interested[0]).toEqual((await other)._id);
	});

	it("should do it and delete the notification if lost all its interested", async () => {
		const notification: Notification = await NotificationModel.create({
			action: Action.LOCATION_SHARING_START,
			instigator: "name",
			timestamp: 0,
			interested: [ author._id ]
		});

		await setReadByUser(notification._id, author._id);

		const inDb = await NotificationModel.findById(notification._id);
		expect(inDb).toBeNull();
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

describe("The removal of task creation notifications", () => {

	it("should remove the matching notification", async () => {
		const task = await TaskMessageModel.create({
			title: "title",
			description: "description",
			done: false,
			submitter: author._id,
			username: author.displayName,
			timestamp: 0,
			lastUpdate: 0,
			room: "room",
			type: MessageType.Task
		});
		const notification: Notification = await NotificationModel.create({
			action: Action.TASK_CREATED,
			instigator: "name",
			timestamp: 0,
			tags: [ task._id, task.title ],
			interested: [ author._id ]
		});

		const removed = await removeCreatedTask(task._id);
		expect(removed.dto().toString()).toEqual(notification.dto().toString());

		const inDb = await NotificationModel.findById(notification._id);
		expect(inDb).toBeNull();
	});

});