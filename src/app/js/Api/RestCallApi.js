export function CallRest (configObj){
	return 	$.ajax({
		url: configObj.url,
		method: configObj.method || "POST",
		dataType: configObj.dataType || "json",
		data: configObj.data || {}
	}).then(function(response, status, xhrSuccess) {
		return {
			data: response,
			callStatus: status,
			statusCode: xhrSuccess.status,
			readyState: xhrSuccess.readyState,
			responseJSON: xhrSuccess.responseJSON,
			statusText: xhrSuccess.statusText
		};
	}, function (xhrError, status, response) {
		return {
			data: xhrError.responseJSON || response,
			callStatus: status,
			statusCode: xhrError.status,
			readyState: xhrError.readyState,
			responseJSON: xhrError.responseJSON,
			statusText: xhrError.statusText
		};
	});
}