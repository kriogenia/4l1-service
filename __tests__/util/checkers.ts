import { SessionDto } from "@/models/dto";

export const checkSessionPackage = (session: SessionDto) => {		
	expect(session.auth).not.toHaveLength(0);
	expect(session.refresh).not.toHaveLength(0);
	expect(session.expiration).toBeGreaterThan(0);
}