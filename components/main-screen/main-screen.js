import React, { Component } from 'react'
import { Platform, StyleSheet, StatusBar, Text, View, Button, Image, TouchableOpacity, TouchableNativeFeedback } from 'react-native'

class RightMenu extends Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onclick}>
        <View style={styles.search}>
          <Image source={require('./search.png')} style={styles.searchImg} />
        </View>
      </TouchableOpacity>
    )
  }
}

export default class Main extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: '达达看书',
      headerRight: (
        <RightMenu
          onclick={() => {
            navigation.navigate('Search')
          }}
        />
      )
    }
  }
  render() {
    return (
      <View>
        <StatusBar backgroundColor="#f4511e" translucent={true} hidden={true} animated={true} />
        <Text>这里是主屏幕</Text>
        <Text>我觉得其实OK</Text>
        <Button title="Go to Details" onPress={() => this.props.navigation.navigate('MyModal')} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  searchImg: {
    width: 25,
    height: 25
  },
  search: {
    paddingTop: 15,
    paddingRight: 15,
    paddingBottom: 15,
    paddingLeft: 15
  }
})
