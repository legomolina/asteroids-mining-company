import { Assets, Container, type Renderer, Spritesheet, type Texture, type Ticker } from 'pixi.js';
import { Asteroid, AsteroidSize } from '../entities/asteroids/Asteroid';
import type { Updatable } from '../core/Updatable';

export class AsteroidManager extends Container implements Updatable {
    private static readonly ATLAS_FILE = '/assets/asteroids/data.json';

    asteroids: Asteroid[] = [];
    private spritesheet!: Spritesheet;

    constructor(private renderer: Renderer) {
        super();
    }

    async loadContent(): Promise<void> {
        const asteroidsAtlas = await fetch(AsteroidManager.ATLAS_FILE).then((res) => res.json());
        const texture = await Assets.load(asteroidsAtlas.meta.image);

        this.spritesheet = new Spritesheet(texture, asteroidsAtlas);

        await this.spritesheet.parse();
    }

    getTexture(name: string): Texture | undefined {
        return this.spritesheet.textures[name];
    }

    getRandomTexture(): Texture {
        const textureKeys = Object.keys(this.spritesheet.textures);
        const length = textureKeys.length;
        const itemIndex = Math.randomRange(0, length);

        return this.spritesheet.textures[textureKeys[itemIndex]!]!;
    }

    async generateAsteroids(count: number): Promise<void> {
        for (let i = 0; i < count; i++) {
            const texture = this.getRandomTexture();
            const asteroid = new Asteroid(this.renderer, texture, this.getAsteroidSize(texture.label!));

            await asteroid.initialize();
            await asteroid.loadContent();

            asteroid.x = Math.random() * this.renderer.screen.width;
            asteroid.y = Math.random() * this.renderer.screen.height;

            this.addChild(asteroid);
            this.asteroids.push(asteroid);
        }
    }

    update(ticker: Ticker): void {
        this.asteroids.forEach((asteroid) => {
            asteroid.update(ticker);
        });
    }

    private getAsteroidSize(textureName: string): AsteroidSize {
        if (textureName.includes('small')) {
            return AsteroidSize.SMALL;
        }

        if (textureName.includes('medium')) {
            return AsteroidSize.MEDIUM;
        }

        if (textureName.includes('large')) {
            return AsteroidSize.LARGE;
        }

        return AsteroidSize.SMALL;
    }
}