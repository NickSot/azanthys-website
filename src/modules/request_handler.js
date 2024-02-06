const endpoints =  require('./endpoints.js');
const cryptography = require('./cryptography.js');

let stamps = []
// let allowed_hosts = []

// request handler function
const handleRequest = (request, response) => {
	if (request.method == "GET") {
		switch (request.url.split('?')[0]) {
			// resources
			case '/static/styles.css':
				endpoints.resource(response, './static/styles.css', 'text/css');
				break;
			case '/static/crypto.js':
				endpoints.resource(response, './static/scripts/crypto.js', 'text/javascript');
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
			case '/admin':
				let query = request.url.split('?');
				query = decodeURI(query);

				if (!request.url.split('?')[1]) {
					endpoints.resource(response, './static/admin.html', 'text/html');
				}
				else {
					let password = query.split('=')[1];

					if (!password) {
						endpoints.respond(response, 200, 'text/plain', 'http://127.0.0.1:5000/admin');
					}
					else {
						let queryObject = {"p": decodeURI(password)};
						let url = `http://127.0.0.1:5000/cms?password=${JSON.stringify(queryObject)}`;
						
						endpoints.respond(response, 200, 'text/plain', url);
					}
				}

				break;

			case '/cms':
				let getPass = () => {
					if (request.url.split('?').length < 2) {
						return false;
					}

					let query = request.url.split('?')[1].split('=');
					if (query[0] != 'password') {
						return false;
					}

					try{
						query = query.filter(x => !(x == 'password'));
						query = decodeURI(query);
						query = JSON.parse(query)['p'];
					}
					catch(error) {
						return false;
					}

					let password = 'the_exodus';

					try {
						query = JSON.parse("[" + query + "]");
					}
					catch(error) {
						return false;
					}
					
					try{
						query = cryptography.decrypt(query, cryptography.key);
					}
					catch(error) {
						return false;
					}

					if (query.length < password + 7) {
						return false;
					}

					for (let i = 0; i < password.length; i++) {
						if (password[i] != query[i + 7]) {
							return false;
						}
					}

					let stamp = query.substring(0, 6);

					if (stamps.includes(stamp)) {
						return false;
					}

					stamps.push(stamp);
					response.setHeader('Set-Cookie', 'allowed=true');

					return true;
				};

				let allowed = false;
				console.log(request.headers);
				
				if (request.headers['cookie'])
					console.log(parseCookies(request.headers['cookie']));

				if (request.headers['cookie'] && parseCookies(request.headers['cookie'])['allowed'] == 'true') {
					allowed = true;
				}
				else {
					allowed = getPass();
				}

				endpoints.resource(response, './static/cms.html', 'text/html', allowed);

				break;

			default:
				endpoints.notFound(response);
		}
	}

	// ip spoofing??
	// else if (request.method == 'POST' && allowed_hosts.includes(request.headers['host'])) {
	else if (request.method == 'POST' && (request.headers['cookies'] && parseCookies(request.headers['cookies'])['allowed'] == 'true')) {
		switch (request.url) {
			case '/static/band.txt':
				request.on('data', (data) => {
					data = getRequestBodyElement('bandBio', data);
					
					endpoints.post(response, './static/meta/band.txt', 'text/html', '/static/cms.html', data);
				});

				break;

			case '/static/nedi.txt':
				request.on('data', (data) => {
					data = getRequestBodyElement('nediBio', data);

					endpoints.post(response, './static/meta/nedi.txt', 'text/html', '/static/cms.html', data);
				});

				break;

			case '/static/mitko.txt':
				request.on('data', (data) => {
					data = getRequestBodyElement('mitkoBio', data);

					endpoints.post(response, './static/meta/mitko.txt', 'text/html', '/static/cms.html', data);
				});

				break;

			case '/static/ivo.txt':
				request.on('data', (data) => {
					data = getRequestBodyElement('ivoBio', data);

					endpoints.post(response, './static/meta/ivo.txt', 'text/html', '/static/cms.html', data);
				});

				break;
			
			case '/static/yasen.txt':
				request.on('data', (data) => {
					data = getRequestBodyElement('yasenBio', data);

					endpoints.post(response, './static/meta/yasen.txt', 'text/html', '/static/cms.html', data);
				});

				break;

			case '/static/pesho.txt':
				request.on('data', (data) => {
					data = getRequestBodyElement('peshoBio', data);

					endpoints.post(response, './static/meta/pesho.txt', 'text/html', '/static/cms.html', data);
				});

				break;

			case '/static/single_url.txt':
				request.on('data', (data) => {
					data = getRequestBodyElement('singleLink', data);
					
					endpoints.post(response, './static/meta/single_url.txt', 'text/html', '/static/cms.html', data);
				});

				break;

			case '/static/gig_dates.txt':
				let gigs = '';

				request.on('data', (data) => {
					let parsedData = parseRequestBody(data);

					for (let i = 1; ; i++) {
						if (!parsedData[`date-${i}`]) {
							break;
						}

						try{
							gigs += `<li> ${parsedData[`date-${i}`]} ${parsedData[`eventTitle-${i}`]} [<a href="${parsedData[`eventlink-${i}`]}">Event Link</a>] </li>\n`;
						}
						catch(error) {
							break;
						}
					}
				});

				request.on('end', () => {
					endpoints.post(response, './static/meta/gig_dates.txt', 'text/html', '/static/cms.html', gigs, true);
				})

				break;

			default:
				endpoints.notFound(response);
		}
	}
	else {
		endpoints.notFound(response)
	}
}

function parseRequestBody(data) {
	// find the correct element in the body (one that contains the key == 'key')
	// data_element = data.toString().split('\n').filter(x => ((x.split('=')[0] == key )));

	let result = {}

	data.toString().split('\n').forEach(element => {
		
		let object = element.split('&');

		object.forEach(element => {
			result[element.split('=')[0]] = decodeURIComponent(element.split('=')[1].toString().replaceAll('+', ' '));
		});
	});

	return result;
}

function parseCookies(cookies) {
	let result = {};

	cookies.replace(/\s/g, '').split(';').forEach(cookie => {
		pair = cookie.split('=');
		
		if (pair.length != 2) {
			return;
		}

		result[pair[0]] = pair[1];
	});

	return result;
}

function getRequestBodyElement(key, data) {
	return parseRequestBody(data)[key]
}

function clearStamps() {
	stamps = [];
	// allowed_hosts = [];
}

module.exports = { handleRequest, clearStamps};