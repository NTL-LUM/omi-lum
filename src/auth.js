import db from './db'
import store from './store'
import firebase from 'firebase'

export default {
	signout() {
		store.commit('authProfile', null)
		firebase.auth().signOut().then(() => {
			document.location = '/'
		})
	},
	init() {
		return new Promise((resolve, reject) => {
			
			firebase.auth().onAuthStateChanged(function(user) {

				if (user) {
					db.ref(`/users/${user.uid}`).once('value', (snap) => {

						// get the profile - this is null when the user first signs up
						var profile = snap.val() ? snap.val() : {};

						// a basic profile - spread the database values,
						// but fix the core, photo, email, name from google
						var payload = {
							...profile,
							uid: user.uid,
							photoURL: user.photoURL,
							email: user.email,
							displayName: user.displayName
						}

						// var amOnline = new Firebase('https://<demo>.firebaseio.com/.info/connected');
						var userRef = db.ref('presence/' + user.uid);
						userRef.set(true);
						userRef.onDisconnect().set(false);

						// on dis we need to remove the user from the session
            			var sessionID = 'session_1' // hard-coded for now but later dynamic...
            			db.ref(`sessions/${sessionID}/${user.uid}`).onDisconnect().set(null)

            			// and when the window blurs
            			window.addEventListener('blur', function() {
	            			db.ref(`sessions/${sessionID}/${user.uid}`).set(null)
						})


						// amOnline.on('value', function(snapshot) {
						// if (snapshot.val()) {
						// }
						// });

						// update the record with for this user
						snap.ref.update(payload).then(() => {
							store.commit('authProfile', payload)
							resolve(payload);
						})
					})
				} else {
					resolve(null)
				}
			})
		})
	}

}