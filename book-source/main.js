export default (sourceList = [
  {
    bookAuthor: book =>
      book
        .find('.result-game-item-info .result-game-item-info-tag')
        .eq(0)
        .find('span')
        .eq(1)
        .text(),
    bookCategory: book =>
      book
        .find('.result-game-item-info .result-game-item-info-tag')
        .eq(1)
        .find('span')
        .eq(1)
        .text(),
    bookDesc: book => book.find('.result-game-item-desc').text(),
    bookIcon: book => book.find('.result-game-item-pic-link-img').attr('src'),
    bookLastChapterName: book => book.find('a.result-game-item-info-tag-item').text(),
    bookName: book => book.find('.result-game-item-title-link').attr('title'),
    bookUpdateTime: book =>
      book
        .find('.result-game-item-info .result-game-item-info-tag')
        .eq(2)
        .find('span')
        .eq(1)
        .text(),
    bookUrl: '@.result-game-item-title-link@0@abs:href',
    books: '.result-item',
    chapterName: '@@@',
    chapterUrl: '@@@abs:href',
    chapters: '#list dl dd a',
    checked: true,
    content: '@#content@0@',
    contentReplace: '[{"first":"\\\\(.*?高速全文字在线阅读！","second":""}]',
    enabled: true,
    encoding: 'gbk',
    host: 'http://www.1xiaoshuo.com',
    indexUrl: '/',
    name: 'E小说',
    order: 0,
    searchEncoding: 'UTF-8',
    searchMore: book => book.find('.search-result-page-main a').length > 2,
    searchMoreHref: '@a@0@abs:href',
    searchUrl: 'http://zhannei.baidu.com/cse/search?q\u003d%s\u0026p\u003d0\u0026s\u003d5166625242981005405\u0026area\u003d1',
    searchUrlInner: 'https://www.zwda.com/search.php',
    searchKey: 'keyword',
    searchPageKey: 'page',
    type: 0
  }
])
