import { type Container, type ContainerChild, type Renderer, Sprite, type Texture } from 'pixi.js';
import type IEntity from '../IEntity';
import Transform from '../../core/components/Transform';
import Vector2 from '../../core/math/Vector2';
import MathUtils from '../../core/math/MathUtils';

export type AsteroidSize = 'small' | 'medium' | 'large';

export default class Asteroid implements IEntity {
    private readonly _transform: Transform;

    private sprite!: Sprite;

    isLoaded: boolean = false;

    public direction: Vector2;
    public health: number;
    public score: number;
    public speed: number;
    public rotationSpeed: number;

    get transform(): Transform {
        return this._transform;
    }

    constructor(
        private readonly container: Container<ContainerChild>,
        private readonly renderer: Renderer,
        private readonly texture: Texture,
        private readonly size: AsteroidSize,
    ) {
        this._transform = new Transform();

        this.direction = Vector2.zero;
        this.health = this.getHealth();
        this.score = this.getScore();
        this.speed = 2 + Math.random();
        this.rotationSpeed = MathUtils.randomRange(-2, 2);
    }

    async load(): Promise<void> {
        this.sprite = Sprite.from(this.texture);

        this.sprite.anchor = .5;
        this.sprite.label = this.getLabel();

        this.container.addChild(this.sprite);

        this.isLoaded = true;
    }

    render(): void {
        if (!this.isLoaded) {
            return;
        }

        this.sprite.position = this.transform.position;
        this.sprite.angle = this.transform.rotation;
    }

    update(deltaTime: number): void {
        const stagePadding = 100;
        const boundWidth = this.renderer.screen.width + stagePadding * 2;
        const boundHeight = this.renderer.screen.height + stagePadding * 2;

        const velocity = new Vector2(this.transform.position.x, this.transform.position.y)
            .sum(
                new Vector2(0, -1)
                    .rotate(this.direction.angleBetween(new Vector2(1, 0)))
                    .scalar(this.speed * deltaTime),
            );

        this.transform.position = velocity.toPoint();
        this.transform.rotation += this.rotationSpeed * deltaTime;

        if (this.transform.position.x < -stagePadding) {
            this.transform.position.x += boundWidth;
        }

        if (this.transform.position.x > this.renderer.screen.width + stagePadding) {
            this.transform.position.x -= boundWidth;
        }

        if (this.transform.position.y < -stagePadding) {
            this.transform.position.y += boundHeight;
        }

        if (this.transform.position.y > this.renderer.screen.height + stagePadding) {
            this.transform.position.y -= boundHeight;
        }
    }

    private getLabel(): string {
        return {
            small: 'asteroid-small',
            medium: 'asteroid-medium',
            large: 'asteroid-large',
        }[this.size];
    }

    private getHealth(): number {
        return {
            small: 1,
            medium: 2,
            large: 3,
        }[this.size];
    }

    private getScore(): number {
        return {
            small: 10,
            medium: 20,
            large: 40,
        }[this.size];
    }
}