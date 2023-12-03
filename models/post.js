const Model = require('./model').Model;
const db = require('./model').db;

const Like = require('./like');
const Comment = require('./comment');

// CREATE TABLE posts (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     user_id INT NOT NULL,
//     title VARCHAR(255) NOT NULL,
//     publish_date DATETIME NOT NULL,
//     status ENUM('active', 'solved'),
//     content TEXT NOT NULL,
//     FOREIGN KEY (user_id) REFERENCES users(id)
// );

class Post extends Model {
    constructor(user_id = 0, title = '', publish_date = new Date(), status = 'active', content = '') {
        super();
        this.id = 0;
        this.user_id = user_id;
        this.title = title;
        this.publish_date = publish_date;
        this.status = status;
        this.content = content;
    }

    static async findAll() {
        let results = await super.findAll('posts');
        let posts = [];
        for (let i = 0; i < results.length; i++) {
            let post = new Post();
            post.id = results[i].id;
            post.user_id = results[i].user_id;
            post.title = results[i].title;
            post.publish_date = results[i].publish_date;
            post.status = results[i].status;
            post.content = results[i].content;
            posts.push(post);
        }
        return posts;
    }

    static async findPostsPage(page, limit, tag = 0, status = '', sort = 'publish_date', order = 'DESC') {
        let query = `SELECT * FROM posts`;
        if (status !== '') {
            query += ` WHERE status = '${status}'`;
        }
        if (tag !== 0) {
            query += ` AND id IN (SELECT post_id FROM post_tag WHERE tag_id = ${tag})`;
        }
        if (sort === 'rating') {
            query += ` ORDER BY (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id AND likes.type = 'like') - (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id AND likes.type = 'dislike') ${order}`;
        } else {
            query += ` ORDER BY ${sort} ${order}`;
        }
        return new Promise((resolve, reject) => {
            let len;
            db.query(query, (err, results) => {
                if (err) {
                    reject(err);
                }
                len = results.length;

                query += ` LIMIT ${(page - 1) * limit}, ${limit}`;

                db.query(query, (err, results) => {
                    if (err) {
                        reject(err);
                    }
                    let posts = [];
                    for (let i = 0; i < results.length; i++) {
                        let post = new Post();
                        post.id = results[i].id;
                        post.user_id = results[i].user_id;
                        post.title = results[i].title;
                        post.publish_date = results[i].publish_date;
                        post.status = results[i].status;
                        post.content = results[i].content;
                        posts.push(post);
                    }
                    resolve({ posts, len, limit });
                });
            });
        });
    }

    static async findById(id) {
        let results = await super.find(id, 'posts');
        let post = new Post();
        if (results[0]) {
            post.id = results[0].id;
            post.user_id = results[0].user_id;
            post.title = results[0].title;
            post.publish_date = results[0].publish_date;
            post.status = results[0].status;
            post.content = results[0].content;
        }
        return post;
    }

    static async findByUserId(user_id) {
        let results = await super.findBy('user_id', user_id, 'posts');
        let posts = [];
        for (let i = 0; i < results.length; i++) {
            let post = new Post();
            post.id = results[i].id;
            post.user_id = results[i].user_id;
            post.title = results[i].title;
            post.publish_date = results[i].publish_date;
            post.status = results[i].status;
            post.content = results[i].content;
            posts.push(post);
        }
        return posts;
    }

    static async deleteById(id) {
        Like.deleteByPostId(id);
        Comment.deleteByPostId(id);
        await super.delete(id, 'posts');
    }

    static async deleteByUserId(user_id) {
        let posts = await this.findByUserId(user_id);
        for (let i = 0; i < posts.length; i++) {
            await this.deleteById(posts[i].id);
        }
    }

    static async save(post) {
        let id = await super.save(post, 'posts');
        return await this.findById(id);
    }
}

module.exports = Post;