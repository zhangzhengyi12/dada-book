import { combineReducers } from 'redux'
import { openBook } from '../actions/actions'
import initState from '../initState'
import * as types from '../actions/types'
import reducersProcess from './reducers-fns'
// 原始默认state

function dadaBook(state = initState, action) {
  switch (action.type) {
    case types.OPEN_BOOK:
      return reducersProcess.openBook(state, action)
    case types.SAVE_BOOK:
      return reducersProcess.saveBook(state,action)
    case types.READER_BOOKS:
      return reducersProcess.readerBooks(state,action)
    default:
      return state
  }
}

export default combineReducers({
  dadaBook
})
