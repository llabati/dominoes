import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
import utils from './services/utils'

Vue.use(Vuex)

const state = {
    sortedPieces: [
        { value: [0, 0] },
        { value: [0, 1] },
        { value: [0, 2] },
        { value: [0, 3] },
        { value: [0, 4] },
        { value: [0, 5] },
        { value: [0, 6] },
        { value: [1, 1] },
        { value: [1, 2] },
        { value: [1, 3] },
        { value: [1, 4] },
        { value: [1, 5] },
        { value: [1, 6] },
        { value: [2, 2] },
        { value: [2, 3] },
        { value: [2, 4] },
        { value: [2, 5] },
        { value: [2, 6] },
        { value: [3, 3] },
        { value: [3, 4] },
        { value: [3, 5] },
        { value: [3, 6] },
        { value: [4, 4] },
        { value: [4, 5] },
        { value: [4, 6] },
        { value: [5, 5] },
        { value: [5, 6] },
        { value: [6, 6] } 
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

const actions = {
    shufflePieces({ commit }){
        commit('SHUFFLE_PIECES')
    },
    fullHand({ commit }){
        commit('FULL_HAND')
    },
    drawOne({ commit }, player){
        commit('DRAW_ONE', player)
    },
    noMoreChoice({ commit }){
        commit('NO_MORE_CHOICE')
    },
    actualizeMachineChoices({ commit }, choicesNum){
        commit('ACTUALIZE_MACHINE_CHOICES', choicesNum)
    },
    addToBoard({ commit }, domino){
        commit ('ADD_TO_BOARD', domino)
    },
    saveBoard({ commit }, newBoard) {
        let pieces = []
        for (var i = 0; i < newBoard.length; i++){
            pieces.push(newBoard[i])
        }
        commit("SAVE_BOARD", pieces)
    },
    addToLock( { commit }, newLock){
        commit('ADD_TO_LOCK', newLock)
    },
    clearAll({ commit }){
        commit('CLEAR_ALL')
    }
}

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
    ACTUALIZE_MACHINE_CHOICES(state, choicesNum){
        state.machineChoices = choicesNum
    },
    // jouer un domino
    ADD_TO_BOARD(state, domino){
        console.log('STORE DOMINO', domino)
        if (domino.place === 'left') {
            if (domino.value[1] !== domino.head) {
                utils.swap(domino.value)
                /*let t = domino.value[0]
                domino.value[0] = domino.value[1]
                domino.value[1] = t*/
                console.log('SWAP LEFT!')
            }
            state.side = 'left'
            state.board.unshift(domino)
        } if (domino.place === 'right') {
            if (domino.value[0] !== domino.tail){
                utils.swap(domino.value)
                /*let t = domino.value[0]
                domino.value[0] = domino.value[1]
                domino.value[1] = t*/
                console.log('SWAP RIGHT!')
            }
            state.side = 'right'
            state.board.push(domino)
        }
        if (domino.player === true) {
            let domo = state.hand.find(d => (d.value[0] === domino.value[0] && d.value[1] === domino.value[1]) || (d.value[0] === domino.value[1] && d.value[1] === domino.value[0]))
            let index = state.hand.indexOf(domo)
            console.log('DOMO', domo, index)
            state.hand.splice(index, 1)
        }
        else {
            let domoM = state.machineHand.find(d => (d.value[0] === domino.value[0] && d.value[1] === domino.value[1]) || (d.value[0] === domino.value[1] && d.value[1] === domino.value[0]))
            let indexM = state.machineHand.indexOf(domoM)
            console.log('DOMO MACHINE', domoM, indexM)
            state.machineHand.splice(indexM, 1)
        }
    },
    // enregistrer les ajouts au board faits par drag and drop
    SAVE_BOARD(state, pieces) {
        state.board = [ ...pieces ]
    },
    // noter les "trous" dans le jeu du joueur humain
    ADD_TO_LOCK(state, newLock) {
        state.lock.push(...newLock)
        let newSetLock = new Set(state.lock)
        state.lock = [ ...newSetLock ]
    },
    // tout remettre à zéro pour une nouvelle partie
    CLEAR_ALL(state){
        state.board = []
        state.hand = []
        state.machineHand = []
        state.shuffledPieces = []
        state.lock = []
        state.noChoice = false
        state.machineChoices = 0
        state.side = ''
    }
}

export const store = new Vuex.Store({ state, getters, actions, mutations })
