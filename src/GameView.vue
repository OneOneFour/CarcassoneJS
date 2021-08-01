<template>
    <div>
        <h2>Game "{{gameName}}"</h2>
        <component :is="currentGameMode" :gameName="gameName" :onGameStart="startGame">
        </component>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import Lobby from '@/components/Lobby.vue';
import GameScreen from '@/GameScreen.vue';

export default {
  computed: {
    gameName() {
      return this.$route.params.id;
    },
    currentGameMode() {
      return (this.started) ? GameScreen : Lobby;
    },
    ...mapState({ started: 'gameStarted' }),
  },
  methods: {
    startGame() {
      // Start Game on backend
      this.$store.dispatch('startGame');
    },
  },
  beforeCreate() {
    // Fetch to backend and get game status
  },

};
</script>
