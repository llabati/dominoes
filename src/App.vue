<template>
  <div id="app">
    <!--<entry v-on:newPlayer="installPlayer(name)"></entry>-->
    
    <game msg=", it's up to you!"/>
  </div>
</template>

<script>
//import Entry from './components/Entry.vue'
import Game from './components/Game.vue';

export default {
  
  /*data(){
    return {
      name: '',
      
    }
  },*/
  /*methods: {
    installPlayer(name){
      this.name = name
    }
  },*/
  components: {
    //Entry,
    Game,
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /*color: #0b7ae9;*/
  margin-top: 60px;
}
</style>
