<template>
  <div class="play">
    <div id="intro" class="col-6 offset-3">
    <label for="name" class="lead">Give us your first name or your nickname</label>
    <input type="text" name="name" v-model="name" @blur="hide">
  </div>

    <h1 style="color: green;">{{ welcome }}</h1>
    <div class="center">
      <board></board>
    </div>
    
    <change-hand :name="name"></change-hand>
  </div>
</template>

<script>
import Board from './Board.vue'
import ChangeHand from './ChangeHand.vue'
export default {
  
  props: {
    msg: String,
    //name: String
  },
  data(){
    return {
      name: 'Dear player'
    }
  },
  computed: {
    welcome(){
      return this.name + this.msg
    }
  },
  methods: {
    hide(){
      let intro = document.querySelector('#intro')
      intro.style.display="none"
    }
  },

  components: {
    Board,
    ChangeHand,
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
