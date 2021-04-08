import { createApp } from 'vue'
import App from './App.vue'
import Game from './js/game/carcasonne';

window.Game = Game;
Game.startGame({
    deck_template:{
        'F,F,F,F,Cl':2,
        "C,F,F,F,F":2,
        "F,C,C,F,C":2
    },
    seed:'apricot',
    player_list:['robert'],
})
createApp(App).mount('#app')
