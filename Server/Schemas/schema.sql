CREATE DATABASE social_network;

USE social_network;

CREATE TABLE users(user_id VARCHAR(256) PRIMARY KEY NOT NULL,
                   username VARCHAR(255) NOT NULL,
                   email VARCHAR(255) NOT NULL, 
                   password VARCHAR(256) NOT NULL);

CREATE TABLE auth(user_id VARCHAR(256),
                  auth_token VARCHAR(256) NOT NULL,
                  loggedin_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE);

CREATE TABLE connections(follower_id VARCHAR(256) NOT NULL,
                         following_id VARCHAR(256) NOT NULL,
                         start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         FOREIGN KEY (follower_id) REFERENCES users(user_id) ON DELETE CASCADE,
                         FOREIGN KEY (following_id) REFERENCES users(user_id) ON DELETE CASCADE);

CREATE TABLE posts(post_id VARCHAR(256) PRIMARY KEY NOT NULL,
                   creator_id VARCHAR(256) NOT NULL,
                   img_folder_name VARCHAR(128),
                   img_public_id VARCHAR(128),
                   img_version VARCHAR(128),
                   text_content VARCHAR(480),
                   time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                   likes INT DEFAULT 0,
                   dislikes INT DEFAULT 0,
                   is_private CHAR(1) DEFAULT '0',
                   FOREIGN KEY (creator_id) REFERENCES users(user_id) ON DELETE CASCADE);

CREATE TABLE post_links(post_id VARCHAR(256),
                        link VARCHAR(255) NOT NULL,
                        FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE);

CREATE TABLE post_tags(post_id VARCHAR(256),
                        tag VARCHAR(255) NOT NULL,
                        FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE);


CREATE TABLE comments(post_id VARCHAR(256) NOT NULL,
                      commenter_id VARCHAR(256) NOT NULL,
                      comment_id VARCHAR(256) NOT NULL,
                      comment VARCHAR(240),
                      likes INT DEFAULT 0,
                      time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                      PRIMARY KEY (commenter_id, post_id, comment_id),  
                      FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
                      FOREIGN KEY (commenter_id) REFERENCES users(user_id) ON DELETE CASCADE);

/* vote_type : Like -> 'l' , Dislike -> 'd' */
CREATE TABLE votes(user_id VARCHAR(256) NOT NULL,
                    post_id VARCHAR(256) NOT NULL,
                    vote_type VARCHAR(1) NOT NULL,
                    PRIMARY KEY (user_id, post_id),
                    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
                    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE);

CREATE TABLE groups(group_id VARCHAR(256) PRIMARY KEY NOT NULL,
                    owner_id VARCHAR(256),
                    groupname VARCHAR(255) NOT NULL,
                    description VARCHAR(480),
                    img_folder_name VARCHAR(128),
                    img_public_id VARCHAR(128),
                    img_version VARCHAR(128),
                    member_count INT DEFAULT 1,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (owner_id) REFERENCES users(user_id));

CREATE TABLE public_groups(group_id VARCHAR(256) PRIMARY KEY NOT NULL,
                          moderator_count INT DEFAULT 0,
                          FOREIGN KEY (group_id) REFERENCES groups(group_id) ON DELETE CASACADE);

CREATE TABLE private_groups(group_id VARCHAR(256) PRIMARY KEY NOT NULL,
                          agenda VARCHAR(800),
                          FOREIGN KEY (group_id) REFERENCES groups(group_id) ON DELETE CASACADE);

CREATE TABLE moderators(moderator_id VARCHAR(256) NOT NULL,
                        group_id VARCHAR(256) NOT NULL,
                        PRIMARY KEY (moderator_id, group_id),
                        FOREIGN KEY (moderator_id) REFERENCES users(user_id) ON DELETE CASCADE,
                        FOREIGN KEY (group_id) REFERENCES groups(group_id) ON DELETE CASCADE);


CREATE TABLE user_groups(group_id VARCHAR(256) NOT NULL,
                         user_id VARCHAR(256) NOT NULL,
                         group_type VARCHAR(7) NOT NULL,
                         PRIMARY KEY (group_id, user_id),
                         FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
                         FOREIGN KEY (group_id) REFERENCES groups(group_id) ON DELETE CASCADE);

CREATE TABLE notifications(user_id VARCHAR(256) NOT NULL,
                           notification_id VARCHAR(256) NOT NULL,
                           status VARCHAR(10) NOT NULL,
                           message VARCHAR(140),
                           time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                           PRIMARY KEY (user_id, notification_id),
                           FOREIGN KEY (user_id) REFERENCES users(user_id));

CREATE TABLE group_posts(group_id VARCHAR(256) NOT NULL,
                         post_id VARCHAR(256) NOT NULL,
                         PRIMARY KEY (group_id, post_id),
                         FOREIGN KEY (group_id) REFERENCES groups(group_id) ,
                         FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
                         );



/* Tables
    posts - strong entity,
    owners - strong entity,
    groups - strong entity,
    comments - weak entity,
*/