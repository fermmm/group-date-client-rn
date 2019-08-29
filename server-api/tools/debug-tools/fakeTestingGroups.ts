import { fakeTestingUsers } from "./fakeTestingUsers";
import { Group } from "../../typings/Group";

export const fakeTestingGroups: Group[] = [
    {
        users: [
            fakeTestingUsers[2],
            fakeTestingUsers[3],
            fakeTestingUsers[4],
            fakeTestingUsers[5],
        ],
        matches: {
            "2": [
                "3",
                "4",
                "5",
            ],
            "3": [
                "2",
                "4",
                "5",
            ],
            "4": [
                "2",
                "3",
                "5",
            ],
            "5": [
                "2",
                "3",
                "4",
            ],
        },
    },
    {
        users: [
            fakeTestingUsers[0],
            fakeTestingUsers[1],
            fakeTestingUsers[2],
            fakeTestingUsers[3],
        ],
        matches: {
            "0": [
                "2",
                "3",
            ],
            "1": [
                "3",
            ],
            "2": [
                "0",
                "3",
            ],
            "3": [
                "0",
                "1",
                "2",
            ],
        },
    },
];
