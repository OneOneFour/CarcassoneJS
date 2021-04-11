<template>
    <div class="board">
            <div v-for="(raw_tile,i) in inViewTiles()" class="tile" :style="tileStyle(raw_tile)" :key=i v-show="typeof raw_tile.template !== 'undefined'"></div>
    </div>
</template>
<script>
import Game from '@/js/game/carcasonne'
import CCFFC from '@/assets/2d_basic/CCFFC.png'
import CCFFF from '@/assets/2d_basic/CCFFF.png'
import CCRCC from '@/assets/2d_basic/CCRCC.png'
import CFFFF from '@/assets/2d_basic/CFFFF.png'
import CRFRR from '@/assets/2d_basic/CRFRR.png'
import FCFCC from '@/assets/2d_basic/FCFCC.png'
import FFFFCl from '@/assets/2d_basic/FFFFCl.png'
import FFRRF from '@/assets/2d_basic/FFRRF.png'

const lookup = {
    'C,C,F,F,C':CCFFC,
    'C,C,F,F,F':CCFFF,
    'C,C,R,C,C':CCRCC,
    'C,F,F,F,F':CFFFF,
    'C,R,F,R,R':CRFRR,
    'F,C,F,C,C':FCFCC,
    'F,F,F,F,Cl':FFFFCl,
    'F,F,R,R,F':FFRRF
}

export default {
    data:()=>({
        cx:0,
        cy:0,
        div_size:128,
        windowSize:{width:0,height:0},
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
            let backgroundImage = `url(${lookup[Game.getTemplate(template).key]})`
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
        this.windowSize = {
                width:window.innerWidth,
                height:window.innerHeight
            }

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
        Game.setCallback(()=>{
            this.$forceUpdate();
        })
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