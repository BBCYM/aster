import React, { Component } from "react";
import {
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
    TouchableOpacity,
    Button,
    ScrollView,
    Dimensions
} from 'react-native';

import SlidingUpPanel from 'rn-sliding-up-panel';

export class NormalPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true
        }
    }
    handleShow() {
        this.setState({ show: !this.state.show });
    }
    showPanel() {
        this._panel.show();
        this.handleShow();
    }
    hidePanel() {
        this._panel.hide();
        this.handleShow();
    }

    render() {

        return (
            <View style={styles.container}>
                {this.state.show ? <Button title='Show panel' onPress={() => this.showPanel()} /> : null}
                <SlidingUpPanel ref={c => this._panel = c}>
                    <View style={styles.container}>
                        <Text>Here is the content inside panel</Text>
                        <Button title='Hide' onPress={() => this.hidePanel()} />
                    </View>
                </SlidingUpPanel>
            </View>
        )
    }
}

export class ScrollPanel extends Component {

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => this._panel.show()}>
                    <View>
                        <Text>Show</Text>
                    </View>
                </TouchableOpacity>
                <SlidingUpPanel ref={c => (this._panel = c)}>
                    {dragHandler => (
                        <View style={styles.container}>
                            <View style={styles.dragHandler} {...dragHandler}>
                                <Text>Drag handler</Text>
                            </View>
                            <ScrollView>
                                <Text>Here is the content inside panel</Text>
                                <Text>Here is the content inside panel</Text>
                                <Text>Here is the content inside panel</Text>
                                <Text>Here is the content inside panel</Text>
                                <Text>Here is the content inside panel</Text>
                                <Text>Here is the content inside panel</Text>
                                <Text>Here is the content inside panel</Text>
                                <Text>Here is the content inside panel</Text>
                                <Text>Here is the content inside panel</Text>
                                <Text>Here is the content inside panel</Text>
                                <Text>Here is the content inside panel</Text>
                                <Text>Here is the content inside panel</Text>
                                <Text>Here is the content inside panel</Text>
                                <Text>Here is the content inside panel</Text>
                            </ScrollView>
                        </View>
                    )}
                </SlidingUpPanel>
            </View>
        )
    }
}
const { height } = Dimensions.get('window')
export class BottomPanel extends Component {

    render() {
        return (
            <View style={styles2.container}>
                <Text>Hello world</Text>
                <SlidingUpPanel
                    ref={c => (this._panel = c)}
                    draggableRange={{ top: height / 1.75, bottom: 120 }}
                    // animatedValue={this._draggedValue}
                    showBackdrop={true}>
                    <View style={styles2.panel}>
                        <View style={styles2.panelHeader}>
                            <Text style={{ color: '#FFF' }}>Bottom Sheet Peek</Text>
                        </View>
                        <View style={styles2.container}>
                            <Text>Bottom Sheet Content</Text>
                        </View>
                    </View>
                </SlidingUpPanel>
            </View>
        )
    }
}
const styles = {
    container: {
        flex: 1,
        zIndex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
    dragHandler: {
        alignSelf: 'stretch',
        height: '5%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ccc'
    }
}


const styles2 = {
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        alignItems: 'center',
        justifyContent: 'center'
    },
    panel: {
        flex: 1,
        backgroundColor: 'white',
        position: 'relative'
    },
    panelHeader: {
        height: 120,
        backgroundColor: '#b197fc',
        alignItems: 'center',
        justifyContent: 'center'
    },
    favoriteIcon: {
        position: 'absolute',
        top: -24,
        right: 24,
        backgroundColor: '#2b8a3e',
        width: 48,
        height: 48,
        padding: 8,
        borderRadius: 24,
        zIndex: 1
    }
}