/* eslint-disable class-methods-use-this,no-restricted-syntax  */
import Game from '../carcasonne'

function formatXY(x, y) {
  return `${x},${y}`;
}

class Scorer {
  constructor() {
    this.tiles = new Map();
    this.active = true;
  }

  get(x, y) {
    return this.tiles.get(formatXY(x, y));
  }

  checkXYSZ(x, y, sz) {
    if (this.tiles.has(formatXY(x, y))) {
      return this.tiles.get(formatXY(x, y)).has(sz);
    }
    return false;
  }

  meeples() {
    return Game.players.flatMap((player) => player.placed_meeples)
      .filter((meeple) => this.checkXYSZ(meeple.x, meeple.y, meeple.sz));
  }

  add(x, y, sz) {
    if (this.tiles.has(formatXY(x, y))) {
      this.tiles.get(formatXY(x, y).add(sz));
    } else {
      this.tiles.set(formatXY(x, y), new Set([sz]));
    }
  }

  isComplete() {
    return false;
  }

  merge(child) {
    // Merge child scorer into it
    for (const k of child.tiles.keys()) {
      if (this.tiles.has(k)) {
        this.tiles.get(k).add(child.tiles.get(k));
      } else {
        this.tiles.set(k, child.tiles.get(k));
      }
    }
  }

  canAddMeeple(meeple) {
    return (this.meeples.filter((x) => x.player === meeple.player).length === 0) && meeple.free;
  }
}

export default Scorer;
