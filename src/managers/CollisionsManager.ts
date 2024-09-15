import type { ICollidable } from '../entities/ICollidable';
import { type Circle, type Polygon } from 'pixi.js';
import CollisionTester from '../core/collisions/CollisionTester';

export default class CollisionsManager {
    private collidables: ICollidable[];

    constructor() {
        this.collidables = [];
    }

    insert(...collidables: ICollidable[]): void {
        this.collidables.push(...collidables);
    }

    remove(collidable: ICollidable): void {
        this.collidables = this.collidables.filter((c) => c !== collidable);
    }

    update(): void {
        this.collidables.forEach((collidable: ICollidable): void => {
            for (const c of this.collidables) {
                if (c === collidable) {
                    continue;
                }

                if (this.testCollisions(collidable, c)) {
                    c.onCollision(collidable);
                    collidable.onCollision(c);
                }
            }
        });
    }

    private testCollisions(collidable: ICollidable, other: ICollidable): boolean {
        if (collidable.hitBox.type === 'circle' && other.hitBox.type === 'circle') {
            return CollisionTester.circle2circle(collidable.hitBox as Circle, other.hitBox as Circle);
        }

        if (collidable.hitBox.type === 'polygon' && other.hitBox.type === 'polygon') {
            return CollisionTester.polygon2polygon(collidable.hitBox as Polygon, other.hitBox as Polygon);
        }

        if ((collidable.hitBox.type === 'circle' && other.hitBox.type === 'polygon') || (collidable.hitBox.type === 'polygon' && other.hitBox.type === 'circle')) {
            const polygon = collidable.hitBox.type === 'polygon' ? collidable.hitBox as Polygon : other.hitBox as Polygon;
            const circle = collidable.hitBox.type === 'circle' ? collidable.hitBox as Circle : other.hitBox as Circle;
            return CollisionTester.polygon2circle(polygon, circle);
        }

        return false;
    }
}