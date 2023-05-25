import {RecordStatus} from "../enums";

export const COLUMN_WIDTH = 350;
export const COLUMNS_STATUSES = [
    {
        link: "/api/v3/statuses/18",
        status: RecordStatus.Plan
    },
    {
        link: "/api/v3/statuses/16",
        status: RecordStatus.Progress
    },
    {
        link: "/api/v3/statuses/24",
        status: RecordStatus.Inspection
    }
]
