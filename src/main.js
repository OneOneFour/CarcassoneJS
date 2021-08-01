import { createApp } from 'vue'
import firebase from 'firebase';
import "firebase/database";
import "firebase/analytics";

import store from './stores';
import App from './App.vue'
import Game from './js/game/carcasonne';
import vuetify from '@/plugins/vuetify';


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
createApp(App).use(store).use(vuetify).mount('#app')

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA4cx2QCE5qw1DjJn4e4dDgUjp0WPEJZpU",
    authDomain: "carcassonne-js.firebaseapp.com",
    databaseURL: "https://carcassonne-js-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "carcassonne-js",
    storageBucket: "carcassonne-js.appspot.com",
    messagingSenderId: "365235067272",
    appId: "1:365235067272:web:8ac6d25c630b8a96fe023d",
    measurementId: "G-3FVLBTKM53"
  };

firebase.initializeApp(firebaseConfig);
firebase.analytics();