import {
    Assets,
    Container,
    type ContainerChild, type Graphics,
    Point, Polygon,
    Rectangle,
    type Renderer,
    Sprite,
    Spritesheet,
    Texture,
} from 'pixi.js';
import PlayerController from './PlayerController';
import Transform from '../../core/components/Transform';
import type Bullet from './Bullet';
import Vector2 from '../../core/math/Vector2';
import type { ICollidable } from '../ICollidable';
import Debug from '../../core/debug/Debug';
import MathUtils from '../../core/math/MathUtils';
import type { CollisionsManager } from '../../managers/CollisionsManager';
import Asteroid from '../asteoids/Asteroid';

export default class Player implements ICollidable {
    private static readonly SPRITE_SHEET_DATA_PATH = '/assets/sprites/player/data.json';

    private readonly playerController: PlayerController;
    private readonly _transform: Transform;
    private readonly _bulletsContainer: Container<Sprite>;

    private safeAreaPadding = 50;
    private spriteSheet!: Spritesheet;
    private sprite!: Sprite;
    private debugGraphics: Graphics | null = null;

    isColliding: boolean = false;
    hitBox!: Polygon;
    isLoaded: boolean = false;

    public bullets: Bullet[];

    public acceleration = .2;
    public friction = .01;
    public maxSpeed = 8;
    public rotationSpeed = 2.5;
    public texture!: Texture;
    public velocity: Vector2;

    private debugColor = 'red';

    get bulletsContainer(): Container<ContainerChild> {
        return this._bulletsContainer;
    }

    get idleTexture(): Texture {
        return this.spriteSheet.textures['player_idle']!;
    }

    get thrustTexture(): Texture {
        return this.spriteSheet.textures['player_thrust']!;
    }

    get transform() {
        return this._transform;
    }

    get safeArea(): Rectangle {
        if (!this.sprite) {
            return Rectangle.EMPTY;
        }

        return new Rectangle(
            this.transform.position.x - this.sprite.width / 2 - this.safeAreaPadding,
            this.transform.position.y - this.sprite.height / 2 - this.safeAreaPadding,
            this.sprite.width + this.safeAreaPadding * 2,
            this.sprite.height + this.safeAreaPadding * 2,
        );
    }

    constructor(
        private readonly container: Container<ContainerChild>,
        renderer: Renderer,
        collisionsManager: CollisionsManager,
    ) {
        this.playerController = new PlayerController(this, renderer, collisionsManager);
        this._transform = new Transform();

        this.bullets = [];
        this._bulletsContainer = new Container();
        this._bulletsContainer.label = 'Bullets container';

        this.transform.position = new Point(renderer.screen.width / 2, renderer.screen.height / 2);

        this.velocity = Vector2.zero;

        collisionsManager.insert(this);
    }

    onCollision(other: ICollidable): void {
        if (other instanceof Asteroid) {
            this.debugColor = 'green';
        }
    }

    async load(): Promise<void> {
        const spriteSheetData = await fetch(Player.SPRITE_SHEET_DATA_PATH).then((res) => res.json());
        const spriteSheetTexture = await Assets.load(spriteSheetData.meta.image);

        this.spriteSheet = new Spritesheet(spriteSheetTexture, spriteSheetData);
        await this.spriteSheet.parse();

        this.texture = this.spriteSheet.textures['player_idle']!;
        this.sprite = Sprite.from(this.texture);
        this.sprite.anchor = .5;

        this.sprite.label = 'Player';

        this.hitBox = this.createHitBox();
        this.debugGraphics = Debug.drawPoly(this.hitBox, null, this.debugColor);

        this.container.addChild(this.sprite, this.bulletsContainer, this.debugGraphics);

        this.isLoaded = true;
    }

    render(): void {
        if (!this.isLoaded) {
            return;
        }

        this.sprite.position = this.transform.position;
        this.sprite.angle = this.transform.rotation;
        this.sprite.scale = this.transform.scale;

        this.sprite.texture = this.texture;

        this.bullets.forEach((bullet) => {
            bullet.render();
        });

        Debug.drawPoly(this.hitBox, this.debugGraphics, this.debugColor);

        this.debugColor = 'red';
    }

    update(deltaTime: number): void {
        this.playerController.update(deltaTime);

        this.bullets.forEach((bullet) => {
            bullet.update(deltaTime);
        });

        this.hitBox = this.createHitBox();
    }

    private createHitBox(): Polygon {
        const topLeftPoint = new Point(this.transform.position.x - this.sprite.width / 2, this.transform.position.y - this.sprite.height / 2);
        const topRightPoint = new Point(this.transform.position.x - this.sprite.width / 2 + this.sprite.width, this.transform.position.y - this.sprite.height / 2);
        const bottomRightPoint = new Point(this.transform.position.x + this.sprite.width / 2, this.transform.position.y + this.sprite.height / 2);
        const bottomLeftPoint = new Point(this.transform.position.x - this.sprite.width / 2, this.transform.position.y + this.sprite.height / 2);

        return new Polygon(
            MathUtils.rotatePoint(new Point(topLeftPoint.x + 8, topLeftPoint.y), this.transform.rotation, this.transform.position),
            MathUtils.rotatePoint(new Point(topRightPoint.x - 8, topRightPoint.y), this.transform.rotation, this.transform.position),
            MathUtils.rotatePoint(new Point(bottomRightPoint.x, bottomRightPoint.y - 8), this.transform.rotation, this.transform.position),
            MathUtils.rotatePoint(new Point(bottomLeftPoint.x, bottomLeftPoint.y - 8), this.transform.rotation, this.transform.position),
        );
    }
}