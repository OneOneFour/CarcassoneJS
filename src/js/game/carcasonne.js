import Board from "./Board";
import Deck from "./Deck";
import Player from "./Player";
import { Scoreboard } from "./Scorers";

const game_ = {}

const Game = {
    get players(){
        return game_.players
    },
    getTile(x,y){
        return game_.board.get(x,y)
    },
    getRawTile(x,y){
        return game_.board.get_raw(x,y)
    },
    getScorer(x,y,sz){
        return game_.scoreboard.getScorer(x,y,sz)
    },
    addScorer(x,y,sz){
        game_.scoreboard.addScorer(x,y,sz)
    },
    tileFromTemplate({template,rotation}){
        return game_.deck.tile(template,rotation || 0 )
    },
    getTemplate(template){
        return game_.deck.getTemplate(template)
    },

    get board(){
        return game_.board
    },
    mergeScorers(parent, child){
        game_.scoreboard.mergeScorers(parent,child)        
    },
    startGame({deck_template,seed,player_list,river_template}){
        game_.deck = new Deck(deck_template,seed,river_template)
        game_.players = player_list.map(x=>new Player(x))
        game_.scoreboard = new Scoreboard()
        game_.board = new Board()

        game_.board.addTile(0,0,game_.deck.get(0),0,true)

        game_.turn = 1
        game_.seed = seed
    },
    playerTurn(){
        return game_.players[(game_.turn % game_.players.length)]
    },
    getPlayerByName(name){
        for(let i =0; i < game_.players.length; i++){
            if(game_.players[i].name == name) return game_.players[i]
        }
    },
    placeTile(x,y,tile_template,rotation){
        this.board.addTile(x,y,tile_template,rotation)
        if(typeof game_.cb !== 'undefined') game_.cb()
    },
    placeMeeple(x,y,sz,meeple){
        const scorer = this.getScorer(x,y,sz)
        if(scorer.canAddMeeple(meeple)){
            scorer.add_meeple(meeple)
            meeple.set_pos(x,y,sz)
        }
    },
    get next(){
        return game_.deck.get(game_.turn)
    },
    get scoreboard(){
        return game_.scoreboard
    },
    setCallback(cb){
        game_.cb = cb
    }
}
Object.freeze(Game);
export default Game;

