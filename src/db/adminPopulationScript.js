const User = require(".").User;
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const populate = async (adminsObject) => {
	const admins = JSON.parse(adminsObject);
	for (let i = 0; i < admins.length; i++) {
		const admin = admins[i];
		const maybeExisting = await User.findOne(
			{ where: { email: admin.email } }
		);
		if (!maybeExisting) {
			const asd = await User.create({
				email: admin.email,
				firstname: admin.firstname,
				lastname: admin.lastname,
				birthday: admin.birthday,
				gender: admin.gender,
				role: "admin",
				is_registered: false,
				registration_uuid: uuidv4()
			});
		}
	};
}

module.exports = populate;