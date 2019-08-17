import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'

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
    board: []
}
const getters = {}

const actions = {}

const mutations = {
    SHUFFLE_PIECES(state){
      state.shuffledPieces =  _.shuffle(state.sortedPieces)
    },
    GIVE_PLAYER_A_NAME(state, name){
        state.name = name
    },
    FULL_HAND(state){
        state.hand.push(state.shuffledPieces[0])
        state.shuffledPieces.shift()
        state.machineHand.push(state.shuffledPieces[0])
        state.shuffledPieces.shift()
        console.log(state.machineHand)
        //console.log(store.shuffledPieces.length)
    },
    ADD_TO_BOARD(state, domino){
        console.log('STORE DOMINO', domino)
        if (domino.place === 'left') {
            if (domino.next !== domino.head) {
                let a = domino.value[0]
                domino.value[0] = domino.value[1]
                domino.value[1] = a
                console.log('SWAP LEFT!')
            }
            state.board.unshift(domino)
        } else {
            if (domino.prev !== domino.tail){
                let b = domino.value[0]
                domino.value[0] = domino.value[1]
                domino.value[1] = b
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
    }
}

export const store = new Vuex.Store({ state, getters, actions, mutations })
