"use strict";

const Sequelize = require("sequelize");
const glob = require('glob');
const path = require('path');
const Moment = require('moment');
const connexion = require('./connexion');
const _ = require('underscore');
const logger = require('tracer').console({});
const async = require("async");
const ROOT = "root"

const mysql_prefix = process.env.MYSQL_PREFIX;

const databases = {};

module.exports = (database) => {

	const Tables = {
		local : [],
		global : [], 
	}
	
	let db = new Object();
	//global database
	db.root_sequelize = connexion.sequelize(ROOT);

	if(_.isString(database) && _.isObject(databases[database])) {
		return databases[database]
	}
	else {
		
		//local database
		db.sequelize = _.isString(database) && database.length>0 ? connexion.sequelize(database) : null;

		db.structures = {}

		glob
	    .sync( '../data/*.js', { ignore : [], cwd: `${__dirname}/` })
	    .map( filename => require(`./${filename}`) )
	    .map( Structure => {

			const structure = new Structure()
			const _sequelize = structure.parent && structure.parent.length > 0 ? "sequelize" : "root_sequelize"
			const _table = structure.parent && structure.parent.length > 0 ? "local" : "global"

			if(db[_sequelize]) {
				const model = db[_sequelize].import( structure.name, structure.definition );
				Tables[_table].push({name : structure.name, alias : structure.alias})
				logger.info(`Table ${structure.name} is on ${_sequelize} and on table ${_table}`)
				if(structure.alias) {
					db[structure.alias] = model;
					db.structures[structure.alias] = structure
				}
			}
			
		});

		Object.keys(db).forEach((modelAlias) => {
			const structure = db.structures[modelAlias]
			if ( _.isObject(structure) && _.isObject(structure.associate) ) {
				structure.associate(db);
			}
			else {
				// logger.error(modelName+" not exists !")
			}
		});

		db.Sequelize = Sequelize;

			
		db.sync = (options) => {
			const _sequelize = _.isString(database) && database.length > 0 ? "sequelize" : "root_sequelize"
			const _table = _.isString(database) && database.length > 0 ? "local" : "global"
			const _database = _.isString(database) && database.length > 0 ? process.env.MYSQL_PREFIX+database : process.env.MYSQL_PREFIX+ROOT
			var options = options || {}
			return new Promise( (resolve, reject) => {
				logger.log("Try to install "+database)
				async.waterfall([
					callback => {
						db.root_sequelize.query('CREATE DATABASE IF NOT EXISTS '+_database+';')
						.then( result => {
							callback(null)
						})
						.catch( err => {
							logger.log(err)
							callback(err) 
						})
					}, 
					callback => {
						db.root_sequelize.query('USE '+_database+';')
						.then( result => {
							callback(null)
						})
						.catch( err => {
							logger.log(err)
							callback(err) 
						})
					}, 
					callback => {
						db = require("./buildDatabases")(database)
						db[_sequelize].query('SET FOREIGN_KEY_CHECKS = 0;')
						.then(() => {
							callback(null)
						}).catch(err => {
							logger.log(err)
							callback(err)
						})
					},
					callback => {
						async.eachSeries( Tables[_table] , (table, call) => {
							const _db = db[table.alias]
							_db.sync(options).then(() => {
								call(null)
							}).catch(err => {
								logger.log(err)
								call(err)
							})
						}, (err) => {
							if( err ) {
								logger.log(err)
								callback(err)
							}
							else callback(null)
						})
					},
					callback => {
						db[_sequelize].query('SET FOREIGN_KEY_CHECKS = 1;')
						.then(() => {
							callback(null)
						})
						.catch(err => {
							logger.log(err)
							callback(err)
						})
					},
				], (err) => {
					if( err ) reject(err)
					else resolve()
				})
			})
		}

		databases[database] = db;

	}

	return db;

}