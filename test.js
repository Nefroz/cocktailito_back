/*const Thing = require('../models/thing');*/
const path = require("path");
const fs = require("fs-extra");
const multiparty = require("multiparty");
const util = require("util");
const libre = require("libreoffice-convert");
const async = require("async");
const {exec} = require("child_process");
const logger = require("tracer").console();
const guid = require("uuid/v1");
const jbr = require("javascript-barcode-reader");

exports.postfile = (req,res,next) => {
	const errors = [];
	const outputDir = `temp`;
	const _outputDir = path.join(__dirname, '../', outputDir);
	logger.log(_outputDir);
	if (!fs.existsSync(_outputDir)){
		fs.mkdirSync(_outputDir);
	}
	// Multiparty parsing
	var form = new multiparty.Form();
	form.parse(req, function(err, fields, files_by_key) {
		async.eachOfSeries(files_by_key, (files, key, callback) => {
			async.eachSeries(files, (file, callnext) => {
				const _file = path.parse(file.originalFilename);
				const filename = _file.name;
				const extension = _file.ext;
				const destinit = filename+"_"+guid();
				const destination = destinit+extension;
				const _path = path.join( __dirname, '../', outputDir);
				const newFile = path.join( _outputDir, destination)
				fs.copyFile(file.path, newFile, (err) => {
					if (err) {
						cb(err);
					}
					else {
						console.log(`${_outputDir} was copied to ${destination}`);
						cb(null);
					}
				});
			}, (err) => {
				if(err) errors.push(err);
	        	callback(null);
	        })
		}, (err) => {
			if(err) errors.push(err);
			if(errors.length > 0) {
				res.status(500).json({
					error : errors, 
					message  : "Il y a eu des erreurs",
					status : 500, 
					code : 1525,
				})
			}
			else {
				res.status(200).json({
					message : "ok "
				})
			}
		})
	});
};




