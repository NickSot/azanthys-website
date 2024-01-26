endpoints =  require('./endpoints.js');
cryptography = require('./cryptography.js');

// request handler function
const handleRequest = (request, response) => {
	if (request.method == "GET") {
		switch (request.url) {
			// resources
			case '/static/styles.css':
				endpoints.resource(response, './static/styles.css', 'text/css');
				break;
			case '/static/logo.png':
				endpoints.resource(response, './static/images/logo.png', 'image/png');
				break;
			case '/static/spotify_logo.png':
				endpoints.resource(response, './static/images/spotify_logo.png', 'image/png');
				break;
			case '/static/yt-logo.png':
				endpoints.resource(response, './static/images/yt-logo.png', 'image/png');
				break;
			case '/static/apple_music_logo.png':
				endpoints.resource(response, './static/images/apple_music_logo.png', 'image/png');
				break;
			case '/static/ivo.jpg':
				endpoints.resource(response, './static/images/ivo.jpg', 'image/jpg');
				break;
			case '/static/mitko.jpg':
				endpoints.resource(response, './static/images/mitko.jpg', 'image/jpg');
				break;
			case '/static/nedi.jpg':
				endpoints.resource(response, './static/images/nedi.jpg', 'image/jpg');
				break;
			case '/static/yasen.jpg':
				endpoints.resource(response, './static/images/yasen.jpg', 'image/jpg');
				break;
			case '/static/pesho.jpg':
				endpoints.resource(response, './static/images/pesho.jpg', 'image/jpg');
				break;
			case '/static/ivo.txt':
				endpoints.resource(response, './static/meta/ivo.txt', 'text/plain');
				break;
			case '/static/mitko.txt':
				endpoints.resource(response, './static/meta/mitko.txt', 'text/plain');
				break;
			case '/static/nedi.txt':
				endpoints.resource(response, './static/meta/nedi.txt', 'text/plain');
				break;
			case '/static/yasen.txt':
				endpoints.resource(response, './static/meta/yasen.txt', 'text/plain');
				break;
			case '/static/pesho.txt':
				endpoints.resource(response, './static/meta/pesho.txt', 'text/plain');
				break;
			case '/static/band.txt':
				endpoints.resource(response, './static/meta/band.txt', 'text/plain');
				break;
			case '/static/gig_dates.txt':
				endpoints.resource(response, './static/meta/gig_dates.txt', 'text/html');
				break;
			case '/static/single_url.txt':
				endpoints.resource(response, './static/meta/single_url.txt', 'text/html');
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
				endpoints.resource(response, './static/cms.html', 'text/html', () => {
					let query = request.query['password'];
					cryptography.decrypt(query, cryptography.key);
					
					let password = 'the exodus to our escape';

					for (let i = 0; i < password.length; i++) {
						if (password[i] != query[i]) {
							return false;
						}
					}

					return true;
				});

				break;
			default:
				endpoints.notFound(response);
		}
	} else {
		notFound(response);
	}
}

module.exports = handleRequest;