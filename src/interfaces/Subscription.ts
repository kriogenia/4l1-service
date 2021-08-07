/**
 * Request to perform subscriptions
 * @property {string} room_code code of the room to join
 * @property {string} user_name username of the requester
 */
 export interface SubscriptionRequest {
	room_code: string,
	user_name: string
}

/**
 * Request to notificate subscriptions
 * @property {number} timestamp of the subscription
 * @property {string} user_name of the new subscriber
 */
export interface SubscriptionNotification {
	timestamp: number,
	user_name: string
}