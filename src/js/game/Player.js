class Meeple{
    constructor(player,value){
        this.player = player
        this.value = value
    }
    set_pos(x,y,sz){
        this.x = x 
        this.y = y 
        this.sz =sz
        this.players.splice(this.player.meeples.indexOf(this),1)
    }
    reset(){
        delete this.x
        delete this.y 
        delete this.sz 
        this.player.meeples.push(this)
    }
}

class Player{
    constructor(name){
        this.name = name;
        this.color = 'red';// Automate this 
        this.meeples = [new Meeple(this,2)]
        for(let i = 1; i < 6; i++){
            this.meeples.push(new Meeple(this,1))
        }
    }
    toString(){
        return this.name
    }
}
export default Player;