export const KeyboardKeys = {
    Up: 'ArrowUp',
    Down: 'ArrowDown',
    Left: 'ArrowLeft',
    Right: 'ArrowRight',
    Space: 'Space',
    F2: 'F2',
    F3: 'F3',
    F4: 'F4',
} as const;

type KeyboardKey = KeysOf<typeof KeyboardKeys>;
type KeyboardValue = ValuesOf<typeof KeyboardKeys>;
type KeyboardKeyState = boolean;

export default class Keyboard {
    private readonly state = new Map<KeyboardValue, KeyboardKeyState>();
    private previousState = new Map<KeyboardValue, KeyboardKeyState>();

    constructor() {
        window.addEventListener('keydown', (event: KeyboardEvent) => { this.handleKeyDown(event); });
        window.addEventListener('keyup', (event: KeyboardEvent) => { this.handleKeyUp(event); });
    }

    isKeyPressed(key: KeyboardKey): KeyboardKeyState {
        return this.state.get(KeyboardKeys[key]) ?? false;
    }

    isKeyReleased(key: KeyboardKey): KeyboardKeyState {
        return !this.state.get(KeyboardKeys[key]) && (this.previousState.get(KeyboardKeys[key]) ?? false);
    }

    update(): void {
        this.previousState = new Map([...this.state]);
    }

    private handleKeyDown(event: KeyboardEvent): void {
        const key = event.code as KeyboardValue;
        this.state.set(key, true);
    }

    private handleKeyUp(event: KeyboardEvent): void {
        const key = event.code as KeyboardValue;
        this.state.set(key, false);
    }
}