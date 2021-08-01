/* eslint-disable no-restricted-syntax,no-continue,no-loop-func */
import Scorer from './Scorer';
import Game from '../carcasonne';

class Farm extends Scorer {
    static farmCount = 0;

    constructor() {
      super();
      Farm.farmCount += 1;
      this.name = `Farm ${Farm.farmCount}`;
    }

    servedCities() {
      // Get all served cities objects (even if incomplete)
      const cities = new Set(); // Cities should be unique
      for (const [t, szSet] of this.tiles.entries()) { // TODO: Move to array via forEach
        const [x, y] = t.split(',').map((loc) => parseInt(loc, 10));
        const tCities = new Set(Array.from(szSet).map(
          (sz) => Game.getTile(x, y).farmToCities[sz],
        ).filter((city) => Boolean(city)).flat());
        if (tCities.size === 0) continue; // Does not serve cities on this tile
        cities.add(Array.from(tCities).map((citySz) => Game.getScorer(x, y, citySz)));
      }
      return cities;
    }

    score() {
      return Array.from(this.servedCities()).filter((city) => city.isComplete()).length * 3;
    }
}
export default Farm;
