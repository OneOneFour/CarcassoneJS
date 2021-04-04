function isSuperset(set,subset){
    for(let elem of subset){
        if(!set.has(elem)){
            return false;
        }
    }
    return true;
}
function intersection(A,B){
    let int_ =new Set()
    for(let elem of B){
        if(A.has(elem)){
            int_.add(elem)
        }
    }
    return int_

}
function difference(A,B){ 
    // Calculates difference between set A and B 
    let diff_ = new Set(A);
    for(let elem of B){
        if(A.has(elem)){
            diff_.delete(elem)
        }
    }
    return diff_

}
function union(A,B){
    let union_ = new Set(A);
    for(let elem of B){
        union_.add(elem)
    }
    return union_
}
const full_set = new Set([0,1,2,3,4,5,6,7,8,9,10,11])
function remainder(assigned){
    return difference(full_set,assigned)
}

export {isSuperset,intersection,difference,union,remainder};