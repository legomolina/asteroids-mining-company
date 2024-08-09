export interface Initializable {
    initialized: boolean;

    initialize(): Promisable<void>;
}