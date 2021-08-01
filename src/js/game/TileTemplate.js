/* eslint-disable no-restricted-syntax */
import { isSuperset, union, remainder } from '@/js/utils/set_utils';
import { mod } from '../utils/math_utils';

// Verify objects
function cleanVerifyTileTemplates(set, key) {
  const template = { ...set[key] };
  let assignedVertices = new Set();
  let fillRemaining = -1;
  const zones = [...template.cities || [], ...template.roads || [], ...template.farms || []];
  for (const [i, zone] of zones.entries()) {
    if (Array.isArray(zone.vertices)) {
      const vertices = new Set(zone.vertices);
      if (isSuperset(assignedVertices, vertices)) {
        throw SyntaxError(`${key} ERROR: Contains duplicate vertices `);
      }
      for (const item of zone.vertices) {
        assignedVertices.add(item);
      }
      zone.vertices = vertices;
      zone.bonus = zone.bonus || false;
    } else if (zone.vertices === 'remain') { // fill with remaining with complete
      if (fillRemaining >= 0) throw SyntaxError(`${key} ERROR: Can only use 'remain' directive once per definition`);
      fillRemaining = i;
    } else {
      throw SyntaxError(`${key} ERROR: Unknown directive "${zone.vertices}"`);
    }
  }
  if (template.river) {
    const vertices = new Set(template.river);
    if (isSuperset(assignedVertices, vertices)) {
      throw SyntaxError(`${key} ERROR: Contains duplicate vertices `);
    }
    template.river.forEach((item) => assignedVertices.add(item));
    template.river = vertices;
  }
  if (fillRemaining >= 0) {
    zones[fillRemaining].vertices = remainder(assignedVertices);
    assignedVertices = union(assignedVertices, zones[fillRemaining].vertices);
  }
  if (assignedVertices.size !== 12) throw SyntaxError(`${key} ERROR: Not all tile vertices defined! Missing ${[...remainder(assignedVertices)]}`);
  template.cloister = template.cloister || false;
  return template;
}

class TileTemplate {
  constructor(deck, key) {
    const cleanTemplate = cleanVerifyTileTemplates(deck, key);

    // This may turn out to be **horribly inefficent** or maybe rather snappy - we shall see
    this.vertexTemplate = {};
    this.farmToCities = {};
    this.meeplePosition = {};
    this.bonus = new Set();
    this.cloister = cleanTemplate.cloister;
    this.key = key;
    if (cleanTemplate.cities) {
      for (const [i, city] of cleanTemplate.cities.entries()) {
        this.vertexTemplate[`C${i}`] = city.vertices;
        if (city.bonus) this.bonus.add(`C${i}`);
        if (city.meeplePosition) this.meeplePosition[`C${i}`] = city.meeplePosition;
      }
    }
    if (cleanTemplate.farms) {
      for (const [i, farm] of cleanTemplate.farms.entries()) {
        this.vertexTemplate[`F${i}`] = farm.vertices;
        if (farm.cities) {
          this.farmToCities[`F${i}`] = farm.cities.map((x) => `C${x}`);
        }
        if (farm.meeplePosition) this.meeplePosition[`F${i}`] = farm.meeplePosition;
      }
    }
    if (cleanTemplate.roads) {
      for (const [i, road] of cleanTemplate.roads.entries()) {
        this.vertexTemplate[`R${i}`] = road.vertices;
        if (road.bonus) this.bonus.add(`R${i}`);
      }
    }
    if (cleanTemplate.river) {
      this.vertexTemplate.Ri = cleanTemplate.river;
    }
  }

  szAtVertex(vertex, rotation) {
    const correctedVertex = mod(vertex - rotation * 3, 12);
    for (const [sz, vertices] of Object.entries(this.vertexTemplate)) {
      if (vertices.has(correctedVertex)) {
        return sz;
      }
    }
    throw RangeError('Edge of out range');
  }

  typeAtVertex(vertex, rotation) {
    return this.szAtVertex(vertex, rotation).match(/[a-zA-Z]+/)[0];
  }

  szEdges(sz, rotation) {
    return new Set(Array.from(this.vertexTemplate[sz]).map(
      (vertex) => Math.floor(mod(vertex + rotation * 3, 12) / 3),
    ));
  }
}
export default TileTemplate;
