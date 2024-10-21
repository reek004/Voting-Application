const jwt = require("jsonwebtoken");
require('dotenv').config();


//Generate the JWT token 
const generateToken = (userData)=>{
    //To generate the JWT token We need to use the sign function
    // Signing the userData payload
    return jwt.sign(userData,process.env.JWT_SECRET_KEY,{expiresIn :300000});
}

//Verifying Token Function

const jwtAuthMiddleware = (req, res, next) => {
    //Extract the bearer token from headers
    const jwtauth = req.headers.authorization
    if(!jwtauth){
        return res.json("Token not found")
    }

    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.status(401).json({ Error: "Unauthorized" });

    try {
        //Verifying the token this will return the payload
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        //THIS DECODED PAYLOAD HAS THE unique ID 

        //Attach the decoded payload in request object the usr payload will be attached in userPayload
        req.userPayload = decode;

        next();
    } catch (error) {
        console.log(error)
        res.status(401).json({Error : 'Invalid Request' });
     }
};



module.exports = {jwtAuthMiddleware,generateToken}