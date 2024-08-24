import { Application, type Container, type ContainerChild, type Renderer } from 'pixi.js';
import { initDevtools } from '@pixi/devtools';
import InputManager from '../managers/InputManager';

export default abstract class Game {
    private readonly app: Application;

    protected readonly inputManager: InputManager;

    protected get stage(): Container<ContainerChild> {
        return this.app.stage;
    }

    protected get fps(): number {
        return this.app.ticker.FPS;
    }

    protected get renderer(): Renderer {
        return this.app.renderer;
    }

    protected constructor(protected name: string) {
        document.title = name;

        this.app = new Application();

        this.inputManager = InputManager.instance;

        initDevtools({ app: this.app });
    }

    async load(): Promise<void> {
        await this.app.init({
            antialias: true,
            background: 'black', // 'cornflowerblue',
            resizeTo: window,
            sharedTicker: false,
        });

        document.body.append(this.app.canvas);

        await this.initialized();
        await this.loadContent();

        this.app.ticker.add(() => { this.render(); });
        this.app.ticker.add(() => { this.update(this.app.ticker.deltaTime); });

        this.app.ticker.add(() => { this.inputManager.update(); });
    }

    abstract initialized(): Promise<void>;
    abstract loadContent(): Promise<void>;
    abstract render(): void;
    abstract update(deltaTime: number): void;
}