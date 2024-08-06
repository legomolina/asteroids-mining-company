declare global {
    interface Math {
        clamp(value: number, min: number, max: number): number;
        randomRange(min: number, max: number): number;
    }
}

Math.clamp = (value: number, min: number, max: number): number => {
    return Math.max(min, Math.min(value, max));
};

Math.randomRange = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min) + min);
};