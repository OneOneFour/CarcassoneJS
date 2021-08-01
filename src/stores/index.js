import {createStore} from 'vuex';
import firebase from 'firebase';

const store =  createStore({
    state(){
        return {
            gameStarted:false,
            players:null,
            turn:0,
            gameComplete: false,
            gameName:'',
            username:'',
            prefColor:'',
            moves:[]
        }
    },
    mutations:{
        setCurrentGame(state,name){
            state.gameName = name;
        },
        startGame(state){
            state.gameStarted = true;
        },
        endGame(state){
            if(! state.gameStarted) throw Error("Cannot end game before it has started")
            state.gameComplete = true
        },
        setUsername(state,username){
            state.username = username;
        },
        setPrefColor(state,prefColor){
            state.prefColor = prefColor;
        },
        setMoves(state,moves){
            state.moves = moves;
        },
        incrementTurn(state){
            state.turn++;
        }
    },
    actions:{
        startGame({commit}){
            // Await Firebase call
            commit('startGame');
        },
        async createGame(gameName){
            await firebase.database().ref(`games/${gameName}`).set({
                started:false
            })
        },
        // joinGame({commit},gameName){

        // },
        listenForGameMoves({commit,state}){
            const ref = firebase.database().ref(`game-moves/${state.gameName}`);
            ref.on('value',(snap)=>{
                commit('setMoves',snap.val())
            });
        }
        // makeMove({commit,state},move){
        //     firebase.database().ref(`game-moves/${state.gameName}`)
        // }
    }
});
export default store;