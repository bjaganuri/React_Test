import React from "react";
import { connect } from "react-redux";
import { Control, Form, actions, Errors } from "react-redux-form";
import { Link } from "react-router";

import { SetPasswordAuthAction } from "../../Actions/UserAuthenticationActions";
import ErrorMsg from "../../Components/Common/Validation/ErrorMsg";
import SuccessMsg from "../../Components/Common/Validation/SuccessMsg";

class SetPassword extends React.Component {
	constructor (props) {
		super(props);
		
		this.execSetpassword = this.execSetpassword.bind(this);
	}
	componentWillMount (){
		this.props.dispatch({
			type: 'resetForm',
			payload: {
				modelname: 'setPasswordStore'
			}
		});
	}
	execSetpassword(data) {
		this.props.dispatch(SetPasswordAuthAction(data));
	}
	render() {
		const panel = {
			padding: "0px",
			margin: "25px"
		};

		const pwmatch = ({ password, cpassword }) => {
			if(password === cpassword){
				return true;
			}
			return false;
		}

		const required = val => val && val.length;
		const isEmail = val => !isEmail(val);

		return (
			<div className="formContainer">
				<ErrorMsg errors={this.props.setPasswordProps.failureMsgs} />
				<SuccessMsg successMsg={this.props.setPasswordProps.successMsg} />
				<Form 
					model="setPasswordStore" 
					hideNativeErrors 
					onSubmit={this.execSetpassword} 
					className="form-horizontal"
					validators={{
						'':{pwmatch}
					}}
					validateOn="change"
				>
					<div className="field form-group">
						<label className="col-lg-12 col-md-12 col-sm-12">
							<h3 className="m-b-0 m-t-0">Set New Password</h3>
						</label>
					</div>
					{
						!this.props.setPasswordProps.authSuccess ? (
							<div>
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
											validateOn="blur"
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
							</div>

						) : (
							<div>
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
												pwmatch: val => true
											}}
											validateOn="blur"
										/>
										<Errors
											className="errors text-danger"
											model=".cpassword"
											show="touched"
											messages={{
											required: "Confirm your password",
												pwmatch: "Passwords do not match"
											}}
										/>
										<Errors
											className="errors text-danger"
											model="setPasswordStore"
											show="touched"
											messages={{
												pwmatch: "Passwords do not match"
											}}
										/>
									</div>
								</div>
							</div>

						)
					}
					<div className="field form-group">
						<div className="col-lg-12 col-md-12 col-sm-12 has-feedback">
							<button type="submit" className="btn col-lg-12 col-md-12 col-sm-12 btn-submit btn-block">Update Password</button>
						</div>
					</div>
				</Form>
			</div>

		);
	}
}

const mapStateToProps = state => ({
	setPasswordProps: state.setPasswordStore
});

export default connect(mapStateToProps)(SetPassword);