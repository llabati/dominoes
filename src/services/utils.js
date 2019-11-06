export default {
    /*randomize: function(){
        let randomDraw = Math.floor(Math.random() * 28)
        return randomDraw
    },*/
    // inverse la gauche et la droite du domino
    swap: function(doubleValue){
        console.log('UTILS SWAP!!!', doubleValue)
        let t = doubleValue[0]
        doubleValue[0] = doubleValue[1]
        doubleValue[1] = t
        console.log('UTILS SWAP', doubleValue)
    },
    setScores(rest) {
        return rest.reduce((sum, a) => sum + a.value[0] + a.value[1], 0)
    },
    //calculer le score final
    calculateScores(results){
        if (results.neitherWins) {
            let playerTotal = this.setScores(results.player)
            let machineTotal = this.setScores(results.machine)
            return playerTotal - machineTotal 
        }
        if (results.playerWins) {
            return this.setScores(results.machine)
        }
        if (results.machineWins){
            return this.setScores(results.player)
        }
    },
    incrementIndex(i){
        return i++
    }
}
