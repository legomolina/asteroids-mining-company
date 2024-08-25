import { Assets, Point, Spritesheet, type Renderer, type Texture, type ContainerChild, Container } from 'pixi.js';
import type Player from '../entities/player/Player';
import Asteroid, { type AsteroidSize } from '../entities/asteoids/Asteroid';
import MathUtils from '../core/math/MathUtils';
import type IEntity from '../entities/IEntity';
import Vector2 from '../core/math/Vector2';

export default class AsteroidManager implements IEntity {
    private static readonly ASTEROIDS_SPRITE_SHEET_PATH = '/assets/sprites/asteroids/data.json';

    private readonly asteroidsContainer: Container<ContainerChild>;

    private asteroids: Asteroid[];
    private screenPadding = 50;
    private spriteSheet!: Spritesheet;

    isLoaded: boolean = false;

    constructor(
        private readonly container: Container<ContainerChild>,
        private readonly renderer: Renderer,
        private readonly player: Player,
    ) {
        this.asteroidsContainer = new Container();
        this.asteroids = [];

        this.asteroidsContainer.label = 'asteroids-container';
    }

    async generateAsteroids(count: number): Promise<void> {
        for (let i = 0; i < count; i++) {
            const texture = this.getRandomTexture();
            const asteroid = new Asteroid(this.asteroidsContainer, this.renderer, texture, this.getAsteroidSize(texture.label!));

            await asteroid.load();

            asteroid.direction = new Vector2(1, 0).rotate(MathUtils.randomRange(0, 360));
            asteroid.transform.position = this.getAsteroidInitialPosition();
            this.asteroids.push(asteroid);
        }
    }

    async load(): Promise<void> {
        const spriteSheetData = await fetch(AsteroidManager.ASTEROIDS_SPRITE_SHEET_PATH).then((res) => res.json());
        const texture = await Assets.load(spriteSheetData.meta.image);

        this.spriteSheet = new Spritesheet(texture, spriteSheetData);
        await this.spriteSheet.parse();

        this.container.addChild(this.asteroidsContainer);

        this.isLoaded = true;
    }

    render(): void {
        if (!this.isLoaded) {
            return;
        }

        this.asteroids.forEach((asteroid) => {
            asteroid.render();
        });
    }

    update(deltaTime: number): void {
        this.asteroids.forEach((asteroid) => {
            asteroid.update(deltaTime);
        });
    }

    private getRandomTexture(): Texture {
        const textureKeys = Object.keys(this.spriteSheet.textures);
        const length = textureKeys.length;
        const itemIndex = MathUtils.randomRange(0, length);

        return this.spriteSheet.textures[textureKeys[itemIndex]!]!;
    }

    private getAsteroidSize(textureName: string): AsteroidSize {
        if (textureName.includes('small')) {
            return 'small';
        }

        if (textureName.includes('medium')) {
            return 'medium';
        }

        if (textureName.includes('large')) {
            return 'large';
        }

        return 'small';
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
        if (randomPoint < .25) {
            screenSide = 'left';
        } else if (randomPoint < .5) {
            screenSide = 'top';
        } else if (randomPoint < .75) {
            screenSide = 'right';
        } else {
            screenSide = 'bottom';
        }

        // Get random position inside selected screen side
        const { minX, maxX, minY, maxY } = bounds[screenSide];
        const position = new Point(MathUtils.randomRange(minX, maxX), MathUtils.randomRange(minY, maxY));

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

        console.log(position);

        return position;
    }
}