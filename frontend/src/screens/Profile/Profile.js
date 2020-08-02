import * as React from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { StyleSheet, Text, View, Modal, Image, TouchableOpacity, Button } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { ipv4 } from '../../utils/dev';
// import moment from 'moment';



export default function personalScreen(props) {
    const { auth, state } = React.useContext(AuthContext)
    return (
        <View style={styles.container}>
            <View style={styles.header}></View>
            <Image style={styles.avatar} source={{ uri: `${state.user.photo}` }} />
            {/* https://lh3.googleusercontent.com/a-/AOh14GixVww8PP-TJc7CrmOa9z5zPM8bsbPbh08A6Fq-Og=s96-c */}
            {/* <Image source={{ uri: state.user.photo }} /> */}
            {/* <Image source={{ uri: `https://lh3.googleusercontent.com/a-/AOh14GixVww8PP-TJc7CrmOa9z5zPM8bsbPbh08A6Fq-Og=s96-c` }} /> */}
            {/* <Image source={Images.pic.camera} /> */}
            <View style={styles.body}>
                <View style={styles.bodyContent}>
                    <Text style={styles.name}>{state.user.name}</Text>

                    {/* <Text style={styles.description}>Lorem ipsum dolor sit amet, saepe sapientem eu nam. Qui ne assum electram expetendis, omittam deseruisse consequuntur ius an,</Text> */}
                    <View style={styles.Btncontainer}>
                        <TouchableOpacity style={styles.Btn}>
                            <Text>REFRESH</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.Btn} onPress={() => { auth.signOut() }}>
                            <Text>LOG OUT</Text>
                        </TouchableOpacity>

                        {/* 這邊開始 */}
                        {/* <View >
                            <Modal
                                transparent={true}
                                visible={true}>

                                <View style={{ backgroundColor: "blue" }}></View>
                            </Modal>

                        </View> */}


                        <View>
                            <TouchableOpacity style={styles.heartBtn} activeOpacity={0.2}
                                focusedOpacity={0.5} >
                                <Ionicons name='heart' color={'red'} size={50} />
                            </TouchableOpacity>
                        </View>


                        {/* 這邊結束 */}
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
        fontWeight: "600"
    },

    description: {
        fontSize: 16,
        color: "#696969",
        marginTop: 20,
        textAlign: 'center'

    },

    Btncontainer: {
        marginVertical: 30,
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
    heartBtn: {
        marginTop: 100,
        width: 50,
        height: 50,
        // borderRadius: 30,
        // backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowRadius: 5.46,
        // elevation: 7,
    },

});
