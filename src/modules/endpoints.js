const fs = require('fs');

// response function
const respond = (response, statusCode, contentType, content) => {
	response.statusCode = statusCode;
	response.setHeader('Content-Type', contentType);
	response.end(content);
}

// HTTP service endpoints
const resource = (response, resourcePath, contentType) => {
	let resource = fs.readFile("./" + resourcePath, (error, result) => {
		if (error) {
			console.log(error);
			respond(response, 500, 'text/plain', 'Internal Server Error!');
		} else {
			respond(response, 200, contentType, result);
		}
	});
}

const notFound = (response) => {
	respond(response, 404, 'text/plain', 'Not Found!');
}

module.exports = {resource, notFound};