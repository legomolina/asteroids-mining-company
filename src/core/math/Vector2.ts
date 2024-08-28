import { Point } from 'pixi.js';

export default class Vector2 {
    static get zero(): Vector2 {
        return new Vector2(0, 0);
    }

    constructor(public x: number, public y: number) { }

    static fromPoints(a: Point, b: Point): Vector2 {
        return new Vector2(b.x - a.x, b.y - a.y);
    }

    magnitudeSqrt(): number {
        return this.x * this.x + this.y * this.y;
    }

    magnitude(): number {
        return Math.sqrt(this.magnitudeSqrt());
    }

    normalized(): Vector2 {
        const magnitude = this.magnitude();

        if (magnitude > 0) {
            return new Vector2(this.x / magnitude, this.y / magnitude);
        }

        return Vector2.zero;
    }

    clampMagnitude(maxValue: number): Vector2 {
        const magnitude = this.magnitude();
        let factor = 1;

        if (magnitude > maxValue) {
            factor = maxValue / magnitude;
        }

        return new Vector2(this.x * factor, this.y * factor);
    }

    rotate(angle: number): Vector2 {
        const radAngle: number = angle * Math.PI / 180;
        const x = this.x * Math.cos(radAngle) - this.y * Math.sin(radAngle);
        const y = this.x * Math.sin(radAngle) + this.y * Math.cos(radAngle);

        return new Vector2(x, y);
    }

    angleBetween(vec: Vector2): number {
        const sin = this.x * vec.y - vec.x * this.y;
        const cos = this.x * vec.x - vec.y * this.y;

        return Math.atan2(sin, cos) * (180 / Math.PI);
    }

    toPoint(): Point {
        return new Point(this.x, this.y);
    }

    toString(): string {
        return `Vector2(${this.x.toFixed(0)}, ${this.y.toFixed(2)})`;
    }

    clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    equals(vec: Vector2): boolean {
        return this.x === vec.x && this.y === vec.y;
    }

    scalar(factor: number): Vector2 {
        return new Vector2(this.x * factor, this.y * factor);
    }

    sum(vec: Vector2): Vector2 {
        return new Vector2(this.x + vec.x, this.y + vec.y);
    }
}