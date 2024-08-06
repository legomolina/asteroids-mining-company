import {
    Assets,
    Point, Polygon,
    Sprite,
    Spritesheet,
    type Texture,
    type Ticker,
} from 'pixi.js';
import { InputManager } from '../../managers/InputManager';
import { Vector2 } from '../../math/Vector2';
import { Keys } from '../../core/input/Keyboard';
import { Collidable } from '../Collidable';

export class Player extends Collidable {
    private static readonly ATLAS_FILE = '/assets/player/data.json';

    private isThrusterActive = false;
    private input = InputManager.instance;
    private spritesheet!: Spritesheet;

    private acceleration = .2;
    private directionAngle: number = 0;
    private direction: Vector2 = Vector2.zero;
    private inertia = .007;
    private maxSpeed = 8;
    private rotationSpeed: number = 5;

    private isColliding = false;
    hitBox!: Polygon;

    get idleTexture(): Texture {
        return this.spritesheet.textures['player_idle']!;
    }

    get thrustTexture(): Texture {
        return this.spritesheet.textures['player_thrust']!;
    }

    async loadContent(): Promise<void> {
        const playerAtlas = await fetch(Player.ATLAS_FILE).then((res) => res.json());
        const texture = await Assets.load(playerAtlas.meta.image);

        this.spritesheet = new Spritesheet(texture, playerAtlas);

        await this.spritesheet.parse();

        this.texture = this.idleTexture;
        this.sprite = new Sprite(this.texture);

        this.sprite.anchor.set(0.5);

        this.hitBox = this.createHitBox();

        this.addChild(this.sprite);
    }

    update(ticker: Ticker): void {
        super.update(ticker);
        const rotation = this.getPlayerRotationDirection(ticker.deltaTime);
        const direction = this.getPlayerMoveDirection();

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
    }

    onCollision(other: Collidable): void {
        this.isColliding = true;
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

    private moveTo(velocity: Vector2): void {
        const clampedPosition: Vector2 = new Vector2(this.x, this.y).sum(velocity);
        clampedPosition.x = Math.clamp(clampedPosition.x, this.width / 2, this.renderer.screen.width - this.width / 2);
        clampedPosition.y = Math.clamp(clampedPosition.y, this.height / 2, this.renderer.screen.height - this.height / 2);

        this.position = clampedPosition.toPoint();
    }

    private createHitBox(): Polygon {
        const rotate = (point: Point, angle: number): Point => {
            return new Point(point.x * Math.cos(angle) - point.y * Math.sin(angle), point.x * Math.sin(angle) + point.y * Math.cos(angle));
        };

        const polygonPoints = [
            rotate(new Point(-12, -20), this.directionAngle * Math.PI / 180),
            rotate(new Point(12, -20), this.directionAngle * Math.PI / 180),
            rotate(new Point(12, 12), this.directionAngle * Math.PI / 180),
            rotate(new Point(-12, 12), this.directionAngle * Math.PI / 180),
        ];

        return new Polygon(polygonPoints);
    }
}