
import React from 'react';
import { Dimensions, StyleSheet, Text, View, PanResponder, Animated,Image } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const cards = [

  { id: '1',color:'#91cef0'},
  { id: '2',color:'#7FE8BA'},
  { id: '3',color:'#C1A56C'},
  { id: '4',color:'#D2906B'}

]
export default class App extends React.Component {

  constructor(){
    super()

    
    this.position = new Animated.ValueXY()
    this.state = {
      currentIndex : 0
    }
    this.PanResponder = PanResponder.create({

      onStartShouldSetPanResponder:(evt, gestureState) => true,
      onPanResponderMove : (evt, gestureState) => {

        this,this.position.setValue({x : gestureState.dx, y: gestureState.dy})
      },
      onPanResponderRelease:(evt,gestureState) => {

        if(gestureState.dx >120)
        {
          Animated.spring(this.position,{
            toValue:{
              x:SCREEN_WIDTH+100,y:gestureState.dy
            },
            useNativeDriver: true
          }).start(() => {
            this.setState({currentIndex:this.state.currentIndex+1},() =>{
              this.position.setValue({x:0,y:0})
            })
          })
        }
        else if(gestureState.dx <-120)
        {
          Animated.spring(this.position,{
            toValue:{
              x:-SCREEN_WIDTH-100,y:gestureState.dy
            },
            useNativeDriver:true
          }).start(() => {
            this.setState({currentIndex:this.state.currentIndex+1},() =>{
              this.position.setValue({x:0,y:0})
            })
          })
        }
        else {
          Animated.spring(this.position,{
            toValue : {x:0,y:0},
            friction:4,
            useNativeDriver:true
          }).start()
        }
      }
    })
    this.rotate = this.position.x.interpolate({
      inputRange : [-SCREEN_WIDTH/2,0,SCREEN_HEIGHT/2],
      outputRange : ['-10deg','0deg','10deg'],
      extrapolate : 'clamp'
    })

    this.rotateAndTranslate = {

      transform : [{
        rotate : this.rotate
      },
      ...this.position.getTranslateTransform()
    ]
    }

    this.likeopacity =  this.position.x.interpolate({
      inputRange : [-SCREEN_WIDTH/2,0,SCREEN_HEIGHT/2],
      outputRange : [0,0,1],
      extrapolate : 'clamp'
    })

    this.dislikeopacity =  this.position.x.interpolate({
      inputRange : [-SCREEN_WIDTH/2,0,SCREEN_HEIGHT/2],
      outputRange : [1,0,0],
      extrapolate : 'clamp'
    })

    this.nextCardopacity =  this.position.x.interpolate({
      inputRange : [-SCREEN_WIDTH/2,0,SCREEN_HEIGHT/2],
      outputRange : [1,0,1],
      extrapolate : 'clamp'
    })

    this.nextCardScale =  this.position.x.interpolate({
      inputRange : [-SCREEN_WIDTH/2,0,SCREEN_HEIGHT/2],
      outputRange : [1,0.8,1],
      extrapolate : 'clamp'
    })
  }
  // componentWillUnmount(){

  //   this.PanResponder = PanResponder.create({

  //     onStartShouldSetPanResponder:(evt, gestureState) => true,
  //     onPanResponderMove : (evt, gestureState) => {

  //       this,this.position.setValue({x : gestureState.dx, y: gestureState.dy})
  //     },
  //     onPanResponderRelease:(evt,gestureState) => {

  //     }
  //   })
  // }

  renderCards = () => {

    return cards.map((item,i) => {

      if( i< this.state.currentIndex){
        return null;
      }
      else if(i == this.state.currentIndex){

      return (
        <Animated.View 
        {...this.PanResponder.panHandlers}
        key={item.id} 
        style={[this.rotateAndTranslate,{height:SCREEN_HEIGHT-120, width:SCREEN_WIDTH-20, backgroundColor:item.color,borderRadius:20,position:'absolute',marginHorizontal:10}]}>

          <Animated.View style={{opacity:this.likeopacity,transform:[{rotate:'-30deg'}],
        position:'absolute',top:50, left:40, zIndex:1000}}>
           <Image source={require('./assets/green.png')} style={{padding:10}}/>
          </Animated.View>

          <Animated.View style={{opacity:this.dislikeopacity,transform:[{rotate:'30deg'}],
        position:'absolute',top:50, right:40, zIndex:1000}}>
           <Image source={require('./assets/red.png')} style={{padding:10}}/>
          </Animated.View>

        </Animated.View>

      )
      
    }
    else{

      return (
        <Animated.View 
       
        key={item.id} 
        style={[{opacity:this.nextCardopacity,transform:[{scale:this.nextCardScale}]},{height:SCREEN_HEIGHT-120, width:SCREEN_WIDTH-20, backgroundColor:item.color,borderRadius:20,position:'absolute',marginHorizontal:10}]}>
        </Animated.View>

      )
      
    }
    }).reverse();
  }

  render(){
  return (
    <View style={styles.container}>
      <View style={{height:60}}>

      </View>
      <View style={{flex:1,padding:10}}>

        {this.renderCards()}
       
      </View>
      <View style={{height:60}}>

      </View>
    </View>
  );}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
});



// 
// #7FE8BA
// #C1A56C
// #D2906B