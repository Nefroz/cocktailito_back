"use strict";
const Generic = require("../core/genericModel");

module.exports = function Model(name = "users", alias = "Users") {
  Generic.call(this);

  this.connexion = "sequelize";
  this.parent = "/:entity";
  this.name = name;
  this.token = true;
  this.alias = alias;
  this.scopes = {};

  this.belongsTo = [];
  this.hasMany = ["Cocktailsusers"];

  this.model = undefined;
  this.toInstall = true;

  this.definition = (sequelize, DataTypes) => {
    const Model = sequelize.define(
      this.name,
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false, 
          defaultValue: ""
        },
        firstname: {
          type: DataTypes.STRING,
          allowNull: false, 
          defaultValue: ""
        },
        tel: {
          type: DataTypes.STRING,
        },
        email: {
          type: DataTypes.STRING,
        },
        birthday: {
          type: DataTypes.DATE,
        },
        streetname: {
          type: DataTypes.STRING,
        },
        city: {
          type: DataTypes.STRING,
        },
        streetnumber: {
          type: DataTypes.STRING,
        },
        postalcode: {
          type: DataTypes.STRING,
        },
        country: {
          type: DataTypes.STRING,
        },
        pseudo: {
          type: DataTypes.STRING,
        },
        password: {
          type: DataTypes.STRING,
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
