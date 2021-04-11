import seedrandom from 'seedrandom';
import {TileTemplate,Tile} from './Tile.js';
import { Base, River } from './tile_defs/index';

function shuffled_arr_from_counts(counts,rng,offset){
    if(typeof rng === 'undefined'){
        rng = Math.random
    }
    if(typeof offset === 'undefined'){
        offset = 0
    }
    let arr = [];
    for(let n= counts.reduce((cur,acc)=> acc + cur); n > 0; n--){
        var val = rng()
        for(let i=0,prob=counts[i]/n; i < counts.length;i++,prob+=counts[i]/n){
            if(prob > val){
                counts[i] -= 1
                arr.push(i+offset)
                break
            }
        }
    }
    return arr
}


class Deck{
    constructor(deck_template,seed,river_template){
        /**  
          * @param {Object} deck_template Deck specification, key value pairs of template and count
          * @param {Number} seed Random Seed for deck shuffling
          * @param {Object} river_template River deck specification, prepended to deck. Do *not* put in the river ends these are included automatically ( this is a bit dodge i guess maybe fix?)
          * 
        */
        this.rng = seedrandom(seed)

        //TODO: Move validator here -> Makes more sense only to validated requested tiles to prevent errors
        this.unique_objects_defn_ = Object.keys(deck_template).map( x=> new TileTemplate(Base,x)) 

        this.deck = []

        var counts = Object.values(deck_template)
        this.deck = shuffled_arr_from_counts(counts,this.rng)

        if (typeof river_template !== 'undefined'){
            var non_river_length = this.unique_objects_defn_.length
            // TODO: 
            this.unique_objects_defn_.push(...Object.keys(river_template).map(x=> new TileTemplate(River,x)))
            this.unique_objects_defn_.push( new TileTemplate(River,'F,F,Ri,F,Ri'))
            counts = Object.values(river_template)
            let river = shuffled_arr_from_counts(counts,this.rng,non_river_length)
            river.splice(0,0,counts.length+non_river_length)
            river.push(counts.length+non_river_length)
            this.deck.push(...river)
        }
    }
    tile(idx,rotation){
        return new Tile(this.unique_objects_defn_[idx],rotation)
    }
    getTemplate(idx){
        return this.unique_objects_defn_[idx]
    }
    left(){
        return this.deck.left
    }
    get(turn){
        return this.deck[turn]
    }
}

export default Deck;

