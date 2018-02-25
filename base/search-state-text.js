import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
export default class SearchStateText extends Component {
  render() {
    const currentState = this.props.current
    const currentView = this.viewMap[currentState]
    return <currentView />
  }
}
