const random = require("./random");
const Utils = require("../core/Utils");
const moment = require('moment');

class Users {

    constructor(data) {
        Object.assign(this, data)
        return this 
    }

    random() {
        this.firstname = random.get("firstnames")
        this.lastname = random.get("lastnames")
        this.birthday = moment(random.get("birthdays")).format('DD-MM-YYYY')
        this.email = random.get("emails")
        let tel1 = Utils.getRandomInt(470000000,499999999)
        this.tel = "0"+tel1;
        this.addressId = Utils.getRandomInt(1,10)
        this.postalcode = Utils.getRandomInt(1000,9999)
        this.country = random.get("countries")
        this.city = random.get("cities")
        this.streetnumber = Utils.getRandomInt(1,100)
        this.streetname = random.get("streetnames")
        this.pseudo = random.get("pseudo")
        this.password = random.get("password")
        return this 
    }
}

module.exports = Users