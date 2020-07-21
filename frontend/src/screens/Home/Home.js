import React, { Component } from 'react';
import { ButtonGroup  } from 'react-native-elements';
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
      this.state={
        data:[{id:'',title:'',count:'',image:''},
        {id:'',title:'',count:'',image:''},
        ],

        //selectedIndexes:[],
        selected:[]
      };
  
      
    //this.updateIndex = this.updateIndex.bind(this)
  }

 // updateIndex (selectedIndex) {
    //this.setState({selectedIndex})
  //}

  

  componentDidMount() {
    // this._ping()
  }
  
  updateSelected = selected => {
    this.setState({ selected }, () => {
      
        if (this.state.selected[0]){
          //const { navigation } = this.props;
          //navigation.navigate('Allphoto')
          alert('photo')
        }
        else{
          alert('album')
        }
        
    });
  };

  ToAllphoto = () => {
    const { navigation } = this.props;
        navigation.navigate('Allphoto')
  }
  
  

  _ping = async () => {
    // await 必須寫在async函式裡，await makes JavaScript wait until that promise settles and returns its result.
    // 這邊用法是等fetch的伺服器回應我們後才讓結果等於response
    // 可以把fetch看成是ajax，真的很像
    const response = await fetch("http://192.168.43.95:3000/cai", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': "com.rnexparea",
            
        },
        

    })
    // dj back to rn，用到response，一樣先await
    var data = await response.json()
    //var data = JSON.parse(data)
    //var name = JSON.parse(data)

    console.log(data)
    console.log(data.title)


    this.setState({ title: data.title })
    this.setState({ count: data.count })
    this.setState({ image: data.image })
   

  }

  addProductToCart = () => {
    Alert.alert('Success', 'The product has been added to your cart')
  }

  render() {
    const buttons = ['Album', 'Photo']
    const { selectedIndex } = this.state
   
    
    return ( 
        <View style={styles.container}>
          <View style={{ flex: 2 }} >

            <TouchableOpacity onPress={this._ping} activeOpacity={0.2} focusedOpacity={0.5}>
              <View >
                <Text style={styles.button}>    press        </Text>
              </View>
            </TouchableOpacity>
          </View>
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
              const item = post.data;
             return (
                <View style={styles.card}>
                  <View style={styles.imageContainer}>
                    <Image style={styles.cardImage} source={{uri:this.state.image}}/>
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.title}>{this.state.title}</Text>
                    <Text style={styles.count}>{this.state.count}</Text>
                  </View>
                </View>
              )
             }}/>

          
             <View>
          
              <ButtonGroup
              onPress={this.updateSelected }
           
              selectMultiple
              selectedIndexes={this.state.selectedIndexes}
              buttons={buttons}
              containerStyle={{height: 40,borderRadius:50,marginLeft:70,marginRight:70}}
              buttonContainerStyle={{opacity:0.5}}
              style={styles.buttongroup}
            />
            </View>  
        
             
        </View>
        
   );  
    
    }
    
  }

const styles = StyleSheet.create({
  container:{
    flex:1,
    marginTop:30,
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