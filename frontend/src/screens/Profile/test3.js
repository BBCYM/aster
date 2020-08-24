import * as React from 'react'
import { StyleSheet, View, Image, TouchableOpacity, ActivityIndicator, Text } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Overlay } from 'react-native-elements'
// import moment from 'moment';


export default function personalScreen(props) {

    const [visible, setVisible] = React.useState(false)

    const showModal = () => setVisible(true)

    const hideModal = () => setVisible(false)
    var username = true

    return (
        <View style={styles.container}>

            {/* 這邊開始 */}

            <Overlay visible={visible} onBackdropPress={hideModal}
                overlayStyle={styles.overlayStyle}>

                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity activeOpacity={0.2} focusedOpacity={0.5} >
                        <Image style={styles.emotion}
                            source={{ uri: 'https://github.com/duytq94/react-native-fb-reactions-animation/blob/master/Images/like.gif?raw=true' }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.2} focusedOpacity={0.5} >
                        <Image style={styles.emotion}
                            source={{ uri: 'https://github.com/duytq94/react-native-fb-reactions-animation/blob/master/Images/love2.png?raw=true' }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.2} focusedOpacity={0.5} >
                        <Image style={styles.emotion}
                            source={{ uri: 'https://github.com/duytq94/react-native-fb-reactions-animation/blob/master/Images/haha2.png?raw=true' }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.2} focusedOpacity={0.5} >
                        <Image style={styles.emotion}
                            source={{ uri: 'https://github.com/duytq94/react-native-fb-reactions-animation/blob/master/Images/wow2.png?raw=true' }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.2} focusedOpacity={0.5} >
                        <Image style={styles.emotion}
                            source={{ uri: 'https://github.com/duytq94/react-native-fb-reactions-animation/blob/master/Images/sad2.png?raw=true' }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.2} focusedOpacity={0.5} >
                        <Image style={styles.emotion}
                            source={{ uri: 'https://github.com/duytq94/react-native-fb-reactions-animation/blob/master/Images/angry2.png?raw=true' }}
                        />
                    </TouchableOpacity>

                </View>

            </Overlay>

            <View >
                <TouchableOpacity style={styles.heartBtn} activeOpacity={0.2} focusedOpacity={0.5} onPress={showModal} >
                    <Ionicons name='heart-outline' color={'red'} size={50} />
                </TouchableOpacity>
            </View>


            {/* 這邊結束 */}

            <View style={[styles.container, { opacity: username ? 100 : 0 }]}>

                <ActivityIndicator size="large" color="#d0cfcf" />
                <Text style={styles.textREFRESH}>REFRESHING</Text>

                {/* <Text
                    style={[styles.textREFRESH,
                    { opacity: username ? 100 : 0 }]}>
                    REFRESHING
                </Text> */}

            </View>

        </View>

    )
}

const styles = StyleSheet.create({
    emotion: {
        width: 50,
        height: 50,
        margin: 1
    },

    bodyContent: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 50

    },

    heartBtn: {
        marginTop: 100,
        width: 50,
        height: 50,
        // borderRadius: 30,
        // backgroundColor: "white",
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowRadius: 5.46,
        // elevation: 7,
    },
    overlayStyle: {
        // height: screenHeight * 0.1,
        // width: screenWidth * 0.8,
        position: 'absolute',
        bottom: 40,
        height: 52,
        width: 313,
        marginLeft: 3,
        // margin: 0,
        padding: 0,
        marginBottom: 20,
    },
    container: {
        flex: 3,
        justifyContent: "center"
    },
    textREFRESH: {
        justifyContent: "center",
        textAlign: 'center',
        color: '#d0cfcf',
        fontSize: 15,

    }

})
