import { type Circle, Graphics, type Polygon, type Rectangle, type StrokeInput } from 'pixi.js';

export default class Debug {
    static enabled: boolean = false;

    static drawRectangle(rectangle: Rectangle, graphics: Graphics | null = null, strokeStyle: StrokeInput = 'red'): Graphics {
        graphics ??= new Graphics();

        graphics.visible = Debug.enabled;

        return graphics
            .clear()
            .rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height)
            .stroke(strokeStyle);
    }

    static drawPoly(polygon: Polygon, graphics: Graphics | null = null, strokeStyle: StrokeInput = 'red'): Graphics {
        graphics ??= new Graphics();

        graphics.visible = Debug.enabled;

        return graphics
            .clear()
            .poly(polygon.points)
            .stroke(strokeStyle);
    }

    static drawCircle(circle: Circle, graphics: Graphics | null = null, strokeStyle: StrokeInput = 'red'): Graphics {
        graphics ??= new Graphics();

        graphics.visible = Debug.enabled;

        return graphics
            .clear()
            .circle(circle.x, circle.y, circle.radius)
            .stroke(strokeStyle);
    }
}