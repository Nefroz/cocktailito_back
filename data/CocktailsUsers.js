"use strict";
const Generic = require("../core/genericModel");

module.exports = function Model(name = "cocktailsusers", alias = "CocktailsUsers") {
  Generic.call(this);

  this.connexion = "sequelize";
  this.parent = "/:entity";
  this.name = name;
  this.token = true;
  this.alias = alias;
  this.scopes = {};

  this.belongsTo = ["Users","Cocktails"];
  this.hasMany = [];

  this.model = undefined;
  this.toInstall = true;

  this.definition = (sequelize, DataTypes) => {
    const Model = sequelize.define(
      this.name,
      {
        fnc: { // Est ce un ajout aux favoris(0), une notation(1) d'un cocktail,ou un commentaire(2)?
          type: DataTypes.BIGINT,
        },
        points: { // Si notation, quelle valeur?
          type: DataTypes.BIGINT,
        },
        text: { // Si commentaire, quelle valeur?
          type: DataTypes.BIGINT,
        },
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
