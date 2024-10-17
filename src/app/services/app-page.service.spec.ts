import {TestBed} from '@angular/core/testing';
import {AppPageService} from './app-page.service';
import {EntityInterface} from '../models/entity';
import {WorkerMessage, WorkerMessageType, WorkerSettings} from '../models/worker-message';
import {createWorker} from "../worker/worker-factory";

jest.mock('../worker/worker-factory');

describe('AppPageService', () => {
    let service: AppPageService;
    let mockWorker: Worker;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AppPageService],
        });
        service = TestBed.inject(AppPageService);
        mockWorker = {
            postMessage: jest.fn(),
            removeEventListener: jest.fn(),
            terminate: jest.fn(),
            addEventListener: jest.fn(),
        } as unknown as Worker;

        (createWorker as jest.Mock).mockReturnValue(mockWorker);
    });

    it('should create worker on listen', () => {
        service.listen();
        expect(mockWorker.addEventListener).toHaveBeenCalledWith('message', expect.any(Function));
    });

    it('should post a message to the worker with settings', () => {
        service.listen();
        service.updateSettings(1000, 5);
        expect(mockWorker.postMessage).toHaveBeenCalledWith(new WorkerMessage(WorkerMessageType.SETTINGS, new WorkerSettings(1000, 5)));
    });


    it('should update additional IDs', (done) => {
        const ids = '1,2,3';
        service.updateAdditionalIds(ids);

        service['additionalIds$'].subscribe(result => {
            expect(result).toEqual(['1', '2', '3']);
            done();
        });
    });

    it('should stop the worker correctly', () => {
        service.listen();
        service.stopListening();

        expect(mockWorker.postMessage).toHaveBeenCalledWith(new WorkerMessage(WorkerMessageType.STOP));
        expect(mockWorker.removeEventListener).toHaveBeenCalledWith('message', expect.any(Function));
        expect(mockWorker.terminate).toHaveBeenCalled();
        expect(service['worker']).toBeNull();
    });


    it('should filter entities and return correct data', () => {
        const mockEntities: Array<EntityInterface> = [
            {id: '1', int: 1, float: 1.1, color: '#FFFFFF', child: {id: '1', color: '#000000'}},
            {id: '2', int: 2, float: 2.2, color: '#000000', child: {id: '2', color: '#FFFFFF'}},
        ];

        const additionalIds = ['1'];
        const result = service['getEntitiesToShow'](mockEntities, additionalIds);

        expect(result.length).toBe(2);
        expect(result[0].id).toBe('1');
    });

});


