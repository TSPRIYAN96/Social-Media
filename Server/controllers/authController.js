const jwt = require('jsonwebtoken');
const {pool} = require('../Database/connection.js');
const crypto = require('crypto');
require('dotenv').config();


const createToken = (username) => {
    return jwt.sign({username}, process.env.ACCESS_TOKEN_SECRET.toString(), {expiresIn : 3*24*3600});
}

const getHash = (secretValue, hashSource, algorithm = 'sha256') => {
    const hmac = crypto.createHmac(algorithm, secretValue);
    hmac.update(hashSource);
    return hmac.digest('hex');
}

module.exports.signupHandler = async(req, res, next) => {
    console.log(req.body);
    try{
        const {username, email, password} = req.body;

        const hashedUserID = getHash('user_id', username);
        const hashedPassword = getHash(process.env.PASSWORD_SECRET_VALUE, password);
        
        const queryUsers = `INSERT INTO users VALUES('${hashedUserID}', '${username}', '${email}', '${hashedPassword}');`;

        const connection = await pool.getConnection();
        const [usersResult] = await connection.execute(queryUsers);
        connection.release();

        res.json({signedIn : true, error: ''}); 
    }catch(err){
        console.log(err);
        res.json({signedIn : false, error: 'Something went wrong'});
    }
    
}

module.exports.loginHandler = async(req, res, next) => {
    console.log(req.body);
    try{
        const {username, password} = req.body;

        const userID = getHash('user_id', username);
        const hashedPassword = getHash(process.env.PASSWORD_SECRET_VALUE, password);
        
        const connection = await pool.getConnection();
        
        let query = `SELECT password from users where user_id = '${userID}'`;
        const [userRow, fields] = await connection.execute(query);
        
        if(userRow[0].password !== hashedPassword){
            res.json({loggedIn : false, error: 'Invalid username or password'});
            return;
        }
        
        const authToken = getHash(process.env.AUTH_SECRET_TOKEN, `${username}-${new Date().toISOString()}`);
        query = `DELETE FROM auth where user_id = '${userID}';`;
        let [result] = await connection.execute(query); 
        query = `INSERT INTO auth(user_id, auth_token) values('${userID}', '${authToken}');`;
        [result] = await connection.execute(query);
        connection.release();

        const token = createToken(username);
        // res.cookie('username', userRow, {httpOnly:false, maxAge: 3*24*60*60*1000, secure: true});
        res.status(200).cookie('jwt', token, {httpOnly:false, maxAge: 3*24*60*60*1000, secure: true});
        res.json({loggedIn : true, error: ''});
        
    }catch(err){
        console.log(err);
        res.json({loggedIn : false, error: 'Something went wrong'});
    }
}