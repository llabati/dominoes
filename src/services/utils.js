export default {
    randomize: function(){
        let randomDraw = Math.floor(Math.random() * 28)
        return randomDraw
    },
    
    // inverse la gauche et la droite du domino
    swap: function(doubleValue){
        let t = doubleValue[0]
        doubleValue[0] = doubleValue[1]
        doubleValue[1] = t
    }
}
