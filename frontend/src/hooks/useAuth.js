import * as React from 'react'
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin'
import { web } from '../../android/app/google-services.json'
import AsyncStorage from '@react-native-community/async-storage'
import { createAction, actionType } from '../utils/action'

/**
 * initial state
 */
const initialState = { loading: true };

export function useAuth() {
    const reducer = function (state, action){
        console.log(action.type)
        switch (action.type) {
            case actionType.SET.idToken:
                return {
                    ...state,
                    idToken: action.payload
                };
            default:
                return state;
        }
    }
    const [state, dispatch] = React.useReducer(reducer, initialState)
    const auth = React.useMemo(() => ({
        configure: () => {
            GoogleSignin.configure({
                scopes: ['https://www.googleapis.com/auth/photoslibrary'],
                webClientId: web.client_id,
                offlineAccess: true,
                forceCodeForRefreshToken: true,
            })
            console.log("configure")
        },
        signIn: async () => {
            try {
                console.log("signIn")
                await GoogleSignin.hasPlayServices()
                // this will return userInfo
                let userInfo = await GoogleSignin.signIn()
                await AsyncStorage.setItem('idToken', userInfo.idToken)
                dispatch(createAction(actionType.SET.idToken, userInfo.idToken))
                return userInfo.idToken
                // console.log(await AsyncStorage.getAllKeys())
                // callback(userInfo.idToken)
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
        signInSilently: () => {
            console.log("signInSilently")
        },
        isSignedIn: () => {
            console.log("isSignedIn")
        },
    }), [])
    return { auth, state }
}