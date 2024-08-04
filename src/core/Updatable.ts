import type { Ticker } from 'pixi.js';

export interface Updatable {
    update(ticker: Ticker): void;
}