import type { Updatable } from '../Updatable';
import { Point } from 'pixi.js';

export type GamepadTriggerState = number;
export type GamepadStickState = {
    pressed: boolean;
    position: Point;
};

export enum GamepadButtons {
    A,
    B,
    X,
    Y,
    LB,
    RB,
    BACK = 8,
    START,
    LEFT_STICK,
    RIGHT_STICK,
    DPAD_UP,
    DPAD_DOWN,
    DPAD_LEFT,
    DPAD_RIGHT,
}

export enum GamepadTriggers {
    LT,
    RT,
}

export enum GamepadSticks {
    LEFT,
    RIGHT,
}

export class Gamepad implements Updatable {
    private static readonly LT_INDEX = 6;
    private static readonly RT_INDEX = 7;
    private static readonly LEFT_STICK_X_AXE = 0;
    private static readonly LEFT_STICK_Y_AXE = 1;
    private static readonly LEFT_STICK_BUTTON = 10;
    private static readonly RIGHT_STICK_X_AXE = 2;
    private static readonly RIGHT_STICK_Y_AXE = 3;
    private static readonly RIGHT_STICK_BUTTON = 11;

    private readonly buttonsState: Map<GamepadButtons, boolean> = new Map<GamepadButtons, boolean>();
    private readonly sticksState: Map<GamepadSticks, GamepadStickState> = new Map<GamepadSticks, GamepadStickState>();
    private readonly triggersState: Map<GamepadTriggers, GamepadTriggerState> = new Map<GamepadTriggers, GamepadTriggerState>();

    public static readonly STICK_DEADZONE = 0.11;

    constructor(private index: number) {}

    isButtonPressed(button: GamepadButtons): boolean {
        const state = this.buttonsState.get(button);
        return this.buttonsState.has(button) && state!;
    }

    isButtonReleased(button: GamepadButtons): boolean {
        const state = this.buttonsState.get(button);
        return this.buttonsState.has(button) && !state;
    }

    getStick(stick: GamepadSticks): GamepadStickState {
        return this.sticksState.get(stick) ?? { pressed: false, position: new Point(0, 0) };
    }

    getTrigger(trigger: GamepadTriggers): GamepadTriggerState {
        return this.triggersState.get(trigger)!;
    }

    update(): void {
        const gamepad = navigator.getGamepads()[this.index];

        if (!gamepad) {
            return;
        }

        // Update buttons state
        gamepad.buttons.forEach((button, index) => {
            if (!button.pressed) {
                this.buttonsState.delete(index);
                return;
            }

            this.buttonsState.set(index, button.pressed);
        });

        // Update triggers state
        this.triggersState.set(GamepadTriggers.LT, gamepad.buttons[Gamepad.LT_INDEX]!.value);
        this.triggersState.set(GamepadTriggers.RT, gamepad.buttons[Gamepad.RT_INDEX]!.value);

        // Update sticks state
        this.sticksState.set(GamepadSticks.LEFT, {
            pressed: gamepad.buttons[Gamepad.LEFT_STICK_BUTTON]!.pressed,
            position: new Point(this.applyAxeModifications(gamepad.axes[Gamepad.LEFT_STICK_X_AXE]!), this.applyAxeModifications(gamepad.axes[Gamepad.LEFT_STICK_Y_AXE]!)),
        });
        this.sticksState.set(GamepadSticks.RIGHT, {
            pressed: gamepad.buttons[Gamepad.RIGHT_STICK_BUTTON]!.pressed,
            position: new Point(this.applyAxeModifications(gamepad.axes[Gamepad.RIGHT_STICK_X_AXE]!), this.applyAxeModifications(gamepad.axes[Gamepad.RIGHT_STICK_Y_AXE]!)),
        });
    }

    private applyAxeDeadzone(value: number): number {
        return Math.abs(value) < Gamepad.STICK_DEADZONE ? 0 : value;
    }

    private applyAxeRound(value: number): number {
        return Math.roundToDecimal(value, 4);
    }

    private applyAxeModifications(value: number): number {
        return this.applyAxeRound(this.applyAxeDeadzone(value));
    }
}