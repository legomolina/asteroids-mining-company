import { Collidable } from '../Collidable';
import { Assets, Point, Polygon, type Renderer, Sprite, type Ticker } from 'pixi.js';
import { Vector2 } from '../../math/Vector2';
import { Asteroid } from '../asteroids/Asteroid';

export class Bullet extends Collidable {
    private static readonly TEXTURE_PATH = '/assets/bullet.png';

    private readonly speed: number = 5;

    protected hitBox!: Polygon;

    constructor(renderer: Renderer, initialSpeed: number) {
        super(renderer);

        this.label = 'bullet';
        this.speed += initialSpeed;
    }

    async loadContent(): Promise<void> {
        this.texture = await Assets.load(Bullet.TEXTURE_PATH);
        this.sprite = new Sprite(this.texture);

        this.sprite.anchor.set(0.5);
        this.sprite.x = 0;
        this.sprite.y = 0;

        this.hitBox = this.createHitBox();

        this.addChild(this.sprite);

        this.loaded = true;
    }

    onCollision(other: Collidable): void {
        if (other instanceof Asteroid) {
            this.emit('destroy');
        }
    }

    update(ticker: Ticker): void {
        super.update(ticker);

        const velocity = new Vector2(0, -1).rotate(this.angle).scalar(this.speed * ticker.deltaTime);
        this.moveTo(velocity);

        this.hitBox = this.createHitBox();

        if (!this.renderer.screen.contains(this.x, this.y)) {
            this.emit('destroy');
        }
    }

    private moveTo(velocity: Vector2): void {
        this.position = new Vector2(this.x, this.y).sum(velocity);
    }

    private createHitBox(): Polygon {
        return new Polygon([
            new Point(-5, 5),
            new Point(-5, -5),
            new Point(5,  -5),
            new Point(5, 5),
        ]);
    }
}