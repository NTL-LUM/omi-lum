require('dotenv').config()
var SpotifyWebApi = require('spotify-web-api-node');
var admin = require('firebase-admin');
var serviceAccount = require('./omi-lum-firebase-adminsdk-0d7kn-cb4b11534e.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: process.env.FIREBASE_DATABASE_URL
});

module.exports = function(app) {
	
	var spotifyRef = function(req) {
		var redirectURL = req.protocol + '://' + req.get('host');
		return new SpotifyWebApi({
			clientId : process.env.SPOTIFY_CLIENT_ID,
			clientSecret : process.env.SPOTIFY_CLIENT_SECRET,
			redirectUri : redirectURL+'/callback/'
			//process.env.SPOTIFY_REDIRECT_URI
		});
	}

	app.get('/auth', function(req, res, next) {
		var scopes = ['user-read-private', 'user-read-recently-played', 'user-top-read', 'user-read-email']
		var state = req.query.state
		var authorizeURL = spotifyRef(req).createAuthorizeURL(scopes, state);
		return res.redirect(authorizeURL)
	})

	app.get('/callback', function(req, res, next) {
		if (req.query.code) {
			var code = req.query.code
			var spotify = spotifyRef(req)

			spotify.authorizationCodeGrant(code).then(function(data) {

				spotify.setAccessToken(data.body['access_token']);
				spotify.setRefreshToken(data.body['refresh_token']);

				spotify.getMe().then(function(data) {
					var uid = data.body.id;
					console.log('uid', uid);
					admin.auth().createCustomToken(uid).then(function(customToken) {
						// Send token back to client
						var userPayload = {
							uid: uid,
							email: data.body.email,
							displayName: data.body.display_name,
							photoURL: data.body.images ? data.body.images[0].url : null
						}

						// get the user if they exist
						admin.auth().getUser(uid).then(function(userRecord) {
							admin.auth().updateUser(uid, userPayload).then(() => {
								return res.redirect('/spotify?access_token='+customToken)
							})
						}).catch(() => {
							console.log('no user found');
							admin.auth().createUser(userPayload).then(() => {
								console.log(customToken);
								return res.redirect('/spotify?access_token='+customToken)
							})
						})

						// admin.auth().createUser(userPayload).then(() => {
						// 	console.log(customToken);
						// 	return res.redirect('/?access_token='+customToken)
						// })
						/*admin.auth().updateUser(uid, userPayload).then(() => {
							return res.redirect('/?access_token='+customToken)
						})*/

					}).catch(function(error) {
						console.log("Error creating custom token:", error);
					});
				}, function(err) {
					return res.redirect('/?error=Error-reading-spotify-user')
				});

			}, function(err) {
				return res.redirect('/?error='+err);
			});
		} else {
			return res.redirect('/')		
		}
	})
}