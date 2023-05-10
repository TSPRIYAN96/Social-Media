const {pool} = require('../Database/connection.js');
const crypto = require('crypto');
require('dotenv').config();


const getHash = (secretValue, hashSource, algorithm = 'sha256') => {
    const hmac = crypto.createHmac(algorithm, secretValue);
    hmac.update(hashSource);
    return hmac.digest('hex');
}

module.exports.retrievePostData = async (req, res, next) => {
    try{
        console.log(req.params);
        const post_id = req.params.id;
        let user_id = null;

        if(req.cookies.jwt){
            console.log('Logged in'); 
            const username = JSON.parse(Buffer.from(req.cookies.jwt.split('.')[1], 'base64').toString()).username;
            user_id = getHash('user_id', username);
        }

        const connection = await pool.getConnection();

        // Check if the user can access this post
        const query01 = `SELECT is_private FROM posts WHERE post_id = '${post_id}';`;
        const [rows01, fields01] = await connection.query(query01);

        if(rows01[0].is_private === '1'){
            const query02 = `SELECT count(*) as can_access FROM user_groups INNER JOIN group_posts ON user_groups.group_id = group_posts.group_id AND user_groups.user_id = '${user_id}' AND group_posts.post_id = '${post_id}';`;
            const [rows02, fields02] = await connection.execute(query02);
            if(!rows02[0].can_access){
                console.log('Cannot access');
                res.json({status : "Couldn't find the post you're looking for", isRetrieved : false});
                return;
            }
        }


        const query1 = `SELECT users.username, posts.text_content, posts.img_version, posts.img_folder_name, posts.img_public_id, posts.likes, posts.dislikes, posts.time_stamp FROM users INNER JOIN posts ON users.user_id = posts.creator_id AND posts.post_id = '${post_id}';`;
        const [rows1, fields1] = await connection.execute(query1);

        if(!rows1.length){
            res.json({isRetrieved: false});
            return;
        }
        
        const data = {...rows1[0], links: [], tags: []};

        const query2 = `SELECT link from post_links where post_id = '${post_id}';`;
        const [rows2, fields2] = await connection.execute(query2);

        for(let item of rows2) data.links.push(item.link);
        
        const query3 = `SELECT tag from post_tags where post_id = '${post_id}';`;
        const [rows3, fields3] = await connection.execute(query3);

        
        for(let item of rows3) data.tags.push(item.tag);
        
        // const query4 = 'SELECT count(vote_type) as votes, vote_type from votes group by vote_type order by vote_type;';
        // const [rows4, fields4] = await connection.execute(query4);
        // console.log(rows4);
        
        let rows5, fields5;
        if(user_id !== null){
            const query5 = `SELECT vote_type from votes where user_id = '${user_id}' AND post_id = '${post_id}';`;
            [rows5, fields5] = await connection.execute(query5);
        }
        
        console.log(data);
        connection.release();


        res.json({status : "Fetched post data", 
                isRetrieved : true,
                   ...data,
                  userVote : user_id && rows5.length ? rows5[0].vote_type : null // Current users's vote
                  });

    }catch(err){
        console.log(err);
        res.json({status : "Couldn't find the post you're looking for", isRetrieved : false});
    }
}

module.exports.retrievePostComments = async(req, res, next) => {
    try{
        console.log(req.params);
        const post_id = req.params.id;

        const connection = await pool.getConnection();
        const query = `SELECT (SELECT username FROM users WHERE user_id = comments.commenter_id) as username, comment, likes, time_stamp FROM comments WHERE post_id = '${post_id}' order by time_stamp desc;`; 
        const [rows, fields1] = await connection.execute(query);
        
        const data = rows;
        connection.release();

        res.json({status : "Fetched post comments", isRetrieved : true, comments: data});

    }catch(err){
        console.log(err);
        res.json({status : "Couldn't find the post you're looking for", isRetrieved : false});
    }
}

module.exports.makeNewComment = async(req, res,next) => {
    try{

        const username = JSON.parse(Buffer.from(req.cookies.jwt.split('.')[1], 'base64').toString()).username;
        const commenter_id = getHash('user_id', username);
        const post_id = req.body.post_id;
        const comment = req.body.comment;

        const comment_id = getHash('comment_id', commenter_id + post_id + comment);

        const connection = await pool.getConnection();
        const query = `INSERT INTO comments(post_id, commenter_id, comment_id, comment) VALUES('${post_id}', '${commenter_id}', '${comment_id}', ${connection.escape(comment)});`;
        const [result] = await connection.execute(query);
        connection.release();

        res.json({isPostedComment: true});

    }catch(err){
        console.log(err);
        res.json({isPostedComment: false});
    }
}

module.exports.upvotePost = async(req, res, next) => {
    try{
        const username = JSON.parse(Buffer.from(req.cookies.jwt.split('.')[1], 'base64').toString()).username;
        const user_id = getHash('user_id', username);
        const post_id = req.params.id;

        const connection = await pool.getConnection();
        const query1 = `call upvote('${user_id}', '${post_id}');`;
        let [result] = await connection.execute(query1);

        connection.release();

        res.json({updatedVote : true});
    }catch(err){
        console.log(err);
        res.json({updatedVote : false});

    }
}

module.exports.downvotePost = async(req, res, next) => {
    try{
        const username = JSON.parse(Buffer.from(req.cookies.jwt.split('.')[1], 'base64').toString()).username;
        const user_id = getHash('user_id', username);
        const post_id = req.params.id;

        const connection = await pool.getConnection();
        const query1 = `call downvote('${user_id}', '${post_id}');`;
        let [result] = await connection.execute(query1);

        connection.release();
        
        res.json({downvoted : true});
    }catch(err){
        res.json({downvoted : false});

    }
}
