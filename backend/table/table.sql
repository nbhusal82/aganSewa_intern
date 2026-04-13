CREATE DATABASE IF NOT EXISTS agansewa;
USE agansewa;

-- 1. Province
CREATE TABLE province (
  province_id INT AUTO_INCREMENT PRIMARY KEY,
  province_name VARCHAR(100) UNIQUE
);

-- 2. District
CREATE TABLE district (
  district_id INT AUTO_INCREMENT PRIMARY KEY,
  district_name VARCHAR(100) UNIQUE,
  province_id INT NOT NULL,
  FOREIGN KEY (province_id) REFERENCES province(province_id) ON DELETE CASCADE
);

-- 3. Branch
CREATE TABLE branch (
  branch_id INT AUTO_INCREMENT PRIMARY KEY,
  branch_name VARCHAR(100) UNIQUE NOT NULL,
  district_id INT NOT NULL,
  remark VARCHAR(255),
  FOREIGN KEY (district_id) REFERENCES district(district_id) ON DELETE CASCADE
);

-- 4. Users (Admin / Manager)
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('manager','admin') DEFAULT 'manager',
  branch_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (branch_id) REFERENCES branch(branch_id) ON DELETE CASCADE
);

-- 5. Services
CREATE TABLE services (
  services_id INT AUTO_INCREMENT PRIMARY KEY,
  services_name VARCHAR(100) NOT NULL,
  description TEXT,
  image VARCHAR(255),
  branch_id INT NOT NULL,
  FOREIGN KEY (branch_id) REFERENCES branch(branch_id) ON DELETE CASCADE
);

-- 6. Staff
CREATE TABLE staff (
  staff_id INT AUTO_INCREMENT PRIMARY KEY,
  staff_name VARCHAR(100) NOT NULL,
  position VARCHAR(100) NOT NULL,
  photo VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('staff') DEFAULT 'staff',
  description TEXT,
  branch_id INT NOT NULL,
  services_id INT NOT NULL,
  FOREIGN KEY (branch_id) REFERENCES branch(branch_id) ON DELETE CASCADE,
  FOREIGN KEY (services_id) REFERENCES services(services_id) ON DELETE CASCADE
);

-- 7. Inquiry
CREATE TABLE inquiry (
  inquiry_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address VARCHAR(255) NOT NULL,
  email VARCHAR(150),
  description TEXT NOT NULL,
  branch_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (branch_id) REFERENCES branch(branch_id) ON DELETE CASCADE
);

-- 8. Review
CREATE TABLE review (
  review_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  position VARCHAR(255),
  description TEXT
);

-- 9. Gallery (FIXED - missing PK)
CREATE TABLE gallery (
  gallery_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  image VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  branch_id INT NOT NULL,
  FOREIGN KEY (branch_id) REFERENCES branch(branch_id) ON DELETE CASCADE
);