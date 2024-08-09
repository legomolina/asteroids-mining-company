import type { Updatable } from '../core/Updatable';
import type { Loadable } from '../core/Loadable';
import type { Initializable } from '../core/Initializable';
import { Container, type Ticker } from 'pixi.js';
import { DebugManager } from '../managers/DebugManager';

export abstract class UIElement extends Container implements Initializable, Loadable, Updatable {
    protected debugManager = DebugManager.instance;
    protected debug = false;

    initialized: boolean = false;
    loaded: boolean = false;

    constructor() {
        super();

        this.debug = this.debugManager.debug;
        this.debugManager.on('debugChange', (isDebugging: boolean): void => {
            this.debug = isDebugging;
        });
    }

    initialize(): Promisable<void> {
        this.initialized = true;
    }

    abstract loadContent(): Promise<void>;
    abstract update(_ticker: Ticker): void;
}
