const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/Pinterest");

const userSchema = mongoose.Schema({
  username: String,
  name: String,
  email: String,
  birthdate: String,
  profileImage: String,
  contact: Number,
  password: String,
  boards: {
    type: Array,
    default: [],
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
  ],
});

userSchema.plugin(plm); //isse hamm passport ko serialize user and deserialize user dono de rahe hai

module.exports = mongoose.model("user", userSchema);
