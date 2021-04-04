import Base from './base_tiles.json'
import River from './river_tiles.json'
import {isSuperset,union,remainder} from '@/js/utils/set_utils';
const TileSet = {};
Object.assign(TileSet,[Base,River])


// Verify objects
function cleanverify_tile_templates(key){
    let template = Object.assign({},TileSet[key])
    let assigned_edges = new Set();
    let fill_remaining = -1;
    const zones = [...template.cities||[],...template.roads||[],...template.farms||[]] 
    for(let [i,zone] of zones.entries()){
        if(Array.isArray(zone.edges)){
            const edges = new Set(zone.edges)
            if(isSuperset(assigned_edges,edges)){
                throw SyntaxError(`${key} ERROR: Contains duplicate edges `)
            }
            zone.edges.forEach( item => assigned_edges.add(item))
            zone.edges = edges
            zone.bonus = zone.bonus || false
        }else{
            // directive
            if(zone.edges === 'remain'){ // fill with remaining with complete
                if(fill_remaining >= 0) throw SyntaxError(`${key} ERROR: Can only use 'remain' directive once per definition`)
                fill_remaining = i
            }else{
                throw SyntaxError(`${key} ERROR: Unknown directive "${zone.edges}"`)
            }
        }
    }
    if(template.river){
        const edges = new Set(template.river)
        if(isSuperset(assigned_edges,edges))
        template.river.forEach(item => assigned_edges.add(item))
        template.river = edges
    }
    if(fill_remaining >= 0){
        zones[fill_remaining].edges = remainder(assigned_edges)
        assigned_edges = union(assigned_edges,zones[fill_remaining].edges)
    }
    if(assigned_edges.size != 12) throw SyntaxError(`${key} ERROR: Not all tile edges defined! Missing ${ [...remainder(assigned_edges)]}`)
    template.cloister = template.cloister || false
    return template
}


export default TileSet;
export {cleanverify_tile_templates}