
import React, { useState, Component } from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity
} from "react-native";
import get from "lodash/get";
import memoize from "lodash/memoize";

//import ImageViewing from "../src/ImageViewing";
import ImageViewing from "react-native-image-viewing";
import SlidingUpPanel from 'rn-sliding-up-panel';

import ImageList from "./components/ImageList";
import { ImageHeader } from "./components/ImageHeader";
// import ImageFooter from "./components/ImageFooter";

import { architecture } from "./data/architecture";
import { travel } from "./data/travel";
import { city } from "./data/city";
import { food } from "./data/food";

// import { ImageSource } from "./@types";
class FooterImageViewing extends Component {

}
export default function App() {
  const [currentImageIndex, setImageIndex] = useState(0);
  const [images, setImages] = useState(architecture);
  //const [setImages] = useState(architecture);
  const [isVisible, setIsVisible] = useState(false);
  const [isToggled, setToggle] = useState(true)
  const [_panel, set_panel] = useState(<SlidingUpPanel />)
  const onSelect = (images, index) => {
    setImageIndex(index);
    setImages(images);
    setIsVisible(true);
    setToggle(true)
  };

  const onRequestClose = () => setIsVisible(false);
  const getImageSource = memoize((images) =>
    images.map((image, index) =>
      typeof image.original === "number"
        ? image.original
        : { uri: image.original }
    )
  );
  const onLongPress = (image) => {
    Alert.alert("Long Pressed", image.uri);
  };
  const handleFooterToggle = () => {
    setToggle(!isToggled);
  }
  const FooterToggle = () => {
    return isToggled ? (<ImageFooter />) : (<RenderEdit />)
  }
  //修改畫面
  const RenderEdit = () => {
    const { height } = Dimensions.get('window')
    return (
      // <View ref={() => _panel.show}>
      <View >
        < TouchableOpacity activeOpacity={0.2} focusedOpacity={0.5} styles={{ flex: 1, }}>
          <View >
            <Text styles={{ margin: 50, color: "cyan", zIndex: 20, fontSize: 30, backgroundColor: "gray" }} >button</Text>
          </View>
        </TouchableOpacity >
        <SlidingUpPanel
          // ref={c => (set_panel(c))}
          ref={c => (panel_catch = c)}
          draggableRange={{ top: height / 1.75, bottom: 120 }}
          showBackdrop={true}
        >
          <View style={styles.panel}>

            <View style={styles.panelHeader}>
              <Text style={{ color: 'transparent' }}>Tag</Text>
            </View>
            <View style={styles.container}>
              <Text>Bottom</Text>
              < TouchableOpacity activeOpacity={0.2} focusedOpacity={0.5} >
                <View >
                  <Text >button</Text>
                </View>
              </TouchableOpacity >
            </View>

            <View style={styles.panelHeader}>
              <Text style={{ color: 'transparent' }}>Description</Text>
            </View>
            <View style={styles.container}>
              < TouchableOpacity activeOpacity={0.2} focusedOpacity={0.5} >
                <View >
                  <Text >button</Text>
                </View>
              </TouchableOpacity >
              <Text>Bottom</Text>
            </View>
          </View>

        </SlidingUpPanel>


        <View style={styles.footerEdit} >
          {/* <Text style={styles.text}>{`${imageIndex + 1} / ${imagesCount}`}</Text> */}
          < TouchableOpacity activeOpacity={0.2} focusedOpacity={0.5} >
            <View >
              <Text style={styles.footerText}>delete</Text>
            </View>
          </TouchableOpacity >
          <TouchableOpacity activeOpacity={0.2} focusedOpacity={0.5}>
            <View >
              <Text style={styles.footerText}>like</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.2}
            focusedOpacity={0.5}
            onPress={handleFooterToggle}
          >
            <View >
              <Text style={styles.footerText}>detail</Text>
            </View>
          </TouchableOpacity>
        </View >
      </View >
    )
  };
  //原本的footer，只有三個按鈕
  const ImageFooter = () => {
    return (
      <View style={styles.footerRoot} >
        {/* <Text style={styles.text}>{`${imageIndex + 1} / ${imagesCount}`}</Text> */}
        < TouchableOpacity activeOpacity={0.2} focusedOpacity={0.5} >
          <View >
            <Text style={styles.footerText}>delete</Text>
          </View>
        </TouchableOpacity >
        <TouchableOpacity activeOpacity={0.2} focusedOpacity={0.5}>
          <View >
            <Text style={styles.footerText}>like</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.2}
          focusedOpacity={0.5}
          onPress={handleFooterToggle}
        >
          <View >
            <Text style={styles.footerText}>detail</Text>
          </View>
        </TouchableOpacity>
      </View >
    )
  }
  return (
    <SafeAreaView style={styles.root}>
      <ImageList
        images={travel.map((image) => image.thumbnail)}
        onPress={(index) => onSelect(travel, index)}
        shift={0.25}
      />
      <ImageList
        images={architecture.map((image) => image.thumbnail)}
        onPress={(index) => onSelect(architecture, index)}
        shift={0.75}
      />
      {/* <View style={styles.about}>
        <Text style={styles.name}>[ react-native-image-viewing ]</Text>
      </View> */}
      <ImageViewing
        images={getImageSource(images)}
        //images={images}
        backgroundColor="transparent"
        imageIndex={currentImageIndex}
        presentationStyle="overFullScreen"
        visible={isVisible}
        onRequestClose={onRequestClose}
        onLongPress={onLongPress}
        // HeaderComponent={
        //   images === travel
        //     ? ({ imageIndex }) => {
        //       const title = get(images, `${imageIndex}.title`);
        //       return (
        //         <ImageHeader title={title} onRequestClose={onRequestClose} />
        //       );
        //     }
        //     : undefined
        // }
        FooterComponent={({ imageIndex }) => (
          // <FooterToggle imageIndex={imageIndex} imagesCount={images.length} />
          <FooterToggle />
        )}
      // FooterComponent={{  }}
      />
      <ImageList
        images={food.map((image) => image.thumbnail)}
        onPress={(index) => onSelect(food, index)}
        shift={0.5}
      />
      <ImageList
        images={city.map((image) => image.thumbnail)}
        onPress={(index) => onSelect(city, index)}
        shift={0.75}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "transparent",
    ...Platform.select({
      android: { paddingTop: StatusBar.currentHeight },
      default: null,
      zIndex: 0
    }),
  },
  about: {
    flex: 1,
    marginTop: -12,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "200",
    color: "#FFFFFFEE",
  },
  footerRoot: {
    backgroundColor: 'orange',
    flexDirection: 'row',
    padding: 10,
    paddingBottom: 15,
    alignItems: "center",
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 25,
    color: "#FFF"
  },
  footerEdit: {
    backgroundColor: 'red',
    flexDirection: 'row',
    padding: 10,
    paddingBottom: 15,
    alignItems: "center",
    justifyContent: 'space-between',
  },
  container: {
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    height: '20%'
  },
  dragHandler: {
    alignSelf: 'stretch',
    height: '5%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ccc'
  },
  panel: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative'
  },
  panelHeader: {
    height: 40,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center'
  },

});

