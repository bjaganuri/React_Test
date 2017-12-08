import React from "react";

function ErrorMsg(props) {
	const errors = props.errors;
	if (errors.length === 0) {
		return null;
	}
	const errorsList = errors.map((error, idx) =>
		<span key={idx} className="text-danger">{error.msg || error}</span>
	);
	return (
		<div className="field form-group">
			<div className="col-lg-12 col-md-12 col-sm-12 errors">
				{errorsList}
			</div>
		</div>
	);
}

export default ErrorMsg;
