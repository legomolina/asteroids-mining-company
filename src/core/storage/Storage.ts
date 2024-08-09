export class Storage {
    private static readonly HIGH_SCORE_KEY = 'asteroids:high_score';

    private static _instance?: Storage;

    static get instance() {
        Storage._instance ??= new Storage();
        return Storage._instance;
    }

    private constructor() {
    }

    saveScore(score: number): void {
        localStorage.setItem(Storage.HIGH_SCORE_KEY, JSON.stringify(score));
    }

    getScore(): number {
        const data = localStorage.getItem(Storage.HIGH_SCORE_KEY);

        return data ? JSON.parse(data) : 0;
    }
}