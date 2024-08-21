import type IEntity from './IEntity';
import { Text, type Container, type ContainerChild } from 'pixi.js';

export default class TestEntity implements IEntity {
    private text: Text;

    isLoaded: boolean = false;

    constructor(private readonly container: Container<ContainerChild>) {
        this.text = new Text({
            text: 'Pause menu active',
            x: 200,
            y: 250,
        });
    }

    async load(): Promise<void> {
        this.container.addChild(this.text);
        this.isLoaded = true;
    }
    render(): void {
    }
    update(): void {
    }

}