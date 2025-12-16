CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('staff','manager','admin') DEFAULT 'staff',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
create table services (
  services_id INT AUTO_INCREMENT PRIMARY KEY,
  services_name VARCHAR(100) NOT NULL,
  description TEXT,
  image  VARCHAR(255) Null,
  branch_id int NOT Null, 
   FOREIGN KEY (branch_id) REFERENCES branch(branch_id)

); 
create table province(
  province_id INT AUTO_INCREMENT PRIMARY KEY,
  province_name VARCHAR(100) UNIQUE,
)
create table district(  
  district_id INT AUTO_INCREMENT PRIMARY KEY,
  district_name VARCHAR(100) UNIQUE,
  province_id INT NOT NULL,
  FOREIGN KEY (province_id) REFERENCES province(province_id)
)
create table branch(
  branch_id INT AUTO_INCREMENT PRIMARY Key,
  branch_name VARCHAR(100) UNIQUE NOT Null,
  district_id INT NOT NULL,
    FOREIGN KEY (district_id) REFERENCES district(district_id),
    Remark VARCHAR(255) Null

)