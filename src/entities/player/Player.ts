import type IEntity from '../IEntity';
import { Assets, type Container, type ContainerChild, Point, type Renderer, Sprite, Texture } from 'pixi.js';
import PlayerController from './PlayerController';
import Transform from '../../core/components/Transform';

export default class Player implements IEntity {
    private static readonly TEXTURE_PATH = '/assets/sprites/player.png';

    private readonly playerController: PlayerController;
    private readonly _transform: Transform;

    private texture!: Texture;
    private sprite?: Sprite;

    isLoaded = false;

    public acceleration = .5;
    public friction = .01;
    public maxSpeed = 8;
    public rotationSpeed = 2.5;

    get transform() {
        return this._transform;
    }

    constructor(
        private readonly container: Container<ContainerChild>,
        renderer: Renderer,
    ) {
        this.playerController = new PlayerController(this, renderer);
        this._transform = new Transform();

        this.transform.position = new Point(renderer.screen.width / 2, renderer.screen.height / 2);
    }

    async load(): Promise<void> {
        this.texture = await Assets.load(Player.TEXTURE_PATH);
        this.sprite = Sprite.from(this.texture);

        this.sprite.pivot = this.sprite.width / 2;

        this.container.addChild(this.sprite);

        this.isLoaded = true;
    }

    render(): void {
        this.sprite!.position = this.transform.position;
        this.sprite!.angle = this.transform.rotation;
        this.sprite!.scale = this.transform.scale;
    }

    update(deltaTime: number): void {
        this.playerController.update(deltaTime);
    }
}