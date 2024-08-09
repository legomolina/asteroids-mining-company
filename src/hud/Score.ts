import type { Player } from '../entities/ships/Player';
import { UIText } from '../ui/components/UIText';
import { UIElement } from '../ui/UIElement';

export class Score extends UIElement {
    private text!: UIText;

    constructor(private player: Player) {
        super();
    }

    initialize(): Promisable<void> {
        this.text = new UIText('Score', 24);
        this.text.initialize();

        this.initialized = true;
    }

    async loadContent(): Promise<void> {
        await this.text.loadContent();

        this.text.x = 20;
        this.text.y = 20;

        this.addChild(this.text);

        this.loaded = true;
    }

    update() {
        this.text.setText(`Score: ${this.player.score}`);
    }
}