export const createWorker = () => {
    return new Worker(new URL('../worker/generator.worker.ts', ''));
};
