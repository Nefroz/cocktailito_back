"use strict";
const Generic = require("../core/genericModel");

module.exports = function Model(name = "ressources", alias = "Ressources") {
  Generic.call(this);

  this.connexion = "sequelize";
  this.parent = "/:entity";
  this.name = name;
  this.token = true;
  this.alias = alias;
  this.scopes = {};

  this.belongsTo = [];
  this.hasMany = ["Ressourcescocktails"];

  this.model = undefined;
  this.toInstall = true;

  this.definition = (sequelize, DataTypes) => {
    const Model = sequelize.define(
      this.name,
      {
        name: { //nom de la ressource
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: ""
        },
        typeofquantity: { // ex:feuilles,centilitres,grammes
          type: DataTypes.STRING,
        },
        toFactorize: { //Peut on factoriser si moins/plus de personnes, ex: 1 cuillere reste une cuillere meme s'il faut le faire pour 1 ou 10 personnes
          type: DataTypes.STRING,
        },
        isValidated: { //Cocktail ou ressource validée
          type: DataTypes.BOOLEAN,
        }
      },
      {
        paranoid: true,
        hooks: {}
      }
    );

    this.model = Model;
    return Model;
  };
};
