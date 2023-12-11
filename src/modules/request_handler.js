endpoints =  require('./endpoints.js');

// request handler function
const handleRequest = (request, response) => {
	if (request.method == "GET") {
		switch (request.url) {
			// resources
			case '/static/styles.css':
				endpoints.resource(response, './static/styles.css', 'text/css');
				break;
			case '/static/logo.png':
				endpoints.resource(response, './static/logo.png', 'image/png');
				break;
			case '/static/ivo.jpg':
				endpoints.resource(response, './static/ivo.jpg', 'image/jpg');
				break;
			case '/static/mitko.jpg':
				endpoints.resource(response, './static/mitko.jpg', 'image/jpg');
				break;
			case '/static/nedi.jpg':
				endpoints.resource(response, './static/nedi.jpg', 'image/jpg');
				break;
			case '/static/yasen.jpg':
				endpoints.resource(response, './static/yasen.jpg', 'image/jpg');
				break;
			case '/static/pesho.jpg':
				endpoints.resource(response, './static/pesho.jpg', 'image/jpg');
				break;

			// pages
			case '/':
				endpoints.resource(response, './static/index.html', 'text/html');
				break;			
			case '/about':
				endpoints.resource(response, './static/about.html', 'text/html');
				break;
			case '/shop':
				endpoints.resource(response, './static/shop.html', 'text/html');
				break;
			default:
				endpoints.notFound(response);
		}
	} else {
		notFound(response);
	}
}

module.exports = handleRequest;