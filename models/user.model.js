const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/* This is creating a new schema for the product model. */
const userSchema = new Schema(
  {

    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    first_name: {
      type: String,
      required: true,
    },
     last_name: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    gender:{
      type: String,
      enum: ['Male', 'Female']
    }
   
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
