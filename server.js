const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');
const db = require('./db/connection');
const { allowedNodeEnvironmentFlags } = require('process');

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
                'Update an employee role',
                'Quit'
            ]
        }
    ])
        .then((answer) => {
            switch (answer.Action) {
                case "View all departments":
                    viewDepartments();
                    break;
                case "View all roles":
                    viewRoles();
                    break;
                case "View all employees":
                    viewEmployees();
                    break;
                case "Add a department":
                    addDepartment();
                    break;
                case "Add a role":
                    addRole();
                    break;
                case "Add an employee": 
                    console.log("Add employee");
                    break;
                case "Update an empoyee role":
                    console.log("Update employee");
                    break;
                case "Quit":
                    quit();
                    break;
            }            
        })
}

function viewDepartments() {
    db.query(
        'SELECT * FROM departments',
        function (err, data) {
            if (err) throw err;
            console.table(data);
            start();
        }
    )
};

function viewRoles() {
    db.query(
        'SELECT * FROM roles',
        function (err, data) {
            if (err) throw err;
            console.table(data);
            start();
        }
    )
};

function viewEmployees() {
    db.query(
        'SELECT * FROM employees',
        function (err, data) {
            if (err) throw err;
            console.table(data);
            start();
        }
    )
};

function addDepartment() {
    inquirer.prompt([{
        type: 'input',
        name: 'departmentName',
        message: 'What is the Department name?',
        validate: (value) => {
            if (value) { 
                return true 
            } else {
                return "Department name is REQUIRED!!!";
            }
        }
    }]).then((data) => {
        db.query(
            'INSERT INTO department SET ?',
            { name: data.departmentName },
            function (err, results) {
                if (err) throw err;
                console.table(results);
                viewDepartments();
            }
        )
    })
};

start();