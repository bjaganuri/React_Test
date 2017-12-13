import React from "react";
import { connect } from "react-redux";
import { Control, Form, actions, Errors } from "react-redux-form";
import { Link } from "react-router";

import { SignInAction } from "../../Actions/UserAuthenticationActions";
import ErrorMsg from "../../Components/Common/Validation/ErrorMsg";
import SuccessMsg from "../../Components/Common/Validation/SuccessMsg";

class SignIn extends React.Component {
	constructor (props){
		super (props);
		this.execSignin = this.execSignin.bind(this);
	}
	componentWillMount (){
		this.props.dispatch({
			type: 'resetForm',
			payload: {
				modelname: 'signInStore'
			}
		});
	}
	execSignin (data){
		this.props.dispatch(SignInAction(data))	
	}
	render() {
		const panel = {
			padding: "0px",
			margin: "25px"
		};

		const required = val => val && val.length;
		const maxLength = len => val => val.length <= len;
		const minLength = len => val => val.length >= len;

		return (
			<div className="formContainer">
				<Form model="signInStore" hideNativeErrors onSubmit={this.execSignin} className="form-horizontal">
					<div className="field form-group">
						<label className="col-lg-12 col-md-12 col-sm-12 text-left">
							<h3 className="m-b-0 m-t-0"> Login or <Link to="/authenticate/signup" className="react-route-link">Register</Link></h3>
						</label>
					</div>
					<ErrorMsg errors={this.props.signInProps.failureMsgs} />
					<SuccessMsg successMsg={this.props.signInProps.successMsg} />
					<div className="field form-group">
						<div className="col-lg-12 col-md-12 col-sm-12 has-feedback">
							<Control.text
								model=".username"
								id=".username"
								placeholder="Username"
								className="form-control"
								validators={{
									required,
									maxLength: maxLength(15),
									minLength: minLength(5)
								}}
								validateOn="blur"
							/>
							<Errors
								className="errors text-danger"
								model=".username"
								show="touched"
								messages={{
									required: "Username is required",
									minLength: "Username should have min 5 characters",
									maxLength: "Username can have only 15 max characters"
								}}
							/>
						</div>
					</div>
					<div className="field form-group">
						<div className="col-lg-12 col-md-12 col-sm-12 has-feedback">
							<Control.password
								model=".password"
								id=".password"
								placeholder="Password"
								className="form-control"
								validators={{
									required
								}}
								validateOn="blur"
							/>
							<Errors
								className="errors text-danger"
								model=".password"
								show="touched"
								messages={{
									required: "Password is required"
								}}
							/>
						</div>
					</div>
					<div className="field form-group">
						<div className="col-lg-12 col-md-12 col-sm-12 has-feedback">
							<button type="submit" className="btn col-lg-12 col-md-12 col-sm-12 btn-submit btn-block">Sign In</button>
						</div>
					</div>
					<div className="field form-group">
						<div className=" col-lg-6 col-md-6 col-sm-6 has-feedback text-left">
							<Link to={"/authenticate/resetpassword"} className="react-route-link">Forgot Password</Link>
						</div>
					</div>
				</Form>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	signInProps: state.signInStore
});

export default connect(mapStateToProps)(SignIn);