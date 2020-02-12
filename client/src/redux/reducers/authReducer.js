//Remember, reducers are functions that take previous state and return new state as a pure function
//Do not mutate existing state

let authReducer = function(code = "", action){
	switch (action.type){
		case 'SET_ACCESS_TOKEN':
			return action.payload['code']
		default:
			return '';
	}
}

export default authReducer;
