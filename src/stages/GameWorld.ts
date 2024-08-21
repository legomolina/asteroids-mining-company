import Stage from '../core/Stage';
import Player from '../entities/player/Player';
import type { Renderer } from 'pixi.js';
import InputManager from '../managers/InputManager';
import type StageManager from '../managers/StageManager';
import MainMenu from './MainMenu';

export default class GameWorld extends Stage {
    private mainMenu: MainMenu;
    private player: Player;

    constructor(renderer: Renderer, private stageManager: StageManager) {
        super();

        this.mainMenu = new MainMenu(stageManager);
        this.player = new Player(this.container, renderer);

        this.entities.push(this.player);
    }

    update(deltaTime: number): void {
        super.update(deltaTime);

        const currentStage = this.stageManager.peekStage();
        if (InputManager.instance.getKeyboard().isKeyReleased('F2') && currentStage instanceof GameWorld) {
            this.stageManager.addStage(this.mainMenu);
        }
    }
}