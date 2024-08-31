import type IEntity from '../IEntity';
import Transform from '../../core/components/Transform';
import {
    Assets,
    NineSliceSprite,
    type Container,
    type ContainerChild,
    type Texture,
    type Renderer,
    Point, EventEmitter,
} from 'pixi.js';
import UIText from './UIText';

type ButtonEvents = {
    click: () => void
};

export default class UIButton extends EventEmitter<ButtonEvents> implements IEntity {
    private static readonly TEXTURE_PATH = '/assets/sprites/ui/button.png';

    private readonly _transform: Transform;
    private readonly uiText: UIText;

    private texture!: Texture;
    private sprite?: NineSliceSprite;

    private _text = '';

    isLoaded: boolean = false;

    get transform(): Transform {
        return this._transform;
    }

    set text(value: string) {
        this._text = value;
    }

    constructor(private readonly container: Container<ContainerChild>, private readonly renderer: Renderer) {
        super();

        this._transform = new Transform();
        this.uiText = new UIText(this.container, this.renderer);
    }

    async load(): Promise<void> {
        this.texture = await Assets.load(UIButton.TEXTURE_PATH);
        this.sprite = new NineSliceSprite({
            texture: this.texture,
            topHeight: 8,
            rightWidth: 8,
            bottomHeight: 8,
            leftWidth: 8,
        });

        this.sprite.eventMode = 'static';
        this.sprite.addEventListener('pointertap', (e) => {
            console.log(e);
            this.emit('click');
        });

        await this.uiText.load();
        this.uiText.fontSize = 14;
        this.uiText.color = 'white';

        this.container.addChild(this.sprite);

        this.isLoaded = true;
    }

    render(): void {
        if (this.sprite) {
            this.sprite.width = Math.max(this.uiText.textWidth + 20, this.transform.width);
            this.sprite.height = Math.max(this.uiText.textHeight + 15, this.transform.height);
            this.sprite.position = this.transform.position;
        }

        this.uiText.text = this._text;
        this.uiText.transform.position = new Point(
            this.transform.position.x + this.transform.width / 2 - this.uiText.textWidth / 2,
            this.transform.position.y + this.transform.height / 2 - this.uiText.textHeight / 2,
        );
        this.uiText.transform.zIndex = 10;

        this.uiText.render();
    }

    update(): void {
        this.transform.width = Math.max(this.uiText.textWidth + 40, this.transform.width);
        this.transform.height = Math.max(this.uiText.textHeight + 30, this.transform.height);

        this.uiText.update();
    }
}