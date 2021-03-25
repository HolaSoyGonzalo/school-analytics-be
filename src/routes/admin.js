const _ = require("lodash");
const Csv = require("../csv/CsvUtils");
const multer = require("multer");
const upload = multer();

const Course = require("../db").Course;
const Class = require("../db").Class;
const Exam = require("../db").Exam;
const Student = require("../db").Student;

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

adminRouter
  .route("/uploadStudentCSV")
  .post(upload.single("file"), async (req, res, next) => {
    try {
      console.log(req.file);
      const studRequests = Csv.parseStudents(req.file.buffer);

      const imported = await Student.bulkCreate(studRequests);
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
      res.status(500).send("Uh oh, something broke :(");
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
