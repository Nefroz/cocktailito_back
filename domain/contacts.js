const random = require("./random");
const Utils = require("../core/Utils");
const moment = require('moment');

class Contacts {

    constructor(data) {
        Object.assign(this, data)
        return this 
    }

    random() {
        this.subject = random.get("subject")
        this.userId = Utils.getRandomInt(0,49)
        this.text = random.get("text")
        return this 
    }
}

module.exports = Contacts