const random = require("./random");
const Utils = require("../core/Utils");

class Ressources {

    constructor(data) {
        Object.assign(this, data)
        return this 
    }

    random() {
        this.name = random.get("ressources")
        this.typeofquantity = random.get("typeofquantity")
        this.toFactorize = Utils.getRandomInt(0,1)
        this.isValidated = Utils.getRandomInt(0,1)
        return this 
    }
}

module.exports = Ressources