const jwt = require('jsonwebtoken');
require('dotenv').config();


const authMiddleware = (req, res, next) => {
    const token = req.cookies.jwt;
    console.log(token);

    if(token){
       jwt.verify(token,
                  process.env.ACCESS_TOKEN_SECRET.toString(),
                  async(err, decodedToken) => {
                        if(err){
                            console.log(err.message);
                            res.json({isAuthorized : false, unauthorized: true, message : err.message});
                        }else{
                            console.log('Authorized', decodedToken);
                            next();
                        }
                  }) 
    }else{
        console.log("Unauthorized Login");
        res.json({isAuthorized : false, unauthorized: true, message: 'Please Login to access this resource'});
    }
}

module.exports = authMiddleware;