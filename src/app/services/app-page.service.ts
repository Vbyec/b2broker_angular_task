import {Injectable} from '@angular/core';
import {Entity, EntityInterface} from "../models/entity";
import {WorkerMessage, WorkerMessageType, WorkerSettings} from "../models/worker-message";
import {BehaviorSubject, combineLatest, map} from "rxjs";
import {Child} from "../models/child";
import {createWorker} from "../worker/worker-factory";

@Injectable({
    providedIn: 'root'
})
export class AppPageService {
    private worker: Worker | null = null;
    private additionalIds$ = new BehaviorSubject<Array<string>>([]);
    private entities$ = new BehaviorSubject<Array<EntityInterface>>([]);
    private onMessageHandler = this.onMessage.bind(this);

    public readonly entitiesToShow$ = combineLatest([
        this.entities$,
        this.additionalIds$,
    ]).pipe(
        map(([entities, additionalIds]) => this.getEntitiesToShow(entities, additionalIds))
    );

    public updateSettings(timer: number, size: number): void {
        try {
            this.worker?.postMessage(new WorkerMessage(WorkerMessageType.SETTINGS, new WorkerSettings(timer, size)));
        } catch (error) {
            console.error("Failed to update settings:", error);
        }
    }

    public updateAdditionalIds(ids: string): void {
        this.additionalIds$.next(this.stringToArray(ids));
    }

    public listen(): void {
        this.worker = createWorker();
        this.worker.addEventListener('message', this.onMessageHandler);
    }

    public stopListening(): void {
        if (this.worker) {
            this.worker.postMessage(new WorkerMessage(WorkerMessageType.STOP));
            this.worker.removeEventListener('message', this.onMessageHandler);
            this.worker.terminate();
            this.worker = null;
        }
    }

    private onMessage(message: { data: Array<EntityInterface> }): void {
        this.entities$.next(message.data);
    }

    public getEntitiesToShow(entities: Array<EntityInterface>, additionalIds: Array<string>): Array<Entity> {
        const addAfterIndex = Math.max(entities.length - 10, 0);
        const filteredEntities = entities.filter((entity, index) => additionalIds.includes(entity.id) || index >= addAfterIndex);
        this.sortArrayByAnother(filteredEntities, additionalIds);
        return [
            ...filteredEntities.slice(0, 10),
        ].map(entity => new Entity({
            ...entity,
            child: new Child(entity.child)
        }));
    }

    private sortArrayByAnother(arr1: Array<EntityInterface>, arr2: Array<string>) {
        const set2 = new Set(arr2);
        const firstPart = arr1.filter(item => set2.has(item.id));
        const secondPart = arr1.filter(item => !set2.has(item.id));
        return [...firstPart, ...secondPart];
    }

    private stringToArray(str: string): Array<string> {
        return (str)
            .split(',')
            .map(item => item.trim())
            .filter(item => item !== '');
    }
}
