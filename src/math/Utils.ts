import { Point } from 'pixi.js';

declare global {
    interface Math {
        clamp(value: number, min: number, max: number): number;
        randomRange(min: number, max: number): number;
    }
}

Math.clamp = (value: number, min: number, max: number): number => {
    return Math.max(min, Math.min(value, max));
};

Math.randomRange = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min) + min);
};

export function rotatePoint(point: Point, angle: number, origin = new Point(0, 0)): Point {
    const displacement = new Point(point.x - origin.x, point.y - origin.y);
    const rotation = new Point(displacement.x * Math.cos(angle) - displacement.y * Math.sin(angle), displacement.x * Math.sin(angle) + displacement.y * Math.cos(angle));
    return new Point(rotation.x + origin.x, rotation.y + origin.y);
}