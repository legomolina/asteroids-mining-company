import type { Container, ContainerChild, Renderer } from 'pixi.js';
import type Stage from '../core/Stage';
import GameWorld from '../stages/GameWorld';
import PauseMenu from '../stages/PauseMenu';
import GameOver from '../stages/GameOver';
import MainMenu from '../stages/MainMenu';

type StageType = 'mainMenu' | 'gameWorld' | 'pauseMenu' | 'gameOver';

export default class StageManager {
    private stages: Stage[] = [];

    static stages: Readonly<Record<StageType, Stage>>;

    constructor(private stage: Container<ContainerChild>, renderer: Renderer) {
        StageManager.stages = {
            mainMenu: new MainMenu(renderer, this),
            gameWorld: new GameWorld(renderer, this),
            pauseMenu: new PauseMenu(renderer, this),
            gameOver: new GameOver(renderer, this),
        };
    }

    addStage(stage: Stage): void {
        if (stage.isLoaded) {
            this.loadStage(stage);
        } else {
            stage.load().then(() => {
                this.loadStage(stage);
            });
        }
    }

    popStage(): Stage | undefined {
        const stage = this.stages.pop();

        if (!stage) {
            return undefined;
        }

        this.stage.removeChild(stage.container);

        return stage;
    }

    peekStage(): Stage | undefined {
        return this.stages.at(-1);
    }

    private async loadStage(stage: Stage): Promise<void> {
        await stage.initialize();
        this.stages.push(stage);
        this.stage.addChild(stage.container);
    }
}