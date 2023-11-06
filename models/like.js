const Model = require('./model').Model;

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
    constructor(user_id = 0, publish_date = new Date(), post_id = 0, comment_id = 0, type = 'like') {
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
        let results = await super.findBy('post_id', post_id, 'likes');
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
        let results = await super.findBy('comment_id', comment_id, 'likes');
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

    static async deleteByPostId(post_id) {
        const selectQ = `SELECT * FROM likes WHERE post_id=?`;
        return new Promise((resolve, reject) => {
            db.query(selectQ, [post_id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    if (results.length != 0) {
                        const deleteQ = `DELETE FROM likes WHERE post_id=?`;
                        db.query(deleteQ, [post_id], (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        });
                    } else {
                        resolve();
                    }
                }
            });
        });
    }

    static async deleteUserLike(user_id, post_id) {
        const selectQ = `SELECT * FROM likes WHERE user_id=? AND post_id=?`;
        return new Promise((resolve, reject) => {
            db.query(selectQ, [user_id, post_id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    if (results.length != 0) {
                        const deleteQ = `DELETE FROM likes WHERE user_id=? AND post_id=?`;
                        db.query(deleteQ, [user_id, post_id], (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        });
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
                        const deleteQ = `DELETE FROM likes WHERE user_id=? AND comment_id=?`;
                        db.query(deleteQ, [user_id, comment_id], (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        });
                    } else {
                        resolve();
                    }
                }
            });
        });
    }

    static async deleteByCommentId(comment_id) {
        const selectQ = `SELECT * FROM likes WHERE comment_id=?`;
        return new Promise((resolve, reject) => {
            db.query(selectQ, [comment_id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    if (results.length != 0) {
                        const deleteQ = `DELETE FROM likes WHERE comment_id=?`;
                        db.query(deleteQ, [comment_id], (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        });
                    } else {
                        resolve();
                    }
                }
            });
        });
    }

    static async deleteById(id) {
        await super.delete(id, 'likes');
    }
    
    static async save(like) {
        await super.save(like, 'likes');
        return await this.findById(like.id);
    }
}

module.exports = Like;