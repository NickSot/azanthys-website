const fs = require('fs');

// response function
const respond = (response, statusCode, contentType, content) => {
	response.statusCode = statusCode;
	response.setHeader('Content-Type', contentType);
	response.end(content);
}

// HTTP service endpoints
const resource = (response, resourcePath, contentType, securityCallback = true, redirect=false) => {
	fs.readFile("./" + resourcePath, (error, result) => {
		if (error) {
			console.log(error);
			respond(response, 500, 'text/plain', 'Internal Server Error!');
		}
		else if (!securityCallback) {
			respond(response, 403, contentType, 'Not autorized!');
		}
		else if (redirect) {
			respond(response, 302, contentType, result);
		}
		else {
			respond(response, 200, contentType, result);
		}
	});
}

// post request handling
const post = (response, resourcePath, contentType, responseContent, content, append = false) => {
	if (append) {
		fs.appendFile('./' + resourcePath, content, 'utf8', () => {
			resource(response, responseContent, contentType, true, false);
		});
	}
	else {
		fs.writeFile('./' + resourcePath, content, 'utf8', () => {
			resource(response, responseContent, contentType, true, false);
		});
	}
}

const notFound = (response) => {
	respond(response, 404, 'text/plain', 'Not Found!');
}

module.exports = {resource, notFound, respond, post};