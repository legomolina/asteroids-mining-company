import type { Container, ContainerChild, Renderer } from 'pixi.js';
import type Stage from '../core/Stage';
import GameWorld from '../stages/GameWorld';
import PauseMenu from '../stages/PauseMenu';
import GameOver from '../stages/GameOver';

type StageType = 'gameWorld' | 'pauseMenu' | 'gameOver';

export default class StageManager {
    private stages: Stage[] = [];

    private readonly gameWorld: GameWorld;
    private readonly pauseMenu: PauseMenu;
    private readonly gameOver: GameOver;

    constructor(private stage: Container<ContainerChild>, renderer: Renderer) {
        this.gameWorld = new GameWorld(renderer, this);
        this.pauseMenu = new PauseMenu(renderer, this);
        this.gameOver = new GameOver(renderer, this);
    }

    addStage(stageType: StageType): void {
        const stage = this.getStage(stageType);

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

    private loadStage(stage: Stage): void {
        this.stages.push(stage);
        this.stage.addChild(stage.container);
    }

    private getStage(stageType: StageType): Stage {
        switch (stageType) {
            case 'gameWorld':
                return this.gameWorld;
            case 'pauseMenu':
                return this.pauseMenu;
            case 'gameOver':
                return this.gameOver;
        }
    }
}