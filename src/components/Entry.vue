<template>
<div id="intro" class="col-6 offset-3">
    <label for="name" class="lead">Give us your first name or your nickname</label>
    <input type="text" name="name" ref="name" v-model="name">
</div>
    
</template>

<script>
import { store } from '../store.js'
export default {
    data(){
        return {
            name: ''
        }
    },
    store,
    methods: {
        named(){
            console.log(this.name)
            //this.$emit('newPlayer', this.name)
            this.$store.commit('GIVE_PLAYER_A_NAME', this.name)
        }
    }
}
</script>

<style>
#intro {
    padding: 15px;
    background-color: brown;
    color: white;
    margin: 20px auto;
}
input {
    display: block;
    width: 100%;
    border: solid 1px red;
    margin-bottom: 10px;
}




</style>