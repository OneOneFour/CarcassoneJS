<template>
    <div>
        <h1>Lobby for game {{gameName}}</h1>
        <button @click="startGame"> Start Game </button>
    </div>

</template>
<script>
export default {
    props:['gameName','onGameStart'],
    methods:{
        startGame(){
            // REPLACE WITH API CALL
            console.log("startGame");
            this.onGameStart();
        }
    }
}
</script>