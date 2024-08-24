import type IEntity from '../IEntity';
import { Assets, Container, type ContainerChild, NineSliceSprite, type Texture } from 'pixi.js';
import Transform from '../../core/components/Transform';

export default class UIPane implements IEntity {
    private static readonly TEXTURE_PATH = '/assets/sprites/ui/pane.png';

    private readonly _paneContainer = new Container<ContainerChild>();
    private readonly _transform: Transform;

    private texture!: Texture;
    private sprite?: NineSliceSprite;

    isLoaded: boolean = false;

    get paneContainer(): Container<ContainerChild> {
        return this._paneContainer;
    }

    get transform(): Transform {
        return this._transform;
    }

    constructor(private readonly container: Container<ContainerChild>) {
        this._paneContainer = new Container();
        this._transform = new Transform();
    }

    async load(): Promise<void> {
        this.texture = await Assets.load(UIPane.TEXTURE_PATH);
        this.sprite = new NineSliceSprite({
            texture: this.texture,
            topHeight: 8,
            rightWidth: 8,
            bottomHeight: 8,
            leftWidth: 8,
        });

        this.paneContainer.addChild(this.sprite);
        this.container.addChild(this.paneContainer);
    }

    render(): void {
        if (this.sprite) {
            this.sprite.width = this.transform.width;
            this.sprite.height = this.transform.height;
        }

        this.paneContainer.position = this.transform.position;
        this.paneContainer.angle = this.transform.rotation;
        this.paneContainer.scale = this.transform.scale;
        this.paneContainer.width = this.transform.width;
        this.paneContainer.height = this.transform.height;
    }

    update(): void { }
}