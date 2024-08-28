import { Point } from 'pixi.js';

export default class MathUtils {
    // Interpolation functions
    static clamp(value: number, min: number, max: number): number {
        return Math.max(min, Math.min(value, max));
    }

    static lerp (x: number, y: number, a: number): number {
        return x * (1 - a) + y * a;
    }

    static invLerp (x: number, y: number, a: number): number {
        return MathUtils.clamp((a - x) / (y - x), 0, 1);
    }

    static linearInterpolation (x1: number, y1: number, x2: number, y2: number, a: number): number {
        return MathUtils.lerp(x2, y2, MathUtils.invLerp(x1, y1, a));
    }

    // Decimal functions
    static roundToDecimal(value: number, decimalPlaces: number = 2): number {
        const multiplier = Math.pow(10, decimalPlaces);
        return Math.round(value * multiplier) / multiplier;
    }

    static rotatePoint(point: Point, angle: number, origin = new Point(0, 0)): Point {
        const rotationInRadians = angle * Math.PI / 180;
        const displacement = new Point(point.x - origin.x, point.y - origin.y);
        const rotation = new Point(displacement.x * Math.cos(rotationInRadians) - displacement.y * Math.sin(rotationInRadians), displacement.x * Math.sin(rotationInRadians) + displacement.y * Math.cos(rotationInRadians));
        return new Point(rotation.x + origin.x, rotation.y + origin.y);
    }

    static randomRange(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min) + min);
    }
}