import InputManager from '../../managers/InputManager';
import type Player from './Player';
import Vector2 from '../../core/math/Vector2';
import MathUtils from '../../core/math/MathUtils';
import { Point, type Renderer } from 'pixi.js';

export default class PlayerController {
    private readonly inputManager: InputManager;
    private velocity: Vector2 = Vector2.zero;

    constructor(
        private readonly player: Player,
        private readonly renderer: Renderer,
    ) {
        this.inputManager = InputManager.instance;
    }

    update(deltaTime: number): void {
        const rotation = this.getRotationInput();
        const acceleration = this.getInputAcceleration();

        this.player.transform.rotation += rotation;

        const thrusterForce = new Vector2(0, acceleration).rotate(this.player.transform.rotation);
        const frictionForce = this.velocity.scalar(-this.player.friction * deltaTime);

        this.velocity = this.velocity.sum(thrusterForce.sum(frictionForce).scalar(deltaTime));

        this.velocity.x = MathUtils.clamp(this.velocity.x, -this.player.maxSpeed, this.player.maxSpeed);
        this.velocity.y = MathUtils.clamp(this.velocity.y, -this.player.maxSpeed, this.player.maxSpeed);

        this.player.transform.position = this.moveTo(this.velocity);
    }

    private getRotationInput(): number {
        const gamepad = this.inputManager.getGamepad(0);

        if (this.inputManager.getKeyboard().isKeyPressed('Right')) {
            return this.player.rotationSpeed;
        }

        if (this.inputManager.getKeyboard().isKeyPressed('Left')) {
            return -this.player.rotationSpeed;
        }

        if (gamepad && gamepad.getStick('Left').position.x !== 0) {
            const value = MathUtils.linearInterpolation(0, 1, 0, this.player.rotationSpeed, Math.abs(gamepad.getStick('Left').position.x));
            return gamepad.getStick('Left').position.x < 0 ? -value : value;
        }

        return 0;
    }

    private getInputAcceleration(): number {
        const gamepad = this.inputManager.getGamepad(0);

        if (this.inputManager.getKeyboard().isKeyPressed('Up')) {
            return -this.player.acceleration;
        }

        if (this.inputManager.getKeyboard().isKeyPressed('Down')) {
            return this.player.acceleration;
        }

        if (gamepad && gamepad.getStick('Left').position.y !== 0) {
            const value = MathUtils.linearInterpolation(0, 1, 0, this.player.acceleration, Math.abs(gamepad.getStick('Left').position.y));
            return gamepad.getStick('Left').position.y < 0 ? -value : value;
        }

        return 0;
    }

    private moveTo(velocity: Vector2): Point {
        const clampedPosition = new Vector2(this.player.transform.position.x, this.player.transform.position.y).sum(velocity);
        clampedPosition.x = MathUtils.clamp(clampedPosition.x, 32, this.renderer.screen.width - 32);
        clampedPosition.y = MathUtils.clamp(clampedPosition.y, 32, this.renderer.screen.height - 32);

        return clampedPosition.toPoint();
    }
}