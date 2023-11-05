const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD
});

class Model {
    static async find(value, table, field = 'id'){
        const selectQ = `SELECT * FROM ${table} WHERE ${field}=?`;
        return new Promise((resolve, reject) => {
            db.query(selectQ, [value], (err, results) => {
                if(err){
                    reject(err);
                }
                resolve(results);
            });
        });
    }
    static async findAll(table){
        const selectQ = `SELECT * FROM ${table}`;
        return new Promise((resolve, reject) => {
            db.query(selectQ, (err, results) => {
                if(err){
                    reject(err);
                }
                resolve(results);
            });
        });
    }
    static async delete(value, table, field = 'id') {
        const selectQ = `SELECT * FROM ${table} WHERE ${field}=?`;
        return new Promise((resolve, reject) => {
            db.query(selectQ, [value], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    if (results.length != 0) {
                        const deleteQ = `DELETE FROM ${table} WHERE ${field}=?`;
                        db.query(deleteQ, [value], (err) => {
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
    static async save(data, table) {
        const id = data.id;
        if (id && id >= 0) {
            const updateQ = `UPDATE ${table} SET ? WHERE id = ?`;
            db.query(updateQ, [data, id], (err, result) => {
                if (err) {
                    throw err;
                }
            });
        } else {
            const insertQ = `INSERT INTO ${table} SET ?`;
            db.query(insertQ, [data], (err, result) => {
                if (err) {
                    throw err;
                }
            });
        }
    }
}
module.exports = { Model, db };
