import * as React from 'react'
import { NetworkInfo } from 'react-native-network-info'
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin'
import { web } from '../../android/app/google-services.json'
import AsyncStorage from '@react-native-community/async-storage'
import { action, actionType } from '../utils/action'
import { authReducer } from './authReducer'
import axios from 'axios'
/**
 * initial state
 */
const initialState = {
    // isLoading:true,
    user: null,
    splash: true
};
const dev = false
const ipv4 = '192.168.169.14'
export function useAuth() {

    const [state, dispatch] = React.useReducer(authReducer, initialState)

    const auth = React.useMemo(() => ({
        configure: async (callback) => {
            console.log("configure")
            let config = {
                scopes: ['https://www.googleapis.com/auth/photoslibrary'],
                webClientId: web.client_id,
                offlineAccess: true,
                forceCodeForRefreshToken: true,
            }
            await AsyncStorage.getItem('email', (err, result) => {
                if (err) {
                    console.log(err)
                } else if (result) {
                    console.log(result)
                    config.accountName = result
                }
            })
            GoogleSignin.configure(config)
            callback()
        },
        checkUser: async (callback) => {
            console.log("check")
            let userInfo = await GoogleSignin.getCurrentUser()
            if (await GoogleSignin.isSignedIn()) {
                if (dev) {
                    var _isIndb = await axios.get(`http://${ipv4}:3000/?userid=${userInfo.user.id}`, {
                        headers: {
                            'X-Requested-With': 'com.aster'
                        }
                    })
                    _isIndb = JSON.parse(_isIndb.data)
                    if (!_isIndb.message) {
                        dispatch(action(actionType.SET.SPLASH, false))
                    } else {
                        console.log(userInfo.idToken === await (await GoogleSignin.getTokens()).idToken)
                        dispatch([action(actionType.SET.USER, userInfo.user), action(actionType.SET.SPLASH, false)])
                        callback(userInfo)
                    }
                } else {
                    dispatch([action(actionType.SET.USER, userInfo.user), action(actionType.SET.SPLASH, false)])
                }
            } else {
                dispatch(action(actionType.SET.SPLASH, false))
            }
        },
        signIn: async () => {
            try {
                console.log("signIn")
                await GoogleSignin.hasPlayServices()
                // this will return userInfo
                let userInfo = await GoogleSignin.signIn()
                await AsyncStorage.multiSet([
                    ['idToken', userInfo.idToken],
                    ['email', userInfo.user.email]
                ])
                dispatch(createAction(actionType.Auth.SIGNIN, { user: userInfo.user }))
            } catch (e) {
                if (e.code === statusCodes.SIGN_IN_CANCELLED) {
                    console.log("Cancel signin")
                    dispatch([action(actionType.SET.SPLASH, true), action(actionType.SET.USER, null)])
                } else if (e.code === statusCodes.IN_PROGRESS) {
                    console.log("Is in progress already")
                } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                    console.log("Play service is not available")
                } else {
                    console.log(e.code)
                }
            }
        },
        clearStorage: async () => {
            await AsyncStorage.clear((err) => {
                if (err) {
                    console.log(err)
                }
            })
            console.log("Done clear")
            console.log(await AsyncStorage.getAllKeys())
        },
        signOut: async () => {
            await GoogleSignin.revokeAccess()
            await GoogleSignin.signOut()
            await AsyncStorage.clear((err) => {
                if (err) {
                    console.log(err)
                }
                dispatch(createAction(actionType.SET.CLEAR, null))
            })
        },
        connectBackend: async (user) => {
            var url = `http://${ipv4}:3000/`
            axios.post(url, {
                scopes: user.scopes,
                sub: user.user.id,
                serverAuthCode: user.serverAuthCode
            }, {
                headers: {
                    'X-Requested-With': 'com.aster'
                }
            }).then((res) => {
                console.log(res.data)

            }).catch((err) => {
                console.log(err)
            })
        },
        getAccessToken: async () => {
            return (await GoogleSignin.getTokens()).accessToken
        }
    }), [])

    return { auth, state }
}