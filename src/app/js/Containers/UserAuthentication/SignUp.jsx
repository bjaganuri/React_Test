import React from "react";
import { connect } from "react-redux";
import { Control, Form, actions, Errors } from "react-redux-form";
import { Link } from "react-router";

import { SignUpAction } from "../../Actions/UserAuthenticationActions";
import ErrorMsg from "../../Components/Common/Validation/ErrorMsg";
import SuccessMsg from "../../Components/Common/Validation/SuccessMsg";

class SignUp extends React.Component {
	constructor (props) {
		super(props);		
		this.execSignup = this.execSignup.bind(this);
	}
	componentWillMount (){
		this.props.dispatch({
			type: 'resetForm',
			payload: {
				modelname: 'signUpStore'
			}
		});
	}
	execSignup(data) {
		this.props.dispatch(SignUpAction(data));
	}
	render() {
		const panel = {
			padding: "0px",
			margin: "25px"
		};
		const required = val => val && val.length;
		const maxLength = len => val => val.length <= len;
		const minLength = len => val => val.length >= len;
		const isEmail = val => !isEmail(val);

		const pwmatch = ({ password, cpassword }) => {
			if(password === cpassword){
				return true;
			}
			return false;
		}

		const asyncCheckAvailability = query => new Promise((resolve, reject) => {
			$.ajax({
				url: "https://design-spa-amd.herokuapp.com/users/checkUserChoiceAvailability?"+query,
				method: "GET",
				dataType: "json",
				success(response) {
					resolve({ available: response.status });
				},
				error(xhr, status, err) {
					reject(err);
				}
			});
		});

		return (
			<div className="formContainer loginForm">
				<Form 
					model="signUpStore" 
					hideNativeErrors onSubmit={this.execSignup} 
					className="form-horizontal"
					validators={{
						'':{pwmatch}
					}}
					validateOn="change"
				>
					<div className="field form-group">
						<label className="col-lg-12 col-md-12 col-sm-12">
							<h3 className="m-b-0 m-t-0">Register</h3>
						</label>
					</div>
					<ErrorMsg errors={this.props.signUpProps.failureMsgs} />
					<SuccessMsg successMsg={this.props.signUpProps.successMsg} />
					<div className="field form-group">
						<div className="col-lg-12 col-md-12 col-sm-12 has-feedback">
							<Control.text
								model=".name"
								id=".name"
								placeholder="Your Name"
								className="form-control"
								validators={{
									required,
									maxLength: maxLength(100),
									minLength: minLength(5)
								}}
								validateOn="blur"
							/>
							<Errors
								className="errors text-danger"
								model=".name"
								show="touched"
								messages={{
									required: "name is required",
									minLength: "name should have min 5 characters",
									maxLength: "name can have only 100 max characters"
								}}
							/>
						</div>
					</div>
					<div className="field form-group">
						<div className="col-lg-12 col-md-12 col-sm-12 has-feedback">
							<Control.select
								model=".gender"
								id=".gender"
								placeholder="Select gender"
								className="form-control"
									validators={{
									required
								}}
							>
								<option />
								<option value="Male">Male</option>
								<option value="Female">Female</option>
							</Control.select>
							<Errors
								className="errors text-danger"
								model=".gender"
								show="touched"
								messages={{
									required: "Gender is required"
								}}
						/>
						</div>
					</div>
					<div className="field form-group">
						<div className="col-lg-12 col-md-12 col-sm-12 has-feedback">
							<Control.text
								model=".email"
								id=".email"
								placeholder="Your Email"
								className="form-control"
								validators={{
									required,
									validEmail: val => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(val)
								}}
								asyncValidators={{
									available: (val, done) => asyncCheckAvailability("email="+val).then((res) => {
										done(!res.available);
									})
								}}
								asyncValidateOn="blur"
							/>
							<Errors
								className="errors text-danger"
								model=".email"
								show="touched"
								messages={{
									required: "Email is required",
									validEmail: "Please enter valid email id",
									available: "Email is in use"
								}}
							/>
						</div>
					</div>
					<div className="field form-group">
						<div className="col-lg-12 col-md-12 col-sm-12 has-feedback">
							<Control.text
								model=".mobile"
								id=".mobile"
								placeholder="Your Mobile number"
								className="form-control"
								validators={{
									required,
									validMobile: val => /^[0-9]{10}$/.test(val)
								}}
								validateOn="blur"
							/>
							<Errors
								className="errors text-danger"
								model=".mobile"
								show="touched"
								messages={{
									required: "Mobile is required",
									validMobile: "Please Enter valid mobile no."
								}}
							/>
						</div>
					</div>
					<div className="field form-group">
						<div className="col-lg-12 col-md-12 col-sm-12 has-feedback">
							<Control.text
								model=".username"
								id=".username"
								placeholder="Enter Username"
								className="form-control"
								validators={{
									required,
									maxLength: maxLength(15),
									minLength: minLength(5)
								}}
								asyncValidators={{
									available: (val, done) => asyncCheckAvailability("username="+val).then((res) => {
										done(!res.available);
									})
								}}
								asyncValidateOn="blur"
							/>
							<Errors
								className="errors text-danger"
								model=".username"
								show="touched"
								messages={{
									required: "Username is required",
									minLength: "Username should have min 5 characters",
									maxLength: "Username can have only 15 max characters",
									available: "Username is in use"
								}}
							/>
						</div>
					</div>
					<div className="field form-group">
						<div className="col-lg-12 col-md-12 col-sm-12 has-feedback">
								<Control.password
								model=".password"
								id=".password"
								placeholder="Enter password"
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
							<Control.password
								model=".cpassword"
								id=".cpassword"
								placeholder="Confirm Password"
								className="form-control"
								validators={{
									required,
									pwmatch
								}}
								validateOn="blur"
							/>
							<Errors
								className="errors text-danger"
								model=".cpassword"
								show="touched"
								messages={{
									required: "Confirm password"
								}}
							/>
							<Errors
								className="errors text-danger"
								model="signUpStore"
								show="touched"
								messages={{
									pwmatch: "Passwords do not match"
								}}
							/>
						</div>
					</div>
					<div className="field form-group">
						<div className="col-lg-12 col-md-12 col-sm-12 has-feedback">
							<button type="submit" className="btn col-lg-12 col-md-12 col-sm-12 btn-submit btn-block">Register</button>
						</div>
					</div>
				</Form>
			</div>

		);
	}
}

const mapStateToProps = state => ({
	signUpProps: state.signUpStore
});

export default connect(mapStateToProps)(SignUp);
