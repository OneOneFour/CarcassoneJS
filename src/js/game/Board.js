import { mod } from '@/js/utils/math_utils';
import { difference, setsEqual } from '@/js/utils/set_utils';
import Game from './carcasonne';

class Board {
  constructor(maxdims = 100) {
    this.map_ = new Array(maxdims * maxdims);
    this.origin_ = Math.floor(maxdims / 2);
    this.size_ = maxdims;
    // Stores game metadata => Conduit for all non map stuff to go via
  }

  get_raw(x, y) {
    const local_x = Math.floor(x + this.origin_);
    const local_y = Math.floor(y + this.origin_);
    const item = this.map_[local_x + this.size_ * local_y];
    return item;
  }

  get(x, y) {
    const item = this.get_raw(x, y);
    if (typeof item === 'undefined') return;
    return Game.tileFromTemplate(item);
  }

  neighbours(x, y) {
    return [
      this.get(x, y - 1),
      this.get(x + 1, y),
      this.get(x, y + 1),
      this.get(x - 1, y),
    ];
  }

  fullNeighbours(x, y) {
    return [
      this.get(x - 1, y - 1),
      this.get(x, y - 1),
      this.get(x + 1, y - 1),
      this.get(x + 1, y),
      this.get(x + 1, y + 1),
      this.get(x, y + 1),
      this.get(x - 1, y + 1),
      this.get(x - 1, y),
    ];
  }

  edgesAllowed(x, y) {
    const neighbours = this.neighbours(x, y);
    return [
      (neighbours[0]) ? neighbours[0].bottom : '*',
      (neighbours[1]) ? neighbours[1].left : '*',
      (neighbours[2]) ? neighbours[2].top : '*',
      (neighbours[3]) ? neighbours[3].right : '*',
    ];
  }

  isValid(x, y, tile) {
    if (typeof this.get(x, y) !== 'undefined') return false;
    const edges = this.edgesAllowed(x, y);
    if (setsEqual(new Set('*'), new Set(edges))) return false;
    return edges.reduce((acc, cur, i) => acc && (tile.edges[i] == cur || cur == '*'), true);
  }

  getTileSZOpenEdges(x, y, sz) {
    /** Returns number of null neighbours of a given tile for a given tile's score zone.
          * @param {Number} x X Coordinate of Tile
          * @param {Number} y Y Coordinate of Tile
          * @param {String} sz Score Zone of Tile to query
            @returns {Number} Number of open edges
        */
    const tile = this.get(x, y);
    if (typeof tile === 'undefined') throw RangeError('Querying Null tile -> I think something bad has happened');
    const edges = tile.szEdges(sz);
    return this.edgesAllowed(x, y).filter((v, i) => v == '*' && edges.has(i)).length;
  }

  addTile(x, y, template, rotation, force = false) {
    const tile = Game.tileFromTemplate({ template, rotation });
    if (!this.isValid(x, y, tile) && !force) throw Error('Tile cannot be placed at this spot');
    const tile_handledsz = new Set();
    for (const [i, neighbour_pos] of [[x, y - 1], [x + 1, y], [x, y + 1], [x - 1, y]].entries()) {
      const neighbour = this.get(...neighbour_pos);
      if (typeof neighbour !== 'undefined') {
        const edges = [i * 3, i * 3 + 1, i * 3 + 2];
        const neighbour_edges = [mod(i * 3 - 6, 12), mod(i * 3 - 5, 12), mod(i * 3 - 4, 12)];
        const neighbour_handledsz = new Set();
        for (let j = 0; j < 3; j++) {
          const dest_sz = neighbour.szAtVertex(neighbour_edges[j]); // neighbouring scoring zone
          if (neighbour_handledsz.has(dest_sz)) continue; // already handled the scorer for this zone -> SKIP
          const origin_sz = tile.szAtVertex(edges[j]); // Our scoring zone for this edge
          // Could check type here but **should** be compat via isValid method (which is faster)
          if (tile_handledsz.has(origin_sz)) {
            // get neighbouring scorer
            Game.mergeScorers({ x, y, sz: origin_sz }, { x: neighbour_pos[0], y: neighbour_pos[1], sz: dest_sz });
          } else {
            Game.getScorer(...neighbour_pos, dest_sz).add(x, y, origin_sz);
          }
          neighbour_handledsz.add(dest_sz);
          tile_handledsz.add(origin_sz);
        }
      }
    }

    const undealt = difference(new Set(tile.scoringZones), tile_handledsz);
    if (tile.cloister) undealt.add('Cl');
    undealt.forEach((sz) => Game.addScorer(x, y, sz));

    const local_x = Math.floor(x + this.origin_);
    const local_y = Math.floor(y + this.origin_);
    this.map_[local_x + this.size_ * local_y] = { template, rotation };
  }

  get size() {
    return this.size_;
  }
}

export default Board;
