import { Container, type Renderer, Sprite, Texture, type Ticker } from 'pixi.js';
import type { Updatable } from '../core/Updatable';
import { DebugManager } from '../managers/DebugManager';

export abstract class Entity extends Container implements Updatable {
    protected debugManager = DebugManager.instance;
    protected debug = false;

    protected texture?: Texture;
    protected sprite?: Sprite;

    constructor(protected renderer: Renderer) {
        super();

        this.debug = this.debugManager.debug;
        this.debugManager.on('debugChange', (isDebugging: boolean): void => {
            this.debug = isDebugging;
        });
    }

    async initialize(): Promise<void> {}

    async loadContent(): Promise<void> {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update(_ticker: Ticker): void {}
}