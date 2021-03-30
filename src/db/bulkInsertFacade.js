const User = require(".").User;
const Exam = require(".").Exam;
const Course = require(".").Course;
const {
  EntityNotFoundError,
  ValidationError,
  MissingParameterError,
} = require("../db/errors");
const ResponseMapper = require("./responseMapper");
const dbConnections = require("./index").dbConnection;

const Facade = {
  insertBatchExams: async (examRequests) => {
    try {
      return await dbConnections.transaction(async (t) => {
        try {
          const exams = await Promise.all(
            examRequests.map((req) => mapRequestToExam(req, t))
          );
          const imported = await Exam.bulkCreate(exams);
          return imported.map((e) => ResponseMapper.mapExamToResponse(e));
        } catch (error) {
          throw error;
        }
      });
    } catch (error) {
      throw error;
    }
  },
};

const mapRequestToExam = async (req, transaction) => {
  try {
    const student = await User.findOne(
      { where: { email: req["STUDENT MAIL"], role: "student" } },
      { transaction: transaction }
    );
    const teacher = await User.findOne(
      { where: { email: req["TEACHER MAIL"], role: "teacher" } },
      { transaction: transaction }
    );
    const course = await Course.findOne(
      { where: { name: req["COURSE"] } },
      { transaction: transaction }
    );
    if (!student) {
      throw new EntityNotFoundError(
        "Student with email " + req["STUDENT MAIL"] + " not found"
      );
    }
    if (!teacher) {
      throw new EntityNotFoundError(
        "Teacher with email " + req["TEACHER MAIL"] + " not found"
      );
    }
    if (!course) {
      throw new EntityNotFoundError(
        "Course with name " + req["COURSE"] + " not found"
      );
    }
    return {
      userId: student.id,
      teacherId: teacher.id,
      courseId: course.id,
      date: req["DATE"],
      grade: req["GRADE"],
      isWritten: req["WRITTEN"].toLowerCase() == "s",
    };
  } catch (error) {
    throw error;
  }
};

module.exports = { Facade };
