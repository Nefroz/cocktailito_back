const random = require("./random");
const Utils = require("../core/Utils");

class Articles {

    constructor(data) {
        Object.assign(this, data)
        return this 
    }

    random() {
        this.title = random.get("articletitle")
        return this 
    }
}

module.exports = Articles