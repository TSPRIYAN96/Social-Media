const {pool} = require('../Database/connection.js');
const crypto = require('crypto');
require('dotenv').config();


const getHash = (secretValue, hashSource, algorithm = 'sha256') => {
    const hmac = crypto.createHmac(algorithm, secretValue);
    hmac.update(hashSource);
    return hmac.digest('hex');
}

module.exports.search = async(req, res, next) => {
    try{
        let searchValue = req.params.searchValue;

        const connection = await pool.getConnection();
        
        let query;
        console.log(searchValue);
        if(searchValue[0] === '@'){
            searchValue = searchValue.slice(1,);
            query = `SELECT CONCAT('@', username) as search_result FROM users WHERE username LIKE '${searchValue}%' ORDER BY LENGTH(username) LIMIT 5 OFFSET 0;`;
            console.log(query);
        }else if(searchValue[0] === '&'){
            searchValue = searchValue.slice(1,);
            query = `SELECT CONCAT('&', groups.groupname) as search_result FROM groups INNER JOIN public_groups ON groups.group_id = public_groups.group_id AND groups.groupname LIKE '${searchValue}%' ORDER BY LENGTH(groups.groupname) LIMIT 5 OFFSET 0;`;
            console.log(query);
        }


        const [rows, fields] = await connection.execute(query);
        
        if(rows.length){
            res.json({resultsFound: rows.length, results: rows});
        }else{
            res.json({resultsFound: 0});
        }

        connection.release();

    }catch(err){
        console.log(err);
        res.json({resultsFound: 0});
    }
}