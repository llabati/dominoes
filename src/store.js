import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
import utils from './services/utils'

Vue.use(Vuex)

const state = {
    sortedPieces: [
        { value: [0, 0], prev : 0, next: 0 },
        { value: [0, 1], prev : 0, next: 1 },
        { value: [0, 2], prev : 0, next: 2 },
        { value: [0, 3], prev : 0, next: 3 },
        { value: [0, 4], prev : 0, next: 4 },
        { value: [0, 5], prev : 0, next: 5 },
        { value: [0, 6], prev : 0, next: 6 },
        { value: [1, 1], prev : 1, next: 1 },
        { value: [1, 2], prev : 1, next: 2 },
        { value: [1, 3], prev : 1, next: 3 },
        { value: [1, 4], prev : 1, next: 4 },
        { value: [1, 5], prev : 1, next: 5 },
        { value: [1, 6], prev : 1, next: 6 },
        { value: [2, 2], prev : 2, next: 2 },
        { value: [2, 3], prev : 2, next: 3 },
        { value: [2, 4], prev : 2, next: 4 },
        { value: [2, 5], prev : 2, next: 5 },
        { value: [2, 6], prev : 2, next: 6 },
        { value: [3, 3], prev : 3, next: 3 },
        { value: [3, 4], prev : 3, next: 4 },
        { value: [3, 5], prev : 3, next: 5 },
        { value: [3, 6], prev : 3, next: 6 },
        { value: [4, 4], prev : 4, next: 4 },
        { value: [4, 5], prev : 4, next: 5 },
        { value: [4, 6], prev : 4, next: 6 },
        { value: [5, 5], prev : 5, next: 5 },
        { value: [5, 6], prev : 5, next: 6 },
        { value: [6, 6], prev : 6, next: 6 } 
    ],
    shuffledPieces: [],
    name: '',
    hand: [],
    machineHand: [],
    board: [],
    lock: [],
    noChoice: false,
    machineChoices: 0,
    side:''
}
const getters = {}

const actions = {}

const mutations = {
    // se souvenir du prénom du joueur
    GIVE_PLAYER_A_NAME(state, name){
        state.name = name
    },
    //mélanger les dominos
    SHUFFLE_PIECES(state){
      state.shuffledPieces =  _.shuffle(state.sortedPieces)
    },
    // distribuer les dominos
    FULL_HAND(state){
        state.hand.push(state.shuffledPieces[0])
        state.shuffledPieces.shift()
        state.machineHand.push(state.shuffledPieces[0])
        state.shuffledPieces.shift()
        console.log(state.machineHand)
    },
    // piocher
    DRAW_ONE(state, player) {
        if (player === 1) state.hand.push(state.shuffledPieces[0])
        if (player === 0) state.machineHand.push(state.shuffledPieces[0])
        state.shuffledPieces.shift()
        console.log('STORE DRAWED!')
    },
    NO_MORE_CHOICE(state){
        state.noChoice = true
    },
    ACTUALIZE_MACHINECHOICES(state, choicesNum){
        state.machineChoices = choicesNum
    },
    // jouer un domino
    ADD_TO_BOARD(state, domino){
        console.log('STORE DOMINO', domino)
        if (domino.place === 'left') {
            if (domino.next !== domino.head) {
                utils.swap(domino.value)
                state.side = 'left'
                console.log('SWAP LEFT!')
            }
            state.board.unshift(domino)
        } else {
            if (domino.prev !== domino.tail){
                utils.swap(domino.value)
                state.side = 'right'
                console.log('SWAP RIGHT!')
            }
            state.board.push(domino)
        }
        if (domino.player === true) {
            let domo = state.hand.find(d => d.prev === domino.prev && d.next === domino.next)
            let index = state.hand.indexOf(domo)
            console.log('DOMO', domo, index)
            state.hand.splice(index, 1)
        }
        else {
            let domoM = state.machineHand.find(d => d.prev === domino.prev && d.next == domino.next)
            let indexM = state.machineHand.indexOf(domoM)
            console.log('DOMO MACHINE', domoM, indexM)
            state.machineHand.splice(indexM, 1)
        }
    },
    // noter les "trous" dans le jeu du joueur humain
    ADD_TO_LOCK(state, newLock) {
        state.lock.push(...newLock)
        let newSetLock = new Set(state.lock)
        state.lock = [ ...newSetLock ]

    }
}

export const store = new Vuex.Store({ state, getters, actions, mutations })
