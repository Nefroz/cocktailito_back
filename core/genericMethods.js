const logger     = require('tracer').colorConsole();
// const slack = require("../controllers/__Slack");
const _ = require("underscore")
const async = require("async")
const Sequelize = require("sequelize");
const Op = Sequelize.Op

const flushRedis = (table, req) => {
    if(req.redisClient) {
        const key = [req.townName, table].filter( x => x && typeof(x) === "string" && x !== "undefined" && x.length>0 ).join("_")
        // logger.info(`TRY TO DELETE FUCKING REDIS KEYS WITH ${key} !`)
        req.redisClient.keys('*', (err, keys) => {
            // logger.log(keys)
            if (err) return logger.log(err);
            else {
                keys.filter( k => k.startsWith(key) ).map( keyToFlush => {
                    req.redisClient.del(keyToFlush)
                    logger.info(`DELETE FUCKING ${keyToFlush} !`)
                })
            }
        })
    }
}

const buildOptions = (req) => {

    var params = req.query 

    req.where = req.where || {}
    req.include = req.include || []

    var options = { 
        where : req.where,
        include : req.include,
    }

    if(_.has(req, "focus") && req.focus !== null && _.isNumber(+req.focus) && req.focus >=0 ) {
        options.where.id = +req.focus
        options.limit = 1
    }
    else if(_.has(params, "id") && params.id !== null && _.isNumber(+params.id) && params.id >= 0) {
        options.where.id = +params.id
        options.limit = 1
    }
    else if(_.has(params, "ids") && params.ids !== null) {
        options.where.id = JSON.parse(params.ids)
    }
    else if(_.has(params, "key") && _.has(params, "value")) {
        var test = String(params.value).split(":")
        if(test.length>1) {
            var comparator = test[0]
            var value = test[1]
            options.where[params.key] = { [comparator] : value }
        } 
        else if(test.length === 1) {
            options.where[params.key] = test[0]
        }
        else {
            // pas encore pris en compte
        }
    }
    else if(_.has(params, "key") && _.has(params, "like")) {
        options.where[params.key] = {[Op.like] : params.like}
    }
    else if(_.has(params, "where")) {
        try {
            options.where = JSON.parse(params.where)
        }
        catch(e) {
            // slack.error(e)
            logger.log(e)
        }
    }

    if(_.has(params, "accountId")) {
        options.where.accountId = params.accountId
    }

    if(_.has(params, "limit")) {
        options.limit = +params.limit
    }
    if(_.has(params, "offset")) {
        options.offset = +params.offset
    }
    if(_.has(params, "order")) {
        options.order = [String(params.order).split(":")]
    }

    // logger.log(options)

    return options
}

const _sync = (table, req, res, next) => {

    flushRedis(table, req)

    console.log("I TRY TO FUCKING SYNC !")

    async.waterfall([
        call => {
            req.db[table].sync({force:true})
            .then( () => {
                call(null)
            })
            .catch( err => {
                call(err)
            })
        }
    ], (error) => {
        if(error) {
            res.getErrors(error)
            next()
        }
        else {
            next() 
        }
    })

}

const _get = (table, req, res, next) => {

    var options = buildOptions(req)
    var params = req.query 
    var scope = params.scope
    var redisKey = [req.townName, table, req.originalUrl, JSON.stringify(options)].filter( x => x && typeof(x) === "string" && x !== "undefined" && x.length>0 ).join("_")

    options.req = req 

    async.waterfall([
        call => {
            logger.warn(`I TRY TO GET FUCKING REDIS FROM ${redisKey}`)
            if(req.redisClient) {
                req.redisClient.get(redisKey, (err, result) => {
                    if(err) {
                        logger.log(err)
                        call(null, false)
                    }
                    else {
                        try {
                            const _res = JSON.parse(result)
                            if((_.isArray(_res) && _res.length>0) || (_.isObject(_res) && Object.keys(_res).length>0) ) {
                                logger.warn(`I GET THE FUCKING REDIS RESULT FOR ${redisKey} :)`)
                                res.response = _res 
                                call(null, true)
                            }
                            else {
                                call(null, false)
                            }
                        } 
                        catch( error ) {
                            call(null, false)
                        }
                    }
                })
            } else call(null, false)
        },
        (skip, call) => {
            if(skip) call(null)
            else {
                logger.warn(`I HAVE TO CALL THE FUCKING SQL SERVER FOR ${redisKey} :(`)
                req.db[table]
                .scope(scope)
                .findAll(options)
                .then( (instances) => {
                    if(Array.isArray(instances)) {

                        res.response = instances 

                        if(_.isArray(res.response) && res.response.length === 1 && req.focus) {
                            res.response = _.first(res.response)
                        }
            
                        if(req.redisClient) {
                            try {
                                const _res = JSON.stringify(res.response)
                                req.redisClient.setex(redisKey, 3600, _res)
                                logger.warn(`I SET RESPONSE IN THE FUCKING REDIS ON ${redisKey} :(`)
                            }
                            catch( err ) {
                                logger.log(err)
                            }
                        }

                        call(null)
                    } else {
                        call("Instances is not an Array")
                    }
                })
                .catch( err => {
                    call(err)
                })
            }
        }
    ], (error) => {
        if(error) {
            res.getErrors(error)
            next()
        }
        else {
            next() 
        }
    })

}

const _post = (table, req, res, next) => {

    const inputs = req.body

    flushRedis(table, req)

    async.waterfall([
        call => {
            if( !inputs || (Array.isArray(inputs) && inputs.length === 0) || (_.isObject(inputs) && Object.keys(inputs).length === 0) ) {
                return res.status(400).send({
                    message: "Body content can not be empty"
                });
            }
            else {
                call(null)
            }
        },
        call => {

            const options = {
                req : req, 
            }

            if(Array.isArray(inputs)) {
                req.db[table].bulkCreate(inputs, options)
                .then( (instances) => {
                    res.response = instances
                    call(null)
                })
                .catch( err => {
                    call(err)
                })
            } 
            else if(_.isObject(inputs)) {
                req.db[table].create(inputs, options)
                .then( (instance, test) => {
                    if(_.isObject(instance) && instance.dataValues) {
                        res.response = instance 
                        req.focus = instance.id
                        // res.success.push("L'instance a été créée.")
                        call(null)
                    }
                    else {
                        call("Il y a une erreur de validation qui vous empeche de faire cela !")
                    }
                })
                .catch( err => {
                    call(err)
                })
            }
            else {
                call("Only Array<object> or Object can be inserted in the table "+table)
            }
        }
    ], (error) => {
        if(error) {
            res.getErrors(error)
            next()
        }
        else {
            next() 
        }
    })

}

const _put = (table, req, res, next) => {

    const inputs = req.body
    const options = buildOptions(req)

    options.req = req

    flushRedis(table, req)

    if(!inputs) {
        return res.status(400).send({
            message: "Body content can not be empty"
        });
    }
    else {
        async.waterfall([
            call => {       
                if(_.isArray(inputs) && inputs.length>0) {

                    req.where = {id : []}

                    async.each( inputs, (input, cb) => {

                        let index = input.id 
                        // delete input.id 
                        const _options = _.clone(options) 
                        // _options.returning = true 
                        // _options.plain = true 
                        // _options.individualHooks = true
                        _options.where.id = index 

                        req.where.id.push(index)

                        req.db[table].update(input, _options)
                        .then( () => {
                            // res.success.push("L'instance a été mise à jour.")
                            cb(null)
                        })
                        .catch( err => {
                            call(err)
                        })

                    }, (err) => {
                        if(err) call(err)
                        else call(null)
                    })
                }
                else if(_.isObject(inputs)) {
                    req.db[table].update(inputs, options)
                    .then( (rowsUpdated) => {
                        req.db[table].findAll(options)
                        .then( (instance) => {
                            if(_.isArray(instance) && instance.length>1) {
                                const temp = []
                                _.each( instance, inst => {
                                    temp.push( inst.get() )
                                })
                                res.response = temp
                            }
                            else if(_.isArray(instance) && instance.length===1) {
                                res.response = instance[0].get() 
                            }
                            call(null)
                        })
                        // .catch(e => {
                        //     slack.error(e)
                        //     logger.log(e)
                        //     call(e)
                        // })
                    })
                    // .catch(e => {
                    //     slack.error(e)
                    //     logger.log(e)
                    //     call(e)
                    // })
                } 
            }
        ], (error) => {
            if(error) {
                res.getErrors(error)
                next()
            }
            else {
                next() 
            }
        })
    }

}

const _delete = (table, req, res, next) => {

    var options = buildOptions(req)

    flushRedis(table, req)

    async.waterfall([
        call => {

            options.req = req 

            req.db[table]
            .findAll(options).then( (instances) => {
                res.response = []
                async.each(instances, (instance, cb) => {
                    instance.dataValues.flag = "deleted"
                    res.response.push( instance.get() )
                    // res.success.push("L'instance a été supprimée.")
                    instance.destroy({req : req})
                    cb(null)
                }, () => {
                    call(null)
                })
            })
            .catch( err => {
                call(err)
            })
        },
    ], (error) => {
        if(error) {
            res.getErrors(error)
            next()
        }
        else {
            if(req.focus) {
                res.response = _.first(res.response)
            }
            next() 
        }
    })

}

const _count = (table, req, res, next) => {

    var options = buildOptions(req)

    flushRedis(table, req)

    async.waterfall([
        call => {
            call(null)
        },
        call => {
            req.db[table].count(options).then( (result) => {
                res.response = result
                call(null)
            })
            .catch( err => {
                call(err)
            })
        }
    ], (error) => {
        if(error) {
            res.getErrors(error)
            next()
        }
        else {
            next() 
        }
    })

}

const flush = (table, req, res, next) => {
    // table peut être un string ou un array de string 
    const doItFor = _.isString(table) ? [table] : _.isArray(table) ? table : []
    doItFor.map( it => {
        flushRedis(it, req)
    })
    next() 
}

const _where = (options) => {

    return (req, res, next) => {

        let temp = {}

        function build_Values(_obj, parent = null) {

            if(!parent) parent = temp 

            if(_.isObject(_obj)) {
                _.each(_obj, (val,key) => {
                    var _key = build_Key(key)
                    if(key === "accountId" && val === "mine" && _.isNumber(req.session.accountId)) {
                        parent["accountId"] = req.session.accountId
                    }
                    else if(_.isString(val) || _.isNumber(val)) {
                        parent[_key] = val
                    }
                    else if(_.isObject(val)) {
                        parent[_key] = parent[_key] || {}
                        build_Values(val, parent[_key])
                    }
                })
            }
        }

        function build_Key(key) {
            if(key === "or") return Op.or;
            else if(key === "and") return Op.and;
            else if(key === "lte") return Op.lte; 
            else if(key === "gte") return Op.gte;
            else if(key === "lt") return Op.lt; 
            else if(key === "gt") return Op.gt;
            else if(_.isString(key)) return key; 
            else return false 
        }

        req.where = req.where || {}
        build_Values(options)
        req.where = temp
        next() 
    }
}

const _include = (model, as=null) => {
    // En deuxieme argument, on peut mettre des as si on a plusieurs associations sur la même table 
    // Generic.include("Budgets", ["Id", "Article", "Projet"]),

    return (req, res, next) => {

        req.include = req.include || []
        if(_.isObject(req.db[model])) {
            if(_.isArray(as) && as.length>0) {
                // req.include = as
                as.map( _as => {
                    req.include.push({ model : req.db[model], as : _as })
                })
            }
            else {
                req.include.push({ model : req.db[model] })
            }
        }
        next()

    }

}

module.exports = {
    get : _get, 
    post : _post, 
    delete : _delete, 
    put : _put, 
    sync : _sync,
    count : _count,
    where : _where, 
    include : _include, 
    buildOptions : buildOptions,
    flushRedis : flushRedis,
    flush : flush, 
}
