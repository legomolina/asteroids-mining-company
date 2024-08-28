import {
    Assets, type Circle,
    type Container,
    type ContainerChild, EventEmitter, type Graphics,
    type Renderer,
    Sprite,
    type Texture,
} from 'pixi.js';
import type { ICollidable } from '../ICollidable';
import Vector2 from '../../core/math/Vector2';
import Transform from '../../core/components/Transform';
import Debug from '../../core/debug/Debug';
import ScoreManager from '../../managers/ScoreManager';
import Bullet from '../player/Bullet';

type AsteroidEventTypes = {
    destroy: () => void,
};

export default abstract class Asteroid extends EventEmitter<AsteroidEventTypes> implements ICollidable {
    private readonly _transform: Transform;

    protected readonly abstract asteroidName: string;
    protected readonly abstract texturePath: string;

    protected readonly scoreManager: ScoreManager;
    protected texture!: Texture;
    protected sprite!: Sprite;
    protected debugGraphics: Graphics | null = null;

    abstract hitBox: Circle;
    abstract isColliding: boolean;

    isLoaded: boolean = false;

    public abstract direction: Vector2;
    public abstract health: number;
    public abstract score: number;
    public abstract rotationSpeed: number;
    public abstract speed: number;

    get transform(): Transform {
        return this._transform;
    }

    protected constructor(
        private readonly container: Container<ContainerChild>,
        private readonly renderer: Renderer,
    ) {
        super();

        this._transform = new Transform();
        this.scoreManager = ScoreManager.instance;
    }

    onCollision(other: ICollidable): void {
        if (other instanceof Bullet) {
            this.scoreManager.increment(this.score);
            this.destroy();
        }
    }

    async load(): Promise<void> {
        this.texture = await Assets.load<Texture>(this.texturePath);
        this.sprite = Sprite.from(this.texture);

        this.sprite.anchor = .5;
        this.sprite.label = this.asteroidName;

        this.hitBox = this.createHitBox();
        this.debugGraphics = Debug.drawCircle(this.hitBox);

        this.container.addChild(this.sprite, this.debugGraphics);

        this.isLoaded = true;
    }

    render(): void {
        if (!this.isLoaded) {
            return;
        }

        this.sprite.position = this.transform.position;
        this.sprite.angle = this.transform.rotation;

        Debug.drawCircle(this.hitBox, this.debugGraphics);
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

        this.hitBox = this.createHitBox();
    }

    protected abstract createHitBox(): Circle;

    private destroy(): void {
        this.container.removeChild(this.sprite);
        this.container.removeChild(this.debugGraphics!);
        this.emit('destroy');
    }
}