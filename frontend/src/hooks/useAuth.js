import * as React from 'react'
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin'
import { web } from '../../android/app/google-services.json'
import AsyncStorage from '@react-native-community/async-storage'
import { createAction, actionType } from '../utils/action'
import {authReducer} from './authReducer'
/**
 * initial state
 */
const initialState = { isLoading: true };

export function useAuth() {
    
    const [state, dispatch] = React.useReducer(authReducer, initialState)
    
    const auth = React.useMemo(() => ({
        configure: () => {
            console.log("configure")
            console.log(await AsyncStorage.getAllKeys())
            let config = {
                scopes: ['https://www.googleapis.com/auth/photoslibrary'],
                webClientId: web.client_id,
                offlineAccess: true,
                forceCodeForRefreshToken: true,
            }
            await AsyncStorage.getItem('name',(err, result)=>{
                err ? (
                    console.log(err)
                ):(
                    config.accountName = result
                )
            })
            GoogleSignin.configure(config)
            
        },
        signIn: async (callback) => {
            try {
                console.log("signIn")
                await GoogleSignin.hasPlayServices()
                // this will return userInfo
                let userInfo = await GoogleSignin.signIn()
                await AsyncStorage.setItem([
                    ['idToken', userInfo.idToken],
                    ['name',userInfo.user.name]
                ])
                dispatch(createAction(actionType.Auth.SIGNIN, {idToken:userInfo.idToken, name:userInfo.user.name}))
                callback(userInfo.idToken)
            } catch (e) {
                if (e.code === statusCodes.SIGN_IN_CANCELLED) {
                    console.log("Cancel signin")
                } else if (e.code === statusCodes.IN_PROGRESS) {
                    console.log("Is in progress already")
                } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                    console.log("Play service is not available")
                } else {
                    console.log(e)
                }
            }
        },
        signInSilently: async (callback) => {
            console.log("signInSilently")
            try {
                const userInfo = await GoogleSignin.signInSilently()
                await AsyncStorage.setItem([
                    ['idToken', userInfo.idToken],
                    ['name',userInfo.user.name]
                ])
                dispatch(createAction(actionType.Auth.SIGNIN, {idToken:userInfo.idToken, name:userInfo.user.name}))
                callback(userInfo.idToken)
            }catch(e) {
                if (e.code === statusCodes.SIGN_IN_REQUIRED) {
                    callback(userInfo.idToken)
                } else {
                    console.log(e.code)
                }
            }
        },
        isSignedIn: () => {
            console.log("isSignedIn")
        },
        clearStorage: ()=>{
            await AsyncStorage.clear((err)=>{
                if (err) {
                    console.log(err)
                }
            })
            console.log("Done clear")
            console.log(await AsyncStorage.getAllKeys())
        }
    }), [])
    return { auth, state }
}