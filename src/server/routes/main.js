module.exports.index = function(req,res){
	res.render("pages/index");
};

module.exports.header = function (req, res) {
	if(req.user)
		res.render("partials/main/header",{UserName:req.user.name,admin:req.user.admin});
	else
		res.send(undefined);
};

module.exports.brand = function (req, res) {
	if(req.user)
		res.render("partials/main/brand",{UserName:req.user.name});	
	else
		res.send(undefined);
};

module.exports.banner = function (req, res) {
	if(req.user)
	    res.render("partials/main/banner");	
	else
		res.send(undefined);
};

module.exports.horizontalMenu = function (req, res) {
	if(req.user)
	    res.render("partials/main/horozontal_menu",{admin:req.user.admin});
	else
		res.send(undefined);
};

module.exports.VerticalMenu = function (req, res) {
	if(req.user)
		res.render("partials/main/vertical_menu", {admin:req.user.admin});
	else
		res.send(undefined);
};

module.exports.footer = function (req, res) {
	if(req.user)
		res.render("partials/main/footer");
	else
		res.send(undefined);
};

module.exports.login = function (req, res) {
    res.render("pages/user/login" , {redirectToLogin:false});
};

module.exports.signUp = function (req, res) {
    res.render("pages/user/register");
};

module.exports.forgotCredentials = function (req, res) {
    res.render("pages/user/forgot_credentials");
};

module.exports.logout = function (req, res) {
    req.logout();
	req.flash('success_msg', 'You are logged out');
	res.render('pages/user/logout');
};

module.exports.sessionData = function (req, res) {
	if(req.session && req.session.passport && req.session.passport.user != undefined)
	    res.send({status:"AUTHORIZED", user:{username: req.user.username , name: req.user.name, email: req.user.email} });
	else
		res.send({status:"UNAUTHORIZED" , user: {}})
};

module.exports.userProfile = function (req, res) {
    res.render("pages/user/profile");
};

module.exports.home = function (req, res) {
    res.render("pages/home");
};

module.exports.HTML = function (req, res) {
    res.render("pages/learn/html");
};

module.exports.CSS = function (req, res) {
    res.render("pages/learn/css");
};

module.exports.JS = function (req, res) {
    res.render("pages/learn/javascript");
};

module.exports.designElement = function (req, res) {
    res.render("pages/design/design_element");
};

module.exports.designComponent = function (req, res) {
    res.render("pages/design/design_component");
};

module.exports.designLayout = function (req, res) {
    res.render("pages/design/design_layout");
};

module.exports.about = function (req, res) {
    res.render("pages/about");
};

module.exports.query = function (req, res) {
    res.render("pages/query");
};

module.exports.resourceNotFound = function (req, res) {
    res.render("partials/main/resource_not_found",{loggenIn:req.user});
};

module.exports.styleAdd = function (req, res) {
    res.render("pages/design/style_add") ;
};

//Admin operation
module.exports.viewUser = function(req,res){
	var admin = false;
	if(req.user && req.user.admin)
		admin=true
	res.render("pages/admin/view_user",{admin:admin});
}

module.exports.viewUserDetails = function(req,res){
	if(req.user && req.user.admin){
		res.render("pages/admin/view_user_details",{admin:true});
	}
	else{
		res.render("pages/admin/view_user_details",{admin:false});	
	}
}

module.exports.addNewUser = function(req,res){
	var admin = false;
	if(req.user && req.user.admin)
		admin=true
	res.render("pages/admin/add_new_user",{admin:admin});
}

module.exports.rzSliderTpl =  function (req,res) {
	res.render("pages/design/rzSlider");
}