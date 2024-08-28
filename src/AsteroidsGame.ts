import Game from './core/Game';
import GameWorld from './stages/GameWorld';
import StageManager from './managers/StageManager';
import InputManager from './managers/InputManager';
import Debug from './core/debug/Debug';

export default class AsteroidsGame extends Game {
    private readonly stageManager: StageManager;
    private gameWorld!: GameWorld;

    constructor() {
        super('Asteroids Mining Company');

        this.stageManager = new StageManager(this.stage);
    }

    async initialized(): Promise<void> {
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

        if (InputManager.instance.getKeyboard().isKeyReleased('F2')) {
            Debug.enabled = !Debug.enabled;
        }
    }
}