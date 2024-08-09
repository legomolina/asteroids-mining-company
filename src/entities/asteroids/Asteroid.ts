import { Point, Polygon, type Renderer, Sprite, type Texture, type Ticker } from 'pixi.js';
import { Vector2 } from '../../math/Vector2';
import { Collidable } from '../Collidable';
import { Bullet } from '../ships/Bullet';

export enum AsteroidSize {
    SMALL,
    MEDIUM,
    LARGE,
}

export class Asteroid extends Collidable {
    private health: number = 1;
    private rotationSpeed: number = Math.randomRange(-2, 2);
    private speed: number = 2 + Math.random();

    protected hitBox!: Polygon;

    score = 1;

    constructor(renderer: Renderer, texture: Texture, private size: AsteroidSize) {
        super(renderer);

        this.texture = texture;

        this.label = {
            [AsteroidSize.SMALL]: 'asteroid-small',
            [AsteroidSize.MEDIUM]: 'asteroid-medium',
            [AsteroidSize.LARGE]: 'asteroid-large',
        }[size];

        this.health = {
            [AsteroidSize.SMALL]: 1,
            [AsteroidSize.MEDIUM]: 2,
            [AsteroidSize.LARGE]: 3,
        }[size];

        this.score = {
            [AsteroidSize.SMALL]: 10,
            [AsteroidSize.MEDIUM]: 20,
            [AsteroidSize.LARGE]: 40,
        }[size];
    }

    async loadContent(): Promise<void> {
        this.sprite = new Sprite(this.texture);

        this.sprite.anchor.set(0.5);
        this.angle = Math.randomRange(0, 360);

        this.hitBox = this.createHitBox();
        this.addChild(this.sprite);

        this.loaded = true;
    }

    onCollision(other: Collidable): void {
        if (!(other instanceof Bullet)) {
            return;
        }

        if (--this.health <= 0) {
            this.emit('destroy');
        }
    }

    update(ticker: Ticker) {
        super.update(ticker);

        const { deltaTime } = ticker;
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

    private createHitBox(): Polygon {
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

        return new Polygon(polygonPoints);
    }
}