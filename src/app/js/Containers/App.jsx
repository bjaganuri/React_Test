import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, browserHistory, IndexRoute } from "react-router";
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';

import "bootstrap/dist/css/bootstrap.css";
import "../../css/index.css";

//Layout specific components
import Root from "./Root";
import AuthenticateUser from "../Components/Common/Layout/AuthenticateUser";
import AuthorizedUser from "../Components/Common/Layout/AuthorizedUser";
 
//User Authentication Related Components
import SignIn from "./UserAuthentication/SignIn";
import SignUp from "./UserAuthentication/SignUp";
import SetPassword from "./UserAuthentication/SetPassword";

//Components to load once the user has been authenticated successfully
import Home from "../Components/Home";

//Invalid resource request component
import ResourceNotFound from "../Components/Common/Validation/ResourceNotFound";

import store from "../store";

const history = syncHistoryWithStore(browserHistory, store)

class App extends React.Component {
	render() {
		return (
			<Router history={history}>
				<Route path={"/"} component={Root}>
					<Route path={"authenticate"} component={AuthenticateUser}>
						<Route path={"login"} component={SignIn} />
						<Route path={"signup"} component={SignUp} />
						<Route path={"resetpassword"} component={SetPassword} />
					</Route>
					<Route path={"authorized"} component={AuthorizedUser}>
						<Route path={"home"} component={Home} />
					</Route>
				</Route>
				<Route path="*" component={ResourceNotFound} />
			</Router>
		);
	}
}

export default App;