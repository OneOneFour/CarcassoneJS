function mod(n,m){
    // Calculates n modulo m (in JS n % m is not the true modulo)
    return ((n%m) + m ) % m ;
}
export {mod};
