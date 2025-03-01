require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");

const app = express();

app.use(express.json());

app.use("/user", userRouter);
app.use("/course", courseRouter);
app.use("/admin", adminRouter);

async function mongoDbConnect() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to mongodb");
  } catch (error) {
    console.log("Error connecting to mongodb:");
    console.log(error.message);
    process.exit(1);
  }
}

async function main() {
  await mongoDbConnect();

  try {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
      console.log("http://localhost:3000");
    });
  } catch (error) {
    console.log("Error starting the server:");
    console.log(error.message);
  }
}

main();
