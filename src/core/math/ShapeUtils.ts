import { Point } from 'pixi.js';

export default class ShapeUtils {
    static polygonNumbersToPoints(points: number[]): Point[] {
        const vertices: Point[] = [];

        for (let i = 0; i < points.length; i += 2) {
            vertices.push(new Point(points[i], points[i + 1]));
        }

        return vertices;
    }
}