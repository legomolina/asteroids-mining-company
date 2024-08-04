import type { Ticker } from 'pixi.js';
import { Game } from './core/Game';
import { Player } from './entities/ships/Player';
import { AsteroidManager } from './managers/AsteroidManager';

export class AsteroidsGame extends Game {
    private asteroidManager!: AsteroidManager;
    private player!: Player;

    constructor() {
        super('Asteroids: Mining CO.');
    }

    protected async initialized(): Promise<void> {
        this.asteroidManager = new AsteroidManager(this.renderer);
        this.player = new Player(this.renderer);
    }

    protected async loadContent(): Promise<void> {
        await this.player.loadContent();
        await this.asteroidManager.loadContent();

        this.player.x = this.renderer.screen.width / 2 - this.player.width / 2;
        this.player.y = this.renderer.screen.height / 2 - this.player.height / 2;

        await this.asteroidManager.generateAsteroids(20);

        this.container.addChild(this.player, this.asteroidManager);
    }

    update(ticker: Ticker): void {
        this.player.update(ticker);
        this.asteroidManager.update(ticker);
    }
}