var ErrorCodes = function(key, value) {}

ErrorCodes.prototype = {
	_invalidAccessToken: "itsays_error_invalidAccessToken",
	_userNotFound: "itsays_error_userNotFound",
	_publishFailed: "itsays_error_publishFailed",
	_logoutFailed: "itsays_error_logoutFailed",
	_userAuthentificationFailed: "itsays_error_userAuthentificationFailed",
	_userSignUpFailed: "itsays_error_userSignUpFailed",
	_invalidPassword: "itsays_error_invalidPassword",
	_invalidUsername: "itsays_error_invalidUsername",
	_invalidPublication: "itsays_error_invalidPublication",
	_denied: "itsays_error_denied"
};

module.exports = new ErrorCodes();