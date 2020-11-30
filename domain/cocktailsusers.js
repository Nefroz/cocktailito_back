const random = require("./random");
const Utils = require("../core/Utils");

class Cocktailsusers {

    constructor(data) {
        Object.assign(this, data)
        return this 
    }

    random() {
        //to fix?
        // this.usersId = Utils.getRandomInt(0,49)
        // this.cocktailsId = Utils.getRandomInt(0,49)
        this.fnc = Utils.getRandomInt(0,2)
        this.points = Utils.getRandomInt(0,5)
        return this 
    }
}

module.exports = Cocktailsusers