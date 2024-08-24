import type IEntity from '../IEntity';
import { Text, type Container, type ContainerChild, type TextDropShadow, type TextStyleAlign, Assets, type Renderer } from 'pixi.js';
import Transform from '../../core/components/Transform';

export default class UIText implements IEntity {
    private static readonly FONT_PATH = '/assets/fonts/asteroids-font.otf';

    private readonly textElement: Text;
    private readonly _transform: Transform;

    private fontFamily: string = '';

    isLoaded: boolean = false;

    public text: string = '';
    public align: TextStyleAlign = 'center';
    public color: string = '#DBF2FF';
    public fontSize: number = 12;
    public shadow: false | TextDropShadow = {
        alpha: 1,
        color: '#A9CADD',
        blur: 15,
        distance: 0,
        angle: 0,
    };

    get transform(): Transform {
        return this._transform;
    }

    get textWidth(): number {
        return this.textElement.width;
    }

    get textHeight(): number {
        return this.textElement.height;
    }

    constructor(private readonly container: Container<ContainerChild>, private renderer: Renderer) {
        this.textElement = new Text();
        this._transform = new Transform();
    }

    async load(): Promise<void> {
        const font = await Assets.load<FontFace>(UIText.FONT_PATH);
        this.fontFamily = font.family;

        this.container.addChild(this.textElement);
        
        this.isLoaded = true;
    }

    render(): void {
        this.textElement.text = this.text;
        this.textElement.style = {
            align: this.align,
            dropShadow: this.shadow,
            fill: this.color,
            fontFamily: this.fontFamily,
            fontSize: this.fontSize,
            padding: this.shadow ? this.shadow.blur * 2 : 20,
            wordWrap: true,
            wordWrapWidth: this.renderer.screen.width,
        };

        this.textElement.position = this.transform.position;
        this.textElement.angle = this.transform.rotation;
        this.textElement.scale = this.transform.scale;
    }

    update(): void { }

}