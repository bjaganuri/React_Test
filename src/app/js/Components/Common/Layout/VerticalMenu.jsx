import React from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router";

export default class VerticalMenu extends React.Component {
	render() {
		return (
			<div className="col-lg-3 col-md-6 col-sm-12" id="navBar">
				<nav className="navbar navbar-default">
					<button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navBar">
						<span className="icon-bar" />
						<span className="icon-bar" />
						<span className="icon-bar" />
					</button>
					<div className="collapse navbar-collapse" id="navBar" />
				</nav>
			</div>
		);
	}
}
