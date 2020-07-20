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
const dev = true
const ipv4 = '10.1.1.12'
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
            await AsyncStorage.getItem('user', (err, result) => {
                if (err) {
                    console.log(err)
                } else if (result) {
                    console.log(result)
                    var user = JSON.parse(result)
                    config.accountName = user.email
                }
            })
            GoogleSignin.configure(config)
            callback()
        },
        checkUser: async () => {
            console.log("check")
            if (await GoogleSignin.isSignedIn()) {
                let userInfo = await GoogleSignin.getCurrentUser()
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
                        await AsyncStorage.getItem('user', (err, result) => {
                            if (err) {
                                throw err
                            } else {
                                dispatch([action(actionType.SET.USER, JSON.parse(result)), action(actionType.SET.SPLASH, false)])
                                // callback(userInfo)
                            }
                        })
                    }
                } else {
                    dispatch([action(actionType.SET.USER, userInfo.user), action(actionType.SET.SPLASH, false)])
                }
            } else {
                dispatch(action(actionType.SET.SPLASH, false))
            }
        },
        signIn: async () => {
            let userInfo
            try {
                console.log("signIn")
                await GoogleSignin.hasPlayServices()
                // this will return userInfo
                userInfo = await GoogleSignin.signIn()
                
            } catch (e) {
                console.log('has error')
                console.log(e.code)
                dispatch([action(actionType.SET.SPLASH, true)])
            }
            var url = `http://${ipv4}:3000/`
            axios.post(url, {
                scopes: userInfo.scopes,
                sub: userInfo.user.id,
                serverAuthCode: userInfo.serverAuthCode
            }, {
                headers: {
                    'X-Requested-With': 'com.aster'
                }
            }).then((res) => {
                console.log(res.data)
                AsyncStorage.setItem('user', JSON.stringify(userInfo.user))
                dispatch(action(actionType.SET.USER, userInfo.user))

            }).catch((err) => {
                console.log(err)
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
        }
    }), [])

    return { auth, state }
}