import * as React from 'react'
import { StyleSheet, Text, View, TextInput, Button, Image, TouchableOpacity } from 'react-native';


export default class personalScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = { text: '' };
        this.state = { name: '' };

    }

    // _ping函式
    // 寫法等同於
    //_ping = async function() {}
    _ping = async () => {
        // await 必須寫在async函式裡，await makes JavaScript wait until that promise settles and returns its result.
        // 這邊用法是等fetch的伺服器回應我們後才讓結果等於response
        // 可以把fetch看成是ajax，真的很像
        const response = await fetch("http://192.168.43.95:3000/personal", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': "com.rnexparea"
            },

        })
        // dj back to rn，用到response，一樣先await
        var data = await response.json()
        //var fullfillment = JSON.parse(data)
        //var name = JSON.parse(data)

        console.log(data)
        console.log(data.name)


        this.setState({ name: data.name })
        this.setState({ text: data.text })


    }

    // _edit = async () => {
    //     // await 必須寫在async函式裡，await makes JavaScript wait until that promise settles and returns its result.
    //     // 這邊用法是等fetch的伺服器回應我們後才讓結果等於response
    //     // 可以把fetch看成是ajax，真的很像
    //     const response = await fetch("http://192.168.137.148:3000/personal", {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'X-Requested-With': "com.rnexparea"
    //         },
    //         body: JSON.stringify({
    //             uri: this.state.text,

    //         }),
    //     })
    //     // dj back to rn，用到response，一樣先await
    //     var data = await response.json()
    //     //var fullfillment = JSON.parse(data)
    //     var message = JSON.parse(data)

    //     console.log(message.fulfillmentMessages[0].text.text[0])
    //     //console.log("這裡是rn的data=", data)
    //     //state可以看成是只有當下Component裡可以用的變數
    //     this.setState({ message: message.fulfillmentMessages[0].text.text[0] })
    //     this.setState({ message1: message.fulfillmentMessages[1].text.text[0] })

    // }


    render() {

        return (

            <View style={{ flex: 1 }}>

                <View style={{ flex: 3 }} >
                    <Image source={{ uri: 'https://www.teepr.com/wp-content/uploads/2019/06/15533156982868.jpg' }}
                        style={styles.img} />
                </View>
                <View style={{ flex: 1 }} >
                    <Text style={styles.name}>{this.state.name}</Text>
                </View>
                <View style={{ flex: 1 }} >
                    <Text style={styles.introduce}>{this.state.text}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1 }} >
                        <Image style={styles.accicon} source={require('../../pic/accountpeople.png')} />
                    </View>
                    <View style={{ flex: 2 }} >
                        <TouchableOpacity activeOpacity={0.2} focusedOpacity={0.5}>
                            <View >
                                <Text style={styles.accBtn}>    EDIT ACCOUNT   </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1 }} >
                        <Image style={styles.albumicon} source={require('../../pic/camera.png')} />
                    </View>
                    <View style={{ flex: 2 }} >
                        <TouchableOpacity activeOpacity={0.2} focusedOpacity={0.5}>
                            <View >
                                <Text style={styles.albumBtn}>    EDIT ALBUM        </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ flex: 2 }} >

                    <TouchableOpacity onPress={this._ping} activeOpacity={0.2} focusedOpacity={0.5}>
                        <View >
                            <Text style={styles.button}>    LOG OUT        </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({

    img: {
        position: 'absolute',
        top: 70,
        left: 125,
        width: 140,
        height: 140,
        // justifyContent: 'center',
        // alignItems: 'center',
        borderRadius: 80
    },
    name: {
        lineHeight: 50,
        textAlign: 'center',
        fontSize: 30,
        color: 'black',
    },

    introduce: {
        lineHeight: 50,
        textAlign: 'center',
        fontSize: 20,
        color: 'gray',
    },

    accicon: {
        position: 'absolute',
        top: 10,
        left: 85,
        width: 40,
        height: 51,
    },

    albumicon: {
        position: 'absolute',
        top: 15,
        left: 80,
        width: '41%',
        height: '50%',
    },

    accBtn: {
        fontSize: 25,
        lineHeight: 70,
        textAlign: 'left',
        color: '#585858',
        //textDecorationLine: 'underline'
    },

    albumBtn: {
        fontSize: 25,
        lineHeight: 70,
        textAlign: 'left',
        color: '#585858',

        //textDecorationLine: 'underline'
    },
    Btn: {
        // position: 'absolute',
        top: 20,
        left: 140,
        lineHeight: 42,
        textAlign: 'center',
        color: '#585858',
        fontSize: 20,
    },


    button: {
        // position: 'absolute',
        top: 20,
        left: 110,
        lineHeight: 42,
        textAlign: 'center',
        width: 175,
        height: 40,
        backgroundColor: 'white',
        color: 'black',
        fontSize: 15,
        borderRadius: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowRadius: 5.46,
        elevation: 9,
    },
});


