import * as React from 'react'
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin'
import { web } from '../../android/app/google-services.json'
import AsyncStorage from '@react-native-community/async-storage'
import { action, actionType } from '../utils/action'
import { authReducer } from './authReducer'
/**
 * initial state
 */
const initialState = {
    // isLoading:true,
    user: null,
    splash: true
};

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
                    console.log('get name')
                    console.log(result)
                    config.accountName = result
                }
            })
            GoogleSignin.configure(config)
            callback()
        },
        checkUser: async () => {
            console.log("check")
            if (await GoogleSignin.isSignedIn()) {
                let userInfo = await GoogleSignin.getCurrentUser()
                await AsyncStorage.getItem('email', (err, result) => {
                    console.log(result)
                    if (err) {
                        throw err
                    } else if (result && result == userInfo.user.email) {
                        console.log('is login')
                        dispatch([action(actionType.SET.USER, userInfo.user), action(actionType.SET.SPLASH, false)])

                    }
                })
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
                dispatch(action(actionType.Auth.SIGNIN, userInfo.user))
            } catch (e) {
                if (e.code === statusCodes.SIGN_IN_CANCELLED) {
                    console.log("Cancel signin")
                    dispatch([action(actionType.SET.SPLASH, true), action(actionType.SET.USER, null)])

                } else if (e.code === statusCodes.IN_PROGRESS) {
                    console.log("Is in progress already")
                } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                    console.log("Play service is not available")
                } else {
                    console.log(e)
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
            await AsyncStorage.multiRemove(['idToken','email'],(err)=>{
                if (err) {
                    throw err
                } else {
                    dispatch([action(actionType.SET.USER,null),action(actionType.SET.SPLASH,true)])
                }
            })
        }
    }), [])

    return { auth, state }
}