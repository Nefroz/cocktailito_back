
const logger = require('tracer').colorConsole();
const _ = require("underscore")

module.exports = function Model() {

	this.model = undefined
	this.parent = ""

    this.associate = (models) => {
   	
    	if(!this.model ||!_.isObject(this.model)) {
    		logger.error(`Probleme avec le model ${this.name}, il manque l'objet this.model`)
    		return false 
    	}

    	this.belongsTo = _.isArray(this.belongsTo) ? this.belongsTo : []
    	this.hasOne = _.isArray(this.hasOne) ? this.hasOne : []
    	this.hasMany = _.isArray(this.hasMany) ? this.hasMany : []

		this.belongsTo.map( modelAlias => {
			if(_.isString(modelAlias) && _.isObject(models[modelAlias])) {
				this.model.belongsTo(models[modelAlias])
			}
			else if(_.isObject(modelAlias) && modelAlias.model && modelAlias.options) {
				this.model.belongsTo(models[modelAlias.model], modelAlias.options)
			}
			else {
				logger.error(`${modelAlias} existe pas dans ${this.name} !!!`)
			}	
		})

		this.hasMany.map( modelAlias => {
			if(_.isString(modelAlias) && _.isObject(models[modelAlias])) {
				this.model.hasMany(models[modelAlias], { onDelete: "CASCADE" })
			}
			else if(_.isObject(modelAlias) && modelAlias.model && modelAlias.options) {
				this.model.hasMany(models[modelAlias.model], modelAlias.options)
			}
			else {
				logger.error(`${modelAlias} existe pas dans  ${this.name} !!!`)
			}	
		})

		this.hasOne.map( modelAlias => {
			if(_.isString(modelAlias) && _.isObject(models[modelAlias])) {
				this.model.hasOne(models[modelAlias], { onDelete: "CASCADE" })
			}
			else if(_.isObject(modelAlias) && modelAlias.model && modelAlias.options) {
				this.model.hasOne(models[modelAlias.model], modelAlias.options)
			}
			else {
				logger.error(`${modelAlias} existe pas dans  ${this.name} !!!`)
			}	
		})

	}


}