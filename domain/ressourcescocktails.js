const random = require("./random");
const Utils = require("../core/Utils");

class Ressourcescocktails {

    constructor(data) {
        Object.assign(this, data)
        return this 
    }

    random() {
        //to fix?
        // this.ressourceId = Utils.getRandomInt(0,49)
        // this.cocktailId = Utils.getRandomInt(0,49)
        this.isVariation = Utils.getRandomInt(0,1)
        this.isFacultative = Utils.getRandomInt(0,1)
        this.quantity = Utils.getRandomInt(0,100)
        return this 
    }
}

module.exports = Ressourcescocktails