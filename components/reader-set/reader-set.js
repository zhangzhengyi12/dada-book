import React, { Component } from 'react'
import { Platform, StyleSheet,View,Text,TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

class ReaderSet extends Component { 
  render() {
    let colorTheme = this.props.colorTheme.map((item, index) => {
      let color = item.back
      return <TouchableOpacity onPress={()=>{this.props.onChangeColorTheme(index)}} key={index}><View style={{height:36,width:36,backgroundColor:color,marginRight:10,borderRadius:18}}></View></TouchableOpacity>
    })
    return <View style={setStyle.main}>
      <View style={setStyle.fontGroup}>
        <TouchableOpacity style={setStyle.fontBtn} onPress={()=>{this.props.increaseFont()}}>
          <Text style={setStyle.font}>Aa +</Text>
        </TouchableOpacity>
        <TouchableOpacity style={setStyle.fontBtn} onPress={()=>{this.props.narrowFont()}}>
          <Text style={setStyle.font}>Aa -</Text>
        </TouchableOpacity>
      </View>
      <View style={setStyle.backgroundColorGruop}>
       {colorTheme}
     </View> 
    </View>
  }  
}

const setStyle = StyleSheet.create({
  main: {
    height: 90,
    backgroundColor: '#424242',
    zIndex: 100,
    flexDirection: 'column',
    paddingLeft: 5,
    paddingRight:5
  },
  fontGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop:10
  },
  backgroundColorGruop: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
    paddingLeft:5
  },
  fontBtn: {
    flex:1,
    width:100,
    marginRight: 10,
    marginLeft: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems:'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius:5
  },
  font: {
    color: '#e0e0e0',
    fontSize:16
  }
})

export default ReaderSet