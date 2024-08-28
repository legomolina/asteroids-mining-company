import { Point, type Circle, type Rectangle, type Polygon, Triangle } from 'pixi.js';
import Vector2 from '../math/Vector2';
import ShapeUtils from '../math/ShapeUtils';

/**
 * Functions taken from [Jeff Thompson guide to collision detection](https://www.jeffreythompson.org/collision-detection/index.php)
 */

export type Line = [Point, Point];

export default class CollisionTester {
    static point2point(point1: Point, point2: Point): boolean {
        return point1.x === point2.x && point1.y === point2.y;
    }

    static point2circle(point: Point, circle: Circle): boolean {
        const distance = Vector2.fromPoints(point, new Point(circle.x, circle.y)).magnitude();
        return distance < circle.radius;
    }

    static circle2circle(circle1: Circle, circle2: Circle): boolean {
        const distance = Vector2.fromPoints(new Point(circle1.x, circle1.y), new Point(circle2.x, circle2.y)).magnitude();
        return distance < circle1.radius + circle2.radius;
    }

    static point2rectangle(point: Point, rectangle: Rectangle): boolean {
        return point.x >= rectangle.x &&
            point.x <= rectangle.x + rectangle.width &&
            point.y >= rectangle.y &&
            point.y <= rectangle.y + rectangle.height;
    }

    static rectangle2rectangle(rectangle1: Rectangle, rectangle2: Rectangle): boolean {
        return rectangle1.x + rectangle1.width >= rectangle2.x &&
            rectangle1.x <= rectangle2.x + rectangle2.width &&
            rectangle1.y + rectangle1.height >= rectangle2.y &&
            rectangle1.y <= rectangle2.y + rectangle2.height;
    }

    static circle2rectangle(circle: Circle, rectangle: Rectangle): boolean {
        let testX = circle.x;
        let testY = circle.y;

        if (circle.x < rectangle.x) {
            testX = rectangle.x;
        } else if (circle.x > rectangle.x + rectangle.width) {
            testX = rectangle.x + rectangle.width;
        }

        if (circle.y < rectangle.y) {
            testY = rectangle.y;
        } else if (circle.y > rectangle.y + rectangle.height) {
            testY = rectangle.y + rectangle.height;
        }

        const distance = Vector2.fromPoints(new Point(circle.x, circle.y), new Point(testX, testY)).magnitude();

        return distance <= circle.radius;
    }

    static line2point(line: Line, point: Point): boolean {
        const THRESHOLD = .1;

        const lineLength = Vector2.fromPoints(line[0], line[1]).magnitude();
        const distanceToVertex1 = Vector2.fromPoints(line[0], point).magnitude();
        const distanceToVertex2 = Vector2.fromPoints(line[1], point).magnitude();

        return distanceToVertex1 + distanceToVertex2 >= lineLength - THRESHOLD && distanceToVertex1 + distanceToVertex2 <= lineLength + THRESHOLD;
    }

    static line2circle(line: Line, circle: Circle): boolean {
        const insideVertex1 = this.point2circle(line[0], circle);
        const insideVertex2 = this.point2circle(line[1], circle);

        if (insideVertex1 || insideVertex2) {
            return true;
        }

        const lineLength = Vector2.fromPoints(line[0], line[1]).magnitude();
        const dotProduct = (((circle.x - line[0].x) * (line[1].x - line[0].x)) + ((circle.y - line[0].y) * (line[1].y - line[0].y))) / Math.pow(lineLength, 2);
        const closestPoint = new Point(line[0].x + (dotProduct * (line[1].x - line[0].x)), line[0].y + (dotProduct * (line[1].y - line[0].y)));

        const pointIsOnSegment = this.line2point(line, closestPoint);

        if (!pointIsOnSegment) {
            return false;
        }

        const circleToClosestLinePointDistance = Vector2.fromPoints(new Point(circle.x, circle.y), closestPoint).magnitude();

        return circleToClosestLinePointDistance <= circle.radius;
    }

    static line2line(line1: Line, line2: Line): boolean {
        const x1 = line1[0].x;
        const x2 = line1[1].x;
        const x3 = line2[0].x;
        const x4 = line2[1].x;
        const y1 = line1[0].y;
        const y2 = line1[1].y;
        const y3 = line2[0].y;
        const y4 = line2[1].y;

        const uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
        const uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

        if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
            // const intersectionPoint = new Point(x1 + (uA * (x2 - x1)), y1 + (uA * (y2 - y1)));
            return true;
        }

        return false;
    }

    static line2rectangle(line: Line, rectangle: Rectangle): boolean {
        const left = this.line2line(line, [new Point(rectangle.x, rectangle.y), new Point(rectangle.x, rectangle.y + rectangle.height)]);
        const right = this.line2line(line, [new Point(rectangle.x + rectangle.width, rectangle.y), new Point(rectangle.x + rectangle.width, rectangle.y + rectangle.height)]);
        const top = this.line2line(line, [new Point(rectangle.x, rectangle.y), new Point(rectangle.x, rectangle.y + rectangle.height)]);
        const bottom = this.line2line(line, [new Point(rectangle.x, rectangle.y + rectangle.height), new Point(rectangle.x + rectangle.width, rectangle.y + rectangle.height)]);

        return left || right || top || bottom;
    }

    static polygon2point(polygon: Polygon, point: Point): boolean {
        const vertices = ShapeUtils.polygonNumbersToPoints(polygon.points);
        let collision = false;

        for (let current = 0, next = 0; current < vertices.length; current++) {
            next = current + 1;
            if (next === vertices.length) {
                next = 0;
            }

            const currentVertex = vertices[current];
            const nextVertex = vertices[next];

            if (!currentVertex || !nextVertex) {
                continue;
            }

            if (((currentVertex.y > point.y) !== (nextVertex.y > point.y)) && (point.x < (nextVertex.x - currentVertex.x) * (point.y - currentVertex.y) / (nextVertex.y - currentVertex.y) + currentVertex.x)) {
                collision = !collision;
            }
        }

        return collision;
    }

    static polygon2circle(polygon: Polygon, circle: Circle): boolean {
        const vertices = ShapeUtils.polygonNumbersToPoints(polygon.points);

        for (let current = 0, next = 0; current < vertices.length; current++) {
            next = current + 1;
            if (next === vertices.length) {
                next = 0;
            }

            const currentVertex = vertices[current];
            const nextVertex = vertices[next];

            if (!currentVertex || !nextVertex) {
                continue;
            }

            const collision = this.line2circle([currentVertex, nextVertex], circle);
            if (collision) {
                return true;
            }
        }

        // Checks if circle is INSIDE the polygon. Without this only checks when circle is "touching" any edge
        // const centerInside = poly2point(polygon, new Point(circle.x, circle.y));
        // if (centerInside) {
        //     return true;
        // }

        return false;
    }

    static polygon2rectangle(polygon: Polygon, rectangle: Rectangle): boolean {
        const vertices = ShapeUtils.polygonNumbersToPoints(polygon.points);

        for (let current = 0, next = 0; current < vertices.length; current++) {
            next = current + 1;
            if (next === vertices.length) {
                next = 0;
            }

            const currentVertex = vertices[current];
            const nextVertex = vertices[next];

            if (!currentVertex || !nextVertex) {
                continue;
            }

            const collision = this.line2rectangle([currentVertex, nextVertex], rectangle);
            if (collision) {
                return true;
            }
        }

        // Checks if rectangle is INSIDE the polygon. Without this only checks when rectangle edges are "touching" any edge
        // const centerInside = poly2point(polygon, new Point(rectangle.x, rectangle.y));
        // if (centerInside) {
        //     return true;
        // }

        return false;
    }

    static polygon2line(polygon: Polygon, line: Line): boolean {
        const vertices = ShapeUtils.polygonNumbersToPoints(polygon.points);

        for (let current = 0, next = 0; current < vertices.length; current++) {
            next = current + 1;
            if (next === vertices.length) {
                next = 0;
            }

            const currentVertex = vertices[current];
            const nextVertex = vertices[next];

            if (!currentVertex || !nextVertex) {
                continue;
            }

            const collision = this.line2line([currentVertex, nextVertex], line);
            if (collision) {
                return true;
            }
        }

        return false;
    }

    static polygon2polygon(polygon1: Polygon, polygon2: Polygon): boolean {
        const vertices = ShapeUtils.polygonNumbersToPoints(polygon1.points);

        for (let current = 0, next = 0; current < vertices.length; current++) {
            next = current + 1;
            if (next === vertices.length) {
                next = 0;
            }

            const currentVertex = vertices[current];
            const nextVertex = vertices[next];

            if (!currentVertex || !nextVertex) {
                continue;
            }

            const collision = this.polygon2line(polygon2, [currentVertex, nextVertex]);
            if (collision) {
                return true;
            }

            // Checks if polygon is INSIDE the polygon. Without this only checks when polygon edges are "touching" any edge
            // const centerInside = polygon2point(polygon1, new Point(polygon2.points[0], polygon2.points[1]));
            // if (centerInside) {
            //     return true;
            // }
        }

        return false;
    }

    static triangle2point(triangle: Triangle, point: Point): boolean {
        const area = Math.abs((triangle.x2 - triangle.x) * (triangle.y3 - triangle.y) - (triangle.x3 - triangle.x) * (triangle.y2 - triangle.y));

        const area1 = Math.abs((triangle.x - point.x) * (triangle.y2 - point.y) - (triangle.x2 - point.x) * (triangle.y - point.y));
        const area2 = Math.abs((triangle.x2 - point.x) * (triangle.y3 - point.y) - (triangle.x3 - point.x) * (triangle.y2 - point.y));
        const area3 = Math.abs((triangle.x3 - point.x) + (triangle.y - point.y) - (triangle.x - point.x) * (triangle.y3 - point.y));

        return area1 + area2 + area3 === area;
    }
}