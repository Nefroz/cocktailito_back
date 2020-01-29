const path = require("path");
const fs = require("fs-extra");
const multiparty = require("multiparty");
const util = require("util");
const async = require("async");
const {exec} = require("child_process");
const logger = require("tracer").console();
const guid = require("uuid/v1");
const db = require("../data/index");
var bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sequelize = require("sequelize");
const moment = require("moment")

exports.createUnavailibility = (req,res,next) => {
  db.Unavailibilities.create(req.body)
  .then(() => res.status(201).json(req.body))
  .catch(error => res.status(400).json({ error }));
}

exports.getUnavailibility = (req,res,next) => {
  db.Unavailibilities.findAll().then(unavailibility => {
      console.log("All unavailibilities:", JSON.stringify(unavailibility, null, 4));
      res.status(200).json(unavailibility);
  }).catch(error => res.status(400).json({ error }));
};

exports.putUnavailibility = (req,res,next) =>{
  const indice=req.params.id;
  db.Unavailibilities.update(
  req.body,
  { where: { id: indice } }
  )
  .then(() => res.status(200).json(req.body))
  .catch(error => res.status(204).json({ error }))
};

exports.deleteUnavailibility = (req,res,next) => {
  const indice=req.params.id;
  db.Unavailibilities.destroy({
  where: { id:indice }
})
  .then(() => res.status(200).json({ message: 'Unavailibility related to index: '+req.params.id+' deleted !' }))
  .catch(error => res.status(500).json({ error }));
}