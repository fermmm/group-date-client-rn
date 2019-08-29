import { fakeTestingGroups } from "./tools/debug-tools/fakeTestingGroups";
import { Group } from "./typings/Group";

export function getGroups(): Group[] {
    return fakeTestingGroups;
}
