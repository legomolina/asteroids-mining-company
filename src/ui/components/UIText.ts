import { Text, type Ticker, type FillInput, Assets, type TextDropShadow } from 'pixi.js';
import { UIElement } from '../UIElement';

export class UIText extends UIElement {
    private static readonly FONT_PATH = '/assets/asteroids-font.otf';

    private textElement!: Text;

    constructor(
        private text: string,
        private fontSize: number = 12,
        private color: FillInput = '#DBF2FF',
        private shadow: boolean = true,
    ) {
        super();
    }

    async loadContent(): Promise<void> {
        const fontFamily = (await Assets.load(UIText.FONT_PATH)).family;

        let dropShadow: Partial<TextDropShadow> | undefined = undefined;

        if (this.shadow) {
            dropShadow = {
                alpha: 1,
                color: '#A9CADD',
                blur: 15,
                distance: 0,
            };
        }

        this.textElement = new Text({
            text: this.text,
            style: {
                fontFamily,
                fontSize: this.fontSize,
                fill: this.color,
                dropShadow,
                padding: 20,
            },
        });

        this.addChild(this.textElement);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update(_: Ticker): void { }

    setText(newText: string): void {
        this.textElement.text = newText;
    }
}