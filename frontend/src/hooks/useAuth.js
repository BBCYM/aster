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
import { PermissionsAndroid} from 'react-native'
import CameraRoll from '@react-native-community/cameraroll'

/**
 * initial state
 */
const initialState = {
	user: null,
	splash: true,
	language: 'zh-tw',
	dateRange:'3'
}

export function useAuth() {

	const [state, dispatch] = React.useReducer(authReducer, initialState)
	const url = `${API_URL[NODE_ENV]}`
	let headers = {
		'X-Requested-With':APP,
		'Authorization':ACCESS_CODE,
		'Content-Type': 'application/json',
	}
	const auth = React.useMemo(() => ({
		hasAndroidPermission: async()=>{
			const permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
			const hasPermission = await PermissionsAndroid.check(permission)
			if (hasPermission) {
				return true
			}
			const status = await PermissionsAndroid.request(permission)
			return status === 'granted'
		},
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
				AsyncStorage.setItem('GalleryLoaded', 'false')
				let _isIndb = await axios.get(`${url}/user/${user.id}`, {
					headers: headers
				})
				if (!_.isEmpty(_isIndb.data)) {
					let lancode = await AsyncStorage.getItem('lancode')
					dispatch([
						action(actionType.SET.USER, user),
						action(actionType.SET.SPLASH, false),
						action(actionType.SET.isFreshing, _isIndb.data.isFreshing),
						action(actionType.SET.isSync, _isIndb.data.isSync),
						action(actionType.SET.useWifi, JSON.parse(await AsyncStorage.getItem('useWifi'))),
						action(actionType.SET.lancode, lancode)
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
				AsyncStorage.multiSet([['GalleryLoaded', 'false'], ['lancode', 'zh-tw'],['useWifi','true']])
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
		refresh: async (dateRange) => {
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
		headers:(language)=>{
			headers['Language-Code'] = language
			return headers
		},
		url:url,
		checkNetwork:(status, callback)=>{
			const disallowtype = ['none', 'unknown']
			NetInfo.fetch().then((netinfostate)=>{
				if((status.useWifi&&netinfostate.type==='wifi')||(!status.useWifi&&!disallowtype.includes(netinfostate))) {
					callback(true)
				} else {
					callback(false)
				}
			})
		},
		changeWifi:(setUse)=>{
			AsyncStorage.setItem('useWifi', setUse.toString())
			dispatch(action(actionType.SET.useWifi,setUse))
		},
		changeLanguage: async(lancode)=>{
			await AsyncStorage.setItem('lancode', lancode)
			dispatch(action(actionType.SET.lancode, lancode))
		},
		changeRange:(dateRange)=>{
			dispatch(action(actionType.SET.dateRange, dateRange))
		},
		updatelocation:async (dateRange)=>{
			let user = await AsyncStorage.getItem('user')
			user = JSON.parse(user)
			let params 
			let pageNum = ''
			dateRange === 'all' ? params = {
				first:50,
				include:['filename','location'],
			} : params = {
				first:50,
				include:['filename','location'],
				fromTime: new Date().getTime() - 86400000 * Number(dateRange)
			}
			let flag =false
			do {
				if (pageNum) {
					params['after'] = pageNum
				}
				try {
					let r = await CameraRoll.getPhotos(params)
					var rmap = r.edges.filter((v)=>{
						return v.node.location ?  true: false
					}).map((v)=>{
						console.log(new Date(v.node.timestamp*1000))
						return {
							'filename':v.node.image.filename,
							'location':v.node.location,
							'timestamp':v.node.timestamp
						}
					})
					axios.post(`${url}/ontology/${user.id}/location`, {
						locdata:rmap
					}, {
						headers:headers
					})
					flag = r.page_info.has_next_page
					pageNum = r.page_info.end_cursor
				} catch(err){
					console.log(err)
				}
			} while (flag)
		}
	}), [])
	return { auth, state }
}