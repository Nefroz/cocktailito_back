"use strict";
const Generic = require("../core/genericModel");

module.exports = function Model(name = "cocktails", alias = "Cocktails") {
  Generic.call(this);

  this.connexion = "sequelize";
  this.parent = "/:entity";
  this.name = name;
  this.token = true;
  this.alias = alias;
  this.scopes = {};

  this.belongsTo = [];
  this.hasMany = ["Ressourcescocktails","Cocktailsusers","Views"];

  this.model = undefined;
  this.toInstall = true;

  this.definition = (sequelize, DataTypes) => {
    const Model = sequelize.define(
      this.name,
      {
        name: { //nom du cocktail
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue:""
        },
        isAlcohol: { //cocktail ou mocktail?
          type: DataTypes.BOOLEAN,
        },
        price: { //De 1 a 3, la valeur du prix du cocktail
          type: DataTypes.STRING,
        },
        difficulty: { //De 1 a 3, la valeur de la difficulté de réalisation du cocktail
          type: DataTypes.STRING,
        },
        degree: { //De 0 a 100, la teneur en alcool du cocktail, mocktail=0
          type: DataTypes.STRING,
        },
        volume: { //De 0 a 3, pour shooter, petit verre, verre normal, grand verre
          type: DataTypes.STRING,
        },
        isValidated: { //Cocktail ou ressource validée
          type: DataTypes.BOOLEAN,
        },
        instructions: { //Instructions 
          type: DataTypes.TEXT,
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
