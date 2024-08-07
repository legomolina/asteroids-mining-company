import { Entity } from '../Entity';
import { Assets, type Renderer, Text } from 'pixi.js';
import type { Player } from '../ships/Player';

export class Score extends Entity {
    private text!: Text;

    constructor(renderer: Renderer, private player: Player) {
        super(renderer);
    }

    async loadContent(): Promise<void> {
        await Assets.load('/assets/nasalization.otf');
        this.text = new Text({
            text: 'Score: ',
            style: {
                fontFamily: 'nasalization',
                fontSize: 24,
                fill: '#DBF2FF',
                dropShadow: {
                    alpha: 1,
                    color: '#A9CADD',
                    blur: 15,
                    distance: 0,
                },
                padding: 20,
            },
        });

        this.text.x = 20;
        this.text.y = 20;

        this.addChild(this.text);
    }

    update() {
        this.text.text = `Score: ${this.player.score}`;
    }
}