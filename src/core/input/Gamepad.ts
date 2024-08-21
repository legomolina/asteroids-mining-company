import { Point } from 'pixi.js';
import MathUtils from '../math/MathUtils';

export const GamepadButtons = {
    A: 0,
    B: 1,
    X: 2,
    Y: 3,
    LB: 4,
    RB: 5,
    Back: 8,
    Start: 9,
    LeftStick: 10,
    RightStick: 11,
    DpadUp: 12,
    DpadDown: 13,
    DpadLeft: 14,
    DpadRight: 15,
} as const;

export const GamepadTriggers = {
    LT: 0,
    RT: 1,
} as const;

export const GamepadSticks = {
    Left: 0,
    Right: 1,
} as const;

type GamepadButtonKey = KeysOf<typeof GamepadButtons>;
type GamepadButtonValue = ValuesOf<typeof GamepadButtons>;
type GamepadButtonState = boolean;

type GamepadStickKey = KeysOf<typeof GamepadSticks>;
type GamepadStickValue = ValuesOf<typeof GamepadSticks>;
type GamepadStickState = {
    pressed: boolean;
    position: Point
};

type GamepadTriggerKey = KeysOf<typeof GamepadTriggers>;
type GamepadTriggerValue = ValuesOf<typeof GamepadTriggers>;
type GamepadTriggerState = number;

export default class Gamepad {
    private static readonly DEFAULT_STICK_STATE: GamepadStickState = {
        pressed: false,
        position: new Point(0, 0),
    };
    private static readonly LT_INDEX = 6;
    private static readonly RT_INDEX = 7;
    private static readonly LEFT_STICK_X_AXE = 0;
    private static readonly LEFT_STICK_Y_AXE = 1;
    private static readonly LEFT_STICK_BUTTON = 10;
    private static readonly RIGHT_STICK_X_AXE = 2;
    private static readonly RIGHT_STICK_Y_AXE = 3;
    private static readonly RIGHT_STICK_BUTTON = 11;

    public static STICK_DEADZONE = .11;

    // States
    private readonly buttonsState = new Map<GamepadButtonValue, GamepadButtonState>();
    private previousButtonsState = new Map<GamepadButtonValue, GamepadButtonState>();
    private readonly sticksState = new Map<GamepadStickValue, GamepadStickState>();
    private readonly triggerState = new Map<GamepadTriggerValue, GamepadTriggerState>();

    constructor(private readonly controllerIndex: number) {
    }

    isButtonPressed(button: GamepadButtonKey): GamepadButtonState {
        return this.buttonsState.get(GamepadButtons[button]) ?? false;
    }

    isButtonReleased(button: GamepadButtonKey): GamepadButtonState {
        return !this.buttonsState.get(GamepadButtons[button]) && (this.previousButtonsState.get(GamepadButtons[button]) ?? false);
    }

    getTrigger(trigger: GamepadTriggerKey): GamepadTriggerState {
        return this.triggerState.get(GamepadTriggers[trigger]) ?? 0;
    }

    getStick(stick: GamepadStickKey): GamepadStickState {
        return this.sticksState.get(GamepadSticks[stick]) ?? Gamepad.DEFAULT_STICK_STATE;
    }

    update(): void {
        const gamepad = navigator.getGamepads()[this.controllerIndex];

        if (!gamepad) {
            return;
        }

        this.previousButtonsState = new Map([...this.buttonsState]);

        // Update buttons state
        gamepad.buttons.forEach((button, index) => {
            const buttonIndex = index as GamepadButtonValue;
            this.buttonsState.set(buttonIndex, button.pressed);
        });

        // Update triggers state
        this.triggerState.set(GamepadTriggers.LT, gamepad.buttons[Gamepad.LT_INDEX]?.value ?? 0);
        this.triggerState.set(GamepadTriggers.RT, gamepad.buttons[Gamepad.RT_INDEX]?.value ?? 0);

        // Update sticks state
        this.sticksState.set(GamepadSticks.Left, {
            pressed: gamepad.buttons[Gamepad.LEFT_STICK_BUTTON]?.pressed ?? false,
            position: new Point(
                this.applyAxeModifications(gamepad.axes[Gamepad.LEFT_STICK_X_AXE] ?? 0),
                this.applyAxeModifications(gamepad.axes[Gamepad.LEFT_STICK_Y_AXE] ?? 0),
            ),
        });
        this.sticksState.set(GamepadSticks.Right, {
            pressed: gamepad.buttons[Gamepad.RIGHT_STICK_BUTTON]?.pressed ?? false,
            position: new Point(
                this.applyAxeModifications(gamepad.axes[Gamepad.RIGHT_STICK_X_AXE] ?? 0),
                this.applyAxeModifications(gamepad.axes[Gamepad.RIGHT_STICK_Y_AXE] ?? 0),
            ),
        });
    }

    private applyAxeDeadzone(value: number): number {
        return Math.abs(value) < Gamepad.STICK_DEADZONE ? 0 : value;
    }

    private applyAxeRound(value: number): number {
        return MathUtils.roundToDecimal(value, 4);
    }

    private applyAxeModifications(value: number): number {
        return this.applyAxeRound(this.applyAxeDeadzone(value));
    }
}