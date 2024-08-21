import Game from './core/Game';
import MainMenu from './stages/MainMenu';
import GameWorld from './stages/GameWorld';
import StageManager from './managers/StageManager';

export default class AsteroidsGame extends Game {
    private stageManager: StageManager;
    private mainMenu: MainMenu;
    private gameWorld: GameWorld;

    constructor() {
        super('Asteroids Mining Company');

        this.stageManager = new StageManager(this.stage);
    }

    async initialized(): Promise<void> {
        this.mainMenu = new MainMenu(this.stageManager);
        this.gameWorld = new GameWorld(this.renderer, this.stageManager);
    }

    async loadContent(): Promise<void> {
        this.stageManager.addStage(this.gameWorld);
    }

    render(): void {
        this.stageManager.peekStage()?.render();
    }

    update(deltaTime: number): void {
        this.stageManager.peekStage()?.update(deltaTime);
    }
}