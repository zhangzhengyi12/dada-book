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
    default:
      return state
  }
}

export default combineReducers({
  dadaBook
})
