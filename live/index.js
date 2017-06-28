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
var sessionID = 'session_1'

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

	// clear out the log! (DEMO only)
	ref(`history/${sessionID}/meta`).set(null)

	var oscServer = new osc.Server(settings.port, settings.receiver_ip);
	oscServer.on('/now_playing', function (msg, rinfo) {
		if (msg && msg.length >= 1 && msg[1] != '' && msg[1] != '<empty>') {
			var trackname = msg[1];
			var timestamp = new Date().getTime()
			ref(`history/${sessionID}/meta/${timestamp}`).set({trackname: trackname})
		}

	});

	var client = new osc.Client(settings.sender_ip, settings.port);
	var averageEnergy = 0
	var targetEnergy = 0;
	setInterval(function() {
		averageEnergy *= 0.76;
		if(averageEnergy < 0) {
			averageEnergy = 0;
		}
		client.send('/session', averageEnergy, function () {
		});
		// console.log(averageEnergy);
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
			port: obj.port,
			network_name: obj.network_name,
			session_name: obj.session_name,
			sender_ip: obj.sender_ip,
			receiver_ip: obj.receiver_ip,
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



