import Tile from "./Tile"

class Map{
    constructor(maxdims = 100){
        this.map_ = new Array(maxdims*maxdims)
        this.origin_ = Math.floor(maxdims/2)
        this.size_ = maxdims
    }
    get(x,y){
        var local_x = Math.floor(x + this.origin_)
        var local_y = Math.floor(y + this.origin_)
        var item = this.map_[local_x + this.size_*local_y]
        return item
    }
    neighbours(x,y){
        
    }
}

export default Map;