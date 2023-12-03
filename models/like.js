const Model = require('./model').Model;
// const Post = require('./post');
// const Comment = require('./comment');
// const User = require('./user');
const db = require('./model').db;

// CREATE TABLE likes (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     user_id INT,
//     publish_date DATETIME,
//     post_id INT,
//     comment_id INT,
//     type ENUM('like', 'dislike'),
//     FOREIGN KEY (user_id) REFERENCES users(id),
//     FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
//     FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE
// );

class Like extends Model {
    constructor(user_id = 0, publish_date = new Date(), post_id = null, comment_id = null, type = 'like') {
        super();
        this.id = 0;
        this.user_id = user_id;
        this.publish_date = publish_date;
        this.post_id = post_id;
        this.comment_id = comment_id;
        this.type = type;
    }

    static async findAll() {
        let results = await super.findAll('likes');
        let likes = [];
        for (let i = 0; i < results.length; i++) {
            let like = new Like();
            like.id = results[i].id;
            like.user_id = results[i].user_id;
            like.publish_date = results[i].publish_date;
            like.post_id = results[i].post_id;
            like.comment_id = results[i].comment_id;
            like.type = results[i].type;
            likes.push(like);
        }
        return likes;
    }

    static async findById(id) {
        let results = await super.find(id, 'likes');
        let like = new Like();
        if (results[0]) {
            like.id = results[0].id;
            like.user_id = results[0].user_id;
            like.publish_date = results[0].publish_date;
            like.post_id = results[0].post_id;
            like.comment_id = results[0].comment_id;
            like.type = results[0].type;
        }
        return like;
    }

    static async findByPostId(post_id) {
        let results = await super.find(post_id, 'likes', 'post_id');
        let likes = [];
        for (let i = 0; i < results.length; i++) {
            let like = new Like();
            like.id = results[i].id;
            like.user_id = results[i].user_id;
            like.publish_date = results[i].publish_date;
            like.post_id = results[i].post_id;
            like.comment_id = results[i].comment_id;
            like.type = results[i].type;
            likes.push(like);
        }
        return likes;
    }

    static async findByCommentId(comment_id) {
        let results = await super.find(comment_id, 'likes', 'comment_id');
        let likes = [];
        for (let i = 0; i < results.length; i++) {
            let like = new Like();
            like.id = results[i].id;
            like.user_id = results[i].user_id;
            like.publish_date = results[i].publish_date;
            like.post_id = results[i].post_id;
            like.comment_id = results[i].comment_id;
            like.type = results[i].type;
            likes.push(like);
        }
        return likes;
    }

    static async findByUserId(user_id) {
        let results = await super.find(user_id, 'likes', 'user_id');
        let likes = [];
        for (let i = 0; i < results.length; i++) {
            let like = new Like();
            like.id = results[i].id;
            like.user_id = results[i].user_id;
            like.publish_date = results[i].publish_date;
            like.post_id = results[i].post_id;
            like.comment_id = results[i].comment_id;
            like.type = results[i].type;
            likes.push(like);
        }
        return likes;
    }

    static async postLikesCount(post_id) {
        let results = await this.findByPostId(post_id);
        let likes = 0;
        for (let i = 0; i < results.length; i++) {
            if (results[i].type == 'like') {
                likes++;
            }
        }
        return likes;
    }

    static async postDislikesCount(post_id) {
        let results = await this.findByPostId(post_id);
        let dislikes = 0;
        for (let i = 0; i < results.length; i++) {
            if (results[i].type == 'dislike') {
                dislikes++;
            }
        }
        return dislikes;
    }

    static async userPostLike(user_id, post_id) {
        let results = await this.findByPostId(post_id);
        let like = new Like();
        like.type = '';
        for (let i = 0; i < results.length; i++) {
            if (results[i].user_id == user_id) {
                like = results[i];
            }
        }
        return like;
    }

    static async userCommentLike(user_id, comment_id) {
        let results = await this.findByCommentId(comment_id);
        let like = new Like();
        like.type = '';
        for (let i = 0; i < results.length; i++) {
            if (results[i].user_id == user_id) {
                like = results[i];
            }
        }
        return like;
    }

    static async commentLikesCount(comment_id) {
        let results = await this.findByCommentId(comment_id);
        let likes = 0;
        for (let i = 0; i < results.length; i++) {
            if (results[i].type == 'like') {
                likes++;
            }
        }
        return likes;
    }

    static async commentDislikesCount(comment_id) {
        let results = await this.findByCommentId(comment_id);
        let dislikes = 0;
        for (let i = 0; i < results.length; i++) {
            if (results[i].type == 'dislike') {
                dislikes++;
            }
        }
        return dislikes;
    }

    static async deleteUserLike(user_id, post_id) {
        const selectQ = `SELECT * FROM likes WHERE user_id=? AND post_id=?`;
        return new Promise((resolve, reject) => {
            db.query(selectQ, [user_id, post_id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    if (results.length != 0) {
                        this.deleteById(results[0].id).then(() => { resolve(); });
                    } else {
                        resolve();
                    }
                }
            });
        });
    }

    static async deleteUserLikeComment(user_id, comment_id) {
        const selectQ = `SELECT * FROM likes WHERE user_id=? AND comment_id=?`;
        return new Promise((resolve, reject) => {
            db.query(selectQ, [user_id, comment_id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    if (results.length != 0) {
                        this.deleteById(results[0].id).then(() => { resolve(); });
                    } else {
                        resolve();
                    }
                }
            });
        });
    }

    static async deleteByPostId(post_id) {
        let likes = await this.findByPostId(post_id);
        for (let i = 0; i < likes.length; i++) {
            await this.deleteById(likes[i].id);
        }
    }

    static async deleteByCommentId(comment_id) {
        let likes = await this.findByCommentId(comment_id);
        for (let i = 0; i < likes.length; i++) {
            await this.deleteById(likes[i].id);
        }
    }

    static async deleteByUserId(user_id) {
        let likes = await this.findByUserId(user_id);
        for (let i = 0; i < likes.length; i++) {
            await this.deleteById(likes[i].id);
        }
    }

    static async deleteById(id) {
        let like = await this.findById(id);
        // let user_id;
        // if (like.post_id != 0) {
        //     let post = await Post.findById(like.post_id);
        //     user_id = post.user_id;
        // }
        // if (like.comment_id != 0) {
        //     let comment = await Comment.findById(like.comment_id);
        //     user_id = comment.user_id;
        // }
        // let user = await User.findById(user_id);
        // if(user.id != 0){
        //     if (like.type == 'like') {
        //         user.rating--;
        //     }
        //     if (like.type == 'dislike') {
        //         user.rating++;
        //     }
        //     await User.save(user);
        // }
        await super.delete(id, 'likes');
    }
    
    static async save(like) {
        if(like.post_id != 0){
            await this.deleteUserLike(like.user_id, like.post_id);
        }
        else if(like.comment_id != 0){
            await this.deleteUserLikeComment(like.user_id, like.comment_id);
        }
        like.id = 0;
        // let user_id;
        // if (like.post_id != 0) {
        //     let post = await Post.findById(like.post_id);
        //     user_id = post.user_id;
        // }
        // if (like.comment_id != 0) {
        //     let comment = await Comment.findById(like.comment_id);
        //     user_id = comment.user_id;
        // }
        // let user = await User.findById(user_id);
        // if (like.type == 'like') {
        //     user.rating++;
        // }
        // if (like.type == 'dislike') {
        //     user.rating--;
        // }
        // await User.save(user);
        let id = await super.save(like, 'likes');
        return await this.findById(id);
    }
}

module.exports = Like;