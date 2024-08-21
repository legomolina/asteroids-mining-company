import Stage from '../core/Stage';
import TestEntity from '../entities/TestEntity';
import InputManager from '../managers/InputManager';
import type StageManager from '../managers/StageManager';

export default class MainMenu extends Stage {
    private readonly text: TestEntity;

    constructor(private stageManager: StageManager) {
        super();
        this.text = new TestEntity(this.container);

        this.entities.push(this.text);
    }

    update(deltaTime: number) {
        super.update(deltaTime);

        if (InputManager.instance.getKeyboard().isKeyReleased('F2')) {
            this.stageManager.popStage();
        }
    }
}