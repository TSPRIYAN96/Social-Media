/* Upvote */

DELIMITER //
CREATE PROCEDURE upvote(IN v_user_id VARCHAR(256), IN v_post_id VARCHAR(256))
BEGIN
	DECLARE is_upvoted INT DEFAULT 0;
	DECLARE is_downvoted INT DEFAULT 0;

    SELECT count(*) into is_upvoted from votes where user_id = v_user_id AND post_id = v_post_id AND vote_type = 'l';
    SELECT count(*) into is_downvoted from votes where user_id = v_user_id AND post_id = v_post_id AND vote_type = 'd';
    DELETE from votes WHERE user_id = v_user_id AND post_id = v_post_id;
    
    IF is_upvoted = 1 THEN
    	UPDATE posts SET likes = likes - 1 WHERE post_id = v_post_id;
    ELSEIF is_downvoted = 1 THEN
    	UPDATE posts SET dislikes = dislikes-1, likes = likes + 1 WHERE post_id = v_post_id;
        INSERT INTO votes VALUES(v_user_id, v_post_id, 'l');
    ELSE
    	UPDATE posts SET likes = likes + 1 WHERE post_id = v_post_id;
        INSERT INTO votes VALUES(v_user_id, v_post_id, 'l');
    END IF;

END //

DELIMITER ;

/* Downvote */

DELIMITER //
CREATE PROCEDURE downvote(IN v_user_id VARCHAR(256), IN v_post_id VARCHAR(256))
BEGIN
	DECLARE is_upvoted INT DEFAULT 0;
	DECLARE is_downvoted INT DEFAULT 0;

    SELECT count(*) into is_upvoted from votes where user_id = v_user_id AND post_id = v_post_id AND vote_type = 'l';
    SELECT count(*) into is_downvoted from votes where user_id = v_user_id AND post_id = v_post_id AND vote_type = 'd';
    DELETE from votes WHERE user_id = v_user_id AND post_id = v_post_id;
    
    IF is_upvoted = 1 THEN
    	UPDATE posts SET likes = likes - 1, dislikes = dislikes + 1 WHERE post_id = v_post_id;
        INSERT INTO votes VALUES(v_user_id, v_post_id, 'd');
    ELSEIF is_downvoted = 1 THEN
    	UPDATE posts SET dislikes = dislikes-1 WHERE post_id = v_post_id;
    ELSE
    	UPDATE posts SET dislikes = dislikes + 1 WHERE post_id = v_post_id;
        INSERT INTO votes VALUES(v_user_id, v_post_id, 'd');
    END IF;

END //

DELIMITER ;



