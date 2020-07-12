import React from "react";
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
} from 'react-native';

const renderDetail = () => ( //我想要呈現的Detail畫面
  <Animated.View style={{ backgroundColor: "orange" }}>
    <Animated.View
      pointerEvents="none"
      style={{ ...styles.textInputContainer, backgroundColor: "yellow" }}
    >

    </Animated.View>
  </Animated.View>
);
//const ImageFooter = ({ imageIndex, imagesCount }) => (
const ImageFooter = () => (
  <View style={styles.root}>
    {/* <Text style={styles.text}>{`${imageIndex + 1} / ${imagesCount}`}</Text> */}
    <TouchableOpacity activeOpacity={0.2} focusedOpacity={0.5}>
      <View >
        <Text style={styles.text}>delete</Text>
      </View>
    </TouchableOpacity>
    <TouchableOpacity activeOpacity={0.2} focusedOpacity={0.5}>
      <View >
        <Text style={styles.text}>like</Text>
      </View>
    </TouchableOpacity>
    <TouchableOpacity
      activeOpacity={0.2}
      focusedOpacity={0.5}
      onClick={renderDetail} //按了之後要跳出Detail畫面 
    >
      <View >
        <Text style={styles.text}>detail</Text>
      </View>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  root: {
    padding: 10,
    flexDirection: 'row',
    backgroundColor: '#63CCC8',
    alignItems: "center",
    justifyContent: 'space-between',
    paddingBottom: 15,
  },
  text: {
    fontSize: 25,
    color: "#FFF"
  }
});

export default ImageFooter;
