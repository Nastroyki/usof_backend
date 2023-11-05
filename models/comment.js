const Model = require('./model').Model;
const db = require('./model').db;

const Like = require('./like');

// CREATE TABLE comments (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     user_id INT,
//     post_id INT,
//     publish_date DATETIME,
//     content TEXT,
//     FOREIGN KEY (user_id) REFERENCES users(id)
// );

class Comment extends Model {
    constructor(user_id = 0, post_id = 0, publish_date = new Date(), content = '') {
        super();
        this.id = 0;
        this.user_id = user_id;
        this.post_id = post_id;
        this.publish_date = publish_date;
        this.content = content;
    }

    static async findById(id) {
        let results = await super.find(id, 'comments');
        let comment = new Comment();
        if (results[0]) {
            comment.id = results[0].id;
            comment.user_id = results[0].user_id;
            comment.post_id = results[0].post_id;
            comment.publish_date = results[0].publish_date;
            comment.content = results[0].content;
        }
        return comment;
    }

    static async findByPostId(post_id) {
        let results = await super.findBy('post_id', post_id, 'comments');
        let comments = [];
        for (let i = 0; i < results.length; i++) {
            let comment = new Comment();
            comment.id = results[i].id;
            comment.user_id = results[i].user_id;
            comment.post_id = results[i].post_id;
            comment.publish_date = results[i].publish_date;
            comment.content = results[i].content;
            comments.push(comment);
        }
        return comments;
    }

    static async deleteById(id) {
        Like.deleteByCommentId(id);
        await super.delete(id, 'comments');
    }

    static async deleteByPostId(post_id) {
        const selectQ = `SELECT * FROM comments WHERE post_id=?`;
        return new Promise((resolve, reject) => {
            db.query(selectQ, [post_id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    for (let i = 0; i < results.length; i++) {
                        Like.deleteByCommentId(results[i].id);
                    }
                    if (results.length != 0) {
                        const deleteQ = `DELETE FROM comments WHERE post_id=?`;
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

    static async save(comment) {
        await super.save(comment, 'comments');
        return await this.findById(comment.id);
    }
}

module.exports = Comment;