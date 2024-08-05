import { Entity } from '../Entity';
import { type Renderer, Sprite, type Texture, type Ticker } from 'pixi.js';
import { Vector2 } from '../../math/Vector2';

export class Asteroid extends Entity<Sprite> {
    private rotationSpeed: number = Math.randomRange(-2, 2);
    private speed: number = 2 + Math.random();

    constructor(renderer: Renderer, texture: Texture) {
        super(renderer);

        this.texture = texture;
    }

    async loadContent(): Promise<void> {
        this.sprite = new Sprite(this.texture);

        this.sprite.anchor.set(0.5);
        this.angle = Math.randomRange(0, 360);

        this.addChild(this.sprite);
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