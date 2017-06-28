require('dotenv').config()
var env = process.env.NODE_ENV || 'production';
var fs = require('fs')
var path = require('path');
var express = require('express')
var app = express()
var jsonfile = require('jsonfile')
var osc = require('node-osc');
var settingsFile = __dirname + '/settings.json'
var fs = require('fs')
var port = process.env.PORT || 5000
var firebase = require('firebase-admin')
var serviceAccount = require('../omi-lum-firebase-adminsdk-0d7kn-cb4b11534e.json');

firebase.initializeApp({
	credential: firebase.credential.cert(serviceAccount),
	databaseURL: process.env.FIREBASE_DATABASE_URL
});

function ref(path) {
	return firebase.database().ref(`${process.env.APP_NAME}/${env}/${path}`)
}

// setup the OSC connection
// ------------------------------------------------------------------------
function setupOSC(settings) {
	var client = new osc.Client(settings.ip, settings.port);

	// there are 8 knobs

	// we have many users

	// bin the users by 8

	// avg the bin based on the number of users
	// and send that to add /sessions/{knob_num}/{value}
	var averageEnergy = 0
	var targetEnergy = 0;
	setInterval(function() {
		averageEnergy *= 0.76;
		client.send('/session', averageEnergy, function () {
		});
		console.log(averageEnergy);
	}, 100)


	ref('sessions/session_1').on('value', function(snap) {
		var data = snap.val()
		var avg = 0;
		var t = 0;
		for(var k in data) {
			t ++
			var energy = data[k].energy
			//console.log(`User ${k} -- ${energy}`);
			avg += energy
		}
		if(t > 0) {
			avg /= t
		}
		averageEnergy = avg
	})

	console.log('Setup OSC', settings);
}

// read in the settings file
// ------------------------------------------------------------------------
jsonfile.readFile(settingsFile, function(err, obj) {
	if (err) {
		console.log('There is an error in the settings.json file');
		return;
	}

	app.set('view engine', 'ejs')
	app.use(express.static(__dirname));
	app.get('*', function(req,res){
		var data = {
			ip: obj.ip, 
			port: obj.port,
			network_name: obj.network_name,
			session_name: obj.session_name
		}
		res.render(path.resolve(__dirname, 'app'), data);
	});
	app.listen(port, function() {
		console.log(`App running at http://localhost:${port}`);
	})

	// -------------------------------------
	setupOSC(obj)
	console.log('Settings', obj);
})



