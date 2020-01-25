import { fakeTestingUsers } from "./tools/debug-tools/fakeTestingUsers";
import { User } from "./typings/User";

export function getAvaiableCards(): User[] {
    return fakeTestingUsers;
}
