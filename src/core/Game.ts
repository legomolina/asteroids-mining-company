import { Application, type Container, type ContainerChild, type Renderer, Text, Ticker } from 'pixi.js';
import type { Updatable } from './Updatable';
import { InputManager } from '../managers/InputManager';

export abstract class Game implements Updatable {
    private readonly app: Application;

    private isDebugging: boolean = false;
    private fpsText?: Text;

    protected readonly inputManager = InputManager.instance;

    protected get container(): Container<ContainerChild> {
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
    }

    setDebug(debug: boolean): void {
        this.isDebugging = debug;

        if (this.isDebugging) {
            this.addFpsCounterText();
        } else {
            this.removeFpsCounterText();
        }
    }

    async init(): Promise<void> {
        await this.app.init({
            backgroundColor: '#0f0f1e',
            resizeTo: window,
        });

        document.body.appendChild(this.app.canvas);

        await this.initialized();

        await this.loadContent();

        this.app.ticker.add((ticker: Ticker) => this.update(ticker));
        this.app.ticker.add(() => this.updateFpsCounter());
        this.app.ticker.add(() => this.inputManager.update());
    }

    protected abstract initialized(): Promise<void>;
    protected abstract loadContent(): Promise<void>;
    abstract update(ticker: Ticker): void;

    private addFpsCounterText(): void {
        this.fpsText = new Text({
            text: this.fps.toFixed(0),
            style: {
                fontFamily: 'monospace',
                fontSize: '14px',
                fill: 'white',
            },
        });

        this.fpsText.position = { x: 10, y: 10 };

        this.app.stage.addChild(this.fpsText);
    }

    private removeFpsCounterText(): void {
        if (this.fpsText) {
            this.app.stage.removeChild(this.fpsText);
        }
    }

    private updateFpsCounter(): void {
        if (this.fpsText) {
            this.fpsText.text = this.fps.toFixed(0);
        }
    }
}