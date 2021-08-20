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
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role'
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
                    addEmployee();
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
    console.log("ada fucing dept");
    inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'What is the department name?',
            validate: (value) => {
                if (!value) { return "Department name is required!" }
                return true;
            }   
        }
    ])
        .then((data) => {
            db.query(
                'INSERT INTO departments SET ?',
                { name: data.departmentName },
                function (err, results) {
                    if (err) throw err;
                    console.table(results);
                    viewDepartments();
                }
            )
        })
}

const updatedRoles = [];
const updatedManagers = [];

function selectRole() {
    db.query(
        'SELECT * FROM roles',
        function (err, results) {
            if (err) throw err;
            for (let i = 0; i < results.length; i++) {
                updatedRoles.push(results[i].title);
            }
        }
    );
    return updatedRoles;
};

function selectManager() {
    db.query(
        'SELECT * FROM managers',
        function (err, results) {
            if (err) throw err;
            for (let i = 0; i < results.length; i++) {
                updatedManagers.push(results[i].first_name + ' ' + results[i].last_name);
            }
        }
    )
    return updatedManagers;
};

function addEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'Please enter employees first name.',
            validate: (value) => {
                if (!value) {
                    return "First name is required";
                } else {
                    return true;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Please enter employees last name.',
            validate: (value) => {
                if (!value) {
                    return "Last name is required";
                } else {
                    return true;
                }
            }
        },
        {
            type: 'list',
            name: 'managerName',
            message: 'Please choose their manager from the following list.',
            choices: selectManager()
        },
        {
            type: 'list',
            name: 'employeeRole',
            message: 'Please select employees role.',
            choices: selectRole()
        }
    ])
        .then((results) => {
            var addEmployeeRole = selectRole().indexOf(results.employeeRole) + 1;
            var addEmployeeManager = selectManager().indexOf(results.managerName) + 1;

            db.query(
                'INSERT INTO employees SET ?',
                {
                    first_name: results.firstName,
                    last_name: results.lastName,
                    role_id: addEmployeeRole,
                    manager_id: addEmployeeManager
                },
                function (err, results) {
                    if (err) throw err;
                    console.table(results);
                    viewEmployees();
                }
            )
        })
}

start();