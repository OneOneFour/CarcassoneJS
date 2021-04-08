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
    getScorer(x,y,sz){
        return game_.scoreboard.getScorer(x,y,sz)
    },
    addScorer(x,y,sz){
        game_.scoreboard.addScorer(x,y,sz)
    },
    get board(){
        return game_.board
    },
    mergeScorer(parent, child){
        game_.scoreboard.mergeScorer(parent,child)        
    },
    startGame({deck_template,seed,player_list,river_template}){
        game_.deck = new Deck(deck_template,seed,river_template)
        game_.players = player_list.map(x=>new Player(x))
        game_.scoreboard = new Scoreboard()
        game_.board = new Board()

        game_.board.addTile(0,0,game_.deck.next())

        game_.turn = 0 
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
    placeTile(x,y,tile){
      if(this.board.isValid(x,y,tile)){
          this.board.addTile(x,y,tile)
      } else{
          throw Error("Invalid tile!")
      }
    },
    placeMeeple(x,y,sz,meeple){
        const scorer = this.getScorer(x,y,sz)
        if(scorer.canAddMeeple(meeple)){
            scorer.add_meeple(meeple)
            meeple.set_pos(x,y,sz)
        }
    },
    get deck(){
        return game_.deck
    },
    get scoreboard(){
        return game_.scoreboard
    }
}
Object.freeze(Game);
export default Game;

