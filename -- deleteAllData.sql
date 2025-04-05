-- SQLite
DELETE FROM users;

DELETE FROM users WHERE id = 4;

DELETE FROM loans;

UPDATE loans SET status = 'PENDING' WHERE id = 1; 

INSERT INTO users (id, email, name, password, phone, role)
VALUES 
(0, 'admin.123@gmail.com', 'Admin', 'Admin@123', 8838615817, 'ADMIN'),
(1, 'manager.123@gmail.com', 'Manager', 'Manager@123', 1234567890, 'MANAGER'),
(2, 'user.123@gmail.com', 'User', 'User@123', 1234567890, 'USER');

-- Insert a dummy loan for a user with ID 1, with status 'PENDING'
INSERT INTO loans (user_id, loanAmount, pendingAmount, purpose, loanVarient, interestRatePerAnnum, tenure, emiAmount, dueDate, status, createdAt, updatedAt, approverName)
VALUES (1, 10000.00, 10000.00, 'Home Improvement', 'Variant A', 5.5, '36 months', 300.00, '2025-12-31 00:00:00.000', 'PENDING', '2023-02-27 00:00:00.000', '2023-02-27 00:00:00.000', NULL);

-- Insert a dummy loan for a user with ID 2, with status 'APPROVED'
INSERT INTO loans (user_id, loanAmount, pendingAmount, purpose, loanVarient, interestRatePerAnnum, tenure, emiAmount, dueDate, status, createdAt, updatedAt, approverName)
VALUES (3, 20000.00, 5000.00, 'Car Purchase', 'Variant B', 4.8, '24 months', 850.00, '2024-06-30 00:00:00.000', 'APPROVED', '2023-02-20 00:00:00.000', '2023-03-15 00:00:00.000', 'Manager One');

-- Insert a dummy loan for a user with ID 1, with status 'REJECTED'
INSERT INTO loans (user_id, loan_amount, pending_amount, purpose, loan_varient, interest_rate_per_annum, tenure, emi_amount, due_date, status, created_at, updated_at, approver_name)
VALUES (3, 5000.00, 0.00, 'Debt Consolidation', 'Variant C', 6.0, '12 months', 450.00, '2023-09-01 00:00:00.000', 'REJECTED', '2023-01-15 00:00:00.000', '2023-01-16 00:00:00.000', 'Manager Two');

UPDATE loans SET user_id = 3 WHERE id = 1;

UPDATE loans SET manager_id = null and approver_name WHERE id = 2;

INSERT INTO loans (user_id, loan_amount, pending_amount, purpose, loan_varient, interest_rate_per_annum, tenure, emi_amount, due_date, status, created_at, updated_at, approver_name)
VALUES (3, 5000.00, 0.00, 'Debt Consolidation', 'Variant C', 6.0, '12 months', 450.00, '2023-09-01 00:00:00.000', 'APPROVED', '2023-01-15 00:00:00.000', '2023-01-16 00:00:00.000', 'Manager Two');

DROP TABLE loans;