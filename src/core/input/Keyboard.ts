import type { Updatable } from '../Updatable';

export enum Keys {
    Up = 'ArrowUp',
    Down = 'ArrowDown',
    Left = 'ArrowLeft',
    Right = 'ArrowRight',
    Space = 'Space',
    LShift = 'ShiftLeft',
    F3 = 'F3',
}

export interface KeyState {
    code: Keys;
    isReleased: boolean;
}

export class Keyboard implements Updatable {
    private readonly state: Map<Keys, KeyState> = new Map<Keys, KeyState>();

    constructor() {
        window.addEventListener('keydown', (event: KeyboardEvent) => this.handleKeyDown(event));
        window.addEventListener('keyup', (event: KeyboardEvent) => this.handleKeyUp(event));
    }

    isKeyDown(key: Keys): boolean {
        const state = this.state.get(key);
        return this.state.has(key) && !state!.isReleased;
    }

    isKeyReleased(key: Keys): boolean {
        const state = this.state.get(key);
        return this.state.has(key) && state!.isReleased;
    }

    update(): void {
        this.state.forEach((_, key) => {
            const currentState = this.state.get(key);

            if (!currentState) {
                return;
            }

            if (currentState.isReleased) {
                this.state.delete(key);
            }
        });
    }

    private handleKeyDown(event: KeyboardEvent): void {
        if (event.key === 'F3') {
            event.preventDefault();
        }

        const key = event.code as Keys;

        if (!this.state.has(key)) {
            this.state.set(key, {
                code: key,
                isReleased: false,
            });
        }
    }

    private handleKeyUp(event: KeyboardEvent): void {
        event.preventDefault();

        const key = event.code as Keys;
        const currentState = this.state.get(key);

        if (currentState) {
            currentState.isReleased = true;
        }
    }
}