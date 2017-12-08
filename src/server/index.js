var express = require("express");
var expressValidator = require('express-validator');
var bodyParser = require("body-parser");
var app = express();
var HttpStatus = require('http-status-codes');
var path = require('path');

var Routes = require("./routes/main");
var AuthenticateUser = require("./source/user/user_authentication");
var HandleUserProfile = require("./source/user/handle_user_profile");
var Learn = require("./source/learn/learn");
var Design = require("./source/design/design");
var AdminOPS = require("./source/admin/admin_ops");
var fileUploadService = require('./source/common/file_upload');
var handleServerError = require("./source/common/error_handler");

app.use(express.static('dist'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../templates'));

app.get('/', Routes.index);

app.get('/header', Routes.header);

app.get('/brand', Routes.brand);

app.get('/banner', Routes.banner);

app.get('/horizontalMenu', Routes.horizontalMenu);

app.get('/VerticalMenu', Routes.VerticalMenu);

app.get('/footer', Routes.footer);

app.get('/login', Routes.login);

app.get('/signUp', Routes.signUp);

app.get('/forgotCredentials', Routes.forgotCredentials);

app.get("/userProfile" , ensureAuthenticated , Routes.userProfile);

app.get('/home', ensureAuthenticated , Routes.home);

app.get('/HTML', ensureAuthenticated , Routes.HTML);

app.get('/CSS', ensureAuthenticated , Routes.CSS);

app.get('/JS', ensureAuthenticated , Routes.JS);

app.get('/designElement', ensureAuthenticated , Routes.designElement);

app.get('/designComponent', ensureAuthenticated , Routes.designComponent);

app.get('/designLayout', ensureAuthenticated , Routes.designLayout);

app.get('/about', ensureAuthenticated , Routes.about);

app.get('/query', ensureAuthenticated , Routes.query);

app.get("/resourceNotFound" , Routes.resourceNotFound);

app.get("/styleAdd" , Routes.styleAdd);

app.get('/logout', Routes.logout);

app.get("/sessionData" , Routes.sessionData);

app.get("/getUserProfile" , ensureAuthenticated , HandleUserProfile.getUserProfile);

app.post("/signUp" , AuthenticateUser.signUp);

app.get("/checkUserChoiceAvailability" , AuthenticateUser.checkUserChoiceAvailability);

app.post('/login', AuthenticateUser.login);

app.get('/recoverUser' , AuthenticateUser.recoverUser);

app.post('/setNewPassword' , AuthenticateUser.setNewPassword);

app.post("/updateUserProfile" , ensureAuthenticated , HandleUserProfile.updateUserProfile);

app.get("/getIndexJson" , Learn.getIndexJson);

app.get("/cssprops" , Learn.cssprops);

app.get("/htmlElements" , Learn.htmlElements);

app.get('/fileExists' , ensureAuthenticated , fileUploadService.fileExists);

app.post("/uploadPSDFile/:reqFileType" , ensureAuthenticated , Design.uploadPSDFile); // to uploadfile

app.get("/rzSliderTpl.html" , Routes.rzSliderTpl)

// Admin operation
app.get("/viewUser" , ensureAuthenticated ,  Routes.viewUser);

app.get("/viewUserDetails/:username" , ensureAuthenticated , Routes.viewUserDetails);

app.get("/addNewUser" , ensureAuthenticated ,  Routes.addNewUser);

app.post("/getUserAccountsList" , ensureAuthenticated , AdminOPS.getUserAccountsList);

app.post("/manageAccountLock" , ensureAuthenticated , AdminOPS.manageLockAdminRight);

app.post("/importUsers/:reqFileType" , ensureAuthenticated ,  AdminOPS.importUsersList);

app.post("/html2pdf" , ensureAuthenticated ,  AdminOPS.html2pdf);

function ensureAuthenticated(req, res, next){
	var accountLocked = false;
	var lockedBy = "NA";
	var lockComments = "NA";
	if(req.user && req.user.opState && req.user.opState === "LOCKED"){
		lockedBy = req.user.lockedBy;
		lockComments = req.user.lockComments;
		lockUntil = req.user.lockUntil;
		accountLocked = true;
		req.logout();
		req.flash('success_msg', 'You are logged out');
	}
	if(req.isAuthenticated()){
		return next();
	} else {
		if(accountLocked && lockUntil && lockUntil > Date.now()){
			return handleServerError.handleServerError({status:"ERROR", type:'ACCOUNT_LOCK' , message:"Your account has been locked until "+ (new Date(lockUntil)) +" due to " + lockComments + " to unlock immidiately pls contact admin."} , req , res);
		}
		else if(accountLocked){
			return handleServerError.handleServerError({status:"ERROR" , type:'ACCOUNT_LOCK' , message:"Your account has been locked permanently by "+ lockedBy +" with " + lockComments + " as comments pls contact admin to unlock your account."} , req , res);
		}
		else{
			return handleServerError.handleServerError({status:"ERROR" , type:'LOGIN_REQ' , message:"Login required"} , req , res);
		}
	}
}

module.exports = app;