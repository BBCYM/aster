import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Modal,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import { Overlay, Header, ListItem } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import ImageViewer from 'react-native-image-zoom-viewer';
import PhotoFooter from '../../components/photoComponent'

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      currentId: 0,
      isTagModalVisi: false
    };
  }
  componentDidMount() {
    var that = this;
    let items = Array.apply(null, Array(60)).map((v, i) => {
      return { id: i, src: 'https://unsplash.it/400/400?image=' + (i + 1) };
    });
    var newArr = items.map((v, i) => {
      return { url: v.src }
    })
    that.setState({
      dataSource: items,
      modalSource: newArr,
    });
  }
  showImage(item) {
    this.setState({
      currentImg: item.src,
      currentId: item.id,
      isVisible: true,
    })
  }
  list = [
    {
      title: 'Appointments',
      icon: 'av-timer'
    },
    {
      title: 'Trips',
      icon: 'flight-takeoff'
    },
  ]
  
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Overlay
          isVisible={this.state.isTagModalVisi}
          onBackdropPress={() => { this.setState({ isTagModalVisi: false }) }}
          overlayStyle={styles.overlayStyle}
        >
          <View style={{ flex: 1 }}>
            <Header
              leftComponent={{ icon: 'menu', color: '#fff' }}
              centerComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}
              rightComponent={{ icon: 'home', color: '#fff' }}
            />
            {
              this.list.map((item, i) => (
                <ListItem
                  key={i}
                  title={item.title}
                  leftIcon={{ name: item.icon }}
                  bottomDivider
                  chevron
                />
              ))
            }
          </View>
        </Overlay>
        <Modal visible={this.state.isVisible} transparent={false} onRequestClose={() => this.setState({ isVisible: false, isTagModalVisi: false })}>
          <ImageViewer
            useNativeDriver={true}
            imageUrls={this.state.modalSource}
            index={this.state.currentId}
            enablePreload={true}
            renderIndicator={() => null}
            renderFooter={(currentIndex) => PhotoFooter(this)}
            footerContainerStyle={{ bottom: 0, position: "absolute", zIndex: 1000 }}
          />
        </Modal>
        <FlatList
          data={this.state.dataSource}
          renderItem={({ item }) => (
            <View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
              <TouchableOpacity onPress={() => this.showImage(item)}>
                <FastImage
                  style={styles.imageThumbnail}
                  source={{
                    uri: item.src,
                    priority: FastImage.priority.high,
                  }}
                />
              </TouchableOpacity>
            </View>
          )}
          //Setting the number of column
          numColumns={3}
          keyExtractor={(item, index) => index}
        />
      </View>
    );
  }
}
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
const styles = StyleSheet.create({
  imageThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
  overlayStyle: {
    height: screenHeight * 0.8,
    width: screenWidth * 0.8,
  }
});