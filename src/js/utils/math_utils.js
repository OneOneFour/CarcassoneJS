function mod(n,m){
    // Calculates n modulo m (in JS n % m is not the true modulo)
    return ((n%m) + m ) % m ;
}
function median(arr){
    if(arr.length % 2 == 1) return arr[Math.floor(arr.length/2)]
    return (arr[arr.length/2]+arr[arr.length/2 - 1])/2
}
function flooredmedian(arr){
    return arr[Math.floor(arr.length/2)]
}
function mean(arr){
    return arr.reduce((acc,cur)=>acc+cur)/arr.length
}
export {mod,median,mean,flooredmedian};
