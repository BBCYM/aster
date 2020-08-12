import * as React from 'react'
import { GoogleSignin} from '@react-native-community/google-signin'
import { web } from '../../android/app/google-services.json'
import AsyncStorage from '@react-native-community/async-storage'
import { action, actionType } from '../utils/action'
import { authReducer } from './authReducer'
import { ipv4, dev } from '../utils/dev'
import {asyncErrorHandling} from '../utils/utils'
import axios from 'axios'
import _ from 'lodash'
import Axios from 'axios'
/**
 * initial state
 */
const initialState = {
	user: null,
	splash: true
}
export function useAuth() {

	const [state, dispatch] = React.useReducer(authReducer, initialState)

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
					console.log(user)
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
				AsyncStorage.multiSet([['GalleryLoaded', 'false'],['AlbumLoaded', 'false']])
				if (dev) {
					dispatch([action(actionType.SET.USER, user), action(actionType.SET.SPLASH, false)])
				} else {
					console.log(ipv4)
					let _isIndb = await axios.get(`http://${ipv4}:3000/?userid=${user.id}`, {
						headers: {
							'X-Requested-With': 'com.aster'
						}
					})
					if (!_.isEmpty(_isIndb.data)) {
						dispatch([
							action(actionType.SET.USER, user),
							action(actionType.SET.SPLASH, false),
							action(actionType.SET.isFreshing, _isIndb.data.isFreshing),
							action(actionType.SET.isSync, _isIndb.data.isSync)
						])
					} else {
						dispatch(action(actionType.SET.SPLASH, false))
					}
				}
			} else {
				dispatch(action(actionType.SET.SPLASH, false))
			}
		},
		signIn: async () => {
			let userInfo
			console.log('signIn')
			asyncErrorHandling(async ()=>{
				await GoogleSignin.hasPlayServices()
				userInfo = await GoogleSignin.signIn()
			},()=>{
				AsyncStorage.multiSet([['GalleryLoaded', 'false'],['AlbumLoaded', 'false']])
				axios.post(`http://${ipv4}:3000`, {
					scopes: userInfo.scopes,
					sub: userInfo.user.id,
					serverAuthCode: userInfo.serverAuthCode
				}, {
					headers: {
						'X-Requested-With': 'com.aster'
					}
				}).then((res)=>{
					console.log(res.data)
					AsyncStorage.setItem('user', JSON.stringify(userInfo.user))
					dispatch([
						action(actionType.SET.USER, userInfo.user),
						action(actionType.SET.isFreshing, res.data.isFreshing),
						action(actionType.SET.isSync, res.data.isSync)
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
		refresh: () => {
			console.log(state.user.id)
			Axios.put(`http://${ipv4}:3000`, JSON.stringify({
				sub: state.user.id
			}), {
				headers: {
					'Content-Type': 'application/json',
					'X-Requested-With': 'com.aster'
				}
			}).then((res) => {
				console.log(res.data)
				dispatch(action(actionType.SET.isFreshing, res.data.isFreshing))
			})
		},
		setIs: (isFreshing:Boolean, isSync:Boolean)=>{
			dispatch([
				action(actionType.SET.isFreshing,isFreshing),
				action(actionType.SET.isSync,isSync)
			])
		}
	}), [])
	return { auth, state }
}