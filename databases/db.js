const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

//AXCS94Al2611TsuJ

// mongoose.connect(
//   "mongodb+srv://pavitramallick:AXCS94Al2611TsuJ@cluster0.sk72u.mongodb.net/courseApp",
// );

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    primaryKey: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: String,
  lastName: String,
});

const courseSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  imageUrl: String,
  creatorId: ObjectId,
});

const adminSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    primaryKey: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: String,
  lastName: String,
});

const purchaseSchema = new Schema({
  userId: ObjectId,
  courseId: ObjectId,
});

const userModel = mongoose.model("user", userSchema);
const courseModel = mongoose.model("course", courseSchema);
const adminModel = mongoose.model("admin", adminSchema);
const purchaseModel = mongoose.model("purchase", purchaseSchema);

module.exports = {
  userModel,
  courseModel,
  adminModel,
  purchaseModel,
};
