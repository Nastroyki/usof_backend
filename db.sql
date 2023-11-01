CREATE DATABASE IF NOT EXISTS ucode_usof_backend;
DROP USER IF EXISTS 'mcherednyc'@'localhost';
CREATE USER 'mcherednyc'@'localhost' IDENTIFIED BY 'securepass';
GRANT ALL PRIVILEGES ON ucode_usof_backend.* TO 'mcherednyc'@'localhost';
USE ucode_usof_backend;

-- Create the user table
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    full_name VARCHAR(255),
    email VARCHAR(255),
    profile_picture VARCHAR(255),
    rating INT DEFAULT 0,
    role ENUM('admin', 'user') DEFAULT 'user'
);

-- Create the post table
CREATE TABLE post (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author INT,
    title VARCHAR(255),
    publish_date DATETIME,
    status ENUM('active', 'inactive'),
    content TEXT,
    FOREIGN KEY (author) REFERENCES user(id)
);

-- Create the category table
CREATE TABLE category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT
);

-- Create the comment table
CREATE TABLE comment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author INT,
    publish_date DATETIME,
    content TEXT,
    FOREIGN KEY (author) REFERENCES user(id)
);

-- Create the like table
CREATE TABLE likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author INT,
    publish_date DATETIME,
    entity_id INT,
    entity_type ENUM('post', 'comment'),
    type ENUM('like', 'dislike'),
    FOREIGN KEY (author) REFERENCES user(id),
    FOREIGN KEY (entity_id) REFERENCES post(id) ON DELETE CASCADE,
    FOREIGN KEY (entity_id) REFERENCES comment(id) ON DELETE CASCADE
);

-- Create the post_category table for many-to-many relationship between post and category
CREATE TABLE post_category (
    post_id INT,
    category_id INT,
    PRIMARY KEY (post_id, category_id),
    FOREIGN KEY (post_id) REFERENCES post(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
);