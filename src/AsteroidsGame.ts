import Game from './core/Game';
import StageManager from './managers/StageManager';
import InputManager from './managers/InputManager';
import Debug from './core/debug/Debug';

export default class AsteroidsGame extends Game {
    private stageManager!: StageManager;

    constructor() {
        super('Asteroids Mining Company');
    }

    async initialized(): Promise<void> {
        this.stageManager = new StageManager(this.stage, this.renderer);
    }

    async loadContent(): Promise<void> {
        this.stageManager.addStage(StageManager.stages.mainMenu);
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