import Keyboard from '../core/input/Keyboard';
import Gamepad from '../core/input/Gamepad';

export default class InputManager {
    private static _instance?: InputManager;

    private readonly keyboard: Keyboard;
    private readonly gamepads: Gamepad[] = [];

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

    getKeyboard(): Keyboard {
        return this.keyboard;
    }

    getGamepad(index: number): Gamepad | undefined {
        return this.gamepads[index];
    }

    update(): void {
        this.keyboard.update();

        this.gamepads.forEach((gamepad) => {
            gamepad.update();
        });
    }
}