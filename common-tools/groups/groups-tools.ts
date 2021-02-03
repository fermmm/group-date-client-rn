import { Group } from "../../api/server/shared-tools/endpoints-interfaces/groups";
import { User } from "../../api/server/shared-tools/endpoints-interfaces/user";

export function getMatchesOf(userId: string, group: Group): User[] {
   const matchesList: string[] = group.matches.find(m => m.userId === userId).matches;
   return group.members.filter(u => matchesList.includes(u.userId));
}
