<template>
    <div class="board">
            <div v-for="(raw_tile,i) in inViewTiles()" class="tile" :style="tileStyle(raw_tile)" :key=i v-show="typeof raw_tile.template !== 'undefined'"></div>
    </div>
</template>
<script>
import Game, { game_events } from '@/js/game/carcasonne'
import Graphics2D from '@/assets/2d_basic'

export default {
    data:()=>({
        cx:0,
        cy:0,
        div_size:128,
        windowSize:{
                width:window.innerWidth,
                height:window.innerHeight
        },
        board:Game.board
    }),
    computed:{
        numCols(){
            return Math.ceil(this.windowSize.width / this.div_size)
        },
        numRows(){
            return Math.ceil(this.windowSize.height / this.div_size)
        },
        numCells(){
            return this.numCols * this.numRows
        },

    },
    methods:{
        inViewTiles(){
            let subsection = [];
            for(let x= this.cx - this.numCols/2,lx = 0; x < this.cx + this.numCols/2;x++,lx++){
                for(let y= this.cy - this.numRows/2,ly=0; y < this.cy + this.numRows/2;y++,ly++){
                    subsection.push({...this.board.get_raw(x,y),lx,ly}) 
                }
            }
            return subsection
        },
        tileStyle(rawTile){
            if(typeof rawTile.template === 'undefined') return {}
            const {template,rotation,lx,ly} = rawTile
            let backgroundImage = `url(${Graphics2D[Game.getTemplate(template).key]})`
            return {
                backgroundImage,
                transform:`rotate(${rotation * 90}deg)`,
                left:`${lx*this.div_size}px`,
                top: `${ly*this.div_size}px`,
                width:`${this.div_size}px`,
                height:`${this.div_size}px`
            }
        }
    },
    mounted(){
        window.addEventListener('resize',() => {
            this.windowSize = {
                width:window.innerWidth,
                height:window.innerHeight
            }
        })
        window.addEventListener('keydown',(event)=>{
            switch(event.key){
                case 'ArrowLeft':
                    this.cx -= 1
                    break;
                case 'ArrowRight':
                    this.cx += 1
                    break;
                case 'ArrowDown':
                    this.cy += 1
                    break;
                case 'ArrowUp':
                    this.cy -= 1
                    break;
                default:
                    break;
            }
        })
        game_events.on('tile_placed' , ()=>{this.$forceUpdate()});
    }
}
</script>
<style scoped>
.board{
    display:block;
    position:absolute;
    width:100vw;
    left:0;
    top:0;
    height:100vh;
    overflow: hidden;
    background:linear-gradient(#00467F,#A5CC82);
    z-index:-1;
}
.tile{
    position: absolute;
    background-size: cover;
    image-rendering: pixelated;
}
</style>