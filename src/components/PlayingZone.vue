/* eslint-disable */
<template>
    <div>
        <div class="hand-board">
            <ul v-if="keepPlaying" class="flex-list">
                <!--<draggable style="width: 100%;" v-model="hand" group="dominoes"> -->
                <li v-for="domino in hand" :key="domino.id" class="game-item">
                    <!--<div class="active-domino"> -->
                        <half-domino :value="domino.value[0]" v-on:chosen="chooseDomino(domino, 'left')"></half-domino>
                        <half-domino :value="domino.value[1]" v-on:chosen="chooseDomino(domino, 'right')"></half-domino>
                    <!--</div> -->
                </li> 
                <!--</draggable>-->
            </ul> 
            <p style="color: white; font-size: 24px;" v-if="playerWins || machineWins || neitherWins"><strong>{{ claimVictory() }}</strong></p>
            <p class="explanation" v-else>{{ intro }}</p>
            <div>
                <p style="color: white;" v-if="wrong"><strong>{{ name }}, you cannot put this piece on the mat! Choose another one, or draw...</strong></p>
            </div>
        </div>
      <div v-if="display" class="commands">

            <button v-if="start" class="btn-play" ref="start" @click="initGame">{{ name }}, launch the game</button>
            <transition name="fade" mode="in-out"><button v-if="draw" class="btn-play" style="background-color: brown;" ref="draw" @click="drawAgain(1)">Draw</button></transition>
            <transition name="end"><button v-if="!draw" class="btn-play" style="background-color: yellow; color: black;" ref="pass" @click="pass=!pass">Pass</button></transition>
        </div>   

    </div>
</template>

<script>
/* eslint-disable */
//@contextmenu="chooseDomino(domino, 'right')" 
import { store } from '../store.js'
import HalfDomino from './HalfDomino.vue'
import utils from '../services/utils.js'
import calculations from '../services/calculations.js'
//import draggable from 'vuedraggable'

export default {
    props: {
        name: String,
        display: Boolean
    },
    store,
    components: {
        HalfDomino,
    },
    data(){
        return {
            intro: 'The clicked domino automatically places itself on the game mat. If you can place it either on the left or on the right, clicking on top sends it to the left, clicking on bottom sends it to the right.',
            upto: false,
            tour: 0,
            start: true,
            keepPlaying: true,
            draw: true,
            playerWins: false,
            machineWins: false,
            neitherWins: false,
            empty: false,
            newLock: [],
            stopDrawing: false,
            pass: false,
            double: false,
            wrong: false
        }
    },
    watch: {
        upto(){
            var self = this
            setTimeout(() => { self.machinePlays() }, 1000)
        },
        // dominos restants
        restPieces(){
            if (this.restPieces < 1){
                this.draw = false
                this.stopDrawing = true

                if (this.$store.state.machineChoice < 1) {
                    this.keepPlaying = false
                    this.neitherWins = true
                    this.claimVictory()
                    this.start = true
                    this.draw = true
                }
            }
        },
        // main du joueur
        handLength(){
            if (this.handLength < 1) {
                this.keepPlaying = false
                this.playerWins = true
                this.claimVictory()
                this.start = true
                this.draw = true
            }
        },
        // main de la machine
        machineHandLength(){
            if (this.machineHandLength < 1) {
                this.keepPlaying = false
                this.machineWins = true
                this.claimVictory()
                this.start = true
                this.draw = true
            }
        },
        // quand le joueur est coincé... mémorise les valeurs qu'il n'a pas dans son jeu
        empty(){
            if (this.empty === true){
                let lastRight = this.$store.state.board.length - 1
                this.newLock.push(this.$store.state.board[0].value[0])
                this.newLock.push(this.$store.state.board[lastRight].value[1])
                console.log('COINCE AVEC...', this.newLock)
                this.$store.dispatch('addToLock', this.newLock)
            }
        },
        // quand on arrive à une situation bloquée
        pass(){
            if (this.$store.state.machineChoices < 1) {
                this.keepPlaying = false
                this.neitherWins = true
                this.claimVictory()
                this.start = true
                this.draw = true
            }
            this.upto = !this.upto
        }
    },
    computed: {
        hand(){
            return this.$store.state.hand
        },
        handLength(){
            return this.hand.length
        },
        machineHand(){
            return this.$store.state.machineHand
        },
        machineHandLength(){
            return this.machineHand.length
        },
        restPieces(){
            return this.$store.state.shuffledPieces.length
        }
    },
    

    methods: {

        
        // empêche la mise par le joueur sur le tapis de jeu d'un domino inadéquat
        warningWrongDomino: function(domino, head, tail) {
            if(domino.value[0] !== head && domino.value[0] !== tail && domino.value[1] !== head && domino.value[1] !== tail) {
            console.log('WRONG DOMINO!')
            this.wrong = true
            return this.chooseDomino(domino, 'left')
            }

        },
        
        //distribue 6 dominos à chaque joueur (joueur et machine)
        initGame: function(){
            if (this.$store.state.board.length > 0) {
                this.$store.dispatch('clearAll')
                this.resetAll()
            }
            this.$store.dispatch('shufflePieces')
            let click = 0
            while (click < 6){
            this.$store.dispatch('fullHand')
            click++
            }
            this.start = false
        return this.$store.state.hand       
        },
        // pioche (illimitée, jusqu'à trouver le bon domino, ou à vider la réserve)
        drawAgain(player) {
            // si lapioche est vide
            if (this.$store.state.shuffledPieces.length === 0) {
                this.draw = false
                this.stopDrawing = true
                this.upto = !this.upto
            }
            // si c'est le joueur humain qui pioche (bouton 'DRAW')
            if (player === 1) {
                this.empty = true
                this.$store.dispatch('drawOne', player)
                return this.$store.state.hand
            }
            // si c'est la machine qui pioche
            if (player === 0) {
                if (this.stopDrawing === true) {
                    this.$store.dispatch('noMoreChoice')
                    return
                }
                if (this.stopDrawing === false) {
                    this.$store.dispatch('drawOne', player)
                    return this.$store.state.machineHand   
                }
            }
        },
        // c'est le joueur qui joue
        chooseDomino(domino, side){
            domino.player = true
            if (this.wrong) this.wrong = false
            // démarrage du jeu, premier domino posé par le joueur
            if(this.tour === 0) {
                let head = domino.value[0] 
                let tail = domino.value[1] 
                domino.place = side
                console.log('HEAD AND TAIL FIRST TOUR', head, tail, domino.place)
            }
            // en cours de partie
            if (this.tour > 0) {
                let head = calculations.calculateHead()
                let tail = calculations.calculateTail()
                //let head = this.calculateHead()
                //let tail = this.calculateTail()
                console.log('HEAD AND TAIL PLAYER', domino, head, tail)
                // vérification que le domino choisi est bon
                this.warningWrongDomino(domino, head, tail)
                if (this.wrong === true) return
                else{
                    // lorsqu'on a un domino qui peut être placé à gauche ou à droite
                    //if ((domino.prev === tail && domino.next === head) || (domino.prev === head && domino.next === tail)) {
                    if ((domino.value[0] === tail && domino.value[1] === head) || (domino.value[0] === head && domino.value[1] === tail)) {
                        domino.place = side   
                        if (domino.place === "left") {
                        domino.tail = undefined
                        domino.head = head
                        } else {
                        domino.head = undefined
                        domino.tail = tail
                        }
                    }
                    else {
                        calculations.positionningTheChosenDomino(domino, head, tail)
                    }
                }

                
            }
            console.log('MON DOMINO', domino)
            this.$store.dispatch('addToBoard', domino)
            this.tour = ++this.tour
            this.upto = !this.upto
        },
        getPosition(){
            let begin = event.clientX
            console.log('THE BEGINNING', begin)
        },
        toMachine(domino, begin){
            console.log('DOMINO DRAGGED', domino)
            let head = calculations.calculateHead()
            let tail = calculations.calculateTail()
            //let head = this.calculateHead()
            //let tail = this.calculateTail()
            let end = event.clientX
            console.log('THE END', end)
            domino.place = begin > end ? "left" : "right"
            console.log("DOMINO DRAGGED SIDE", domino.side)
            
            if (domino.place === 'left'){
                domino.tail = undefined
                domino.head = head
            } else {
                domino.head = undefined
                domino.tail = tail
            }
            
            console.log('DRAG DOMINO :', domino)
            console.log('POSITION', event.clientX)
            domino.player = true
            
            this.$store.dispatch('addToBoard', domino)
            this.tour = ++this.tour
            this.upto = !this.upto
            console.log('FIN DU DRAG')
        },
        // c'est la machine qui joue
        machinePlays(){
            if (this.keepPlaying === true) {

                if (this.$store.state.board.length > 0){
                    // détermination des choix possibles pour la machine
                    let choices = []
                    let head = calculations.calculateHead()
                    let tail = calculations.calculateTail()
                    //let head = this.calculateHead()
                    //let tail = this.calculateTail()
                    console.log('HEAD AND TAIL', head, tail)
                    
                    let one = this.$store.state.machineHand.filter(d => d.value[0] === head)
                    if (one) choices.push(one)
                    
                    let two = this.$store.state.machineHand.filter(d => d.value[1] === head)
                    if (two) choices.push(two)
                    
                    let three = this.$store.state.machineHand.filter(d => d.value[0] === tail)
                    if (three) choices.push(three)
                    
                    let four = this.$store.state.machineHand.filter(d => d.value[1] === tail)
                    if (four) choices.push(four)
                    
                    let allChoices = _.flatten(choices)
                    allChoices = new Set(allChoices)
                    let machineChoices = [ ...allChoices ]
                    let choicesNum = machineChoices.length
                    console.log('MACHINECHOICES', machineChoices)
                    this.$store.dispatch('actualizeMachineChoices', choicesNum)
                    
                    // selon les résultats... pas de choix, un seul choix, plusieurs choix possibles
                    // pas de domino à placer : la machine pioche...
                    if (machineChoices.length === 0) {
                        if (this.$store.state.noChoice === true){
                            this.keepPlaying = false

                        } else {
                            let continueDrawing = true
                            while (continueDrawing && this.$store.state.shuffledPieces.length > 0) {
                                this.drawAgain(0)
                                
                                let one = this.$store.state.machineHand[this.$store.state.machineHand.length-1]
                                if (one.value[0] === head || one.value[1] === head || one.value[0] === tail || one.value[1] === tail){
                                one.player = false   
                                machineChoices.push(one)
                                continueDrawing = false
                                
                                console.log('MACHINECHOICES AFTER DRAWING', machineChoices)
                                }
                                else this.drawAgain(0)
                            }
                        }
                    }
                    //la machine a un ou plusieurs dominos possibles : comment choisir le meilleur ? 
                    if (machineChoices.length > 0) return this.makeChoice(machineChoices, head, tail)
                    
                }
            }
        },
                
        makeChoice(machineChoices, head, tail){
            console.log('MACHINE CHOICES INSIDE MAKECHOICE', machineChoices, this.empty)
            // this.empty = quand le joueur ne dispose manifestement pas de certaines valeurs...
            // ne pas jouer sur ces valeurs est un moyen de bloquer le joueur
            if (this.empty === true){
                let lockChoices = calculations.lockPlayer(machineChoices, head, tail)
                console.log('LOCKCHOICES in MAKECHOICE', lockChoices)
                if (lockChoices.length < machineChoices.length) {
                    for (let val of lockChoices){
                        for (let choice of machineChoices){
                            if (choice.value.includes(val)){
                                machineChoices.splice(machineChoices.indexOf(choice), 1)
                            }
                        }
                    console.log('MACHINECHOICES AFTER LOCK FILTERING', machineChoices)  
                        }
                    }
                }
            // calcul du domino le plus élevé en points, dont il faut se débarrasser en premier     
            let final = calculations.calculateBestChoice(machineChoices) 
            
            let piece = this.$store.state.machineHand.find(p => p.value[0] === final[0] && p.value[1] === final[1])
            console.log("PIECE TO PLAY", piece, head, tail)
            piece.player = false
            calculations.positionningTheChosenDomino(piece, head, tail)
            
            this.$store.dispatch('addToBoard', piece)   
        },
        
        // afficher le résultat de la partie
        claimVictory(){
            let results = { neitherWins: this.neitherWins, playerWins: this.playerWins, machineWins: this.machineWins, player: this.hand, machine: this.machineHand }
            let finalTotal = utils.calculateScores(results)
           
            if (this.neitherWins) {
                if (finalTotal > 0) return 'Both players are stuck, but machine wins by ' + finalTotal + " points"
                if (finalTotal < 0) return 'Both players are stuck, but you, '+ this.name + ', wins by ' + Math.abs(finalTotal) + " points"
                if (finalTotal === 0) return 'Both players are stuck'
            }
            if (this.playerWins) return "Hey, "+ this.name + ", you have won by " + finalTotal + " points!"
            if (this.machineWins) return "It's the machine which wins by "+ finalTotal + " points!"
        },
        // remettre le composant ChangeHand à zéro pour une nouvelle partie
        resetAll(){
            this.tour = 0
            this.start = true
            this.keepPlaying = true
            this.draw = true
            this.playerWins = false
            this.machineWins = false
            this.neitherWins = false
            this.empty = false
            this.newLock = []
            this.stopDrawing = false
            this.pass = false
        }
    }
    
}
</script>

<style>
.hand-board {
    background-color: green; 
    border: solid 5px brown;
    width: 100%; 
    margin: 10px auto; 
    background-color: green; 
    padding: 10px;
}
.explanation {
    width: 50%; 
    border : solid 1px white;
    border-radius: 3px;
    margin: 20px auto; 
    padding: 15px;
    color: white;
    font-size: 18px;
}
.btn-play {
    margin: 10px;
    padding: 1%;
    background-color: green;
    color: white;
    font-size: 2rem;
    font-weight: 800;
    border-radius: 5%;
    border: solid 1px red;
    box-shadow: 2px 5px 5px rgba(0, 0, 0, .3);
}

.flex-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    align-content: center;
}
.active-domino {
    padding: 0;
    cursor: pointer;
}
.game-item {
    display: inline-block;
    padding: 0;
    margin: 15px 5px;
    box-shadow: 1px 1px 1px 1px black;
    cursor: pointer;
    animation: enterTheHand 1s;
}
.commands {
    animation: GetVisible 2s ease;
}
.fade-leave-active {
    transition: opacity 2s ease;
}
.fade-leave-to {
    opacity: 0;
}

.end-enter {
    opacity: 0;
    transform: translateX(30px)
}
.end-enter-active {
    transition: all 3s ease;
}
.end-enter-to {
    opacity: 1;
    transform: translateX(0px)
}
@keyframes enterTheHand {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}



</style>
