<template>
  <div class="play" ref="play" style="width: 100%;">
    <entry v-on:newName="nameThisPlayer"></entry>

    <div class="center">
      <board></board>
    </div>
    <div class="center">
      <playing-zone :name="name" :display="display"></playing-zone>
    </div>
  </div>
</template>

<script>
import Entry from './Entry.vue'
import Board from './Board.vue'
import PlayingZone from './PlayingZone.vue'
import vuedraggable from 'vuedraggable'
export default {
  data(){
    return {
      name: 'Dear player',
      display: false
    }
  },
  methods: {
    nameThisPlayer(name){
      this.name = name
      this.display = true
    }
  },

  components: {
    Entry,
    Board,
    PlayingZone,
    vuedraggable
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
.center {
  width: 90%;
  margin: 10px auto;
}
</style>
