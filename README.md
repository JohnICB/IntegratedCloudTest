Create a nodejs server to create an API for a basic device management system.

# HOW TO USE

1.  download and install Node Js.
2.  download mysql.
3.  create a database and it's tables (shown below)
4.  open cmd and execute: cd app
5.  and then: node app.js

# MySQL

1.  open mysql console.
2.  create database devices;
3.  CREATE TABLE `switch` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(32) DEFAULT NULL,
    `location` varchar(64) DEFAULT NULL,
    `power` varchar(5) DEFAULT "off",
    `uid` int(11) NOT NULL,
    PRIMARY KEY (`id`)
    );
4.  CREATE TABLE `light` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(32) DEFAULT NULL,
    `location` varchar(64) DEFAULT NULL,
    `brightness` int(5) DEFAULT 0,
    `uid` int(11) NOT NULL,
    PRIMARY KEY (`id`)
    );
5.  CREATE TABLE `user` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(32) DEFAULT NULL,
    PRIMARY KEY (`id`)
    )
