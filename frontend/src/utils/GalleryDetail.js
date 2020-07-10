import {
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
    TouchableOpacity,
    Button,
} from 'react-native';
import React, { Component } from 'react';
const Separator = () => (
    <View style={styles.separator} />
);

export default class ExampleComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showForm: 0
        };
    }

    render() {
        var form;
        if (this.state.showForm === 0) {
            form = (
                <View >
                    <Text >test</Text>
                </View>
            );
        } else if (this.state.showForm === 1) {
            form = (
                <View style={styles.bottom}>
                    <View style={{ width: '100%', height: '20%', backgroundColor: 'transparent' }} />
                    <View style={{ width: '100%', height: '10%', backgroundColor: 'skyblue' }} />
                    <View style={{ width: '100%', height: '50%', backgroundColor: 'steelblue' }} />

                </View>
            );
        }

        return (
            <View style={styles.container}>
                <Separator />
                <Button style={{ width: '100' }} title='Show Form 1' onPress={() => this.setState({ showForm: 0 })} />
                <Separator />
                <Button title='Show Form 2' onPress={() => this.setState({ showForm: 1 })} />
                <Separator />
                {form}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        // marginHorizontal: 16,
    },
    bottom: {
        // position: 'absolute',
        flex: 1,
        justifyContent: 'flex-end',
    },
    separator: {
        marginVertical: 8,
        borderBottomColor: '#737373',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
});