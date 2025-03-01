const { Router } = require("express");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { adminModel } = require("../databases/db");
const { courseModel } = require("../databases/db");
const { JWT_SECRET_ADMIN } = require("../config");
const { adminMiddleware } = require("../middlewares/admin");

const adminRouter = Router();

//Zod Validation
const adminSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

//Admin login route
adminRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await adminModel.findOne({
      email: email,
    });

    if (!admin) {
      return res.status(401).json({
        message: "You're not an admin",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, admin.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Incorrect password",
      });
    }

    const token = jwt.sign(
      {
        adminId: admin._id,
      },
      JWT_SECRET_ADMIN
    );

    //TODO: Send the token in a cookie, and refresh all the tokens.

    return res.json({
      message: "Admin logged in successfully",
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error, unable to signin",
    });
  }
});

//Admin signup route
adminRouter.post("/signup", async (req, res) => {
  const validationResult = adminSchema.safeParse(req.body);

  if (!validationResult.success) {
    console.log("Invalid: ", validationResult.error.errors);
    return res.status(400).json({
      message: "Validation failed",
      errors: validationResult.error.errors,
    });
  }

  const { email, password, firstName, lastName } = validationResult.data;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await adminModel.create({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
    });

    res.json({
      message: "Admin signed up successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error, unable to signup: " + error.message,
    });
  }
});

//Create course
adminRouter.post("/course", adminMiddleware, async (req, res) => {
  //todo: prevent the creation of duplicate courses, and store token in a cookie
  const adminId = req.adminId;
  const { title, description, imageUrl, price } = req.body;

  //validate the adminId, as, we may have a token from different admin, manage tokens properly from login endpoint and then other routes must be handled
  //verify tokens

  try {
    const course = await courseModel.create({
      title: title,
      description: description,
      price: price,
      imageUrl: imageUrl,
      creatorId: adminId,
    });

    res.json({
      message: "Course created successfully",
      courseId: course._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error, unable to create course",
    });
  }
});

//Update course
adminRouter.put("/course", adminMiddleware, async (req, res) => {
  const adminId = req.adminId;

  const { title, description, imageUrl, price, courseId } = req.body;

  try {
    const course = await courseModel.findOneAndUpdate(
      {
        _id: courseId,
        creatorId: adminId,
      },
      {
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
      },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found or Unauthorised to update course",
      });
    }

    res.json({
      message: "Course updated successfully",
      course: course,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error, unable to update course",
    });
  }
});

//Delete course
adminRouter.delete("/course", adminMiddleware, async (req, res) => {
  const adminId = req.adminId;

  const { courseId } = req.body;

  try {
    const course = await courseModel.findOneAndDelete({
      _id: courseId,
      creatorId: adminId,
    });

    res.json({
      message: "Course deleted successfully: " + course,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error, unable to delete course",
    });
  }
});

//List of all the courses created by the admin
adminRouter.get("/courses", adminMiddleware, async (req, res) => {
  const adminId = req.adminId;

  try {
    const course = await courseModel.find({
      creatorId: adminId,
    });

    res.json({
      message: "Courses fetched successfully",
      courses: course,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error, unable to fetch courses",
    });
  }
});

module.exports = {
  adminRouter,
};
