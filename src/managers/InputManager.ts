import { Keyboard } from '../core/input/Keyboard';
import type { Updatable } from '../core/Updatable';

export class InputManager implements Updatable {
    private static _instance?: InputManager;

    readonly keyboard: Keyboard;

    static get instance(): InputManager {
        InputManager._instance ??= new InputManager();
        return InputManager._instance;
    }

    private constructor() {
        this.keyboard = new Keyboard();
    }

    update(): void {
        this.keyboard.update();
    }
}