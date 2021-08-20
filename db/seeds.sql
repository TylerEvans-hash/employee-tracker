INSERT INTO departments (name)
VALUES ('Sales'), ('Engineering'), ('Legal'), ('Finance');

INSERT INTO roles(department_id, title, salary)
VALUES 
    ('1', 'Sales Lead', 80000),
    ('1', 'Salesperson', 40000),
    ('2', 'Software Engineer', 100000),
    ('2', 'IT Engineer', 75000),
    ('3', 'Paralegal', 80000),
    ('3', 'Company Lawyer', 120000),
    ('4', 'Global Controller', 90000),
    ('4', 'Accountant', 60000);

INSERT INTO managers(first_name, last_name, department_id)
VALUES
    ('Dan', 'Fillet', 1),
    ('Bob', 'Thornton', 2),
    ('Jim', 'Beau', 3),
    ('Renae', 'Johnson', 4);

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES
    ('Daniel', 'Espinoza', 1, 1),
    ('Johnathan', 'Kreuger', 2, 1),
    ('Tim', 'Lewis', 3, 2),
    ('Tyler', 'Evans', 4, 2),
    ('Brad', 'Smith', 5, 3),
    ('Sarah', 'Jackson', 6, 3),
    ('Samantha', 'Birch', 7, 4),
    ('Steve', 'Smith', 8, 4);