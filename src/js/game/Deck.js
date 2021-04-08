import seedrandom from 'seedrandom';
import Tile from './Tile';
import { Base, cleanverify_tile_templates, River } from './tile_defs/index';

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

function factory_from_template(deck,key){
    const clean_template = cleanverify_tile_templates(deck,key)
    // This may turn out to be **horribly inefficent** or maybe rather snappy - we shall see
    let vertex_template = {}; 
    let farm_to_cities = {};
    let bonus = new Set();
    let cloister = clean_template.cloister;

    if(clean_template.cities){
        for(let [i,city] of clean_template.cities.entries()){
            vertex_template[`C${i}`] = city.vertices
            if(city.bonus) bonus.add(`C${i}`)
        }
    }
    if(clean_template.farms){
        for(let [i,farm] of clean_template.farms.entries()){
            vertex_template[`F${i}`] = farm.vertices
            if(farm.cities){
                farm_to_cities[`F${i}`] = farm.cities.map( (x) => `C${x}`)
            }

        }
    }
    if(clean_template.roads){
        for(let [i,road] of clean_template.roads.entries()){
            vertex_template[`R${i}`] = road.vertices
            if(road.bonus) bonus.add(`R${i}`)
        }
    }
    if(clean_template.river){
        vertex_template[`Ri`] = clean_template.river
    }
    return function(){
        return new Tile({vertices:vertex_template,farm_to_cities,bonus,cloister})
    }
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
        this.unique_objects_defn_ = Object.keys(deck_template).map( x=> factory_from_template(Base,x)) 

        this.deck = []

        var counts = Object.values(deck_template)
        this.deck = shuffled_arr_from_counts(counts,this.rng)

        if (typeof river_template !== 'undefined'){
            var non_river_length = this.unique_objects_defn_.length
            // TODO: 
            this.unique_objects_defn_.push(...Object.keys(river_template).map(x=> factory_from_template(River,x)))
            this.unique_objects_defn_.push(factory_from_template(River,'F,F,Ri,F,Ri'))
            counts = Object.values(river_template)
            let river = shuffled_arr_from_counts(counts,this.rng,non_river_length)
            river.splice(0,0,counts.length+non_river_length)
            river.push(counts.length+non_river_length)
            this.deck.push(...river)
        }
    }
    left(){
        return this.deck.left
    }
    next(){
        return this.unique_objects_defn_[this.deck.pop()]()
    }
}

export default Deck;

