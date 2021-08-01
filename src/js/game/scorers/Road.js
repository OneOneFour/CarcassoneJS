/* eslint-disable no-restricted-syntax */
import Game from '../carcasonne';
import Scorer from './Scorer';

class Road extends Scorer {
  isComplete() {
    return this.free_edges === 0;
  }

  get freeEdges() {
    let count = 0;
    for (const [t, szSet] of this.tiles.entries()) { // TODO: move to array + forEach
      const [x, y] = t.split(',').map((loc) => parseInt(loc, 10));
      for (const sz of szSet.values()) {
        count += Game.board.getTileSZOpenEdges(x, y, sz);
      }
    }
    return count;
  }

  score() {
    return this.tiles.size;
  }
}
export default Road;
