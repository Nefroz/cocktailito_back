const random = require("./random");
const Utils = require("../core/Utils");

class Stock {

    constructor(data) {
        Object.assign(this, data)
        return this 
    }

    random() {
        //to fix?
        // this.ressourceId = Utils.getRandomInt(0,49)
        // this.userId = Utils.getRandomInt(0,49)
        this.amount = Utils.getRandomInt(0,100)
        return this 
    }
}

module.exports = Stock