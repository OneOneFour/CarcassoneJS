import Scorer from './Scorer';
import Game from '../carcasonne';

class Cloister extends Scorer {
  // Overload add
  add(x, y) {
    this.x = x;
    this.y = y;
  }

  checkXYSZ(x, y, sz) {
    return x === this.x && y === this.y && sz === 'Cl';
  }

  isComplete() {
    return this.neighbours === 8;
  }

  get neighbours() {
    return Game.board.fullNeighbours(this.x, this.y).filter((x) => x).length;
  }

  score() {
    return 1 + this.neighbours;
  }
}
export default Cloister;
