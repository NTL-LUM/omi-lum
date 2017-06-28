import Vue from 'vue'
import firebase from 'firebase'
import auth from '../auth'
import Router from 'vue-router'
import IndexPage from '@/pages/IndexPage'
import SessionPage from '@/pages/SessionPage'

Vue.use(Router)

const loginWithGoogle = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/plus.login');
    provider.addScope('profile');
    provider.addScope('email');
    firebase.auth().signInWithRedirect(provider);
}

const loginWithSpotifyToken = (token) => {
	return new Promise((resolve, reject) => {
		firebase.auth().signInWithCustomToken(token).then((user) => {
			resolve(user);
		})
	})
}

export default new Router({
	mode: 'history',
	base: '/',
	linkActiveClass: 'is-active',
	routes: [
    	{
			path: '/',
			name: 'index',
			component: IndexPage
    	},
    	{
			path: '/session',
			name: 'session',
			component: SessionPage
    	},
    	{
    		path: '/spotify',
    		component: IndexPage,
			beforeEnter: (to, from, next) => {
				var token = to.query.access_token
				if (token) {
					loginWithSpotifyToken(token).then((user) => {
						next('/')
					})
				} else {
					next('/')
				}
			}
    	},
    	{
			path: '/logout',
			name: 'logout',
			component: IndexPage,
			beforeEnter: (to, from, next) => {
				auth.signout()
			}
    	}
  	]
})
