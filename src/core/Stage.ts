import type IEntity from '../entities/IEntity';
import { Container, type ContainerChild } from 'pixi.js';

export default class Stage {
    protected readonly entities: IEntity[] = [];
    protected readonly _container = new Container<ContainerChild>();

    get container(): Container<ContainerChild> {
        return this._container;
    }

    async load(): Promise<void> {
        for (const entity of this.entities) {
            await entity.load();
        }
    }

    render(): void {
        for (const entity of this.entities) {
            entity.render();
        }
    }

    update(deltaTime: number): void {
        for (const entity of this.entities) {
            entity.update(deltaTime);
        }
    }
}