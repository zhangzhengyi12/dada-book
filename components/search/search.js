import React, { Component } from 'react'
import { Platform, StyleSheet, Text, View, TextInput, TouchableNativeFeedback, FlatList, Image, Picker } from 'react-native'
import sourcesList from '../../book-source/main'
import BookPreView from '../../base/book-preview'
import SearchStateText from '../../base/search-state-text'
import { searchBookList } from '../../api/search'
import { EatBeanLoader } from 'react-native-indicator'
var Dimensions = require('Dimensions')

const Vheight = Dimensions.get('window').height
const NO_MORE = 'noMore'
const HAS_MORE = 'hasMore'

// 更多结果提示状态表
const SEARCH_MORE_STATE_MAP = {
  init: 0,
  loading: 1,
  noMore: 2,
  loadingTips: 3
}
// 搜索结果状态表

const SEARCH_STATE_MAP = {
  init: 0,
  loading: 1,
  noResult: 2
}

export default class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '',
      currentPage: 0,
      isRefreshing: false,
      source: sourcesList[0],
      books: [],
      noResult: false,
      loading: false,
      error: false,
      searchMore: false,
      currentMoreSearchState: SEARCH_MORE_STATE_MAP.init,
      currentSearchState: SEARCH_STATE_MAP.init
    }
  }
  beforSubmitInitData() {
    this.setState({
      currentSearchState: SEARCH_STATE_MAP.loading,
      books: []
    })
  }
  _onScrollToEnd() {
    if (this.state.searchMore === false) return
    this.setState({
      isRefreshing: true,
      currentMoreSearchState: SEARCH_MORE_STATE_MAP.loading,
      currentPage: this.state.currentPage + 1
    })
    this._getMoreSearchResult()
  }
  _refresh() {
    this.beforSubmitInitData()
    this._searchBooks(this.state.text, this.state.source)
  }
  _GetCurrentView() {
    let content = null
    if (this.state.currentMoreSearchState === SEARCH_MORE_STATE_MAP.loading) {
      content = <Text>正在加载爽文</Text>
    }
    if (this.state.currentMoreSearchState === SEARCH_MORE_STATE_MAP.loadingTips) {
      content = <Text>下拉加载更多爽文</Text>
    }
    if (this.state.currentMoreSearchState === SEARCH_MORE_STATE_MAP.noMore) {
      content = <Text>爽文已经全部加载完毕</Text>
    }
    return <View style={styles.searchStateWrapper}>{content}</View>
  }
  submitHandle() {
    this.beforSubmitInitData()
    this._searchBooks(this.state.text, this.state.source)
  }
  _searchBooks(...args) {
    searchBookList(...args).then(
      res => {
        if (!res || !res.books) {
          this.setState({ currentSearchState: SEARCH_STATE_MAP.noResult, loading: false })
          return
        }
        this.setState({
          searchMore: res.searchMore,
          loading: false,
          refreshing: false,
          books: res.books,
          currentSearchState: SEARCH_STATE_MAP.init
        })
        if (res.searchMore) {
          this.setState({ currentMoreSearchState: SEARCH_MORE_STATE_MAP.loadingTips })
        } else {
          this.setState({ currentMoreSearchState: SEARCH_MORE_STATE_MAP.noMore })
        }
      },
      err => {
        this._onSearchError()
      }
    )
  }
  _getMoreSearchResult() {
    searchBookList(this.state.text, this.state.source, this.state.currentPage).then(
      res => {
        if (!res || !res.books) {
          this.setState({ searchMore: false, isRefreshing: false, currentSearchState: SEARCH_MORE_STATE_MAP.noMore })
          return
        }
        this.setState({ searchMore: res.searchMore, isRefreshing: false, books: this.state.books.concat(res.books) })
        if (res.searchMore) {
          this.setState({ currentMoreSearchState: SEARCH_MORE_STATE_MAP.loadingTips })
        } else {
          this.setState({ currentMoreSearchState: SEARCH_MORE_STATE_MAP.noMore })
        }
      },
      err => {
        this._onSearchError()
      }
    )
  }
  _renderBook(flatbookData) {
    return <BookPreView book={flatbookData.item} key={flatbookData.index} />
  }
  _onSearchError() {
    this.setState({
      noResult: true,
      loading: false,
      books: [],
      error: true
    })
  }
  render() {
    const Picks = sourcesList.map((item, index) => {
      return <Picker.Item label={item.name} value={item} key={index} />
    })
    return (
      <View>
        <View style={styles.searchBar}>
          <TouchableNativeFeedback
            onPress={() => {
              this.props.navigation.goBack()
            }}
          >
            <Image source={require('./back.png')} style={styles.back} />
          </TouchableNativeFeedback>
          <TextInput
            style={styles.searchInput}
            placeholder="搜索你想看的爽文"
            onChangeText={text => this.setState({ text })}
            onSubmitEditing={() => {
              this.submitHandle()
            }}
          />
          <Text>{this.state.source.name}</Text>
          <Picker style={styles.picker} onValueChange={s => this.setState({ source: s })}>
            {Picks}
          </Picker>
        </View>
        <View />
        <View>
          {this.state.currentSearchState === SEARCH_STATE_MAP.loading && (
            <View style={styles.loadingWrapper}>
              <EatBeanLoader color={'#f4511e'} />
              <Text style={styles.loadingText}>正在搜索爽文</Text>
            </View>
          )}
          {this.state.currentSearchState === SEARCH_STATE_MAP.noResult && <Text style={styles.noMore}>没有找到对应结果</Text>}
          {this.state.error && <Text style={styles.noMore}>抱歉，出错了，请重新搜索</Text>}
        </View>
        <View style={styles.bookList}>
          {this.state.books.length !== 0 && (
            <FlatList
              data={this.state.books}
              getItemLayout={(data, index) => ({ length: 150, offset: 150 * index, index })}
              keyExtractor={(item, index) => String(index)}
              renderItem={this._renderBook}
              refreshing={this.state.isRefreshing}
              onRefresh={() => this._refresh()}
              ListFooterComponent={() => this._GetCurrentView()}
              onEndReached={() => this._onScrollToEnd()}
              onEndReachedThreshold={0.2}
            />
          )}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc'
  },
  searchInput: {
    flex: 10,
    height: 50,
    fontSize: 18
  },
  back: {
    height: 20,
    width: 20,
    margin: 5
  },
  picker: {
    width: 30,
    height: 50,
    marginRight: 0
  },
  fPicker: {
    marginTop: 10
  },
  noMore: {
    // flex: 1,
    marginTop: 10,
    width: '100%',
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 10
  },
  loadingWrapper: {
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    paddingTop: 10
  },
  bookList: {
    height: Vheight - 50
  },
  searchStateWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 5,
    paddingBottom: 5
  }
})
