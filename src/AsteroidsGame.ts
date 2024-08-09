import { Container, type Ticker } from 'pixi.js';
import { Game } from './core/Game';
import { Player } from './entities/ships/Player';
import { AsteroidManager } from './managers/AsteroidManager';
import { CollisionManager } from './managers/CollisionManager';
import { Score } from './hud/Score';
import { Storage } from './core/storage/Storage';
import { Background } from './entities/Background';

export class AsteroidsGame extends Game {
    private asteroidManager!: AsteroidManager;
    private collisionsManager!: CollisionManager;
    private player!: Player;
    private background!: Background;

    private world = new Container({ isRenderGroup: true });
    private hud = new Container({ isRenderGroup: true });

    private score!: Score;

    constructor() {
        super('Asteroids: Mining CO.');
    }

    protected async initialize(): Promise<void> {
        this.collisionsManager = new CollisionManager();
        this.player = new Player(this.renderer, this.collisionsManager);
        this.asteroidManager = new AsteroidManager(this.renderer, this.collisionsManager, this.player);
        this.background = new Background(this.renderer);

        this.player.score = Storage.instance.getScore();

        this.score = new Score(this.player);
        this.score.initialize();
    }

    protected async loadContent(): Promise<void> {
        await this.background.loadContent();
        await this.player.initialize();

        await this.player.loadContent();
        await this.asteroidManager.loadContent();

        await this.asteroidManager.generateAsteroids(20);

        this.collisionsManager.insert(this.player);

        this.world.addChild(this.player, this.asteroidManager);

        await this.score.loadContent();

        this.hud.addChild(this.score);

        this.container.addChild(this.background.backgroundSprite, this.world, this.hud);
    }

    protected onPageHidden() {
        super.onPageHidden();

        Storage.instance.saveScore(this.player.score);
    }

    update(ticker: Ticker): void {
        this.asteroidManager.update(ticker);
        this.collisionsManager.update();
        this.debugManager.update();
        this.player.update(ticker);
        this.score.update();
        this.background.update(ticker);
    }
}