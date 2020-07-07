import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  FlatList,
} from 'react-native';

export default class Album extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [
        {id:1, title: "Product 1",  count:4, image:"https://lorempixel.com/400/200/nature/6/"},
        {id:2, title: "Product 2",  count:4, image:"https://lorempixel.com/400/200/nature/5/"} ,
        {id:3, title: "Product 3",  count:4, image:"https://lorempixel.com/400/200/nature/4/"}, 
        {id:4, title: "Product 4",  count:4, image:"https://lorempixel.com/400/200/nature/6/"}, 
        {id:5, title: "Product 5",  count:4, image:"https://lorempixel.com/400/200/sports/1/"}, 
        {id:6, title: "Product 6",  count:4, image:"https://lorempixel.com/400/200/nature/8/"}, 
        {id:7, title: "Product 7",  count:4, image:"https://lorempixel.com/400/200/nature/1/"}, 
        {id:8, title: "Product 8",  count:4, image:"https://lorempixel.com/400/200/nature/3/"},
        {id:9, title: "Product 9",  count:4, image:"https://lorempixel.com/400/200/nature/4/"},
        {id:9, title: "Product 10", count:4, image:"https://lorempixel.com/400/200/nature/5/"},
       // {id:9, title: "Product 10", count:4, image:""},
        //{id:9, title: "Product 10", count:4, image:""},
      ]
    };
  }

  addProductToCart = () => {
    Alert.alert('Success', 'The product has been added to your cart')
  }

  render() {
    return ( 
        <View style={styles.container}>
          <FlatList style={styles.list}
            contentContainerStyle={styles.listContainer}
            data={this.state.data}
            horizontal={false}
            numColumns={2}
            keyExtractor= {(item) => {
              return item.id;
            }}
            ItemSeparatorComponent={() => {
              return (
                <View style={styles.separator}/>
              )
            }}
            renderItem={(post) => {
              const item = post.item;
              return (
                <View style={styles.card}>
                  <View style={styles.imageContainer}>
                    <Image style={styles.cardImage} source={{uri:item.image}}/>
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.count}>{item.count}</Text>
                  
                  </View>
                </View>
              )

            }}/>
        </View>
      );
    
    }
  }

const styles = StyleSheet.create({
  container:{
    flex:1,
    marginTop:20,
  },
  list: {
    paddingHorizontal: 10,
  },
  listContainer:{
    alignItems:'center'
  },
  separator: {
    marginTop: 10,
  },
  /******** card **************/
  card:{
    marginVertical: 8,
    //backgroundColor:"white",
    flexBasis: '45%',
    marginHorizontal: 10,
  },
  cardContent: {
    paddingVertical: 17,
    justifyContent: 'space-between',
  },
  cardImage:{
    flex: 1,
    height: 150,
    width: null,
    borderRadius: 40,
    overflow: "hidden",
  },
  imageContainer:{
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
  /******** card components **************/
  title:{
    fontSize:18,
    flex:1,
    color:"#778899"
  },
  count:{
    fontSize:18,
    flex:1,
    color:"#B0C4DE"
  },
});  