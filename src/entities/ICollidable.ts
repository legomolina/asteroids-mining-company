import type IEntity from './IEntity';
import type { ShapePrimitive } from 'pixi.js';

export interface ICollidable extends IEntity {
    hitBox: ShapePrimitive;
    isColliding: boolean;

    onCollision(other: ICollidable): void;
}