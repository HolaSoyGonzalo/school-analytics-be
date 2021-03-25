const mapper = {
	mapUserToResponse: (user) => {
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
	},
	mapExamToResponse: (exam) => {
		return {
			id: exam.id,
			student: exam.studentId,
			teacher: exam.teacherId,
			course: exam.courseId,
			date: exam.date,
			grade: exam.grade,
			isWritten: exam.isWritten
		}
	}
}

module.exports = mapper;