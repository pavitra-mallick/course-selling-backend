const { Router } = require("express");
const { userMiddleware } = require("../middlewares/user");
const { courseModel, purchaseModel } = require("../databases/db");
const courseRouter = Router();

//Purchase a course
courseRouter.post("/purchase", userMiddleware, async (req, res) => {
  const userId = req.userId;
  const courseId = req.body.courseId;

  const purchased = await purchaseModel.findOne({
    userId: userId,
    courseId: courseId,
  });

  if (purchased) {
    return res.status(400).json({
      message: "You have already purchased this course",
    });
  }

  //todo: create a payment gateway, or check whether the user has paid for the course.

  try {
    const purchase = await purchaseModel.create({
      userId: userId,
      courseId: courseId,
    });

    res.json({
      message: "Purchase completed successfully!",
      purchase,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error, Purchase failed!",
    });
  }
});

//List of all the available courses
courseRouter.get("/preview", async (req, res) => {
  try {
    const courses = await courseModel.find({});

    res.json({
      message: "Courses fetched successfully",
      courses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error, unable to fetch courses",
    });
  }
});

module.exports = {
  courseRouter,
};
