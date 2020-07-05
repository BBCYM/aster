import * as React from 'react'
import { StyleSheet, Text, View, TextInput, Button, Image, TouchableOpacity } from 'react-native';


export default class EditAccountScreen extends React.Component {
    render() {
        return (
            // <View style={styles.container}>

            //     <View style={styles.header}>
            //         <Text style={styles.title}>{'E D I T    A C C O U N T'}</Text>
            //     </View>

            // </View>

            <View style={{ flex: 1 }}>
                <View style={styles.header}>
                    <Text style={styles.title}>{'E D I T    A C C O U N T'}</Text>
                </View>
                <View style={{ flex: 5, flexDirection: 'row' }} >
                    <View style={{ flex: 1 }} >
                        <Image source={{ uri: 'https://www.teepr.com/wp-content/uploads/2019/06/15533156982868.jpg' }}
                            style={styles.img} />
                    </View>
                    <View style={{ flex: 1 }} >
                        <TouchableOpacity activeOpacity={0.2} focusedOpacity={0.5}>
                            <View >
                                <Text style={styles.changeImg}>變更大頭貼照</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flex: 2, flexDirection: 'row' }} >
                    <View style={{ flex: 1 }} >
                        <Text style={styles.name}>{'姓名'}</Text>
                    </View>
                    <View style={{ flex: 2 }} >
                        <TextInput
                            style={styles.nameInput}
                            onChangeText={text => onChangeText(text)}
                        />
                    </View>
                </View>
                <View style={{ flex: 3, flexDirection: 'row' }} >
                    <View style={{ flex: 1 }} >
                        <Text style={styles.intro}>{'個人簡介'}</Text>
                    </View>
                    <View style={{ flex: 2 }} >
                        <TextInput multiline={true}
                            numberOfLines={5}
                            style={styles.introInput}
                            onChangeText={text => onChangeText(text)}
                        />
                    </View>
                </View>

                <View style={{ flex: 1 }} >
                    <TouchableOpacity activeOpacity={0.2} focusedOpacity={0.5}>
                        <View >
                            <Text style={styles.button}>S U B M I T</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    header: {
        flex: 1,
        backgroundColor: '#F6C570',
    },

    title: {
        lineHeight: 62,
        textAlign: 'center',
        fontSize: 30,
        color: 'white',
    },

    img: {
        position: 'absolute',
        top: 70,
        left: 20,
        width: 140,
        height: 140,
        borderRadius: 80
    },

    changeImg: {
        lineHeight: 300,
        textAlign: 'center',
        fontSize: 20,
        color: 'blue',
    },

    name: {
        lineHeight: 50,
        textAlign: 'center',
        fontSize: 20,
        color: 'black',
    },

    nameInput: {
        width: 230,
        borderWidth: 1.5,
        textAlign: 'center',
        borderColor: 'gray',
        borderRadius: 50
    },
    intro: {
        lineHeight: 50,
        textAlign: 'center',
        fontSize: 20,
        color: 'black',
    },

    introInput: {
        width: 230,
        borderWidth: 1.5,
        textAlign: 'center',
        borderColor: 'gray',
        borderRadius: 20
    },

    button: {
        //position: 'absolute',
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
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
    },
});



// const styles = StyleSheet.create({
//     header: {
//         width: 400,
//         height: 65,
//         backgroundColor: '#ead493',

//     },

//     title: {
//         lineHeight: 62,
//         textAlign: 'center',
//         fontSize: 30,
//         color: 'white',
//     },
// });



