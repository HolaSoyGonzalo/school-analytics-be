const mapToResponse = (user) => {
	return {
		id: user.id,
		firstname: user.firstname,
		lastname: user.lastname,
		email: user.email,
		birthday: user.birthday,
		gender: user.gender,
		role: user.role,
		is_registered: user.is_registered,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
	};
};

module.exports = mapToResponse;