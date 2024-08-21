type GamepadApi = globalThis.Gamepad;

type KeysOf<T extends Record> = keyof T;
type ValuesOf<T extends Record> = T[KeysOf<T>];