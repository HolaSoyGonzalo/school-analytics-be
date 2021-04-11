class EntityNotFoundError extends Error {
	constructor(message) {
		super(message);
		this.name = "EntityNotFoundError";
		this.type = "ClientError";
	}
}

class ValidationError extends Error {
	constructor(message) {
		super(message);
		this.name = "ValidationError";
		this.type = "ClientError";
	}
}

class MissingParameterError extends Error {
	constructor(message) {
		super(message);
		this.name = "MissingParameterError";
		this.type = "ClientError";
	}
}

class AuthenticationError extends Error {
	constructor(message) {
		super(message);
		this.name = "AuthenticationError";
		this.type = "AuthenticationError";
	}
}

module.exports = { EntityNotFoundError, ValidationError, MissingParameterError, AuthenticationError };