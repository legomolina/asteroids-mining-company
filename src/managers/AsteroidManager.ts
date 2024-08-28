import { Point, type Renderer, type ContainerChild, Container } from 'pixi.js';
import type Player from '../entities/player/Player';
import MathUtils from '../core/math/MathUtils';
import type IEntity from '../entities/IEntity';
import Vector2 from '../core/math/Vector2';
import type Asteroid from '../entities/asteoids/Asteroid';
import SmallAsteroid from '../entities/asteoids/SmallAsteroid';
import MediumAsteroid from '../entities/asteoids/MediumAsteroid';
import { LargeAsteroid } from '../entities/asteoids/LargeAsteroid';
import type { CollisionsManager } from './CollisionsManager';

export default class AsteroidManager implements IEntity {
    private readonly asteroidsContainer: Container<ContainerChild>;

    private asteroids: Asteroid[];
    private screenPadding = 50;

    isLoaded: boolean = false;

    constructor(
        private readonly container: Container<ContainerChild>,
        private readonly renderer: Renderer,
        private readonly player: Player,
        private readonly collisionsManager: CollisionsManager,
    ) {
        this.asteroidsContainer = new Container();
        this.asteroids = [];

        this.asteroidsContainer.label = 'asteroids-container';
    }

    async generateAsteroids(count: number): Promise<void> {
        for (let i = 0; i < count; i++) {
            const asteroid = this.getRandomAsteroid();

            await asteroid.load();

            this.collisionsManager.insert(asteroid);

            asteroid.once('destroy', () => {
                this.asteroids = this.asteroids.filter((a) => a !== asteroid);
                this.collisionsManager.remove(asteroid);
                this.generateAsteroids(1);
            });

            asteroid.direction = new Vector2(1, 0).rotate(MathUtils.randomRange(0, 360));
            asteroid.transform.position = this.getAsteroidInitialPosition();
            this.asteroids.push(asteroid);
        }
    }

    async load(): Promise<void> {
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

    private getRandomAsteroid(): Asteroid {
        const random = MathUtils.randomRange(0, 3);

        switch (random) {
            case 0:
                return new SmallAsteroid(this.asteroidsContainer, this.renderer);
            case 1:
                return new MediumAsteroid(this.asteroidsContainer, this.renderer);
            case 2:
                return new LargeAsteroid(this.asteroidsContainer, this.renderer);
        }

        throw new Error(`Asteroid size not found: ${random}`);
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

        return position;
    }
}