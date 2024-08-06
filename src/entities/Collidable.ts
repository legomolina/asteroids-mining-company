import { Graphics, Point, Polygon, type Ticker } from 'pixi.js';
import { Entity } from './Entity';

export abstract class Collidable extends Entity {
    private debugGraphics = new Graphics();

    protected abstract hitBox: Polygon;
    protected debugColor = '#FF0000';

    abstract onCollision(other: Collidable): void;

    async initialize(): Promise<void> {
        this.addChild(this.debugGraphics);
    }

    update(_ticker: Ticker) {
        super.update(_ticker);

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