import Asteroid from './Asteroid';
import { Circle, type Container, type ContainerChild, type Renderer } from 'pixi.js';
import Vector2 from '../../core/math/Vector2';
import MathUtils from '../../core/math/MathUtils';

export default class MediumAsteroid extends Asteroid {
    private static readonly TEXTURE_PATH = '/assets/sprites/asteroids/medium.png';

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

        this.asteroidName = 'medium-asteroid';
        this.texturePath = MediumAsteroid.TEXTURE_PATH;

        this.direction = Vector2.zero;
        this.health = 2;
        this.score = 20;
        this.rotationSpeed = MathUtils.randomRange(-2, 2);
        this.speed = 2 + Math.random();
    }

    render() {
        super.render();

        this.sprite.tint = '#5fe455';
    }

    protected createHitBox(): Circle {
        return new Circle(this.transform.position.x, this.transform.position.y, 32);
    }
}