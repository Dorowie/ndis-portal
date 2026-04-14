-- 10 VERIFICATION QUERIES --

-- 1. List all services with their category name
SELECT 
    s.id,
    s.name AS service_name,
    sc.name AS category_name
FROM services s
INNER JOIN service_categories sc
    ON s.category_id = sc.id;
GO

-- 2. List all bookings with participant full name and service name
SELECT
    b.id AS booking_id,
    u.first_name + ' ' + u.last_name AS participant_name,
    s.name AS service_name,
    b.booking_date,
    CASE
        WHEN b.status = 0 THEN 'Pending'
        WHEN b.status = 1 THEN 'Approved'
        WHEN b.status = 2 THEN 'Canceled'
    END AS status
FROM bookings b
INNER JOIN users u
    ON b.user_id = u.id
INNER JOIN services s
    ON b.service_id = s.id;
GO

-- 3. Count of bookings grouped by status
SELECT
    CASE
        WHEN status = 0 THEN 'Pending'
        WHEN status = 1 THEN 'Approved'
        WHEN status = 2 THEN 'Canceled'
    END AS status,
    COUNT(*) AS booking_count
FROM bookings
GROUP BY status;
GO

-- 4. List all Pending bookings ordered by preferred date ascending
SELECT
    b.id AS booking_id,
    u.first_name + ' ' + u.last_name AS participant_name,
    s.name AS service_name,
    b.booking_date,
    b.notes
FROM bookings b
INNER JOIN users u
    ON b.user_id = u.id
INNER JOIN services s
    ON b.service_id = s.id
WHERE b.status = 0
ORDER BY b.booking_date ASC;
GO

-- 5. List services that have never been booked
SELECT
    s.id,
    s.name AS service_name,
    s.description
FROM services s
LEFT JOIN bookings b
    ON s.id = b.service_id
WHERE b.id IS NULL;
GO

-- 6. Count of bookings per participant (show participant name and count)
SELECT
    u.id,
    u.first_name + ' ' + u.last_name AS participant_name,
    COUNT(b.id) AS booking_count
FROM users u
LEFT JOIN bookings b
    ON u.id = b.user_id
WHERE u.role = 'Participant'
GROUP BY u.id, u.first_name, u.last_name;
GO

-- 7. List all active services in the Therapy Supports category
SELECT
    s.id,
    s.name AS service_name,
    s.description,
    sc.name AS category_name
FROM services s
INNER JOIN service_categories sc
    ON s.category_id = sc.id
WHERE s.is_active = 1
  AND sc.name = 'Therapy Supports';
GO

-- 8. List bookings where preferred date is in the next 30 days
SELECT
    b.id AS booking_id,
    u.first_name + ' ' + u.last_name AS participant_name,
    s.name AS service_name,
    b.booking_date,
    b.status
FROM bookings b
INNER JOIN users u
    ON b.user_id = u.id
INNER JOIN services s
    ON b.service_id = s.id
WHERE b.booking_date >= CAST(GETDATE() AS DATE)
  AND b.booking_date < DATEADD(DAY, 30, CAST(GETDATE() AS DATE));
GO

-- 9. List all coordinators in the Users table
SELECT
    id,
    first_name,
    last_name,
    email,
    role
FROM users
WHERE role = 'Coordinator';
GO

-- 10. List participants who have at least one Approved booking
SELECT DISTINCT
    u.id,
    u.first_name,
    u.last_name,
    u.email
FROM users u
INNER JOIN bookings b
    ON u.id = b.user_id
WHERE u.role = 'Participant'
  AND b.status = 1;
GO
