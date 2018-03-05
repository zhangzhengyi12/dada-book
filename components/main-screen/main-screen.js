import React, { Component } from 'react'
import { Platform, StyleSheet, StatusBar, Text, View, Button, Image, TouchableOpacity, TouchableNativeFeedback } from 'react-native'
import store from 'react-native-simple-store'
import { readerBook } from '../../redux/actions/actions'
import { connect } from 'react-redux'
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
class Main extends Component {
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
  componentWillMount() {
    let bookLib = store.get('bookLib').then(res => {
      if (!res) return
      this.props.dispatch(readerBook(res.bookLib))
    })
  }
  _RenderBooks() {
    return this.props.bookLib.map((item, index) => {
      return (
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('Reader', { book: item })
          }}
          key={index}
          style={{ width: 110, marginTop: 5, marginLeft: 5, marginRight: 5 }}
        >
          <Image
            style={{
              width: 110,
              height: 150
            }}
            source={{ uri: item.icon }}
          />
          <Text>{item.name}</Text>
        </TouchableOpacity>
      )
    })
  }
  render() {
    let books = this._RenderBooks()
    return (
      <View style={styles.books}>
        <StatusBar backgroundColor="#f4511e" translucent={true} hidden={true} animated={true} />
        {books}
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
  },
  books: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  }
})

const mapStateToProps = state => ({
  bookLib: state.dadaBook.bookLib
})

export default connect(mapStateToProps)(Main)
