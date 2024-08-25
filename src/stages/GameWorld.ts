import Stage from '../core/Stage';
import Player from '../entities/player/Player';
import type { Renderer } from 'pixi.js';
import InputManager from '../managers/InputManager';
import type StageManager from '../managers/StageManager';
import PauseMenu from './PauseMenu';
import AsteroidManager from '../managers/AsteroidManager';

export default class GameWorld extends Stage {
    private readonly asteroidManager: AsteroidManager;
    private readonly pauseMenu: PauseMenu;
    private readonly player: Player;

    constructor(renderer: Renderer, private stageManager: StageManager) {
        super();

        this.pauseMenu = new PauseMenu(renderer, stageManager);
        this.player = new Player(this.container, renderer);
        this.asteroidManager = new AsteroidManager(this.container, renderer, this.player);

        this.entities.push(this.player, this.asteroidManager);
    }

    async load(): Promise<void> {
        await super.load();

        await this.asteroidManager.generateAsteroids(20);
    }

    update(deltaTime: number): void {
        super.update(deltaTime);

        if (InputManager.instance.getKeyboard().isKeyReleased('ESC')) {
            this.stageManager.addStage(this.pauseMenu);
        }
    }
}