<template>
<div>
    <div>
        <div style="width: 100%; margin: 10px auto; background-color: green; padding: 10px;">
            
            <ul id="board" class="flex-board">
                <li v-for="dom in boardc" :key="dom.id" class="game-item">
                    <div class="dominoe">
                        <div class="dom-flex">
                        <div class="semidom">
                            <div class="three-dots">
                                <div class="dot" v-if="dom.value[0] === 4 || dom.value[0] === 5 || dom.value[0] === 6"></div>
                                <div class="dot" v-if="dom.value[0] === 6"></div>
                                <div class="dot" v-if="dom.value[0] === 2 || dom.value[0] === 3 || dom.value[0] === 4 || dom.value[0] === 5 || dom.value[0] === 6"></div>
                            </div>
                            <div class="three-dots">
                                <div class="dot" v-if="dom.value[0] === 7"></div>
                                <div class="dot" v-if="dom.value[0] === 1 || dom.value[0] === 3 || dom.value[0] === 5"></div>
                                <div class="dot" v-if="dom.value[0] === 7"></div>
                            </div>
                            <div class="three-dots">
                                <div class="dot" v-if="dom.value[0] === 2 || dom.value[0] === 3 || dom.value[0] === 4 || dom.value[0] === 5 || dom.value[0] === 6"></div>
                                <div class="dot" v-if="dom.value[0] === 6"></div>
                                <div class="dot" v-if="dom.value[0] === 4 || dom.value[0] === 5 || dom.value[0] === 6"></div>
                            </div>

                        </div>
                        <div class="sep-vertical"></div>
                        <div class="semidom">
                            <div class="three-dots">
                                <div class="dot" v-if="dom.value[1] === 4 || dom.value[1] === 5 || dom.value[1] === 6"></div>
                                <div class="dot" v-if="dom.value[1] === 6"></div>
                                <div class="dot" v-if="dom.value[1] === 2 || dom.value[1] === 3 || dom.value[1] === 4 || dom.value[1] === 5 || dom.value[1] === 6"></div>
                            </div>
                            <div class="three-dots">
                                <div class="dot" v-if="dom.value[1] === 7"></div>
                                <div class="dot" v-if="dom.value[1] === 1 || dom.value[1] === 3 || dom.value[1] === 5"></div>
                                <div class="dot" v-if="dom.value[1] === 7"></div>
                            </div>
                            <div class="three-dots">
                                <div class="dot" v-if="dom.value[1] === 2 || dom.value[1] === 3 || dom.value[1] === 4 || dom.value[1] === 5 || dom.value[1] === 6"></div>
                                <div class="dot" v-if="dom.value[1] === 6"></div>
                                <div class="dot" v-if="dom.value[1] === 4 || dom.value[1] === 5 || dom.value[1] === 6"></div>
                            </div>

                        </div>
                        </div>
                    </div>
                </li>
            </ul>
            
                       
        </div>
    </div>

</div>
    
</template>

<script>
import { store } from '../store.js'
export default {
    
    store,
    computed: {
        boardc(){
            return this.$store.state.board
        },
        len() {
            return this.boardc.length
        },
        list(){
            return document.querySelector('#board')
        },
        limDisplayLeft(){
            return this.boardc[0]
        },
        limDisplayRight(){
            return this.boardc[this.boardc.length - 1]
        }
    },
    
    
}
</script>

<style>
.flex-board {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    align-content: center;
}

.game-item {
    color: white;
    display: inline-block;
    width: 10%;
    padding: 1%;
    background-color: beige;
    border: solid 1px black;
    border-radius: 3px;
}
.dom-flex {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 85%;
    margin: 10px;
}
.sep-vertical {
    border: solid 1px beige;
    height: 100%;
    width: 20px;
    margin: 5px auto;
}
.semidom {
    display: inline-block;
    width: 50%;
    /*margin: 5%;*/
    /*padding: 2%;*/
}
.three-dots {
    display: inline-block;
    width: 33%;
    margin: none;
    /*padding: 1px;*/
}
.dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: black;
    margin: 10px 5px;
}
.vertical {
    transform: rotate(90deg);
}
#board-left, #board-right {
    display: flex;
    flex-direction: column;
    align-items: start;
    width: 50%;
    height: 500px;
}
/*#board-left {
    margin-right: 10%;
}
/*#board-right {
    /*float: right;
}*/

</style>
