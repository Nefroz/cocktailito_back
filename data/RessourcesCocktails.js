"use strict";
const Generic = require("../core/genericModel");

module.exports = function Model(name = "ressourcescocktails", alias = "Ressourcescocktails") {
  Generic.call(this);

  this.connexion = "sequelize";
  this.parent = "/:entity";
  this.name = name;
  this.token = true;
  this.alias = alias;
  this.scopes = {};

  this.belongsTo = ["Ressources","Cocktails"];
  this.hasMany = [];

  this.model = undefined;
  this.toInstall = true;

  this.definition = (sequelize, DataTypes) => {
    const Model = sequelize.define(
      this.name,
      {
        isVariation: { // Est une variation?
          type: DataTypes.BOOLEAN,
        },
        isFacultative: { // Necessaire au cocktail?
          type: DataTypes.BOOLEAN,
        },
        quantity: { //ex: 1,30,5
          type: DataTypes.STRING,
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
