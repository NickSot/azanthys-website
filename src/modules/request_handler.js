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
			case '/static/spotify_logo.png':
				endpoints.resource(response, './static/spotify_logo.png', 'image/png');
				break;
			case '/static/yt-logo.png':
				endpoints.resource(response, './static/yt-logo.png', 'image/png');
				break;
			case '/static/apple_music_logo.png':
				endpoints.resource(response, './static/apple_music_logo.png', 'image/png');
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
			case '/static/ivo.txt':
				endpoints.resource(response, './static/ivo.txt', 'text/plain');
				break;
			case '/static/mitko.txt':
				endpoints.resource(response, './static/mitko.txt', 'text/plain');
				break;
			case '/static/nedi.txt':
				endpoints.resource(response, './static/nedi.txt', 'text/plain');
				break;
			case '/static/yasen.txt':
				endpoints.resource(response, './static/yasen.txt', 'text/plain');
				break;
			case '/static/pesho.txt':
				endpoints.resource(response, './static/pesho.txt', 'text/plain');
				break;
			case '/static/band.txt':
				endpoints.resource(response, './static/band.txt', 'text/plain');
				break;
			case '/static/gig_dates.txt':
				endpoints.resource(response, './static/gig_dates.txt', 'text/html');
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
			case '/cms':
				endpoints.resource(response, './static/cms.html', 'text/html');
				break;
			default:
				endpoints.notFound(response);
		}
	} else {
		notFound(response);
	}
}

module.exports = handleRequest;