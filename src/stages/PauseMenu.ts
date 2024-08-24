import Stage from '../core/Stage';
import { Point, type Renderer } from 'pixi.js';
import type StageManager from '../managers/StageManager';
import UIPane from '../entities/ui/UIPane';
import UIText from '../entities/ui/UIText';
import InputManager from '../managers/InputManager';

export default class PauseMenu extends Stage {
    private readonly panel: UIPane;
    private readonly title: UIText;

    constructor(private readonly renderer: Renderer, private readonly stageManager: StageManager) {
        super();

        this.container.label = 'Pause menu';

        this.panel = new UIPane(this.container);
        this.title = new UIText(this.panel.paneContainer, renderer);

        this.entities.push(this.panel, this.title);
    }

    async load(): Promise<void> {
        await super.load();

        this.title.text = 'Pause';
        this.title.fontSize = 32;
    }

    render(): void {
        super.render();

        const panelWidth = Math.min(this.renderer.screen.width * 90 / 100, 400);
        const panelHeight = Math.min(this.renderer.screen.height * 90 / 100, 400);
        const panelPosition = new Point(this.renderer.screen.width / 2 - panelWidth / 2, this.renderer.screen.height / 2 - panelHeight / 2);

        this.panel.transform.width = panelWidth;
        this.panel.transform.height = panelHeight;
        this.panel.transform.position = panelPosition;

        this.title.transform.position = new Point(panelWidth / 2 - this.title.textWidth / 2, 20);
    }

    update(deltaTime: number) {
        super.update(deltaTime);

        if (InputManager.instance.getKeyboard().isKeyReleased('ESC')) {
            this.stageManager.popStage();
        }
    }
}