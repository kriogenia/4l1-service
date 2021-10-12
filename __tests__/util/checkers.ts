import { SessionDto, TaskDto } from "@/models/dto";
import { TaskMessage } from "@/models/Message";
import { DAY_IN_MILLIS } from "@/shared/values";

export const checkSessionPackage = (session: SessionDto) => {		
	expect(session.auth).not.toHaveLength(0);
	expect(session.refresh).not.toHaveLength(0);
	expect(session.expiration).toBeGreaterThan(0);
}

export const isTaskRelevant = (task: TaskMessage | TaskDto, maxAge: number): boolean => {
	if (!task.done) return true;
	return (task.lastUpdate >= Date.now() - maxAge * DAY_IN_MILLIS);
}