/// <reference lib="webworker" />
import {EntityInterface} from "../models/entity";
import {WorkerMessageInterface, WorkerMessageType} from "../models/worker-message";
import {ChildInterface} from "../models/child";

let intervalId: null | ReturnType<typeof setInterval>  = null;
const colorLetters = '0123456789ABCDEF';

addEventListener('message', ({data}: { data: WorkerMessageInterface }) => {
    switch (data.type) {
        case WorkerMessageType.SETTINGS:
            stop();
            start(data.payload.timer, data.payload.size);
            break;
        case WorkerMessageType.STOP:
            stop();
            break;
    }
});

function start(timer: number, size: number) {
    intervalId = setInterval(() => {
        postMessage(generateEntities(size));
    }, timer);
}

function stop() {
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
    }
}

export function generateEntities(size: number): Array<EntityInterface> {
    return Array.from({length: size}, generateEntity);
}

export function generateEntity(): EntityInterface {
    return {
        id: generateId(1000),
        int: generateRandomInt(100000),
        float: generateRandomFloat(100, 18),
        color: getRandomColor(),
        child: generateChild(),
    };
}

function generateRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
}

function generateRandomFloat(max: number, precision: number): number {
    return parseFloat((Math.random() * max).toFixed(precision));
}

export function getRandomColor(): string {
    return '#' + Array.from({length: 6}, () => colorLetters[Math.floor(Math.random() * 16)]).join('');
}

function generateId(max: number): string {
    return generateRandomInt(max).toString();
}

export const generateChild = (): ChildInterface => {
    return {
        id: generateId(100),
        color: getRandomColor(),
    };
};
