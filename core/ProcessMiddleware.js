const _ = require("underscore")
const async = require("async")
const logger = require('tracer').colorConsole();
const ValidationErrorItem = require("sequelize").ValidationErrorItem;
const SequelizeWarning = require("./sequelizeWarning");

const dir = "./cache"

module.exports = {

    start : (req, res, next) => {

        res.errors = res.errors || []
        res.warnings = res.warnings || []

        req.db = require('../core/buildDatabases')(req.entity || undefined)

        // req.db.sync({force:true})

        res.getErrors = (e) => {

            logger.log(e)

            if(e && e.name === "SequelizeDatabaseError") {
                // logger.log(e)
                res.errors.push( e.original.sqlMessage )
                // slack.error(e)
            }
            else if( e instanceof SequelizeWarning) {
                res.status(202)
                res.warnings.push(e.message)
                logger.log(e)
            }
            else if(e) {
                const errors = _.isArray(e.errors) ? e.errors : []
                errors.map( error => {

                    if( error instanceof ValidationErrorItem) {
                        res.errors.push( error.message )
                        logger.log(error.message)
                    }
                    else {
                        logger.log( error )
                        slack.error(error)
                    }
                })
            }

        }

        // res.getAnswer = () => {
        //     var answer = {
        //         statusCode: res.statusCode,
        //         errors : res.errors,
        //         warnings : res.warnings, 
        //         success : res.success, 
        //         response : res.response,
        //     }

        //     logger.log(answer)

        //     return answer
        // }

        next()
    },

    stop : (req, res) => {

        // logger.log(res.errors, res.warnings)

        if(res.errors.length > 0) {
            res.status(500).json({
                code : 500,
                message : res.errors
            })
        }
        else if(res.warnings.length > 0) {
            res.status(500).json({
                code : 202,
                message : res.warnings
            })
        }
        else {
            res.status(res.statusCode).json(res.response)
        }

    }

}
