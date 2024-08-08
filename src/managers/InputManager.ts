import { Keyboard } from '../core/input/Keyboard';
import type { Updatable } from '../core/Updatable';
import { Gamepad } from '../core/input/Gamepad';

export class InputManager implements Updatable {
    private static _instance?: InputManager;

    readonly gamepads: Record<number, Gamepad> = {};
    readonly keyboard: Keyboard;

    static get instance(): InputManager {
        InputManager._instance ??= new InputManager();
        return InputManager._instance;
    }

    private constructor() {
        this.keyboard = new Keyboard();

        window.addEventListener('gamepadconnected', ({ gamepad }: GamepadEvent) => {
            this.gamepads[gamepad.index] = new Gamepad(gamepad.index);
        });

        window.addEventListener('gamepaddisconnected', ({ gamepad }: GamepadEvent) => {
            delete this.gamepads[gamepad.index];
        });
    }

    update(): void {
        this.keyboard.update();

        Object.values(this.gamepads).forEach((gamepad) => {
            gamepad.update();
        });
    }
}