# MySQL Migration Guide & Setup

This project has been migrated from PostgreSQL to **MySQL** (using XAMPP/Localhost).
Below are the steps to set up the local development environment.

## 1. Prerequisites
- **XAMPP** installed (PHP 8.x, MariaDB/MySQL).
- **Node.js** installed.

## 2. Database Setup
1. Open **XAMPP Control Panel**.
2. Start **Apache** and **MySQL** modules.
3. Click **Admin** next to MySQL to open phpMyAdmin.
4. Create a new database named: `apartment_db`.

## 3. Environment Configuration
Update your `.env` file to use the MySQL connection string:
```env
# Connect to Local XAMPP MySQL
DATABASE_URL="mysql://root:@localhost:3306/apartment_db"