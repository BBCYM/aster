import * as React from 'react'
import { GoogleSignin } from '@react-native-community/google-signin'
import { web } from '../../android/app/google-services.json'
import AsyncStorage from '@react-native-community/async-storage'
import { action, actionType } from '../utils/action'
import { authReducer } from './authReducer'
import { asyncErrorHandling } from '../utils/utils'
import axios from 'axios'
import _ from 'lodash'
import { APP, NODE_ENV, API_URL, ACCESS_CODE} from '../../env.json'
import NetInfo from '@react-native-community/netinfo'
/**
 * initial state
 */
const initialState = {
	user: null,
	splash: true,
}

export function useAuth() {

	const [state, dispatch] = React.useReducer(authReducer, initialState)
	const url = `${API_URL[NODE_ENV]}`
	const headers = {
		'X-Requested-With':APP,
		'Authorization':ACCESS_CODE,
		'Content-Type': 'application/json'
	}
	const auth = React.useMemo(() => ({
		configure: async (callback) => {
			console.log('configure')
			let config = {
				scopes: ['https://www.googleapis.com/auth/photoslibrary'],
				webClientId: web.client_id,
				offlineAccess: true,
				forceCodeForRefreshToken: true,
			}
			await AsyncStorage.getItem('user', (err, result) => {
				if (err) {
					console.log(err)
				} else if (result) {

					var user = JSON.parse(result)
					config.accountName = user.email
				}
			})
			GoogleSignin.configure(config)
			callback()
		},
		checkUser: async () => {
			console.log('check')
			let user
			await AsyncStorage.getItem('user', (err, result) => {
				if (err) {
					console.log(err)
				} else {
					user = JSON.parse(result)
				}
			})
			if (user) {
				console.log(user)
				AsyncStorage.multiSet([['GalleryLoaded', 'false'], ['AlbumLoaded', 'false']])
				let _isIndb = await axios.get(`${url}/user/${user.id}`, {
					headers: headers
				})
				if (!_.isEmpty(_isIndb.data)) {
					dispatch([
						action(actionType.SET.USER, user),
						action(actionType.SET.SPLASH, false),
						action(actionType.SET.isFreshing, _isIndb.data.isFreshing),
						action(actionType.SET.isSync, _isIndb.data.isSync),
						action(actionType.SET.useWifi, JSON.parse(await AsyncStorage.getItem('useWifi')))
					])
				} else {
					dispatch(action(actionType.SET.SPLASH, false))
				}
			} else {
				dispatch(action(actionType.SET.SPLASH, false))
			}
		},
		signIn: async () => {
			let userInfo
			console.log('signIn')
			asyncErrorHandling(async () => {
				await GoogleSignin.hasPlayServices()
				userInfo = await GoogleSignin.signIn()
			}, () => {
				AsyncStorage.multiSet([['GalleryLoaded', 'false'], ['AlbumLoaded', 'false'], ['useWifi','true']])
				axios.post(`${url}/auth/${userInfo.user.id}`, {
					scopes: userInfo.scopes,
					serverAuthCode: userInfo.serverAuthCode
				}, {
					headers: headers
				}).then((res) => {
					console.log(res.data)
					AsyncStorage.setItem('user', JSON.stringify(userInfo.user))
					dispatch([
						action(actionType.SET.USER, userInfo.user),
						action(actionType.SET.isFreshing, res.data.isFreshing),
						action(actionType.SET.isSync, res.data.isSync),
						action(actionType.SET.useWifi, true)
					])
				})
			})
		},
		signOut: async () => {
			await GoogleSignin.signOut()
			await AsyncStorage.clear((err) => {
				if (err) {
					console.log(err)
				}
				dispatch(action(actionType.SET.CLEAR, null))
			})
		},
		getAccessToken: async () => {
			return (await GoogleSignin.getTokens()).accessToken
		},
		refresh: async () => {
			let user = await AsyncStorage.getItem('user')
			user = JSON.parse(user)
			axios.put(`${url}/user/${user.id}`, null, {
				headers:headers
			}).then((res) => {
				console.log(res.data)
				dispatch([
					action(actionType.SET.isFreshing, res.data.isFreshing),
					action(actionType.SET.isSync,res.data.isSync)
				])
			})
		},
		setIs: (isFreshing, isSync) => {
			dispatch([
				action(actionType.SET.isFreshing, isFreshing),
				action(actionType.SET.isSync, isSync)
			])
		},
		checkisFreshing: async (callback) => {
			let user = await AsyncStorage.getItem('user')
			user = JSON.parse(user)
			let _isIndb = await axios.get(`${url}/user/${user.id}`, {
				headers: headers
			})
			dispatch([
				action(actionType.SET.isFreshing, _isIndb.data.isFreshing),
				action(actionType.SET.isSync, _isIndb.data.isSync)
			])
			callback(_isIndb.data.isFreshing, _isIndb.data.isSync)
		},
		headers: headers,
		url:url,
		checkNetwork:(status, callback)=>{
			const disallowtype = ['none', 'unknown']
			NetInfo.fetch().then((netinfostate)=>{
				// console.log(netinfostate.type)
				// console.log(status.useWifi)
				if((status.useWifi&&netinfostate.type==='wifi')||(!status.useWifi&&!disallowtype.includes(netinfostate))) {
					callback(true)
				} else {
					callback(false)
				}
			})
		},
		changeWifi:(setUse)=>{
			console.log(setUse)
			AsyncStorage.setItem('useWifi', setUse.toString())
			dispatch(action(actionType.SET.useWifi,setUse))
		}
	}), [])
	return { auth, state }
}