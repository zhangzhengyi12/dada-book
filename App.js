import { StackNavigator } from 'react-navigation'
import React, { Component } from 'react'
import MainScreen from './components/main-screen/main-screen'
import Options from './components/options/options'
import Search from './components/search/search'
import { Platform, StyleSheet, Text, View, Button } from 'react-native'

class ModalScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 30 }}>This is a modal!</Text>
        <Button onPress={() => this.props.navigation.goBack()} title="Dismiss" />
      </View>
    )
  }
}

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
    MyModal: {
      screen: ModalScreen
    },
    Search: {
      screen: Search
    }
  },
  {
    headerMode: 'none'
  }
)
export default class App extends React.Component {
  render() {
    return <RootStack />
  }
}
