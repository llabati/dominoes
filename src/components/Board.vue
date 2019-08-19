<template>
<div>
    <div style="width: 1600px; height: 400px; margin: 10px auto; background-color: green; padding: 10px;">
            <ul>
                <li v-for="dom in board" :key="dom.id" class="game-item">{{ dom.value }}</li>
            </ul>
        </div>
</div>
    
</template>

<script>
import { store } from '../store.js'
export default {
    data(){
        return {}
    },
    store,
    computed: {
        board(){
            return this.$store.state.board
        }
    }
    
    
}
</script>

<style>
.game-item {
    color: white;
    display: inline-block;
    width: 10%;
    padding: 1%;
    border: solid 1px white;
}

</style>
