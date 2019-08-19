<template>
    <div>
        <div class="center" style="height: 400px; background-color: green; border: solid 5px brown;">
            <ul>
                <li v-for="domino in hand" :key="domino.id" style="color: white; cursor: pointer;" @click="chooseDomino(domino)">{{ domino.value }}</li>
            </ul>
            <p class="lead white--text text-center" v-if="playerWins">{{ name }}, you have won!</p>
            <p class="lead white--text text-center" v-if="machineWins">The machine has won !</p>
        </div>
        <div>

            <button v-if="start" class="btn-play" ref="start" @click="initGame">{{ name }}, launch the game</button>
            <button v-if="draw" class="btn-play" style="background-color: red;" ref="draw" @click="drawAgain(1)">Draw</button>
            
        </div>
    </div>
</template>

<script>
import { store } from '../store.js'
import { randomize } from '../services/utils.js'
export default {
    props: {
        name: String
    },
    store,
    data(){
        return {
            upto: false,
            tour: 0,
            start: true,
            zeroDomino: 6,
            continue: true,
            draw: true,
            playerWins: false,
            machineWins: false
        }
    },
    watch: {
        upto(){
                console.log('upToTheMachine')
                return this.machinePlays()
        },
        zeroDomino(){
        if (this.tour > 0 && this.$store.state.hand.length === 0) {
            this.playerWins = true
            console.log(this.name, 'YOU HAVE WON!')
            this.continue = false
        }
        if (this.tour > 0 && this.$store.state.machineHand.length === 0) {
            this.machineWins = true
            console.log('MACHINE HAVE WON!')
            }
        }
    },
    computed: {
        hand(){
            return this.$store.state.hand
        }
    },

    methods: {
        
        initGame: function(){
            this.$store.commit('SHUFFLE_PIECES')
            console.log(this.$store.state.shuffledPieces)
            let click = 0
            while (click < 6){
            this.$store.commit('FULL_HAND')
            click++
            }
            this.start = false
        return this.$store.state.hand
        
        },

        drawAgain(player) {
            if (this.$store.state.shuffledPieces.length === 0) {
                this.draw = false
            }
            this.$store.commit('DRAW_ONE', player)
            if (player === 1) return this.$store.state.hand
            if (player === 0) return this.$store.state.machineHand
        },
        chooseDomino(domino){
            domino.player = true
            if(this.tour === 0) {
                let head = domino.value[0]
                let tail = domino.value[1]
                domino.place = "left"
                console.log('HEAD AND TAIL FIRST TOUR', head, tail)
            }
            if (this.tour > 0) {
                let head = this.$store.state.board[0].value[0]
                let tail = this.$store.state.board[this.$store.state.board.length-1].value[1]
                console.log('HEAD AND TAIL PLAYER', head, tail)
                domino.place = (domino.next === head || domino.prev === head) ? "left" : "right"
                if (domino.place === "left") {
                    domino.tail = undefined
                    domino.head = head
                } else {
                    domino.head = undefined
                    domino.tail = tail
                }
            }
            console.log('MON DOMINO', domino)
            this.$store.commit('ADD_TO_BOARD', domino)
            this.tour = ++this.tour
            console.log('TOUR', this.tour)
            if (this.$store.state.hand.length === 0) {
                this.continue = false
                this.playerWins = true
                console.log('YOU HAVE WIN!')
            } else this.upto = !this.upto
        },
        machinePlays(){
            if (this.continue === true) {

                if (this.$store.state.board.length > 0){
                    let choices = []
                    let head = this.$store.state.board[0].value[0]
                    let tail = this.$store.state.board[this.$store.state.board.length-1].value[1]
                    console.log('HEAD AND TAIL', head, tail)
                    let one = this.$store.state.machineHand.filter(d => d.prev === head)
                    if (one) choices.push(one)
                    let two = this.$store.state.machineHand.filter(d => d.next === head)
                    if (two) choices.push(two)
                    let three = this.$store.state.machineHand.filter(d => d.prev === tail)
                    if (three) choices.push(three)
                    let four = this.$store.state.machineHand.filter(d => d.next === tail)
                    if (four) choices.push(four)
                    let allChoices = _.flatten(choices)
                    allChoices = new Set(allChoices)
                    console.log(allChoices)
                    let machineChoices = [ ...allChoices ]
                    console.log('MACHINECHOICES', machineChoices)
                    if (machineChoices.length === 0) {
                        while (machineChoices.length === 0) {
                            this.drawAgain(0)
                            /*let choices = []
                            let head = this.$store.state.board[0].value[0]
                            let tail = this.$store.state.board[this.$store.state.board.length-1].value[1] */
                            console.log('HEAD AND TAIL WHILE DRAWING', head, tail)
                            //let one = this.$store.state.machineHand.filter(d => d.prev === head || d.next === head || d.prev === tail || d.next === tail)
                            let one = this.$store.state.machineHand[this.$store.state.machineHand.length-1]
                            if (one.prev === head || one.next === head || one.prev === tail || one.next === tail){
                            one.player = false   
                            machineChoices.push(one)
                            
                            console.log('MACHINECHOICES AFTER DRAWING', machineChoices)
                            }
                            else this.drawAgain(0)
                        }
                    }
                    /*
                    if (machineChoices.length === 1) {
                        machineChoices[0].player = false
                        machineChoices[0].place = (machineChoices[0].next === head || machineChoices[0].prev === head) ? "left" : "right"
                        if (machineChoices[0].place === "left") {
                            machineChoices[0].tail = undefined
                            machineChoices[0].head = head
                        } else {
                            machineChoices[0].head = undefined
                            machineChoices[0].tail = tail
                            }
                        this.$store.commit('ADD_TO_BOARD', machineChoices[0])
                    } */
                    if (machineChoices.length > 0) return this.makeChoice(machineChoices, head, tail)
                    
                }
            }
        },
                
        makeChoice(machineChoices, head, tail){
            console.log('MACHINE CHOICES INSIDE MAKECHOICE', machineChoices)
            let computedChoices = []
            if (machineChoices.length === 1) {
                computedChoices.push(machineChoices[0].value[0], machineChoices[0].value[1], machineChoices[0].value[0] + machineChoices[0].value[1])
                console.log('ONE CHOICE WITHOUT OTHERS')
            }
            if (machineChoices.length > 1){
                for (var i = 0; i < machineChoices.length; i++) {
                    computedChoices.push([machineChoices[i].value[0], machineChoices[i].value[1], machineChoices[i].value[0] + machineChoices[i].value[1]])
                }
                console.log('COMPUTEDCHOICES', computedChoices)
            }
            let finalChoices = computedChoices.length === 0 ? computedChoices[0] : computedChoices.sort((a,b) => b[2] - a[2])
            
            console.log('FINAL CHOICES', finalChoices)
            let final = finalChoices[0]
            //final.length = 2
            console.log('FINAL CHOICE', final)
            // la fonction chooseDomino doit être adaptée pour la machine (player = false doit être passé en argument, et pour le passage vers le joueur)
                
            
            let piece = this.$store.state.machineHand.find(p => p.value[0] === final[0] && p.value[1] === final[1])
            console.log("LA PIECE A JOUER", piece, head, tail)
            piece.player = false
            piece.place = (piece.next === head || piece.prev === head) ? "left" : "right"
            if (piece.place === "left") {
                piece.tail = undefined
                piece.head = head
            } else {
                piece.head = undefined
                piece.tail = tail
            }
            this.$store.commit('ADD_TO_BOARD', piece)
        }
    }
    
}
</script>

<style scoped>
.btn-play {
    margin: 10px auto;
    padding: 1%;
    background-color: green;
    color: white;
    font-size: 2rem;
    font-weight: 800;
    border-radius: 5%;
}

</style>
