import * as React from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';

export default function personalScreen(props) {

    const { state } = React.useContext(AuthContext)


    React.useEffect(() => {
        console.log(state.user)
        // {
        //     email: string,
        //     id: string,
        //     givenName: string,
        //     familyName: string,
        //     photo: string, // url
        //     name: string // full name
        // }
    })
    // _ping函式
    // 寫法等同於
    //_ping = async function() {}
    _ping = async () => {
        // await 必須寫在async函式裡，await makes JavaScript wait until that promise settles and returns its result.
        // 這邊用法是等fetch的伺服器回應我們後才讓結果等於response
        // 可以把fetch看成是ajax，真的很像

        const response = await fetch("http://192.168.1.102:3000/personal", {

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

        // this.setState({ name: data.name })
        // this.setState({ text: data.text })

    }

    return (
        <View style={styles.container}>
            <View style={styles.header}></View>
            <Image style={styles.avatar} source={{ uri: 'https://www.teepr.com/wp-content/uploads/2019/06/15533156982868.jpg' }} />
            <View style={styles.body}>
                <View style={styles.bodyContent}>
                    <Text style={styles.name}>{state.user.name}</Text>
                    <Text style={styles.description}>Lorem ipsum dolor sit amet, saepe sapientem eu nam. Qui ne assum electram expetendis, omittam deseruisse consequuntur ius an,</Text>
                    <View style={styles.Btncontainer}>
                        <TouchableOpacity style={styles.Btn}>
                            <Text>EDIT ACCOUNT</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.Btn}>
                            <Text>LOG OUT</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    header: {
        height: 120,
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginBottom: 10,
        alignSelf: 'center',
        position: 'absolute',
        marginTop: 40
    },

    body: {
        //marginTop: 30,
        marginVertical: 60,
        //paddingVertical: 60,

    },
    bodyContent: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 50

    },
    name: {
        fontSize: 30,
        color: "#696969",
        fontWeight: "600",
    },

    description: {
        fontSize: 16,
        color: "#696969",
        marginTop: 20,
        textAlign: 'center'

    },

    Btncontainer: {
        marginVertical: 70,
    },
    Btn: {
        //marginTop: 10,
        height: 35,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        width: 180,
        borderRadius: 30,
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowRadius: 5.46,
        elevation: 7,

    },

});