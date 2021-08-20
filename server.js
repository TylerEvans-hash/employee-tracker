const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');
const db = require('./db/connection');

db.connect(error => {
    if (error) throw error;
});

const start = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'Action',
            message: 'Choose one of the following options.',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role'
            ]
        }
    ])
        .then((answer) => {
            switch (answer.Action) {
                case "View all departments":
                    console.log("All deparments");
                    break;
                case "View all roles":
                    console.log("All roles");
                    break;
                case "View all employees":
                    console.log("All employees");
                    break;
                case "Add a department":
                    console.log("Add a department");
                    break;
                case "Add a role":
                    console.log("Add a role");
                    break;
                case "Add an employee": 
                    console.log("Add employee");
                    break;
                case "Update an empoyee role":
                    console.log("Update employee");
                    break;
            }            
        })
}

start();