const Model = require('./model').Model;

// CREATE TABLE tags (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     title VARCHAR(255) NOT NULL,
//     description TEXT
// );

class Tag extends Model {
    constructor(title = '', description = '') {
        super();
        this.id = 0;
        this.title = title;
        this.description = description;
    }

    static async findAll() {
        let results = await super.findAll('tags');
        let tags = [];
        for (let i = 0; i < results.length; i++) {
            let tag = new Tag();
            tag.id = results[i].id;
            tag.title = results[i].title;
            tag.description = results[i].description;
            tags.push(tag);
        }
        return tags;
    }

    static async findAllByTitleBegin(title) {
        let results = await super.findByBegin(title, 'tags', 'title');
        let tags = [];
        for (let i = 0; i < results.length; i++) {
            let tag = new Tag();
            tag.id = results[i].id;
            tag.title = results[i].title;
            tag.description = results[i].description;
            tags.push(tag);
        }
        return tags;
    }

    static async findById(id) {
        let results = await super.find(id, 'tags');
        let tag = new Tag();
        if (results[0]) {
            tag.id = results[0].id;
            tag.title = results[0].title;
            tag.description = results[0].description;
        }
        return tag;
    }

    static async findByTitle(title) {
        let results = await super.find(title, 'tags', 'title');
        let tag = new Tag();
        if (results[0]) {
            tag.id = results[0].id;
            tag.title = results[0].title;
            tag.description = results[0].description;
        }
        return tag;
    }

    static async deleteById(id) {
        await super.delete(id, 'tags');
    }

    static async save(tag) {
        let tagcheck = await this.findByTitle(tag.title);
        if (tagcheck.id != 0) {
            return tagcheck;
        }
        let id = await super.save(tag, 'tags');
        return await this.findById(id);
    }
}

module.exports = Tag;