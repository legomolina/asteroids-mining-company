import Stage from '../core/Stage';
import UIText from '../entities/ui/UIText';
import UIButton from '../entities/ui/UIButton';
import { Point, type Renderer } from 'pixi.js';
import ScoreManager from '../managers/ScoreManager';
import StageManager from '../managers/StageManager';

export default class GameOver extends Stage {
    private readonly title: UIText;
    private readonly totalScoreText: UIText;
    private readonly restartButton: UIButton;
    private readonly mainMenuButton: UIButton;
    private readonly scoreManager: ScoreManager;

    constructor(private readonly renderer: Renderer, private readonly stageManager: StageManager) {
        super();

        this.title = new UIText(this.container, renderer);
        this.totalScoreText = new UIText(this.container, renderer);
        this.restartButton = new UIButton(this.container, renderer);
        this.mainMenuButton = new UIButton(this.container, renderer);
        this.scoreManager = ScoreManager.instance;
        this.entities.push(this.title, this.totalScoreText, this.restartButton, this.mainMenuButton);
    }

    override async initialize(): Promise<void> {
        await super.initialize();

        this.scoreManager.reset();
    }

    async load(): Promise<void> {
        await super.load();

        this.title.text = 'Game Over';
        this.title.fontSize = 52;

        this.totalScoreText.text = `Total score: ${this.scoreManager.score}`;
        this.totalScoreText.fontSize = 32;

        this.restartButton.text = 'Restart';
        this.restartButton.on('click', () => {
            this.stageManager.popStage();
            this.stageManager.addStage(StageManager.stages.gameWorld);
        });

        this.mainMenuButton.text = 'Main menu';
        this.mainMenuButton.on('click', () => {
            this.stageManager.popStage();
            this.stageManager.addStage(StageManager.stages.mainMenu);
        });
    }

    render() {
        super.render();

        this.title.transform.position = new Point(this.renderer.screen.width / 2 - this.title.textWidth / 2, 50);
        this.totalScoreText.transform.position = new Point(this.renderer.screen.width / 2 - this.totalScoreText.textWidth / 2, this.renderer.screen.height / 2 - 100);
        this.restartButton.transform.position = new Point(this.renderer.screen.width / 2 - this.restartButton.transform.width / 2, this.renderer.screen.height / 2);
        this.mainMenuButton.transform.position = new Point(this.renderer.screen.width / 2 - this.mainMenuButton.transform.width / 2, this.renderer.screen.height / 2 + 50);
    }
}