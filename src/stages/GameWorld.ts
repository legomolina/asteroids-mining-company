import Stage from '../core/Stage';
import Player from '../entities/player/Player';
import { Point, type Renderer } from 'pixi.js';
import InputManager from '../managers/InputManager';
import StageManager from '../managers/StageManager';
import AsteroidsManager from '../managers/AsteroidsManager';
import CollisionsManager from '../managers/CollisionsManager';
import UIText from '../entities/ui/UIText';
import ScoreManager from '../managers/ScoreManager';
import Vector2 from '../core/math/Vector2';

export default class GameWorld extends Stage {
    private readonly asteroidManager: AsteroidsManager;
    private readonly collisionsManager: CollisionsManager;
    private readonly player: Player;
    private readonly scoreManager: ScoreManager;
    private readonly scoreText: UIText;

    constructor(private readonly renderer: Renderer, private stageManager: StageManager) {
        super();

        this.collisionsManager = new CollisionsManager();
        this.player = new Player(this.container, renderer, this.collisionsManager);
        this.asteroidManager = new AsteroidsManager(this.container, renderer, this.player, this.collisionsManager);

        this.scoreManager = ScoreManager.instance;
        this.scoreText = new UIText(this.container, renderer);

        this.entities.push(this.player, this.asteroidManager, this.scoreText);
    }

    async load(): Promise<void> {
        await super.load();

        this.scoreText.transform.position = new Point(20, 20);
        this.scoreText.fontSize = 20;
    }

    override async initialize(): Promise<void> {
        await super.initialize();
        await this.asteroidManager.generateAsteroids(20);

        this.player.transform.position = new Point(this.renderer.screen.width / 2, this.renderer.screen.height / 2);
        this.player.transform.rotation = 0;
        this.player.velocity = Vector2.zero;
        this.player.once('destroy', () => this.endGame());
    }

    update(deltaTime: number): void {
        super.update(deltaTime);

        this.collisionsManager.update();

        if (InputManager.instance.getKeyboard().isKeyReleased('ESC')) {
            this.stageManager.addStage(StageManager.stages.pauseMenu);
        }

        this.scoreText.text = `Score: ${this.scoreManager.score}`;
    }

    private endGame(): void {
        this.stageManager.popStage();
        this.stageManager.addStage(StageManager.stages.gameOver);
    }
}