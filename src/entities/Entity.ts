import { Container, type ContainerChild, type Renderer, Sprite, Texture, type Ticker } from 'pixi.js';
import type { Updatable } from '../../core/Updatable';

export abstract class Entity<T extends ContainerChild> extends Container<T> implements Updatable {
    protected texture?: Texture;
    protected sprite?: Sprite;

    constructor(protected renderer: Renderer) {
        super();
    }

    async loadContent(): Promise<void> {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update(_ticker: Ticker): void {}
}