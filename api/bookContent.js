import { catchBookChapterList, catchBookChapterContent } from './catch'
import iconv from 'iconv-lite'
import { Buffer } from 'buffer'
import axios from 'axios'

const getBookChapterList = function(book) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: book.url,
      responseType: 'arraybuffer'
    }).then(
      res => {
        let dom = iconv.decode(new Buffer(res.data), book.source.encoding)
        resolve(catchBookChapterList(dom, book.source))
      },
      err => {
        reject(err)
      }
    )
  })
}

const getBookChapter = function(chapter, book) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: chapter.url,
      responseType: 'arraybuffer'
    }).then(
      res => {
        let dom = iconv.decode(new Buffer(res.data), book.source.encoding)
        resolve(catchBookChapterContent(dom, book.source))
      },
      err => {
        reject(err)
      }
    )
  })
}

export { getBookChapterList, getBookChapter, catchBookChapterContent }
