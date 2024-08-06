import { Entity } from '../Entity';
import { Graphics, Point, Polygon, type Renderer, Sprite, type Texture, type Ticker } from 'pixi.js';
import { Vector2 } from '../../math/Vector2';
import type { Collidable } from '../Collidable';

export enum AsteroidSize {
    SMALL,
    MEDIUM,
    LARGE,
}

export class Asteroid extends Entity<Sprite | Graphics> implements Collidable {
    private rotationSpeed: number = Math.randomRange(-2, 2);
    private speed: number = 2 + Math.random();

    private hitBoxGraphics = new Graphics();
    hitBox!: Polygon;

    constructor(renderer: Renderer, texture: Texture, private size: AsteroidSize) {
        super(renderer);

        this.texture = texture;
    }

    async loadContent(): Promise<void> {
        this.sprite = new Sprite(this.texture);

        this.sprite.anchor.set(0.5);
        this.angle = Math.randomRange(0, 360);

        const calculateOctagonPoint = (radius: number, angle: number, vertex: number): Point => {
            return new Point(radius * Math.cos(angle + vertex * Math.PI / 4), radius * Math.sin(angle + vertex * Math.PI / 4));
        };

        const polygonPoints: Point[] = [];
        const radius = {
            [AsteroidSize.SMALL]: 14,
            [AsteroidSize.MEDIUM]: 20,
            [AsteroidSize.LARGE]: 36,
        }[this.size];

        for (let i = 0; i < 8; i++) {
            polygonPoints.push(calculateOctagonPoint(radius, this.angle, i));
        }

        this.hitBox = new Polygon(polygonPoints);

        this.hitBoxGraphics
            .clear()
            .poly(polygonPoints)
            .stroke('#FF0000');

        this.addChild(this.sprite, this.hitBoxGraphics);
    }

    onCollision(_: Collidable): void {

    }

    toWorldHitBox(): Polygon {
        const worldPolygon = new Polygon();

        for (let i = 0; i < this.hitBox.points.length; i += 2) {
            const point = this.toGlobal(new Point(this.hitBox.points[i], this.hitBox.points[i + 1]));

            worldPolygon.points.push(point.x, point.y);
        }

        return worldPolygon;
    }

    update({ deltaTime }: Ticker) {
        const stagePadding = 100;
        const boundWidth = this.renderer.screen.width + stagePadding * 2;
        const boundHeight = this.renderer.screen.height + stagePadding * 2;

        const direction = new Vector2(this.x, this.y).sum(
            new Vector2(0, -1)
                .rotate(this.angle)
                .scalar(this.speed * deltaTime),
        );

        this.position = direction.toPoint();

        this.sprite!.angle += this.rotationSpeed * deltaTime;

        if (this.x < -stagePadding) {
            this.x += boundWidth;
        }

        if (this.x > this.renderer.screen.width + stagePadding) {
            this.x -= boundWidth;
        }

        if (this.y < -stagePadding) {
            this.y += boundHeight;
        }

        if (this.y > this.renderer.screen.height + stagePadding) {
            this.y -= boundHeight;
        }
    }
}