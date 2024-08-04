import { Assets, Container, type Renderer, Spritesheet, type Texture, type Ticker } from 'pixi.js';
import { Asteroid } from '../entities/asteroids/Asteroid';
import type { Updatable } from '../core/Updatable';

export class AsteroidManager extends Container implements Updatable {
    private static readonly ATLAS_FILE = '/assets/asteroids/data.json';

    private asteroids: Asteroid[] = [];
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
            const asteroid = new Asteroid(this.renderer, texture);

            await asteroid.loadContent();

            asteroid.direction = Math.random() * Math.PI * 2;
            asteroid.speed = 2 + Math.random();

            asteroid.x = Math.random() * this.renderer.screen.width;
            asteroid.y = Math.random() * this.renderer.screen.height;

            this.addChild(asteroid);
            this.asteroids.push(asteroid);
        }
    }

    update({ deltaTime }: Ticker): void {
        const stagePadding = 100;
        const boundWidth = this.renderer.screen.width + stagePadding * 2;
        const boundHeight = this.renderer.screen.height + stagePadding * 2;

        this.asteroids.forEach((asteroid) => {
            asteroid.rotation = -asteroid.direction - Math.PI / 2;

            asteroid.x += Math.sin(asteroid.direction) * asteroid.speed * deltaTime;
            asteroid.y += Math.cos(asteroid.direction) * asteroid.speed * deltaTime;

            if (asteroid.x < -stagePadding) {
                asteroid.x += boundWidth;
            }

            if (asteroid.x > this.renderer.screen.width + stagePadding) {
                asteroid.x -= boundWidth;
            }

            if (asteroid.y < -stagePadding) {
                asteroid.y += boundHeight;
            }

            if (asteroid.y > this.renderer.screen.height + stagePadding) {
                asteroid.y -= boundHeight;
            }
        });
    }
}