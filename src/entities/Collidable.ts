import { Graphics, Point, Polygon, type Ticker } from 'pixi.js';
import { Entity } from './Entity';

export abstract class Collidable extends Entity {
    private debugGraphics = new Graphics();

    protected abstract hitBox: Polygon;
    protected debugColor = '#FF0000';

    abstract onCollision(other: Collidable): void;

    async initialize(): Promise<void> {
        super.initialize();
        this.addChild(this.debugGraphics);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update(_: Ticker) {
        if (this.debug) {
            this.debugGraphics
                .clear()
                .poly(this.hitBox.points)
                .stroke(this.debugColor);
        } else {
            this.debugGraphics.clear();
        }
    }

    toWorldHitBox(): Polygon {
        const worldPolygon = new Polygon();

        for (let i = 0; i < this.hitBox.points.length; i += 2) {
            const point = this.toGlobal(new Point(this.hitBox.points[i], this.hitBox.points[i + 1]));

            worldPolygon.points.push(point.x, point.y);
        }

        return worldPolygon;
    };
}