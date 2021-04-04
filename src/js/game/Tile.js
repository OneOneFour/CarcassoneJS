class Tile{
    constructor({edges,farm_to_cities,bonus,cloister}){
        this.edges = edges
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
    typeAtEdge(edge){
        return this.szAtEdge(edge).match(/[a-zA-Z]+/)[0]
    }
    szAtEdge(edge){
        for(const [sz,edges] of this.edges.entries()){
            if(edges.has(edge)){
                return sz
            }
        }
        throw RangeError("Edge of out range")
    }
    get edges(){
        return [this.typeAtEdge(1),this.typeAtEdge(4),this.typeAtEdge(7),this.scorezoneFromEdge(10)]
    }
}

export default Tile;