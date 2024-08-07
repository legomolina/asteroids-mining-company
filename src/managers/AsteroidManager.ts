import { Assets, Container, Point, type Renderer, Spritesheet, type Texture, type Ticker } from 'pixi.js';
import { Asteroid, AsteroidSize } from '../entities/asteroids/Asteroid';
import type { Updatable } from '../core/Updatable';
import type { CollisionManager } from './CollisionManager';
import type { Player } from '../entities/ships/Player';

export class AsteroidManager extends Container implements Updatable {
    private static readonly ATLAS_FILE = '/assets/asteroids/data.json';

    private screenPadding = 50;
    private spritesheet!: Spritesheet;

    asteroids: Asteroid[] = [];

    constructor(private renderer: Renderer, private collisionManager: CollisionManager, private player: Player) {
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

            asteroid.position = this.getAsteroidInitialPosition();

            asteroid.once('destroy', () => {
                this.player.score += asteroid.score;
                this.removeChild(asteroid);
                this.collisionManager.remove(asteroid);
                this.asteroids = this.asteroids.filter((a) => a !== asteroid);

                this.generateAsteroids(1);
            });

            this.addChild(asteroid);
            this.collisionManager.insert(asteroid);
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

    private getAsteroidInitialPosition(): Point {
        type AsteroidBounds = {
            minX: number,
            maxX: number,
            minY: number,
            maxY: number,
        };

        // Global bounds for asteroid to spawn
        const bounds: Record<'left' | 'right' | 'top' | 'bottom', AsteroidBounds> = {
            'left': {
                minX: -this.screenPadding,
                maxX: 20,
                minY: -this.screenPadding,
                maxY: this.renderer.screen.height + this.screenPadding,
            },
            'right': {
                minX: this.renderer.screen.width - 20,
                maxX: this.renderer.screen.width + this.screenPadding,
                minY: -this.screenPadding,
                maxY: this.renderer.screen.height + this.screenPadding,
            },
            'top': {
                minX: -this.screenPadding,
                maxX: this.renderer.screen.width + this.screenPadding,
                minY: -this.screenPadding,
                maxY: 20,
            },
            'bottom': {
                minX: -this.screenPadding,
                maxX: this.renderer.screen.width + this.screenPadding,
                minY: this.renderer.screen.height - 20,
                maxY: this.renderer.screen.height + this.screenPadding,
            },
        };

        const randomPoint = Math.random();
        let screenSide: keyof typeof bounds = 'left';

        // Based on random number, select screen side to spawn
        if (randomPoint < 0.25) {
            screenSide = 'left';
        } else if (randomPoint < 0.5) {
            screenSide = 'top';
        } else if (randomPoint < 0.75) {
            screenSide = 'right';
        } else if (randomPoint <= 1) {
            screenSide = 'bottom';
        }

        // Get random position inside selected screen side
        const { minX, maxX, minY, maxY } = bounds[screenSide];
        const position = new Point(Math.randomRange(minX, maxX), Math.randomRange(minY, maxY));

        // Check if player spawn safe area contains selected position and move asteroid outside it
        if (this.player.safeArea.contains(position.x, position.y)) {
            if (position.x > this.player.safeArea.x + this.player.safeArea.width / 2) {
                position.x += (this.player.safeArea.width + this.player.safeArea.x) - position.x;
            } else {
                position.x -= position.x - this.player.safeArea.x;
            }

            if (position.y > this.player.safeArea.y + this.player.safeArea.height / 2) {
                position.y += (this.player.safeArea.height + this.player.safeArea.y) - position.y;
            } else {
                position.y -= position.y - this.player.safeArea.y;
            }
        }

        return position;
    }
}