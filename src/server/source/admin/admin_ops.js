var async = require("async");
var pdf = require('html-pdf');
var HttpStatus = require('http-status-codes');

var User = require("../../../model/users");
var JobScheduler = require("../../../model/schedule_jobs");
var handleServerError = require("../common/error_handler");
var fileUploadService = require('../common/file_upload');

module.exports.getUserAccountsList = function(req,res){
	var param = "";
	var skip = parseInt(req.body.pageNo);
	var limit = parseInt(req.body.pageSize);
	var noOfPages = 0;
	var recordsSize = 0;
	var finalSearchQuery = [];
	var globalSearchQuery = [];
	var tableFilterQuery = [];
	var tableSearchObj = {};

	if(req.body.hasOwnProperty("globalSerach") && req.body.globalSerach.hasOwnProperty("searchParam") && req.body.globalSerach.searchParam !== ""){
		param = req.body.globalSerach.searchParam;
		globalSearchQuery = [{ name:{$regex:param, $options:'i' }} , { username:{$regex:param, $options:'i' }} , { email:{$regex:param, $options:'i' }}];
	}

	if(req.body.hasOwnProperty("tableSearch") && Object.keys(req.body.tableSearch).length > 0){
		tableSearchObj = req.body.tableSearch;
		tableFilterQuery = [];
		for(key in tableSearchObj){
			if(tableSearchObj[key] !== "" && key === "admin"){
				if(tableSearchObj[key].toString().toLowerCase() === "yes" || tableSearchObj[key].toString().toLowerCase() === "true" || tableSearchObj[key].toString().toLowerCase() === true) {
					tableFilterQuery.push({[key]:{$type:"bool" , $eq: true}});
				}
				else if (tableSearchObj[key].toString().toLowerCase() === "no" || tableSearchObj[key].toString().toLowerCase() === "false" || tableSearchObj[key].toString().toLowerCase() === false) {
					tableFilterQuery.push({[key]:{$type:"bool", $in: [null,false]}});
				}
				else {
					tableFilterQuery.push({[key]:{$not:{$type:"bool"}}});
				}
			}
			else if(tableSearchObj[key] !== "") {
				tableFilterQuery.push({[key]:{$regex:tableSearchObj[key], $options:'i'}});
			}
		}
	}

	if(Object.keys(tableFilterQuery).length > 0){
		finalSearchQuery = {$and:[{$or:globalSearchQuery} , {$and:tableFilterQuery}]};
	}
	else{
		finalSearchQuery = {$or:globalSearchQuery};
	}

	if(req.user && req.user.admin && (req.user.admin === true || req.user.admin === "true")){
		//query = {$and : [{name:{$nin:[req.user.name]} , username: {$nin:[req.user.username]} , email : {$nin:[req.user.email]}}, {$or:[{ name:{$regex:param, $options:'i' }} , { username:{$regex:param, $options:'i' }} , { email:{$regex:param, $options:'i' }}]}]};
		
		User.count(finalSearchQuery , function(err,length){
			if(err) {
				return handleServerError.handleServerError({status:"ERROR" , type:'SERVER_ERROR', message:err} , req , res);
			}
			recordsSize = length;

			if(limit === "" || limit === undefined || limit === null){
				limit = recordsSize;
			}
			else{
				limit = limit;
			}

			if(skip === 0 || skip === "" || skip === undefined || skip === null){
				skip = 0;
			}
			else{
				skip = (skip-1)*limit;
			}

			noOfPages = Math.ceil(recordsSize/limit);

			User.getUserAccounts(finalSearchQuery,skip,limit,function(err,usersData){
				if(err){
					return handleServerError.handleServerError({status:"ERROR" , type:'SERVER_ERROR', message:err} , req , res);
				}
				res.status(HttpStatus.OK).send({workingUserId:req.user.username , recordsSize:recordsSize, pageNo:parseInt(Math.round(skip/limit)+1) , pageSize:limit, noOfPages:noOfPages , results:usersData,query:finalSearchQuery});
			});
		});
	}
	else{
		return handleServerError.handleServerError({status:"ERROR" , type:'NOT_ADMIN' , message:"You are not authorized to access this feature"} , req , res);
	}
};

module.exports.manageLockAdminRight = function(req, res){
	if(req.user && req.user.admin && (req.user.admin === true || req.user.admin === "true")){
		User.getUserProfile({username:req.body.username , email:req.body.email} , function(err,user){
			if(err){
				return handleServerError.handleServerError({status:"ERROR" , type:'SERVER_ERROR', message:err} , req , res);
			}
			var validReq = true;
			if(req.body.hasOwnProperty('action') && req.body.action.length > 0 && req.body.upDateUserRightOpComments){
				var actionLength = req.body.action.length;
				for(var i=0;i<actionLength;i++){
					if(req.body.action[i] === "@opState" && req.body.upDateUserRightOpComments.hasOwnProperty('opStateUpdateComments') && (req.body.upDateUserRightOpComments.opStateUpdateComments !== undefined && req.body.upDateUserRightOpComments.opStateUpdateComments !== "")){
						if(user.opState === "ACTIVE" || user.opState === "INACTIVE"){
							user.opState = "LOCKED";
							user.lockComments = req.body.upDateUserRightOpComments.opStateUpdateComments;
							user.lockedBy = req.user.email;
							delete user.lockUntil;
							user.loginAttempts = Number.MAX_SAFE_INTEGER;
						}
						else if(user.opState === "LOCKED"){
							user.opState = "ACTIVE";
							user.unLockComments = req.body.upDateUserRightOpComments.opStateUpdateComments;
							user.unLockedBy = req.user.email;
							user.lockUntil = 1;
							user.loginAttempts = 0;
						}
					}
					else if(req.body.action[i] === "@admin" && req.body.upDateUserRightOpComments.hasOwnProperty('adminRightUpdateComments') && (req.body.upDateUserRightOpComments.adminRightUpdateComments !== undefined && req.body.upDateUserRightOpComments.adminRightUpdateComments !== "")){
						if(user.admin === false){
							user.admin = true;
							user.adminRightGrantComments = req.body.upDateUserRightOpComments.adminRightUpdateComments;
							user.adminRightGrantedBy = req.user.email;
						}
						else if(user.admin === true){
							user.admin = false;
							user.adminRightRevokeComments = req.body.upDateUserRightOpComments.adminRightUpdateComments;
							user.adminRightRevokedBy = req.user.email;
						}
					}
					else{
						validReq = false;
						break;
					}
				}
			}
			else{
				validReq = false;
			}
			
			if(!validReq){
				return handleServerError.handleServerError({status:"ERROR" , type:'INVALID_REQ', message:"Invalid Request"} , req , res);
			}
			else{
				User.updateUserProfileData(user , function (err , raw) {
					if(err){
						return handleServerError.handleServerError({status:"ERROR" , type:'SERVER_ERROR', message:err} , req , res);
					}
					else if(raw.n >= 1){
						res.status(HttpStatus.OK).send(JSON.stringify({status:"Success"}));
					}
					else{
						return handleServerError.handleServerError({status:"ERROR" , type:'SERVER_ERROR', message:"Unknown error occured"} , req , res);
					}
				});
			}
		});
	}
	else{
		return handleServerError.handleServerError({status:"ERROR" , type:'NOT_ADMIN' , message:"You are not authorized to access this feature"} , req , res);
	}
};

module.exports.importUsersList = function(req,res){
	if(req.user && req.user.admin && (req.user.admin === true || req.user.admin === "true")){
		fileUploadService.getFileData(req,res,function(err , data){
			if(err){
				return handleServerError.handleServerError({status:"ERROR" , type:'SERVER_ERROR', message:err} , req , res);
			}
			else{
				JobScheduler.scheduleCreateMulUserJob(/*"in 1 minutes"*/"now" , {data:data,scheduledBy:req.user.username,schedulerEmail:req.user.email},"Import_users_"+req.file.filename+"_"+req.params.reqFileType+"_"+req.user.username+"_"+Date.now() , function(err,job){
					var result = {};
					if(err){
						result.status = "FAILURE";
						result.reason = err;
					}
					else{
						result.status = "SCHEDULE-SUCCESS";
						result.jobName = job.attrs.name;

						job.attrs.status = "SCHEDULED";
						job.save(function(err){
							if(err){
								return handleServerError.handleServerError({status:"ERROR" , type:'SERVER_ERROR', message:err} , req , res);
							}
							fileUploadService.removeTempFile(req.file.path,req.file.originalname);
							res.status(HttpStatus.OK).json(JSON.stringify(result));
						});
					}
				});
			}
		});
	}
	else{
		return handleServerError.handleServerError({status:"ERROR" , type:'NOT_ADMIN' , message:"You are not authorized to access this feature"} , req , res);
	}
};

module.exports.html2pdf = function(req,res){
	if(req.user && req.user.admin && (req.user.admin === true || req.user.admin === "true")){
		res.setHeader('Content-Type', 'application/pdf');
		res.setHeader('Content-Disposition', 'attachment; filename=users_account_list.pdf');
		var options = {
			"format": "Letter",
			"orientation": "landscape",
			"border": {
				"top": "1in",           
				"right": "0.5in",
				"bottom": "1in",
				"left": "0.5in"
			}
		};
		
		pdf.create(JSON.parse(req.body.html2pdfData),options).toBuffer(function(err, buffer) {
			if (err) {
				return handleServerError.handleServerError({status:"ERROR" , type:'SERVER_ERROR', message:err} , req , res);
			}				
			res.status(HttpStatus.OK).send(new Buffer(buffer, 'binary'));
		});
	}
	else{
		return handleServerError.handleServerError({status:"ERROR" , type:'NOT_ADMIN' , message:"You are not authorized to access this feature"} , req , res);
	}
};