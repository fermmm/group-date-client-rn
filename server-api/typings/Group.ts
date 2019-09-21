import { User } from "./User";

export interface Group {
    members: User[];
    matches: {[userId: string]: string[]};
    invitationAccepted: boolean;
}
