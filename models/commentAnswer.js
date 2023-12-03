const Model = require("./model").Model;

// CREATE TABLE comment_answer (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     user_id INT,
//     comment_id INT,
//     publish_date DATETIME,
//     content TEXT,
//     FOREIGN KEY (user_id) REFERENCES users(id),
//     FOREIGN KEY (comment_id) REFERENCES comments(id)
// );

class CommentAnswer extends Model {
    constructor(user_id = 0, comment_id = 0, publish_date = new Date(), content = '') {
        super();
        this.id = 0;
        this.user_id = user_id;
        this.comment_id = comment_id;
        this.publish_date = publish_date;
        this.content = content;
    }

    static async findById(id) {
        let results = await super.find(id, 'comment_answer');
        let commentAnswer = new CommentAnswer();
        if (results[0]) {
            commentAnswer.id = results[0].id;
            commentAnswer.user_id = results[0].user_id;
            commentAnswer.comment_id = results[0].comment_id;
            commentAnswer.publish_date = results[0].publish_date;
            commentAnswer.content = results[0].content;
        }
        return commentAnswer;
    }

    static async findByCommentId(comment_id) {
        let results = await super.find(comment_id, 'comment_answer', 'comment_id')
        let commentAnswers = [];
        for (let i = 0; i < results.length; i++) {
            let commentAnswer = new CommentAnswer();
            commentAnswer.id = results[i].id;
            commentAnswer.user_id = results[i].user_id;
            commentAnswer.comment_id = results[i].comment_id;
            commentAnswer.publish_date = results[i].publish_date;
            commentAnswer.content = results[i].content;
            commentAnswers.push(commentAnswer);
        }
        return commentAnswers;
    }

    static async findByUserId(user_id) {
        let results = await super.find(user_id, 'comment_answer', 'user_id')
        let commentAnswers = [];
        for (let i = 0; i < results.length; i++) {
            let commentAnswer = new CommentAnswer();
            commentAnswer.id = results[i].id;
            commentAnswer.user_id = results[i].user_id;
            commentAnswer.comment_id = results[i].comment_id;
            commentAnswer.publish_date = results[i].publish_date;
            commentAnswer.content = results[i].content;
            commentAnswers.push(commentAnswer);
        }
        return commentAnswers;
    }

    static async deleteById(id) {
        await super.delete(id, 'comment_answer');
    }

    static async deleteByCommentId(comment_id) {
        let commentAnswers = await this.findByCommentId(comment_id);
        for (let i = 0; i < commentAnswers.length; i++) {
            await this.deleteById(commentAnswers[i].id);
        }
    }

    static async deleteByUserId(user_id) {
        let commentAnswers = await this.findByUserId(user_id);
        for (let i = 0; i < commentAnswers.length; i++) {
            await this.deleteById(commentAnswers[i].id);
        }
    }

    static async save(commentAnswer) {
        let id = await super.save(commentAnswer, 'comment_answer');
        return await this.findById(id);
    }
}

module.exports = CommentAnswer;