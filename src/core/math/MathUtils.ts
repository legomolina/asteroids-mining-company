export default class MathUtils {
    // Interpolation functions
    static clamp(value: number, min: number, max: number): number {
        return Math.max(min, Math.min(value, max));
    }

    static lerp (x: number, y: number, a: number): number {
        return x * (1 - a) + y * a;
    }

    static invLerp (x: number, y: number, a: number) {
        return MathUtils.clamp((a - x) / (y - x), 0, 1);
    }

    static linearInterpolation (x1: number, y1: number, x2: number, y2: number, a: number): number {
        return MathUtils.lerp(x2, y2, MathUtils.invLerp(x1, y1, a));
    }

    // Decimal functions
    static roundToDecimal(value: number, decimalPlaces: number = 2): number {
        const multiplier = Math.pow(10, decimalPlaces);
        return Math.round(value * multiplier) / multiplier;
    }
}