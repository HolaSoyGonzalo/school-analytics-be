const User = require(".").User;
const Class = require(".").Class;
const dbConnections = require("./index").dbConnection;
const map = require("./responseMapper");
const { v4: uuidv4 } = require("uuid");
const { EntityNotFoundError, ValidationError, MissingParameterError } = require("../db/errors")
const bcrypt = require("bcrypt");

const Facade = {
	login: async (email, password) => {
		return await dbConnections.transaction(async (t) => {
			const user = await User.findOne(
				{ where: { email } },
				{ transaction: t }
			);
			if (!user) {
				throw new EntityNotFoundError("User with email " + email + " not found");
			}
			if (!user.validPassword(password)) {
				throw new ValidationError("Incorrect password");
			}
			return map(user);
		});
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
		return await dbConnections.transaction(async (t) => {
			if (!token) {
				throw new MissingParameterError("Missing token");
			}
			const toBeRegistered = await User.findOne(
				{ where: { registration_uuid: token } },
				{ transaction: t }
			);
			if (!toBeRegistered) {
				throw new EntityNotFoundError("User not found for token " + token);
			}
			if (toBeRegistered.is_registered === true) {
				throw new ValidationError("User is already registered");
			}
			return map(toBeRegistered);
		});
	},
	registerStudentWithToken: async (userRequest, token) => {
		return await dbConnections.transaction(async (t) => {
			if (!userRequest.password) {
				throw new MissingParameterError("Missing password");
			}
			const toBeRegistered = await User.findOne(
				{ where: { registration_uuid: token } },
				{ transaction: t }
			);
			if (!toBeRegistered) {
				throw new EntityNotFoundError("User not found for token " + token);
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
		});
	},
}

module.exports = { Facade };
