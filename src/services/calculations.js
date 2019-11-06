
import { store } from '../store.js'
export default {
    state: store.state,
    
    // désigne la valeur gauche du domino placé à l'extrémité gauche du tapis de jeu
    calculateHead: function(){
        let head = this.state.board[0].value[0]
        return head
    },
    // désigne la valeur droite du domino placé à l'extrémité droite du tapis
    calculateTail: function(){
        let tail = this.state.board[this.state.board.length-1].value[1]  
        return tail
    },
    // prépare le bon placement du domino choisi en définissant la "tête" (à gauche) ou la "queue" (à droite)
    positionningTheChosenDomino: function(piece, head, tail){
        //piece.place = (piece.next === head || piece.prev === head) ? "left" : "right"
        piece.place = (piece.value[0] === head || piece.value[1] === head) ? "left" : "right"
        console.log('DOMINO HAS ITS PLACE', piece.place)
        if (piece.place === "left") {
            piece.tail = undefined
            piece.head = head
        } else {
            piece.head = undefined
            piece.tail = tail
        }
    },
    // détermine le meilleur domino à jouer (nombre de points le plus élevé), parmi les choix possibles
    // favorise le choix des doubles
    calculateBestChoice: function(machineChoices){
        console.log('MACHINECHOICES ENTERING CALCULEBEST CHOICE', machineChoices)
            let computedChoices = machineChoices.map(e => [ e.value[0], e.value[1], e.value[0] + e.value[1] ])
                console.log('COMPUTEDCHOICES', computedChoices)
            
            let finalChoices = (computedChoices.find( e => e[0] === e[1])) ? computedChoices.filter(a => a[0] === a[1]).sort((a,b) => b[2] - a[2]) : computedChoices.sort((a,b) => b[2] - a[2])
            console.log('FINAL CHOICES', finalChoices)

            let final = finalChoices[0]
            console.log('FINAL CHOICE', final)
            this.double = false
            return final
    },

    // déterminer les possibilités que la machine a de bloquer le joueur et de le forcer à piocher
    lockPlayer(machineChoices, head, tail){
        console.log('MACHINECHOICES in LOCKPLAYER', machineChoices)
        let lockChoices = []
        let lockHead = machineChoices.filter (d => d.value[0] === head || d.value[1] === head)
        let lockTail = machineChoices.filter (d => d.value[0] === tail || d.value[1] === tail)
        lockChoices = [ ...lockHead, ...lockTail ]
        console.log('LOCKCHOICES', lockChoices)
        return lockChoices
    }
        

}
