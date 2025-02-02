import { combineReducers } from 'redux'

import active from './active.reducer'
import user from './user.reducer'
import roleMode from '../role.redux'

const reducers = combineReducers({
  active,
  user,
  roleMode,
})

export default reducers
