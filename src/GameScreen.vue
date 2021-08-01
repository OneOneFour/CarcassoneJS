<template>
    <game-div-canvas/>
    <next-tile/>

</template>

<script>
import GameDivCanvas from './components/GameDivCanvas.vue';
import NextTile from './components/NextTile.vue';

export default {
  components: { GameDivCanvas, NextTile },
  name: 'GameScreen',

};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #b9c2cc;
  display:flex;
  flex-direction: column;
}
</style>
