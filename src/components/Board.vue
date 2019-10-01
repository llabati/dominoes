<template>
<div>
    <div>
        <div class="board">   
            <ul>
                <draggable class="flex-board" v-model="board" group="dominoes">
                    <li v-for="dom in board" :key="dom.id" class="board-item">
                            <half-domino :value="dom.value[0]"></half-domino>
                            <half-domino :value="dom.value[1]"></half-domino>
                    </li>
                </draggable>
            </ul>            
        </div>
    </div>

</div>
    
</template>

<script>
import { store } from '../store.js'
import HalfDomino from './HalfDomino.vue'
import draggable from 'vuedraggable'
export default {
    store,
    computed: {
        board: {
            get(){
                return this.$store.state.board
            },
            set(value){
                this.$store.dispatch('saveBoard', value)
            }
        },
        len() {
            return this.board.length
        },
        
    },
    components: {
        draggable,
        HalfDomino
    }
    
    
}
</script>

<style>
.board {
    width: 100%; 
    min-height: 400px;
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
.board-draggable {
    height: 100%;
    width: 100%;
}
.board-item {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 15px 2px;
    box-shadow: 1px 1px 1px 1px black;
}

.game-item {
    display: inline-block;
    padding: 0;
    margin: 15px 5px;
    box-shadow: 1px 1px 1px 1px black;
    cursor: pointer;
}
.dom-flex {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 85%;
    margin: 10px;
}
.board-enter {
    opacity: 0;
    /*transform: translateY(30px);*/
}
.board-enter-active {
    transition: opacity 2s;
}
.flex-board li:last-child {
    /*border: solid 2px red;*/
    box-shadow: 1px 1px 1px 1px red;
}
.flex-board li:first-child {
    box-shadow: -1px -1px 1px 1px red;
} 

</style>
