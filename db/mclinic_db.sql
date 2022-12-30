/*
Navicat MySQL Data Transfer

Source Server         : connection1
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : mclinic_db

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2022-12-01 11:48:26
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `appointments`
-- ----------------------------
DROP TABLE IF EXISTS `appointments`;
CREATE TABLE `appointments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `branch_id` int(11) NOT NULL,
  `channel_id` int(11) NOT NULL,
  `arrival_date` date NOT NULL,
  `arrival_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `notes` varchar(350) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `client_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `client_phone_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `client_email` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sex` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `consultant_id` int(11) NOT NULL,
  `lead_id` int(10) DEFAULT NULL,
  `lead_class_id` tinyint(10) DEFAULT NULL COMMENT 'example: 1=Cold, 2=Warm, 3=Hot',
  `client_id` int(11) DEFAULT NULL COMMENT 'client_id is the either patient_id or lead_id',
  `create_user` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_uid` int(11) NOT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL,
  `update_user` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `update_uid` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `client_sex` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status_id` tinyint(6) DEFAULT 1 COMMENT '0=Canceled, 1= Pending, 2=Served',
  `client_code` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of appointments
-- ----------------------------
INSERT INTO `appointments` VALUES ('48', '1', '2', '2022-12-02', '2022-12-02 10:30:00', null, 'Ms Darany', '012555653', 'daraagmailcom', null, '0', '13', null, '0', 'Samsethy', '1', '2022-12-01 09:17:15.000000', null, null, null, 'F', '1', '');
INSERT INTO `appointments` VALUES ('49', '1', '2', '2022-12-08', '2022-12-01 10:19:48', null, 'Ms Darany', '012555653', null, null, '0', '13', null, '67', 'Samsethy', '1', '2022-12-01 10:18:10.000000', null, null, null, 'F', '1', '');

-- ----------------------------
-- Table structure for `appt_chief_complaints`
-- ----------------------------
DROP TABLE IF EXISTS `appt_chief_complaints`;
CREATE TABLE `appt_chief_complaints` (
  `appointment_id` int(10) NOT NULL,
  `chief_complaint_id` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of appt_chief_complaints
-- ----------------------------
INSERT INTO `appt_chief_complaints` VALUES ('35', '3');
INSERT INTO `appt_chief_complaints` VALUES ('35', '4');
INSERT INTO `appt_chief_complaints` VALUES ('35', '4');
INSERT INTO `appt_chief_complaints` VALUES ('26', '5');
INSERT INTO `appt_chief_complaints` VALUES ('26', '6');
INSERT INTO `appt_chief_complaints` VALUES ('11', '4');
INSERT INTO `appt_chief_complaints` VALUES ('26', '3');
INSERT INTO `appt_chief_complaints` VALUES ('26', '5');
INSERT INTO `appt_chief_complaints` VALUES ('11', '5');
INSERT INTO `appt_chief_complaints` VALUES ('11', '11');
INSERT INTO `appt_chief_complaints` VALUES ('48', '2');
INSERT INTO `appt_chief_complaints` VALUES ('48', '4');

-- ----------------------------
-- Table structure for `chief_complaints`
-- ----------------------------
DROP TABLE IF EXISTS `chief_complaints`;
CREATE TABLE `chief_complaints` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) DEFAULT NULL,
  `name` varchar(350) DEFAULT NULL,
  `code` varchar(25) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_user` varchar(50) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `description` varchar(350) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of chief_complaints
-- ----------------------------
INSERT INTO `chief_complaints` VALUES ('1', '1', 'Acne on back', '0001', null, null, null, null, null, null, null);
INSERT INTO `chief_complaints` VALUES ('2', '1', 'Facial Acne', '002', null, null, null, null, null, null, null);
INSERT INTO `chief_complaints` VALUES ('3', '1', 'Bruised', '003', null, null, null, null, null, null, null);
INSERT INTO `chief_complaints` VALUES ('4', '1', 'Dark skin', '004', null, null, null, null, null, null, null);
INSERT INTO `chief_complaints` VALUES ('5', '1', 'Facial Cleansing', '005', '2022-11-20 13:21:19.463788', null, null, null, null, '2022-11-20 13:21:19.463788', null);
INSERT INTO `chief_complaints` VALUES ('6', '1', 'DDDDDD', null, '2022-11-23 14:23:32.000000', 'Samsethy', '1', null, null, null, null);
INSERT INTO `chief_complaints` VALUES ('7', '1', 'DDDDD', '7', '2022-11-23 14:24:18.783922', 'Samsethy', '1', null, null, '2022-11-23 14:24:18.783922', null);
INSERT INTO `chief_complaints` VALUES ('8', '1', 'KLKLKLK', '8', '2022-11-23 16:30:37.627665', 'Samsethy', '1', null, null, '2022-11-23 16:30:37.627665', null);
INSERT INTO `chief_complaints` VALUES ('9', '1', 'lalalala', '9', '2022-11-23 16:34:42.531582', 'Samsethy', '1', null, null, '2022-11-23 16:34:42.531582', null);
INSERT INTO `chief_complaints` VALUES ('10', '1', 'Facial Acne', '10', '2022-11-24 08:14:09.423172', 'Samsethy', '1', null, null, '2022-11-24 08:14:09.423172', null);
INSERT INTO `chief_complaints` VALUES ('11', '1', 'Im too beautiful ', '11', '2022-11-24 20:03:50.809045', 'Samsethy', '1', null, null, '2022-11-24 20:03:50.809045', null);
INSERT INTO `chief_complaints` VALUES ('12', '1', 'sdfsdgfdg', '12', '2022-12-01 10:41:02.999518', 'Samsethy', '1', null, null, '2022-12-01 10:41:02.999518', null);

-- ----------------------------
-- Table structure for `com_branches`
-- ----------------------------
DROP TABLE IF EXISTS `com_branches`;
CREATE TABLE `com_branches` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `com_branch_id` int(10) NOT NULL,
  `com_branch_name` varchar(250) NOT NULL,
  `com_branch_type` varchar(25) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of com_branches
-- ----------------------------
INSERT INTO `com_branches` VALUES ('1', '1', '1', 'ESTHE-DERM', 'Head Quarter');

-- ----------------------------
-- Table structure for `consult_sessions`
-- ----------------------------
DROP TABLE IF EXISTS `consult_sessions`;
CREATE TABLE `consult_sessions` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `consult_date` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `consultant_id` int(10) DEFAULT NULL,
  `remarks` varchar(250) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_uid` int(10) DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL,
  `patient_id` int(10) DEFAULT NULL,
  `person_id` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of consult_sessions
-- ----------------------------

-- ----------------------------
-- Table structure for `contact_channels`
-- ----------------------------
DROP TABLE IF EXISTS `contact_channels`;
CREATE TABLE `contact_channels` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `branch_id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_user` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_uid` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `update_user` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `update_uid` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of contact_channels
-- ----------------------------
INSERT INTO `contact_channels` VALUES ('1', '0', 'Other', 'Admin', '1', '2022-11-16 12:21:45', null, null, null);
INSERT INTO `contact_channels` VALUES ('2', '0', 'Phone', 'Admin', '1', '2022-11-16 12:21:45', null, null, null);
INSERT INTO `contact_channels` VALUES ('3', '0', 'Facebook', 'Admin', '1', '2022-11-16 12:21:45', null, null, null);
INSERT INTO `contact_channels` VALUES ('4', '0', 'Telegram', 'Admin', '1', '2022-11-16 12:21:45', null, null, null);
INSERT INTO `contact_channels` VALUES ('5', '0', 'Walkin', 'Admin', '1', '2022-11-16 12:21:45', null, null, null);

-- ----------------------------
-- Table structure for `departments`
-- ----------------------------
DROP TABLE IF EXISTS `departments`;
CREATE TABLE `departments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `branch_id` int(11) NOT NULL,
  `com_branch_id` int(11) DEFAULT 0,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(350) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `create_user` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_uid` int(11) NOT NULL,
  `update_user` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `update_uid` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of departments
-- ----------------------------
INSERT INTO `departments` VALUES ('1', '1', '0', 'General', null, 'Admin', '1', null, null, '2022-11-16 12:21:45', null);
INSERT INTO `departments` VALUES ('2', '1', '0', 'Skin Care', null, 'Admin', '1', null, null, '2022-11-16 12:21:45', null);
INSERT INTO `departments` VALUES ('3', '1', '0', 'Cosmetic Surgery', null, 'Admin', '1', null, null, '2022-11-16 12:21:45', null);

-- ----------------------------
-- Table structure for `employees`
-- ----------------------------
DROP TABLE IF EXISTS `employees`;
CREATE TABLE `employees` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `branch_id` int(11) NOT NULL,
  `person_id` int(11) NOT NULL,
  `code` varchar(25) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position_id` int(11) NOT NULL,
  `department_id` int(11) DEFAULT NULL,
  `employment_type` varchar(25) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `salary` decimal(10,2) NOT NULL DEFAULT 0.00,
  `currency_code` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
  `create_user` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_uid` int(11) NOT NULL,
  `update_user` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `update_uid` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of employees
-- ----------------------------
INSERT INTO `employees` VALUES ('1', '1', '1', '11111', '1', '1', 'full time', '0.00', 'USD', '1', '0', null, null, '2022-11-18 10:36:12', null);
INSERT INTO `employees` VALUES ('2', '1', '2', '22222', '1', '1', 'full time', '0.00', 'USD', '1', '0', null, null, '2022-11-18 10:36:09', null);

-- ----------------------------
-- Table structure for `employee_positions`
-- ----------------------------
DROP TABLE IF EXISTS `employee_positions`;
CREATE TABLE `employee_positions` (
  `emp_id` int(10) NOT NULL,
  `position_id` int(10) NOT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_user` varchar(50) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of employee_positions
-- ----------------------------

-- ----------------------------
-- Table structure for `leads`
-- ----------------------------
DROP TABLE IF EXISTS `leads`;
CREATE TABLE `leads` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sex` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_number` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status_id` int(11) NOT NULL,
  `create_uid` int(11) NOT NULL,
  `create_user` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `update_uid` int(11) DEFAULT NULL,
  `update_user` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `branch_id` int(10) DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of leads
-- ----------------------------
INSERT INTO `leads` VALUES ('13', 'Ms Darany', 'F', '012555653', '2', '1', 'Samsethy', null, null, '2022-12-01 09:17:15', null, '1', null);

-- ----------------------------
-- Table structure for `loc_cities`
-- ----------------------------
DROP TABLE IF EXISTS `loc_cities`;
CREATE TABLE `loc_cities` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `country_id` bigint(20) unsigned NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_kh` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `create_user` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `create_date` timestamp NULL DEFAULT NULL,
  `update_user` varchar(35) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `branch_id` int(10) DEFAULT NULL,
  `map_location` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `loc_cities_country_id_foreign` (`country_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of loc_cities
-- ----------------------------
INSERT INTO `loc_cities` VALUES ('13', '14', 'ក្រុងភ្នំពេញ', 'ក្រុងភ្នំពេញ', 'Puthea', '2021-11-22 06:45:27', null, '1', null);
INSERT INTO `loc_cities` VALUES ('14', '15', 'Bangkok', 'Bangkok', 'admin@gmail.com', '2022-04-20 09:41:06', null, '1', null);

-- ----------------------------
-- Table structure for `loc_communes`
-- ----------------------------
DROP TABLE IF EXISTS `loc_communes`;
CREATE TABLE `loc_communes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `country_id` bigint(20) unsigned DEFAULT NULL,
  `city_id` bigint(20) unsigned DEFAULT NULL,
  `district_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `branch_id` int(10) DEFAULT NULL,
  `name_kh` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `map_location` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `create_user` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `create_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `loc_communes_country_id_foreign` (`country_id`),
  KEY `loc_communes_city_id_foreign` (`city_id`),
  KEY `loc_communes_district_id_foreign` (`district_id`)
) ENGINE=InnoDB AUTO_INCREMENT=152 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of loc_communes
-- ----------------------------
INSERT INTO `loc_communes` VALUES ('57', '14', '13', '37', 'ទន្លេបាសាក់', '1', 'ទន្លេបាសាក់', null, 'Puthea', '2021-11-22 06:57:18');
INSERT INTO `loc_communes` VALUES ('58', '14', '13', '37', 'បឹងកេងកងទី ១', '1', 'បឹងកេងកងទី ១', null, 'Puthea', '2021-11-22 07:00:18');
INSERT INTO `loc_communes` VALUES ('59', '14', '13', '37', 'បឹងកេងកងទី ២', '1', 'បឹងកេងកងទី ២', null, 'Puthea', '2021-11-22 07:00:30');
INSERT INTO `loc_communes` VALUES ('60', '14', '13', '37', 'បឹងកេងកងទី ៣', '1', 'បឹងកេងកងទី ៣', null, 'Puthea', '2021-11-22 07:00:53');
INSERT INTO `loc_communes` VALUES ('61', '14', '13', '37', 'អូឡាំពិក', '1', 'អូឡាំពិក', null, 'Puthea', '2021-11-22 07:01:34');
INSERT INTO `loc_communes` VALUES ('62', '14', '13', '37', 'ទួលស្វាយព្រៃទី ១', '1', 'ទួលស្វាយព្រៃទី ១', null, 'Puthea', '2021-11-22 07:01:53');
INSERT INTO `loc_communes` VALUES ('63', '14', '13', '37', 'ទួលស្វាយព្រៃទី ២', '1', 'ទួលស្វាយព្រៃទី ២', null, 'Puthea', '2021-11-22 07:02:08');
INSERT INTO `loc_communes` VALUES ('64', '14', '13', '37', 'ទំនប់ទឹក', '1', 'ទំនប់ទឹក', null, 'Puthea', '2021-11-22 07:02:24');
INSERT INTO `loc_communes` VALUES ('65', '14', '13', '37', 'ទួលទំពូងទី២', '1', 'ទួលទំពូងទី២', null, 'Puthea', '2021-11-22 07:02:38');
INSERT INTO `loc_communes` VALUES ('66', '14', '13', '37', 'ទួលទំពូងទី១', '1', 'ទួលទំពូងទី១', null, 'Puthea', '2021-11-22 07:02:51');
INSERT INTO `loc_communes` VALUES ('67', '14', '13', '37', 'បឹងត្របែក', '1', 'បឹងត្របែក', null, 'Puthea', '2021-11-22 07:03:03');
INSERT INTO `loc_communes` VALUES ('68', '14', '13', '37', 'ផ្សាដើមថ្កូវ', '1', 'ផ្សាដើមថ្កូវ', null, 'Puthea', '2021-11-22 07:03:13');
INSERT INTO `loc_communes` VALUES ('69', '14', '13', '38', 'ដង្កោ', '1', 'ដង្កោ', null, 'Puthea', '2021-11-22 22:33:12');
INSERT INTO `loc_communes` VALUES ('70', '14', '13', '38', 'ពងទឹក', '1', 'ពងទឹក', null, 'Puthea', '2021-11-22 22:34:15');
INSERT INTO `loc_communes` VALUES ('71', '14', '13', '38', 'ព្រៃវែង', '1', 'ព្រៃវែង', null, 'Puthea', '2021-11-22 22:34:27');
INSERT INTO `loc_communes` VALUES ('72', '14', '13', '38', 'ព្រៃស', '1', 'ព្រៃស', null, 'Puthea', '2021-11-22 22:34:45');
INSERT INTO `loc_communes` VALUES ('73', '14', '13', '38', 'ក្រាំងពង្រ', '1', 'ក្រាំងពង្រ', null, 'Puthea', '2021-11-22 22:34:54');
INSERT INTO `loc_communes` VALUES ('74', '14', '13', '38', 'ប្រទះឡាង', '1', 'ប្រទះឡាង', null, 'Puthea', '2021-11-22 22:35:11');
INSERT INTO `loc_communes` VALUES ('75', '14', '13', '38', 'សាក់សំពៅ', '1', 'សាក់សំពៅ', null, 'Puthea', '2021-11-22 22:35:23');
INSERT INTO `loc_communes` VALUES ('76', '14', '13', '38', 'ជយ័ជំនះ', '1', 'ជយ័ជំនះ', null, 'Puthea', '2021-11-22 22:35:34');
INSERT INTO `loc_communes` VALUES ('77', '14', '13', '38', 'ផ្សាចាស់', '1', 'ផ្សាចាស់', null, 'Puthea', '2021-11-22 22:35:54');
INSERT INTO `loc_communes` VALUES ('78', '14', '13', '38', 'វត្តភ្នំ', '1', 'វត្តភ្នំ', null, 'Puthea', '2021-11-22 22:36:09');
INSERT INTO `loc_communes` VALUES ('79', '14', '13', '39', 'ផ្សាដេប៉ូទី១', '1', 'ផ្សាដេប៉ូទី១', null, 'Puthea', '2021-11-22 22:37:43');
INSERT INTO `loc_communes` VALUES ('80', '14', '13', '39', 'ផ្សាដេប៉ូទី២', '1', 'ផ្សាដេប៉ូទី២', null, 'Puthea', '2021-11-22 22:48:19');
INSERT INTO `loc_communes` VALUES ('81', '14', '13', '39', 'ផ្សាដេប៉ូទី៣', '1', 'ផ្សាដេប៉ូទី៣', null, 'Puthea', '2021-11-22 22:48:31');
INSERT INTO `loc_communes` VALUES ('82', '14', '13', '39', 'ទឹកល្អក់ទី១', '1', 'ទឹកល្អក់ទី១', null, 'Puthea', '2021-11-22 22:48:43');
INSERT INTO `loc_communes` VALUES ('83', '14', '13', '39', 'ទឹកល្អក់ទី២', '1', 'ទឹកល្អក់ទី២', null, 'Puthea', '2021-11-22 22:48:55');
INSERT INTO `loc_communes` VALUES ('84', '14', '13', '39', 'ទឹកល្អក់ទី៣', '1', 'ទឹកល្អក់ទី៣', null, 'Puthea', '2021-11-22 22:49:06');
INSERT INTO `loc_communes` VALUES ('85', '14', '13', '39', 'បឹងកក់ទី១', '1', 'បឹងកក់ទី១', null, 'Puthea', '2021-11-22 22:49:17');
INSERT INTO `loc_communes` VALUES ('86', '14', '13', '39', 'ជើងអែក', '1', 'ជើងអែក', null, 'Puthea', '2021-11-22 22:49:53');
INSERT INTO `loc_communes` VALUES ('87', '14', '13', '39', 'គងនយ', '1', 'គងនយ', null, 'Puthea', '2021-11-22 22:50:06');
INSERT INTO `loc_communes` VALUES ('88', '14', '13', '39', 'ព្រែកកំពឹស', '1', 'ព្រែកកំពឹស', null, 'Puthea', '2021-11-22 22:50:16');
INSERT INTO `loc_communes` VALUES ('89', '14', '13', '39', 'រលួស', '1', 'រលួស', null, 'Puthea', '2021-11-22 22:50:27');
INSERT INTO `loc_communes` VALUES ('90', '14', '13', '39', 'ស្ពានថ្ម', '1', 'ស្ពានថ្ម', null, 'Puthea', '2021-11-22 22:50:39');
INSERT INTO `loc_communes` VALUES ('91', '14', '13', '39', 'ទៀន', '1', 'ទៀន', null, 'Puthea', '2021-11-22 22:50:53');
INSERT INTO `loc_communes` VALUES ('92', '14', '13', '40', 'អូឬស្សីទី១', '1', 'អូឬស្សីទី១', null, 'Puthea', '2021-11-22 22:51:40');
INSERT INTO `loc_communes` VALUES ('93', '14', '13', '40', 'អូឬស្សីទី៣', '1', 'អូឬស្សីទី៣', null, 'Puthea', '2021-11-22 22:52:11');
INSERT INTO `loc_communes` VALUES ('94', '14', '13', '40', 'អូឬស្សីទី៤', '1', 'អូឬស្សីទី៤', null, 'Puthea', '2021-11-22 22:52:11');
INSERT INTO `loc_communes` VALUES ('95', '14', '13', '40', 'មនោរម្យ', '1', 'មនោរម្យ', null, 'Puthea', '2021-11-22 22:52:23');
INSERT INTO `loc_communes` VALUES ('96', '14', '13', '40', 'មិត្តភាព', '1', 'មិត្តភាព', null, 'Puthea', '2021-11-22 22:52:32');
INSERT INTO `loc_communes` VALUES ('97', '14', '13', '40', 'វាលវង់', '1', 'វាលវង់', null, 'Puthea', '2021-11-22 22:52:41');
INSERT INTO `loc_communes` VALUES ('98', '14', '13', '40', 'បឹងព្រលិត', '1', 'បឹងព្រលិត', null, 'Puthea', '2021-11-22 22:52:51');
INSERT INTO `loc_communes` VALUES ('99', '14', '13', '41', 'ទួលសង្កែ', '1', 'ទួលសង្កែ', null, 'Puthea', '2021-11-22 22:53:08');
INSERT INTO `loc_communes` VALUES ('100', '14', '13', '41', 'ស្វាយប៉ាក', '1', 'ស្វាយប៉ាក', null, 'Puthea', '2021-11-22 22:53:21');
INSERT INTO `loc_communes` VALUES ('101', '14', '13', '41', 'គីឡូម៉ែតលេខ៦', '1', 'គីឡូម៉ែតលេខ៦', null, 'Puthea', '2021-11-22 22:53:32');
INSERT INTO `loc_communes` VALUES ('102', '14', '13', '41', 'ឬស្សីកែង', '1', 'ឬស្សីកែង', null, 'Puthea', '2021-11-22 22:53:43');
INSERT INTO `loc_communes` VALUES ('103', '14', '13', '41', 'ច្រាំងចំរេះទី១', '1', 'ច្រាំងចំរេះទី១', null, 'Puthea', '2021-11-22 22:53:53');
INSERT INTO `loc_communes` VALUES ('104', '14', '13', '41', 'ច្រាំងចំរេះទី២', '1', 'ច្រាំងចំរេះទី២', null, 'Puthea', '2021-11-22 22:54:03');
INSERT INTO `loc_communes` VALUES ('105', '14', '13', '42', 'ភ្នំពេញថ្មី', '1', 'ភ្នំពេញថ្មី', null, 'Puthea', '2021-11-22 22:54:23');
INSERT INTO `loc_communes` VALUES ('106', '14', '13', '42', 'ទឹកថ្លា', '1', 'ទឹកថ្លា', null, 'Puthea', '2021-11-22 22:54:34');
INSERT INTO `loc_communes` VALUES ('107', '14', '13', '42', 'ឈ្នួល', '1', 'ឈ្នួល', null, 'Puthea', '2021-11-22 22:54:47');
INSERT INTO `loc_communes` VALUES ('108', '14', '13', '42', 'ក្រាំងថ្នង់', '1', 'ក្រាំងថ្នង់', null, 'Puthea', '2021-11-22 22:55:00');
INSERT INTO `loc_communes` VALUES ('109', '14', '13', '43', 'ត្រពាំងក្រសាំង', '1', 'ត្រពាំងក្រសាំង', null, 'Puthea', '2021-11-22 22:55:24');
INSERT INTO `loc_communes` VALUES ('110', '14', '13', '43', 'ភ្លើងឆេះរទិះ', '1', 'ភ្លើងឆេះរទិះ', null, 'Puthea', '2021-11-22 22:55:43');
INSERT INTO `loc_communes` VALUES ('111', '14', '13', '43', 'ចោមចៅ', '1', 'ចោមចៅ', null, 'Puthea', '2021-11-22 22:55:43');
INSERT INTO `loc_communes` VALUES ('112', '14', '13', '43', 'កាកាប', '1', 'កាកាប', null, 'Puthea', '2021-11-22 22:55:52');
INSERT INTO `loc_communes` VALUES ('113', '14', '13', '43', 'សំរោងក្រោម', '1', 'សំរោងក្រោម', null, 'Puthea', '2021-11-22 22:56:02');
INSERT INTO `loc_communes` VALUES ('114', '14', '13', '43', 'បឹងធំ', '1', 'បឹងធំ', null, 'Puthea', '2021-11-22 22:56:11');
INSERT INTO `loc_communes` VALUES ('115', '14', '13', '43', 'កំបូល', '1', 'កំបូល', null, 'Puthea', '2021-11-22 22:56:22');
INSERT INTO `loc_communes` VALUES ('116', '14', '13', '43', 'កន្ទោក', '1', 'កន្ទោក', null, 'Puthea', '2021-11-22 22:56:32');
INSERT INTO `loc_communes` VALUES ('117', '14', '13', '43', 'ឪឡោក', '1', 'ឪឡោក', null, 'Puthea', '2021-11-22 22:56:42');
INSERT INTO `loc_communes` VALUES ('118', '14', '13', '43', 'ស្នើរ', '1', 'ស្នើរ', null, 'Puthea', '2021-11-22 22:56:51');
INSERT INTO `loc_communes` VALUES ('119', '14', '13', '44', 'ព្រែកភ្នៅ', '1', 'ព្រែកភ្នៅ', null, 'Puthea', '2021-11-22 22:57:08');
INSERT INTO `loc_communes` VALUES ('120', '14', '13', '44', 'ពញាពន់', '1', 'ពញាពន់', null, 'Puthea', '2021-11-22 22:57:18');
INSERT INTO `loc_communes` VALUES ('121', '14', '13', '44', 'សំរោង', '1', 'សំរោង', null, 'Puthea', '2021-11-22 22:57:27');
INSERT INTO `loc_communes` VALUES ('122', '14', '13', '44', 'គោករកា', '1', 'គោករកា', null, 'Puthea', '2021-11-22 22:57:38');
INSERT INTO `loc_communes` VALUES ('123', '14', '13', '44', 'កន្សែង', '1', 'កន្សែង', null, 'Puthea', '2021-11-22 22:57:47');
INSERT INTO `loc_communes` VALUES ('124', '14', '13', '45', 'ផ្សារថ្មីទី១', '1', 'ផ្សារថ្មីទី១', null, 'Puthea', '2021-11-22 22:58:06');
INSERT INTO `loc_communes` VALUES ('125', '14', '13', '45', 'ផ្សារថ្មីទី២', '1', 'ផ្សារថ្មីទី២', null, 'Puthea', '2021-11-22 22:58:18');
INSERT INTO `loc_communes` VALUES ('126', '14', '13', '45', 'ផ្សារថ្មីទី៣', '1', 'ផ្សារថ្មីទី៣', null, 'Puthea', '2021-11-22 22:58:34');
INSERT INTO `loc_communes` VALUES ('127', '14', '13', '45', 'បឹងរាំង', '1', 'បឹងរាំង', null, 'Puthea', '2021-11-22 22:58:45');
INSERT INTO `loc_communes` VALUES ('128', '14', '13', '45', 'ផ្សាកណ្ដាលទី១', '1', 'ផ្សាកណ្ដាលទី១', null, 'Puthea', '2021-11-22 22:58:54');
INSERT INTO `loc_communes` VALUES ('129', '14', '13', '45', 'ផ្សាកណ្ដាលទី២', '1', 'ផ្សាកណ្ដាលទី២', null, 'Puthea', '2021-11-22 22:59:03');
INSERT INTO `loc_communes` VALUES ('130', '14', '13', '45', 'ចតុមុខ', '1', 'ចតុមុខ', null, 'Puthea', '2021-11-22 22:59:17');
INSERT INTO `loc_communes` VALUES ('131', '14', '13', '46', 'ស្ទឹងមានជយ័', '1', 'ស្ទឹងមានជយ័', null, 'Puthea', '2021-11-22 22:59:50');
INSERT INTO `loc_communes` VALUES ('132', '14', '13', '46', 'បឹងទំពុន', '1', 'បឹងទំពុន', null, 'Puthea', '2021-11-22 23:00:01');
INSERT INTO `loc_communes` VALUES ('133', '14', '13', '46', 'ចាក់អង្រែលើ', '1', 'ចាក់អង្រែលើ', null, 'Puthea', '2021-11-22 23:00:10');
INSERT INTO `loc_communes` VALUES ('134', '14', '13', '46', 'ចាក់អង្រែក្រោម', '1', 'ចាក់អង្រែក្រោម', null, 'Puthea', '2021-11-22 23:00:21');
INSERT INTO `loc_communes` VALUES ('136', '14', '13', '47', 'ព្រែកលាប', '1', 'ព្រែកលាប', null, 'Puthea', '2021-11-22 23:00:50');
INSERT INTO `loc_communes` VALUES ('137', '14', '13', '47', 'ព្រែកតាសេក', '1', 'ព្រែកតាសេក', null, 'Puthea', '2021-11-22 23:01:09');
INSERT INTO `loc_communes` VALUES ('138', '14', '13', '47', 'កោះដាច់', '1', 'កោះដាច់', null, 'Puthea', '2021-11-22 23:01:09');
INSERT INTO `loc_communes` VALUES ('139', '14', '13', '47', 'បាក់ខែង', '1', 'បាក់ខែង', null, 'Puthea', '2021-11-22 23:02:59');
INSERT INTO `loc_communes` VALUES ('140', '14', '13', '48', 'ច្បាអំពៅទី១', '1', 'ច្បាអំពៅទី១', null, 'Puthea', '2021-11-22 23:03:49');
INSERT INTO `loc_communes` VALUES ('141', '14', '13', '48', 'ច្បាអំពៅទី២', '1', 'ច្បាអំពៅទី២', null, 'Puthea', '2021-11-22 23:03:59');
INSERT INTO `loc_communes` VALUES ('142', '14', '13', '48', 'និរោធ', '1', 'និរោធ', null, 'Puthea', '2021-11-22 23:04:09');
INSERT INTO `loc_communes` VALUES ('143', '14', '13', '48', 'ព្រែកប្រា', '1', 'ព្រែកប្រា', null, 'Puthea', '2021-11-22 23:04:29');
INSERT INTO `loc_communes` VALUES ('144', '14', '13', '48', 'វាលស្បូវ', '1', 'វាលស្បូវ', null, 'Puthea', '2021-11-22 23:04:30');
INSERT INTO `loc_communes` VALUES ('145', '14', '13', '48', 'ព្រែកអែង', '1', 'ព្រែកអែង', null, 'Puthea', '2021-11-22 23:04:51');
INSERT INTO `loc_communes` VALUES ('146', '14', '13', '48', 'ក្បាលកោះ', '1', 'ក្បាលកោះ', null, 'Puthea', '2021-11-22 23:05:05');
INSERT INTO `loc_communes` VALUES ('147', '14', '13', '38', 'ស្រះចក', '1', 'ស្រះចក', null, 'Puthea', '2021-11-22 23:08:13');
INSERT INTO `loc_communes` VALUES ('148', '14', '13', '40', 'អូឬស្សីទី២', '1', 'អូឬស្សីទី២', null, 'Puthea', '2021-11-22 23:10:43');
INSERT INTO `loc_communes` VALUES ('149', '14', '13', '48', 'ព្រែកថ្មី', '1', 'ព្រែកថ្មី', null, 'Puthea', '2021-11-22 23:13:40');
INSERT INTO `loc_communes` VALUES ('150', '14', '13', '47', 'ជ្រោយចង្វារ', '1', 'ជ្រោយចង្វារ', null, 'Puthea', '2021-11-24 03:20:41');
INSERT INTO `loc_communes` VALUES ('151', '14', '13', '39', 'Kabol', '1', 'Kabol', null, 'admin@gmail.com', '2021-12-24 08:45:20');

-- ----------------------------
-- Table structure for `loc_countries`
-- ----------------------------
DROP TABLE IF EXISTS `loc_countries`;
CREATE TABLE `loc_countries` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `name_kh` varchar(100) NOT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `create_date` timestamp NULL DEFAULT NULL,
  `branch_id` int(10) NOT NULL,
  `region_name` varchar(150) DEFAULT '',
  `nationality` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of loc_countries
-- ----------------------------
INSERT INTO `loc_countries` VALUES ('14', 'Cambodia', 'Cambodia', 'Puthea', '2021-11-22 06:30:12', '1', null, null);
INSERT INTO `loc_countries` VALUES ('15', 'Thailand', 'Thailand', 'admin@gmail.com', '2022-04-20 09:40:50', '1', null, null);

-- ----------------------------
-- Table structure for `loc_districts`
-- ----------------------------
DROP TABLE IF EXISTS `loc_districts`;
CREATE TABLE `loc_districts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `city_id` bigint(20) unsigned NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_kh` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `create_user` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `create_date` timestamp NULL DEFAULT NULL,
  `map_location` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `branch_id` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `loc_districts_city_id_foreign` (`city_id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of loc_districts
-- ----------------------------
INSERT INTO `loc_districts` VALUES ('35', '12', 'ខណ្ឌចំការមន', 'ខណ្ឌចំការមន', 'Puthea', '2021-11-22 06:40:17', null, '1');
INSERT INTO `loc_districts` VALUES ('36', '12', 'ខណ្ឌ័ដង្កោ', 'ខណ្ឌ័ដង្កោ', 'Puthea', '2021-11-22 06:40:59', null, '1');
INSERT INTO `loc_districts` VALUES ('37', '13', 'ខណ្ឌ័ចំការមន', 'ខណ្ឌ័ចំការមន', 'Sopha', '2021-11-22 06:42:11', null, '1');
INSERT INTO `loc_districts` VALUES ('38', '13', 'ខណ្ឌ័ដង្កោ', 'ខណ្ឌ័ដង្កោ', 'Sopha', '2021-11-22 06:42:27', null, '1');
INSERT INTO `loc_districts` VALUES ('39', '13', 'ខណ្ឌ័ទួលគក', 'ខណ្ឌ័ទួលគក', 'Puthea', '2021-11-22 06:44:55', null, '1');
INSERT INTO `loc_districts` VALUES ('40', '13', 'ខណ្ឌ័៧មករា', 'ខណ្ឌ័៧មករា', 'Puthea', '2021-11-22 06:49:35', null, '1');
INSERT INTO `loc_districts` VALUES ('41', '13', 'ខណ្ឌ័ឬស្សីកែវ', 'ខណ្ឌ័ឬស្សីកែវ', 'Puthea', '2021-11-22 06:50:18', null, '1');
INSERT INTO `loc_districts` VALUES ('42', '13', 'ខណ្ឌ័សែនសុខ', 'ខណ្ឌ័សែនសុខ', 'Puthea', '2021-11-22 06:50:40', null, '1');
INSERT INTO `loc_districts` VALUES ('43', '13', 'ខណ្ឌ័ពោសែនជយ័', 'ខណ្ឌ័ពោសែនជយ័', 'Puthea', '2021-11-22 06:50:54', null, '1');
INSERT INTO `loc_districts` VALUES ('44', '13', 'ខណ្ឌ័ព្រែកភ្នៅ', 'ខណ្ឌ័ព្រែកភ្នៅ', 'Puthea', '2021-11-22 06:51:16', null, '1');
INSERT INTO `loc_districts` VALUES ('45', '13', 'ខណ្ឌ័ដូនពេញ', 'ខណ្ឌ័ដូនពេញ', 'Puthea', '2021-11-22 06:51:37', null, '1');
INSERT INTO `loc_districts` VALUES ('46', '13', 'ខណ្ឌ័មានជយ័', 'ខណ្ឌ័មានជយ័', 'Puthea', '2021-11-22 06:51:58', null, '1');
INSERT INTO `loc_districts` VALUES ('47', '13', 'ខណ្ឌ័ជ្រោយចង្វារ', 'ខណ្ឌ័ជ្រោយចង្វារ', 'Puthea', '2021-11-22 06:52:15', null, '1');
INSERT INTO `loc_districts` VALUES ('48', '13', 'ខណ្ឌ័ច្បាអំពៅ', 'ខណ្ឌ័ច្បាអំពៅ', 'Puthea', '2021-11-22 06:52:32', null, '1');

-- ----------------------------
-- Table structure for `loc_villages`
-- ----------------------------
DROP TABLE IF EXISTS `loc_villages`;
CREATE TABLE `loc_villages` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `name_kh` varchar(100) NOT NULL,
  `commune_id` int(10) NOT NULL,
  `create_user` varchar(50) NOT NULL,
  `create_date` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of loc_villages
-- ----------------------------

-- ----------------------------
-- Table structure for `medical_conditions`
-- ----------------------------
DROP TABLE IF EXISTS `medical_conditions`;
CREATE TABLE `medical_conditions` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `name` varchar(250) NOT NULL DEFAULT '',
  `value_type` varchar(50) NOT NULL DEFAULT '' COMMENT 'value_type = {boolean,level}. Level is encoded as, for example, from scale of 0 to 10,  "L-3" => level 3 or Severity Level = 3',
  `range` varchar(50) DEFAULT NULL COMMENT '0-10',
  `display_order` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of medical_conditions
-- ----------------------------
INSERT INTO `medical_conditions` VALUES ('1', '1', 'Allergies', 'boolean', null, null);
INSERT INTO `medical_conditions` VALUES ('2', '1', 'Colds and Flu', 'level', '0-10', null);
INSERT INTO `medical_conditions` VALUES ('3', '1', 'Conjunctivitis ', 'boolean', null, null);
INSERT INTO `medical_conditions` VALUES ('4', '1', 'Diarrhea', 'level', '0-10', null);
INSERT INTO `medical_conditions` VALUES ('5', '1', 'Headaches', 'level', '0-10', null);
INSERT INTO `medical_conditions` VALUES ('6', '1', 'Stomach Aches', 'level', '0-10', null);

-- ----------------------------
-- Table structure for `migrations`
-- ----------------------------
DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of migrations
-- ----------------------------
INSERT INTO `migrations` VALUES ('1', '0000_00_00_000000_create_websockets_statistics_entries_table', '1');
INSERT INTO `migrations` VALUES ('2', '2022_11_14_142853_create_appointments_table', '1');
INSERT INTO `migrations` VALUES ('3', '2022_11_14_153645_create_prescriptions_table', '1');
INSERT INTO `migrations` VALUES ('4', '2022_11_14_173924_create_persons_table', '1');
INSERT INTO `migrations` VALUES ('5', '2022_11_14_174216_create_patients_table', '1');
INSERT INTO `migrations` VALUES ('6', '2022_11_14_174339_create_contact_channels_table', '1');
INSERT INTO `migrations` VALUES ('7', '2022_11_14_175110_create_um_tables', '1');
INSERT INTO `migrations` VALUES ('8', '2022_11_15_143951_create_leads_table', '1');
INSERT INTO `migrations` VALUES ('9', '2022_11_16_112310_create_employees_table', '1');
INSERT INTO `migrations` VALUES ('10', '2022_11_16_113936_create_departments_table', '1');
INSERT INTO `migrations` VALUES ('11', '2022_11_16_115512_create_positions_table', '1');
INSERT INTO `migrations` VALUES ('12', '2022_11_16_120819_create_inital_data', '1');

-- ----------------------------
-- Table structure for `patients`
-- ----------------------------
DROP TABLE IF EXISTS `patients`;
CREATE TABLE `patients` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `branch_id` int(11) NOT NULL,
  `com_branch_id` int(11) NOT NULL,
  `person_id` int(11) NOT NULL,
  `code` varchar(25) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `create_user` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_uid` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `update_user` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `update_uid` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `remarks` varchar(350) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `patient_type` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'patient_type = {OPD,IPD}',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of patients
-- ----------------------------
INSERT INTO `patients` VALUES ('67', '1', '1', '50', 'P100001', 'Samsethy', '1', '2022-12-01 10:19:48', null, null, null, null, 'OPD');

-- ----------------------------
-- Table structure for `patient_code_control`
-- ----------------------------
DROP TABLE IF EXISTS `patient_code_control`;
CREATE TABLE `patient_code_control` (
  `branch_id` int(10) NOT NULL,
  `last_id` int(10) NOT NULL,
  `classify_by` varchar(20) DEFAULT NULL,
  `prefix` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of patient_code_control
-- ----------------------------
INSERT INTO `patient_code_control` VALUES ('1', '1', null, 'P');

-- ----------------------------
-- Table structure for `patient_medical_conditions`
-- ----------------------------
DROP TABLE IF EXISTS `patient_medical_conditions`;
CREATE TABLE `patient_medical_conditions` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `patient_id` int(10) NOT NULL,
  `mc_item_id` int(10) NOT NULL,
  `mc_value` varchar(25) NOT NULL,
  `status` varchar(15) NOT NULL COMMENT 'status={active,inactive}. inactive = "patient used to have this condition"',
  `observe_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_uid` int(10) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `updated-at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `description` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of patient_medical_conditions
-- ----------------------------
INSERT INTO `patient_medical_conditions` VALUES ('40', '1', '67', '3', '0', 'Active', '2022-12-01 10:19:48.000000', '1', 'Samsethy', '2022-12-01 10:19:48.000000', null, null, null, 'Conjunctivitis');

-- ----------------------------
-- Table structure for `patient_vital_signs`
-- ----------------------------
DROP TABLE IF EXISTS `patient_vital_signs`;
CREATE TABLE `patient_vital_signs` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `session_id` int(10) DEFAULT NULL,
  `patient_id` int(10) DEFAULT NULL,
  `vital_sign_id` int(10) DEFAULT NULL,
  `vital_sign_value` decimal(10,2) DEFAULT NULL,
  `description` varchar(150) DEFAULT '',
  `check_time` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_uid` int(10) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_uid` int(10) DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL,
  `branch_id` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of patient_vital_signs
-- ----------------------------
INSERT INTO `patient_vital_signs` VALUES ('41', null, '67', '1', '35.00', 'Body temperature', '2022-12-01 10:19:48.000000', '2022-12-01 10:19:48.000000', '1', 'Samsethy', null, null, null, '1');
INSERT INTO `patient_vital_signs` VALUES ('42', null, '67', '2', '67.00', 'Impulse rate', '2022-12-01 10:19:48.000000', '2022-12-01 10:19:48.000000', '1', 'Samsethy', null, null, null, '1');
INSERT INTO `patient_vital_signs` VALUES ('43', null, '67', '3', '89.00', 'Respiration Rate', '2022-12-01 10:19:48.000000', '2022-12-01 10:19:48.000000', '1', 'Samsethy', null, null, null, '1');
INSERT INTO `patient_vital_signs` VALUES ('44', null, '67', '4', '120.00', 'Blood pressure', '2022-12-01 10:19:48.000000', '2022-12-01 10:19:48.000000', '1', 'Samsethy', null, null, null, '1');

-- ----------------------------
-- Table structure for `persons`
-- ----------------------------
DROP TABLE IF EXISTS `persons`;
CREATE TABLE `persons` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `branch_id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sex` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `nationality_id` int(11) DEFAULT NULL,
  `phone_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_number1` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `national_id` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cp_name` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cp_phone_number` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `create_user` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_uid` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `update_user` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `update_uid` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of persons
-- ----------------------------
INSERT INTO `persons` VALUES ('50', '1', 'Ms Darany', 'Darany', 'Ms', 'F', '2022-10-10', '14', '012555653', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-01 10:19:48', null, null, null);

-- ----------------------------
-- Table structure for `positions`
-- ----------------------------
DROP TABLE IF EXISTS `positions`;
CREATE TABLE `positions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `branch_id` int(11) NOT NULL,
  `department_id` int(11) DEFAULT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_uid` int(11) NOT NULL,
  `create_user` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `update_uid` int(11) DEFAULT NULL,
  `update_user` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of positions
-- ----------------------------
INSERT INTO `positions` VALUES ('1', '1', '1', 'Receiptionist', '1', 'Admin', null, null, null, '2022-11-16 12:21:45');
INSERT INTO `positions` VALUES ('2', '1', '1', 'Skin Care Consultant', '1', 'Admin', null, null, null, '2022-11-16 12:21:45');
INSERT INTO `positions` VALUES ('3', '1', '1', 'Surgoen', '1', 'Admin', null, null, null, '2022-11-16 12:21:45');
INSERT INTO `positions` VALUES ('4', '1', '1', 'Accountant', '1', 'Admin', null, null, null, '2022-11-16 12:21:45');

-- ----------------------------
-- Table structure for `prescriptions`
-- ----------------------------
DROP TABLE IF EXISTS `prescriptions`;
CREATE TABLE `prescriptions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` int(11) NOT NULL,
  `consultant_id` int(11) NOT NULL,
  `issue_date` date NOT NULL,
  `followup_date` date DEFAULT NULL,
  `advice` varchar(250) COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_uid` int(11) DEFAULT NULL,
  `create_user` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `update_uid` int(11) DEFAULT NULL,
  `update_user` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of prescriptions
-- ----------------------------

-- ----------------------------
-- Table structure for `reports`
-- ----------------------------
DROP TABLE IF EXISTS `reports`;
CREATE TABLE `reports` (
  `id` int(10) NOT NULL DEFAULT 0,
  `module_id` int(10) NOT NULL DEFAULT 100,
  `code` varchar(35) CHARACTER SET utf8 DEFAULT '',
  `name` varchar(150) CHARACTER SET utf8 NOT NULL,
  `category` varchar(20) CHARACTER SET utf8 NOT NULL COMMENT 'category= "payment","enrollment","schedule".  => show reports by category or group  of report',
  `params` varchar(250) CHARACTER SET utf8 DEFAULT NULL,
  `display_order` int(10) DEFAULT NULL,
  `hidden` tinyint(6) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of reports
-- ----------------------------
INSERT INTO `reports` VALUES ('1', '100', 'Pending Loans', 'Pending Loans', 'Application', 'start_date|end_date', '4', '0');
INSERT INTO `reports` VALUES ('2', '100', 'Active Loans', 'Active Loans', 'Loan', 'loan_type_id|start_date|end_date', '3', '0');
INSERT INTO `reports` VALUES ('3', '100', 'Customer List', 'Customer List', 'Loan', 'start_date|end_date', '5', '0');
INSERT INTO `reports` VALUES ('4', '100', 'Loan Collections', 'Loan Collections', 'Loan', 'start_date|end_date|loan_type_id|borrower_id|user_id', '2', '0');
INSERT INTO `reports` VALUES ('5', '100', 'Interest Earnings', 'Interest Earnings', 'Loan', 'start_date|end_date', '5', '0');
INSERT INTO `reports` VALUES ('6', '100', 'Overdue report', 'Overdue report', 'Loan', 'loan_type_id', '5', '0');
INSERT INTO `reports` VALUES ('7', '100', 'Uncollectible Loans', 'Uncollectible Loans', 'Loan', '', '1', '0');

-- ----------------------------
-- Table structure for `um_applications`
-- ----------------------------
DROP TABLE IF EXISTS `um_applications`;
CREATE TABLE `um_applications` (
  `app_id` varchar(50) NOT NULL,
  `name` varchar(150) NOT NULL,
  `name_native` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of um_applications
-- ----------------------------
INSERT INTO `um_applications` VALUES ('DXM20FKAEFC711EH2E7C9801A7BZD311', 'MCLINIC', 'MCLINIC');

-- ----------------------------
-- Table structure for `um_app_modules`
-- ----------------------------
DROP TABLE IF EXISTS `um_app_modules`;
CREATE TABLE `um_app_modules` (
  `id` int(10) NOT NULL,
  `parent_mod_id` int(10) NOT NULL DEFAULT 0,
  `app_id` varchar(50) DEFAULT NULL,
  `ref_code` varchar(20) DEFAULT '',
  `module_name` varchar(150) NOT NULL,
  `module_name_native` varchar(150) DEFAULT NULL,
  `icon_image` varchar(100) DEFAULT '',
  `target_url` varchar(150) DEFAULT NULL,
  `hidden` tinyint(6) NOT NULL DEFAULT 0,
  `disabled` tinyint(6) NOT NULL DEFAULT 0,
  `display_order` int(10) DEFAULT 0,
  `branch_id` int(10) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of um_app_modules
-- ----------------------------
INSERT INTO `um_app_modules` VALUES ('100', '0', 'DXM20FKAEFC711EH2E7C9801A7BZD311', 'UMT', 'User Management', 'User Management', 'user.png', '', '0', '0', '1', '0');
INSERT INTO `um_app_modules` VALUES ('101', '0', 'DXM20FKAEFC711EH2E7C9801A7BZD311', 'RMT', 'Role Management', 'Role Management', '', null, '0', '0', null, '0');
INSERT INTO `um_app_modules` VALUES ('102', '0', 'DXM20FKAEFC711EH2E7C9801A7BZD311', 'DRM', 'Location Management', 'Locations', 'shop.png', '', '0', '0', '6', '0');
INSERT INTO `um_app_modules` VALUES ('103', '0', 'DXM20FKAEFC711EH2E7C9801A7BZD311', 'SETTINGS', 'Settings', 'Settings', 'settings.png', '', '1', '0', '8', '0');
INSERT INTO `um_app_modules` VALUES ('104', '0', 'DXM20FKAEFC711EH2E7C9801A7BZD311', 'MSETTINGS', 'Mobile Settings', 'Mobile Settings', 'users.png', '', '1', '0', '7', '0');
INSERT INTO `um_app_modules` VALUES ('105', '0', 'DXM20FKAEFC711EH2E7C9801A7BZD311', 'COM', 'Company Profile', 'Company Profile', '', null, '0', '0', null, '0');
INSERT INTO `um_app_modules` VALUES ('106', '0', 'DXM20FKAEFC711EH2E7C9801A7BZD311', 'BIMG', 'Brand Images', 'Brand Images', '', null, '0', '0', null, '0');

-- ----------------------------
-- Table structure for `um_branches`
-- ----------------------------
DROP TABLE IF EXISTS `um_branches`;
CREATE TABLE `um_branches` (
  `branch_id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `name_kh` varchar(150) NOT NULL,
  `logo_file_name` varchar(250) DEFAULT '',
  `logo_file_type` varchar(50) DEFAULT NULL,
  `address` varchar(250) DEFAULT NULL,
  `phone_number` varchar(100) DEFAULT NULL,
  `first_cp_name` varchar(50) DEFAULT '',
  `second_cp_name` varchar(50) DEFAULT '',
  `first_cp_phone` varchar(50) DEFAULT '',
  `second_cp_phone` varchar(50) DEFAULT '',
  `first_cp_email` varchar(50) DEFAULT '',
  `second_contact_email` varchar(50) DEFAULT NULL,
  `parent_id` int(10) DEFAULT NULL,
  `address_kh` varchar(250) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `update_user` varchar(35) DEFAULT NULL,
  `update_date` timestamp(6) NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `website` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`branch_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of um_branches
-- ----------------------------
INSERT INTO `um_branches` VALUES ('1', 'ESTHEDERM CLINIC', 'ESTHEDERM CLINIC', null, 'png', '#458 Street 24BT Sangkat Boeung Tompon Khan Meanchey Phnom Penh Cambodia', '012222333', 'solida', null, null, null, null, null, null, 'ផ្ទះលេខ៤៥៨ ផ្លូវ២៤BT សង្កាត់បឹងទំពន់ ខណ្ឌមានជ័យ រាធធានីភ្នំពេញ', 'infopucedukh', '', '2022-05-11 14:30:08.139686', null);

-- ----------------------------
-- Table structure for `um_permissions`
-- ----------------------------
DROP TABLE IF EXISTS `um_permissions`;
CREATE TABLE `um_permissions` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `module_id` int(10) NOT NULL,
  `app_id` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=220 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of um_permissions
-- ----------------------------
INSERT INTO `um_permissions` VALUES ('100', 'Create user', '100', 'DXM20FKAEFC711EH2E7C9801A7BZD311');
INSERT INTO `um_permissions` VALUES ('101', 'Delete user', '100', 'DXM20FKAEFC711EH2E7C9801A7BZD311');
INSERT INTO `um_permissions` VALUES ('102', 'Create role', '100', 'DXM20FKAEFC711EH2E7C9801A7BZD311');
INSERT INTO `um_permissions` VALUES ('103', 'Delete role', '100', 'DXM20FKAEFC711EH2E7C9801A7BZD311');
INSERT INTO `um_permissions` VALUES ('104', 'Modify role name', '100', 'DXM20FKAEFC711EH2E7C9801A7BZD311');

-- ----------------------------
-- Table structure for `um_roles`
-- ----------------------------
DROP TABLE IF EXISTS `um_roles`;
CREATE TABLE `um_roles` (
  `app_id` varchar(50) NOT NULL,
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `branch_id` int(10) NOT NULL,
  `create_user` varchar(35) DEFAULT NULL,
  `create_date` timestamp NULL DEFAULT NULL,
  `user_class` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of um_roles
-- ----------------------------
INSERT INTO `um_roles` VALUES ('DXM20FKAEFC711EH2E7C9801A7BZD311', '1', 'Super Admin', '1', null, '2021-09-11 09:54:38', 'superadmin');
INSERT INTO `um_roles` VALUES ('DXM20FKAEFC711EH2E7C9801A7BZD311', '2', 'Admin', '1', null, '2021-09-11 09:52:44', 'Admin');

-- ----------------------------
-- Table structure for `um_role_modules`
-- ----------------------------
DROP TABLE IF EXISTS `um_role_modules`;
CREATE TABLE `um_role_modules` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `role_id` int(10) NOT NULL,
  `module_id` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of um_role_modules
-- ----------------------------
INSERT INTO `um_role_modules` VALUES ('41', '1', '100');
INSERT INTO `um_role_modules` VALUES ('42', '1', '101');
INSERT INTO `um_role_modules` VALUES ('43', '1', '102');
INSERT INTO `um_role_modules` VALUES ('44', '1', '103');
INSERT INTO `um_role_modules` VALUES ('45', '1', '104');
INSERT INTO `um_role_modules` VALUES ('46', '1', '105');
INSERT INTO `um_role_modules` VALUES ('47', '1', '106');

-- ----------------------------
-- Table structure for `um_role_permissions`
-- ----------------------------
DROP TABLE IF EXISTS `um_role_permissions`;
CREATE TABLE `um_role_permissions` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `permission_id` int(10) NOT NULL,
  `role_id` int(10) NOT NULL,
  `branch_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=243 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of um_role_permissions
-- ----------------------------
INSERT INTO `um_role_permissions` VALUES ('1', '100', '1', '1');
INSERT INTO `um_role_permissions` VALUES ('2', '101', '1', '2');
INSERT INTO `um_role_permissions` VALUES ('3', '102', '1', '2');
INSERT INTO `um_role_permissions` VALUES ('4', '103', '1', '2');
INSERT INTO `um_role_permissions` VALUES ('5', '104', '1', '2');

-- ----------------------------
-- Table structure for `um_sessions`
-- ----------------------------
DROP TABLE IF EXISTS `um_sessions`;
CREATE TABLE `um_sessions` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) DEFAULT NULL,
  `app_id` varchar(50) NOT NULL,
  `login_name` varchar(35) NOT NULL,
  `user_id` int(10) DEFAULT NULL,
  `start_time` timestamp NULL DEFAULT NULL,
  `last_active_time` timestamp NULL DEFAULT NULL,
  `session_id` varchar(150) DEFAULT NULL,
  `csrf_code` varchar(150) DEFAULT NULL,
  `access_token` varchar(800) DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL COMMENT 'status ={online,offline}',
  `lang` varchar(50) DEFAULT 'en',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1488 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of um_sessions
-- ----------------------------
INSERT INTO `um_sessions` VALUES ('1487', '1', 'DXM20FKAEFC711EH2E7C9801A7BZD311', 'admin@gmail.com', '1', '2022-12-01 11:42:45', '2022-12-01 11:42:45', 'ru7yjV67W2D5V1Rs9iN0iyj6rFx8F742Ai6RQd', 'oc95X2AdQerGp4vcSnZSB8jTJR9Vl8BvY1w6fv', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpaXMiOm51bGwsImF1ZCI6bnVsbCwiaWF0IjoxNjY5ODY5NzY1LCJuYmYiOjE2Njk4Njk3NjUsImV4cCI6MTY2OTg3MzM2NSwibGFuZyI6ImVuIiwidXNlcl9jbGFzcyI6ImFkbWluIiwib2ZmaWNpYWxfaWQiOm51bGwsImlkIjoxLCJsb2dpbl9uYW1lIjoiYWRtaW5AZ21haWwuY29tIiwiYnJhbmNoX2lkIjoxLCJmdWxsX25hbWUiOiJTYW1zZXRoeSIsInN0YXR1cyI6ImFjdGl2ZSIsImlzX2xvY2tlZCI6MCwiZW1haWwiOm51bGwsInBob25lX251bWJlciI6IjAxMjU3ODkwIiwib3RwX2NvZGUiOm51bGx9.O0B3UyeRmMzc4UPOjhiXKzl9RhHFCpixPtT2A3ptMT0', null, 'en');

-- ----------------------------
-- Table structure for `um_users`
-- ----------------------------
DROP TABLE IF EXISTS `um_users`;
CREATE TABLE `um_users` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `login_name` varchar(50) NOT NULL,
  `phone_number` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `hpwd` varchar(150) DEFAULT NULL,
  `last_login_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `app_id` varchar(50) NOT NULL,
  `subs_id` varchar(50) DEFAULT '',
  `branch_id` int(10) NOT NULL,
  `previlege_type` varchar(20) NOT NULL DEFAULT 'standard' COMMENT 'previlege_type ={standard,admin}',
  `is_locked` tinyint(6) NOT NULL DEFAULT 0,
  `status` varchar(15) NOT NULL DEFAULT 'active' COMMENT 'status ={active,inactive}',
  `full_name` varchar(50) NOT NULL,
  `official_id` int(11) DEFAULT NULL COMMENT 'official_id is the ID value that is used to link to more meaningful details table such as Employees, Students,Parents,Viewers, Customers etc. ',
  `user_class` varchar(25) NOT NULL COMMENT 'user_class { whatever classification that fits each application context }. Example. user_class = {staff,student,parent,customer,...} ',
  `create_user` varchar(35) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `create_date` timestamp NULL DEFAULT NULL,
  `official_code` varchar(50) DEFAULT NULL,
  `work_location_id` int(10) DEFAULT NULL,
  `otp_code` varchar(15) DEFAULT NULL,
  `lang` varchar(15) DEFAULT 'en',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of um_users
-- ----------------------------
INSERT INTO `um_users` VALUES ('1', 'admin@gmail.com', '01257890', null, '$2y$10$9s0nFmOKK6xEc8c63nT7KeQSGb4UoUio39dTBoQKrArZ3TlRh7LYK', '2022-11-27 13:27:16.483053', 'DXM20FKAEFC711EH2E7C9801A7BZD311', null, '1', 'Admin', '0', 'active', 'Samsethy', null, 'admin', 'admin@gmail.com', '3', '2021-09-13 04:00:26', '0001', null, null, 'en');

-- ----------------------------
-- Table structure for `um_user_roles`
-- ----------------------------
DROP TABLE IF EXISTS `um_user_roles`;
CREATE TABLE `um_user_roles` (
  `user_id` int(10) NOT NULL,
  `role_id` int(10) NOT NULL,
  `app_id` varchar(50) NOT NULL,
  `is_primary_role` tinyint(4) NOT NULL DEFAULT 0,
  `branch_id` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of um_user_roles
-- ----------------------------
INSERT INTO `um_user_roles` VALUES ('1', '1', 'DXM20FKAEFC711EH2E7C9801A7BZD311', '0', '1');

-- ----------------------------
-- Table structure for `um_worklocations`
-- ----------------------------
DROP TABLE IF EXISTS `um_worklocations`;
CREATE TABLE `um_worklocations` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `company_id` int(10) NOT NULL,
  `name` varchar(150) NOT NULL COMMENT 'Location name in Latin',
  `name_native` varchar(150) NOT NULL COMMENT 'location name in Khmer',
  `location_type` varchar(35) NOT NULL DEFAULT 'branch' COMMENT 'location_type ={branch,campus,head branch}',
  `location_map` varchar(200) DEFAULT NULL COMMENT 'Google map location',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of um_worklocations
-- ----------------------------

-- ----------------------------
-- Table structure for `user_branches`
-- ----------------------------
DROP TABLE IF EXISTS `user_branches`;
CREATE TABLE `user_branches` (
  `user_id` int(10) NOT NULL,
  `com_branch_id` int(10) NOT NULL,
  `branch_id` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of user_branches
-- ----------------------------

-- ----------------------------
-- Table structure for `vital_signs`
-- ----------------------------
DROP TABLE IF EXISTS `vital_signs`;
CREATE TABLE `vital_signs` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `category` varchar(50) DEFAULT '',
  `display_name` varchar(150) DEFAULT NULL,
  `value_type` varchar(20) DEFAULT '' COMMENT 'number,string',
  `create_uid` int(10) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `display_order` int(10) DEFAULT NULL,
  `branch_id` int(10) DEFAULT NULL,
  `missing_value` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of vital_signs
-- ----------------------------
INSERT INTO `vital_signs` VALUES ('1', 'body_temperatur', 'Body temperature', 'number', '1', null, '2022-11-28 18:37:59', '1', '1', '-1');
INSERT INTO `vital_signs` VALUES ('2', 'impulse_rate', 'Impulse rate', 'number', '1', null, '2022-11-28 18:37:38', '1', '1', '-1');
INSERT INTO `vital_signs` VALUES ('3', 'respiration_', 'Respiration Rate', 'number', '1', null, '2022-11-28 18:37:57', '1', '1', '-1');
INSERT INTO `vital_signs` VALUES ('4', 'Blood pressure', 'Blood pressure', 'number', '1', null, '2022-11-28 18:38:00', '1', '1', '-1');

-- ----------------------------
-- Table structure for `websockets_statistics_entries`
-- ----------------------------
DROP TABLE IF EXISTS `websockets_statistics_entries`;
CREATE TABLE `websockets_statistics_entries` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `app_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `peak_connection_count` int(11) NOT NULL,
  `websocket_message_count` int(11) NOT NULL,
  `api_message_count` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of websockets_statistics_entries
-- ----------------------------

-- ----------------------------
-- Function structure for `formatDate`
-- ----------------------------
DROP FUNCTION IF EXISTS `formatDate`;
DELIMITER ;;
CREATE   FUNCTION `formatDate`(mDate Date) RETURNS varchar(50) CHARSET utf8
BEGIN
  return DATE_FORMAT(mDate,'%d %b %Y');
END
;;
DELIMITER ;

-- ----------------------------
-- Function structure for `formatDateTime`
-- ----------------------------
DROP FUNCTION IF EXISTS `formatDateTime`;
DELIMITER ;;
CREATE   FUNCTION `formatDateTime`(mDate Date) RETURNS varchar(50) CHARSET utf8mb4
BEGIN
  return DATE_FORMAT(mDate,'%d %b %Y %r');
END
;;
DELIMITER ;

-- ----------------------------
-- Function structure for `formatTime`
-- ----------------------------
DROP FUNCTION IF EXISTS `formatTime`;
DELIMITER ;;
CREATE   FUNCTION `formatTime`(mDate Date) RETURNS varchar(30) CHARSET utf8
BEGIN
  return DATE_FORMAT(mDate,'%r');
END
;;
DELIMITER ;

-- ----------------------------
-- Function structure for `getApptStatus`
-- ----------------------------
DROP FUNCTION IF EXISTS `getApptStatus`;
DELIMITER ;;
CREATE   FUNCTION `getApptStatus`(status_id INT) RETURNS varchar(20) CHARSET utf8mb4
BEGIN
   declare ss varchar(20); 
   if(status_id=0) then
     set ss= 'Canceled';
   elseif (status_id =1) then
    set ss = 'Pending';
   elseif (status_id =2) then
    set ss='Served';
   else
     set ss='Pending';
   end if;
  return ss;
END
;;
DELIMITER ;

-- ----------------------------
-- Function structure for `getPatientCode`
-- ----------------------------
DROP FUNCTION IF EXISTS `getPatientCode`;
DELIMITER ;;
CREATE   FUNCTION `getPatientCode`(branchid INT,clientid INT) RETURNS varchar(30) CHARSET utf8mb4
begin
  DECLARE cc varchar(30); 
  set cc = (select `code` from patients as p where p.branch_id =branchid AND p.id =clientid LIMIT 1);
  return cc;
end
;;
DELIMITER ;

-- ----------------------------
-- Function structure for `hasPosition`
-- ----------------------------
DROP FUNCTION IF EXISTS `hasPosition`;
DELIMITER ;;
CREATE   FUNCTION `hasPosition`(empid INT,posid INT) RETURNS int(11)
BEGIN
  SET @d= (EXISTS(select id from employee_positions as e WHERE e.emp_id = empid AND e.position_id = posid LIMIT 1));
  RETURN @d;
END
;;
DELIMITER ;

-- ----------------------------
-- Function structure for `hasPositions`
-- ----------------------------
DROP FUNCTION IF EXISTS `hasPositions`;
DELIMITER ;;
CREATE   FUNCTION `hasPositions`(empid INT,posid INT) RETURNS int(11)
BEGIN
  SET @d= (EXISTS(select id from employee_positions as e WHERE e.emp_id = empid AND e.position_id = posid LIMIT 1));
  RETURN @d;
END
;;
DELIMITER ;
