import { flooredmedian, mod } from '../utils/math_utils';

const pointLUT = {
  0: [0.15, 0.15],
  1: [0.5, 0.15],
  2: [0.85, 0.15],
  3: [0.85, 0.15],
  4: [0.85, 0.5],
  5: [0.85, 0.85],
  6: [0.85, 0.85],
  7: [0.5, 0.85],
  8: [0.15, 0.85],
  9: [0.15, 0.85],
  10: [0.15, 0.5],
  11: [0.15, 0.15],
};

class Tile {
  constructor(template, rotation) {
    this.template = template;
    this.rotation = rotation || 0;
    if (this.rotation > 3 || this.rotation < 0) throw RangeError('Rotation must be in [0,1,2,3]');
  }

  typeAtVertex(vertex) {
    return this.template.typeAtVertex(vertex, this.rotation);
  }

  szAtVertex(vertex) {
    return this.template.szAtVertex(vertex, this.rotation);
  }

  szEdges(sz) {
    return this.template.szEdges(sz, this.rotation);
  }

  get edges() {
    return [this.top, this.right, this.bottom, this.left];
  }

  get top() {
    return this.typeAtVertex(1);
  }

  get right() {
    return this.typeAtVertex(4);
  }

  get bottom() {
    return this.typeAtVertex(7);
  }

  get left() {
    return this.typeAtVertex(10);
  }

  get farmToCities() {
    return this.template.farmToCities;
  }

  get cloister() {
    return this.template.cloister;
  }

  get bonus() {
    return this.template.bonus;
  }

  get scoringZones() {
    return Object.keys(this.template.vertexTemplate);
  }

  estimatePosition(sz) { // Gets rotated along with everything LOL
    // TODO Move to template?
    // Average x and y
    if (sz in this.template.meeplePosition) return this.template.meeplePosition[sz];
    if (sz === 'Cl') return [0.5, 0.5];
    const vertices = this.template.vertexTemplate[sz];
    const xs = []; const ys = [];
    vertices.forEach((vertex) => {
      console.log(vertex, mod(vertex, 12));
      const [x, y] = pointLUT[mod(vertex, 12)];
      xs.push(x);
      ys.push(y);
    });
    return [flooredmedian(xs), flooredmedian(ys)];
  }
}

export default Tile;
