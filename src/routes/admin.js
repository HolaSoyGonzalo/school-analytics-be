const _ = require("lodash");
const Csv = require("../csv/CsvUtils");
const multer = require("multer");
const upload = multer();
const { v4: uuidv4 } = require("uuid");

const Course = require("../db").Course;
const Class = require("../db").Class;
const Exam = require("../db").Exam;
const User = require("../db").User;

const BulkFacade = require("../db/bulkInsertFacade").Facade;

const UsersFacade = require("../db/transactionalUsersFacade").Facade;

const { authenticate, adminOnlyMiddleware } = require("../auth");
const { Facade } = require("../db/transactionalUsersFacade");

const adminRouter = require("express").Router();

adminRouter.post(
  "/students/add",
  authenticate,
  adminOnlyMiddleware,
  async (req, res) => {
    try {
      const registered = await UsersFacade.addStudent(req.body);
      res.status(201).send(registered);
    } catch (error) {
      if (error.type && error.type === "ClientError") {
        res.status(400).send(error.message);
      }
      res.status(500).send(error.message);
    }
  }
);
adminRouter.post(
  "/teachers/add",
  authenticate,
  adminOnlyMiddleware,
  async (req, res) => {
    try {
      const registered = await UsersFacade.addTeacher(req.body);
      res.status(201).send(registered);
    } catch (error) {
      if (error.type && error.type === "ClientError") {
        res.status(400).send(error.message);
      }
      res.status(500).send(error.message);
    }
  }
);

adminRouter
  .route("/uploadStudentCSV")
  .post(upload.single("file"), async (req, res, next) => {
    try {
      console.log(req.file);
      const studRequests = Csv.parseStudents(req.file.buffer);
      for (let i = 0; i < studRequests.length; i++) {
        let student = studRequests[i];
        student.is_registered = false;
        student.role = "student";
        student.registration_uuid = uuidv4();
        const classroom = student.classroom;
        const year = classroom.substring(0, 1);
        const section = classroom.substring(1);
        const classroomEntity = await Class.findOne({
          where: { year: parseInt(year), section: section },
        });
        student.classroomId = classroomEntity.dataValues.id;
        console.log(classroomEntity);
      }
      const imported = await User.bulkCreate(studRequests);
      res.status(200).send(imported);
    } catch (e) {
      console.log(e);
      res.send(e.message);
    }
  });

adminRouter.post(
  "/class/add",
  authenticate,
  adminOnlyMiddleware,
  async (req, res) => {
    try {
      // TODO: mapper
      const newClass = await Class.create({
        section: req.body.section,
        year: req.body.year,
      });
      res.status(201).send(newClass);
    } catch (error) {
      console.log(error);
      res.status(500).send({ errors: "Uh oh, something broke :(" });
    }
  }
);

adminRouter.post(
  "/course/add",
  authenticate,
  adminOnlyMiddleware,
  async (req, res) => {
    try {
      // TODO: mapper
      const newCourse = await Course.create({
        name: req.body.name,
        description: req.body.description,
      });
      res.status(201).send(newCourse);
    } catch (error) {
      console.log(error);
      res.status(500).send("Uh oh, something broke :(");
    }
  }
);
adminRouter.get("/allUsers", authenticate, async (req, res, next) => {
  try {
    const allUsers = await User.findAll();
    res.send(allUsers);
  } catch (error) {
    if (error.type && error.type === "ClientError") {
      res.status(400).send(error.message);
    }
    res.status(500).send(error.message);
    console.log(error);
  }
});

adminRouter.get("/exams", authenticate, async (req, res, next) => {
  try {
    const allExams = await Exam.findAll({ include: User });
    res.send(allExams);
  } catch (error) {
    if (error.type && error.type === "ClientError") {
      res.status(400).send(error.message);
      return;
    }
    res.status(500).send(error.message);
  }
});

adminRouter.get("/classrooms", authenticate, async (req, res, next) => {
  try {
    const allClass = await Class.findAll();
    res.send(allClass);
  } catch (error) {
    if (error.type && error.type === "ClientError") {
      res.status(400).send(error.message);
    }
    res.status(500).send(error.message);
    console.log(error);
  }
});

adminRouter.get("/courses", authenticate, async (req, res, next) => {
  try {
    const allCourses = await Course.findAll();
    res.send(allCourses);
  } catch (error) {
    if (error.type && error.type === "ClientError") {
      res.status(400).send(error.message);
    }
    res.status(500).send(error.message);
    console.log(error);
  }
});

adminRouter.route("/register/:token").post(async (req, res) => {
  try {
    let registeredAdmin = await UsersFacade.registerAdminWithToken(
      req.body,
      req.params.token
    );
    res.status(201).send(registeredAdmin);
  } catch (error) {
    if (error.type && error.type === "ClientError") {
      res.status(400).send(error.message);
    } else {
      res.status(500).send(error.message);
    }
  }
});

adminRouter.route("/register/:token").get(async (req, res) => {
  try {
    res.status(200).send(await UsersFacade.getAdminByToken(req.params.token));
  } catch (error) {
    if (error.type && error.type === "ClientError") {
      res.status(400).send(error.message);
    } else {
      res.status(500).send(error.message);
    }
  }
});

adminRouter.get(
  "/registration/:id",
  authenticate,
  adminOnlyMiddleware,
  async (req, res) => {
    try {
      res.status(200).send({
        registration_token: await UsersFacade.getRegistrationTokenForStudent(
          req.params.id
        ),
      });
    } catch (error) {
      if (error.type && error.type === "ClientError") {
        res
          .status(error.name === "EntityNotFoundError" ? 404 : 400)
          .send(error.message);
      } else {
        res.status(500).send(error.message);
      }
    }
  }
);

adminRouter
  .route("/uploadExams")
  .post(upload.single("file"), async (req, res, next) => {
    try {
      // FIXME: must be transactional
      const examRequests = Csv.parseExams(req.file.buffer);
      res.status(200).send(await BulkFacade.insertBatchExams(examRequests));
    } catch (e) {
      console.log(e);
      res.send(e.message);
    }
  });

module.exports = adminRouter;
