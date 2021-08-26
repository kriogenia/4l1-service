declare namespace Express {
    export interface Request  {
		// Extension of Request to store the uuid of the user making the request
        sessionId: string
    }
}