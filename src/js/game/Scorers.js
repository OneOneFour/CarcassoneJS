class Scorer{
    constructor(){
        this.tiles = new Map();
    }
    add(x,y,sz){
        if( this.tiles.has(`${x},${y}`)){
            this.tiles[`${x},${y}`].add(sz)
        }else{
            this.tiles.set(`${x},${y}`, new Set(sz))
        }
    }
    get num_open_edges(){
        for(let loc of Object.keys(this.tiles)){
            let [x,y] = loc.split(",")
            
        }
    }
}

