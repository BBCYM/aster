import {
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
    TouchableOpacity,
} from 'react-native';
import React, { Component } from 'react';

export default class App extends Component {

    // render() {
    //     return (
    //         <View style={{ zIndex: 5 }}>
    //             <View style={{ width: '100%', height: '40%', backgroundColor: 'transparent' }} />
    //             <View style={{ width: '100%', height: '10%', backgroundColor: 'skyblue' }} />
    //             <View style={{ width: '100%', height: '50%', backgroundColor: 'steelblue' }} />
    //             <Text>i am bobo</Text>
    //         </View>
    //     )
    // }

    getInitialState() {
        return {
            viewOne: true
        }
    }

    changeView() {
        this.setState({
            viewOne: !this.state.viewOne
        })
    }
    render() {
        if (!this.state.viewOne) return <newView changeView={() => this.changeView()} />
        return (
            <View>
                <Button onPress={() => this.changeView()}> change view </Button>
            </View>
        )

    }
}
class newView extends Component {

    render() {
        return (
            <View>
                <Text onPress={this.props.changeView}> the View is now changed </Text>
            </View>
        );
    }
}