function combineObj(...args) {
  return Object.assign(...args)
}

const openBook = (state, action) => {
  return combineObj({}, state, { currentBook: action.book })
}

export default { openBook }
