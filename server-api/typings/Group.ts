import { User } from "./User";

export interface Group {
    users: User[];
    matches: {[userId: string]: string[]};
    invitationAccepted: boolean;
}
