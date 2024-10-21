const express = require("express");
const router = express.Router();
const userVoters = require("../models/userVoters");
const { generateToken,jwtAuthMiddleware } = require("../middlewares/jwtAuthMiddleware");
const bcrypt = require('bcrypt');



//________________USER_________________


router.post("/signup", async (req, res) => {
    try {
      const data = req.body; //The request is stored in req.body
  
      //Creating person data using person model
      const newUser = userVoters(data);
  
      //Saving the data in database
      const response = await newUser.save();
      console.log("Data saved");
  
      //Generating the token 
      //sending the payload
  
      const payload = {
        id : response.id,
      }
  
      //console.log(JSON.stringify(payload))
      const token = generateToken(payload);// This genarate token function is written in /middlewares/jwtAuthMiddleware
      console.log('Token is :'+ token);
  
  
      res.status(200).json({Response : response , Token : token});
    } catch (error) {
      console.log("Error saving person:");
      res.status(501).json({
        error: error.message,
      });
    }
  });
  
  
  //Creating login route
  
  router.post('/login',async (req,res)=>{
    //Taking the uname and password from req.body
    try {
    const{aadhar,password} = req.body;
    console.log(typeof(password))

  
    const user = await userVoters.findOne({ aadhar: aadhar });
    if(!user){
      return res.status(401).json("User not found");
    }
    //Checking the user name and password
    if(!(await user.comparePassword(password))){
     return res.status(401).json("Invalid Password");
    }
    //Generating the token
    const payload ={
      id : user.id
    }
  
    const token = generateToken(payload)
  
    res.status(201).json({user : user.name, role : user.role, token : token});
  } 
  catch (error) {
      res.status(501).json(error.message)
  }
  
  })

  
//Profile route
router.get('/profile',jwtAuthMiddleware, async (req,res)=>{
  try {
  const user = req.userPayload;
  const userId = user.id;
  const profileDetails = await userVoters.findById(userId);
  res.status(201).json(profileDetails);
  
} catch (error) {
  res.status(501).json({
    error: error.message,
  });
}
  
})


router.put('/profile/password',jwtAuthMiddleware, async (req,res)=>{
  try{
    const voter = req.userPayload;
    const userID = voter.id;
    const userPassword = req.body.password;
    const userNewPassword = req.body.newPassword;
    const user = await userVoters.findById(userID);
    if(!(await user.comparePassword(userPassword))){
      return res.status(401).json("Invalid Password");
     };
     const salt = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(userNewPassword, salt);
     user.password = hashedPassword;
     await user.save();
     res.status(201).json("Password Updated");
     
  } catch (error) { 
    res.status(501).json({
      error: error.message,
    });
  }

});


//Put or Patch for put method id has to be specified

router.put("/:id", async (req, res) => {
  try {
    const customerId = req.params.id; // Use the customerId to retrieve customer data, perform operations, etc.

    // Updates the document in the 'Person' collection matching 'customerId' with the new data from 'req.body'.
    const newResult = await Person.updateOne({ _id: customerId }, req.body);

    console.log(newResult);
    res.status(201).json({
      updatedCount: newResult.modifiedCount,
    });
  } catch (err) {
    console.log("Error in updating");
    res.status(501).json({
      error: err.message,
    });
  }
});

//Deleting

router.delete("/:id", async (req, res) => {
  try {
    const customerId = req.params.id;
    //Delete the document with the same ID
    const result = await Person.deleteOne({ _id: customerId });
    console.log("Deleted Successfully");
    res.status(201).json({ deletedCount: result.deletedCount });
  } catch (error) {
    res.status(501).json({ Error: "User not found" });
  }
});

//:work is parameterised api calls specify the type of work after {{body}}/person/chef
router.get("/:work", async (req, res) => {
  try {
    //specifying the work type
    const workType = req.params.work;
    //
    if (workType == "chef" || workType == "waiter" || workType == "manager") {
      const workResponse = await Person.find({ work: workType });
      console.log("Response Fetched");

      //sending work response
      res.status(200).json(workResponse);
    } else {
      res.status(404).json({
        error: "Invalid work type",
      });
    }
  } catch (err) {
    res.status(501).json({
      Error: err.message,
    });
  }
});

module.exports = router;
