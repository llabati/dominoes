export default {
    randomize: function(){
        let randomDraw = Math.floor(Math.random() * 28)
        return randomDraw
    },
    
    swap: function(randValue){
        let t = randValue[0]
        randValue[0] = randValue[1]
        randValue[1] = t
    }
}