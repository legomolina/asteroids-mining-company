import { AsteroidsGame } from './AsteroidsGame';
import './math/Utils';

const game = new AsteroidsGame();

await game.init();

game.setDebug(true);