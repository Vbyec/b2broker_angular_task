export class Child implements ChildInterface {
    public id: string;
    public color: string;

    constructor(
        {
            id,
            color
        }: ChildInterface
    ) {
        this.id = id;
        this.color = color;
    }
}

export interface ChildInterface {
    id: string,
    color: string,
}
