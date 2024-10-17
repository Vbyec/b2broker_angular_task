import {generateChild, generateEntities, generateEntity, getRandomColor} from './generator.worker';

describe('Generator Tests', () => {
    test('generateEntity should return a valid EntityInterface object', () => {
        const entity = generateEntity();
        expect(entity).toHaveProperty('id');
        expect(entity).toHaveProperty('int');
        expect(entity).toHaveProperty('float');
        expect(entity).toHaveProperty('color');
        expect(entity).toHaveProperty('child');
    });

    test('generateEntities should return an array of valid entities', () => {
        const size = 5;
        const entities = generateEntities(size);
        expect(entities).toHaveLength(size);
        entities.forEach(entity => {
            expect(entity).toHaveProperty('id');
            expect(entity).toHaveProperty('int');
            expect(entity).toHaveProperty('float');
            expect(entity).toHaveProperty('color');
            expect(entity).toHaveProperty('child');
        });
    });

    test('getRandomColor should return a valid hex color', () => {
        const color = getRandomColor();
        expect(color).toMatch(/^#[0-9A-F]{6}$/);
    });

    test('generateChild should return a valid ChildInterface object', () => {
        const child = generateChild();
        expect(child).toHaveProperty('id');
        expect(child).toHaveProperty('color');
        expect(child.color).toMatch(/^#[0-9A-F]{6}$/);
    });
});
