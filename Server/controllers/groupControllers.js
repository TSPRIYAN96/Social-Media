require('dotenv').config();
const {pool} = require('../Database/connection.js');
const crypto = require('crypto');
require('dotenv').config();

const getHash = (secretValue, hashSource, algorithm = 'sha256') => {
    const hmac = crypto.createHmac(algorithm, secretValue);
    hmac.update(hashSource);
    return hmac.digest('hex');
}

module.exports.createGroup = async(req, res, next) => {
    console.log(req.body);
    try{
        const {groupname, description, img_public_id, img_folder_name, img_version, tags} = req.body;
        const username = JSON.parse(Buffer.from(req.cookies.jwt.split('.')[1], 'base64').toString()).username;
        const owner_id = getHash('user_id', username);

        const group_id = getHash('group_id', req.body.groupname);

        const connection = await pool.getConnection();
        const query1 = `INSERT INTO groups(group_id, owner_id, groupname, description, img_public_id, img_folder_name, img_version) VALUES('${group_id}', '${owner_id}', '${groupname}', ${connection.escape(description)} ,'${img_public_id}', '${img_folder_name}', '${img_version}');`;
        let [result] = await connection.execute(query1);

        let query2;
        if(req.body.groupType === 'private'){
            query2 = `INSERT INTO private_groups(group_id) VALUES('${group_id}');`
        }else{
            query2 = `INSERT INTO public_groups(group_id) VALUES('${group_id}');`;   
        }
        [result] = await connection.execute(query2);

        let query3 = `INSERT INTO user_groups(group_id, user_id, group_type) VALUES('${group_id}', '${owner_id}', '${req.body.groupType}');`;
        [result] =  await connection.execute(query3);

        if(tags.length){
            for(let tag of tags){
                const user_id = getHash('user_id', tag);
                req.body.groupType ||= 'public';
                query3 = `INSERT INTO user_groups(group_id, user_id, group_type) VALUES('${group_id}', '${user_id}', '${req.body.groupType}');`;
                [result] =  await connection.execute(query3);
            }
        }

        connection.release();

        res.json({isCreated: true, status: 'Group created', groupname});

    }catch(err){
        console.log(err);
        res.json({isCreated : false, status: "Couldn't create group"});
    }
}

module.exports.retrieveGroupData = async(req, res, next) => {
    console.log(req.body);
    try{
        const username = JSON.parse(Buffer.from(req.cookies.jwt.split('.')[1], 'base64').toString()).username;
        const user_id = getHash('user_id', username);
        const group_id = getHash('group_id', req.params.groupname);

        let groupAssociation = [0, 0];
        
        const connection = await pool.getConnection();
        const query1 = `SELECT count(*) as count FROM public_groups WHERE group_id = '${group_id}';`
        const [rows1, field1] = await connection.execute(query1);
        groupAssociation[1] = (rows1[0].count); // 1 -> Group is public and exists,  0 -> Group does not exist or Group is private

        const query2 = `SELECT 1 AS is_member from user_groups where user_id = '${user_id}' AND group_id = '${group_id}';`;
        const [rows2, field2] = await connection.execute(query2);
        groupAssociation[0] = rows2.length;
        groupAssociation = groupAssociation.join('');
        console.log(groupAssociation);

        if(groupAssociation === '00'){
            connection.release();
            res.json({isNotFound: true});
            return;
        }
        
        const query3 = `SELECT groupname, description, (SELECT username FROM users WHERE user_id = groups.owner_id) as owner_name, img_folder_name, img_public_id, img_version, member_count, created_at from groups where group_id = '${group_id}';`;
        // console.log(query3);
        const [rows3, field3] = await connection.execute(query3);
        
        const query4 = `SELECT (select username from users where user_id = user_groups.user_id) as username from user_groups where group_id = '${group_id}';`;
        // console.log(query4);
        const [rows4, fields4] = await connection.execute(query4);
        
        // /*  Fetch group posts */

        // const query5 = `SELECT posts.post_id, users.username, posts.img_folder_name, posts.img_version, posts.img_public_id,  posts.text_content, posts.time_stamp, posts.likes, posts.dislikes FROM posts INNER JOIN group_posts INNER JOIN users ON posts.post_id = group_posts.post_id  AND users.user_id = posts.creator_id AND group_posts.group_id = '${group_id} LIMIT 3 OFFSET 0'`;

        connection.release();
        
        res.json({isFetched: true, ...rows3[0], 
                  isMember: groupAssociation[0] === '1',
                  isOwner: rows3[0].owner_name ===  username,
                  group_type : groupAssociation[1] === '1' ? 'public' : 'private',
                  users: rows4});
        return;
        
    }catch(err){
        console.log(err);
        res.json({isFetched : false, status : "Couldn't fetch group data"});
    }
}

module.exports.getNotifications = async(req, res, next) => {
    try{
        const username = JSON.parse(Buffer.from(req.cookies.jwt.split('.')[1], 'base64').toString()).username;
        const user_id = getHash('user_id', username);
        
        const connection = await pool.getConnection();
        const query = `SELECT status, message, time_stamp from notifications where user_id = '${user_id}' order by time_stamp desc;`;
        const [rows, fields] = await connection.execute(query);
        connection.release();

        console.log(rows);
        res.json({isFetched : true, notifications : rows});
        
    }catch(err){
        console.log(err);
        res.json({isFetched : false, notifications : rows});
    }
}


module.exports.deleteNotifications = async(req, res, next) => {
    try{
        const username = JSON.parse(Buffer.from(req.cookies.jwt.split('.')[1], 'base64').toString()).username;
        const user_id = getHash('user_id', username);
        
        const connection = await pool.getConnection();
        const query = `DELETE FROM notifications where user_id = '${user_id}';`;
        const [result] = await connection.execute(query);
        connection.release();

        console.log(result);
        res.json({isDeleted : true});
        
    }catch(err){
        console.log(err);
        res.json({isDeleted : true});
    }
}

module.exports.addMember = async(req, res, next) => {
    try{
        const newMemberName = req.body.memberName;
        const group_id = getHash('group_id', req.body.groupname);

        const connection = await pool.getConnection();
        const query1 = `SELECT count(*) as count, user_id from users where username = '${newMemberName}';`;
        const [rows1, fields1] = await connection.execute(query1);
        console.log(rows1);
        
        if(rows1[0].count === 0){
            res.json({isAdded: false, status : 'User not found'});
            return;
        }
        
        const query2 = `INSERT INTO user_groups values('${group_id}', '${rows1[0].user_id}', '${req.body.groupType}');`;
        const [rows2, fields2] = await connection.execute(query2);
        
        res.json({isAdded: true, status : `Added @${newMemberName}`});
        
    }catch(err){
        console.log(err);
        res.json({isAdded: false, status : 'Something went wrong'});

    }
}

module.exports.removeMember = async(req, res, next) => {
    try{
        const newMemberName = req.body.memberName;
        const group_id = getHash('group_id', req.body.groupname);

        const connection = await pool.getConnection();
        const query1 = `SELECT count(*) as count, user_id from users where username = '${newMemberName}';`;
        const [rows1, fields1] = await connection.execute(query1);
        console.log(rows1);
        
        if(rows1[0].count === 0){
            res.json({isRemoved: false, status : 'User not found'});
            return;
        }
        
        const query2 = `DELETE FROM user_groups WHERE group_id = '${group_id}' AND user_id = '${rows1[0].user_id}';`;
        const [rows2, fields2] = await connection.execute(query2);
        
        res.json({isRemoved: true, status : `Removed @${newMemberName}`});
        
    }catch(err){
        console.log(err);
        res.json({isRemoved: false, status : 'Something went wrong'});

    }
}

module.exports.retrieveGroupPosts = async(req, res, next) => {
    console.log(req.body);
    try{
        const username = JSON.parse(Buffer.from(req.cookies.jwt.split('.')[1], 'base64').toString()).username;
        const user_id = getHash('user_id', username);
        const group_id = getHash('group_id', req.body.groupname);
        const offset = req.body.offset;
        const ordering = req.body.ordering

        let groupAssociation = [0, 0];
        
        const connection = await pool.getConnection();
        const query1 = `SELECT count(*) as count FROM public_groups WHERE group_id = '${group_id}';`
        const [rows1, field1] = await connection.execute(query1);
        groupAssociation[1] = (rows1[0].count); // 1 -> Group is public and exists,  0 -> Group does not exist or Group is private

        const query2 = `SELECT 1 AS is_member from user_groups where user_id = '${user_id}' AND group_id = '${group_id}';`;
        const [rows2, field2] = await connection.execute(query2);
        groupAssociation[0] = rows2.length;
        groupAssociation = groupAssociation.join('');
        console.log(groupAssociation);

        if(groupAssociation === '00'){
            connection.release();
            res.json({isNotFound: true});
            return;
        }

        const query3 = `SELECT posts.post_id, users.username, posts.img_folder_name, posts.img_version, posts.img_public_id, posts.text_content, posts.time_stamp, posts.likes, posts.dislikes FROM posts INNER JOIN group_posts INNER JOIN users ON posts.post_id = group_posts.post_id  AND users.user_id = posts.creator_id AND group_posts.group_id = '${group_id}' order by ${ordering === 'Recent' ? 'posts.time_stamp' : 'posts.likes + posts.dislikes'} desc LIMIT 3 OFFSET ${offset};`;
        console.log(query3);
        const [rows3, fields3] = await connection.execute(query3);

        if(!rows3.length){
            res.json({isRetrieved: false});
            return;
        }

        const data = [];

        for(post of rows3){
            const postData = {...post, links: [], tags: []};

            const query4 = `SELECT link from post_links where post_id = '${post.post_id}';`;
            const [rows4, fields4] = await connection.execute(query4);

            for(let item of rows4) postData.links.push(item.link);
            
            const query5 = `SELECT tag from post_tags where post_id = '${post.post_id}';`;
            const [rows5, fields5] = await connection.execute(query5);

            
            for(let item of rows5) postData.tags.push(item.tag);
            
            
            const query6 = `SELECT vote_type from votes where user_id = '${user_id}' AND post_id = '${post.post_id}';`;
            const [rows6, fields6] = await connection.execute(query6);
        

            postData.userVote = user_id && rows6.length ? rows6[0].vote_type : null // Current users's vote

            data.push(postData);
        }
        
        console.log(data);
        connection.release();

        res.json({status : "Fetched post data", isRetrieved : true, data});



    }catch(err){
        console.log(err);
        res.json({isFetched : false, status : "Couldn't fetch group data"});
    }
}




