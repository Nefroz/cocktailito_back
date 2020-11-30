const random = require("./random");
const Utils = require("../core/Utils");
const moment = require('moment');

class Views {

    constructor(data) {
        Object.assign(this, data)
        return this 
    }

    random() {
        this.date = moment(random.get("birthdays")).format('DD-MM-YYYY')
        // this.cocktailId = Utils.getRandomInt(0,49)
        return this 
    }
}

module.exports = Views