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
                // 'View Employees by department',
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

                // case "View Employees by department":
                //     employeesByDept();
                //     break;

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
// const updatedDepartments = [];

// selectRole and selectManager functions loop through queried data and pushed it to choices for other functions
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


// Loop is not working properly
// function selectDepartment() {
//     db.query(
//         'SELECT * FROM departments',
//         function (err, data) {
//             if (err) throw err;
//             for ( let i = 0; i < data.length; i++ ) {
//                 updatedDepartments.push(data[i].name);
//             }
//         }
//     );
//     return updatedDepartments;
// };

// function employeesByDept() {
//     inquirer.prompt([
//         {
//             type: 'list',
//             name: 'departmentName',
//             message: 'Please choose from the following list of departments.',
//             choices: selectDepartment()
//         }
//     ]).then((data) => console.log(data))
// }

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
};

function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'roleName',
            message: 'Please enter new role title.',
            validate: (value) => {
                if (!value) return "Role title is required!!!";
                return true;
            }
        },
        {
            type: 'input',
            name: 'salaryAmount',
            message: 'Please enter the salary for this position.',
            validate: (value) => {
                if (!value) return "There needs to be a salary amount!!!";
                return true;
            }
        },
        {
            type: 'input',
            name: 'departmentId',
            message: 'Please enter the department id.',
            validate: (value) => {
                if (!value) return "Department id is required!!!";
                return true;
            }
        }
    ])
        .then((roleData) => {
            db.query(
                'INSERT INTO roles SET ?',
                {
                    title: roleData.roleName,
                    salary: roleData.salaryAmount,
                    department_id: roleData.departmentId
                },
                function (err, results) {
                    if (err) throw err;
                    console.table(results);
                    viewRoles();
                }
            )
        });
};

start();