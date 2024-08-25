import type IEntity from '../IEntity';
import { Assets, Sprite, type Renderer, type Texture, Point, EventEmitter } from 'pixi.js';
import Vector2 from '../../core/math/Vector2';
import Transform from '../../core/components/Transform';
import type Player from './Player';
import MathUtils from '../../core/math/MathUtils';

type BulletEventTypes = {
    destroy: () => void,
};

export default class Bullet extends EventEmitter<BulletEventTypes> implements IEntity {
    private static readonly TEXTURE_PATH = '/assets/sprites/player/bullet.png';

    private readonly _transform: Transform;

    private texture!: Texture;
    private sprite!: Sprite;

    isLoaded: boolean = false;

    public speed = 5;

    get transform(): Transform {
        return this._transform;
    }

    constructor(private readonly renderer: Renderer, private readonly player: Player) {
        super();

        this._transform = new Transform();

        this.transform.position = MathUtils.rotatePoint(new Point(player.transform.position.x, player.transform.position.y - 25), player.transform.rotation * Math.PI / 180, this.player.transform.position);
        this.transform.rotation = player.transform.rotation;

        this.speed += this.player.velocity.magnitude();
    }

    async load(): Promise<void> {
        this.texture = await Assets.load(Bullet.TEXTURE_PATH);

        this.sprite = Sprite.from(this.texture);
        this.sprite.anchor = .5;

        this.player.bulletsContainer.addChild(this.sprite);

        this.isLoaded = true;
    }

    render(): void {
        if (!this.isLoaded) {
            return;
        }

        this.sprite.position = this.transform.position;
        this.sprite.rotation = this.transform.rotation;
    }

    update(deltaTime: number): void {
        const velocity = new Vector2(0, -1).rotate(this.transform.rotation).scalar(this.speed * deltaTime);
        this.transform.position = new Vector2(this.transform.position.x , this.transform.position.y).sum(velocity).toPoint();

        if (!this.renderer.screen.contains(this.transform.position.x, this.transform.position.y)) {
            this.player.bulletsContainer.removeChild(this.sprite);
            this.emit('destroy');
        }
    }

}