import {
    Assets,
    Circle,
    Sprite,
    type Renderer,
    type Texture,
    Point,
    EventEmitter, type Graphics,
} from 'pixi.js';
import Vector2 from '../../core/math/Vector2';
import Transform from '../../core/components/Transform';
import type Player from './Player';
import MathUtils from '../../core/math/MathUtils';
import type { ICollidable } from '../ICollidable';
import Debug from '../../core/debug/Debug';
import Asteroid from '../asteoids/Asteroid';

type BulletEventTypes = {
    destroy: () => void,
};

export default class Bullet extends EventEmitter<BulletEventTypes> implements ICollidable {
    private static readonly TEXTURE_PATH = '/assets/sprites/player/bullet.png';

    private readonly _transform: Transform;

    private texture!: Texture;
    private sprite!: Sprite;
    private debugGraphics: Graphics | null = null;

    isColliding: boolean = false;
    hitBox!: Circle;
    isLoaded: boolean = false;

    public speed = 5;

    get transform(): Transform {
        return this._transform;
    }

    constructor(private readonly renderer: Renderer, private readonly player: Player) {
        super();

        this._transform = new Transform();

        this.transform.position = MathUtils.rotatePoint(new Point(player.transform.position.x, player.transform.position.y - 25), player.transform.rotation, this.player.transform.position);
        this.transform.rotation = player.transform.rotation;

        this.speed += this.player.velocity.magnitude();
    }

    onCollision(other: ICollidable) {
        if (other instanceof Asteroid) {
            this.destroy();
        }
    }

    async load(): Promise<void> {
        this.texture = await Assets.load(Bullet.TEXTURE_PATH);

        this.sprite = Sprite.from(this.texture);
        this.sprite.anchor = .5;

        this.hitBox = this.createHitBox();

        this.debugGraphics = Debug.drawCircle(this.hitBox);

        this.player.bulletsContainer.addChild(this.sprite, this.debugGraphics);

        this.isLoaded = true;
    }

    render(): void {
        if (!this.isLoaded) {
            return;
        }

        this.sprite.position = this.transform.position;
        this.sprite.rotation = this.transform.rotation;

        Debug.drawCircle(this.hitBox, this.debugGraphics);
    }

    update(deltaTime: number): void {
        const velocity = new Vector2(0, -1).rotate(this.transform.rotation).scalar(this.speed * deltaTime);
        this.transform.position = new Vector2(this.transform.position.x , this.transform.position.y).sum(velocity).toPoint();

        if (!this.renderer.screen.contains(this.transform.position.x, this.transform.position.y)) {
            this.destroy();
        }

        this.hitBox = this.createHitBox();
    }

    private createHitBox(): Circle {
        return new Circle(this.transform.position.x, this.transform.position.y, 2);
    }

    private destroy(): void {
        this.player.bulletsContainer.removeChild(this.sprite);
        this.player.bulletsContainer.removeChild(this.debugGraphics!);
        this.emit('destroy');
    }
}