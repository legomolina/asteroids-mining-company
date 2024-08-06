import { EventEmitter } from 'pixi.js';
import { Keys } from '../core/input/Keyboard';
import type { Updatable } from '../core/Updatable';
import { InputManager } from './InputManager';

export class DebugManager extends EventEmitter implements Updatable {
    private static _instance?: DebugManager;

    private isDebugging = false;

    get debug(): boolean {
        return this.isDebugging;
    }
    set debug(value: boolean) {
        this.isDebugging = value;
        this.emit('debugChange', value);
    }

    static get instance(): DebugManager {
        DebugManager._instance ??= new DebugManager();
        return DebugManager._instance;
    }

    private constructor() {
        super();
    }

    update(): void {
        if (InputManager.instance.keyboard.isKeyReleased(Keys.F3)) {
            this.debug = !this.debug;
        }
    }
}