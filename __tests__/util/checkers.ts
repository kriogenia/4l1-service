import { SessionPackage } from "@/interfaces";

export const checkSessionPackage = (session: SessionPackage) => {		
	expect(session.auth).not.toHaveLength(0);
	expect(session.refresh).not.toHaveLength(0);
	expect(session.expiration).toBeGreaterThan(0);
}