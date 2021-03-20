const User = require(".").User;
const Class = require(".").Class;
const dbConnections = require("./index").dbConnection;
const map = require("./responseMapper");
const { v4: uuidv4 } = require("uuid");
const { EntityNotFoundError, ValidationError, MissingParameterError } = require("../db/errors")
const bcrypt = require("bcrypt");

const Facade = {
	login: async (email, password) => {
		try {
			return await dbConnections.transaction(async (t) => {
				try {
					const user = await User.findOne(
						{ where: { email: email, is_registered: true } },
						{ transaction: t }
					);
					if (!user) {
						throw new EntityNotFoundError("User with email " + email + " not found");
					}
					if (!user.validPassword(password)) {
						throw new ValidationError("Incorrect password");
					}
					return map(user);
				}
				catch (error) {
					throw error;
				}
			});
		} catch (error) {
			throw error;
		}
	},
	getOne: async (queryObj) => {
		const user = await User.findOne(queryObj);
		if (!user) {
			throw new EntityNotFoundError("user not found");
		}
		return map(user);
	},
	findByPk: async (identifier, options) => {
		const user = await User.findByPk(identifier, options);
		if (!user) {
			throw new EntityNotFoundError("user with id " + identifier + " not found");
		}
		return map(user);
	},
	addStudent: async (userRequest) => {
		return await dbConnections.transaction(async (t) => {
			if (!userRequest.classroomId) {
				throw new MissingParameterError("must indicate classroom");
			}
			if (!await Class.findByPk(userRequest.classroomId, { transaction: t })) {
				throw new ValidationError("Class with id " + userRequest.classroomId + " does not exist");
			}
			try {
				const registered = await User.create(
					{
						firstname: userRequest.firstname,
						lastname: userRequest.lastname,
						classroomId: userRequest.classroomId,
						birthday: userRequest.birthday,
						gender: userRequest.gender,
						email: userRequest.email,
						role: "student",
						is_registered: false,
						registration_uuid: uuidv4()
					}, { transaction: t }
				);
				return map(registered);
			} catch (error) {
				if (error.name === "SequelizeUniqueConstraintError") {
					throw new ValidationError(error.message);
				} else {
					throw error;
				}
			}
		});
	},
	getStudentByToken: async (token) => {
		try {
			return await getUserByToken(token, "student");
		} catch (error) {
			if (error.name === "EntityNotFoundError") {
				error.message = "Student with token " + token + " not found";
			}
			throw error;
		}
	},
	getAdminByToken: async (token) => {
		try {
			return await getUserByToken(token, "admin");
		} catch (error) {
			if (error.name === "EntityNotFoundError") {
				error.message = "Admin with token " + token + " not found";
			}
			throw error;
		}
	},
	registerStudentWithToken: async (userRequest, token) => {
		try {
			return await registerUserWithToken(userRequest, token, "student");
		} catch (error) {
			if (error.name === "EntityNotFoundError") {
				error.message = "Student with token " + token + " not found";
			}
			throw error;
		}
	},
	registerAdminWithToken: async (userRequest, token) => {
		try {
			return await registerUserWithToken(userRequest, token, "admin");
		} catch (error) {
			if (error.name === "EntityNotFoundError") {
				error.message = "Admin with token " + token + " not found";
			}
			throw error;
		}
	},
	getRegistrationTokenForStudent: async (id) => {
		try {
			return await dbConnections.transaction(async (t) => {
				try {
					const user = await User.findByPk(id, { transaction: t });
					if (user.role !== "student") {
						throw new EntityNotFoundError("Student with id " + id + " not found");
					}
					if (user.is_registered) {
						throw new ValidationError("Student is already registered");
					}
					return { registration_token: user.registration_uuid };
				} catch (error) {
					throw error;
				}
			})
		} catch (error) {
			throw error
		};
	}
}

const registerUserWithToken = async (userRequest, token, role) => {
	try {
		return await dbConnections.transaction(async (t) => {
			try {
				if (!userRequest.password) {
					throw new MissingParameterError("Missing password");
				}
				const toBeRegistered = await User.findOne(
					{ where: { registration_uuid: token, role: role } },
					{ transaction: t }
				);
				if (!toBeRegistered) {
					throw new EntityNotFoundError();
				}
				if (toBeRegistered.is_registered) {
					throw new ValidationError("User is already registered");
				}
				const salt = await bcrypt.genSalt(12);
				const hashedPassword = await bcrypt.hash(userRequest.password, salt);
				const alteredUser = await User.update(
					{ password: hashedPassword, salt: salt, is_registered: true },
					{ where: { registration_uuid: token }, returning: true, plain: true },
					{ transaction: t }
				);
				return map(alteredUser[1]);
			} catch (error) {
				throw error;
			}
		});
	} catch (error) {
		throw error;
	}
}

const getUserByToken = async (token, role) => {
	try {
		return await dbConnections.transaction(async (t) => {
			try {
				if (!token) {
					throw new MissingParameterError("Missing token");
				}
				const toBeRegistered = await User.findOne(
					{ where: { registration_uuid: token, role: role } },
					{ transaction: t }
				);
				if (!toBeRegistered) {
					throw new EntityNotFoundError();
				}
				if (toBeRegistered.is_registered === true) {
					throw new ValidationError("User is already registered");
				}
				return map(toBeRegistered);
			} catch (error) {
				throw error;
			}
		});
	} catch (error) {
		throw error;
	}
}

module.exports = { Facade };
