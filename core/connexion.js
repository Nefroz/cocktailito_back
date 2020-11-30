'use strict';

const exec = require('child_process').exec;
const Sequelize = require("sequelize");
const logger 	= require('tracer').colorConsole();
const sequelizeLogger = require('./sequelizeLogger');
const Utils = require('./Utils');

const databases = {}

const node_env 			= process.env.NODE_ENV
const mysql_prefix 		= process.env.MYSQL_PREFIX
const mysql_user 		= process.env.MYSQL_USER
const mysql_password 	= process.env.MYSQL_PASSWORD

module.exports = {

	check : () => {
		if (!mysql_prefix) {
		    console.error("Il manque MYSQL_PREFIX ! do > set MYSQL_PREFIX=var (on windows) or > export MYSQL_PREFIX=var (on linux)");
		    return false
		}
		else if (!mysql_user) {
		    console.error("Il manque MYSQL_USER ! do > set MYSQL_USER=var (on windows) or > export MYSQL_USER=var (on linux)");
		    return false
		}
		else if (!mysql_password) {
		    console.error("Il manque MYSQL_PASSWORD ! do > set MYSQL_PASSWORD=var (on windows) or > export MYSQL_PASSWORD=var (on linux)");
		    return false
		}
		else {
			return true 
		}
	},

	sequelize : (database) => {

		var database = typeof(database) == "string" && database.length>0 ? mysql_prefix+database : null

		if(database) {

			var configuration = {
				host: "localhost",
				port: 3306,
				dialect: 'mysql',
				pool: {
					max: 50,
					min: 0,
					idle: 100,
				},
				query : {

				}
			}

			if(node_env === "production") {
				configuration.logging = false
			}

			let sequelize
			const the_key = "db-"+database

			if(!databases[the_key]) {
				sequelize = new Sequelize(database, mysql_user, mysql_password, Object.assign(configuration, {
					logging : (text) => {
						logger.log(sequelizeLogger(text))
					}
				}));

				databases[the_key] = sequelize
			}
			else {
				sequelize = databases[the_key]
			}

			return sequelize

		}
		else return false

	},

	getDatabases : () => {
		return new Promise( (resolve, reject) => {
			const command = `mysql -u${mysql_user} -p${mysql_password} -e"SHOW DATABASES;"`
			const re = mysql_prefix+'([a-z_0-9]+)';
			const regex = new RegExp(re, 'gi')
			exec(command, (error, stdout, stderr) => {
			    if (error) {
			        logger.error(`exec error: ${error}`);
			        reject(error)
			        return;
			    } else {
			        var databases = Utils.getMatches(String(stdout), regex, 1)
			        resolve(databases)
			    }
			})
		})
	},


}