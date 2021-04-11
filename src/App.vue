<template>
  <div id="app">
    <h2>Carcassone!</h2>
    <game-div-canvas/>
  </div>
</template>

<script>
import GameDivCanvas from './components/GameDivCanvas.vue'

export default {
  components: { GameDivCanvas },
  name: 'App',

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #b9c2cc;
  margin-top: 60px;
}
</style>
