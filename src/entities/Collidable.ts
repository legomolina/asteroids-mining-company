import type { Updatable } from '../core/Updatable';
import type { Polygon } from 'pixi.js';

export interface Collidable extends Updatable {
    hitBox: Polygon;

    onCollision(other: Collidable): void;
    toWorldHitBox(): Polygon;
}