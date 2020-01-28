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
const moment = require("moment");

exports.createEquipment = (req,res,next) => {
  db.Equipments.create(req.body)
  .then((instance) =>{
    Object.assign(req.body, {EquipmentId : instance.id})
    console.log(req.body)
    db.Descriptions.create(req.body)
    .then((instance) =>{
      db.Gages.create(req.body)
      .then(() => res.status(201).json(req.body))
      .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(400).json({ error }));
  })
  .catch(error => res.status(400).json({ error }));
}

exports.getEquipment = (req, res,next) => {
  db.Equipments.findAll({
    include : [
      { model : db.Descriptions },
      { model : db.Gages }
    ]
  }).then(reserv => {
      console.log("All equipments: ", JSON.stringify(reserv, null, 4));
      res.status(200).json(reserv);
  }).catch(error => {
    console.log(error)
    res.status(400).json({ error })
  });
};

exports.putEquipment = (req,res,next) =>{
  const indice=req.params.id;
  db.Equipments.update(
  req.body,
  { where: { id: indice } }
  )
  .then(() => res.status(200).json(req.body))
  .catch(error => res.status(204).json({ error }))
};

exports.deleteEquipment = (req,res,next) => {
  const indice=req.params.id;
  db.Equipments.destroy({
  where: { id:indice }
})
  .then(() => res.status(200).json({ message: 'Equipment deleted !' }))
  .catch(error => res.status(500).json({ error }));
}