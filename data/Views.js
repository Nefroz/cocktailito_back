"use strict";
const Generic = require("../core/genericModel");

module.exports = function Model(name = "views", alias = "Views") {
  Generic.call(this);

  this.connexion = "sequelize";
  this.parent = "/:entity";
  this.name = name;
  this.token = true;
  this.alias = alias;
  this.scopes = {};

  this.belongsTo = [];
  this.hasMany = [];

  this.model = undefined;
  this.toInstall = true;

  this.definition = (sequelize, DataTypes) => {
    const Model = sequelize.define(
      this.name,
      {
        date: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
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
