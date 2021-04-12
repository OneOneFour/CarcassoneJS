<template>
    <div class="next_tile_section">
        <span>
            Next tile:  
        </span>
        <img :src=graphic class='next_tile_preview'/> 
        <span>({{next}})</span>
    </div>
</template>
<script>
import Graphics2D from '@/assets/2d_basic'
import Game, { game_events } from '@/js/game/carcasonne'
export default {
    data:()=>({
        next:Game.next,
        left:Game.left
    }),
    computed:{
        graphic(){
            return Graphics2D[Game.getTemplate(this.next).key]
        }
    },
    mounted(){
        game_events.on('tile_placed',()=>{
            this.next = Game.next
            this.left = Game.left
        })
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