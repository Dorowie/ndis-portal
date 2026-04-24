-- DATABASE CREATION --
CREATE DATABASE ndis_portal_db
ON PRIMARY (
    NAME = N'ndis_portal_db',
    FILENAME = N'C:\SQLData_NDIS\ndis_portal_db.mdf',
    SIZE = 100MB,
    MAXSIZE = UNLIMITED,
    FILEGROWTH = 64MB
)
LOG ON (
    NAME = N'ndis_portal_db_log',
    FILENAME = N'C:\SQLData_NDIS\ndis_portal_db.ldf',
    SIZE = 32MB,
    FILEGROWTH = 64MB
);
GO

-- END OF DATABASE CREATION --

-- USE THE CREATED DATABASE (ndis_portal_db) -- 
use ndis_portal_db;


-- TABLE CREATION --

-- users table

CREATE TABLE users (
    id INT PRIMARY KEY IDENTITY(1,1),
    first_name NVARCHAR(50) NOT NULL,
    last_name NVARCHAR(50) NOT NULL,
    email NVARCHAR(150) NOT NULL UNIQUE,
    password_hash NVARCHAR(255) NOT NULL,
    role NVARCHAR(20) NOT NULL,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    modified_date DATETIME NOT NULL DEFAULT GETDATE(),

    CONSTRAINT CK_users_role
        CHECK (role IN ('Participant', 'Coordinator'))
);
GO


-- service_categories table

CREATE TABLE service_categories (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(50) NOT NULL UNIQUE,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    modified_date DATETIME NOT NULL DEFAULT GETDATE()
);
GO


-- services table

CREATE TABLE services (
    id INT PRIMARY KEY IDENTITY(1,1),
    category_id INT NOT NULL,
    name NVARCHAR(50) NOT NULL,
    description NVARCHAR(200) NOT NULL,
    is_active BIT NOT NULL DEFAULT 1, -- 1 = active | 0 = inactive
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    modified_date DATETIME NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_services_service_categories
        FOREIGN KEY (category_id) REFERENCES service_categories(id)
);
GO



-- support_workers table

CREATE TABLE support_workers (
    id INT PRIMARY KEY IDENTITY(1,1),
    service_id INT NOT NULL,
    first_name NVARCHAR(50) NOT NULL,
    last_name NVARCHAR(50) NOT NULL,
    email NVARCHAR(150) NOT NULL UNIQUE,
    phone NVARCHAR(20) NULL,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    modified_date DATETIME NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_support_workers_services
        FOREIGN KEY (service_id) REFERENCES services(id)
);
GO


-- bookings table

CREATE TABLE bookings (
    id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    service_id INT NOT NULL,
    booking_date DATETIME NOT NULL,
    notes NVARCHAR(500) NULL,
    status TINYINT NOT NULL DEFAULT 0, -- 0 = Pending | 1 = Approved | 2 = Cancelled
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    modified_date DATETIME NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_bookings_users
        FOREIGN KEY (user_id) REFERENCES users(id),

    CONSTRAINT FK_bookings_services
        FOREIGN KEY (service_id) REFERENCES services(id),

    CONSTRAINT CK_bookings_status
        CHECK (status IN (0, 1, 2))
);
GO
-- END OF TABLES CREATION --

-- SEEDING DATABASE --

-- service_categories seed
INSERT INTO service_categories (name)
VALUES 
('Daily Personal Activities'),
('Community Access'),
('Therapy Supports'),
('Respite Care'),
('Support Coordination');
GO

-- services seed 
INSERT INTO services (category_id, name, description)
VALUES
(1, 'Personal Hygiene Assistance', 'Support with personal hygiene tasks'),
(1, 'Meal Preparation Support', 'Assistance in preparing daily meals'),
(2, 'Community Participation Program', 'Programs for community involvement'),
(2, 'Social Skills Group', 'Group sessions for social skill development'),
(3, 'Occupational Therapy', 'Therapy for daily living and work skills'),
(3, 'Speech Therapy', 'Speech and communication therapy'),
(4, 'Short Term Respite Accommodation', 'Temporary accommodation support'),
(5, 'Plan Management & Coordination', 'Managing and coordinating support plans');
GO


-- users seed
INSERT INTO users (first_name, last_name, email, password_hash, role)
VALUES
('System', 'Coordinator', 'coordinator@ndisportal.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9n5q4k6l5Y4c1dH9h6tW6a', 'Coordinator'),

('Participant', 'One', 'participant1@ndisportal.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9n5q4k6l5Y4c1dH9h6tW6a', 'Participant'),

('Participant', 'Two', 'participant2@ndisportal.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9n5q4k6l5Y4c1dH9h6tW6a', 'Participant');
GO


-- booking seed
INSERT INTO bookings (user_id, service_id, booking_date, notes, status)
VALUES
(2, 1, GETDATE(), 'Personal Hygiene Assistance Booking', 0),
(2, 2, GETDATE(), 'Meal Preparation Support Booking', 1),
(3, 3, GETDATE(), 'Community Participation Program Booking', 0),
(3, 4, GETDATE(), 'Social Skills Group Booking', 2);
GO

-- END OF DATABASE SEEDING -- 