import { mod } from "../utils/math_utils";

class Tile{
    constructor({vertices,farm_to_cities,bonus,cloister}){
        this.vertices = vertices
        this.farm_to_cities = farm_to_cities
        this.bonus = bonus
        this.cloister = cloister || false
        this.rotation = 0;
    }
    rotateRight(){
        if(++this.rotation>= 4){
            this.rotation = 0
        }
    }
    rotateLeft(){
        if(--this.rotation < 0){
            this.rotation = 3
        }
    }
    typeAtVertex(vertex){
        return this.szAtVertex(vertex).match(/[a-zA-Z]+/)[0]
    }
    szAtVertex(vertex){
        let corrected_vertex = mod(vertex - this.rotation * 3,12)
        for(const [sz,vertices] of Object.entries(this.vertices)){
            if(vertices.has(corrected_vertex)){
                return sz
            }
        }
        throw RangeError("Edge of out range")
    }
    szEdges(sz){
        return new Set(Array.from(this.vertices[sz]).map( vertex => Math.floor(vertex/3)));
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
}

export default Tile;