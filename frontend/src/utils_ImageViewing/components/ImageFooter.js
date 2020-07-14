import React, { Component } from "react";
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
} from 'react-native';


const ImageFooter = () => {


  function renderEdit() {
    <View style={{ zIndex: 5 }}>
      <View style={{ width: '100%', height: '40%', backgroundColor: 'transparent' }} />
      <View style={{ width: '100%', height: '10%', backgroundColor: 'orange' }} />
      <View style={{ width: '100%', height: '50%', backgroundColor: 'red' }} />
      <Text>i am bobo</Text>
    </View>
  };
  //const ImageFooter = ({ imageIndex, imagesCount }) => (

  return (
    <View style={styles.root} >
      {/* <Text style={styles.text}>{`${imageIndex + 1} / ${imagesCount}`}</Text> */}
      < TouchableOpacity activeOpacity={0.2} focusedOpacity={0.5} >
        <View >
          <Text style={styles.text}>delete</Text>
        </View>
      </TouchableOpacity >
      <TouchableOpacity activeOpacity={0.2} focusedOpacity={0.5}>
        <View >
          <Text style={styles.text}>like</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.2}
        focusedOpacity={0.5}
        onPress={renderEdit}>
        <View >
          <Text style={styles.text}>detail</Text>
        </View>
      </TouchableOpacity>
    </View >

  )

}
const styles = StyleSheet.create({
  footerRoot: {
    backgroundColor: '#63CCC8',
    alignItems: "center",
    justifyContent: "center"
  },
  footerText: {
    fontSize: 17,
    color: "#FFF"
  }
});

export default ImageFooter;