import Stage from '../core/Stage';
import UIText from '../entities/ui/UIText';
import UIButton from '../entities/ui/UIButton';
import { Point, type Renderer } from 'pixi.js';
import StageManager from '../managers/StageManager';
import AsteroidsManager from '../managers/AsteroidsManager';

export default class MainMenu extends Stage {
    private readonly asteroidsManager: AsteroidsManager;
    private readonly title: UIText;
    private readonly newGameButton: UIButton;
    private readonly continueButton: UIButton;

    constructor(
        private readonly renderer: Renderer,
        private readonly stageManager: StageManager,
    ) {
        super();

        this.title = new UIText(this.container, renderer);
        this.newGameButton = new UIButton(this.container, renderer);
        this.continueButton = new UIButton(this.container, renderer);
        this.asteroidsManager = new AsteroidsManager(this.container, renderer, null, null);

        this.asteroidsManager.generateAsteroids(20);

        this.entities.push(this.asteroidsManager, this.title, this.newGameButton, this.continueButton);
    }

    async load(): Promise<void> {
        await super.load();

        this.title.text = 'Asteroids\nMining Company';
        this.title.fontSize = 32;

        this.newGameButton.text = 'New Game';
        this.newGameButton.on('click', () => this.startGame());

        this.continueButton.text = 'Continue';
        this.continueButton.on('click', () => this.continueGame());
    }

    render() {
        super.render();

        const halfWidthWindow = this.renderer.screen.width / 2;
        const halfHeightWindow = this.renderer.screen.height / 2;
        const titlePositionTop = halfHeightWindow - this.title.textHeight - 100;
        const newGameButtonPositionTop = titlePositionTop + this.title.textHeight + 50;

        this.title.transform.position = new Point(halfWidthWindow - this.title.textWidth / 2, titlePositionTop);
        this.newGameButton.transform.position = new Point(halfWidthWindow - this.newGameButton.transform.width / 2, titlePositionTop + this.title.textHeight + 50);
        this.continueButton.transform.position = new Point(halfWidthWindow - this.continueButton.transform.width / 2, newGameButtonPositionTop + 60);
    }

    private startGame(): void {
        this.stageManager.popStage();
        this.stageManager.addStage(StageManager.stages.gameWorld);
    }

    private continueGame(): void {

    }
}