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
.board-item:first-child {
    animation: enterTheBoardLeft 1s;
}
.board-item:last-child {
    animation: enterTheBoardRight 1s;
}

.dom-flex {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 85%;
    margin: 10px;
} 
.flex-board li:last-child {
    box-shadow: 1px 1px 1px 1px red;
}
.flex-board li:first-child {
    box-shadow: -1px -1px 1px 1px red;
} 

@keyframes enterTheBoardRight {
    from {
        opacity: 0;
        transform: translateX(10px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}
@keyframes enterTheBoardLeft {
    from {
        opacity: 0;
        transform: translateX(-10px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

</style>
