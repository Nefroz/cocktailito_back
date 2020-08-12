"use strict";
const Generic = require("../core/genericModel");

module.exports = function Model(name = "articles", alias = "Articles") {
  Generic.call(this);

  this.connexion = "sequelize";
  this.parent = "/:entity";
  this.name = name;
  this.token = true;
  this.alias = alias;
  this.scopes = {};

  this.belongsTo = [""];
  this.hasMany = [""];

  this.model = undefined;
  this.toInstall = true;

  this.definition = (sequelize, DataTypes) => {
    const Model = sequelize.define(
      this.name,
      {
        urlvideo: {
          type: DataTypes.STRING,
        },
        urlimage: {
          type: DataTypes.ARRAY,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false
        },
        resume: {
          type: DataTypes.STRING,
          allowNull: false
        },
        text: {
          type: DataTypes.STRING,
          allowNull: false
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
