CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('manager','admin') DEFAULT 'manager',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  branch_id INT NOT NULL,
  FOREIGN KEY (branch_id) REFERENCES branch(branch_id)
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
CREATE TABLE inquiry (
    inquiry_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    email VARCHAR(150) NULL,
    description TEXT NOT NULL,
    branch_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (branch_id)
        REFERENCES branch(branch_id)

) 
 CREATE TABLE review(
  review_id int AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255)null,
  position VARCHAR(255) null,
  description VARCHAR (255) null
 )
  create table staff(
    staff_id int AUTO_INCREMENT PRIMARY Key,
    staff_name VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    photo VARCHAR(255) NULL,
    email VARCHAR(255) NOT null,
    password VARCHAR (255) NOT Null,
    role ENUM('staff') DEFAULT 'staff',
    description TEXT NULL,
     branch_id INT NOT NULL,
    FOREIGN KEY (branch_id) REFERENCES branch(branch_id),  
    services_id INT NOT NULL,
    FOREIGN KEY (services_id) REFERENCES services(services_id)
  )


  create table gallery(
    title VARCHAR(100) NOT NULL,
    image VARCHAR(255) NOT NULL,  
    branch_id INT NOT NULL,
    FOREIGN KEY (branch_id) REFERENCES branch(branch_id),
    location VARCHAR(255) NOT NULL
  )