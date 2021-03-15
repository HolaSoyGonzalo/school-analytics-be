const User = require("../db").User;
const Course = require("../db").Course;
const Exam = require("../db").Exam;
const Class = require("../db").Class;

const { authenticate, adminOnlyMiddleware } = require("../auth");

const adminRouter = require("express").Router();

//USER CRUD
adminRouter.get(
  "/user",
  authenticate,
  adminOnlyMiddleware,
  async (req, res) => {
    try {
      const allUser = await User.findAll({
        //   include: [
        //   ],
      });
      res.send(allUser);
    } catch (error) {
      console.log(error);
      res.status(500).send("Something went wrong!");
    }
  }
);
adminRouter.get(
  "/user/:id",
  authenticate,
  adminOnlyMiddleware,
  async (req, res) => {
    try {
      if (req.user.dataValues.id.toString() === req.params.id) {
        const singleUser = await User.findByPk(req.params.id, {});
        res.send(singleUser);
      } else {
        const singleUser = await User.findByPk(req.params.id, {});
        if (singleUser) {
          res.send(singleUser);
        } else {
          res.status(404).send("User not found within database");
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Something went wrong!");
    }
  }
);
adminRouter.put(
  "/user/:id",
  authenticate,
  adminOnlyMiddleware,
  async (req, res) => {
    try {
      const alteredUser = await User.update(req.body, {
        where: { id: req.params.id },
        //   include: [
        //   ],
        returning: true,
      });
      res.send(alteredUser);
    } catch (error) {
      console.log(error);
      res.status(500).send("Something went wrong!");
    }
  }
);
adminRouter.delete(
  "/user/:id",
  authenticate,
  adminOnlyMiddleware,
  async (req, res) => {
    try {
      await User.destroy({ where: { id: req.params.id } }); //.destroy DESTROYS ROWS. CAN DESTROY MULTIPLE BASED ON FILTER. WILL DESTRY ALL WITHOUT A FILTER
      res.send("User Deleted");
    } catch (error) {
      console.log(error);
      res.status(500).send("Something went wrong!");
    }
  }
);

//CLASS CRUDS//
adminRouter.post(
  "/class",
  authenticate,
  adminOnlyMiddleware,
  async (req, res) => {
    try {
      const newClass = await Class.create(req.body);
      res.status(201).send(newClass);
    } catch (error) {
      console.log(error);
    }
    res.status(500).send("Uh oh, something broke :(");
  }
);
adminRouter.get(
  "/class",
  authenticate,
  adminOnlyMiddleware,
  async (req, res) => {
    try {
      const allClass = await Class.findAll();
      res.send(allClass);
    } catch (error) {
      console.log(error);
      res.status(500).send("Something went wrong!");
    }
  }
);
adminRouter.get(
  "/class/:id",
  authenticate,
  adminOnlyMiddleware,
  async (req, res) => {
    try {
      const singleClass = await Class.findByPk(req.params.id, {});
      if (singleClass) {
        res.send(singleClass);
      } else {
        res.status(404).send("Class not found within database");
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Something went wrong!");
    }
  }
);
adminRouter.put(
  "/class/:id",
  authenticate,
  adminOnlyMiddleware,
  async (req, res) => {
    try {
      const alteredClass = await Class.update(req.body, {
        where: { id: req.params.id },
        //   include: [
        //   ],
        returning: true,
      });
      res.send(alteredClass);
    } catch (error) {
      console.log(error);
      res.status(500).send("Something went wrong!");
    }
  }
);
adminRouter.delete(
  "/class/:id",
  authenticate,
  adminOnlyMiddleware,
  async (req, res) => {
    try {
      await Class.destroy({ where: { id: req.params.id } }); //.destroy DESTROYS ROWS. CAN DESTROY MULTIPLE BASED ON FILTER. WILL DESTRY ALL WITHOUT A FILTER
      res.send("Class Deleted");
    } catch (error) {
      console.log(error);
      res.status(500).send("Something went wrong!");
    }
  }
);

//COURSE CRUDS
adminRouter.post(
  "/course",
  authenticate,
  adminOnlyMiddleware,
  async (req, res) => {
    try {
      const newCourse = await Course.create(req.body);
      res.status(201).send(newCourse);
    } catch (error) {
      console.log(error);
    }
    res.status(500).send("Uh oh, something broke :(");
  }
);
adminRouter.get(
  "/course",
  authenticate,
  adminOnlyMiddleware,
  async (req, res) => {
    try {
      const allCourse = await Course.findAll();
      res.send(allCourse);
    } catch (error) {
      console.log(error);
      res.status(500).send("Something went wrong!");
    }
  }
);
adminRouter.get(
  "/course/:id",
  authenticate,
  adminOnlyMiddleware,
  async (req, res) => {
    try {
      const singleCourse = await Course.findByPk(req.params.id, {});
      if (singleCourse) {
        res.send(singleCourse);
      } else {
        res.status(404).send("Class not found within database");
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Something went wrong!");
    }
  }
);
adminRouter.put(
  "/course/:id",
  authenticate,
  adminOnlyMiddleware,
  async (req, res) => {
    try {
      const alteredCourse = await Course.update(req.body, {
        where: { id: req.params.id },
        //   include: [
        //   ],
        returning: true,
      });
      res.send(alteredCourse);
    } catch (error) {
      console.log(error);
      res.status(500).send("Something went wrong!");
    }
  }
);
adminRouter.delete(
  "/course/:id",
  authenticate,
  adminOnlyMiddleware,
  async (req, res) => {
    try {
      await Course.destroy({ where: { id: req.params.id } }); //.destroy DESTROYS ROWS. CAN DESTROY MULTIPLE BASED ON FILTER. WILL DESTRY ALL WITHOUT A FILTER
      res.send("Class Deleted");
    } catch (error) {
      console.log(error);
      res.status(500).send("Something went wrong!");
    }
  }
);
//EXAM
adminRouter.post(
  "/exam",
  authenticate,
  adminOnlyMiddleware,
  async (req, res) => {
    try {
      const newExam = await Exam.create(req.body);
      res.status(201).send(newExam);
    } catch (error) {
      console.log(error);
    }
    res.status(500).send("Uh oh, something broke :(");
  }
);
adminRouter.get(
  "/exam",
  authenticate,
  adminOnlyMiddleware,
  async (req, res) => {
    try {
      const allExam = await Exam.findAll();
      res.send(allExam);
    } catch (error) {
      console.log(error);
      res.status(500).send("Something went wrong!");
    }
  }
);
adminRouter.get(
  "/exam/:id",
  authenticate,
  adminOnlyMiddleware,
  async (req, res) => {
    try {
      const singleExam = await Exam.findByPk(req.params.id, {});
      if (singleExam) {
        res.send(singleExam);
      } else {
        res.status(404).send("Class not found within database");
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Something went wrong!");
    }
  }
);
adminRouter.put(
  "/exam/:id",
  authenticate,
  adminOnlyMiddleware,
  async (req, res) => {
    try {
      const alteredExam = await Exam.update(req.body, {
        where: { id: req.params.id },
        //   include: [
        //   ],
        returning: true,
      });
      res.send(alteredExam);
    } catch (error) {
      console.log(error);
      res.status(500).send("Something went wrong!");
    }
  }
);
adminRouter.delete(
  "/exam/:id",
  authenticate,
  adminOnlyMiddleware,
  async (req, res) => {
    try {
      await Exam.destroy({ where: { id: req.params.id } }); //.destroy DESTROYS ROWS. CAN DESTROY MULTIPLE BASED ON FILTER. WILL DESTRY ALL WITHOUT A FILTER
      res.send("Exam Deleted");
    } catch (error) {
      console.log(error);
      res.status(500).send("Something went wrong!");
    }
  }
);

module.exports = adminRouter;
