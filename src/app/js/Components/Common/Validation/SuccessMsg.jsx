import React from "react";

function SuccessMsg(props) {
	const msg = props.successMsg;
	if (msg !== "" && msg !== " " && msg !== undefined) {
		return (
			<div className="field form-group">
				<div className="col-lg-12 col-md-12 col-sm-12">
					<span className="text-success" key={Math.random() * Date.now()}>{msg}</span>
				</div>
			</div>
		);
	}
	return null;
}

export default SuccessMsg;
