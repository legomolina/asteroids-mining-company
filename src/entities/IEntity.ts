export default interface IEntity {
    isLoaded: boolean;

    load(): Promise<void>;

    render(): void;

    update(deltaTime: number): void;
}