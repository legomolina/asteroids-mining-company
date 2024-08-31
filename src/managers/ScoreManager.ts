export default class ScoreManager {
    private static _instance: ScoreManager;

    private _score = 0;

    get score(): number {
        return this._score;
    }

    static get instance(): ScoreManager {
        ScoreManager._instance ??= new ScoreManager();
        return ScoreManager._instance;
    }

    private constructor() { }

    increment(points: number): number {
        this._score += points;

        return this.score;
    }

    reset(): void {
        this._score = 0;
    }
}