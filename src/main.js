import { createApp } from 'vue'
import App from './App.vue'
import Game from './js/game/carcasonne';

window.Game = Game;
Game.startGame({
    deck_template:{
        'F,F,F,F,Cl':3,
        "C,F,F,F,F":3,
        "F,C,F,C,C":3,
        "C,C,F,F,F":2,
        "C,C,F,F,C":3,
        "C,R,F,R,R":2,
        "C,C,R,C,C":1
    },
    seed:'r',
    player_list:['robert'],
})
let player = Game.players[0]
window.player = player
createApp(App).mount('#app')
