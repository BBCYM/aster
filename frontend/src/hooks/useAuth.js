import * as React from 'react'
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin'
import { web } from '../../android/app/google-services.json'
import AsyncStorage from '@react-native-community/async-storage'
import { createAction, actionType } from '../utils/action'
import {authReducer} from './authReducer'
/**
 * initial state
 */
const initialState = {
    isLoading:true,
    user:null
};

export function useAuth() {
    
    const [state, dispatch] = React.useReducer(authReducer, initialState)
    
    const auth = React.useMemo(() => ({
        configure: async (callback) => {
            console.log("configure")
            console.log(await AsyncStorage.getAllKeys())
            let config = {
                scopes: ['https://www.googleapis.com/auth/photoslibrary'],
                webClientId: web.client_id,
                offlineAccess: true,
                forceCodeForRefreshToken: true,
            }
            await AsyncStorage.getItem('email',(err, result)=>{
                if (err) {
                    console.log(err)
                } else if (result){
                    console.log(result)
                    config.accountName = result
                }
            })
            GoogleSignin.configure(config)
            callback()
        },
        checkUser : async ()=>{
            console.log("check")
            AsyncStorage.getItem('email',(err,result)=>{
                if (err) {
                    console.log(err)
                } else if (result) {
                    
                }
            })
        },
        signIn: async () => {
            try {
                console.log("signIn")
                await GoogleSignin.hasPlayServices()
                // this will return userInfo
                let userInfo = await GoogleSignin.signIn()
                await AsyncStorage.multiSet([
                    ['idToken', userInfo.idToken],
                    ['email',userInfo.user.email]
                ])
                dispatch(createAction(actionType.Auth.SIGNIN, {user:userInfo.user}))
            } catch (e) {
                if (e.code === statusCodes.SIGN_IN_CANCELLED) {
                    console.log("Cancel signin")
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
                    ['email',userInfo.user.email]
                ])
                dispatch(createAction(actionType.Auth.SIGNIN, {user:userInfo.user}))
                callback(userInfo)
            }catch(e) {
                if (e.code === statusCodes.SIGN_IN_REQUIRED) {
                    console.log("Not signed in")
                    callback(userInfo)
                } else {
                    console.log('error')
                    console.log(e)
                }
            }
        },
        isSignedIn: async (callback) => {
            console.log("isSignedIn")
            let _isSigned = await GoogleSignin.isSignedIn()
            console.log(_isSigned)
            if (_isSigned) {
                let userInfo = await GoogleSignin.getCurrentUser()
                // set state
                AsyncStorage.getItem('email',(err, result)=>{
                    if (err) {
                        console.log(err)
                        _isSigned = false
                    } else if (result) {
                        if(userInfo.user.email == result) {
                            console.log('Result good')
                            dispatch(createAction(actionType.Auth.SIGNIN, {user:userInfo.user}))
                        }
                    }
                })
            }
            dispatch(createAction(actionType.SET.isLoading,false))
        },
        clearStorage: async ()=>{
            await AsyncStorage.clear((err)=>{
                if (err) {
                    console.log(err)
                }
            })
            console.log("Done clear")
            console.log(await AsyncStorage.getAllKeys())
        },
        signOut: async ()=>{
            await GoogleSignin.revokeAccess()
            await GoogleSignin.signOut()
            await AsyncStorage.clear((err)=>{
                if(err) {
                    console.log(err)
                }
                dispatch(createAction(actionType.SET.CLEAR,null))
            })
        }
    }), [])
    return { auth, state }
}