import React, { Component } from 'react'
import { View, StyleSheet, Button } from 'react-native'

import t from 'tcomb-form-native' // 0.6.9

const Form = t.form.Form

const User = t.struct({
	email: t.String,
	username: t.String,
	password: t.String,
	terms: t.Boolean
})

export default class App extends Component {
    handleSubmit = () => {
    	const value = this._form.getValue() // use that ref to get the form value
    	console.log('value: ', value)
    }

    render() {
    	return (
    		<View style={styles.container}>
    			<Form
    				ref={c => this._form = c} // assign a ref
    				type={User}
    			/>
    			<Button
    				title="Sign Up!"
    				onPress={this.handleSubmit}
    			/>
    		</View>
    	)
    }
}

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		marginTop: 50,
		padding: 20,
		backgroundColor: '#ffffff',
	},
})