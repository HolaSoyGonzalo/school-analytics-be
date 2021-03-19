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

module.exports = { EntityNotFoundError, ValidationError, MissingParameterError };