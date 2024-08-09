export interface Loadable {
    loaded: boolean;

    loadContent(): Promise<void>;
}