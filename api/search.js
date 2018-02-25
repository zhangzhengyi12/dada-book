import { catchBook } from './catch'

const searchBookList = function(val, source, offset) {
  return new Promise((resolve, reject) => {
    let searchURL = `${source.searchUrlInner}?${source.searchKey}=${val}`
    // 如果需要增加page参数
    if (offset) {
      searchURL += `&${source.searchPageKey}=${offset}`
    }
    fetch(searchURL, {
      method: 'GET'
    }).then(
      res => {
        resolve(catchBook(res._bodyInit, source))
      },
      err => {
        console.log(err)
      }
    )
  })
}

export { searchBookList }
