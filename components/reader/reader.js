import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  BackHandler,
  StatusBar,
  LayoutAnimation,
  TouchableOpacity,
  Modal,
  FlatList,
  BackAndroid
} from 'react-native'
import BookPage from '../../base/book-page'
import DeviceBattery from 'react-native-device-battery'
import SystemSetting from 'react-native-system-setting'
import Icon from 'react-native-vector-icons/FontAwesome'
import store from 'react-native-simple-store'
import { connect } from 'react-redux'
import { saveBookToLib } from '../../redux/actions/actions'
import ReaderSet from '../reader-set/reader-set'
import { getBookChapterList, getBookChapter } from '../../api/bookContent'
import { formatBookChapterContent } from '../../common/js/format'
const Dimensions = require('Dimensions')
const Vheight = Dimensions.get('window').height
const Vwidth = Dimensions.get('window').width
import KeyEvent from 'react-native-keyevent'
import Toast from '../../base/toast'
// 阅读器基本设置，临时

const ReaderBackgoundColorGroup = ['#cfc29d', '#beebc6', '#fff']
const colorThemes = [
  {
    name: '1',
    back: '#d9d5cf',
    font: '#393831'
  },
  {
    name: '2',
    back: '#383838',
    font: '#cccccc'
  },
  {
    name: '3',
    back: '#e1ded5',
    font: '#555'
  },
  {
    name: '5',
    back: '#dac6a1',
    font: '#191919'
  },
  {
    name: '6',
    back: '#1f4843',
    font: '#bdc9c8'
  },
  {
    name: '7',
    back: '#d8bdbb',
    font: '#4a4539'
  },
  {
    name: '8',
    back: '#2b465b',
    font: '#eaecee'
  }
]

const ReaderOptions = {
  fontSize: 18,
  lineHeight: 20,
  colorTheme: colorThemes[2],
  theme_back: colorThemes[2],
  isNightMode: false
}

const VOL_KEY = {
  UP: 24,
  DOWN: 25
}

const CTRL_BTN_COLOR = '#9e9e9e'

const BOT_CTRL_BTN_MAP = [
  { name: '目录', iconName: 'bars', color: CTRL_BTN_COLOR },
  { name: '缓存', iconName: 'download', color: CTRL_BTN_COLOR },
  { name: '设置', iconName: 'font', color: CTRL_BTN_COLOR },
  { name: '夜间', iconName: 'assistive-listening-systems', color: CTRL_BTN_COLOR }
]

const TopAndBottomHeight = 20
const TextViewPading = 8

class Reader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      batteryLevel: 0,
      time: '00:00',
      book: {},
      pageIndex: 0,
      showContralBar: false,
      showBookChaperList: false,
      caching: false,
      cacheIndex: 0,
      showReaderSet: false,
      ReaderOptions: ReaderOptions,
      showSaveModal: false
    }
    const volumeListener = SystemSetting.addVolumeListener(data => {
      const volume = data
    })
  }
  _timeOutSaveBook() {
    this.timer = setInterval(() => {
      let bookLib = this.props.bookLib
      let index = bookLib.findIndex(item => {
        return item.url === this.state.url
      })
      bookLib[index] === this.state.book
      let str = JSON.stringify(bookLib)
      store.update('bookLib', {
        bookLib: str
      })
    }, 10000)
  }
  _removeTimeOutSaveBook() {
    clearInterval(this.timer)
  }
  componentDidMount() {
    KeyEvent.onKeyDownListener(keyEvent => {
      if (this.state.chapterDetail) {
        if (keyEvent.keyCode === VOL_KEY.UP) {
          this._prevPage()
        }
        if (keyEvent.keyCode === VOL_KEY.DOWN) {
          this._nextPage()
        }
      }
    })
    BackHandler.addEventListener('hardwareBackPress', () => {
      this._onBack()
      return true
    })
    this._timeOutSaveBook()
  }
  componentWillMount() {
    let { book } = this.props.navigation.state.params
    this.setState(
      Object.assign({}, this.state, {
        book
      })
    )
    // 尝试获取阅读器设置
    store.get('ReaderOptions').then(res => {
      if (res.toString() == {}.toString()) return
      res = JSON.parse(res)
      this.setState({
        ReaderOptions: res
      })
    })

    //获取章节列表
    if (book.chapterList && book.chapterList.length !== 0) {
      if (!book.chapters[book.currentChapter]) {
        this._loadMoreChapter(book.currentChapter).then(res => {
          let chapterDetail = this.transformChapterDetail(res)
          this.setState({
            chapterDetail
          })
        })
      } else {
        let chapterDetail = this.transformChapterDetail(book.chapters[book.currentChapter])
        this.setState({
          chapterDetail
        })
      }
    } else {
      this.getBookChapterListData(book)
    }
    this.getBatteryLevel()
    this.getCurrentTime()

    DeviceBattery.addListener(() => {
      this.getBatteryLevel()
    })
    setInterval(() => {
      this.getCurrentTime()
    }, 10000)
  }
  componentWillUnmount() {
    this._removeTimeOutSaveBook()
  }
  _RenderCachePercent() {
    if (!this.state.caching) {
      return null
    }
    let length = this.state.book.chapterList.length
    let currIndex = this.state.cacheIndex
    return <Text>{`正在缓存中 ${currIndex}/length`}</Text>
  }
  _onClickCtrlBtn(name) {
    if (name === '目录') {
      this.setState({
        showBookChaperList: true
      })
    }
    if (name === '缓存') {
      Toast.toastShort('开始缓存！')
      this.setState({
        cacheIndex: 0,
        caching: true
      })
      this._DownLoadBook(0)
    }
    if (name === '设置') {
      this.setState({
        showReaderSet: !this.state.showReaderSet
      })
    }
    if (name === '夜间') {
      let ReaderOptions = this.state.ReaderOptions
      if (ReaderOptions.isNightMode) {
        ReaderOptions.isNightMode = false
        ReaderOptions.colorTheme = ReaderOptions.theme_back
      } else {
        ReaderOptions.isNightMode = true
        ReaderOptions.theme_back = ReaderOptions.colorTheme
        ReaderOptions.colorTheme = colorThemes[1]
      }
      this.setState({
        ReaderOptions
      })
      this._updateReaderOptions()
    }
  }
  _updateReaderOptions() {
    let options = JSON.stringify(this.state.ReaderOptions)
    console.log(options + 'yes up op');
    store.update('ReaderOptions',options)
  }
  _ChangeColorTheme(index) {
    let ReaderOptions = this.state.ReaderOptions
    ReaderOptions.colorTheme = colorThemes[index]
    this.setState({
      ReaderOptions
    })
    this._updateReaderOptions()
  }
  _increaseFont() {
    let ReaderOptions = this.state.ReaderOptions
    ReaderOptions.fontSize++
    ReaderOptions.lineHeight = parseInt(ReaderOptions.fontSize + ReaderOptions.fontSize / 9)
    if (ReaderOptions.fontSize > 50) {
      Toast.toastShort('这也太大了吧！')
      return
    }
    let formatContentData = {
      vw: Vwidth - TextViewPading * 2,
      vh: Vheight - TopAndBottomHeight * 2,
      fz: ReaderOptions.fontSize,
      lh: ReaderOptions.lineHeight
    }
    let chapterDetail = this.transformChapterDetail(this.state.book.chapters[this.state.book.currentChapter], formatContentData)
    this.setState({
      chapterDetail
    })
    this._updateReaderOptions()
  }
  _narrowFont() {
    let ReaderOptions = this.state.ReaderOptions
    ReaderOptions.fontSize--
    ReaderOptions.lineHeight = parseInt(ReaderOptions.fontSize + ReaderOptions.fontSize / 9)
    // 重新计算页面
    if (ReaderOptions.fontSize < 10) {
      Toast.toastShort('这也太小了吧！')
      return
    }
    let formatContentData = {
      vw: Vwidth - TextViewPading * 2,
      vh: Vheight - TopAndBottomHeight * 2,
      fz: ReaderOptions.fontSize,
      lh: ReaderOptions.lineHeight
    }
    let chapterDetail = this.transformChapterDetail(this.state.book.chapters[this.state.book.currentChapter], formatContentData)
    this.setState({
      ReaderOptions,
      chapterDetail
    })
    this._updateReaderOptions()
  }
  _renderCtrlBtn(name, iconName, color, clickHandle) {
    return (
      <TouchableOpacity
        onPress={() => {
          clickHandle(name)
        }}
      >
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color, marginBottom: 5 }}>{name}</Text>
          <Icon name={iconName} size={15} color={color} />
        </View>
      </TouchableOpacity>
    )
  }
  _renderContralBar() {
    let btnGroup = BOT_CTRL_BTN_MAP.map(btn => {
      return <View key={btn.name}>{this._renderCtrlBtn(btn.name, btn.iconName, btn.color, n => this._onClickCtrlBtn(n))}</View>
    })
    let middHeight = this.state.showReaderSet ? Vheight - 160 : Vheight - 70
    return (
      <View style={{ position: 'absolute' }}>
        <View style={ctrlBarStyles.TopBar}>
          <View style={ctrlBarStyles.mainBar}>
            {!this.state.showBookChaperList && (
              <TouchableOpacity
                onPress={() => {
                  this._onBack()
                }}
              >
                <Icon
                  style={{ paddingBottom: 5, paddingTop: 5, paddingLeft: 10, paddingRight: 10 }}
                  name="chevron-left"
                  size={20}
                  color="#e0e0e0"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={{ height: middHeight }} />
        {this.state.showReaderSet && (
          <ReaderSet
            colorTheme={colorThemes}
            onChangeColorTheme={i => {
              this._ChangeColorTheme(i)
            }}
            increaseFont={() => {
              this._increaseFont()
            }}
            narrowFont={() => {
              this._narrowFont()
            }}
          />
        )}
        <View style={ctrlBarStyles.botBar}>{btnGroup}</View>
      </View>
    )
  }
  getBatteryLevel() {
    DeviceBattery.getBatteryLevel().then(level => {
      this.setState({
        batteryLevel: level
      })
    })
  }
  getBookChapterListData(book) {
    getBookChapterList(book).then(
      chapterList => {
        book.chapterList = chapterList
        this.setState({
          book
        })
        this.getChapterContent(book.currentChapter, book)
      },
      err => {
        Toast.toastShort('获取章节列表失败！')
      }
    )
  }
  getChapterContent(chapterIndex, book) {
    return new Promise((resolve, reject) => {
      getBookChapter(book.chapterList[chapterIndex], book).then(
        res => {
          book.chapters[chapterIndex] = res
          this.setState({
            book
          })
          if (!this.state.chapterDetail) {
            this.setState({
              chapterDetail: this.transformChapterDetail(res)
            })
          }
          resolve(res)
        },
        err => {
          Toast.toastShort('获取章节失败，尝试重新获取')
          // 重新获取
          this.getChapterContent(chapterIndex, book)
        }
      )
    })
  }
  transformChapterDetail(content, formatData) {
    let formatContentData = {
      vw: Vwidth - TextViewPading * 2,
      vh: Vheight - TopAndBottomHeight * 2,
      fz: this.state.ReaderOptions.fontSize,
      lh: this.state.ReaderOptions.lineHeight
    }
    return formatBookChapterContent(content, formatData ? formatData : formatContentData)
  }
  getCurrentTime() {
    this.setState({
      time: new Date().Format('hh:mm')
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
        this._loadMoreChapter(this.state.book.currentChapter + 1)
      }
    } else {
      this._toggleNextChapter(this.state.book.currentChapter)
    }
  }
  _prevPage() {
    let index = this.state.pageIndex
    index--
    if (index >= 0) {
      this.setState({
        pageIndex: index
      })
    } else {
      this._togglePrevChapter()
    }
  }
  _togglePrevChapter() {
    let book = this.state.book
    let chapterIndex = this.state.book.currentChapter - 1
    if (chapterIndex >= 0) {
      book.currentChapter = chapterIndex
      this.setState({
        book
      })
      let content = book.chapters[chapterIndex]
      if (!content) {
        // 获取章节
        this._loadMoreChapter(this.state.book.currentChapter + 1).then(res => {
          let chapterDetail = this.transformChapterDetail(res)
          this.setState({
            chapterDetail,
            pageIndex: chapterDetail.length - 1
          })
        })
      } else {
        let chapterDetail = this.transformChapterDetail(content)
        this.setState({
          chapterDetail,
          pageIndex: chapterDetail.length - 1
        })
      }
    } else {
      Toast.toastShort('当前是第一章！')
    }
  }
  _getCurrentContent() {
    return this.state && this.state.book && this.state.book.chapters && this.state.book.chapters[this.state.book.currentChapter]
      ? this.state.book.chapters[this.state.book.currentChapter]
      : null
  }
  _getBookName() {
    return this.state && this.state.book && this.state.book.name ? this.state.book.name : '爽文'
  }
  _getChapterName() {
    return this.state && this.state.book && this.state.book.chapterList && this.state.book.chapterList[this.state.book.currentChapter].name
      ? this.state.book.chapterList[this.state.book.currentChapter].name
      : '未知章节'
  }
  _getPercent() {
    return this.state.book && this.state.book.chapterList ? this.state.book.currentChapter / this.state.book.chapterList.length : 0
  }
  _toggleNextChapter() {
    let book = this.state.book
    let chapterIndex = this.state.book.currentChapter + 1
    if (chapterIndex < this.state.book.chapterList.length) {
      book.currentChapter = chapterIndex
      this.setState({
        book
      })
      let content = book.chapters[chapterIndex]
      if (!content) {
        this._loadMoreChapter(chapterIndex).then(res => {
          let chapterDetail = this.transformChapterDetail(res)
          this.setState({
            chapterDetail,
            pageIndex: 0
          })
        })
      } else {
        this.setState({
          chapterDetail: this.transformChapterDetail(content),
          pageIndex: 0
        })
      }
    } else {
      Toast.toastShort('当前是最后一章！')
    }
  }
  _toggleContralBar() {
    LayoutAnimation.spring()
    let show = !this.state.showContralBar
    this.setState({
      showContralBar: show
    })
  }
  _onBack() {
    // 需要检测是否已加入
    let index = this.props.bookLib.findIndex(v => this.state.book.url === v.url)
    if (index === -1) {
      this.setState({
        showSaveModal: true
      })
    } else {
      this._back()
    }
  }
  _back() {
    this.props.navigation.goBack()
  }
  _loadMoreChapter(index) {
    return new Promise((resolve, reject) => {
      if (!this.state.book.chapters[index]) {
        // 空章节 尝试获取
        this.getChapterContent(index, this.state.book).then(res => {
          resolve(res)
        })
      }
    })
  }
  _toggleToChapterForIndex(index) {
    let content = this.state.book.chapters[index]
    let book = this.state.book
    book.currentChapter = index
    if (!content) {
      this._loadMoreChapter(index).then(res => {
        let chapterDetail = this.transformChapterDetail(res)
        this.setState({
          chapterDetail,
          book,
          pageIndex: 0
        })
      })
    } else {
      let chapterDetail = this.transformChapterDetail(content)
      this.setState({
        chapterDetail,
        book,
        pageIndex: 0
      })
    }
  }
  _renderChapterList(fdata) {
    let txt = fdata.item.name
    return (
      <TouchableOpacity
        onPress={() => {
          this._toggleToChapterForIndex(fdata.index)
        }}
        style={{ paddingTop: 5, paddingBottom: 5, paddingLeft: 10 }}
      >
        <Text style={fdata.index === this.state.book.currentChapter ? { color: '#aaa' } : { color: '#e0e0e0' }}>{txt}</Text>
      </TouchableOpacity>
    )
  }
  _saveBookToLib() {
    // 尝试插入
    this.props.dispatch(saveBookToLib(this.state.book))
    this._back()
  }
  _DownLoadBook(x) {
    if (x > this.state.book.chapterList.length) {
      // 缓存结束
      this.setState({
        caching: false
      })
    }
    if (this.state.caching) {
      // 已经有任务正在运行，关闭
      return
    }
    if (this.state.book.chapters[x]) {
      // 下一章
      this._DownLoadBook(x + 1)
    }
    this._loadMoreChapter(x).then(
      res => {
        let book = this.state.book
        book.chapters[x] = res
        this.setState({
          book,
          cacheIndex: x
        })
        this._DownLoadBook(x + 1)
      },
      err => {
        this._DownLoadBook(x + 1)
      }
    )
  }
  _hiddChapterList() {
    this.setState({
      showBookChaperList: false
    })
  }
  render() {
    let currentContent = this._getCurrentContent()
    let bookName = this._getBookName()
    let currentChapterName = this._getChapterName()
    let percent = this._getPercent()
    let currentChapterDetail = this.state.chapterDetail
    let pageIndex = this.state.pageIndex
    let cacheTips = this._RenderCachePercent()
    let contralBar = this.state.showContralBar ? this._renderContralBar() : null
    return (
      <View>
        <StatusBar backgroundColor="#424242" translucent={true} hidden={true} animated={true} />
        <Modal
          onRequestClose={() => {
            this._hiddChapterList()
          }}
          style={chapterList.model}
          visible={this.state.showBookChaperList}
          animationType={'fade'}
          transparent={true}
        >
          <StatusBar backgroundColor="#424242" translucent={true} hidden={true} animated={true} />
          <TouchableOpacity
            style={chapterList.model}
            activeOpacity={1}
            onPress={() => {
              this._hiddChapterList()
            }}
          >
            <Text style={{ color: '#e0e0e0', paddingLeft: 10, fontSize: 25, paddingBottom: 10 }}>{this.state.book.name}</Text>
            <FlatList
              data={this.state.book.chapterList}
              getItemLayout={(data, index) => ({ length: this.state.book.chapterList.length, offset: 25 * index, index })}
              keyExtractor={(item, index) => String(index)}
              renderItem={this._renderChapterList.bind(this)}
              initialScrollIndex={this.state.book.currentChapter}
            />
          </TouchableOpacity>
        </Modal>
        <Modal
          visible={this.state.showSaveModal}
          onRequestClose={() => {
            this.setState({
              showSaveModal: false
            })
          }}
          animationType={'none'}
          transparent={true}
        >
          <TouchableOpacity
            style={styles.modal}
            activeOpacity={1}
            onPress={() => {
              this.setState({
                showSaveModal: false
              })
            }}
          >
            <View style={styles.innerView}>
              <Text style={styles.modalTitle}>加入书架</Text>
              <Text style={styles.modalBody}>是否将该爽文加入到书架?</Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  onPress={() => {
                    this._back()
                  }}
                >
                  <Text style={styles.modalButton}>垃圾爽文不加</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this._saveBookToLib()
                  }}
                >
                  <Text style={styles.modalButton}>加他妈的</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
        {contralBar}
        <BookPage
          bookName={bookName}
          chapterName={currentChapterName}
          battery={this.state.batteryLevel}
          time={this.state.time}
          percent={percent}
          colorTheme={this.state.ReaderOptions.colorTheme}
          content={currentChapterDetail}
          options={this.state.ReaderOptions}
          pageIndex={pageIndex}
          leftTips={cacheTips}
          touchRight={() => {
            this._nextPage()
          }}
          touchLeft={() => {
            this._prevPage()
          }}
          touchMiddle={() => {
            this._toggleContralBar()
          }}
        />
      </View>
    )
  }
}

const ctrlBarStyles = StyleSheet.create({
  TopBar: { width: Vwidth, zIndex: 10, backgroundColor: '#424242', position: 'absolute', top: 0 },
  mainBar: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  botBar: {
    height: 70,
    backgroundColor: '#424242',
    zIndex: 10,
    width: Vwidth,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  urlTip: {
    height: 10
  }
})

const chapterList = StyleSheet.create({
  model: {
    width: Vwidth - 100,
    height: Vheight,
    backgroundColor: '#424242',
    position: 'absolute',
    top: 0,
    zIndex: 1000,
    flex: 1,
    marginTop: 10
  }
})

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center'
  },
  innerView: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 4,
    marginLeft: 20,
    marginRight: 20,
    paddingBottom: 10
  },
  modalTitle: {
    fontSize: 16,
    color: '#555',
    paddingLeft: 20,
    paddingTop: 20,
    paddingBottom: 10
  },
  modalBody: {
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 14,
    color: '#555'
  },
  modalButton: {
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 14,
    color: '#f4511e'
  }
})

const mapStateToProps = state => ({
  bookLib: state.dadaBook.bookLib
})
export default connect(mapStateToProps)(Reader)
