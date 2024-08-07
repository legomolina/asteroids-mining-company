import type { Ticker } from 'pixi.js';
import { Game } from './core/Game';
import { Player } from './entities/ships/Player';
import { AsteroidManager } from './managers/AsteroidManager';
import { CollisionManager } from './managers/CollisionManager';

export class AsteroidsGame extends Game {
    private asteroidManager!: AsteroidManager;
    private collisionsManager!: CollisionManager;
    private player!: Player;

    constructor() {
        super('Asteroids: Mining CO.');
    }

    protected async initialize(): Promise<void> {
        this.collisionsManager = new CollisionManager();
        this.asteroidManager = new AsteroidManager(this.renderer, this.collisionsManager);
        this.player = new Player(this.renderer, this.collisionsManager);
    }

    protected async loadContent(): Promise<void> {
        await this.player.initialize();

        await this.player.loadContent();
        await this.asteroidManager.loadContent();

        await this.asteroidManager.generateAsteroids(20);

        this.collisionsManager.insert(this.player);

        this.container.addChild(this.player, this.asteroidManager);
    }

    update(ticker: Ticker): void {
        this.asteroidManager.update(ticker);
        this.collisionsManager.update();
        this.debugManager.update();
        this.player.update(ticker);
    }
}