import { flooredmedian, mod } from "../utils/math_utils";
import {isSuperset,union,remainder} from '@/js/utils/set_utils';

const point_lut = {
    0:[0.15,0.15],
    1:[0.5,0.15],
    2:[0.85,0.15],
    3:[0.85,0.15],
    4:[0.85,0.5],
    5:[0.85,0.85],
    6:[0.85,0.85],
    7:[0.5,0.85],
    8:[0.15,0.85],
    9:[0.15,0.85],
    10:[0.15,0.5],
    11:[0.15,0.15]
}



// Verify objects
function cleanverify_tile_templates(set,key){
    let template = Object.assign({},set[key])
    let assigned_vertices = new Set();
    let fill_remaining = -1;
    const zones = [...template.cities||[],...template.roads||[],...template.farms||[]] 
    for(let [i,zone] of zones.entries()){
        if(Array.isArray(zone.vertices)){
            const vertices = new Set(zone.vertices)
            if(isSuperset(assigned_vertices,vertices)){
                throw SyntaxError(`${key} ERROR: Contains duplicate vertices `)
            }
            zone.vertices.forEach( item => assigned_vertices.add(item))
            zone.vertices = vertices
            zone.bonus = zone.bonus || false
        }else{
            // directive
            if(zone.vertices === 'remain'){ // fill with remaining with complete
                if(fill_remaining >= 0) throw SyntaxError(`${key} ERROR: Can only use 'remain' directive once per definition`)
                fill_remaining = i
            }else{
                throw SyntaxError(`${key} ERROR: Unknown directive "${zone.vertices}"`)
            }
        }
    }
    if(template.river){
        const vertices = new Set(template.river)
        if(isSuperset(assigned_vertices,vertices)){
            throw SyntaxError(`${key} ERROR: Contains duplicate vertices `)
        }
        template.river.forEach(item => assigned_vertices.add(item))
        template.river = vertices
    }
    if(fill_remaining >= 0){
        zones[fill_remaining].vertices = remainder(assigned_vertices)
        assigned_vertices = union(assigned_vertices,zones[fill_remaining].vertices)
    }
    if(assigned_vertices.size != 12) throw SyntaxError(`${key} ERROR: Not all tile vertices defined! Missing ${ [...remainder(assigned_vertices)]}`)
    template.cloister = template.cloister || false
    return template
}

class TileTemplate{
    constructor(deck,key){
        const clean_template = cleanverify_tile_templates(deck,key)
    // This may turn out to be **horribly inefficent** or maybe rather snappy - we shall see
        this.vertex_template = {}; 
        this.farm_to_cities = {};
        this.bonus = new Set();
        this.cloister = clean_template.cloister;
        this.key = key
        if(clean_template.cities){
            for(let [i,city] of clean_template.cities.entries()){
                this.vertex_template[`C${i}`] = city.vertices
                if(city.bonus) this.bonus.add(`C${i}`)
            }
        }
        if(clean_template.farms){
            for(let [i,farm] of clean_template.farms.entries()){
                this.vertex_template[`F${i}`] = farm.vertices
                if(farm.cities){
                    this.farm_to_cities[`F${i}`] = farm.cities.map( (x) => `C${x}`)
                }

            }
        }
        if(clean_template.roads){
            for(let [i,road] of clean_template.roads.entries()){
                this.vertex_template[`R${i}`] = road.vertices
                if(road.bonus) this.bonus.add(`R${i}`)
            }
        }
        if(clean_template.river){
            this.vertex_template[`Ri`] = clean_template.river
        }
    }
    szAtVertex(vertex,rotation){
        let corrected_vertex = mod(vertex - rotation * 3,12)
        for(const [sz,vertices] of Object.entries(this.vertex_template)){
            if(vertices.has(corrected_vertex)){
                return sz
            }
        }
        throw RangeError("Edge of out range")
    }
    typeAtVertex(vertex,rotation){
        return this.szAtVertex(vertex,rotation).match(/[a-zA-Z]+/)[0]
    }
    szEdges(sz,rotation){
        return new Set(Array.from(this.vertex_template[sz]).map( vertex => Math.floor( mod(vertex + rotation*3,12)/3)));
    }
}
class Tile{
    constructor(template,rotation){
        this.template = template
        this.rotation = rotation || 0 ;
        if(this.rotation > 3 || this.rotation < 0) throw RangeError("Rotation must be in [0,1,2,3]") 
    }
    typeAtVertex(vertex){
        return this.template.typeAtVertex(vertex,this.rotation)
    }
    szAtVertex(vertex){
        return this.template.szAtVertex(vertex,this.rotation)
    }
    szEdges(sz){
        return this.template.szEdges(sz,this.rotation)
       
    }
    get edges(){
        return [this.top,this.right,this.bottom,this.left]
    }
    get top(){
        return this.typeAtVertex(1)
    }
    get right(){
        return this.typeAtVertex(4)
    }
    get bottom(){
        return this.typeAtVertex(7)
    }
    get left(){
        return this.typeAtVertex(10)
    }
    get farm_to_cities(){
        return this.template.farm_to_cities
    }
    get cloister(){
        return this.template.cloister
    }
    get bonus(){
        return this.template.bonus
    }
    get scoringZones(){
        return Object.keys(this.template.vertex_template)
    }
    estimatePosition(sz){ // Gets rotated along with everything LOL
        //TODO Move to template?
        // Average x and y 
        if(sz == 'Cl') return [0.5,0.5]
        let vertices = this.template.vertex_template[sz]
        let xs = [],ys = []
        for(let vertex of vertices){
            console.log(vertex,mod(vertex,12))
            let [x,y] = point_lut[mod(vertex,12)]
            xs.push(x)
            ys.push(y)
        }
        return [flooredmedian(xs),flooredmedian(ys)]
    }
}

export {Tile,TileTemplate};