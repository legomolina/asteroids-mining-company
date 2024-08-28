import { Circle, type Container, type ContainerChild, type Renderer } from 'pixi.js';
import Vector2 from '../../core/math/Vector2';
import MathUtils from '../../core/math/MathUtils';
import Asteroid from './Asteroid';

export class LargeAsteroid extends Asteroid {
    private static readonly TEXTURE_PATH = '/assets/sprites/asteroids/large.png';

    protected readonly asteroidName: string;
    protected readonly texturePath: string;

    hitBox!: Circle;
    isColliding!: boolean;

    public direction: Vector2;
    public health: number;
    public score: number;
    public rotationSpeed: number;
    public speed: number;

    constructor(container: Container<ContainerChild>, renderer: Renderer) {
        super(container, renderer);

        this.asteroidName = 'large-asteroid';
        this.texturePath = LargeAsteroid.TEXTURE_PATH;

        this.direction = Vector2.zero;
        this.health = 3;
        this.score = 40;
        this.rotationSpeed = MathUtils.randomRange(-2, 2);
        this.speed = 2 + Math.random();
    }

    render() {
        super.render();

        this.sprite.tint = '#e45555';
    }

    protected createHitBox(): Circle {
        return new Circle(this.transform.position.x, this.transform.position.y, 54);
    }
}