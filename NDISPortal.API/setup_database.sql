-- =====================================================
-- NDIS Portal Database Setup Script
-- Run this script to create or fix the database
-- =====================================================

-- 1. Create Database if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'ndis_portal_db')
BEGIN
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
    PRINT 'Database created successfully.'
END
ELSE
BEGIN
    PRINT 'Database already exists.'
END
GO

-- Use the database
USE ndis_portal_db;
GO

-- =====================================================
-- TABLE CREATION / UPDATES
-- =====================================================

-- 2. Create/Update users table
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'users')
BEGIN
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
    PRINT 'users table created.'
END
ELSE
BEGIN
    PRINT 'users table already exists.'
END
GO

-- 3. Create/Update service_categories table
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'service_categories')
BEGIN
    CREATE TABLE service_categories (
        id INT PRIMARY KEY IDENTITY(1,1),
        name NVARCHAR(50) NOT NULL UNIQUE,
        created_date DATETIME NOT NULL DEFAULT GETDATE(),
        modified_date DATETIME NOT NULL DEFAULT GETDATE()
    );
    PRINT 'service_categories table created.'
END
ELSE
BEGIN
    PRINT 'service_categories table already exists.'
END
GO

-- 4. Create/Update services table
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'services')
BEGIN
    CREATE TABLE services (
        id INT PRIMARY KEY IDENTITY(1,1),
        category_id INT NOT NULL,
        name NVARCHAR(50) NOT NULL,
        description NVARCHAR(200) NOT NULL,
        is_active BIT NOT NULL DEFAULT 1, -- BIT = boolean (true/false)
        created_date DATETIME NOT NULL DEFAULT GETDATE(),
        modified_date DATETIME NOT NULL DEFAULT GETDATE(),

        CONSTRAINT FK_services_service_categories
            FOREIGN KEY (category_id) REFERENCES service_categories(id)
    );
    PRINT 'services table created.'
END
ELSE
BEGIN
    -- Check if is_active column exists and is BIT type
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'services' AND COLUMN_NAME = 'is_active')
    BEGIN
        ALTER TABLE services ADD is_active BIT NOT NULL DEFAULT 1;
        PRINT 'Added is_active column to services table.'
    END
    ELSE
    BEGIN
        PRINT 'is_active column already exists in services table.'
    END
END
GO

-- 5. Create/Update support_workers table
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'support_workers')
BEGIN
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
    PRINT 'support_workers table created.'
END
ELSE
BEGIN
    PRINT 'support_workers table already exists.'
END
GO

-- 6. Create/Update bookings table
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'bookings')
BEGIN
    CREATE TABLE bookings (
        id INT PRIMARY KEY IDENTITY(1,1),
        user_id INT NOT NULL,
        service_id INT NOT NULL,
        booking_date DATETIME NOT NULL,
        notes NVARCHAR(500) NULL,
        status TINYINT NOT NULL DEFAULT 0, -- TINYINT = byte (0=Pending, 1=Approved, 2=Cancelled)
        created_date DATETIME NOT NULL DEFAULT GETDATE(),
        modified_date DATETIME NOT NULL DEFAULT GETDATE(),

        CONSTRAINT FK_bookings_users
            FOREIGN KEY (user_id) REFERENCES users(id),

        CONSTRAINT FK_bookings_services
            FOREIGN KEY (service_id) REFERENCES services(id),

        CONSTRAINT CK_bookings_status
            CHECK (status IN (0, 1, 2))
    );
    PRINT 'bookings table created.'
END
ELSE
BEGIN
    -- Check if status column exists and is TINYINT type
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'bookings' AND COLUMN_NAME = 'status')
    BEGIN
        ALTER TABLE bookings ADD status TINYINT NOT NULL DEFAULT 0;
        PRINT 'Added status column to bookings table.'
    END
    ELSE
    BEGIN
        PRINT 'status column already exists in bookings table.'
    END
END
GO

-- =====================================================
-- SEED DATA (only if tables are empty)
-- =====================================================

-- 7. Seed service_categories (if empty)
IF NOT EXISTS (SELECT * FROM service_categories)
BEGIN
    INSERT INTO service_categories (name)
    VALUES 
    ('Daily Personal Activities'),
    ('Community Access'),
    ('Therapy Supports'),
    ('Respite Care'),
    ('Support Coordination');
    PRINT 'Seeded service_categories.'
END
ELSE
BEGIN
    PRINT 'service_categories already has data.'
END
GO

-- 8. Seed services (if empty)
IF NOT EXISTS (SELECT * FROM services)
BEGIN
    INSERT INTO services (category_id, name, description, is_active)
    VALUES
    (1, 'Personal Hygiene Assistance', 'Support with personal hygiene tasks', 1),
    (1, 'Meal Preparation Support', 'Assistance in preparing daily meals', 1),
    (2, 'Community Participation Program', 'Programs for community involvement', 1),
    (2, 'Social Skills Group', 'Group sessions for social skill development', 1),
    (3, 'Occupational Therapy', 'Therapy for daily living and work skills', 1),
    (3, 'Speech Therapy', 'Speech and communication therapy', 1),
    (4, 'Short Term Respite Accommodation', 'Temporary accommodation support', 1),
    (5, 'Plan Management & Coordination', 'Managing and coordinating support plans', 1);
    PRINT 'Seeded services.'
END
ELSE
BEGIN
    PRINT 'services already has data.'
END
GO

-- 9. Seed users (if empty)
IF NOT EXISTS (SELECT * FROM users)
BEGIN
    INSERT INTO users (first_name, last_name, email, password_hash, role)
    VALUES
    ('System', 'Coordinator', 'coordinator@ndisportal.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9n5q4k6l5Y4c1dH9h6tW6a', 'Coordinator'),
    ('Participant', 'One', 'participant1@ndisportal.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9n5q4k6l5Y4c1dH9h6tW6a', 'Participant'),
    ('Participant', 'Two', 'participant2@ndisportal.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9n5q4k6l5Y4c1dH9h6tW6a', 'Participant');
    PRINT 'Seeded users.'
END
ELSE
BEGIN
    PRINT 'users already has data.'
END
GO

-- 10. Seed bookings (if empty)
IF NOT EXISTS (SELECT * FROM bookings)
BEGIN
    INSERT INTO bookings (user_id, service_id, booking_date, notes, status)
    VALUES
    (2, 1, GETDATE(), 'Personal Hygiene Assistance Booking', 0),
    (2, 2, GETDATE(), 'Meal Preparation Support Booking', 1),
    (3, 3, GETDATE(), 'Community Participation Program Booking', 0),
    (3, 4, GETDATE(), 'Social Skills Group Booking', 2);
    PRINT 'Seeded bookings.'
END
ELSE
BEGIN
    PRINT 'bookings already has data.'
END
GO

-- =====================================================
-- VERIFICATION
-- =====================================================

PRINT '====================================================='
PRINT 'Database setup completed successfully!'
PRINT '====================================================='
PRINT 'Table structures:'

SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME IN ('users', 'service_categories', 'services', 'support_workers', 'bookings')
ORDER BY TABLE_NAME, ORDINAL_POSITION
GO

PRINT '====================================================='
PRINT 'Data counts:'

SELECT 'users' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'service_categories', COUNT(*) FROM service_categories
UNION ALL
SELECT 'services', COUNT(*) FROM services
UNION ALL
SELECT 'support_workers', COUNT(*) FROM support_workers
UNION ALL
SELECT 'bookings', COUNT(*) FROM bookings
GO

PRINT '====================================================='
PRINT 'Setup script completed!'
PRINT '====================================================='
