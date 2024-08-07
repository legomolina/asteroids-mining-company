import type { Updatable } from '../core/Updatable';
import type { Collidable } from '../entities/Collidable';
import { Container, type Polygon } from 'pixi.js';

export class CollisionManager extends Container implements Updatable {
    private collidables: Collidable[] = [];

    insert(...collidable: Collidable[]): void {
        this.collidables.push(...collidable);
    }

    remove(collidable: Collidable): void {
        this.collidables = this.collidables.filter((c) => c !== collidable);
    }

    update(): void {
        this.collidables.forEach((collidable: Collidable) => {
            for (const c of this.collidables) {
                if (c === collidable) {
                    continue;
                }

                if (this.intersects(c.toWorldHitBox(), collidable.toWorldHitBox())) {
                    c.onCollision(collidable);
                    collidable.onCollision(c);
                }
            }
        });
    }

    private intersects(poly1: Polygon, poly2: Polygon): boolean {
        for (let i = 0; i < poly1.points.length; i += 2) {
            if (poly2.contains(poly1.points[i]!, poly1.points[i + 1]!)) {
                return true;
            }
        }

        return false;
    }
}