import React, { Component } from 'react'
import { Platform, StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { formatBatterLevel, formatReaderPercent } from '../common/js/format'
import touchData from '../common/js//reader-touch-data'
const Dimensions = require('Dimensions')
const Vheight = Dimensions.get('window').height
const Vwidth = Dimensions.get('window').width

const TopAndBottomHeight = 20
const TextViewPading = 8

export default class BookPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      eventName: '',
      pos: ''
    }
    this.myPanResponder = {}
  }
  getBattleLevelIcon() {
    let level = this.props.battery
    let iconName = 'battery-empty'
    if (level > 0.8) {
      iconName = 'battery-full'
    } else if (level > 0.6) {
      iconName = 'battery-three-quarters'
    } else if (level > 0.3) {
      iconName = 'battery-half'
    } else if (level > 0.1) {
      iconName = 'battery-quarter'
    }
    return <Icon name={iconName} />
  }
  _pressHandle(e) {
    let touch = new touchData(e.locationX, e.locationY, Vheight - TopAndBottomHeight * 2, Vwidth)
    if (touch.isRight()) {
      this.props.touchRight()
    } else if (touch.isMiddle()) {
      this.props.touchMiddle()
    } else if (touch.isLeft()) {
      this.props.touchLeft()
    }
  }
  _prevPage() {
    let index = this.state.pageIndex
    index--
    if (index <= 0) {
      index = 0
    }
    this.setState({
      pageIndex: index
    })
  }
  _nextPage() {
    let index = this.state.pageIndex
    index++
    if (index < this.state.chapterDetail.length) {
      this.setState({
        pageIndex: index
      })
      if (this.state.chapterDetail.length - index < 4) {
        // 快读完了 通知一下加载下一章
        this.props.loadMoreChapter()
      }
    } else {
      // 已经读完了 更换下一章节
      this.props.toggleNextChapter()
    }
  }
  _renderPage(flatbookData) {
    return (
      <View key={flatbookData.index} style={{ width: Vwidth - 16 }}>
        <Text style={{ flex: 1, fontSize: this.props.options.fontSize, lineHeight: this.props.options.lineHeight }}>
          {flatbookData.item}
        </Text>
      </View>
    )
  }
  _renderContent() {
    if (!this.props.content) {
      return (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text style={{marginTop:200,color:this.props.colorTheme.font}}>正在加载，请稍候</Text>
        </View>
      )
    } else {
      let options = this.props.options
      let chapterDetail = this.props.content
      let pageIndex = this.props.pageIndex
      return (
        <TouchableOpacity onPress={({ nativeEvent: e }) => this._pressHandle(e)} style={styles.content} activeOpacity={1}>
          <View {...this.myPanResponder.panHandlers}>
            <Text style={{ fontSize: options.fontSize, lineHeight: options.lineHeight,color:this.props.colorTheme.font }}>{chapterDetail[pageIndex]}</Text>
          </View>
        </TouchableOpacity>
      )
    }
  }
  render() {
    let batterIconContent = this.getBattleLevelIcon()
    let theme = this.props.colorTheme
    return (
      <View style={{backgroundColor:theme.back}}>
        <View style={styles.headerTips}>
          <Text style={[styles.tips,{color:theme.font}]}>{this.props.bookName}</Text>
          <Text style={[styles.tips,{color:theme.font}]}>{this.props.chapterName}</Text>
        </View>
        <View style={{ height: Vheight - TopAndBottomHeight * 2 }}>{this._renderContent()}</View>
        <View style={styles.bottomTips}>
          <Text style={[styles.tips, styles.battery, styles.bottomBattery]}>
            <Text style={{color:theme.font}}>{batterIconContent}</Text>
            <Text style={{color:theme.font}} >{formatBatterLevel(this.props.battery)}</Text>
            {this.props.leftTips}
          </Text>
          <Text style={[styles.tips,{color:theme.font}]}>{formatReaderPercent(this.props.percent)}%</Text>
          <Text style={[styles.tips, styles.bottomLRTips, styles.bottomTime,{color:theme.font}]}>{this.props.time}</Text>
        </View>
        <View />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  headerTips: {
    height: TopAndBottomHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 5,
    paddingLeft: 5
  },
  content: {
    height: Vheight - 40,
    paddingLeft: TextViewPading,
    paddingRight: TextViewPading
  },
  bottomTips: {
    height: TopAndBottomHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 5,
    paddingLeft: 5
  },
  tips: {
    fontSize: 12
  },
  bottomTime: {
    alignContent: 'flex-end'
  },
  bottomBattery: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  battery: {
    alignContent: 'center'
  }
})
