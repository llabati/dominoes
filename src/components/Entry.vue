<template>

<div :class="{ intro : show, hidden: !show }">
    <label for="name" class="lead">Please tell us your first name</label>
    <input type="text" name="name" ref="name" v-focus v-model="name">
    <button class="btn-name" @click="close">Envoyer</button>
  </div>
    
</template>

<script>
import { store } from '../store.js'
export default {
    data(){
        return {
            show: true,
            name: ''
        }
    },
    store,
    methods: {
        named(){
            },
        close(){
            console.log(this.name)
            this.$emit('newName', this.name)
            //this.$store.commit('GIVE_PLAYER_A_NAME', this.name)
            console.log('HIDE!!!', this.hide)
            this.show = false,
            console.log('AND NOW...', this.show, this.hide)
        }
    },
    directives: {
        focus(el){
            el.focus()
        }
    }
}
</script>

<style>
.intro {
    width: 30%;
    position: relative;
    top: 300px;
    margin: 20px auto;
    padding: 15px;
    border: solid 3px white;
    box-shadow: 5px 5px 5px 5px black;
    z-index: 10;
    background-color: brown;
    color: white;
}
input {
    display: block;
    border: solid 2px red;
    margin: 10px auto;
}
.btn-name {
    padding: 10px;
    border-radius: 5px;
    box-shadow: 2px 2px 2px 2px black;
    color: brown;
    font-weight: 800;
}
.hidden {
    display: none;
}




</style>
