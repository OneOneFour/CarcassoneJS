import Game from './carcasonne';

const scorerConstructors = {
  C: City,
  F: Farm,
  R: Road,
  Cl: Cloister,
};

class Scoreboard {
  constructor() {
    this.scores = new Map();
    Game.players.forEach((p) => this.scorers.set(p, 0));
    this.scorers = []; // Store active scoring objects
  }

  getScorer(x, y, sz) {
    return this.scorers.reduce((acc, cur) => {
      if (cur.check_xysz(x, y, sz)) {
        return cur;
      }
      return false;
    }, false);
  }

  addScorer(x, y, sz) {
    const type = sz.match(/[A-Za-z]+/)[0];
    const scorer = new scorerConstructors[type]();
    scorer.add(x, y, sz);
    this.scorers.push(scorer);
  }

  mergeScorers(parent, child) {
    const parentScorer = this.getScorer(parent.x, parent.y, parent.sz);
    const childScorer = this.getScorer(child.x, child.y, child.sz);
    this.scorers.splice(this.scorers.indexOf(childScorer), 1); // delete from array #deleteurself
    parentScorer.merge(childScorer);
  }

  updateScorers() {
    for (let i = 0; i < this.scorers.length; i += 1) {
      const s = this.scorers[i];
      if (s.isComplete() && s.active) {
        // Building complete, time to TALLY THE SCORES
        // sum meeples
        const sScore = s.score();
        const meepleScores = new Map();
        s.meeples.forEach((meeple) => {
          if (meepleScores.has(meeple.player)) {
            meepleScores.set(meeple.player, meepleScores.get(meeple.player) + meeple.value);
          } else {
            meepleScores.set(meeple.player, meeple.value);
          }
          meeple.reset();
        });
        const largestScore = Math.max(...meepleScores.values());
        const winningPlayer = Array.from(meepleScores.keys()).filter(
          (k) => meepleScores.get(k) === largestScore,
        );
        winningPlayer.forEach(
          (player) => this.scores.set(player, this.scores.get(player) + sScore),
        ); // Update their score
        s.active = false;
      }
    }
  }
}
export default Scoreboard;
