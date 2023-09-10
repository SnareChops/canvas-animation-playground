export type Vector = { x: number, y: number, z: number };

export class Bounds {
    vector: Vector = { x: 0, y: 0, z: 0 };

    constructor(public width: number = 0, public height: number = 0) { }

    vec2(): [number, number] {
        return [this.vector.x, this.vector.y];
    }

    setVec2(x: number, y: number) {
        this.vector.x = x;
        this.vector.y = y;
    }

    vec3(): [number, number, number] {
        return [this.vector.x, this.vector.y, this.vector.z];
    }

    setVec3(x: number, y: number, z: number) {
        this.vector.x = x;
        this.vector.y = y;
        this.vector.z = z;
    }
}