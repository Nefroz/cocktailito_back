const random = require("./random");
const Utils = require("../core/Utils");

class Cocktails {

    constructor(data) {
        Object.assign(this, data)
        return this 
    }

    random() {
        this.name = random.get("cocktails")
        this.isAlcohol = Utils.getRandomInt(0,1)
        this.price = Utils.getRandomInt(1,3)
        this.difficulty = Utils.getRandomInt(1,3)
        this.degree = Utils.getRandomInt(0,100)
        this.volume = Utils.getRandomInt(0,3)
        this.isValidated = Utils.getRandomInt(0,1)
        return this 
    }
}

module.exports = Cocktails