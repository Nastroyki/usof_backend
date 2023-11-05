const Model = require('./model').Model;

// CREATE TABLE users (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     login VARCHAR(255) UNIQUE NOT NULL,
//     password VARCHAR(255) NOT NULL,
//     full_name VARCHAR(255),
//     email VARCHAR(255),
//     profile_picture VARCHAR(255),
//     rating INT DEFAULT 0,
//     role ENUM('admin', 'user') DEFAULT 'user'
// );

class User extends Model {
    constructor(login = '', password = '', full_name = '', email = '', profile_picture = '', rating = 0, role = 'user') {
        super();
        this.id = 0;
        this.login = login;
        this.password = password;
        this.full_name = full_name;
        this.email = email;
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
            user.profile_picture = results[0].profile_picture;
            user.rating = results[0].rating;
            user.role = results[0].role;
        }
        return user;
    }

    static async deleteById(id) {
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
            email: this.email,
            profile_picture: this.profile_picture,
            rating: this.rating,
            role: this.role
        };
        return user;
    }
}

module.exports = User;