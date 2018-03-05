import store from 'react-native-simple-store'
function combineObj(...args) {
  return Object.assign(...args)
}

const openBook = (state, action) => {
  return combineObj({}, state, { currentBook: action.book })
}

const saveBook = (state, action) => {
  let bookLib = state.bookLib
  bookLib.unshift(action.book)
  let str = JSON.stringify(bookLib)
  store.update('bookLib', {
    bookLib: str
  })
  return combineObj({},state,{bookLib})
}

const readerBooks = (state, action) => {
  return combineObj({},state,{bookLib:action.books})
}

export default { openBook,saveBook,readerBooks }
