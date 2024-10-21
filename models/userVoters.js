const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
require('dotenv').config();

const userVotersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
        min: 18
    },
    email:{
        type: String,
        unique: true
    },
    number: { 
        type: String,
        required: true,
        unique: true
     },    
    aadhar: {
        type: String,
        required: true,
        unique: true
    },
    isVoted: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true,
        maxlength: 16,
    },
    role : { 
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

//pre middleware for genarating hashedPassword

userVotersSchema.pre("save", async function (next) {
    const person = this; // Create a local reference to the current object context
  
    if (!person.isModified("password")) return next();
  
    try {
      // Creating the salt for hashing

      const salt = await bcrypt.genSalt(10);
  
      // Creating the hashed password if modified
      if (person.isModified("password")) {
        const hashedPassword = await bcrypt.hash(person.password, salt);
        person.password = hashedPassword;
      }
      next();
    } catch (error) {
      return next(error);
    }
  });
  
  // Creating the compare password function
  userVotersSchema.methods.comparePassword = async function (candidatePassword) {
    try {
      // Using bcrypt to compare the password
      const isMatch = await bcrypt.compare(candidatePassword, this.password);
      return isMatch;
    } catch (error) {
      throw error;
    }
  };

const userVoters = mongoose.model('userVoters', userVotersSchema);
module.exports = userVoters;
