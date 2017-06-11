require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'Bamazon'
});

let start = () => {
    let productsObj = {};

    let query = (options) => {
        let queryPromise = new Promise((resolve, reject) => {
            connection.query({
                sql: options.statement
            }, (error, results) => {
                if (error) throw error;
                resolve(options.callback(results));
            });
        });
        return queryPromise;
    };

    
};