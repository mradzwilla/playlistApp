const constants = {
	SET_ACCESS_TOKEN: 'SET_ACCESS_TOKEN',
}

let actions = {
	storeAccessToken: function(accessToken){
		return{
			type: constants.SET_ACCESS_TOKEN,
      payload: {
        code: accessToken
      }
		}
	}
}

export default actions
