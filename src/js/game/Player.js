class Meeple {
  constructor(player, value) {
    this.player = player;
    this.value = value;
  }

  set_pos(x, y, sz) {
    this.x = x;
    this.y = y;
    this.sz = sz;
  }

  reset() {
    delete this.x;
    delete this.y;
    delete this.sz;
  }

  get free() {
    return typeof this.sz === 'undefined';
  }
}

class Player {
  constructor(name) {
    this.name = name;
    this.color = 'red';// Automate this
    this.meeples_ = [new Meeple(this, 2)];
    for (let i = 1; i < 6; i++) {
      this.meeples_.push(new Meeple(this, 1));
    }
  }

  toString() {
    return this.name;
  }

  get available_meeples() {
    return this.meeples_.filter((meeple) => meeple.free);
  }

  get placed_meeples() {
    return this.meeples_.filter((meeple) => !meeple.free);
  }
}
export default Player;
