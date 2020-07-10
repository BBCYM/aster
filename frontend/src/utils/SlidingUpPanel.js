import React, { Component } from "react";
import { View, Button, Text } from 'react-native';

import SlidingUpPanel from 'rn-sliding-up-panel';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.stae = {
            show: false
        }
    }
    handleShow() {
        this.setState({ show: !this.state.show });
    }
    showPanel() {
        this._panel.show();
        this.handleShow();
    }
    render() {

        return (
            <View style={styles.container}>
                <Button title='Show panel' onPress={() => this.showPanel()} />
                <SlidingUpPanel ref={c => this._panel = c}>
                    <View style={styles.container}>
                        <Text>Here is the content inside panel</Text>
                        <Button title='Hide' onPress={() => this._panel.hide()} />
                    </View>
                </SlidingUpPanel>
            </View>
        )
    }
}

const styles = {
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    }
}
