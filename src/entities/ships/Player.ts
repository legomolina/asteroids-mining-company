import {
    Assets,
    Point,
    Polygon, type Renderer,
    Sprite,
    Spritesheet,
    type Texture,
    type Ticker,
} from 'pixi.js';
import { InputManager } from '../../managers/InputManager';
import { Vector2 } from '../../math/Vector2';
import { Keys } from '../../core/input/Keyboard';
import { Collidable } from '../Collidable';
import { Bullet } from './Bullet';
import { rotatePoint } from '../../math/Utils';
import type { CollisionManager } from '../../managers/CollisionManager';
import { Asteroid } from '../asteroids/Asteroid';

export class Player extends Collidable {
    private static readonly ATLAS_FILE = '/assets/player/data.json';

    private acceleration = .2;
    private inertia = .007;
    private maxSpeed = 8;
    private rotationSpeed: number = 5;

    private bullets: Bullet[] = [];
    private direction: Vector2 = Vector2.zero;
    private directionAngle: number = 0;
    private spritePosition = new Point(0, 0);
    private isColliding = false;
    private isThrusterActive = false;
    private input = InputManager.instance;
    private spritesheet!: Spritesheet;

    hitBox!: Polygon;

    get idleTexture(): Texture {
        return this.spritesheet.textures['player_idle']!;
    }

    get thrustTexture(): Texture {
        return this.spritesheet.textures['player_thrust']!;
    }

    constructor(renderer: Renderer, private collisionManager: CollisionManager) {
        super(renderer);

        this.label = 'player';
    }

    async loadContent(): Promise<void> {
        const playerAtlas = await fetch(Player.ATLAS_FILE).then((res) => res.json());
        const texture = await Assets.load(playerAtlas.meta.image);

        this.spritesheet = new Spritesheet(texture, playerAtlas);

        await this.spritesheet.parse();

        this.texture = this.idleTexture;
        this.sprite = new Sprite(this.texture);

        this.sprite.anchor.set(0.5);

        this.spritePosition = new Point(this.renderer.screen.width / 2, this.renderer.screen.height / 2);

        this.hitBox = this.createHitBox();

        this.addChild(this.sprite);
    }

    update(ticker: Ticker): void {
        super.update(ticker);

        const rotation = this.getPlayerRotationDirection(ticker.deltaTime);
        const direction = this.getPlayerMoveDirection();

        this.getPlayerShooting();

        this.direction = direction;
        this.directionAngle = rotation;

        const currentVelocity = direction.scalar(ticker.deltaTime);
        this.moveTo(currentVelocity);

        this.sprite!.angle = this.directionAngle;
        this.sprite!.texture = this.isThrusterActive ? this.thrustTexture : this.idleTexture;

        this.hitBox = this.createHitBox();

        if (this.isColliding) {
            this.debugColor = '#00FF00';
        } else {
            this.debugColor = '#FF0000';
        }

        this.isColliding = false;

        this.bullets.forEach((bullet: Bullet) => {
            bullet.update(ticker);
        });
    }

     
    onCollision(other: Collidable): void {
        if (other instanceof Asteroid) {
            this.isColliding = true;
        }
    }

    private getPlayerRotationDirection(deltaTime: number): number {
        let rotation = this.directionAngle;

        if (this.input.keyboard.isKeyDown(Keys.Right)) {
            rotation += this.rotationSpeed * deltaTime;
        }

        if (this.input.keyboard.isKeyDown(Keys.Left)) {
            rotation -= this.rotationSpeed * deltaTime;
        }

        return rotation;
    }

    private getPlayerMoveDirection(): Vector2 {
        let direction = Vector2.zero;

        if (this.input.keyboard.isKeyDown(Keys.Up)) { // Handle thruster forward
            direction = new Vector2(0, -this.acceleration).rotate(this.directionAngle).sum(this.direction);
            direction = direction.sum(this.direction.scalar(-this.inertia * 2));

            this.isThrusterActive = true;

        } else if (this.input.keyboard.isKeyDown(Keys.Down)) { // Handle thruster backward
            direction = new Vector2(0, this.acceleration).rotate(this.directionAngle).sum(this.direction);
            direction = direction.sum(this.direction.scalar(-this.inertia * 2));

            this.isThrusterActive = false;
        } else if (this.direction.x !== 0 || this.direction.y !== 0) { // Handle inertia
            direction = this.direction.sum(this.direction.scalar(-this.inertia));
            this.isThrusterActive = false;
        }

        direction.x = Math.clamp(direction.x, -this.maxSpeed, this.maxSpeed);
        direction.y = Math.clamp(direction.y, -this.maxSpeed, this.maxSpeed);

        return direction;
    }

    private async getPlayerShooting(): Promise<void> {
        if (this.input.keyboard.isKeyReleased(Keys.Space)) {
            const bullet = new Bullet(this.renderer);

            await bullet.initialize();
            await bullet.loadContent();

            bullet.position = rotatePoint(new Point(this.spritePosition.x, this.spritePosition.y - 25), this.directionAngle * Math.PI / 180, this.spritePosition);
            bullet.angle = this.directionAngle;

            bullet.once('destroy', () => {
                this.removeChild(bullet);
                this.collisionManager.remove(bullet);
                this.bullets = this.bullets.filter((b) => b !== bullet);
            });

            this.addChild(bullet);
            this.collisionManager.insert(bullet);
            this.bullets.push(bullet);
        }
    }

    private moveTo(velocity: Vector2): void {
        const clampedPosition: Vector2 = new Vector2(this.spritePosition.x, this.spritePosition.y).sum(velocity);
        clampedPosition.x = Math.clamp(clampedPosition.x, this.sprite!.width / 2, this.renderer.screen.width - this.sprite!.width / 2);
        clampedPosition.y = Math.clamp(clampedPosition.y, this.sprite!.height / 2, this.renderer.screen.height - this.sprite!.height / 2);

        this.spritePosition = clampedPosition.toPoint();
        this.sprite!.position = this.spritePosition;
    }

    private createHitBox(): Polygon {
        const polygonPoints = [
            rotatePoint(new Point(this.sprite!.x - 12, this.sprite!.y - 20), this.directionAngle * Math.PI / 180, this.spritePosition),
            rotatePoint(new Point(this.sprite!.x + 12, this.sprite!.y - 20), this.directionAngle * Math.PI / 180, this.spritePosition),
            rotatePoint(new Point(this.sprite!.x + 12, this.sprite!.y + 12), this.directionAngle * Math.PI / 180, this.spritePosition),
            rotatePoint(new Point(this.sprite!.x - 12, this.sprite!.y + 12), this.directionAngle * Math.PI / 180, this.spritePosition),
        ];

        return new Polygon(polygonPoints);
    }
}