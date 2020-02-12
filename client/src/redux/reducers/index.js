import { combineReducers } from 'redux'
import authReducer from './authReducer'

const rootReducer = combineReducers({
	accessToken: authReducer
})

export default rootReducer
