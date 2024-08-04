import { AsteroidsGame } from './AsteroidsGame';
import './math/Utils';

const game = new AsteroidsGame();

game.init().then(() => {
    game.setDebug(true);
});
