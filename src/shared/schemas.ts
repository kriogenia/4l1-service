/**
 * Schema with data to perform subscriptions 
 */
export interface SubscriptionRequest {
	room_code: string,
	user_name: string
}


export interface SubscriptionNotification {
	timestamp: number,
	user_name: string
}