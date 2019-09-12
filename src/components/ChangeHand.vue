/* eslint-disable */
<template>
    <div>
        <div class="hand-board">
            <ul v-if="playerCanPlay" class="flex-list">
                <li v-for="domino in hand" :key="domino.id" class="game-item" @contextmenu="chooseDomino(domino, 'right')" @click="chooseDomino(domino, 'left')">
                    <div class="active-domino"> 
                        <half-domino :value="domino.value[0]"></half-domino>
                        <half-domino :value="domino.value[1]"></half-domino>
                    </div>
                </li> 
            </ul> 
            <p style="color: white; font-size: 24px;" v-if="playerWins || machineWins || neitherWins"><strong>{{ claimVictory() }}</strong></p>
            <p class="explanation" v-else>{{ intro }}</p>
            <div>
                <p style="color: white;" v-if="wrong"><strong>{{ name }}, you cannot put this piece on the mat! Choose another one, or draw...</strong></p>
            </div>
        </div>
        <div>

            <button v-if="start" class="btn-play" ref="start" @click="initGame">{{ name }}, launch the game</button>
            <button v-if="draw" class="btn-play" style="background-color: red;" ref="draw" @click="drawAgain(1)">Draw</button>
            <button v-if="!draw" class="btn-play" style="background-color: yellow; color: black;" ref="pass" @click="pass=!pass">Pass</button>
        </div>   

    </div>
</template>

<script>
/* eslint-disable */
import { store } from '../store.js'
import HalfDomino from './HalfDomino.vue'

export default {
    props: {
        name: String
    },
    store,
    components: {
        HalfDomino
    },
    data(){
        return {
            intro: 'The clicked domino automatically places itself on the game mat. If you can place it either on the left or on the right, the left click sends it on the left, and the right click sends it on the right.',
            upto: false,
            tour: 0,
            start: true,
            continue: true,
            draw: true,
            playerWins: false,
            machineWins: false,
            neitherWins: false,
            empty: false,
            newLock: [],
            stopDrawing: false,
            pass: false,
            double: false,
            playerCanPlay: true,
            wrong: false
        }
    },
    watch: {
        upto(){
            return this.machinePlays()
        },
        // dominos restants
        restPieces(){
            if (this.restPieces === 0){
                this.draw = false
                this.stopDrawing = true

                if (this.$store.state.machineChoice === 0) {
                    this.continue = false
                    this.playerCanPlay = false
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
                this.continue = false
                this.playerWins = true
                this.claimVictory()
                this.start = true
                this.draw = true
            }
        },
        // main de la machine
        machineHandLength(){
            if (this.machineHandLength < 1) {
                this.continue = false
                this.playerCanPlay = false
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
                this.$store.commit('ADD_TO_LOCK', this.newLock)
            }
        },
        // quand on arrive à une situation bloquée
        pass(){
            if (this.$store.state.machineChoices === 0) {
                this.continue = false
                this.playerCanPlay = false
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

        // désigne la valeur gauche du domino placé à l'extrémité gauche du tapis de jeu
        calculateHead: function(){
            let head = this.$store.state.board[0].value[0]
            return head
        },
        // désigne la valeur droite du domino placé à l'extrémité droite du tapis
        calculateTail: function(){
            let tail = this.$store.state.board[this.$store.state.board.length-1].value[1]  
            return tail
        },
        // empêche la mise par le joueur sur le tapis de jeu d'un domino inadéquat
        warningWrongDomino: function(domino, head, tail) {
            if(domino.prev !== head && domino.prev !== tail && domino.next !== head && domino.next !== tail) {
            console.log('WRONG DOMINO!')
            this.wrong = true
            return this.chooseDomino(domino, side = 'left')
            }

        },
        // détermine le meilleur domino à jouer (nombre de points le plus élevé), parmi les choix possibles
        // favorise le choix des doubles
        calculateBestChoice: function(machineChoices){
                let computedChoices = machineChoices.map(e => [ e.value[0], e.value[1], e.value[0] + e.value[1] ])
                    console.log('COMPUTEDCHOICES', computedChoices)
                
                let finalChoices = (computedChoices.find( e => e[0] === e[1])) ? computedChoices.filter(a => a[0] === a[1]).sort((a,b) => b[2] - a[2]) : computedChoices.sort((a,b) => b[2] - a[2])
                console.log('FINAL CHOICES', finalChoices)

                let final = finalChoices[0]
                console.log('FINAL CHOICE', final)
                this.double = false
                return final
        },
        // prépare le bon placement du domino choisi en définissant la "tête" (à gauche) ou la "queue" (à droite)
        positionningTheChosenDomino: function(piece, head, tail){
            piece.place = (piece.next === head || piece.prev === head) ? "left" : "right"
            if (piece.place === "left") {
                piece.tail = undefined
                piece.head = head
            } else {
                piece.head = undefined
                piece.tail = tail
            }
        },
        //distribue 6 dominos à chaque joueur (joueur et machine)
        initGame: function(){
            this.$store.commit('SHUFFLE_PIECES')
            let click = 0
            while (click < 6){
            this.$store.commit('FULL_HAND')
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
                this.$store.commit('DRAW_ONE', player)
                return this.$store.state.hand
            }
            // si c'est la machine qui pioche
            if (player === 0) {
                if (this.stopDrawing === true) {
                    this.$store.commit('NO_MORE_CHOICE')
                    return
                }
                if (this.stopDrawing === false) {
                    this.$store.commit('DRAW_ONE', player)
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
                let head = domino.prev 
                let tail = domino.next 
                console.log('HEAD AND TAIL FIRST TOUR', head, tail, domino.place)
            }
            // en cours de partie
            if (this.tour > 0) {
                let head = this.calculateHead()
                let tail = this.calculateTail()
                console.log('HEAD AND TAIL PLAYER', domino, head, tail)
                // vérification que le domino choisi est bon
                this.warningWrongDomino(domino, head, tail)
                if (this.wrong === true) return
                else{
                    // lorsqu'on a un domino qui peut être placé à gauche ou à droite
                    if ((domino.prev === tail && domino.next === head) || (domino.prev === head && domino.next === tail)) {
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
                        this.positionningTheChosenDomino(domino, head, tail)
                    }
                }

                
            }
            console.log('MON DOMINO', domino)
            this.$store.commit('ADD_TO_BOARD', domino)
            this.tour = ++this.tour
            this.upto = !this.upto
        },
        // c'est la machine qui joue
        machinePlays(){
            if (this.continue === true) {

                if (this.$store.state.board.length > 0){
                    // détermination des choix possibles pour la machine
                    let choices = []
                    let head = this.calculateHead()
                    let tail = this.calculateTail()
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
                    let machineChoices = [ ...allChoices ]
                    let choicesNum = machineChoices.length
                    console.log('MACHINECHOICES', machineChoices)
                    this.$store.commit('ACTUALIZE_MACHINECHOICES', choicesNum)
                    
                    // selon les résultats... pas de choix, un seul choix, plusieurs choix possibles
                    // pas de domino à placer : la machine pioche...
                    if (machineChoices.length === 0) {
                        if (this.$store.state.noChoice === true){
                            this.continue = false

                        } else {
                            let continueDrawing = true
                            while (continueDrawing && this.$store.state.shuffledPieces.length > 0) {
                                this.drawAgain(0)
                                
                                let one = this.$store.state.machineHand[this.$store.state.machineHand.length-1]
                                if (one.prev === head || one.next === head || one.prev === tail || one.next === tail){
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
                let lockChoices = this.lockPlayer(machineChoices, head, tail)
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
            let final = this.calculateBestChoice(machineChoices) 
            
            let piece = this.$store.state.machineHand.find(p => p.value[0] === final[0] && p.value[1] === final[1])
            console.log("PIECE TO PLAY", piece, head, tail)
            piece.player = false
            this.positionningTheChosenDomino(piece, head, tail)
            
            this.$store.commit('ADD_TO_BOARD', piece)   
        },
        // déterminer les possibilités que la machine a de bloquer le joueur et de le forcer à piocher
        lockPlayer(machineChoices, head, tail){
            console.log('MACHINECHOICES in LOCKPLAYER', machineChoices)
            let lockChoices = []
            let lockHead = machineChoices.filter (d => d.prev === head || d.next === head)
            let lockTail = machineChoices.filter (d => d.prev === tail || d.next === tail)
            lockChoices = [ ...lockHead, ...lockTail ]
            console.log('LOCKCHOICES', lockChoices)
            return lockChoices
        },
        //calculer le score final
        calculateScores(){
            if (this.neitherWins) {
                let finalTotal = 0
                let playerTotal = 0
                for (var i = 0; i < this.hand.length; i++){
                    let sum = this.hand[i].value[0] + this.hand[i].value[1]
                    playerTotal += sum
                }
                console.log('RESTE DU JOUEUR', playerTotal)
                let machineTotal = 0
                for (var i = 0; i < this.machineHand.length; i++){
                    console.log('MACHINEHAND STUCK', this.machineHand.length)
                    let sum = this.machineHand[i].value[0] + this.machineHand[i].value[1]
                    machineTotal += sum
                }
                return finalTotal = playerTotal - machineTotal 
            }
            if (this.playerWins) {
                let finalTotal = 0
                for (var i = 0; i < this.machineHand.length; i++){
                    console.log('MACHINEHAND', this.machineHand.length)
                    let sum = this.machineHand[i].value[0] + this.machineHand[i].value[1]
                    finalTotal += sum
                }
                return finalTotal
            }
            if (this.machineWins){
                let finalTotal = 0
                for (var i = 0; i < this.hand.length; i++){
                    let sum = this.hand[i].value[0] + this.hand[i].value[1]
                    finalTotal += sum
                }
                return finalTotal
            }
        },
        // afficher le résultat de la partie
        claimVictory(){
            let result = this.calculateScores()
           
            if (this.neitherWins) {
                if (result > 0) return 'Both players are stuck, but machine wins by ' + result
                if (result < 0) return 'Both players are stuck, but you, '+ this.name + ', wins by ' + Math.abs(result)
                if (result === 0) return 'Both players are stuck'
            }
            if (this.playerWins) return "Hey, "+ this.name + ", you have won by " + result + "!"
            if (this.machineWins) return "It's the machine which wins by "+ result + "!"
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
    margin: 10px auto;
    padding: 1%;
    background-color: green;
    color: white;
    font-size: 2rem;
    font-weight: 800;
    border-radius: 5%;
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
    cursor: pointer;
}



</style>
