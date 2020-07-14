import React, { Component } from 'react';
import { AuthContext } from '../../contexts/AuthContext'
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Image,
    TouchableOpacity
} from 'react-native';

export default class Profile extends Component {

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.editaccount}>E D I T   A C C O U N T</Text>
                </View>
                <Image style={styles.avatar} source={{ uri: 'https://www.teepr.com/wp-content/uploads/2019/06/15533156982868.jpg' }} />
                <TouchableOpacity activeOpacity={0.2} focusedOpacity={0.5}>
                    <View >
                        <Text style={styles.changeImg}>變更大頭貼照</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.body}>
                    <View style={styles.bodyContent}>
                        <Text style={styles.item}>姓名</Text>
                        <TextInput
                            style={styles.nameInput}
                            onChangeText={text => onChangeText(text)}
                        />

                        <Text style={styles.item}>個人簡介</Text>
                        <TextInput multiline={true}
                            numberOfLines={5}
                            style={styles.introInput}
                            onChangeText={text => onChangeText(text)}
                        />
                        {/* 
                        <TouchableOpacity style={styles.Btn}>
                            <Text>SUBMIT</Text>
                        </TouchableOpacity> */}
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#F6C570",
        height: 65,
    },

    editaccount: {
        lineHeight: 62,
        textAlign: 'center',
        fontSize: 25,
        color: 'white',
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        position: 'absolute',
        marginTop: 100,
        marginHorizontal: 40,
        marginVertical: 10

    },
    changeImg: {
        marginTop: 100,
        textAlign: 'center',
        fontSize: 20,
        color: 'blue',
        alignSelf: 'flex-end',
        marginHorizontal: 40,
        marginVertical: 10

    },

    body: {
        margin: 40,
    },

    bodyContent: {
        //flex: 1,
        alignItems: 'center',
    },

    item: {
        lineHeight: 50,
        fontSize: 16,
        color: '#696969',
        alignSelf: 'flex-start',

    },

    nameInput: {
        width: 230,
        borderWidth: 1,
        textAlign: 'center',
        borderColor: 'gray',
        borderRadius: 20
    },

    introInput: {
        width: 230,
        borderWidth: 1,
        textAlign: 'center',
        borderColor: 'gray',
        borderRadius: 20,
    },

    Btn: {
        //marginTop: 10,
        height: 35,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        width: 130,
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