/* eslint-disable no-restricted-syntax */
import Scorer from './Scorer';
import Game from '../carcasonne';
class City extends Scorer {
    static cityCount = 0;

    constructor() {
      super();
      City.cityCount += 1;
      this.name = `City ${City.cityCount}`;
    }

    isComplete() {
      return this.free_edges === 0;
    }

    get freeEdges() { // Get # of free edges left in city. When zero, city is completed
      let count = 0;
      for (const [t, szSet] of this.tiles.entries()) {
        const [x, y] = t.split(',').map((x) => parseInt(x, 10));
        for (const sz of szSet.values()) {
          count += Game.board.getTileSZOpenEdges(x, y, sz);
        }
      }
      return count;
    }

    score(endGame = false) { // If endgame, tile only worth one.
      let score = this.tiles.size * ((endGame) ? 1 : 2);
      for (const [t, szSet] of this.tiles.entries()) {
        const [x, y] = t.split(',').map((x) => parseInt(x, 10));
        for (const sz of szSet.values()) {
          score += Game.getTile(x, y).bonus.has(sz) ? 1 : 0;
        }
      }// Add on pennants
      return score;
    }

    toString() {
      return this.name;
    }
}
export default City;
