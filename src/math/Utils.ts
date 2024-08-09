import { Point } from 'pixi.js';

declare global {
    interface Math {
        clamp(value: number, min: number, max: number): number;
        lerp(x: number, y: number, a: number): number;
        invLerp(x: number, y: number, a: number): number;
        linearInterpolation(x1: number, y1: number, x2: number, y2: number, a: number): number;
        randomRange(min: number, max: number): number;
        roundToDecimal(value: number, decimalPlaces: number): number;
    }
}

Math.clamp = (value: number, min: number, max: number): number => {
    return Math.max(min, Math.min(value, max));
};

Math.lerp = (x: number, y: number, a: number): number => {
    return x * (1 - a) + y * a;
};

Math.invLerp = (x: number, y: number, a: number) => {
    return Math.clamp((a - x) / (y - x), 0, 1);
};

Math.linearInterpolation = (x1: number, y1: number, x2: number, y2: number, a: number): number => {
    return Math.lerp(x2, y2, Math.invLerp(x1, y1, a));
};

Math.randomRange = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min) + min);
};

Math.roundToDecimal = (value: number, decimalPlaces: number): number => {
    const multiplier = Math.pow(10, decimalPlaces);
    return Math.round(value * multiplier) / multiplier;
};

export function rotatePoint(point: Point, angle: number, origin = new Point(0, 0)): Point {
    const displacement = new Point(point.x - origin.x, point.y - origin.y);
    const rotation = new Point(displacement.x * Math.cos(angle) - displacement.y * Math.sin(angle), displacement.x * Math.sin(angle) + displacement.y * Math.cos(angle));
    return new Point(rotation.x + origin.x, rotation.y + origin.y);
}