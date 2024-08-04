import { Entity } from '../Entity';
import { type Renderer, Sprite, type Texture } from 'pixi.js';

export class Asteroid extends Entity<Sprite> {
    direction: number = 0;
    speed: number = 0;

    constructor(renderer: Renderer, texture: Texture) {
        super(renderer);

        this.texture = texture;
    }

    async loadContent(): Promise<void> {
        this.sprite = new Sprite(this.texture);

        this.sprite.anchor.set(0.5);

        this.addChild(this.sprite);
    }
}