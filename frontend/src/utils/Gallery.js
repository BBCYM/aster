import {
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
    TouchableOpacity,
} from 'react-native';
import ImageCarousel from 'react-native-image-carousel';
import React, { Component } from 'react';
const urls = [
    'https://www.teepr.com/wp-content/uploads/2019/06/15533156982868.jpg',
    'https://i.imgur.com/UZx3tUf.jpeg',
    'https://i.imgur.com/3fn7qRY.jpeg',
    'https://i.imgur.com/Ncwtf7L.jpeg'
];

class App extends Component {

    componentDidMount() {
        StatusBar.setBarStyle('dark-content');
    }

    captureImageCarousel = (imageCarousel) => {
        this.imageCarousel = imageCarousel;
    };

    handleHeaderPress = () => (this.imageCarousel).close();

    ToGalleryDetail = () => {
        const { navigation } = this.props;
        navigation.navigate('GalleryDetail')
    }

    ToNormalPanel = () => {
        const { navigation } = this.props;
        navigation.navigate('NormalPanel')
    }

    ToScrollPanel = () => {
        const { navigation } = this.props;
        navigation.navigate('ScrollPanel')
    }

    ToBottomPanel = () => {
        const { navigation } = this.props;
        navigation.navigate('BottomPanel')
    }

    ToUber = () => {
        const { navigation } = this.props;
        navigation.navigate('uber')
    }

    ToImageView = () => {
        const { navigation } = this.props;
        navigation.navigate('ImageView')
    }

    ToImageViewing = () => {
        const { navigation } = this.props;
        navigation.navigate('ImageViewing')
    }

    renderHeader = () => (
        <View style={styles.header}>

            <TouchableWithoutFeedback onPress={this.handleHeaderPress}>
                <View>
                    <Text style={styles.closeText}>{'<'} </Text>
                </View>
            </TouchableWithoutFeedback>
            <Text style={styles.dateText}>
                2020/05/05
            </Text>
            <TouchableWithoutFeedback >
                <View>
                    <Text style={{ color: '#63CCC8', fontSize: 25 }}>Exit</Text>
                </View>
            </TouchableWithoutFeedback>

        </View>
    );

    renderEdit = () => (
        <View style={{ zIndex: 5 }}>
            <View style={{ width: '100%', height: '40%', backgroundColor: 'transparent' }} />
            <View style={{ width: '100%', height: '10%', backgroundColor: 'orange' }} />
            <View style={{ width: '100%', height: '50%', backgroundColor: 'red' }} />
            <Text>i am bobo</Text>
        </View>
    );

    renderFooter = () => (
        < View style={styles.footer} >
            <TouchableOpacity activeOpacity={0.2} focusedOpacity={0.5}>
                <View >
                    <Text style={styles.dltBtn}>delete</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.2} focusedOpacity={0.5}>
                <View >
                    <Text style={styles.likeBtn}>like</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={0.2}
                focusedOpacity={0.5}
                onPress={this.renderEdit}>
                <View >
                    <Text style={styles.detailBtn}>detail</Text>
                </View>
            </TouchableOpacity>
        </View >
    );

    renderImage = (idx) => (
        <Image
            style={StyleSheet.absoluteFill}
            resizeMode={'contain'}
            source={{ uri: urls[idx] }}
        />

    );

    render() {
        return (
            <View style={styles.container}>
                <Text>IMAGES</Text>
                <View>
                    <ImageCarousel
                        ref={this.captureImageCarousel}
                        renderContent={this.renderImage}
                        renderHeader={this.renderHeader}
                        renderFooter={this.renderFooter}
                        zoomEnabled={true}
                    >
                        {urls.map(url => (
                            <Image
                                style={styles.image}
                                key={url}
                                source={{ uri: url, width: 100 }}
                                resizeMode={"contain"}

                            />
                        ))}
                    </ImageCarousel>

                </View>
                <TouchableOpacity
                    style={{ fontsize: 30, padding: 30 }}
                    activeOpacity={0.2}
                    focusedOpacity={0.5}
                    onPress={this.ToGalleryDetail}
                >
                    <View >
                        <Text >change form to GalleryDetail </Text>
                    </View>
                </TouchableOpacity>

                {/* <TouchableOpacity
                    style={{ fontsize: 30, padding: 30 }}
                    activeOpacity={0.2}
                    focusedOpacity={0.5}
                    onPress={this.ToNormalPanel}>
                    <View >
                        <Text >sliding window - normal</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ fontsize: 30, padding: 30 }}
                    activeOpacity={0.2}
                    focusedOpacity={0.5}
                    onPress={this.ToScrollPanel}>
                    <View >
                        <Text >sliding window - scroll</Text>
                    </View>
                </TouchableOpacity> */}

                <TouchableOpacity
                    style={{ fontsize: 30, padding: 30 }}
                    activeOpacity={0.2}
                    focusedOpacity={0.5}
                    onPress={this.ToBottomPanel}>
                    <View >
                        <Text >sliding window - bottom</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={{ fontsize: 30, padding: 30 }} activeOpacity={0.2} focusedOpacity={0.5} onPress={this.ToUber}>
                    <View >
                        <Text >to uber box</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={{ fontsize: 30, padding: 30 }} activeOpacity={0.2} focusedOpacity={0.5} onPress={this.ToImageView}>
                    <View >
                        <Text >to image view</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={{ fontsize: 30, padding: 30 }} activeOpacity={0.2} focusedOpacity={0.5} onPress={this.ToImageViewing}>
                    <View >
                        <Text >to image viewing</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: '100%',
        padding: 10,
        backgroundColor: '#63CCC8',
        zIndex: 2,

    },
    footer: {
        flexDirection: 'row',
        height: '100%',
        padding: 10,
        paddingBottom: 15,
        justifyContent: 'space-between',
        backgroundColor: '#63CCC8',
        zIndex: 2
    },
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    dateText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 25,
    },
    closeText: {
        color: 'white',
        textAlign: 'left',
        fontSize: 25,
        paddingLeft: 10

    },
    footerText: {
        color: 'red',
        textAlign: 'center',
    },
    image: {
        marginRight: 2,
        height: 100,
    },
    detailBtn: {
        fontSize: 25,
        color: 'white',
        paddingRight: '5%'
    },
    dltBtn: {
        fontSize: 25,
        color: 'white',
        paddingLeft: '5%'
    },
    likeBtn: {
        fontSize: 25,
        color: 'white',
    },
});

export default App;