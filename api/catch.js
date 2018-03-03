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
        source: source,
        url: source.bookUrl(book)
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

function catchBookChapterList(dom, source) {
  const $ = cheerio.load(dom)
  let result = []
  let cplist = $(source.chapters)
  cplist.map(index => {
    let chapter = cplist.eq(index)
    result.push({
      url: source.chapterUrl(chapter),
      name: source.chapterName(chapter)
    })
  })

  return result
}

function catchBookChapterContent(dom, source) {
  const $ = cheerio.load(dom)
  let result = ''
  let content = $(source.content)
  return getContent(content[0], '')
}

function getContent(node, RST) {
  if (node.childNodes === null || node.name === 'br') {
    if (node.name === 'br') {
      return '\n'
    } else if (node.type === 'text') {
      return node.data
    }
  } else {
    let aRST = ''
    node.children.forEach(function(elem, i) {
      aRST += getContent(elem, RST)
    })
    RST += aRST
    return RST
  }
}

export { catchBook, catchBookChapterList, catchBookChapterContent }
