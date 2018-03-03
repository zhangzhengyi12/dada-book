import { StackNavigator } from 'react-navigation'
import React, { Component } from 'react'
import MainScreen from './components/main-screen/main-screen'
import Options from './components/options/options'
import Search from './components/search/search'
import { Provider } from 'react-redux'
import Reader from './components/reader/reader'
import store from './redux/store/store'
import { Platform, StyleSheet, Text, View, Button } from 'react-native'

const MainStack = StackNavigator(
  {
    Options: {
      screen: Options
    },
    Main: {
      screen: MainScreen
    }
  },
  {
    initialRouteName: 'Main',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#f4511e'
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontSize: 18
      }
    }
  }
)

const RootStack = StackNavigator(
  {
    Main: {
      screen: MainStack
    },
    Search: {
      screen: Search
    },
    Reader: {
      screen: Reader
    }
  },
  {
    headerMode: 'none'
  }
)
export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <RootStack />
      </Provider>
    )
  }
}

