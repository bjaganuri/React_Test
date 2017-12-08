import React from "react";
import ReactDOM from "react-dom";

import Header from "./Header";
import VerticalMenu from "./VerticalMenu";
import Footer from "./Footer";

export default class AuthorizedUser extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return(
			<div className="contentWrapper col-ld-12 col-md-12 col-sm-12">
				<header className="row">
					<div className="col-lg-12 col-md-12 col-sm-12">
						<Header />
					</div>
				</header>
				<section className="row">
					<div className="col-lg-2 col-md-4 col-sm-12 text-primary">
						<VerticalMenu />
					</div>
					<div className="col-lg-10 col-md-8 col-sm-12">
						{this.props.children}
					</div>
				</section>
				<footer className="row">
					<div className="col-lg-12 col-md-12 col-sm-12">
						<Footer />
					</div>
				</footer>
			</div>		
		);
	}
}