import * as types from './types'
import sources from '../../book-source/main'

const openBook = book => ({ type: types.OPEN_BOOK, book })
const saveBookToLib = book => ({ type: types.SAVE_BOOK, book })
const readerBook = books => {
  // 重新实例化
  books = JSON.parse(books)
  books = books.map((item) => {
    let index = sources.findIndex((s) => {
      return item.sourceId  === s.id 
    })
    item.source = sources[index]
    return item
  })
  return { type: types.READER_BOOKS, books }
}

export { openBook, saveBookToLib, readerBook }
