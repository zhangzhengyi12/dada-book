import cheerio from 'cheerio-without-node-native'
import { Book } from './bookData'

function catchBook(dom, source) {
  const $ = cheerio.load(dom)
  const result = []
  // 获取基本BOOK节点
  let books = $(source.books)
  if (!books || books.length === 0) {
    return null
  }
  books.map(index => {
    let book = books.eq(index)
    result.push(
      new Book({
        name: source.bookName(book),
        icon: source.bookIcon(book),
        lastChapterName: source.bookLastChapterName(book),
        author: source.bookAuthor(book),
        category: source.bookCategory(book),
        desc: source.bookDesc(book),
        uptime: source.bookUpdateTime(book),
        source: source
      })
    )
  })
  // 检查是否拥有更多搜索结果
  let searchMore = source.searchMore($('body'))
  return {
    books: result,
    searchMore
  }
}

export { catchBook }
