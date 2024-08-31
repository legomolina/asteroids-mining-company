import Stage from '../core/Stage';
import Player from '../entities/player/Player';
import { Point, type Renderer } from 'pixi.js';
import InputManager from '../managers/InputManager';
import type StageManager from '../managers/StageManager';
import AsteroidManager from '../managers/AsteroidManager';
import { CollisionsManager } from '../managers/CollisionsManager';
import UIText from '../entities/ui/UIText';
import ScoreManager from '../managers/ScoreManager';

export default class GameWorld extends Stage {
    private readonly asteroidManager: AsteroidManager;
    private readonly collisionsManager: CollisionsManager;
    private readonly player: Player;
    private readonly scoreManager: ScoreManager;
    private readonly scoreText: UIText;

    constructor(renderer: Renderer, private stageManager: StageManager) {
        super();

        this.collisionsManager = new CollisionsManager();
        this.player = new Player(this.container, renderer, this.collisionsManager);
        this.asteroidManager = new AsteroidManager(this.container, renderer, this.player, this.collisionsManager);

        this.scoreManager = ScoreManager.instance;
        this.scoreText = new UIText(this.container, renderer);

        this.entities.push(this.player, this.asteroidManager, this.scoreText);
    }

    async load(): Promise<void> {
        await super.load();

        await this.asteroidManager.generateAsteroids(20);

        this.scoreText.transform.position = new Point(20, 20);
        this.scoreText.fontSize = 20;
    }

    update(deltaTime: number): void {
        super.update(deltaTime);

        this.collisionsManager.update();

        this.player.once('destroy', () => {
            this.stageManager.popStage();
            this.stageManager.addStage('gameOver');
        });

        if (InputManager.instance.getKeyboard().isKeyReleased('ESC')) {
            this.stageManager.addStage('pauseMenu');
        }

        this.scoreText.text = `Score: ${this.scoreManager.score}`;
    }
}