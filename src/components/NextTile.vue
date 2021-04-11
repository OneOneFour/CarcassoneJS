<template>
    <div class="next_tile_section">
        <span>
            Next tile:  
        </span>
        <img :src=graphic class='next_tile_preview'/> 
        <span>({{game.next}})</span>
    </div>
</template>
<script>
import Game from '@/js/game/carcasonne'
import Graphics2D from '@/assets/2d_basic'
import { ref,computed } from 'vue'
export default {
    setup(){
        const game = ref(Game)
        const graphic = computed(()=> Graphics2D[Game.getTemplate(game.value.next).key])
        return {game,graphic}
    }
}
</script>
<style>
.next_tile_section{
    height:150px;
    width:100%;
    display:flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}
.next_tile_section *{
    margin: 0 10px;
}
.next_tile_preview{
    height:100%;
}
.next_tile_section span{
    font-size:18pt;
}
</style>