-- SQLite
DELETE FROM users;

DELETE FROM loans;

INSERT INTO users (id, email, name, password, phone, role)
VALUES 
(0, 'admin.123@gmail.com', 'Admin', 'Admin@123', 8838615817, 'ADMIN'),
(1, 'manager.123@gmail.com', 'Manager', 'Manager@123', 1234567890, 'MANAGER'),
(2, 'user.123@gmail.com', 'User', 'User@123', 1234567890, 'USER');