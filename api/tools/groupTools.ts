import { Group } from "../server/shared-tools/endpoints-interfaces/groups";
import { User } from "../server/shared-tools/endpoints-interfaces/user";

/**
 * Syntax sugar to find a user inside a group by userId
 */
export function getGroupMember(userId: string, group: Group): User {
   return group.members.find(user => user.userId === userId);
}
