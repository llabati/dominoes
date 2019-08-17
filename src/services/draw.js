//import board from './board'
import * as utils  from './utils';

export default {
    pieces: [
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
    preset: function(){
        let gameSet = []
        var click = 0
        while (click < 7){
            let dominoe = this.pieces.find(p => p.value === utils.draw())
            let indDo = this.pieces.indexOf(dominoe)
            gameSet.push(dominoe)
            this.pieces.splice(indDo, 1)
            click++
        }
        console.log(gameSet)
        return gameSet

    }
}