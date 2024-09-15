import type IEntity from '../entities/IEntity';
import { Container, type ContainerChild } from 'pixi.js';

export default class Stage implements IEntity {
    protected readonly entities: IEntity[] = [];
    protected readonly _container = new Container<ContainerChild>();

    isLoaded: boolean = false;

    get container(): Container<ContainerChild> {
        return this._container;
    }

    async initialize(): Promise<void> {}

    async load(): Promise<void> {
        for (const entity of this.entities) {
            await entity.load();
        }

        this.isLoaded = true;
    }

    render(): void {
        if (!this.isLoaded) {
            return;
        }

        for (const entity of this.entities) {
            entity.render();
        }
    }

    update(deltaTime: number): void {
        if (!this.isLoaded) {
            return;
        }

        for (const entity of this.entities) {
            entity.update(deltaTime);
        }
    }
}