import {Child, ChildInterface} from "./child";

export class Entity implements EntityInterface {
    public id: string;
    public int: number;
    public float: number;
    public color: string;
    public child: Child;

    constructor(
        {
            id,
            int,
            float,
            color,
            child,
        }: EntityInterface
    ) {
        this.id = id;
        this.int = int;
        this.float = float;
        this.color = color;
        this.child = child;
    }
}

export interface EntityInterface {
    id: string,
    int: number,
    float: number,
    color: string,
    child: ChildInterface,
}
