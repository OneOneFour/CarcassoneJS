import Game from "./carcasonne";

function format_x_y(t_x,t_y){
    return `${t_x},${t_y}`
}
class Scoreboard{
    constructor(){
        this.scores = new Map();
        for(let p of Game.players){
            this.scores.set(p,0);
        }
        this.scorers_ = []; // Store active scoring objects
    }
    getScorer(t_x,t_y,sz){
        for(let s of this.scorers_){
            if(s.check_xysz(t_x,t_y,sz)) return s
        }
    }
    addScorer(t_x,t_y,sz){
        const type = sz.match(/[A-Za-z]+/)[0]
        const scorer_ = new scorer_constructors[type]() 
        scorer_.add(t_x,t_y,sz)
        this.scorers_.push(scorer_)
    }
    mergeScorers(parent,child){
        let p_s = this.getScorer(parent.x,parent.y,parent.sz)
        let c_s = this.getScorer(child.x,child.y,child.sz)
        this.scorers_.splice(this.scorers_.indexOf(c_s),1) // delete from array #deleteurself
        p_s.merge(c_s)

    }
    updateScorers(){
        for(let i =0; i < this.scorers_.length;i++){
            const s = this.scorers_[i]
            if(s.isComplete() && s.active ){
                // Building complete, time to TALLY THE SCORES
                // sum meeples
                let s_score = s.score()
                let meeple_scores = new Map();
                for(let meeple of s.meeples){
                    if(meeple_scores.has(meeple.player)){
                        meeple_scores.set(meeple.player,meeple_scores.get(meeple.player) + meeple.value)
                    }else{
                        meeple_scores.set(meeple.player,meeple.value)
                    }
                    meeple.reset()

                }
                let largest_score = Math.max(...meeple_scores.values())
                let winning_player = Array.from(meeple_scores.keys()).filter((k) => meeple_scores.get(k) == largest_score)
                winning_player.forEach( player => this.scores.set(player, this.scores.get(player) + s_score)) // Update their score
                s.active = false;
            }
        }
    }
}

class Scorer{
    constructor(){
        this.tiles_ = new Map();
        this.active = true;
    }
    get(t_x,t_y){
        return this.tiles_.get(format_x_y(t_x,t_y))
    }
    check_xysz(x,y,sz){
        if(this.tiles_.has(format_x_y(x,y))){
            return this.tiles_.get(format_x_y(x,y)).has(sz)
        }
        return false;
    }
    get meeples(){
        return Game.players.flatMap( (player) => player.placed_meeples)
                            .filter( (meeple) => this.check_xysz(meeple.x,meeple.y,meeple.sz) )
    }
    add(t_x,t_y,sz){
        if(this.tiles_.has(format_x_y(t_x,t_y))){
            this.tiles_.get(format_x_y(t_x,t_y).add(sz))
        }else{
            this.tiles_.set(format_x_y(t_x,t_y),new Set([sz]))
        }
    }
    isComplete(){
        return false;
    }
    merge(child){
        // Merge child scorer into it 
        for(let k of child.tiles_.keys()){
            if(this.tiles_.has(k)){
                this.tiles_.get(k).add(child.tiles_.get(k))
            }else{
                this.tiles_.set(k,child.tiles_.get(k))
            }
        }
    }
    canAddMeeple(meeple){
        return (this.meeples.filter( x=> x.player == meeple.player).length == 0) && meeple.free
    }
}

class City extends Scorer{
    static city_count = 0;
    constructor(){
        super()
        this.name = `City ${City.city_count++}`
    }
    isComplete(){
        return this.free_edges == 0 
    } 
    get free_edges(){ // Get # of free edges left in city. When zero, city is completed
        let count = 0;
        for(let [t,sz_set] of this.tiles_.entries()){
            const [x,y] = t.split(',').map( x => parseInt(x) )
            for(let sz of sz_set.values()){
                count += Game.board.getTileSZOpenEdges(x,y,sz)
            }
        }
        return count;
    }
    score(end_game=false){ // If endgame, tile only worth one.
        let score = this.tiles_.size * ( (end_game)? 1:2)
        for(let [t,sz_set] of this.tiles_.entries()){
            const [x,y] = t.split(',').map(x=>parseInt(x))
            for(let sz of sz_set.values()){
                score += Game.getTile(x,y).bonus.has(sz) ? 1 : 0 
            }           
        }// Add on pennants
        return score
    }
    toString(){
        return this.name
    }
}

class Farm extends Scorer{
    static farm_count = 0;
    constructor(){
        super()
        this.name = `Farm ${Farm.farm_count++}`
    }
    servedCities(){
        // Get all served cities objects (even if incomplete)
        let cities = new Set(); // Cities should be unique 
        for(let [t,sz_set] of this.tiles_.entries()){
            const [x,y] = t.split(',').map(x=>parseInt(x))
            const t_cities = new Set(Array.from(sz_set).map( sz=> Game.getTile(x,y).farm_to_cities[sz]).filter( city => Boolean(city)).flat())
            if(t_cities.size == 0) continue; // Does not serve cities on this tile
            console.log(t_cities)
            cities.add(...Array.from(t_cities).map( (city_sz) => Game.getScorer(x,y,city_sz))) 
        }
        return cities
    }
    score(){
        return Array.from(this.servedCities()).filter(city => city.isComplete() ).length * 3 
    }

}

class Road extends Scorer{
    isComplete(){
        return this.free_edges == 0 
    } 
    get free_edges(){
        let count = 0;
        for(let [t,sz_set] of this.tiles_.entries()){
            const [x,y] = t.split(',').map( x => parseInt(x) )
            for(let sz of sz_set.values()){
                count += Game.board.getTileSZOpenEdges(x,y,sz)
            }
        }
        return count;
    }
    score(){
        return this.tiles_.size
    }
}

class Cloister extends Scorer{
    // Overload add
    add(x,y){
        this.x = x 
        this.y = y 
    }
    check_xysz(x,y,sz){
        return x == this.x && y == this.y && sz == 'Cl'
    }
    isComplete(){
        return this.neighbours == 8 
    }
    get neighbours(){
        return Game.board.fullNeighbours(this.x,this.y).filter((x) => x).length
    }
    score(){
        return 1 + this.neighbours
    }
}
const scorer_constructors = {
    'C':City,
    'F':Farm,
    'R':Road,
    'Cl':Cloister
}
export {Scoreboard,City,Farm,Road,Cloister};