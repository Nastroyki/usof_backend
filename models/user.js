const Model = require('./model').Model;
const Post = require('./post');
const Comment = require('./comment');
const Like = require('./like');
const CommentAnswer = require('./commentAnswer');

// CREATE TABLE users (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     login VARCHAR(255) UNIQUE NOT NULL,
//     password VARCHAR(255) NOT NULL,
//     full_name VARCHAR(255),
//     email VARCHAR(255) NOT NULL,
//     email_code VARCHAR(255),
//     reset_code VARCHAR(255),
//     profile_picture VARCHAR(255),
//     rating INT DEFAULT 0,
//     role ENUM('admin', 'user') DEFAULT 'user'
// );

class User extends Model {
    constructor(login = '', password = '', full_name = '', email = '', email_code = '', reset_code = '', profile_picture = '', rating = 0, role = 'user') {
        super();
        this.id = 0;
        this.login = login;
        this.password = password;
        this.full_name = full_name;
        this.email = email;
        this.email_code = email_code;
        this.reset_code = reset_code;
        this.profile_picture = profile_picture;
        this.rating = rating;
        this.role = role;
    }

    static async findAll() {
        let results = await super.findAll('users');
        let users = [];
        for (let i = 0; i < results.length; i++) {
            let user = new User();
            user.id = results[i].id;
            user.login = results[i].login;
            user.password = results[i].password;
            user.full_name = results[i].full_name;
            user.email = results[i].email;
            user.email_code = results[i].email_code;
            user.reset_code = results[i].reset_code;
            user.profile_picture = results[i].profile_picture;
            user.rating = results[i].rating;
            user.role = results[i].role;
            users.push(user.safe());
        }
        return users;
    }

    static async findById(id) {
        let results = await super.find(id, 'users');
        let user = new User();
        if(results[0]){
            user.id = results[0].id;
            user.login = results[0].login;
            user.password = results[0].password;
            user.full_name = results[0].full_name;
            user.email = results[0].email;
            user.email_code = results[0].email_code;
            user.reset_code = results[0].reset_code;
            user.profile_picture = results[0].profile_picture;
            user.rating = results[0].rating;
            user.role = results[0].role;
        }
        return user;
    }

    static async findByLogin(login) {
        let results = await super.find(login, 'users', 'login');
        let user = new User();
        if (results[0]) {
            user.id = results[0].id;
            user.login = results[0].login;
            user.password = results[0].password;
            user.full_name = results[0].full_name;
            user.email = results[0].email;
            user.email_code = results[0].email_code;
            user.reset_code = results[0].reset_code;
            user.profile_picture = results[0].profile_picture;
            user.rating = results[0].rating;
            user.role = results[0].role;
        }
        return user;
    }

    static async findByEmail(email) {
        let results = await super.find(email, 'users', 'email');
        let user = new User();
        if (results[0]) {
            user.id = results[0].id;
            user.login = results[0].login;
            user.password = results[0].password;
            user.full_name = results[0].full_name;
            user.email = results[0].email;
            user.email_code = results[0].email_code;
            user.reset_code = results[0].reset_code;
            user.profile_picture = results[0].profile_picture;
            user.rating = results[0].rating;
            user.role = results[0].role;
        }
        return user;
    }

    static async deleteById(id) {
        await Post.deleteByUserId(id);
        await Comment.deleteByUserId(id);
        await Like.deleteByUserId(id);
        await CommentAnswer.deleteByUserId(id);
        await super.delete(id, 'users');
    }

    static async save(user) {
        await super.save(user, 'users');
        return await this.findByLogin(user.login);
    }
    safe() {
        let user = {
            id: this.id,
            login: this.login,
            full_name: this.full_name,
            profile_picture: this.profile_picture,
            rating: this.rating,
            role: this.role
        };
        return user;
    }
}

module.exports = User;