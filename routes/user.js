const { Router } = require("express");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { userModel, purchaseModel, courseModel } = require("../databases/db");
const { JWT_SECRET_USER } = require("../config");
const { userMiddleware } = require("../middlewares/user");

const userRouter = Router();

//Zod Validation
const userSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

//Signup route
userRouter.post("/signup", async (req, res) => {
  const validationResult = userSchema.safeParse(req.body);

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
    await userModel.create({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
    });

    res.json({
      message: "User signed up successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error, unable to signup: " + error.message,
    });
  }
});

//Signin route
userRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SECRET_USER
    );

    //TODO: Send the token in a cookie

    return res.json({
      message: "User logged in successfully",
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error, unable to signin",
    });
  }
});

//User purchases
userRouter.get("/purchases", userMiddleware, async (req, res) => {
  const userId = req.userId;

  try {
    const purchases = await purchaseModel.find({
      userId,
    });

    const purchasedCourseData = await courseModel.find({
      _id: {
        $in: purchases.map((purchase) => purchase.courseId),
      },
    })

    res.json({
      message: "User purchases fetched successfully",
      purchases,
      purchasedCourseData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error, unable to fetch purchases",
    });
  }
});

module.exports = {
  userRouter,
};
