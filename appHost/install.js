
const logger = require('tracer').console({});
const async = require("async");
const moment = require("moment");
const Users = require("../domain/users.js");
const Utils = require("../core/Utils");
const random = require("../domain/random.js");

module.exports = [
	{
        name: `install`,
        method: "get",
        route: `/:entity/install`,
        methods: [
        	(req, res, next) => {

        		async.waterfall([
				    c => {
                        const dbo = require("../core/buildDatabases")()
                        dbo.sync({force:true}).then( () => {
                            c(null)
                        })
                    },
                    c => {
                        req.db = require("../core/buildDatabases")(req.entity)
                        req.db.sync({force:true}).then( () => {
                            c(null)
                        })
                    },
                    c => {
                        const users = []
                        for(var i=0; i<50; i++) {
                            const res = new Users().random()
                            users.push(res)
                        }
                        req.db.Users.bulkCreate(users, {req : req}).then( () => {
                            c(null)
                        })
                    }
				], () => {
					next()
				})
        	}
        ],
    },
]