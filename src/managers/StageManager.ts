import type { Container, ContainerChild } from 'pixi.js';
import type Stage from '../core/Stage';

export default class StageManager {
    private stages: Stage[] = [];

    constructor(private stage: Container<ContainerChild>) {

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

    private loadStage(stage: Stage): void {
        this.stages.push(stage);
        this.stage.addChild(stage.container);
    }
}