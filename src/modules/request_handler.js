endpoints =  require('./endpoints.js');

// request handler function
const handleRequest = (request, response) => {
	if (request.method == "GET") {
		switch (request.url) {
			case '/':
				endpoints.resource(response, './static/index.html', 'text/html');
				break;
			case '/static/styles.css':
				endpoints.resource(response, './static/styles.css', 'text/css');
				break;
			case '/static/logo.png':
				endpoints.resource(response, './static/logo.png', 'image/png');
				break;
			default:
				endpoints.notFound(response);
		}
	} else {
		notFound(response);
	}
}

module.exports = handleRequest;