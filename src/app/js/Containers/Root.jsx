import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import {push, goBack, go} from 'react-router-redux';
import { ProgressBar } from "react-bootstrap";

class Root extends React.Component {
	constructor(props) {
		super(props);
		this.props.dispatch ({
			type: "getSessionData"
		});
	}
	render() {
		if(this.props.sessionData.sessionValidated === true){
			return (
				<div className="container">
					{this.props.children}
				</div>
			);
		}
		else {
			return (
				<div className="container">
					<ProgressBar active now={100} bsClass={"progress-bar active progress-bar-striped position-fixed hvCenter hvCenter-progress-bar"} label={"Loading... please wait!!"}/>
				</div>
			 );
		}
	}
}

const mapStateToProps = (state) => ({
	sessionData: state.sessionData,
	routing: state.routing
});

export default connect(mapStateToProps,null)(Root);