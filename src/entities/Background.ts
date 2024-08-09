import { Assets, TilingSprite, type Renderer, type Ticker } from 'pixi.js';
import type { Loadable } from '../core/Loadable';
import type { Updatable } from '../core/Updatable';

export class Background implements Loadable, Updatable {
    private static readonly BACKGROUND_PATH = '/assets/background.jpg';

    private speed = 0.2;
    private sprite!: TilingSprite;

    loaded: boolean = false;

    get backgroundSprite(): TilingSprite {
        return this.sprite;
    }

    constructor(private renderer: Renderer) {
    }

    async loadContent(): Promise<void> {
        const texture = await Assets.load(Background.BACKGROUND_PATH);
        this.sprite = new TilingSprite({
            texture,
            width: this.renderer.screen.width,
            height: this.renderer.screen.height,
        });

        this.loaded = true;
    }

    update(ticker: Ticker): void {
        this.sprite.tilePosition.x += this.speed * ticker.deltaTime;
        this.sprite.tilePosition.y += this.speed * ticker.deltaTime;
    }
}