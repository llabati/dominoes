<template>
<div>
    <div>
        <div class="board">   
            <ul class="flex-board">
                <li v-for="dom in board" :key="dom.id" class="board-item">
                    <half-domino :value="dom.value[0]"></half-domino>
                    <half-domino :value="dom.value[1]"></half-domino>
                </li>
            </ul>              
        </div>
    </div>

</div>
    
</template>

<script>
import { store } from '../store.js'
import HalfDomino from './HalfDomino.vue'
export default {
    store,
    computed: {
        board(){
            return this.$store.state.board
        },
        len() {
            return this.board.length
        },
        list(){
            return document.querySelector('#board')
        },
        limDisplayLeft(){
            return this.board[0]
        },
        limDisplayRight(){
            return this.board[this.boardc.length - 1]
        }
    },
    components: {
        HalfDomino
    }
    
    
}
</script>

<style>
.board {
    width: 100%; 
    margin: 10px auto; 
    background-color: green; 
    padding: 10px;
}
.flex-board {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    align-content: center;
}
.board-item {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 5px;
}

.game-item {
    display: inline-block;
    width: 10%;
    padding: 1%;
    /*background-color: beige;*/
    /*border: solid 1px black;
    border-radius: 3px;*/
}
.dom-flex {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 85%;
    margin: 10px;
}

</style>
