const Model = require('./model').Model;
const Posts = require('./post');
const db = require('./model').db;

// CREATE TABLE post_tag (
//     post_id INT,
//     tag_id INT,
//     PRIMARY KEY (post_id, tag_id),
//     FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
//     FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
// );

class PostTag extends Model {
    constructor(post_id = 0, tag_id = 0) {
        super();
        this.post_id = post_id;
        this.tag_id = tag_id;
    }

    static async findByPostId(post_id) {
        let results = await super.findBy('post_id', post_id, 'post_tag');
        let posts = [];
        for (let i = 0; i < results.length; i++) {
            let post = await Posts.findById(results[i].post_id);
            posts.push(post);
        }
        return posts;
    }

    static async findByTagId(tag_id) {
        let results = await super.findBy('tag_id', tag_id, 'post_tag');
        let posts = [];
        for (let i = 0; i < results.length; i++) {
            let post = await Posts.findById(results[i].post_id);
            posts.push(post);
        }
        return posts;
    }

    static async delete(post_id, tag_id) {
        const selectQ = `SELECT * FROM post_tag WHERE post_id=? AND tag_id=?`;
        return new Promise((resolve, reject) => {
            db.query(selectQ, [post_id, tag_id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    if (results.length != 0) {
                        const deleteQ = `DELETE FROM post_tag WHERE post_id=? AND tag_id=?`;
                        db.query(deleteQ, [post_id, tag_id], (err) => {
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

    static async deleteByPostId(post_id) {
        const selectQ = `SELECT * FROM post_tag WHERE post_id=?`;
        return new Promise((resolve, reject) => {
            db.query(selectQ, [post_id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    if (results.length != 0) {
                        const deleteQ = `DELETE FROM post_tag WHERE post_id=?`;
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

    static async save(postTag) {
        const selectQ = `SELECT * FROM post_tag WHERE post_id=? AND tag_id=?`;
        return new Promise((resolve, reject) => {
            db.query(selectQ, [postTag.post_id, postTag.tag_id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    if (results.length != 0) {
                        resolve();
                    } else {
                        const insertQ = `INSERT INTO post_tag SET ?`;
                        db.query(insertQ, [postTag], (err, result) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        });
                    }
                }
            });
        });
    }
}


module.exports = PostTag;