
const logger = require('tracer').console({});
const async = require("async");
const moment = require("moment");
const Ressources = require("../domain/ressources.js");
const Cocktails = require("../domain/cocktails.js");
const Users = require("../domain/users.js");
const Views = require("../domain/views.js");
const Articles = require("../domain/articles.js");
const Cocktailsusers = require("../domain/cocktailsusers.js");
const Ressourcescocktails = require("../domain/ressourcescocktails.js");
const Contacts = require("../domain/contacts.js");
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
                        const ressources = []
                        for(var i=0; i<50; i++) {
                            const res = new Ressources().random()
                            ressources.push(res)
                        }
                        req.db.Ressources.bulkCreate(ressources, {req : req}).then( () => {
                            c(null)
                        })
                    },
                    c => {
                        const cocktails = []
                        for(var i=0; i<50; i++) {
                            const res = new Cocktails().random()
                            cocktails.push(res)
                        }
                        req.db.Cocktails.bulkCreate(cocktails, {req : req}).then( () => {
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
                    },
                    c => {
                        const views = []
                        for(var i=0; i<100; i++) {
                            const res = new Views().random()
                            views.push(res)
                        }
                        req.db.Views.bulkCreate(views, {req : req}).then( () => {
                            c(null)
                        })
                    },
                    c => {
                        const articles = []
                        for(var i=0; i<10; i++) {
                            const res = new Articles().random()
                            articles.push(res)
                        }
                        req.db.Articles.bulkCreate(articles, {req : req}).then( () => {
                            c(null)
                        })
                    },
                    c => {
                        const contacts = []
                        for(var i=0; i<50; i++) {
                            const res = new Contacts().random()
                            contacts.push(res)
                        }
                        req.db.Contacts.bulkCreate(contacts, {req : req}).then( () => {
                            c(null)
                        })
                    },
                    c => {
                        const ressourcesCocktails = []
                        for(var i=0; i<50; i++) {
                            const res = new Ressourcescocktails().random()
                            ressourcesCocktails.push(res)
                        }
                        req.db.Ressourcescocktails.bulkCreate(ressourcesCocktails, {req : req}).then( () => {
                            c(null)
                        })
                    },
                    c => {
                        const cocktailsUsers = []
                        for(var i=0; i<50; i++) {
                            const res = new Cocktailsusers().random()
                            cocktailsUsers.push(res)
                        }
                        req.db.Cocktailsusers.bulkCreate(cocktailsUsers, {req : req}).then( () => {
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