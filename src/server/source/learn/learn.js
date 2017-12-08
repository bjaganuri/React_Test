var fs = require("fs");
var HttpStatus = require('http-status-codes');
var handleServerError = require("../common/error_handler");

module.exports.getIndexJson = function (req,res) {
    fs.readFile('./src/public/js/data/learn/index.json', 'utf8', function (err, data) {
	    if (err){
			return handleServerError.handleServerError({status:"ERROR" , type:'SERVER_ERROR', message:err} , req , res);
		}
	    var obj = JSON.parse(data);
	    res.status(HttpStatus.OK).send(obj[req.query.pageName.toLowerCase()]);
	});
};

module.exports.cssprops = function (req,res) {
    fs.readFile('./src/public/js/data/design/cssProps.json', 'utf8', function (err, data) {
	    if (err){
			return handleServerError.handleServerError({status:"ERROR" , type:'SERVER_ERROR', message:err} , req , res);
		}
	    res.status(HttpStatus.OK).send(JSON.parse(data));
	});
};

module.exports.htmlElements = function (req,res) {
    fs.readFile('./src/public/js/data/design/HTMLElements.json', 'utf8', function (err, data) {
	    if (err){
			return handleServerError.handleServerError({status:"ERROR" , type:'SERVER_ERROR', message:err} , req , res);
		}
	    res.status(HttpStatus.OK).send(JSON.parse(data));
	});
};