import Base from './base_tiles.json'
import River from './river_tiles.json'
import {isSuperset,union,remainder} from '@/js/utils/set_utils';


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


export {cleanverify_tile_templates,Base,River}