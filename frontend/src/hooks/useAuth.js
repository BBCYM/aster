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
const ipv4 = 'change to your ip'
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
            if (await GoogleSignin.isSignedIn()) {
                let userInfo = await GoogleSignin.getCurrentUser()
                // axios.get(`http://${ipv4}:3000/?userid=${userInfo.user.id}`,{
                //     headers:{
                //         'X-Requested-With':'com.aster'
                //     }
                // }).then((res)=>{
                //     data = JSON.parse(res.data)
                //     if (data.message){
                //     }
                // }).catch((err)=>{
                //     console.log(err.response)
                // })
                if(!userInfo.serverAuthCode) {
                    try{
                        userInfo = await GoogleSignin.signInSilently()
                    } catch(e){
                        console.log(e)
                        userInfo = await GoogleSignin.signIn()
                    }
                }
                dispatch([action(actionType.SET.USER, userInfo.user), action(actionType.SET.SPLASH, false)])
                        callback(userInfo)
                // await AsyncStorage.getItem('email', (err, result) => {
                //     console.log(result)
                //     if (err) {
                //         throw err
                //     } else if (result && result == userInfo.user.email) {
                //         console.log('is login')
                        
                //     }
                // })
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
        signInSilently: async (callback) => {
            console.log("signInSilently")
            let userInfo = null
            try {
                userInfo = await GoogleSignin.signInSilently()
                await AsyncStorage.setItem([
                    ['idToken', userInfo.idToken],
                    ['email', userInfo.user.email]
                ])
                dispatch(createAction(actionType.Auth.SIGNIN, { user: userInfo.user }))
                callback(userInfo)
            } catch (e) {
                if (e.code === statusCodes.SIGN_IN_REQUIRED) {
                    console.log("Not signed in")
                    callback(userInfo)
                } else {
                    console.log('error')
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
            await AsyncStorage.clear((err) => {
                if (err) {
                    console.log(err)
                }
                dispatch(createAction(actionType.SET.CLEAR, null))
            })
        },
        connectBackend: async (user) => {
            console.log(user)
            NetworkInfo.getIPV4Address().then((ipv4) => {
                if (ipv4) {
                    console.log(ipv4)
                    var url = `http://${ipv4}:3000/`
                    axios.post(url,{
                        scopes:user.scopes,
                        idToken:user.idToken,
                        serverAuthCode:user.serverAuthCode
                    },{
                        headers:{
                            'X-Requested-With':'com.aster'
                        }
                    }).then((res)=>{
                        console.log(res.data)

                    }).catch((err)=>{
                        console.log(err)
                    })
                }
            })
        }
    }), [])

    return { auth, state }
}