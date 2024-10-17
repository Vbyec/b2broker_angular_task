export class WorkerSettings {
    constructor(
        public timer: number,
        public size: number,
    ) {
    }
}

type WorkerPayload = WorkerSettings;

export type WorkerMessageInterface =
    WorkerSettingsMessageInterface
    | WorkerStopMessageInterface;

export class WorkerMessage {
    constructor(
        public type: WorkerMessageType,
        public payload?: WorkerPayload,
    ) {
    }
}

export interface WorkerSettingsMessageInterface extends WorkerMessageBasicInterface {
    type: WorkerMessageType.SETTINGS,
    payload: WorkerSettings,
}

export interface WorkerStopMessageInterface extends WorkerMessageBasicInterface {
    type: WorkerMessageType.STOP,
}

export interface WorkerMessageBasicInterface {
    type: WorkerMessageType,
    payload: WorkerPayload,
}

export enum WorkerMessageType {
    SETTINGS,
    STOP
}
