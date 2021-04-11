import { createApp } from 'vue'
import App from './App.vue'
import Game from './js/game/carcasonne';

window.Game = Game;
Game.startGame({
    deck_template:{
        'F,F,F,F,Cl':3,
        "C,F,F,F,F":3,
        "F,C,F,C,C":3,
    },
    seed:'robert',
    player_list:['robert'],
})
createApp(App).mount('#app')
