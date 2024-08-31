import { Point } from 'pixi.js';

export default class Transform {
    private _position: Point = new Point(0, 0);
    private _rotation: number = 0;
    private _scale: Point | number = 1;
    private _width: number = 0;
    private _height: number = 0;
    private _zIndex: number = 0;

    get position(): Point {
        return this._position;
    }

    set position(value: Point) {
        this._position = value;
    }

    get rotation(): number {
        return this._rotation;
    }

    set rotation(value: number) {
        this._rotation = value;
    }

    get scale(): Point | number {
        return this._scale;
    }

    set scale(value: Point | number) {
        this._scale = value;
    }

    get width(): number {
        return this._width;
    }

    set width(value: number) {
        this._width = value;
    }

    get height(): number {
        return this._height;
    }

    set height(value: number) {
        this._height = value;
    }

    get zIndex(): number {
        return this._zIndex;
    }

    set zIndex(value: number) {
        this._zIndex = value;
    }
}
