import Stage from '../core/Stage';
import Player from '../entities/player/Player';
import type { Renderer } from 'pixi.js';
import InputManager from '../managers/InputManager';
import type StageManager from '../managers/StageManager';
import PauseMenu from './PauseMenu';

export default class GameWorld extends Stage {
    private readonly pauseMenu: PauseMenu;
    private readonly player: Player;

    constructor(renderer: Renderer, private stageManager: StageManager) {
        super();

        this.pauseMenu = new PauseMenu(renderer, stageManager);
        this.player = new Player(this.container, renderer);

        this.entities.push(this.player);
    }

    update(deltaTime: number): void {
        super.update(deltaTime);

        if (InputManager.instance.getKeyboard().isKeyReleased('ESC')) {
            this.stageManager.addStage(this.pauseMenu);
        }
    }
}