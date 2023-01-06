/*
Navicat MySQL Data Transfer

Source Server         : connection1
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : mclinic_db

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2023-01-06 16:05:28
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `appointments`
-- ----------------------------
DROP TABLE IF EXISTS `appointments`;
CREATE TABLE `appointments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `branch_id` int(11) NOT NULL DEFAULT 1,
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
  `status_id` tinyint(6) DEFAULT 1 COMMENT '0=Canceled, 1= Pending, 2=Registered 3=Queued, 4=Served',
  `client_code` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `schedule_type` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT 'appointment_type = {followup,on demand}',
  `priority` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'priority ={urgent,normal}',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of appointments
-- ----------------------------
INSERT INTO `appointments` VALUES ('109', '1', '2', '2023-01-07', '2023-01-05 09:59:33', null, 'Chan Samnang', '012234324', null, null, '1', '48', null, '101', 'Samsethy', '1', '2023-01-05 09:57:40.000000', null, null, null, 'M', '3', '', 'On demand', 'Normal');
INSERT INTO `appointments` VALUES ('110', '1', '3', '2023-02-08', '2023-01-05 10:30:13', null, 'Dyna', '0124565464', 'info@vectorasoft.com', null, '0', '49', null, '102', 'Samsethy', '1', '2023-01-05 10:26:30.000000', null, null, null, 'F', '3', '', 'On demand', 'Normal');

-- ----------------------------
-- Table structure for `appt_chief_complaints`
-- ----------------------------
DROP TABLE IF EXISTS `appt_chief_complaints`;
CREATE TABLE `appt_chief_complaints` (
  `appt_id` int(10) DEFAULT NULL,
  `chief_complaint_id` int(10) NOT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `ticket_id` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of appt_chief_complaints
-- ----------------------------
INSERT INTO `appt_chief_complaints` VALUES ('35', '3', null, null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('35', '4', null, null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('35', '4', null, null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('26', '5', null, null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('26', '6', null, null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('11', '4', null, null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('26', '3', null, null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('26', '5', null, null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('11', '5', null, null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('11', '11', null, null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('48', '2', null, null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('48', '4', null, null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('52', '2', null, null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('52', '3', null, null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('64', '3', null, null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('64', '6', null, null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('64', '5', null, null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('57', '2', null, null, '2022-12-29 23:28:18.220609', '78');
INSERT INTO `appt_chief_complaints` VALUES ('57', '5', null, null, '2022-12-29 23:28:18.220609', '78');
INSERT INTO `appt_chief_complaints` VALUES ('59', '3', null, null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('59', '5', null, null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('53', '5', null, null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('65', '2', null, null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('65', '3', null, null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('67', '3', null, null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('67', '4', null, null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('69', '5', null, null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('55', '3', null, null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('55', '4', null, null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('60', '4', null, null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('74', '3', null, null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('74', '4', null, null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('88', '1', '1', 'Samsethy', '2022-12-10 20:47:04.000000', null);
INSERT INTO `appt_chief_complaints` VALUES ('88', '4', '1', 'Samsethy', '2022-12-10 20:47:04.000000', null);
INSERT INTO `appt_chief_complaints` VALUES ('89', '1', '1', 'Samsethy', '2022-12-10 20:47:36.000000', null);
INSERT INTO `appt_chief_complaints` VALUES ('89', '4', '1', 'Samsethy', '2022-12-10 20:47:36.000000', null);
INSERT INTO `appt_chief_complaints` VALUES ('90', '2', '1', 'Samsethy', '2022-12-11 11:36:05.000000', null);
INSERT INTO `appt_chief_complaints` VALUES ('91', '1', '1', 'Samsethy', '2022-12-11 11:45:38.000000', null);
INSERT INTO `appt_chief_complaints` VALUES ('92', '2', '1', 'Samsethy', '2022-12-11 19:52:33.411700', '74');
INSERT INTO `appt_chief_complaints` VALUES ('92', '4', '1', 'Samsethy', '2022-12-11 19:52:33.411700', '74');
INSERT INTO `appt_chief_complaints` VALUES (null, '3', '1', 'Samsethy', '2022-12-11 18:57:25.000000', '51');
INSERT INTO `appt_chief_complaints` VALUES (null, '5', '1', 'Samsethy', '2022-12-11 18:57:28.000000', '51');
INSERT INTO `appt_chief_complaints` VALUES (null, '3', '1', 'Samsethy', '2022-12-11 19:52:58.000000', '50');
INSERT INTO `appt_chief_complaints` VALUES ('95', '3', '1', 'Samsethy', '2022-12-16 14:10:32.753681', '76');
INSERT INTO `appt_chief_complaints` VALUES ('94', '3', null, null, '2022-12-17 09:37:50.103780', '77');
INSERT INTO `appt_chief_complaints` VALUES ('94', '4', null, null, '2022-12-17 09:37:50.103780', '77');
INSERT INTO `appt_chief_complaints` VALUES (null, '5', '1', 'Samsethy', '2023-01-02 16:21:09.000000', '52');
INSERT INTO `appt_chief_complaints` VALUES (null, '4', '1', 'Samsethy', '2023-01-02 22:04:50.000000', '52');
INSERT INTO `appt_chief_complaints` VALUES (null, '2', '1', 'Samsethy', '2023-01-02 22:07:00.000000', '53');
INSERT INTO `appt_chief_complaints` VALUES (null, '6', '1', 'Samsethy', '2023-01-02 22:07:05.000000', '53');
INSERT INTO `appt_chief_complaints` VALUES (null, '8', '1', 'Samsethy', '2023-01-02 22:07:24.000000', '53');
INSERT INTO `appt_chief_complaints` VALUES (null, '3', '1', 'Samsethy', '2023-01-02 22:08:24.000000', '52');
INSERT INTO `appt_chief_complaints` VALUES (null, '3', '1', 'Samsethy', '2023-01-02 23:53:19.000000', '81');
INSERT INTO `appt_chief_complaints` VALUES (null, '4', '1', 'Samsethy', '2023-01-02 23:53:23.000000', '81');
INSERT INTO `appt_chief_complaints` VALUES (null, '3', '1', 'Samsethy', '2023-01-03 17:19:03.000000', '80');
INSERT INTO `appt_chief_complaints` VALUES (null, '5', '1', 'Samsethy', '2023-01-03 17:19:07.000000', '80');
INSERT INTO `appt_chief_complaints` VALUES ('110', '3', null, null, '2023-01-05 10:30:13.477516', '88');
INSERT INTO `appt_chief_complaints` VALUES ('110', '4', null, null, '2023-01-05 10:30:13.477516', '88');

-- ----------------------------
-- Table structure for `appt_statuses`
-- ----------------------------
DROP TABLE IF EXISTS `appt_statuses`;
CREATE TABLE `appt_statuses` (
  `id` int(10) NOT NULL,
  `branch_id` int(10) NOT NULL,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of appt_statuses
-- ----------------------------
INSERT INTO `appt_statuses` VALUES ('-1', '1', 'Canceled');
INSERT INTO `appt_statuses` VALUES ('1', '1', 'Pending');
INSERT INTO `appt_statuses` VALUES ('2', '1', 'Registered');
INSERT INTO `appt_statuses` VALUES ('3', '1', 'Queued');
INSERT INTO `appt_statuses` VALUES ('4', '1', 'Served');

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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4;

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
INSERT INTO `chief_complaints` VALUES ('13', '1', 'ggghh', '13', '2022-12-08 09:25:57.718674', 'Samsethy', '1', null, null, '2022-12-08 09:25:57.718674', null);
INSERT INTO `chief_complaints` VALUES ('14', '1', 'dgsdfgdfhf', '14', '2022-12-08 09:36:42.284727', 'Samsethy', '1', null, null, '2022-12-08 09:36:42.284727', null);

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
INSERT INTO `departments` VALUES ('2', '1', '0', 'Dermatology', null, 'Admin', '1', null, null, '2022-12-03 19:03:52', null);
INSERT INTO `departments` VALUES ('3', '1', '0', 'Plastic Surgery', null, 'Admin', '1', null, null, '2022-12-03 19:04:03', null);

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
INSERT INTO `employees` VALUES ('1', '1', '1', '11111', '2', '1', 'full time', '0.00', 'USD', '1', '0', null, null, '2022-12-03 18:02:35', null);
INSERT INTO `employees` VALUES ('2', '1', '2', '22222', '3', '1', 'full time', '0.00', 'USD', '1', '0', null, null, '2022-12-03 19:36:33', null);

-- ----------------------------
-- Table structure for `employee_positions`
-- ----------------------------
DROP TABLE IF EXISTS `employee_positions`;
CREATE TABLE `employee_positions` (
  `emp_id` int(10) NOT NULL,
  `position_id` int(10) NOT NULL,
  `status` varchar(15) NOT NULL DEFAULT 'Active',
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
INSERT INTO `employee_positions` VALUES ('1', '2', 'Active', '2022-12-03 19:37:03.746133', '2022-12-03 19:37:03.746133', null, null, null, null);
INSERT INTO `employee_positions` VALUES ('2', '3', 'Active', '2022-12-03 19:37:04.306061', '2022-12-03 19:37:04.306061', null, null, null, null);

-- ----------------------------
-- Table structure for `inv_adjustment_types`
-- ----------------------------
DROP TABLE IF EXISTS `inv_adjustment_types`;
CREATE TABLE `inv_adjustment_types` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(250) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `stock_class_id` int(10) DEFAULT NULL,
  `warehouse_id` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_adjustment_types
-- ----------------------------
INSERT INTO `inv_adjustment_types` VALUES ('1', '1', 'Missing', 'Missing', null, null, '2022-12-02 10:38:09.982458', null, null, '2022-12-02 10:38:09.982458', null, '0');
INSERT INTO `inv_adjustment_types` VALUES ('2', '1', 'shrinkage', 'shrinkage', null, null, '2022-12-02 10:37:20.193295', null, null, '2022-12-02 10:37:20.193295', null, '0');
INSERT INTO `inv_adjustment_types` VALUES ('3', '1', 'broken', 'broken', null, null, null, null, null, null, null, '0');
INSERT INTO `inv_adjustment_types` VALUES ('4', '1', 'Theft', 'Theft', null, null, null, null, null, null, null, '0');

-- ----------------------------
-- Table structure for `inv_available_stocks`
-- ----------------------------
DROP TABLE IF EXISTS `inv_available_stocks`;
CREATE TABLE `inv_available_stocks` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `item_id` int(10) NOT NULL,
  `variance_id` int(10) NOT NULL,
  `item_code` varchar(25) NOT NULL,
  `available_qty` decimal(10,2) NOT NULL DEFAULT 0.00,
  `create_uid` int(10) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `sku` int(10) NOT NULL,
  `last_count_date` date NOT NULL,
  `stock_class_id` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_available_stocks
-- ----------------------------

-- ----------------------------
-- Table structure for `inv_brands`
-- ----------------------------
DROP TABLE IF EXISTS `inv_brands`;
CREATE TABLE `inv_brands` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `branch_id` int(10) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_user` varchar(50) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `name_kh` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=123 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_brands
-- ----------------------------
INSERT INTO `inv_brands` VALUES ('107', 'ab', '1', '2022-12-03 12:05:09.000000', 'Samsethy', '1', null, null, null, 'ab');
INSERT INTO `inv_brands` VALUES ('108', 'dicta', '1', '2022-12-03 12:06:17.000000', 'Samsethy', '1', null, null, null, 'dicta');
INSERT INTO `inv_brands` VALUES ('109', 'aut', '1', '2022-12-03 12:06:41.000000', 'Samsethy', '1', null, null, null, 'aut');
INSERT INTO `inv_brands` VALUES ('110', 'rerum', '1', '2022-12-03 12:09:52.000000', 'Samsethy', '1', null, null, null, 'rerum');
INSERT INTO `inv_brands` VALUES ('111', 'mollitia', '1', '2022-12-03 12:23:28.000000', 'Samsethy', '1', null, null, null, 'mollitia');
INSERT INTO `inv_brands` VALUES ('112', 'aut', '1', '2022-12-03 12:24:41.000000', 'Samsethy', '1', null, null, null, 'aut');
INSERT INTO `inv_brands` VALUES ('113', 'laborum', '1', '2022-12-03 12:24:51.000000', 'Samsethy', '1', null, null, null, 'laborum');
INSERT INTO `inv_brands` VALUES ('114', 'quas', '1', '2022-12-03 12:26:37.000000', 'Samsethy', '1', null, null, null, 'quas');
INSERT INTO `inv_brands` VALUES ('115', 'omnis', '1', '2022-12-03 12:27:09.000000', 'Samsethy', '1', null, null, null, 'omnis');
INSERT INTO `inv_brands` VALUES ('116', 'recusandae', '1', '2022-12-03 12:28:47.000000', 'Samsethy', '1', null, null, null, 'recusandae');
INSERT INTO `inv_brands` VALUES ('117', 'minus', '1', '2022-12-03 12:31:27.000000', 'Samsethy', '1', null, null, null, 'minus');
INSERT INTO `inv_brands` VALUES ('118', 'ratione', '1', '2022-12-03 12:38:08.000000', 'Samsethy', '1', null, null, null, 'ratione');
INSERT INTO `inv_brands` VALUES ('119', 'ducimus', '1', '2022-12-03 12:38:43.000000', 'Samsethy', '1', null, null, null, 'ducimus');
INSERT INTO `inv_brands` VALUES ('120', 'illum', '1', '2022-12-07 09:56:45.000000', 'Samsethy', '1', null, null, null, 'illum');
INSERT INTO `inv_brands` VALUES ('121', 'Vectorasoft', null, '2023-01-06 15:53:36.000000', 'Samsethy', '1', null, null, null, 'Vectorasoft');
INSERT INTO `inv_brands` VALUES ('122', 'Vectorasoft', null, '2023-01-06 15:56:58.000000', 'Samsethy', '1', null, null, null, 'Vectorasoft');

-- ----------------------------
-- Table structure for `inv_countries`
-- ----------------------------
DROP TABLE IF EXISTS `inv_countries`;
CREATE TABLE `inv_countries` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `country_name` varchar(100) NOT NULL,
  `country_id` int(10) NOT NULL,
  `branch_id` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_countries
-- ----------------------------

-- ----------------------------
-- Table structure for `inv_finished_goods`
-- ----------------------------
DROP TABLE IF EXISTS `inv_finished_goods`;
CREATE TABLE `inv_finished_goods` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `category_id` int(10) NOT NULL,
  `cost` decimal(10,2) NOT NULL,
  `selling_price` decimal(10,2) NOT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_user` varchar(50) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_finished_goods
-- ----------------------------

-- ----------------------------
-- Table structure for `inv_items`
-- ----------------------------
DROP TABLE IF EXISTS `inv_items`;
CREATE TABLE `inv_items` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) DEFAULT NULL,
  `code` varchar(25) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `commercial_name` varchar(50) DEFAULT NULL,
  `description` varchar(250) DEFAULT NULL,
  `category_id` int(10) DEFAULT NULL,
  `group_id` int(10) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `loc_block_code` varchar(25) DEFAULT NULL,
  `loc_shelf_code` varchar(25) DEFAULT NULL,
  `warehouse_id` int(10) DEFAULT NULL COMMENT 'optional default warehouse',
  `unit_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=512 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_items
-- ----------------------------
INSERT INTO `inv_items` VALUES ('1', '1', 'TP0066', 'Bioselenium Shampoo 100ml', 'Bioselenium Shampoo 100ml', 'Bioselenium Shampoo 100ml', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('2', '1', 'TP0002', 'Fixderma Moisturizing Cream', 'Fixderma Moisturizing Cream', 'Fixderma Moisturizing Cream', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('3', '1', 'TP0003', 'Tidact gel', 'Tidact gel', 'Tidact gel', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('4', '1', 'TP0001', 'Tacroz', 'Tacroz', 'Tacroz', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('5', '1', 'TP0004', 'Disut-H Cream 15g', 'Disut-H Cream 15g', 'Disut-H Cream 15g', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('6', '1', 'TP0005', 'Tacopic 0.1%', 'Tacopic 0.1%', 'Tacopic 0.1%', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('7', '1', 'TP0006', 'Disuf-B cream 15g', 'Disuf-B cream 15g', 'Disuf-B cream 15g', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('8', '1', 'TP0007', 'Candid-B Cream', 'Candid-B Cream', 'Candid-B Cream', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('9', '1', 'TP0008', 'Candid Cream', 'Candid Cream', 'Candid Cream', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('10', '1', 'TP0009', 'Elosone Cream', 'Elosone Cream', 'Elosone Cream', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('11', '1', 'TP0010', 'Cloderm Cream 15g', 'Cloderm Cream 15g', 'Cloderm Cream 15g', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('12', '1', 'TP0011', 'Beprosalic Ointment ', 'Beprosalic Ointment ', 'Beprosalic Ointment ', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('13', '1', 'TP0012', 'Rozex gel 50g', 'Rozex gel 50g', 'Rozex gel 50g', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('14', '1', 'TP0013', 'Beprogel Lotion 30ml', 'Beprogel Lotion 30ml', 'Beprogel Lotion 30ml', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('15', '1', 'TP0014', 'Virest Cream', 'Virest Cream', 'Virest Cream', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('16', '1', 'TP0015', 'H-cort Cream', 'H-cort Cream', 'H-cort Cream', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('17', '1', 'TP0016', 'Ecocort Cream', 'Ecocort Cream', 'Ecocort Cream', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('18', '1', 'TP0017', 'Disuf Cream', 'Disuf Cream', 'Disuf Cream', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('19', '1', 'TP0018', 'Supirocine Ointment 5g', 'Supirocine Ointment 5g', 'Supirocine Ointment 5g', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('20', '1', 'TP0019', 'Akne-Derm 5% Cream', 'Akne-Derm 5% Cream', 'Akne-Derm 5% Cream', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('21', '1', 'TP0020', 'Diprosalic Pommade', 'Diprosalic Pommade', 'Diprosalic Pommade', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('22', '1', 'TP0021', 'Neutriderm Moisturizing Lotion 125ml', 'Neutriderm Moisturizing Lotion 125ml', 'Neutriderm Moisturizing Lotion 125ml', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('23', '1', 'TP0022', 'Dermavive Nappy Rash Cream', 'Dermavive Nappy Rash Cream', 'Dermavive Nappy Rash Cream', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('24', '1', 'TP0023', 'Fixderma Moisturizing Lotion', 'Fixderma Moisturizing Lotion', 'Fixderma Moisturizing Lotion', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('25', '1', 'EP0001', 'Serum physiodose 5ml', 'Serum physiodose 5ml', 'Serum physiodose 5ml', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('26', '1', 'OM0001', 'Prednisolone', 'Prednisolone', 'Prednisolone', null, '2', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '4');
INSERT INTO `inv_items` VALUES ('27', '1', 'OM0002', 'Acnotin', 'Acnotin', 'Acnotin', null, '2', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '4');
INSERT INTO `inv_items` VALUES ('28', '1', 'OM0003', 'Doxycycline cap 100mg', 'Doxycycline cap 100mg', 'Doxycycline cap 100mg', null, '2', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '4');
INSERT INTO `inv_items` VALUES ('29', '1', 'OM0004', 'Promethazine 25mg', 'Promethazine 25mg', 'Promethazine 25mg', null, '2', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '4');
INSERT INTO `inv_items` VALUES ('30', '1', 'EP0002', 'Syringe 3ml Vinahankook B/100P', 'Syringe 3ml Vinahankook B/100P', 'Syringe 3ml Vinahankook B/100P', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('31', '1', 'EP0003', 'Syringe 1ml Vinahankook B/100P', 'Syringe 1ml Vinahankook B/100P', 'Syringe 1ml Vinahankook B/100P', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('32', '1', 'EP0004', 'Syringe 5ml-25G Vinahankook B/100P', 'Syringe 5ml-25G Vinahankook B/100P', 'Syringe 5ml-25G Vinahankook B/100P', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('33', '1', 'EP0005', 'Syringe 10ml Vinahankook B/100P', 'Syringe 10ml Vinahankook B/100P', 'Syringe 10ml Vinahankook B/100P', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('34', '1', 'EP0006', 'Glove Sterile 7.0', 'Glove Sterile 7.0', 'Glove Sterile 7.0', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '5');
INSERT INTO `inv_items` VALUES ('35', '1', 'IN0001', 'Nss 500ml China ', 'Nss 500ml China ', 'Nss 500ml China ', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('36', '1', 'EP0007', 'Compress Sterile 20*20cm', 'Compress Sterile 20*20cm', 'Compress Sterile 20*20cm', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '6');
INSERT INTO `inv_items` VALUES ('37', '1', 'EP0008', 'Catheter 18G-Healflon IND(100/BOX)', 'Catheter 18G-Healflon IND(100/BOX)', 'Catheter 18G-Healflon IND(100/BOX)', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '7');
INSERT INTO `inv_items` VALUES ('38', '1', 'EP0009', 'Catheter 24G-Healflon B/100unit', 'Catheter 24G-Healflon B/100unit', 'Catheter 24G-Healflon B/100unit', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '7');
INSERT INTO `inv_items` VALUES ('39', '1', 'EP0010', 'Nipro Catherter24G*3/4 B/50 ', 'Nipro Catherter24G*3/4 B/50 ', 'Nipro Catherter24G*3/4 B/50 ', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '7');
INSERT INTO `inv_items` VALUES ('40', '1', 'EP0011', 'Trouss china(R, orange color) P/25', 'Trouss china(R, orange color) P/25', 'Trouss china(R, orange color) P/25', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '6');
INSERT INTO `inv_items` VALUES ('41', '1', 'EP0012', 'Nipro Needle 18G B/100', 'Nipro Needle 18G B/100', 'Nipro Needle 18G B/100', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '7');
INSERT INTO `inv_items` VALUES ('42', '1', 'EP0013', 'Nipro Needle 21G B/100', 'Nipro Needle 21G B/100', 'Nipro Needle 21G B/100', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '7');
INSERT INTO `inv_items` VALUES ('43', '1', 'EP0014', 'Nipro Needle 30G B/100', 'Nipro Needle 30G B/100', 'Nipro Needle 30G B/100', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '7');
INSERT INTO `inv_items` VALUES ('44', '1', 'EP0015', 'Scalp Vein set24 B/50', 'Scalp Vein set24 B/50', 'Scalp Vein set24 B/50', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '7');
INSERT INTO `inv_items` VALUES ('45', '1', 'EP0016', 'Betadine dermique 125ml 10%Fr ', 'Betadine dermique 125ml 10%Fr ', 'Betadine dermique 125ml 10%Fr ', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('46', '1', 'EP0017', 'Wellgard no powder size S ', 'Wellgard no powder size S ', 'Wellgard no powder size S ', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '7');
INSERT INTO `inv_items` VALUES ('47', '1', 'EP0018', 'Wellgard no powder size M', 'Wellgard no powder size M', 'Wellgard no powder size M', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '7');
INSERT INTO `inv_items` VALUES ('48', '1', 'EP0019', 'Safety box 5L', 'Safety box 5L', 'Safety box 5L', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '7');
INSERT INTO `inv_items` VALUES ('49', '1', 'EP0020', 'Vaseline Petrolatum Gauze B/10', 'Vaseline Petrolatum Gauze B/10', 'Vaseline Petrolatum Gauze B/10', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '7');
INSERT INTO `inv_items` VALUES ('50', '1', 'EP0021', 'Innoplastic B/100', 'Innoplastic B/100', 'Innoplastic B/100', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '7');
INSERT INTO `inv_items` VALUES ('51', '1', 'EP0022', 'CRL-aperture adhesive plaster 18cm*4cm', 'CRL-aperture adhesive plaster 18cm*4cm', 'CRL-aperture adhesive plaster 18cm*4cm', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '7');
INSERT INTO `inv_items` VALUES ('52', '1', 'EP0023', 'Adhesive plaster with holes', 'Adhesive plaster with holes', 'Adhesive plaster with holes', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '7');
INSERT INTO `inv_items` VALUES ('53', '1', 'EP0024', 'Vaseline pet jelly orig 100ml/fl', 'Vaseline pet jelly orig 100ml/fl', 'Vaseline pet jelly orig 100ml/fl', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('54', '1', 'EP0025', 'Needle dermapen VIP 42 ', 'Needle dermapen VIP 42 ', 'Needle dermapen VIP 42 ', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '7');
INSERT INTO `inv_items` VALUES ('55', '1', 'IN0002', 'Prednisolone USA 1FL', 'Prednisolone USA 1FL', 'Prednisolone USA 1FL', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('56', '1', 'TP0067', 'KTC Scalp solution', 'KTC Scalp solution', 'KTC Scalp solution', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('57', '1', 'OM0005', 'Neocilor ', 'Neocilor ', 'Neocilor ', null, '2', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '4');
INSERT INTO `inv_items` VALUES ('58', '1', 'OM0006', 'Telfast Hd 180mg', 'Telfast Hd 180mg', 'Telfast Hd 180mg', null, '2', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '4');
INSERT INTO `inv_items` VALUES ('59', '1', 'OM0007', 'Atarax 25mg', 'Atarax 25mg', 'Atarax 25mg', null, '2', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '4');
INSERT INTO `inv_items` VALUES ('60', '1', 'OM0008', 'Cloxacap 500mg', 'Cloxacap 500mg', 'Cloxacap 500mg', null, '2', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '4');
INSERT INTO `inv_items` VALUES ('61', '1', 'OM0009', 'Terbinaforce 250mg', 'Terbinaforce 250mg', 'Terbinaforce 250mg', null, '2', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '4');
INSERT INTO `inv_items` VALUES ('62', '1', 'OM0010', 'Inox 100mg', 'Inox 100mg', 'Inox 100mg', null, '2', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '4');
INSERT INTO `inv_items` VALUES ('63', '1', 'OM0011', 'Zithrosun-250', 'Zithrosun-250', 'Zithrosun-250', null, '2', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '4');
INSERT INTO `inv_items` VALUES ('64', '1', 'OM0012', 'Augmentin 625mg', 'Augmentin 625mg', 'Augmentin 625mg', null, '2', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '4');
INSERT INTO `inv_items` VALUES ('65', '1', 'OM0013', 'Codalgin Forte 500', 'Codalgin Forte 500', 'Codalgin Forte 500', null, '2', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '4');
INSERT INTO `inv_items` VALUES ('66', '1', 'OM0014', 'Alpha Choay 4.15mg', 'Alpha Choay 4.15mg', 'Alpha Choay 4.15mg', null, '2', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '4');
INSERT INTO `inv_items` VALUES ('67', '1', 'OM0015', 'Esome 40mg', 'Esome 40mg', 'Esome 40mg', null, '2', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '4');
INSERT INTO `inv_items` VALUES ('68', '1', 'TP0025', 'Deriva MS gel 15g', 'Deriva MS gel 15g', 'Deriva MS gel 15g', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('69', '1', 'IN0003', 'Medi-Ceftriaxone inj', 'Medi-Ceftriaxone inj', 'Medi-Ceftriaxone inj', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '8');
INSERT INTO `inv_items` VALUES ('70', '1', 'IN0004', 'Clavox 1.2g IV', 'Clavox 1.2g IV', 'Clavox 1.2g IV', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '9');
INSERT INTO `inv_items` VALUES ('71', '1', 'IN0005', 'Lidocaine 2% 50ml', 'Lidocaine 2% 50ml', 'Lidocaine 2% 50ml', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '9');
INSERT INTO `inv_items` VALUES ('72', '1', 'IN0006', 'Tanganil 500mg/5ml IV', 'Tanganil 500mg/5ml IV', 'Tanganil 500mg/5ml IV', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '10');
INSERT INTO `inv_items` VALUES ('73', '1', 'IN0007', 'Met-Sil 2ml', 'Met-Sil 2ml', 'Met-Sil 2ml', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '10');
INSERT INTO `inv_items` VALUES ('74', '1', 'IN0008', 'Para Kabi 1000mg/100ml', 'Para Kabi 1000mg/100ml', 'Para Kabi 1000mg/100ml', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('75', '1', 'IN0009', 'Anadol Inj 100mg/2ml', 'Anadol Inj 100mg/2ml', 'Anadol Inj 100mg/2ml', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '10');
INSERT INTO `inv_items` VALUES ('76', '1', 'IN0010', 'Remopain 3% Inj', 'Remopain 3% Inj', 'Remopain 3% Inj', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '10');
INSERT INTO `inv_items` VALUES ('77', '1', 'IN0011', 'Adrenaline Inj 1ml', 'Adrenaline Inj 1ml', 'Adrenaline Inj 1ml', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '10');
INSERT INTO `inv_items` VALUES ('78', '1', 'IN0012', 'Dexamedico inj', 'Dexamedico inj', 'Dexamedico inj', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '10');
INSERT INTO `inv_items` VALUES ('79', '1', 'IN0013', 'Genta inj-uto', 'Genta inj-uto', 'Genta inj-uto', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '10');
INSERT INTO `inv_items` VALUES ('80', '1', 'IN0014', 'Hydromark-100', 'Hydromark-100', 'Hydromark-100', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '8');
INSERT INTO `inv_items` VALUES ('81', '1', 'IN0015', 'VIK 1-vitamin K1 inj 10mg/1ml', 'VIK 1-vitamin K1 inj 10mg/1ml', 'VIK 1-vitamin K1 inj 10mg/1ml', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '10');
INSERT INTO `inv_items` VALUES ('82', '1', 'IN0016', 'Onasia', 'Onasia', 'Onasia', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '10');
INSERT INTO `inv_items` VALUES ('83', '1', 'IN0017', 'Exacyl inj', 'Exacyl inj', 'Exacyl inj', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '10');
INSERT INTO `inv_items` VALUES ('84', '1', 'TP0026', 'Effaclar Duo(+) 40ml', 'Effaclar Duo(+) 40ml', 'Effaclar Duo(+) 40ml', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('85', '1', 'TP0027', 'Anthelios Anti-shine', 'Anthelios Anti-shine', 'Anthelios Anti-shine', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('86', '1', 'TP0028', 'Anthelios Fluid invisible', 'Anthelios Fluid invisible', 'Anthelios Fluid invisible', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('87', '1', 'TP0029', 'Cicaplast gel B5 40ml', 'Cicaplast gel B5 40ml', 'Cicaplast gel B5 40ml', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('88', '1', 'TP0030', 'Cicaplast Baume B5 100ml', 'Cicaplast Baume B5 100ml', 'Cicaplast Baume B5 100ml', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('89', '1', 'TP0031', 'Water Max Milk Cleanser 1200ml', 'Water Max Milk Cleanser 1200ml', 'Water Max Milk Cleanser 1200ml', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '7');
INSERT INTO `inv_items` VALUES ('90', '1', 'TP0032', 'Counteractive Bubble Clear 150ml', 'Counteractive Bubble Clear 150ml', 'Counteractive Bubble Clear 150ml', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('91', '1', 'TP0033', 'Alpha Cleansing Foam 1200ml', 'Alpha Cleansing Foam 1200ml', 'Alpha Cleansing Foam 1200ml', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('92', '1', 'TP0034', 'Peppermint Cool plus modeling mask 1kg', 'Peppermint Cool plus modeling mask 1kg', 'Peppermint Cool plus modeling mask 1kg', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '6');
INSERT INTO `inv_items` VALUES ('93', '1', 'TP0035', 'Gold Plus Modeling mask 1kg', 'Gold Plus Modeling mask 1kg', 'Gold Plus Modeling mask 1kg', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '6');
INSERT INTO `inv_items` VALUES ('94', '1', 'TP0036', 'Marine Aqua Plus Modeling mask 1kg', 'Marine Aqua Plus Modeling mask 1kg', 'Marine Aqua Plus Modeling mask 1kg', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '6');
INSERT INTO `inv_items` VALUES ('95', '1', 'TP0037', 'Azulene Complex Ampoule 72 150ml', 'Azulene Complex Ampoule 72 150ml', 'Azulene Complex Ampoule 72 150ml', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('96', '1', 'TP0038', 'EGF Complex Ampoule 50 150ml', 'EGF Complex Ampoule 50 150ml', 'EGF Complex Ampoule 50 150ml', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('97', '1', 'TP0039', 'Hyaluron Complex Ampoule 62 150ml', 'Hyaluron Complex Ampoule 62 150ml', 'Hyaluron Complex Ampoule 62 150ml', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('98', '1', 'TP0040', 'History Conductive Gel 500ml ', 'History Conductive Gel 500ml ', 'History Conductive Gel 500ml ', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '7');
INSERT INTO `inv_items` VALUES ('99', '1', 'TP0041', 'Histo HQ Cream 1000ml', 'Histo HQ Cream 1000ml', 'Histo HQ Cream 1000ml', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '7');
INSERT INTO `inv_items` VALUES ('100', '1', 'TP0042', 'Histo Aloe Vera gel 1200ml', 'Histo Aloe Vera gel 1200ml', 'Histo Aloe Vera gel 1200ml', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('101', '1', 'TP0043', 'Gamma Crystal Serum 500ml', 'Gamma Crystal Serum 500ml', 'Gamma Crystal Serum 500ml', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('102', '1', 'TP0044', 'Beta Fresh toner 1200ml', 'Beta Fresh toner 1200ml', 'Beta Fresh toner 1200ml', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('103', '1', 'TP0045', 'Premium renewal Essence 500ml', 'Premium renewal Essence 500ml', 'Premium renewal Essence 500ml', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('104', '1', 'TP0046', 'Premium Timeless Cream 250g', 'Premium Timeless Cream 250g', 'Premium Timeless Cream 250g', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '7');
INSERT INTO `inv_items` VALUES ('105', '1', 'TP0047', 'Premium Eye Cream 250g', 'Premium Eye Cream 250g', 'Premium Eye Cream 250g', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '7');
INSERT INTO `inv_items` VALUES ('106', '1', 'TP0048', 'Whiteness Lightening Serum 80ml', 'Whiteness Lightening Serum 80ml', 'Whiteness Lightening Serum 80ml', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('107', '1', 'TP0049', 'Triangle Peel PA 80ml', 'Triangle Peel PA 80ml', 'Triangle Peel PA 80ml', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('108', '1', 'TP0050', 'Triangle Peel PB 80ml', 'Triangle Peel PB 80ml', 'Triangle Peel PB 80ml', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('109', '1', 'TP0051', 'Delta Active Cream 500ml', 'Delta Active Cream 500ml', 'Delta Active Cream 500ml', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '7');
INSERT INTO `inv_items` VALUES ('110', '1', 'TP0052', 'Glycolic Skin Peel 70% 480ml', 'Glycolic Skin Peel 70% 480ml', 'Glycolic Skin Peel 70% 480ml', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('111', '1', 'TP0053', 'Lactic acid Peel 70% 480ml', 'Lactic acid Peel 70% 480ml', 'Lactic acid Peel 70% 480ml', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('112', '1', 'TP0054', 'Combination Peel 240ml', 'Combination Peel 240ml', 'Combination Peel 240ml', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('113', '1', 'TP0055', 'Salicylic Peel 30% 120ml', 'Salicylic Peel 30% 120ml', 'Salicylic Peel 30% 120ml', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('114', '1', 'TP0056', 'Ice Jeju Aloe 300ml(Thefaceshop)', 'Ice Jeju Aloe 300ml(Thefaceshop)', 'Ice Jeju Aloe 300ml(Thefaceshop)', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '7');
INSERT INTO `inv_items` VALUES ('115', '1', 'TP0057', 'Aloe 99% 300ml(Thefaceshop)', 'Aloe 99% 300ml(Thefaceshop)', 'Aloe 99% 300ml(Thefaceshop)', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '7');
INSERT INTO `inv_items` VALUES ('116', '1', 'TP0058', 'Smart Peeling Honey Scrub (thefaceshop)', 'Smart Peeling Honey Scrub (thefaceshop)', 'Smart Peeling Honey Scrub (thefaceshop)', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('117', '1', 'TP0059', 'Smart Peeling white jewel', 'Smart Peeling white jewel', 'Smart Peeling white jewel', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('118', '1', 'EP0026', 'Centrifuge Virtuose', 'Centrifuge Virtuose', 'Centrifuge Virtuose', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '7');
INSERT INTO `inv_items` VALUES ('119', '1', 'EP0027', 'PRP tube 9ml Virtuose', 'PRP tube 9ml Virtuose', 'PRP tube 9ml Virtuose', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('120', '1', 'EP0028', 'Dermapen A6', 'Dermapen A6', 'Dermapen A6', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '7');
INSERT INTO `inv_items` VALUES ('121', '1', 'EP0029', 'Needle Dermapen A6 nano', 'Needle Dermapen A6 nano', 'Needle Dermapen A6 nano', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '6');
INSERT INTO `inv_items` VALUES ('122', '1', 'EP0030', 'Needle Dermapen A6 42', 'Needle Dermapen A6 42', 'Needle Dermapen A6 42', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '6');
INSERT INTO `inv_items` VALUES ('123', '1', 'EP0031', 'Skin marker', 'Skin marker', 'Skin marker', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '6');
INSERT INTO `inv_items` VALUES ('124', '1', 'EP0032', 'Cotton Facial pad', 'Cotton Facial pad', 'Cotton Facial pad', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '6');
INSERT INTO `inv_items` VALUES ('125', '1', 'EP0033', 'Acne extraction', 'Acne extraction', 'Acne extraction', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '6');
INSERT INTO `inv_items` VALUES ('126', '1', 'EP0034', 'Cautery ', 'Cautery ', 'Cautery ', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '6');
INSERT INTO `inv_items` VALUES ('127', '1', 'EP0035', '???? Peel', '???? Peel', '???? Peel', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '6');
INSERT INTO `inv_items` VALUES ('128', '1', 'IN0018', 'Meso GTM Gold cell PDRN8% (Box/10 3,3ml)', 'Meso GTM Gold cell PDRN8% (Box/10 3,3ml)', 'Meso GTM Gold cell PDRN8% (Box/10 3,3ml)', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('129', '1', 'IN0019', 'Meso Restructurer Innoaesthetic (B/4 5ml)', 'Meso Restructurer Innoaesthetic (B/4 5ml)', 'Meso Restructurer Innoaesthetic (B/4 5ml)', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('130', '1', 'IN0020', 'Meso Redness ID innoaethetic (B/4 2.5ml)', 'Meso Redness ID innoaethetic (B/4 2.5ml)', 'Meso Redness ID innoaethetic (B/4 2.5ml)', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('131', '1', 'IN0021', 'Meso Melatocin Essence Melasma (B/10 5ml)', 'Meso Melatocin Essence Melasma (B/10 5ml)', 'Meso Melatocin Essence Melasma (B/10 5ml)', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('132', '1', 'IN0022', 'Meso GTM mela cell 3% melasma (B/10 3,5ml)', 'Meso GTM mela cell 3% melasma (B/10 3,5ml)', 'Meso GTM mela cell 3% melasma (B/10 3,5ml)', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('133', '1', 'IN0023', 'Placenta Melsmon 2ml ', 'Placenta Melsmon 2ml ', 'Placenta Melsmon 2ml ', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '10');
INSERT INTO `inv_items` VALUES ('134', '1', 'IN0024', 'Placenta Lannec 2ml', 'Placenta Lannec 2ml', 'Placenta Lannec 2ml', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '10');
INSERT INTO `inv_items` VALUES ('135', '1', 'IN0025', 'Botulax 100UI ', 'Botulax 100UI ', 'Botulax 100UI ', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('136', '1', 'IN0027', 'AMC Slimming Drip', 'AMC Slimming Drip', 'AMC Slimming Drip', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '5');
INSERT INTO `inv_items` VALUES ('137', '1', 'IN0026', 'Japan Whitening Drip', 'Japan Whitening Drip', 'Japan Whitening Drip', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '5');
INSERT INTO `inv_items` VALUES ('138', '1', 'EP0036', 'Meso Multi Needle', 'Meso Multi Needle', 'Meso Multi Needle', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '6');
INSERT INTO `inv_items` VALUES ('139', '1', 'IN0028', 'Sivkoit (Triamcinolone) 80mg', 'Sivkoit (Triamcinolone) 80mg', 'Sivkoit (Triamcinolone) 80mg', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '10');
INSERT INTO `inv_items` VALUES ('140', '1', 'IN0029', 'Para Inj 300mg ', 'Para Inj 300mg ', 'Para Inj 300mg ', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '10');
INSERT INTO `inv_items` VALUES ('141', '1', 'IN0030', 'NSS 100ml Thai', 'NSS 100ml Thai', 'NSS 100ml Thai', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '9');
INSERT INTO `inv_items` VALUES ('142', '1', 'IN0031', 'NSS 500ml Thai', 'NSS 500ml Thai', 'NSS 500ml Thai', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '9');
INSERT INTO `inv_items` VALUES ('143', '1', 'EP0037', 'Surgical cap', 'Surgical cap', 'Surgical cap', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '6');
INSERT INTO `inv_items` VALUES ('144', '1', 'TP0060', 'Skinoren Cream 30g', 'Skinoren Cream 30g', 'Skinoren Cream 30g', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('145', '1', 'TP0061', 'Skarfix-TX cream', 'Skarfix-TX cream', 'Skarfix-TX cream', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('146', '1', 'TP0062', 'Isis Teen Derm gel sensitive 100ml', 'Isis Teen Derm gel sensitive 100ml', 'Isis Teen Derm gel sensitive 100ml', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('147', '1', 'TP0063', 'Isis Neotone Gel 150ml', 'Isis Neotone Gel 150ml', 'Isis Neotone Gel 150ml', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('148', '1', 'TP0064', 'Isis Ruboril Expert S', 'Isis Ruboril Expert S', 'Isis Ruboril Expert S', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('149', '1', 'TP0065', 'Isis Aqua Ruboril 250ml', 'Isis Aqua Ruboril 250ml', 'Isis Aqua Ruboril 250ml', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('150', '1', 'IN0032', 'NSS 250ml korea', 'NSS 250ml korea', 'NSS 250ml korea', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '9');
INSERT INTO `inv_items` VALUES ('151', '1', 'IN0033', 'Neuramis gold', 'Neuramis gold', 'Neuramis gold', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '7');
INSERT INTO `inv_items` VALUES ('152', '1', 'EP0038', 'Needle 30G 4mm', 'Needle 30G 4mm', 'Needle 30G 4mm', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '11');
INSERT INTO `inv_items` VALUES ('153', '1', 'IN0034', 'D5W Thai 500ml', 'D5W Thai 500ml', 'D5W Thai 500ml', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '9');
INSERT INTO `inv_items` VALUES ('154', '1', 'IN0035', 'Lactate Thai 500ml', 'Lactate Thai 500ml', 'Lactate Thai 500ml', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '9');
INSERT INTO `inv_items` VALUES ('155', '1', 'IN0036', 'D10W Thai ', 'D10W Thai ', 'D10W Thai ', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '9');
INSERT INTO `inv_items` VALUES ('156', '1', 'EP0039', 'Glove Sterile 6.5', 'Glove Sterile 6.5', 'Glove Sterile 6.5', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '6');
INSERT INTO `inv_items` VALUES ('157', '1', 'EP0040', 'Nipro Needle 30G 13mm', 'Nipro Needle 30G 13mm', 'Nipro Needle 30G 13mm', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '7');
INSERT INTO `inv_items` VALUES ('158', '1', 'TP0068', 'Saforelle soin', 'Saforelle soin', 'Saforelle soin', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('159', '1', 'SP0001', 'ISIS Aqua Ruboril 400ml', 'ISIS Aqua Ruboril 400ml', 'ISIS Aqua Ruboril 400ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('160', '1', 'SP0002', 'ISIS Ketoplast Cracks 40ml', 'ISIS Ketoplast Cracks 40ml', 'ISIS Ketoplast Cracks 40ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('161', '1', 'SP0003', 'ISIS Ketoplast Scars SPF50+ 40ml', 'ISIS Ketoplast Scars SPF50+ 40ml', 'ISIS Ketoplast Scars SPF50+ 40ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('162', '1', 'SP0004', 'ISIS Neotone Aqua 250ml', 'ISIS Neotone Aqua 250ml', 'ISIS Neotone Aqua 250ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('163', '1', 'SP0005', 'ISIS Neotone Body 100ml', 'ISIS Neotone Body 100ml', 'ISIS Neotone Body 100ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('164', '1', 'SP0006', 'ISIS Neotone Eyes 15ml', 'ISIS Neotone Eyes 15ml', 'ISIS Neotone Eyes 15ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('165', '1', 'SP0007', 'ISIS Neotone Prevent SPF50+ Mineral Tinted', 'ISIS Neotone Prevent SPF50+ Mineral Tinted', 'ISIS Neotone Prevent SPF50+ Mineral Tinted', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('166', '1', 'SP0008', 'ISIS Neotone Radiance SPF50+ 30ml', 'ISIS Neotone Radiance SPF50+ 30ml', 'ISIS Neotone Radiance SPF50+ 30ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('167', '1', 'SP0009', 'ISIS Neotone Sensitive 30ml', 'ISIS Neotone Sensitive 30ml', 'ISIS Neotone Sensitive 30ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('168', '1', 'SP0011', 'ISIS Ruboril Expert M 40ml', 'ISIS Ruboril Expert M 40ml', 'ISIS Ruboril Expert M 40ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('169', '1', 'SP0012', 'ISIS Ruboril Expert SPF 50+ 40ml', 'ISIS Ruboril Expert SPF 50+ 40ml', 'ISIS Ruboril Expert SPF 50+ 40ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('170', '1', 'SP0013', 'ISIS Ruboril Expert Intense 15ml', 'ISIS Ruboril Expert Intense 15ml', 'ISIS Ruboril Expert Intense 15ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('171', '1', 'SP0014', 'ISIS Ruboril Expert Lotion 250ml', 'ISIS Ruboril Expert Lotion 250ml', 'ISIS Ruboril Expert Lotion 250ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('172', '1', 'SP0015', 'ISIS Secalia AHA 200ml', 'ISIS Secalia AHA 200ml', 'ISIS Secalia AHA 200ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('173', '1', 'SP0016', 'ISIS Secalia Balm 200ml', 'ISIS Secalia Balm 200ml', 'ISIS Secalia Balm 200ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('174', '1', 'SP0017', 'ISIS Secalia Ultra 200ml', 'ISIS Secalia Ultra 200ml', 'ISIS Secalia Ultra 200ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('175', '1', 'SP0018', 'ISIS Sensylia 24h 40ml', 'ISIS Sensylia 24h 40ml', 'ISIS Sensylia 24h 40ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('176', '1', 'SP0019', 'ISIS Sensylia 24h Legere 40ml', 'ISIS Sensylia 24h Legere 40ml', 'ISIS Sensylia 24h Legere 40ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('177', '1', 'SP0020', 'ISIS Sensylia Aqua 100ml', 'ISIS Sensylia Aqua 100ml', 'ISIS Sensylia Aqua 100ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('178', '1', 'SP0021', 'ISIS Sensylia Gelee 250ml', 'ISIS Sensylia Gelee 250ml', 'ISIS Sensylia Gelee 250ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('179', '1', 'SP0022', 'ISIS Suavigel 40ml', 'ISIS Suavigel 40ml', 'ISIS Suavigel 40ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('180', '1', 'SP0023', 'ISIS Teen Derm Aqua 100ml', 'ISIS Teen Derm Aqua 100ml', 'ISIS Teen Derm Aqua 100ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('181', '1', 'SP0024', 'ISIS Teen Derm Aqua 250ml', 'ISIS Teen Derm Aqua 250ml', 'ISIS Teen Derm Aqua 250ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('182', '1', 'SP0025', 'ISIS Teen Derm Alpha Pure 30ml', 'ISIS Teen Derm Alpha Pure 30ml', 'ISIS Teen Derm Alpha Pure 30ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('183', '1', 'SP0026', 'ISIS Teen Derm Gel 40ml', 'ISIS Teen Derm Gel 40ml', 'ISIS Teen Derm Gel 40ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('184', '1', 'SP0027', 'ISIS Teen Derm Gel 150ml', 'ISIS Teen Derm Gel 150ml', 'ISIS Teen Derm Gel 150ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('185', '1', 'SP0028', 'ISIS Teen Derm Gel Sensitive 250ml', 'ISIS Teen Derm Gel Sensitive 250ml', 'ISIS Teen Derm Gel Sensitive 250ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('186', '1', 'SP0029', 'ISIS Teen Derm Hydra 40ml', 'ISIS Teen Derm Hydra 40ml', 'ISIS Teen Derm Hydra 40ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('187', '1', 'SP0030', 'ISIS Teen Derm K 30ml', 'ISIS Teen Derm K 30ml', 'ISIS Teen Derm K 30ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('188', '1', 'SP0031', 'ISIS Teen Derm K Concentrate 30ml', 'ISIS Teen Derm K Concentrate 30ml', 'ISIS Teen Derm K Concentrate 30ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('189', '1', 'SP0032', 'ISIS Urelia 10 150ml', 'ISIS Urelia 10 150ml', 'ISIS Urelia 10 150ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('190', '1', 'SP0033', 'ISIS Urelia 50 40ml', 'ISIS Urelia 50 40ml', 'ISIS Urelia 50 40ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('191', '1', 'SP0034', 'ISIS Urelia Gel 200ml', 'ISIS Urelia Gel 200ml', 'ISIS Urelia Gel 200ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('192', '1', 'SP0035', 'ISIS SPF50+ Day Secure Invisible', 'ISIS SPF50+ Day Secure Invisible', 'ISIS SPF50+ Day Secure Invisible', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('193', '1', 'SP0036', 'ISIS SPF50+ Invisible Fluid 40ml', 'ISIS SPF50+ Invisible Fluid 40ml', 'ISIS SPF50+ Invisible Fluid 40ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('194', '1', 'SP0037', 'ISIS SPF50+ Light Tinted Fluid 40ml', 'ISIS SPF50+ Light Tinted Fluid 40ml', 'ISIS SPF50+ Light Tinted Fluid 40ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('195', '1', 'SP0038', 'ISIS SPF50+ Tinted Mineral Cream', 'ISIS SPF50+ Tinted Mineral Cream', 'ISIS SPF50+ Tinted Mineral Cream', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('196', '1', 'SP0039', 'ISIS SPF50+ Mineral Cream 40ml', 'ISIS SPF50+ Mineral Cream 40ml', 'ISIS SPF50+ Mineral Cream 40ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('197', '1', 'SP0040', 'ISIS SPF30+ Dry Touch 40ml', 'ISIS SPF30+ Dry Touch 40ml', 'ISIS SPF30+ Dry Touch 40ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('198', '1', 'SP0041', 'ISIS SPF80 Invisible cream 40ml', 'ISIS SPF80 Invisible cream 40ml', 'ISIS SPF80 Invisible cream 40ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('199', '1', 'SP0042', 'ISIS Vitiskin 50ml', 'ISIS Vitiskin 50ml', 'ISIS Vitiskin 50ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('200', '1', 'SP0043', 'Noreva Norelift Day Cream', 'Noreva Norelift Day Cream', 'Noreva Norelift Day Cream', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('201', '1', 'SP0044', 'Noreva Actipur BB light 30ml', 'Noreva Actipur BB light 30ml', 'Noreva Actipur BB light 30ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('202', '1', 'SP0045', 'Noreva Actipur BB Golden 30ml', 'Noreva Actipur BB Golden 30ml', 'Noreva Actipur BB Golden 30ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('203', '1', 'SP0046', 'Noreva Actipur Cleansing Gel 150ml', 'Noreva Actipur Cleansing Gel 150ml', 'Noreva Actipur Cleansing Gel 150ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('204', '1', 'SP0047', 'Noreva Exfoliac Global 6 30ml', 'Noreva Exfoliac Global 6 30ml', 'Noreva Exfoliac Global 6 30ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('205', '1', 'SP0048', 'Noreva Exfoliac Foaming Gel 200ml', 'Noreva Exfoliac Foaming Gel 200ml', 'Noreva Exfoliac Foaming Gel 200ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('206', '1', 'SP0049', 'Noreva Trio Dark Spot Serum 30ml', 'Noreva Trio Dark Spot Serum 30ml', 'Noreva Trio Dark Spot Serum 30ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('207', '1', 'SP0050', 'Noreva Trio Dark Spot Care SPF 50+ ', 'Noreva Trio Dark Spot Care SPF 50+ ', 'Noreva Trio Dark Spot Care SPF 50+ ', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('208', '1', 'SP0051', 'Noreva Trio Dark Spot Care 30ml', 'Noreva Trio Dark Spot Care 30ml', 'Noreva Trio Dark Spot Care 30ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('209', '1', 'SP0052', 'Noreva Xerodiane AP+ Cream 400ml', 'Noreva Xerodiane AP+ Cream 400ml', 'Noreva Xerodiane AP+ Cream 400ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('210', '1', 'SP0053', 'Noreva Xerodiane AP+ Cleaning Shower', 'Noreva Xerodiane AP+ Cleaning Shower', 'Noreva Xerodiane AP+ Cleaning Shower', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('211', '1', 'SP0054', 'Noreva Sensidiane AR Anti-Redness cream 30ml', 'Noreva Sensidiane AR Anti-Redness cream 30ml', 'Noreva Sensidiane AR Anti-Redness cream 30ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('212', '1', 'SP0055', 'Embryolisse Lait-Creme Concentre 30ml', 'Embryolisse Lait-Creme Concentre 30ml', 'Embryolisse Lait-Creme Concentre 30ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('213', '1', 'SP0056', 'Embryolisse Lait-Creme Fluide 75ml', 'Embryolisse Lait-Creme Fluide 75ml', 'Embryolisse Lait-Creme Fluide 75ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('214', '1', 'SP0057', 'Embryolisse Eua De Beaute 200ml', 'Embryolisse Eua De Beaute 200ml', 'Embryolisse Eua De Beaute 200ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('215', '1', 'SP0058', 'Embryolisse Lotion Micellaire 250ml', 'Embryolisse Lotion Micellaire 250ml', 'Embryolisse Lotion Micellaire 250ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('216', '1', 'SP0059', 'Embryolisse lashes & brows Booster 6.5ml', 'Embryolisse lashes & brows Booster 6.5ml', 'Embryolisse lashes & brows Booster 6.5ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('217', '1', 'SP0060', 'Embryolisse Intense Smooth 50ml', 'Embryolisse Intense Smooth 50ml', 'Embryolisse Intense Smooth 50ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('218', '1', 'SP0061', 'Embryolisse Complexion BB Cream', 'Embryolisse Complexion BB Cream', 'Embryolisse Complexion BB Cream', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('219', '1', 'SP0062', 'Embryolisse Complexion CC Cream 30ml', 'Embryolisse Complexion CC Cream 30ml', 'Embryolisse Complexion CC Cream 30ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('220', '1', 'SP0063', 'Embryolisse Consealer (Beige) 8ml', 'Embryolisse Consealer (Beige) 8ml', 'Embryolisse Consealer (Beige) 8ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('221', '1', 'SP0064', 'Embryolisse Consealer (PInk) 8ml', 'Embryolisse Consealer (PInk) 8ml', 'Embryolisse Consealer (PInk) 8ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('222', '1', 'SP0065', 'Embryolisse Smooth Rodiant 40ml', 'Embryolisse Smooth Rodiant 40ml', 'Embryolisse Smooth Rodiant 40ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('223', '1', 'SP0066', 'Embryolisse Radiant Powder 12g', 'Embryolisse Radiant Powder 12g', 'Embryolisse Radiant Powder 12g', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('224', '1', 'SP0067', 'Embryolisse Radiant Eye 4.5g', 'Embryolisse Radiant Eye 4.5g', 'Embryolisse Radiant Eye 4.5g', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('225', '1', 'SP0010', 'ISIS Neotone Serum 30ml', 'ISIS Neotone Serum 30ml', 'ISIS Neotone Serum 30ml', null, '5', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('226', '1', 'IN0037', 'Bupivacaine ', 'Bupivacaine ', 'Bupivacaine ', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '10');
INSERT INTO `inv_items` VALUES ('227', '1', 'IN0038', 'Glucose Thai inj 50%', 'Glucose Thai inj 50%', 'Glucose Thai inj 50%', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '10');
INSERT INTO `inv_items` VALUES ('228', '1', 'EP0041', 'Cannula 25G*50MM', 'Cannula 25G*50MM', 'Cannula 25G*50MM', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '11');
INSERT INTO `inv_items` VALUES ('229', '1', 'EP0042', 'Cannula 18G*50MM', 'Cannula 18G*50MM', 'Cannula 18G*50MM', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '11');
INSERT INTO `inv_items` VALUES ('230', '1', 'EP0043', 'Skin marker white ', 'Skin marker white ', 'Skin marker white ', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '11');
INSERT INTO `inv_items` VALUES ('231', '1', 'IN0039', 'Botox USA', 'Botox USA', 'Botox USA', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('232', '1', 'TP0069', 'Whiteness lightening serum', 'Whiteness lightening serum', 'Whiteness lightening serum', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('233', '1', 'OM0017', 'Firide 1mg', 'Firide 1mg', 'Firide 1mg', null, '2', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '4');
INSERT INTO `inv_items` VALUES ('234', '1', 'TP0070', 'Minoxin 5%', 'Minoxin 5%', 'Minoxin 5%', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('235', '1', 'TP0071', 'Acnetin 0.05', 'Acnetin 0.05', 'Acnetin 0.05', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('236', '1', 'IN0040', 'F-ACN (FUSION)', 'F-ACN (FUSION)', 'F-ACN (FUSION)', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('237', '1', 'IN0041', 'F-RADIAN (FUSION)', 'F-RADIAN (FUSION)', 'F-RADIAN (FUSION)', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('238', '1', '42', 'F-EYECONTOUR (FUSION)', 'F-EYECONTOUR (FUSION)', 'F-EYECONTOUR (FUSION)', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('239', '1', 'IN0043', 'F-HAIR MEN (FUSION)', 'F-HAIR MEN (FUSION)', 'F-HAIR MEN (FUSION)', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('240', '1', 'TP0072', 'Minoxin 2%', 'Minoxin 2%', 'Minoxin 2%', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('241', '1', 'TP0073', 'Orrepast', 'Orrepast', 'Orrepast', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('242', '1', 'OM0018', 'Mediclovir 400mg', 'Mediclovir 400mg', 'Mediclovir 400mg', null, '2', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '4');
INSERT INTO `inv_items` VALUES ('243', '1', 'OM0019', 'Gofen 400mg', 'Gofen 400mg', 'Gofen 400mg', null, '2', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '4');
INSERT INTO `inv_items` VALUES ('244', '1', 'TP0074', 'Y Mycin N', 'Y Mycin N', 'Y Mycin N', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('245', '1', 'TP0075', 'Y Mycin A ', 'Y Mycin A ', 'Y Mycin A ', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('246', '1', 'EP0044', 'Nitrile No powder Size S', 'Nitrile No powder Size S', 'Nitrile No powder Size S', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '7');
INSERT INTO `inv_items` VALUES ('247', '1', 'EP0045', 'Nitrile No powder Size M', 'Nitrile No powder Size M', 'Nitrile No powder Size M', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '7');
INSERT INTO `inv_items` VALUES ('248', '1', 'OM0020', 'Lergicet 10mg', 'Lergicet 10mg', 'Lergicet 10mg', null, '2', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '4');
INSERT INTO `inv_items` VALUES ('249', '1', 'OM0021', 'Falete 250mg', 'Falete 250mg', 'Falete 250mg', null, '2', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '4');
INSERT INTO `inv_items` VALUES ('250', '1', 'IN0044', 'Medixon 125mg ', 'Medixon 125mg ', 'Medixon 125mg ', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '9');
INSERT INTO `inv_items` VALUES ('251', '1', 'TP0076', 'Cicaplast Baume B5 40ml', 'Cicaplast Baume B5 40ml', 'Cicaplast Baume B5 40ml', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('252', '1', 'TP0077', 'Bioderma Sensibio Gel moussant 200ml', 'Bioderma Sensibio Gel moussant 200ml', 'Bioderma Sensibio Gel moussant 200ml', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('253', '1', 'TP0078', 'Bioderma Sensibio Gel moussant 45ml', 'Bioderma Sensibio Gel moussant 45ml', 'Bioderma Sensibio Gel moussant 45ml', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('254', '1', 'TP0079', 'Akne-Derm 2.5 Cream', 'Akne-Derm 2.5 Cream', 'Akne-Derm 2.5 Cream', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('255', '1', 'EP0046', 'Syringe Leur Lock 3ml', 'Syringe Leur Lock 3ml', 'Syringe Leur Lock 3ml', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '7');
INSERT INTO `inv_items` VALUES ('256', '1', 'EP0047', 'Syringe Leur Lock 5ml', 'Syringe Leur Lock 5ml', 'Syringe Leur Lock 5ml', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '7');
INSERT INTO `inv_items` VALUES ('257', '1', 'EP0048', 'Syringe Leur Lock 10ml', 'Syringe Leur Lock 10ml', 'Syringe Leur Lock 10ml', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '7');
INSERT INTO `inv_items` VALUES ('258', '1', 'EP0049', 'Syringe Leur Lock 50ml', 'Syringe Leur Lock 50ml', 'Syringe Leur Lock 50ml', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '7');
INSERT INTO `inv_items` VALUES ('259', '1', 'OM0022', 'Biotin Nature Own', 'Biotin Nature Own', 'Biotin Nature Own', null, '2', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('260', '1', 'TP0080', 'Hydrogel Brightening Mask', 'Hydrogel Brightening Mask', 'Hydrogel Brightening Mask', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '11');
INSERT INTO `inv_items` VALUES ('261', '1', 'TP0081', 'Hydrogel Gold Mask', 'Hydrogel Gold Mask', 'Hydrogel Gold Mask', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '11');
INSERT INTO `inv_items` VALUES ('262', '1', 'TP0082', 'Hydrogel Snail Mask', 'Hydrogel Snail Mask', 'Hydrogel Snail Mask', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '11');
INSERT INTO `inv_items` VALUES ('263', '1', '2', 'Grand Compress (Bloc)', 'Grand Compress (Bloc)', 'Grand Compress (Bloc)', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '11');
INSERT INTO `inv_items` VALUES ('264', '1', '4', 'Esome 40mg(Injection)', 'Esome 40mg(Injection)', 'Esome 40mg(Injection)', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '10');
INSERT INTO `inv_items` VALUES ('265', '1', 'TP0083', 'LRP Spray SPF50+', 'LRP Spray SPF50+', 'LRP Spray SPF50+', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('266', '1', 'TP0084', 'M-Cain Cream', 'M-Cain Cream', 'M-Cain Cream', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '7');
INSERT INTO `inv_items` VALUES ('267', '1', 'IN0046', 'Neuramis Gray', 'Neuramis Gray', 'Neuramis Gray', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '7');
INSERT INTO `inv_items` VALUES ('268', '1', 'IN0047', 'Liporase', 'Liporase', 'Liporase', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('269', '1', 'EP0051', 'PRP Tube USA', 'PRP Tube USA', 'PRP Tube USA', null, '3', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');
INSERT INTO `inv_items` VALUES ('270', '1', 'IN0048', 'Genta Injection', 'Genta Injection', 'Genta Injection', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '10');
INSERT INTO `inv_items` VALUES ('271', '1', 'IN0049', 'Cimetidine Injection', 'Cimetidine Injection', 'Cimetidine Injection', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '10');
INSERT INTO `inv_items` VALUES ('272', '1', 'OM0023', 'Pengesic 50mg (Tramadol)', 'Pengesic 50mg (Tramadol)', 'Pengesic 50mg (Tramadol)', null, '2', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '4');
INSERT INTO `inv_items` VALUES ('273', '1', 'IN0050', 'F-MELACLEAR', 'F-MELACLEAR', 'F-MELACLEAR', null, '4', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '2');
INSERT INTO `inv_items` VALUES ('274', '1', 'TP0085', 'Vitara TXPPE', 'Vitara TXPPE', 'Vitara TXPPE', null, '1', null, null, '2023-01-05 01:10:26.120732', '2023-01-05 01:10:26.120732', null, null, null, null, '3');

-- ----------------------------
-- Table structure for `inv_item_attributes`
-- ----------------------------
DROP TABLE IF EXISTS `inv_item_attributes`;
CREATE TABLE `inv_item_attributes` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `item_id` int(10) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `value_type` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_item_attributes
-- ----------------------------

-- ----------------------------
-- Table structure for `inv_item_groups`
-- ----------------------------
DROP TABLE IF EXISTS `inv_item_groups`;
CREATE TABLE `inv_item_groups` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `name` varchar(150) NOT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_item_groups
-- ----------------------------
INSERT INTO `inv_item_groups` VALUES ('1', '1', 'Topical Product', 'Admin', '1', null);
INSERT INTO `inv_item_groups` VALUES ('2', '1', 'Oral Medicine', 'Admin', '1', '2023-01-04 22:50:20.913135');
INSERT INTO `inv_item_groups` VALUES ('3', '1', 'Equipment', 'Admin', '1', null);
INSERT INTO `inv_item_groups` VALUES ('4', '1', 'Injection', 'Admin', '1', null);
INSERT INTO `inv_item_groups` VALUES ('5', '1', 'Sale product', 'Admin', '1', null);

-- ----------------------------
-- Table structure for `inv_item_varriances`
-- ----------------------------
DROP TABLE IF EXISTS `inv_item_varriances`;
CREATE TABLE `inv_item_varriances` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `variance_code` varchar(25) DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_user` varchar(50) NOT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_item_varriances
-- ----------------------------

-- ----------------------------
-- Table structure for `inv_manufacturers`
-- ----------------------------
DROP TABLE IF EXISTS `inv_manufacturers`;
CREATE TABLE `inv_manufacturers` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `name` varchar(150) NOT NULL,
  `country_id` int(10) DEFAULT NULL,
  `create_uid` int(10) NOT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) NOT NULL,
  `update_user` varchar(50) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_manufacturers
-- ----------------------------

-- ----------------------------
-- Table structure for `inv_merchandising_items`
-- ----------------------------
DROP TABLE IF EXISTS `inv_merchandising_items`;
CREATE TABLE `inv_merchandising_items` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `item_id` int(10) NOT NULL,
  `variance_id` int(10) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `selling_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_user` varchar(50) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL,
  `update_uid` int(50) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `sales_tax_rate` decimal(10,2) NOT NULL DEFAULT 0.00,
  `sales_tax_id` int(10) NOT NULL DEFAULT 0,
  `purchase_tax_id` int(10) NOT NULL DEFAULT 0,
  `purchase_tax_rate` decimal(10,2) NOT NULL DEFAULT 0.00,
  `purchase_sku` int(10) DEFAULT NULL,
  `sku` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_merchandising_items
-- ----------------------------

-- ----------------------------
-- Table structure for `inv_physical_counts`
-- ----------------------------
DROP TABLE IF EXISTS `inv_physical_counts`;
CREATE TABLE `inv_physical_counts` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `count_date` date NOT NULL,
  `item_id` int(10) NOT NULL,
  `variance_id` int(10) NOT NULL,
  `qty` int(10) NOT NULL,
  `sku` int(10) NOT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `stock_class_id` int(10) NOT NULL COMMENT 'stock_class_id, for example, 1 = Selling, 2 = Internal use, etc...',
  `warehouse_id` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_physical_counts
-- ----------------------------

-- ----------------------------
-- Table structure for `inv_po_items`
-- ----------------------------
DROP TABLE IF EXISTS `inv_po_items`;
CREATE TABLE `inv_po_items` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `po_id` int(10) NOT NULL,
  `item_id` int(10) NOT NULL,
  `varriance_id` int(10) NOT NULL,
  `item_code` varchar(10) NOT NULL,
  `description` varchar(250) DEFAULT NULL,
  `qty` decimal(10,2) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `line_total` decimal(10,2) NOT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_po_items
-- ----------------------------

-- ----------------------------
-- Table structure for `inv_purchase_orders`
-- ----------------------------
DROP TABLE IF EXISTS `inv_purchase_orders`;
CREATE TABLE `inv_purchase_orders` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `po_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `vendor_id` int(10) NOT NULL,
  `status` varchar(20) NOT NULL,
  `description` varchar(250) DEFAULT NULL,
  `warehouse_id` int(10) NOT NULL,
  `com_branch_id` int(10) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_purchase_orders
-- ----------------------------

-- ----------------------------
-- Table structure for `inv_raw_materials`
-- ----------------------------
DROP TABLE IF EXISTS `inv_raw_materials`;
CREATE TABLE `inv_raw_materials` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `item_id` int(10) NOT NULL,
  `varriance_id` int(10) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `purchase_sku` int(10) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `sku` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_raw_materials
-- ----------------------------

-- ----------------------------
-- Table structure for `inv_stocking_keeping_units`
-- ----------------------------
DROP TABLE IF EXISTS `inv_stocking_keeping_units`;
CREATE TABLE `inv_stocking_keeping_units` (
  `item_id` int(10) NOT NULL,
  `unit_id` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_stocking_keeping_units
-- ----------------------------

-- ----------------------------
-- Table structure for `inv_stock_adjustments`
-- ----------------------------
DROP TABLE IF EXISTS `inv_stock_adjustments`;
CREATE TABLE `inv_stock_adjustments` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `item_id` int(10) NOT NULL,
  `variance_id` int(10) NOT NULL,
  `adjust_qty` int(10) NOT NULL DEFAULT 0,
  `adjust_type_id` int(10) NOT NULL,
  `description` varchar(250) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_stock_adjustments
-- ----------------------------

-- ----------------------------
-- Table structure for `inv_stock_classes`
-- ----------------------------
DROP TABLE IF EXISTS `inv_stock_classes`;
CREATE TABLE `inv_stock_classes` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_stock_classes
-- ----------------------------
INSERT INTO `inv_stock_classes` VALUES ('1', '1', 'Saleable Stock', null, null, null);
INSERT INTO `inv_stock_classes` VALUES ('2', '1', 'Internal Usage', null, null, null);

-- ----------------------------
-- Table structure for `inv_stock_trans`
-- ----------------------------
DROP TABLE IF EXISTS `inv_stock_trans`;
CREATE TABLE `inv_stock_trans` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `stock_class_id` int(10) NOT NULL,
  `item_id` int(10) NOT NULL,
  `variance_id` int(10) NOT NULL,
  `qty` int(10) NOT NULL,
  `trx_type` varchar(35) NOT NULL COMMENT 'trx_type = {selling,purchase, customer return, return to vendor, transfer in, transfer out, adjustment}',
  `trx_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_uid` int(10) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `adjust_trx_id` int(10) DEFAULT NULL,
  `po_id` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_stock_trans
-- ----------------------------

-- ----------------------------
-- Table structure for `inv_transfers`
-- ----------------------------
DROP TABLE IF EXISTS `inv_transfers`;
CREATE TABLE `inv_transfers` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `trx_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `trx_type` varchar(50) DEFAULT NULL,
  `description` varchar(250) NOT NULL DEFAULT '0',
  `qty` decimal(10,2) NOT NULL,
  `from_warehouse_id` int(10) NOT NULL,
  `to_warehouse_id` int(10) NOT NULL,
  `auth_status` varchar(20) NOT NULL,
  `auth_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `auth_user` varchar(50) DEFAULT NULL,
  `auth_uid` int(10) DEFAULT NULL,
  `transit_status` varchar(15) DEFAULT NULL COMMENT 'transit_status ={transporting,received}',
  `received_by` int(10) DEFAULT NULL,
  `receipt_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `receipt_notes` varchar(250) DEFAULT NULL,
  `from_stock_class_id` int(10) DEFAULT NULL,
  `to_stock_class_id` int(10) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `updated-at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_transfers
-- ----------------------------

-- ----------------------------
-- Table structure for `inv_units`
-- ----------------------------
DROP TABLE IF EXISTS `inv_units`;
CREATE TABLE `inv_units` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(100) NOT NULL,
  `parent_unit_id` int(10) DEFAULT NULL,
  `item_id` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_units
-- ----------------------------
INSERT INTO `inv_units` VALUES ('2', 'Bottle', 'Bottle', null, '0');
INSERT INTO `inv_units` VALUES ('3', 'Tube', 'Tube', null, '0');
INSERT INTO `inv_units` VALUES ('4', 'Tablet', 'Tablet', null, '0');
INSERT INTO `inv_units` VALUES ('5', 'Set', 'Set', null, '0');
INSERT INTO `inv_units` VALUES ('6', 'Pack', 'Pack', null, '0');
INSERT INTO `inv_units` VALUES ('7', 'Box', 'Box', null, '0');
INSERT INTO `inv_units` VALUES ('8', 'Vial', 'Vial', null, '0');
INSERT INTO `inv_units` VALUES ('9', 'FL', 'FL', null, '0');
INSERT INTO `inv_units` VALUES ('10', 'Amp', 'Amp', null, '0');
INSERT INTO `inv_units` VALUES ('11', 'pcs', 'pcs', null, '0');

-- ----------------------------
-- Table structure for `inv_warehouses`
-- ----------------------------
DROP TABLE IF EXISTS `inv_warehouses`;
CREATE TABLE `inv_warehouses` (
  `id` int(10) NOT NULL,
  `branch_id` int(10) NOT NULL,
  `name` varchar(250) NOT NULL,
  `description` varchar(250) DEFAULT NULL,
  `lat` decimal(10,0) DEFAULT NULL,
  `lng` decimal(10,0) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_warehouses
-- ----------------------------
INSERT INTO `inv_warehouses` VALUES ('1', '1', 'Defaut Warehosue', 'Default warehouse', '0', '0', null, null, null, null, null, null);

-- ----------------------------
-- Table structure for `labo_tests`
-- ----------------------------
DROP TABLE IF EXISTS `labo_tests`;
CREATE TABLE `labo_tests` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `name` varchar(250) NOT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_uid` int(10) DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of labo_tests
-- ----------------------------
INSERT INTO `labo_tests` VALUES ('1', '1', 'Blood Test One', '1', null, null, null, null, null);
INSERT INTO `labo_tests` VALUES ('2', '1', 'Blood Test 2', '1', null, null, null, null, null);
INSERT INTO `labo_tests` VALUES ('3', '1', 'Test 3', '1', null, null, null, null, null);

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
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of leads
-- ----------------------------
INSERT INTO `leads` VALUES ('13', 'Ms Darany', 'F', '012555653', '2', '1', 'Samsethy', null, null, '2022-12-01 09:17:15', null, '1', null);
INSERT INTO `leads` VALUES ('14', 'KKKKK', 'F', '0125656765', '2', '1', 'Samsethy', null, null, '2022-12-03 17:37:42', null, '1', null);
INSERT INTO `leads` VALUES ('15', 'dsfdsgdf', null, '012555666', '2', '1', 'Samsethy', null, null, '2022-12-04 13:18:46', null, '1', null);
INSERT INTO `leads` VALUES ('16', 'DDDDDD``', 'F', '093488789', '2', '1', 'Samsethy', null, null, '2022-12-04 13:40:07', null, '1', null);
INSERT INTO `leads` VALUES ('17', 'dsdgds', 'F', '0112225653', '2', '1', 'Samsethy', null, null, '2022-12-04 13:41:17', null, '1', null);
INSERT INTO `leads` VALUES ('18', 'NEW ONE', 'F', '012998898', '2', '1', 'Samsethy', null, null, '2022-12-04 13:43:17', null, '1', null);
INSERT INTO `leads` VALUES ('19', 'Bun Sobana', 'F', '0115656565', '2', '1', 'Samsethy', null, null, '2022-12-06 11:21:11', null, '1', null);
INSERT INTO `leads` VALUES ('20', 'Borya', 'F', '0125689898', '2', '1', 'Samsethy', null, null, '2022-12-06 12:01:56', null, '1', null);
INSERT INTO `leads` VALUES ('21', 'DDGDGDGD', 'F', '0125686455', '2', '1', 'Samsethy', null, null, '2022-12-07 17:00:49', null, '1', null);
INSERT INTO `leads` VALUES ('22', 'Sonary', 'F', '0102256765', '2', '1', 'Samsethy', null, null, '2022-12-08 09:51:36', null, '1', null);
INSERT INTO `leads` VALUES ('23', 'Ginara', 'F', '01023765423', '2', '1', 'Samsethy', null, null, '2022-12-08 10:02:58', null, '1', null);
INSERT INTO `leads` VALUES ('24', 'Funny name', 'F', '011235768', '2', '1', 'Samsethy', null, null, '2022-12-08 10:04:38', null, '1', null);
INSERT INTO `leads` VALUES ('25', 'some one', 'F', '012565656', '2', '1', 'Samsethy', null, null, '2022-12-09 10:03:50', null, '1', null);
INSERT INTO `leads` VALUES ('26', 'KKKKK', 'F', '01025657667', '2', '1', 'Samsethy', null, null, '2022-12-10 19:10:39', null, '1', null);
INSERT INTO `leads` VALUES ('27', 'KKK1', 'F', '01245656', '2', '1', 'Samsethy', null, null, '2022-12-10 19:13:54', null, '1', null);
INSERT INTO `leads` VALUES ('28', 'HHH2', 'F', '011023255', '2', '1', 'Samsethy', null, null, '2022-12-10 19:23:07', null, '1', null);
INSERT INTO `leads` VALUES ('29', 'HKKK', 'F', '01245657', '2', '1', 'Samsethy', null, null, '2022-12-10 19:25:52', null, '1', null);
INSERT INTO `leads` VALUES ('30', 'GGG1', 'M', '0125765676', '2', '1', 'Samsethy', null, null, '2022-12-10 19:30:17', null, '1', null);
INSERT INTO `leads` VALUES ('31', 'dfgdfgf', 'F', '01235345435', '2', '1', 'Samsethy', null, null, '2022-12-10 19:33:35', null, '1', null);
INSERT INTO `leads` VALUES ('32', 'sdgdfhfdhgfh', 'F', '012456576', '2', '1', 'Samsethy', null, null, '2022-12-10 20:25:00', null, '1', null);
INSERT INTO `leads` VALUES ('33', 'sfddgfdgdfgdfg', 'F', '012234353', '2', '1', 'Samsethy', null, null, '2022-12-10 20:47:36', null, '1', null);
INSERT INTO `leads` VALUES ('34', '345345%^* BBBB', 'F', '0124565756', '2', '1', 'Samsethy', null, null, '2022-12-11 11:36:05', null, '1', null);
INSERT INTO `leads` VALUES ('35', 'sdfdggdf', 'F', '012456546', '2', '1', 'Samsethy', null, null, '2022-12-11 11:45:38', null, '1', null);
INSERT INTO `leads` VALUES ('36', 'sfsdgfdgd', 'F', '012565676', '2', '1', 'Samsethy', null, null, '2022-12-11 12:53:37', null, '1', null);
INSERT INTO `leads` VALUES ('37', 'HJKJKJK', 'F', '010566767', '2', '1', 'Samsethy', null, null, '2022-12-12 01:43:48', null, '1', null);
INSERT INTO `leads` VALUES ('38', 'vikara', 'F', '0102343322', '2', '1', 'Samsethy', null, null, '2022-12-14 12:51:17', null, '1', null);
INSERT INTO `leads` VALUES ('39', 'MMMMMM', 'F', '012455465', '2', '1', 'Samsethy', null, null, '2023-01-01 14:53:04', null, '1', null);
INSERT INTO `leads` VALUES ('40', 'HEHEERER', 'F', '0122323243', '2', '1', 'Samsethy', null, null, '2023-01-01 15:59:36', null, '1', null);
INSERT INTO `leads` VALUES ('41', 'differencrt', 'M', '0934887771', '2', '1', 'Samsethy', null, null, '2023-01-01 16:02:39', null, '1', null);
INSERT INTO `leads` VALUES ('42', 'Differecnt', 'F', '012344656', '2', '1', 'Samsethy', null, null, '2023-01-01 16:04:03', null, '1', null);
INSERT INTO `leads` VALUES ('43', 'different new', 'F', '01255666756', '2', '1', 'Samsethy', null, null, '2023-01-01 16:07:27', null, '1', null);
INSERT INTO `leads` VALUES ('44', 'sovannary', 'F', '093488777', '2', '1', 'Samsethy', null, null, '2023-01-01 16:14:51', null, '1', null);
INSERT INTO `leads` VALUES ('45', 'Chea Dane', 'F', '012456565', '2', '1', 'Samsethy', null, null, '2023-01-01 16:19:16', null, '1', null);
INSERT INTO `leads` VALUES ('46', 'KJKKLSDSD', 'F', '012546565', '2', '1', 'Samsethy', null, null, '2023-01-01 16:27:15', null, '1', null);
INSERT INTO `leads` VALUES ('47', 'Liza', 'F', '01234546', '2', '1', 'Samsethy', null, null, '2023-01-02 22:15:09', null, '1', null);
INSERT INTO `leads` VALUES ('48', 'dsfsfdsf', 'F', '012234324', '2', '1', 'Samsethy', null, null, '2023-01-05 09:57:40', null, '1', null);
INSERT INTO `leads` VALUES ('49', 'Dyna', 'F', '0124565464', '2', '1', 'Samsethy', null, null, '2023-01-05 10:26:30', null, '1', null);

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
INSERT INTO `medical_conditions` VALUES ('1', '1', 'Allergies', 'boolean', null, '0');
INSERT INTO `medical_conditions` VALUES ('2', '1', 'Colds and Flu', 'level', '0-10', '0');
INSERT INTO `medical_conditions` VALUES ('3', '1', 'Conjunctivitis ', 'boolean', null, '0');
INSERT INTO `medical_conditions` VALUES ('4', '1', 'Diarrhea', 'level', '0-10', '0');
INSERT INTO `medical_conditions` VALUES ('5', '1', 'Headaches', 'level', '0-10', '0');
INSERT INTO `medical_conditions` VALUES ('6', '1', 'Stomach Aches', 'level', '0-10', '0');

-- ----------------------------
-- Table structure for `migrations`
-- ----------------------------
DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
INSERT INTO `migrations` VALUES ('13', '2022_12_23_233609_create_db', '1');

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
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of patients
-- ----------------------------
INSERT INTO `patients` VALUES ('67', '1', '1', '50', 'P100057', 'Samsethy', '1', '2022-12-01 10:19:48', null, null, null, null, 'OPD');
INSERT INTO `patients` VALUES ('71', '1', '1', '51', 'P100060', 'Samsethy', '1', '2022-12-04 09:56:46', null, null, null, null, 'OPD');
INSERT INTO `patients` VALUES ('72', '1', '1', '52', 'P100056', 'Samsethy', '1', '2022-12-04 13:19:03', null, null, null, null, 'OPD');
INSERT INTO `patients` VALUES ('73', '1', '1', '53', 'P100055', 'Samsethy', '1', '2022-12-04 13:40:21', null, null, null, null, 'OPD');
INSERT INTO `patients` VALUES ('74', '1', '1', '54', 'P100058', 'Samsethy', '1', '2022-12-04 13:41:53', null, null, null, null, 'OPD');
INSERT INTO `patients` VALUES ('75', '1', '1', '55', 'P100059', 'Samsethy', '1', '2022-12-04 14:09:38', null, null, null, null, 'OPD');
INSERT INTO `patients` VALUES ('76', '1', '1', '56', 'P100061', 'Samsethy', '1', '2022-12-06 12:01:00', null, null, null, null, 'OPD');
INSERT INTO `patients` VALUES ('77', '1', '1', '57', 'P100062', 'Samsethy', '1', '2022-12-06 12:02:15', null, null, null, null, 'OPD');
INSERT INTO `patients` VALUES ('78', '1', '1', '58', 'P100063', 'Samsethy', '1', '2022-12-07 17:20:24', null, null, null, null, 'OPD');
INSERT INTO `patients` VALUES ('79', '1', '1', '59', 'P100064', 'Samsethy', '1', '2022-12-08 09:52:09', null, null, null, null, 'OPD');
INSERT INTO `patients` VALUES ('80', '1', '1', '60', 'P100065', 'Samsethy', '1', '2022-12-08 10:03:45', null, null, null, null, 'OPD');
INSERT INTO `patients` VALUES ('81', '1', '1', '61', 'P100066', 'Samsethy', '1', '2022-12-08 11:01:25', null, null, null, null, 'OPD');
INSERT INTO `patients` VALUES ('82', '1', '1', '62', 'P100067', 'Samsethy', '1', '2022-12-09 10:04:17', null, null, null, null, 'OPD');
INSERT INTO `patients` VALUES ('96', '1', '1', '81', 'P100082', 'Samsethy', '1', '2023-01-01 16:08:04', null, null, null, null, 'OPD');
INSERT INTO `patients` VALUES ('97', '1', '1', '82', 'P100083', 'Samsethy', '1', '2023-01-01 16:15:20', null, null, null, null, 'OPD');
INSERT INTO `patients` VALUES ('98', '1', '1', '83', 'P100084', 'Samsethy', '1', '2023-01-01 16:19:36', null, null, null, null, 'OPD');
INSERT INTO `patients` VALUES ('99', '1', '1', '84', 'P100085', 'Samsethy', '1', '2023-01-01 16:27:42', null, null, null, null, 'OPD');
INSERT INTO `patients` VALUES ('100', '1', '1', '85', 'P100086', 'Samsethy', '1', '2023-01-02 22:15:53', null, null, null, null, 'OPD');
INSERT INTO `patients` VALUES ('101', '1', '1', '86', 'P100087', 'Samsethy', '1', '2023-01-05 09:57:54', null, null, null, null, 'OPD');
INSERT INTO `patients` VALUES ('102', '1', '1', '87', 'P100088', 'Samsethy', '1', '2023-01-05 10:28:35', null, null, null, null, 'OPD');

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
INSERT INTO `patient_code_control` VALUES ('1', '88', null, 'P');

-- ----------------------------
-- Table structure for `patient_consult_items`
-- ----------------------------
DROP TABLE IF EXISTS `patient_consult_items`;
CREATE TABLE `patient_consult_items` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `description` varchar(800) DEFAULT NULL,
  `create_uid` int(10) NOT NULL,
  `create_user` varchar(50) NOT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_uid` int(10) DEFAULT NULL,
  `item_type` varchar(35) NOT NULL COMMENT 'item_type = {pe,diagnosis,advice}',
  `ticket_id` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of patient_consult_items
-- ----------------------------

-- ----------------------------
-- Table structure for `patient_labo_tests`
-- ----------------------------
DROP TABLE IF EXISTS `patient_labo_tests`;
CREATE TABLE `patient_labo_tests` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `patient_id` int(10) NOT NULL,
  `ticket_id` int(10) DEFAULT NULL,
  `test_id` int(10) NOT NULL,
  `labor_id` int(10) NOT NULL,
  `test_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `result_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `consultant_comment` varchar(800) DEFAULT NULL,
  `result_description` varchar(800) DEFAULT NULL,
  `file_name` varchar(300) DEFAULT NULL,
  `file_type` varchar(10) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of patient_labo_tests
-- ----------------------------

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
  `display_order` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=213 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of patient_medical_conditions
-- ----------------------------
INSERT INTO `patient_medical_conditions` VALUES ('42', '1', '68', '3', '0', 'Active', '2022-12-03 17:39:11.000000', '1', 'Samsethy', '2022-12-03 17:39:11.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('44', '1', '69', '3', '0', 'Active', '2022-12-04 09:33:31.000000', '1', 'Samsethy', '2022-12-04 09:33:31.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('46', '1', '70', '3', '0', 'Active', '2022-12-04 09:33:42.000000', '1', 'Samsethy', '2022-12-04 09:33:42.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('146', '1', '73', '3', '1', 'Active', '2022-12-05 23:39:43.000000', '1', 'Samsethy', '2022-12-05 23:39:43.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('148', '1', '72', '3', '1', 'Active', '2022-12-05 23:42:19.000000', '1', 'Samsethy', '2022-12-05 23:42:19.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('150', '1', '67', '3', '1', 'Active', '2022-12-05 23:45:40.000000', '1', 'Samsethy', '2022-12-05 23:45:40.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('152', '1', '74', '3', '0', 'Active', '2022-12-06 09:31:46.000000', '1', 'Samsethy', '2022-12-06 09:31:46.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('154', '1', '75', '3', '0', 'Active', '2022-12-06 09:32:54.000000', '1', 'Samsethy', '2022-12-06 09:32:54.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('156', '1', '71', '3', '0', 'Active', '2022-12-06 10:20:00.000000', '1', 'Samsethy', '2022-12-06 10:20:00.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('158', '1', '76', '3', '1', 'Active', '2022-12-06 12:01:00.000000', '1', 'Samsethy', '2022-12-06 12:01:00.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('160', '1', '77', '3', '0', 'Active', '2022-12-06 12:02:15.000000', '1', 'Samsethy', '2022-12-06 12:02:15.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('162', '1', '78', '3', '1', 'Active', '2022-12-07 17:20:24.000000', '1', 'Samsethy', '2022-12-07 17:20:24.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('164', '1', '79', '3', '0', 'Active', '2022-12-08 09:52:09.000000', '1', 'Samsethy', '2022-12-08 09:52:09.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('166', '1', '80', '3', '0', 'Active', '2022-12-08 10:03:46.000000', '1', 'Samsethy', '2022-12-08 10:03:46.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('168', '1', '81', '3', '1', 'Active', '2022-12-08 11:01:25.000000', '1', 'Samsethy', '2022-12-08 11:01:25.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('170', '1', '82', '3', '1', 'Active', '2022-12-09 10:04:17.000000', '1', 'Samsethy', '2022-12-09 10:04:17.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('174', '1', '83', '3', '0', 'Active', '2022-12-10 19:12:58.000000', '1', 'Samsethy', '2022-12-10 19:12:58.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('176', '1', '84', '3', '0', 'Active', '2022-12-10 19:14:08.000000', '1', 'Samsethy', '2022-12-10 19:14:08.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('178', '1', '85', '3', '0', 'Active', '2022-12-10 19:23:16.000000', '1', 'Samsethy', '2022-12-10 19:23:16.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('180', '1', '86', '3', '0', 'Active', '2022-12-10 19:25:59.000000', '1', 'Samsethy', '2022-12-10 19:25:59.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('182', '1', '87', '3', '0', 'Active', '2022-12-10 19:30:24.000000', '1', 'Samsethy', '2022-12-10 19:30:24.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('184', '1', '88', '3', '0', 'Active', '2022-12-10 20:53:28.000000', '1', 'Samsethy', '2022-12-10 20:53:28.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('186', '1', '89', '3', '0', 'Active', '2022-12-10 20:55:18.000000', '1', 'Samsethy', '2022-12-10 20:55:18.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('188', '1', '90', '3', '0', 'Active', '2022-12-11 11:46:44.000000', '1', 'Samsethy', '2022-12-11 11:46:44.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('190', '1', '91', '3', '0', 'Active', '2022-12-11 12:53:57.000000', '1', 'Samsethy', '2022-12-11 12:53:57.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('192', '1', '92', '3', '0', 'Active', '2022-12-12 01:44:14.000000', '1', 'Samsethy', '2022-12-12 01:44:14.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('194', '1', '93', '3', '0', 'Active', '2022-12-16 14:10:24.000000', '1', 'Samsethy', '2022-12-16 14:10:24.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('196', '1', '94', '3', '0', 'Active', '2023-01-01 14:54:26.000000', '1', 'Samsethy', '2023-01-01 14:54:26.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('198', '1', '95', '3', '0', 'Active', '2023-01-01 16:01:05.000000', '1', 'Samsethy', '2023-01-01 16:01:05.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('200', '1', '96', '3', '0', 'Active', '2023-01-01 16:08:04.000000', '1', 'Samsethy', '2023-01-01 16:08:04.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('202', '1', '97', '3', '1', 'Active', '2023-01-01 16:15:20.000000', '1', 'Samsethy', '2023-01-01 16:15:20.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('204', '1', '98', '3', '0', 'Active', '2023-01-01 16:19:36.000000', '1', 'Samsethy', '2023-01-01 16:19:36.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('206', '1', '99', '3', '0', 'Active', '2023-01-01 16:27:42.000000', '1', 'Samsethy', '2023-01-01 16:27:42.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('208', '1', '100', '3', '1', 'Active', '2023-01-02 22:15:53.000000', '1', 'Samsethy', '2023-01-02 22:15:53.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('210', '1', '101', '3', '0', 'Active', '2023-01-05 09:57:54.000000', '1', 'Samsethy', '2023-01-05 09:57:54.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('212', '1', '102', '3', '1', 'Active', '2023-01-05 10:28:35.000000', '1', 'Samsethy', '2023-01-05 10:28:35.000000', null, null, null, 'Conjunctivitis', null);

-- ----------------------------
-- Table structure for `patient_pe`
-- ----------------------------
DROP TABLE IF EXISTS `patient_pe`;
CREATE TABLE `patient_pe` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `ticket_id` int(10) NOT NULL,
  `description` varchar(800) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of patient_pe
-- ----------------------------

-- ----------------------------
-- Table structure for `patient_prescribed_items`
-- ----------------------------
DROP TABLE IF EXISTS `patient_prescribed_items`;
CREATE TABLE `patient_prescribed_items` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `item_id` int(10) DEFAULT NULL,
  `description` varchar(250) NOT NULL,
  `dosage` varchar(200) DEFAULT NULL,
  `reason` varchar(250) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_uid` int(10) DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of patient_prescribed_items
-- ----------------------------

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
  `appt_id` int(10) DEFAULT NULL,
  `ticket_id` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=389 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of patient_vital_signs
-- ----------------------------
INSERT INTO `patient_vital_signs` VALUES ('41', null, '67', '1', '35.00', 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('42', null, '67', '2', '67.00', 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('43', null, '67', '3', '89.00', 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('44', null, '67', '4', '120.00', 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('45', null, '68', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('46', null, '68', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('47', null, '68', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('48', null, '68', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('49', null, '69', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('50', null, '69', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('51', null, '69', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('52', null, '69', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('53', null, '70', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('54', null, '70', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('55', null, '70', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('56', null, '70', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('57', null, '71', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('58', null, '71', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('59', null, '71', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('60', null, '71', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('61', null, '67', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('62', null, '67', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('63', null, '67', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('64', null, '67', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('65', null, '72', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('66', null, '72', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('67', null, '72', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('68', null, '72', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('69', null, '72', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('70', null, '72', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('71', null, '72', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('72', null, '72', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('73', null, '73', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('74', null, '73', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('75', null, '73', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('76', null, '73', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('77', null, '74', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('78', null, '74', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('79', null, '74', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('80', null, '74', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('81', null, '74', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('82', null, '74', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('83', null, '74', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('84', null, '74', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('85', null, '73', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('86', null, '73', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('87', null, '73', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('88', null, '73', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('89', null, '75', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('90', null, '75', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('91', null, '75', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('92', null, '75', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('93', null, '75', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('94', null, '75', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('95', null, '75', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('96', null, '75', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('97', null, '75', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('98', null, '75', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('99', null, '75', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('100', null, '75', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('101', null, '75', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('102', null, '75', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('103', null, '75', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('104', null, '75', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('105', null, '75', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('106', null, '75', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('107', null, '75', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('108', null, '75', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('109', null, '75', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('110', null, '75', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('111', null, '75', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('112', null, '75', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('113', null, '75', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('114', null, '75', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('115', null, '75', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('116', null, '75', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('117', null, '75', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('118', null, '75', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('119', null, '75', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('120', null, '75', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('121', null, '75', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('122', null, '75', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('123', null, '75', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('124', null, '75', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('125', null, '75', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('126', null, '75', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('127', null, '75', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('128', null, '75', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('129', null, '75', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('130', null, '75', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('131', null, '75', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('132', null, '75', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('133', null, '75', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('134', null, '75', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('135', null, '75', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('136', null, '75', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('137', null, '75', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('138', null, '75', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('139', null, '75', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('140', null, '75', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('141', null, '75', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('142', null, '75', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('143', null, '75', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('144', null, '75', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('145', null, '75', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('146', null, '75', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('147', null, '75', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('148', null, '75', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('149', null, '75', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('150', null, '75', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('151', null, '75', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('152', null, '75', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('153', null, '75', '1', '50.00', 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('154', null, '75', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('155', null, '75', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('156', null, '75', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('157', null, '75', '1', '50.00', 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('158', null, '75', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('159', null, '75', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('160', null, '75', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('161', null, '75', '1', '50.00', 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('162', null, '75', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('163', null, '75', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('164', null, '75', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('165', null, '73', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('166', null, '73', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('167', null, '73', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('168', null, '73', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('169', null, '74', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('170', null, '74', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('171', null, '74', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('172', null, '74', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('173', null, '71', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('174', null, '71', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('175', null, '71', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('176', null, '71', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('177', null, '67', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('178', null, '67', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('179', null, '67', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('180', null, '67', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('181', null, '67', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('182', null, '67', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('183', null, '67', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('184', null, '67', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('185', null, '67', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('186', null, '67', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('187', null, '67', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('188', null, '67', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('189', null, '67', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('190', null, '67', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('191', null, '67', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('192', null, '67', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('193', null, '67', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('194', null, '67', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('195', null, '67', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('196', null, '67', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('197', null, '67', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('198', null, '67', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('199', null, '67', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('200', null, '67', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('201', null, '67', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('202', null, '67', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('203', null, '67', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('204', null, '67', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('205', null, '67', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('206', null, '67', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('207', null, '67', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('208', null, '67', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('209', null, '67', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('210', null, '67', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('211', null, '67', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('212', null, '67', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('213', null, '67', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('214', null, '67', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('215', null, '67', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('216', null, '67', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('217', null, '67', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('218', null, '67', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('219', null, '67', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('220', null, '67', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('221', null, '67', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('222', null, '67', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('223', null, '67', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('224', null, '67', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('225', null, '67', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('226', null, '67', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('227', null, '67', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('228', null, '67', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('229', null, '72', '1', '100.00', 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('230', null, '72', '2', '200.00', 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('231', null, '72', '3', '500.00', 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('232', null, '72', '4', '201.00', 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('233', null, '67', '1', '100.00', 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('234', null, '67', '2', '202.00', 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('235', null, '67', '3', '303.00', 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('236', null, '67', '4', '505.00', 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('237', null, '72', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('238', null, '72', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('239', null, '72', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('240', null, '72', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('241', null, '75', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('242', null, '75', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('243', null, '75', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('244', null, '75', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('245', null, '71', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('246', null, '71', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('247', null, '71', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('248', null, '71', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('249', null, '74', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('250', null, '74', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('251', null, '74', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('252', null, '74', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('253', null, '73', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('254', null, '73', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('255', null, '73', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('256', null, '73', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('257', null, '72', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('258', null, '72', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('259', null, '72', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('260', null, '72', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('261', null, '67', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('262', null, '67', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('263', null, '67', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('264', null, '67', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('265', null, '74', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('266', null, '74', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('267', null, '74', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('268', null, '74', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('269', null, '75', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('270', null, '75', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('271', null, '75', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('272', null, '75', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('273', null, '71', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('274', null, '71', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('275', null, '71', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('276', null, '71', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('277', null, '76', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('278', null, '76', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('279', null, '76', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('280', null, '76', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('281', null, '77', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('282', null, '77', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('283', null, '77', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('284', null, '77', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('285', null, '78', '1', '20.00', 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('286', null, '78', '2', '50.00', 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('287', null, '78', '3', '29.00', 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('288', null, '78', '4', '10.00', 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('289', null, '79', '1', '20.00', 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('290', null, '79', '2', '56.00', 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('291', null, '79', '3', '120.00', 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('292', null, '79', '4', '120.00', 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('293', null, '80', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('294', null, '80', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('295', null, '80', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('296', null, '80', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('297', null, '81', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('298', null, '81', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('299', null, '81', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('300', null, '81', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('301', null, '82', '1', '20.00', 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('302', null, '82', '2', '50.00', 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('303', null, '82', '3', '120.00', 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('304', null, '82', '4', '150.00', 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('305', null, '83', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('306', null, '83', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('307', null, '83', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('308', null, '83', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('309', null, '83', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('310', null, '83', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('311', null, '83', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('312', null, '83', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('313', null, '84', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('314', null, '84', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('315', null, '84', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('316', null, '84', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('317', null, '85', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('318', null, '85', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('319', null, '85', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('320', null, '85', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('321', null, '86', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('322', null, '86', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('323', null, '86', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('324', null, '86', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('325', null, '87', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('326', null, '87', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('327', null, '87', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('328', null, '87', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('329', null, '88', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('330', null, '88', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('331', null, '88', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('332', null, '88', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('333', null, '89', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('334', null, '89', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('335', null, '89', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('336', null, '89', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('337', null, '90', '1', '37.00', 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('338', null, '90', '2', '120.00', 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('339', null, '90', '3', '290.00', 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('340', null, '90', '4', '250.00', 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('341', null, '91', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('342', null, '91', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('343', null, '91', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('344', null, '91', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('345', null, '92', '1', null, 'Body temperature', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('346', null, '92', '2', null, 'Impulse rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('347', null, '92', '3', null, 'Respiration Rate', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('348', null, '92', '4', null, 'Blood pressure', '2022-12-12 02:08:42.402850', '2022-12-12 02:08:42.402850', '1', 'Samsethy', '2022-12-12 02:08:42.402850', null, null, '1', null, '53');
INSERT INTO `patient_vital_signs` VALUES ('349', null, '93', '1', null, 'Body temperature', '2022-12-16 14:10:24.000000', '2022-12-16 14:10:24.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('350', null, '93', '2', null, 'Impulse rate', '2022-12-16 14:10:24.000000', '2022-12-16 14:10:24.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('351', null, '93', '3', null, 'Respiration Rate', '2022-12-16 14:10:24.000000', '2022-12-16 14:10:24.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('352', null, '93', '4', null, 'Blood pressure', '2022-12-16 14:10:24.000000', '2022-12-16 14:10:24.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('353', null, '94', '1', null, 'Body temperature', '2023-01-01 14:54:26.000000', '2023-01-01 14:54:26.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('354', null, '94', '2', null, 'Impulse rate', '2023-01-01 14:54:26.000000', '2023-01-01 14:54:26.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('355', null, '94', '3', null, 'Respiration Rate', '2023-01-01 14:54:26.000000', '2023-01-01 14:54:26.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('356', null, '94', '4', null, 'Blood pressure', '2023-01-01 14:54:26.000000', '2023-01-01 14:54:26.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('357', null, '95', '1', null, 'Body temperature', '2023-01-01 16:01:05.000000', '2023-01-01 16:01:05.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('358', null, '95', '2', null, 'Impulse rate', '2023-01-01 16:01:05.000000', '2023-01-01 16:01:05.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('359', null, '95', '3', null, 'Respiration Rate', '2023-01-01 16:01:05.000000', '2023-01-01 16:01:05.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('360', null, '95', '4', null, 'Blood pressure', '2023-01-01 16:01:05.000000', '2023-01-01 16:01:05.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('361', null, '96', '1', null, 'Body temperature', '2023-01-01 16:08:04.000000', '2023-01-01 16:08:04.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('362', null, '96', '2', null, 'Impulse rate', '2023-01-01 16:08:04.000000', '2023-01-01 16:08:04.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('363', null, '96', '3', null, 'Respiration Rate', '2023-01-01 16:08:04.000000', '2023-01-01 16:08:04.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('364', null, '96', '4', null, 'Blood pressure', '2023-01-01 16:08:04.000000', '2023-01-01 16:08:04.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('365', null, '97', '1', null, 'Body temperature', '2023-01-01 16:15:20.000000', '2023-01-01 16:15:20.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('366', null, '97', '2', null, 'Impulse rate', '2023-01-01 16:15:20.000000', '2023-01-01 16:15:20.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('367', null, '97', '3', null, 'Respiration Rate', '2023-01-01 16:15:20.000000', '2023-01-01 16:15:20.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('368', null, '97', '4', null, 'Blood pressure', '2023-01-01 16:15:20.000000', '2023-01-01 16:15:20.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('369', null, '98', '1', '25.00', 'Body temperature', '2023-01-01 16:19:36.000000', '2023-01-01 16:19:36.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('370', null, '98', '2', '23.00', 'Impulse rate', '2023-01-01 16:19:36.000000', '2023-01-01 16:19:36.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('371', null, '98', '3', '16.00', 'Respiration Rate', '2023-01-01 16:19:36.000000', '2023-01-01 16:19:36.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('372', null, '98', '4', '11.00', 'Blood pressure', '2023-01-01 16:19:36.000000', '2023-01-01 16:19:36.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('373', null, '99', '1', null, 'Body temperature', '2023-01-01 16:27:42.000000', '2023-01-01 16:27:42.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('374', null, '99', '2', null, 'Impulse rate', '2023-01-01 16:27:42.000000', '2023-01-01 16:27:42.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('375', null, '99', '3', null, 'Respiration Rate', '2023-01-01 16:27:42.000000', '2023-01-01 16:27:42.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('376', null, '99', '4', null, 'Blood pressure', '2023-01-01 16:27:42.000000', '2023-01-01 16:27:42.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('377', null, '100', '1', null, 'Body temperature', '2023-01-02 22:15:53.000000', '2023-01-02 22:15:53.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('378', null, '100', '2', null, 'Impulse rate', '2023-01-02 22:15:53.000000', '2023-01-02 22:15:53.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('379', null, '100', '3', null, 'Respiration Rate', '2023-01-02 22:15:53.000000', '2023-01-02 22:15:53.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('380', null, '100', '4', null, 'Blood pressure', '2023-01-02 22:15:53.000000', '2023-01-02 22:15:53.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('381', null, '101', '1', null, 'Body temperature', '2023-01-05 09:57:54.000000', '2023-01-05 09:57:54.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('382', null, '101', '2', null, 'Impulse rate', '2023-01-05 09:57:54.000000', '2023-01-05 09:57:54.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('383', null, '101', '3', null, 'Respiration Rate', '2023-01-05 09:57:54.000000', '2023-01-05 09:57:54.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('384', null, '101', '4', null, 'Blood pressure', '2023-01-05 09:57:54.000000', '2023-01-05 09:57:54.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('385', null, '102', '1', '20.00', 'Body temperature', '2023-01-05 10:28:35.000000', '2023-01-05 10:28:35.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('386', null, '102', '2', '200.00', 'Impulse rate', '2023-01-05 10:28:35.000000', '2023-01-05 10:28:35.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('387', null, '102', '3', '100.00', 'Respiration Rate', '2023-01-05 10:28:35.000000', '2023-01-05 10:28:35.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('388', null, '102', '4', '120.00', 'Blood pressure', '2023-01-05 10:28:35.000000', '2023-01-05 10:28:35.000000', '1', 'Samsethy', null, null, null, '1', null, null);

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
  `cp_email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of persons
-- ----------------------------
INSERT INTO `persons` VALUES ('1', '1', 'Dr. Sinora', 'Sinora', 'Sin', 'F', null, null, '012567672', null, null, null, null, null, null, '', '0', null, null, null, null, null);
INSERT INTO `persons` VALUES ('2', '1', 'Dr. Phina', 'Phina', 'Chea', 'F', null, null, '0112225652', null, null, null, null, null, null, '', '0', null, null, null, null, null);
INSERT INTO `persons` VALUES ('50', '1', 'Ms Darany', 'Darany', 'Ms', 'F', '2022-10-10', '14', '012555653', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-01 10:19:48', null, null, null, null);
INSERT INTO `persons` VALUES ('51', '1', 'KKKKK', '', 'KKKKK', 'F', '2022-09-12', '14', '0125656765', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-03 17:39:11', null, null, null, null);
INSERT INTO `persons` VALUES ('52', '1', 'new name 77777', 'name client one', 'new', 'M', '2023-01-02', '14', '012555666', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-04 13:19:03', 'Samsethy', '1', '2023-01-01 15:55:42', null);
INSERT INTO `persons` VALUES ('53', '1', 'DDDDDD``', '', 'DDDDDD``', 'F', null, '14', '093488789', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-04 13:40:21', null, null, null, null);
INSERT INTO `persons` VALUES ('54', '1', 'DSDF AAA', 'AAA', 'DSDF', 'F', null, '14', '0112225653', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-04 13:41:53', null, null, null, null);
INSERT INTO `persons` VALUES ('55', '1', 'SOLIDAY', 'ONE', 'NEW', 'M', '2022-11-07', '14', '012333221', null, 'cddsg', 'fsdgdgfd', null, null, null, 'Samsethy', '1', '2022-12-04 14:09:38', 'Samsethy', '1', '2023-01-01 16:02:03', null);
INSERT INTO `persons` VALUES ('56', '1', 'Bun Sobana', 'Sobana', 'Bun', 'F', '2022-10-03', '14', '0115656565', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-06 11:24:58', null, null, null, null);
INSERT INTO `persons` VALUES ('57', '1', 'Borya', '', 'Borya', 'F', '2022-09-05', '14', '0125689898', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-06 12:02:15', null, null, null, null);
INSERT INTO `persons` VALUES ('58', '1', 'DDGDGDGD', '', 'DDGDGDGD', 'F', '2022-12-06', '14', '0125686455', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-07 17:20:23', null, null, null, null);
INSERT INTO `persons` VALUES ('59', '1', 'Sonary', '', 'Sonary', 'F', '2022-08-02', '14', '0102256765', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-08 09:52:09', null, null, null, null);
INSERT INTO `persons` VALUES ('60', '1', 'Ginara', '', 'Ginara', 'F', '2022-09-05', '14', '01023765423', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-08 10:03:45', null, null, null, null);
INSERT INTO `persons` VALUES ('61', '1', 'Funny name', 'name', 'Funny', 'F', '2022-10-10', '14', '011235768', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-08 11:01:25', null, null, null, null);
INSERT INTO `persons` VALUES ('62', '1', 'some one', 'one', 'some', 'M', '2022-06-06', '14', '012565656', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-09 10:04:17', 'Samsethy', '1', '2023-01-01 14:41:17', null);
INSERT INTO `persons` VALUES ('63', '1', 'KKKKK', '', 'KKKKK', 'F', null, '14', '01025657667', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-10 19:10:53', null, null, null, null);
INSERT INTO `persons` VALUES ('64', '1', 'KKK1', '', 'KKK1', 'F', null, '14', '01245656', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-10 19:14:08', null, null, null, null);
INSERT INTO `persons` VALUES ('65', '1', 'HHH2', '', 'HHH2', 'F', null, '14', '011023255', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-10 19:23:16', null, null, null, null);
INSERT INTO `persons` VALUES ('66', '1', 'HKKK', '', 'HKKK', 'F', null, '14', '01245657', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-10 19:25:59', null, null, null, null);
INSERT INTO `persons` VALUES ('67', '1', 'GGG1', '', 'GGG1', 'M', null, '14', '0125765676', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-10 19:30:24', null, null, null, null);
INSERT INTO `persons` VALUES ('68', '1', 'sfddgfdgdfgdfg', '', 'sfddgfdgdfgdfg', 'F', null, '14', '012234353', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-10 20:53:28', null, null, null, null);
INSERT INTO `persons` VALUES ('69', '1', 'sdgdfhfdhgfh', '', 'sdgdfhfdhgfh', 'F', null, '14', '012456576', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-10 20:55:17', null, null, null, null);
INSERT INTO `persons` VALUES ('70', '1', 'sdfdggdf', '', 'sdfdggdf', 'F', '2022-08-08', '14', '012456546', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-11 11:46:44', null, null, null, null);
INSERT INTO `persons` VALUES ('71', '1', 'sfsdgfdgd', '', 'sfsdgfdgd', 'F', null, '14', '012565676', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-11 12:53:57', null, null, null, null);
INSERT INTO `persons` VALUES ('72', '1', 'HJKJKJK', '', 'HJKJKJK', 'F', null, '14', '010566767', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-12 01:44:14', null, null, null, null);
INSERT INTO `persons` VALUES ('73', '1', 'vikara', '', 'vikara', 'M', null, '14', '0102343322', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-16 14:10:24', null, null, null, null);
INSERT INTO `persons` VALUES ('74', '1', 'some one', null, null, 'M', '2022-10-03', null, '012565656', null, null, null, null, null, null, 'Samsethy', '1', '2023-01-01 12:42:35', null, null, null, null);
INSERT INTO `persons` VALUES ('75', '1', 'some one', null, null, 'M', '2022-06-06', null, '012565656', null, null, null, null, null, null, 'Samsethy', '1', '2023-01-01 12:42:54', null, null, null, null);
INSERT INTO `persons` VALUES ('76', '1', 'some one', null, null, 'M', '2022-06-06', null, '012565656', null, null, 'admingmailcom', null, null, null, 'Samsethy', '1', '2023-01-01 12:45:07', null, null, null, null);
INSERT INTO `persons` VALUES ('77', '1', 'some one', null, null, 'M', '1998-03-02', null, '012565656', null, null, null, null, null, null, 'Samsethy', '1', '2023-01-01 12:45:19', null, null, null, null);
INSERT INTO `persons` VALUES ('78', '1', 'NEW ONE 555', null, null, 'M', '2022-09-05', null, '012998898', null, null, null, null, null, null, 'Samsethy', '1', '2023-01-01 12:46:04', null, null, null, null);
INSERT INTO `persons` VALUES ('79', '1', 'MMMMMM', '', 'MMMMMM', 'F', '2007-07-10', '14', '012455465', null, null, null, null, null, null, 'Samsethy', '1', '2023-01-01 14:54:26', null, null, null, null);
INSERT INTO `persons` VALUES ('80', '1', 'HEHEERER', '', 'HEHEERER', 'F', null, '14', '0122323243', null, null, null, null, null, null, 'Samsethy', '1', '2023-01-01 16:01:05', null, null, null, null);
INSERT INTO `persons` VALUES ('81', '1', 'different changed name', 'changed name', 'different', 'F', '2022-11-07', '14', '01255666756', null, null, null, null, null, null, 'Samsethy', '1', '2023-01-01 16:08:04', null, null, null, null);
INSERT INTO `persons` VALUES ('82', '1', 'sovannary 222', '', 'sovannary', 'M', '2022-06-02', '14', '093488777', null, null, null, null, null, null, 'Samsethy', '1', '2023-01-01 16:15:20', 'Samsethy', '1', '2023-01-01 16:33:51', null);
INSERT INTO `persons` VALUES ('83', '1', 'Chea Dane 7777', 'Dane', 'Chea', 'M', '2022-08-08', '14', '012456565', null, null, null, null, null, null, 'Samsethy', '1', '2023-01-01 16:19:36', 'Samsethy', '1', '2023-01-01 16:44:08', null);
INSERT INTO `persons` VALUES ('84', '1', 'Chan raingey', '', 'GGGGG1', 'M', '2023-01-09', '14', '012546565', null, null, null, null, null, null, 'Samsethy', '1', '2023-01-01 16:27:42', 'Samsethy', '1', '2023-01-01 16:44:49', null);
INSERT INTO `persons` VALUES ('85', '1', 'Liza', '', 'Liza', 'M', '2022-11-07', '14', '01234546', null, null, null, null, null, null, 'Samsethy', '1', '2023-01-02 22:15:53', 'Samsethy', '1', '2023-01-02 22:34:18', null);
INSERT INTO `persons` VALUES ('86', '1', 'Chan Samnang', '', 'dsfsfdsf', 'M', '2022-09-06', '14', '012234324', null, null, null, null, null, null, 'Samsethy', '1', '2023-01-05 09:57:54', 'Samsethy', '1', '2023-01-05 09:59:33', null);
INSERT INTO `persons` VALUES ('87', '1', 'Dyna', '', 'Dyna', 'F', '2022-08-08', '14', '0124565464', null, null, null, null, null, null, 'Samsethy', '1', '2023-01-05 10:28:35', null, null, null, null);

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
-- Table structure for `queue_ticket_control`
-- ----------------------------
DROP TABLE IF EXISTS `queue_ticket_control`;
CREATE TABLE `queue_ticket_control` (
  `branch_id` int(10) NOT NULL,
  `last_id` int(10) NOT NULL,
  `department_id` int(10) DEFAULT NULL,
  `prefix` varchar(10) DEFAULT NULL,
  `q_date` date DEFAULT NULL,
  `com_branch_id` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of queue_ticket_control
-- ----------------------------
INSERT INTO `queue_ticket_control` VALUES ('1', '3', '2', 'P', '2022-12-07', '1');
INSERT INTO `queue_ticket_control` VALUES ('1', '4', '1', 'D', '2022-12-07', '1');
INSERT INTO `queue_ticket_control` VALUES ('1', '3', '3', 'P', '2022-12-07', '1');
INSERT INTO `queue_ticket_control` VALUES ('1', '3', '2', 'D', '2022-12-08', '1');
INSERT INTO `queue_ticket_control` VALUES ('1', '10', '2', 'D', '2022-12-09', '1');
INSERT INTO `queue_ticket_control` VALUES ('1', '2', '3', 'P', '2022-12-09', '1');
INSERT INTO `queue_ticket_control` VALUES ('1', '9', '2', 'D', '2022-12-10', '1');
INSERT INTO `queue_ticket_control` VALUES ('1', '1', '1', 'G', '2022-12-10', '1');
INSERT INTO `queue_ticket_control` VALUES ('1', '1', '3', 'P', '2022-12-10', '1');
INSERT INTO `queue_ticket_control` VALUES ('1', '8', '2', 'D', '2022-12-11', '1');
INSERT INTO `queue_ticket_control` VALUES ('1', '1', '3', 'P', '2022-12-12', '1');
INSERT INTO `queue_ticket_control` VALUES ('1', '1', '2', 'D', '2022-12-16', '1');
INSERT INTO `queue_ticket_control` VALUES ('1', '1', '2', 'D', '2022-12-17', '1');
INSERT INTO `queue_ticket_control` VALUES ('1', '1', '2', 'D', '2022-12-29', '1');
INSERT INTO `queue_ticket_control` VALUES ('1', '2', '2', 'D', '2023-01-01', '1');
INSERT INTO `queue_ticket_control` VALUES ('1', '2', '3', 'P', '2023-01-01', '1');
INSERT INTO `queue_ticket_control` VALUES ('1', '2', '3', 'P', '2023-01-02', '1');
INSERT INTO `queue_ticket_control` VALUES ('1', '1', '2', 'D', '2023-01-02', '1');
INSERT INTO `queue_ticket_control` VALUES ('1', '1', '1', 'G', '2023-01-03', '1');
INSERT INTO `queue_ticket_control` VALUES ('1', '2', '2', 'D', '2023-01-05', '1');

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
-- Table structure for `service_items`
-- ----------------------------
DROP TABLE IF EXISTS `service_items`;
CREATE TABLE `service_items` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `name` varchar(250) NOT NULL,
  `description` varchar(250) NOT NULL,
  `create_uid` int(10) NOT NULL,
  `create_user` varchar(50) NOT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`,`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of service_items
-- ----------------------------
INSERT INTO `service_items` VALUES ('1', '1', 'Skin cleaning', 'Skin cleaning', '1', 'Admin', null, null, null, null);
INSERT INTO `service_items` VALUES ('2', '1', 'Facial treatment', 'Facial Treatment', '1', 'Admin', null, null, null, null);

-- ----------------------------
-- Table structure for `service_queue`
-- ----------------------------
DROP TABLE IF EXISTS `service_queue`;
CREATE TABLE `service_queue` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `ticket_number` varchar(15) NOT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_user` varchar(50) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `client_id` int(10) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL COMMENT 'section_id is department_id or id of the service server block. For example, banking has Customer Service block, or Tell''s counter block',
  `client_name` varchar(50) DEFAULT NULL,
  `q_date` date NOT NULL,
  `consultant_id` int(10) DEFAULT NULL,
  `branch_id` int(10) DEFAULT NULL,
  `appt_id` int(10) DEFAULT NULL,
  `person_id` int(10) DEFAULT NULL,
  `status_id` int(10) DEFAULT NULL,
  `priority` varchar(35) DEFAULT NULL,
  `schedule_type` varchar(35) DEFAULT NULL,
  `remarks` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of service_queue
-- ----------------------------
INSERT INTO `service_queue` VALUES ('55', 'D100010', '2023-01-02 22:24:27.234849', 'Samsethy', '1', '77', '2', null, '2022-12-09', '1', '1', '60', '57', '1', null, 'On Demand', 'Notes about the patient');
INSERT INTO `service_queue` VALUES ('58', 'D100003', '2023-01-02 22:24:27.234849', 'Samsethy', '1', '83', '2', null, '2022-12-10', null, '1', '70', '63', '1', null, 'On Demand', null);
INSERT INTO `service_queue` VALUES ('59', 'D100004', '2023-01-02 22:24:27.234849', 'Samsethy', '1', '84', '2', null, '2022-12-10', '1', '1', null, '64', '1', null, 'On Demand', null);
INSERT INTO `service_queue` VALUES ('60', 'D100005', '2023-01-02 22:24:27.234849', 'Samsethy', '1', '85', '2', null, '2022-12-10', null, '1', '72', '65', '1', null, 'On Demand', null);
INSERT INTO `service_queue` VALUES ('61', 'D100006', '2023-01-02 22:24:27.234849', 'Samsethy', '1', '85', '2', null, '2022-12-10', null, '1', '72', '65', '1', null, 'On Demand', null);
INSERT INTO `service_queue` VALUES ('62', 'G100001', '2023-01-02 22:24:27.234849', 'Samsethy', '1', '85', '1', null, '2022-12-10', null, '1', '72', '65', '1', null, 'On Demand', null);
INSERT INTO `service_queue` VALUES ('63', 'D100007', '2023-01-02 22:24:27.234849', 'Samsethy', '1', '85', '2', null, '2022-12-10', null, '1', '72', '65', '1', null, 'On Demand', null);
INSERT INTO `service_queue` VALUES ('64', 'D100008', '2023-01-02 22:24:27.234849', 'Samsethy', '1', '86', '2', null, '2022-12-10', null, '1', '73', '66', '1', null, 'On Demand', null);
INSERT INTO `service_queue` VALUES ('65', 'P100001', '2023-01-02 22:24:27.234849', 'Samsethy', '1', '87', '3', null, '2022-12-10', null, '1', '74', '67', '1', null, 'On Demand', null);
INSERT INTO `service_queue` VALUES ('66', 'D100009', '2023-01-02 22:24:27.234849', 'Samsethy', '1', '88', '2', null, '2022-12-10', null, null, '89', '68', '1', null, 'On Demand', null);
INSERT INTO `service_queue` VALUES ('67', 'D100001', '2023-01-02 22:24:27.234849', 'Samsethy', '1', '90', '2', null, '2022-12-11', '2', null, '91', '70', '1', null, 'On Demand', null);
INSERT INTO `service_queue` VALUES ('68', 'D100002', '2023-01-02 22:24:27.234849', 'Samsethy', '1', '89', '2', null, '2022-12-11', null, null, '87', '69', '1', null, 'On Demand', null);
INSERT INTO `service_queue` VALUES ('69', 'D100003', '2023-01-02 22:24:27.234849', 'Samsethy', '1', '89', '2', null, '2022-12-11', null, null, '83', '69', '1', null, 'On Demand', null);
INSERT INTO `service_queue` VALUES ('70', 'D100004', '2023-01-02 22:24:27.234849', 'Samsethy', '1', '89', '2', null, '2022-12-11', null, null, '86', '69', '1', null, 'On Demand', null);
INSERT INTO `service_queue` VALUES ('71', 'D100005', '2023-01-02 22:24:27.234849', 'Samsethy', '1', '91', '2', null, '2022-12-11', '1', '1', '92', '71', '1', null, 'On Demand', 'asdsfsdgdgdfg');
INSERT INTO `service_queue` VALUES ('72', 'D100006', '2023-01-02 22:24:27.234849', 'Samsethy', '1', '91', '2', null, '2022-12-11', '2', '1', '92', '71', '1', null, 'On Demand', 'asdsfsdgdgdfg');
INSERT INTO `service_queue` VALUES ('73', 'D100007', '2023-01-02 22:24:27.234849', 'Samsethy', '1', '91', '2', null, '2022-12-11', '2', '1', '92', '71', '1', null, 'On Demand', 'asdsfsdgdgdfg');
INSERT INTO `service_queue` VALUES ('74', 'D100008', '2023-01-02 22:24:27.234849', 'Samsethy', '1', '91', '2', null, '2022-12-11', '2', '1', '92', '71', '1', null, 'On Demand', 'asdsfsdgdgdfg');
INSERT INTO `service_queue` VALUES ('75', 'P100001', '2023-01-02 22:24:27.234849', 'Samsethy', '1', '92', '3', null, '2022-12-12', '1', '1', null, '72', '1', null, 'On Demand', null);
INSERT INTO `service_queue` VALUES ('76', 'D100001', '2023-01-02 22:24:27.234849', 'Samsethy', '1', '93', '2', null, '2022-12-16', null, '1', '95', '73', '1', null, 'On Demand', null);
INSERT INTO `service_queue` VALUES ('87', 'D100001', '2023-01-05 09:58:10.000000', 'Samsethy', '1', '101', '2', null, '2023-01-05', '1', '1', '109', '86', '1', null, 'On Demand', null);
INSERT INTO `service_queue` VALUES ('88', 'D100002', '2023-01-05 10:30:13.000000', 'Samsethy', '1', '102', '2', null, '2023-01-05', '1', '1', '110', '87', '1', null, 'On Demand', 'xcvdcgdgdf');

-- ----------------------------
-- Table structure for `temp`
-- ----------------------------
DROP TABLE IF EXISTS `temp`;
CREATE TABLE `temp` (
  `group_name` varchar(150) DEFAULT NULL,
  `code` varchar(150) DEFAULT NULL,
  `name` varchar(150) DEFAULT NULL,
  `UOM` varchar(50) DEFAULT NULL,
  `unit_id` int(10) DEFAULT NULL,
  `group_id` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of temp
-- ----------------------------
INSERT INTO `temp` VALUES ('Topical Product', 'TP0066', 'Bioselenium Shampoo 100ml', 'Bottle', '2', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0002', 'Fixderma Moisturizing Cream', 'Tube', '3', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0003', 'Tidact gel', 'Tube', '3', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0001', 'Tacroz', 'Tube', '3', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0004', 'Disut-H Cream 15g', 'Tube', '3', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0005', 'Tacopic 0.1%', 'Tube', '3', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0006', 'Disuf-B cream 15g', 'Tube', '3', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0007', 'Candid-B Cream', 'Tube', '3', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0008', 'Candid Cream', 'Tube', '3', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0009', 'Elosone Cream', 'Tube', '3', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0010', 'Cloderm Cream 15g', 'Tube', '3', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0011', 'Beprosalic Ointment ', 'Tube', '3', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0012', 'Rozex gel 50g', 'Tube', '3', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0013', 'Beprogel Lotion 30ml', 'Tube', '3', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0014', 'Virest Cream', 'Tube', '3', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0015', 'H-cort Cream', 'Tube', '3', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0016', 'Ecocort Cream', 'Tube', '3', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0017', 'Disuf Cream', 'Tube', '3', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0018', 'Supirocine Ointment 5g', 'Tube', '3', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0019', 'Akne-Derm 5% Cream', 'Tube', '3', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0020', 'Diprosalic Pommade', 'Tube', '3', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0021', 'Neutriderm Moisturizing Lotion 125ml', 'Bottle', '2', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0022', 'Dermavive Nappy Rash Cream', 'Bottle', '2', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0023', 'Fixderma Moisturizing Lotion', 'Bottle', '2', '1');
INSERT INTO `temp` VALUES ('Equipment', 'EP0001', 'Serum physiodose 5ml', 'Tube', '3', '3');
INSERT INTO `temp` VALUES ('Oral Medicine', 'OM0001', 'Prednisolone', 'Tablet', '4', '2');
INSERT INTO `temp` VALUES ('Oral Medicine', 'OM0002', 'Acnotin', 'Tablet', '4', '2');
INSERT INTO `temp` VALUES ('Oral Medicine', 'OM0003', 'Doxycycline cap 100mg', 'Tablet', '4', '2');
INSERT INTO `temp` VALUES ('Oral Medicine', 'OM0004', 'Promethazine 25mg', 'Tablet', '4', '2');
INSERT INTO `temp` VALUES ('Equipment', 'EP0002', 'Syringe 3ml Vinahankook B/100P', 'Tube', '3', '3');
INSERT INTO `temp` VALUES ('Equipment', 'EP0003', 'Syringe 1ml Vinahankook B/100P', 'Tube', '3', '3');
INSERT INTO `temp` VALUES ('Equipment', 'EP0004', 'Syringe 5ml-25G Vinahankook B/100P', 'Tube', '3', '3');
INSERT INTO `temp` VALUES ('Equipment', 'EP0005', 'Syringe 10ml Vinahankook B/100P', 'Tube', '3', '3');
INSERT INTO `temp` VALUES ('Equipment', 'EP0006', 'Glove Sterile 7.0', 'Set', '5', '3');
INSERT INTO `temp` VALUES ('Injection', 'IN0001', 'Nss 500ml China ', 'Bottle', '2', '4');
INSERT INTO `temp` VALUES ('Equipment', 'EP0007', 'Compress Sterile 20*20cm', 'Pack', '6', '3');
INSERT INTO `temp` VALUES ('Equipment', 'EP0008', 'Catheter 18G-Healflon IND(100/BOX)', 'Box', '7', '3');
INSERT INTO `temp` VALUES ('Equipment', 'EP0009', 'Catheter 24G-Healflon B/100unit', 'Box', '7', '3');
INSERT INTO `temp` VALUES ('Equipment', 'EP0010', 'Nipro Catherter24G*3/4 B/50 ', 'Box', '7', '3');
INSERT INTO `temp` VALUES ('Equipment', 'EP0011', 'Trouss china(R, orange color) P/25', 'Pack', '6', '3');
INSERT INTO `temp` VALUES ('Equipment', 'EP0012', 'Nipro Needle 18G B/100', 'Box', '7', '3');
INSERT INTO `temp` VALUES ('Equipment', 'EP0013', 'Nipro Needle 21G B/100', 'Box', '7', '3');
INSERT INTO `temp` VALUES ('Equipment', 'EP0014', 'Nipro Needle 30G B/100', 'Box', '7', '3');
INSERT INTO `temp` VALUES ('Equipment', 'EP0015', 'Scalp Vein set24 B/50', 'Box', '7', '3');
INSERT INTO `temp` VALUES ('Equipment', 'EP0016', 'Betadine dermique 125ml 10%Fr ', 'Bottle', '2', '3');
INSERT INTO `temp` VALUES ('Equipment', 'EP0017', 'Wellgard no powder size S ', 'Box', '7', '3');
INSERT INTO `temp` VALUES ('Equipment', 'EP0018', 'Wellgard no powder size M', 'Box', '7', '3');
INSERT INTO `temp` VALUES ('Equipment', 'EP0019', 'Safety box 5L', 'Box', '7', '3');
INSERT INTO `temp` VALUES ('Equipment', 'EP0020', 'Vaseline Petrolatum Gauze B/10', 'Box', '7', '3');
INSERT INTO `temp` VALUES ('Equipment', 'EP0021', 'Innoplastic B/100', 'Box', '7', '3');
INSERT INTO `temp` VALUES ('Equipment', 'EP0022', 'CRL-aperture adhesive plaster 18cm*4cm', 'Box', '7', '3');
INSERT INTO `temp` VALUES ('Equipment', 'EP0023', 'Adhesive plaster with holes', 'Box', '7', '3');
INSERT INTO `temp` VALUES ('Equipment', 'EP0024', 'Vaseline pet jelly orig 100ml/fl', 'Bottle', '2', '3');
INSERT INTO `temp` VALUES ('Equipment', 'EP0025', 'Needle dermapen VIP 42 ', 'Box', '7', '3');
INSERT INTO `temp` VALUES ('Injection', 'IN0002', 'Prednisolone USA 1FL', 'Bottle', '2', '4');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0067', 'KTC Scalp solution', 'Bottle', '2', '1');
INSERT INTO `temp` VALUES ('Oral Medicine', 'OM0005', 'Neocilor ', 'Tablet', '4', '2');
INSERT INTO `temp` VALUES ('Oral Medicine', 'OM0006', 'Telfast Hd 180mg', 'Tablet', '4', '2');
INSERT INTO `temp` VALUES ('Oral Medicine', 'OM0007', 'Atarax 25mg', 'Tablet', '4', '2');
INSERT INTO `temp` VALUES ('Oral Medicine', 'OM0008', 'Cloxacap 500mg', 'Tablet', '4', '2');
INSERT INTO `temp` VALUES ('Oral Medicine', 'OM0009', 'Terbinaforce 250mg', 'Tablet', '4', '2');
INSERT INTO `temp` VALUES ('Oral Medicine', 'OM0010', 'Inox 100mg', 'Tablet', '4', '2');
INSERT INTO `temp` VALUES ('Oral Medicine', 'OM0011', 'Zithrosun-250', 'Tablet', '4', '2');
INSERT INTO `temp` VALUES ('Oral Medicine', 'OM0012', 'Augmentin 625mg', 'Tablet', '4', '2');
INSERT INTO `temp` VALUES ('Oral Medicine', 'OM0013', 'Codalgin Forte 500', 'Tablet', '4', '2');
INSERT INTO `temp` VALUES ('Oral Medicine', 'OM0014', 'Alpha Choay 4.15mg', 'Tablet', '4', '2');
INSERT INTO `temp` VALUES ('Oral Medicine', 'OM0015', 'Esome 40mg', 'Tablet', '4', '2');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0025', 'Deriva MS gel 15g', 'Tube', '3', '1');
INSERT INTO `temp` VALUES ('Injection', 'IN0003', 'Medi-Ceftriaxone inj', 'Vial', '8', '4');
INSERT INTO `temp` VALUES ('Injection', 'IN0004', 'Clavox 1.2g IV', 'FL', '9', '4');
INSERT INTO `temp` VALUES ('Injection', 'IN0005', 'Lidocaine 2% 50ml', 'FL', '9', '4');
INSERT INTO `temp` VALUES ('Injection', 'IN0006', 'Tanganil 500mg/5ml IV', 'Amp', '10', '4');
INSERT INTO `temp` VALUES ('Injection', 'IN0007', 'Met-Sil 2ml', 'Amp', '10', '4');
INSERT INTO `temp` VALUES ('Injection', 'IN0008', 'Para Kabi 1000mg/100ml', 'Bottle', '2', '4');
INSERT INTO `temp` VALUES ('Injection', 'IN0009', 'Anadol Inj 100mg/2ml', 'Amp', '10', '4');
INSERT INTO `temp` VALUES ('Injection', 'IN0010', 'Remopain 3% Inj', 'Amp', '10', '4');
INSERT INTO `temp` VALUES ('Injection', 'IN0011', 'Adrenaline Inj 1ml', 'Amp', '10', '4');
INSERT INTO `temp` VALUES ('Injection', 'IN0012', 'Dexamedico inj', 'Amp', '10', '4');
INSERT INTO `temp` VALUES ('Injection', 'IN0013', 'Genta inj-uto', 'Amp', '10', '4');
INSERT INTO `temp` VALUES ('Injection', 'IN0014', 'Hydromark-100', 'Vial', '8', '4');
INSERT INTO `temp` VALUES ('Injection', 'IN0015', 'VIK 1-vitamin K1 inj 10mg/1ml', 'Amp', '10', '4');
INSERT INTO `temp` VALUES ('Injection', 'IN0016', 'Onasia', 'Amp', '10', '4');
INSERT INTO `temp` VALUES ('Injection', 'IN0017', 'Exacyl inj', 'Amp', '10', '4');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0026', 'Effaclar Duo(+) 40ml', 'Tube', '3', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0027', 'Anthelios Anti-shine', 'Tube', '3', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0028', 'Anthelios Fluid invisible', 'Tube', '3', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0029', 'Cicaplast gel B5 40ml', 'Tube', '3', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0030', 'Cicaplast Baume B5 100ml', 'Tube', '3', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0031', 'Water Max Milk Cleanser 1200ml', 'Box', '7', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0032', 'Counteractive Bubble Clear 150ml', 'Bottle', '2', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0033', 'Alpha Cleansing Foam 1200ml', 'Bottle', '2', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0034', 'Peppermint Cool plus modeling mask 1kg', 'Pack', '6', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0035', 'Gold Plus Modeling mask 1kg', 'Pack', '6', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0036', 'Marine Aqua Plus Modeling mask 1kg', 'Pack', '6', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0037', 'Azulene Complex Ampoule 72 150ml', 'Bottle', '2', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0038', 'EGF Complex Ampoule 50 150ml', 'Bottle', '2', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0039', 'Hyaluron Complex Ampoule 62 150ml', 'Bottle', '2', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0040', 'History Conductive Gel 500ml ', 'Box', '7', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0041', 'Histo HQ Cream 1000ml', 'Box', '7', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0042', 'Histo Aloe Vera gel 1200ml', 'Bottle', '2', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0043', 'Gamma Crystal Serum 500ml', 'Bottle', '2', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0044', 'Beta Fresh toner 1200ml', 'Bottle', '2', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0045', 'Premium renewal Essence 500ml', 'Bottle', '2', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0046', 'Premium Timeless Cream 250g', 'Box', '7', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0047', 'Premium Eye Cream 250g', 'Box', '7', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0048', 'Whiteness Lightening Serum 80ml', 'Bottle', '2', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0049', 'Triangle Peel PA 80ml', 'Bottle', '2', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0050', 'Triangle Peel PB 80ml', 'Bottle', '2', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0051', 'Delta Active Cream 500ml', 'Box', '7', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0052', 'Glycolic Skin Peel 70% 480ml', 'Bottle', '2', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0053', 'Lactic acid Peel 70% 480ml', 'Bottle', '2', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0054', 'Combination Peel 240ml', 'Bottle', '2', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0055', 'Salicylic Peel 30% 120ml', 'Bottle', '2', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0056', 'Ice Jeju Aloe 300ml(Thefaceshop)', 'Box', '7', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0057', 'Aloe 99% 300ml(Thefaceshop)', 'Box', '7', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0058', 'Smart Peeling Honey Scrub (thefaceshop)', 'Tube', '3', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0059', 'Smart Peeling white jewel', 'Tube', '3', '1');
INSERT INTO `temp` VALUES ('Equipment', 'EP0026', 'Centrifuge Virtuose', 'Box', '7', '3');
INSERT INTO `temp` VALUES ('Equipment', 'EP0027', 'PRP tube 9ml Virtuose', 'Tube', '3', '3');
INSERT INTO `temp` VALUES ('Equipment', 'EP0028', 'Dermapen A6', 'Box', '7', '3');
INSERT INTO `temp` VALUES ('Equipment', 'EP0029', 'Needle Dermapen A6 nano', 'Pack', '6', '3');
INSERT INTO `temp` VALUES ('Equipment', 'EP0030', 'Needle Dermapen A6 42', 'Pack', '6', '3');
INSERT INTO `temp` VALUES ('Equipment', 'EP0031', 'Skin marker', 'Pack', '6', '3');
INSERT INTO `temp` VALUES ('Equipment', 'EP0032', 'Cotton Facial pad', 'Pack', '6', '3');
INSERT INTO `temp` VALUES ('Equipment', 'EP0033', 'Acne extraction', 'Pack', '6', '3');
INSERT INTO `temp` VALUES ('Equipment', 'EP0034', 'Cautery ', 'Pack', '6', '3');
INSERT INTO `temp` VALUES ('Equipment', 'EP0035', '???? Peel', 'Pack', '6', '3');
INSERT INTO `temp` VALUES ('Injection', 'IN0018', 'Meso GTM Gold cell PDRN8% (Box/10 3,3ml)', 'Bottle', '2', '4');
INSERT INTO `temp` VALUES ('Injection', 'IN0019', 'Meso Restructurer Innoaesthetic (B/4 5ml)', 'Bottle', '2', '4');
INSERT INTO `temp` VALUES ('Injection', 'IN0020', 'Meso Redness ID innoaethetic (B/4 2.5ml)', 'Bottle', '2', '4');
INSERT INTO `temp` VALUES ('Injection', 'IN0021', 'Meso Melatocin Essence Melasma (B/10 5ml)', 'Bottle', '2', '4');
INSERT INTO `temp` VALUES ('Injection', 'IN0022', 'Meso GTM mela cell 3% melasma (B/10 3,5ml)', 'Bottle', '2', '4');
INSERT INTO `temp` VALUES ('Injection', 'IN0023', 'Placenta Melsmon 2ml ', 'Amp', '10', '4');
INSERT INTO `temp` VALUES ('Injection', 'IN0024', 'Placenta Lannec 2ml', 'Amp', '10', '4');
INSERT INTO `temp` VALUES ('Injection', 'IN0025', 'Botulax 100UI ', 'Bottle', '2', '4');
INSERT INTO `temp` VALUES ('Injection', 'IN0027', 'AMC Slimming Drip', 'Set', '5', '4');
INSERT INTO `temp` VALUES ('Injection', 'IN0026', 'Japan Whitening Drip', 'Set', '5', '4');
INSERT INTO `temp` VALUES ('Equipment', 'EP0036', 'Meso Multi Needle', 'Pack', '6', '3');
INSERT INTO `temp` VALUES ('Injection', 'IN0028', 'Sivkoit (Triamcinolone) 80mg', 'Amp', '10', '4');
INSERT INTO `temp` VALUES ('Injection', 'IN0029', 'Para Inj 300mg ', 'Amp', '10', '4');
INSERT INTO `temp` VALUES ('Injection', 'IN0030', 'NSS 100ml Thai', 'FL', '9', '4');
INSERT INTO `temp` VALUES ('Injection', 'IN0031', 'NSS 500ml Thai', 'FL', '9', '4');
INSERT INTO `temp` VALUES ('Equipment', 'EP0037', 'Surgical cap', 'Pack', '6', '3');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0060', 'Skinoren Cream 30g', 'Tube', '3', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0061', 'Skarfix-TX cream', 'Tube', '3', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0062', 'Isis Teen Derm gel sensitive 100ml', 'Bottle', '2', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0063', 'Isis Neotone Gel 150ml', 'Tube', '3', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0064', 'Isis Ruboril Expert S', 'Tube', '3', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0065', 'Isis Aqua Ruboril 250ml', 'Bottle', '2', '1');
INSERT INTO `temp` VALUES ('Injection', 'IN0032', 'NSS 250ml korea', 'FL', '9', '4');
INSERT INTO `temp` VALUES ('Injection', 'IN0033', 'Neuramis gold', 'Box', '7', '4');
INSERT INTO `temp` VALUES ('Equipment', 'EP0038', 'Needle 30G 4mm', 'pcs', '11', '3');
INSERT INTO `temp` VALUES ('Injection', 'IN0034', 'D5W Thai 500ml', 'FL', '9', '4');
INSERT INTO `temp` VALUES ('Injection', 'IN0035', 'Lactate Thai 500ml', 'FL', '9', '4');
INSERT INTO `temp` VALUES ('Injection', 'IN0036', 'D10W Thai ', 'FL', '9', '4');
INSERT INTO `temp` VALUES ('Equipment', 'EP0039', 'Glove Sterile 6.5', 'Pack', '6', '3');
INSERT INTO `temp` VALUES ('Equipment', 'EP0040', 'Nipro Needle 30G 13mm', 'Box', '7', '3');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0068', 'Saforelle soin', 'Bottle', '2', '1');
INSERT INTO `temp` VALUES ('Sale product', 'SP0001', 'ISIS Aqua Ruboril 400ml', 'Bottle', '2', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0002', 'ISIS Ketoplast Cracks 40ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0003', 'ISIS Ketoplast Scars SPF50+ 40ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0004', 'ISIS Neotone Aqua 250ml', 'Bottle', '2', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0005', 'ISIS Neotone Body 100ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0006', 'ISIS Neotone Eyes 15ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0007', 'ISIS Neotone Prevent SPF50+ Mineral Tinted', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0008', 'ISIS Neotone Radiance SPF50+ 30ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0009', 'ISIS Neotone Sensitive 30ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0011', 'ISIS Ruboril Expert M 40ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0012', 'ISIS Ruboril Expert SPF 50+ 40ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0013', 'ISIS Ruboril Expert Intense 15ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0014', 'ISIS Ruboril Expert Lotion 250ml', 'Bottle', '2', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0015', 'ISIS Secalia AHA 200ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0016', 'ISIS Secalia Balm 200ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0017', 'ISIS Secalia Ultra 200ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0018', 'ISIS Sensylia 24h 40ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0019', 'ISIS Sensylia 24h Legere 40ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0020', 'ISIS Sensylia Aqua 100ml', 'Bottle', '2', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0021', 'ISIS Sensylia Gelee 250ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0022', 'ISIS Suavigel 40ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0023', 'ISIS Teen Derm Aqua 100ml', 'Bottle', '2', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0024', 'ISIS Teen Derm Aqua 250ml', 'Bottle', '2', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0025', 'ISIS Teen Derm Alpha Pure 30ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0026', 'ISIS Teen Derm Gel 40ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0027', 'ISIS Teen Derm Gel 150ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0028', 'ISIS Teen Derm Gel Sensitive 250ml', 'Bottle', '2', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0029', 'ISIS Teen Derm Hydra 40ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0030', 'ISIS Teen Derm K 30ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0031', 'ISIS Teen Derm K Concentrate 30ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0032', 'ISIS Urelia 10 150ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0033', 'ISIS Urelia 50 40ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0034', 'ISIS Urelia Gel 200ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0035', 'ISIS SPF50+ Day Secure Invisible', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0036', 'ISIS SPF50+ Invisible Fluid 40ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0037', 'ISIS SPF50+ Light Tinted Fluid 40ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0038', 'ISIS SPF50+ Tinted Mineral Cream', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0039', 'ISIS SPF50+ Mineral Cream 40ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0040', 'ISIS SPF30+ Dry Touch 40ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0041', 'ISIS SPF80 Invisible cream 40ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0042', 'ISIS Vitiskin 50ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0043', 'Noreva Norelift Day Cream', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0044', 'Noreva Actipur BB light 30ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0045', 'Noreva Actipur BB Golden 30ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0046', 'Noreva Actipur Cleansing Gel 150ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0047', 'Noreva Exfoliac Global 6 30ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0048', 'Noreva Exfoliac Foaming Gel 200ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0049', 'Noreva Trio Dark Spot Serum 30ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0050', 'Noreva Trio Dark Spot Care SPF 50+ ', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0051', 'Noreva Trio Dark Spot Care 30ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0052', 'Noreva Xerodiane AP+ Cream 400ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0053', 'Noreva Xerodiane AP+ Cleaning Shower', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0054', 'Noreva Sensidiane AR Anti-Redness cream 30ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0055', 'Embryolisse Lait-Creme Concentre 30ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0056', 'Embryolisse Lait-Creme Fluide 75ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0057', 'Embryolisse Eua De Beaute 200ml', 'Bottle', '2', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0058', 'Embryolisse Lotion Micellaire 250ml', 'Bottle', '2', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0059', 'Embryolisse lashes & brows Booster 6.5ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0060', 'Embryolisse Intense Smooth 50ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0061', 'Embryolisse Complexion BB Cream', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0062', 'Embryolisse Complexion CC Cream 30ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0063', 'Embryolisse Consealer (Beige) 8ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0064', 'Embryolisse Consealer (PInk) 8ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0065', 'Embryolisse Smooth Rodiant 40ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0066', 'Embryolisse Radiant Powder 12g', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0067', 'Embryolisse Radiant Eye 4.5g', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Sale product', 'SP0010', 'ISIS Neotone Serum 30ml', 'Tube', '3', '5');
INSERT INTO `temp` VALUES ('Injection', 'IN0037', 'Bupivacaine ', 'Amp', '10', '4');
INSERT INTO `temp` VALUES ('Injection', 'IN0038', 'Glucose Thai inj 50%', 'Amp', '10', '4');
INSERT INTO `temp` VALUES ('Equipment', 'EP0041', 'Cannula 25G*50MM', 'pcs', '11', '3');
INSERT INTO `temp` VALUES ('Equipment', 'EP0042', 'Cannula 18G*50MM', 'pcs', '11', '3');
INSERT INTO `temp` VALUES ('Equipment', 'EP0043', 'Skin marker white ', 'pcs', '11', '3');
INSERT INTO `temp` VALUES ('Injection', 'IN0039', 'Botox USA', 'Tube', '3', '4');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0069', 'Whiteness lightening serum', 'Tube', '3', '1');
INSERT INTO `temp` VALUES ('Oral Medicine', 'OM0017', 'Firide 1mg', 'Tablet', '4', '2');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0070', 'Minoxin 5%', 'Bottle', '2', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0071', 'Acnetin 0.05', 'Tube', '3', '1');
INSERT INTO `temp` VALUES ('Injection', 'IN0040', 'F-ACN (FUSION)', 'Bottle', '2', '4');
INSERT INTO `temp` VALUES ('Injection', 'IN0041', 'F-RADIAN (FUSION)', 'Bottle', '2', '4');
INSERT INTO `temp` VALUES ('Injection', '42', 'F-EYECONTOUR (FUSION)', 'Bottle', '2', '4');
INSERT INTO `temp` VALUES ('Injection', 'IN0043', 'F-HAIR MEN (FUSION)', 'Bottle', '2', '4');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0072', 'Minoxin 2%', 'Bottle', '2', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0073', 'Orrepast', 'Tube', '3', '1');
INSERT INTO `temp` VALUES ('Oral Medicine', 'OM0018', 'Mediclovir 400mg', 'Tablet', '4', '2');
INSERT INTO `temp` VALUES ('Oral Medicine', 'OM0019', 'Gofen 400mg', 'Tablet', '4', '2');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0074', 'Y Mycin N', 'Tube', '3', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0075', 'Y Mycin A ', 'Tube', '3', '1');
INSERT INTO `temp` VALUES ('Equipment', 'EP0044', 'Nitrile No powder Size S', 'Box', '7', '3');
INSERT INTO `temp` VALUES ('Equipment', 'EP0045', 'Nitrile No powder Size M', 'Box', '7', '3');
INSERT INTO `temp` VALUES ('Oral Medicine', 'OM0020', 'Lergicet 10mg', 'Tablet', '4', '2');
INSERT INTO `temp` VALUES ('Oral Medicine', 'OM0021', 'Falete 250mg', 'Tablet', '4', '2');
INSERT INTO `temp` VALUES ('Injection', 'IN0044', 'Medixon 125mg ', 'FL', '9', '4');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0076', 'Cicaplast Baume B5 40ml', 'Tube', '3', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0077', 'Bioderma Sensibio Gel moussant 200ml', 'Bottle', '2', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0078', 'Bioderma Sensibio Gel moussant 45ml', 'Tube', '3', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0079', 'Akne-Derm 2.5 Cream', 'Tube', '3', '1');
INSERT INTO `temp` VALUES ('Equipment', 'EP0046', 'Syringe Leur Lock 3ml', 'Box', '7', '3');
INSERT INTO `temp` VALUES ('Equipment', 'EP0047', 'Syringe Leur Lock 5ml', 'Box', '7', '3');
INSERT INTO `temp` VALUES ('Equipment', 'EP0048', 'Syringe Leur Lock 10ml', 'Box', '7', '3');
INSERT INTO `temp` VALUES ('Equipment', 'EP0049', 'Syringe Leur Lock 50ml', 'Box', '7', '3');
INSERT INTO `temp` VALUES ('Oral Medicine', 'OM0022', 'Biotin Nature Own', 'Bottle', '2', '2');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0080', 'Hydrogel Brightening Mask', 'pcs', '11', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0081', 'Hydrogel Gold Mask', 'pcs', '11', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0082', 'Hydrogel Snail Mask', 'pcs', '11', '1');
INSERT INTO `temp` VALUES ('Equipment', '2', 'Grand Compress (Bloc)', 'pcs', '11', '3');
INSERT INTO `temp` VALUES ('Injection', '4', 'Esome 40mg(Injection)', 'Amp', '10', '4');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0083', 'LRP Spray SPF50+', 'Bottle', '2', '1');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0084', 'M-Cain Cream', 'Box', '7', '1');
INSERT INTO `temp` VALUES ('Injection', 'IN0046', 'Neuramis Gray', 'Box', '7', '4');
INSERT INTO `temp` VALUES ('Injection', 'IN0047', 'Liporase', 'Bottle', '2', '4');
INSERT INTO `temp` VALUES ('Equipment', 'EP0051', 'PRP Tube USA', 'Tube', '3', '3');
INSERT INTO `temp` VALUES ('Injection', 'IN0048', 'Genta Injection', 'Amp', '10', '4');
INSERT INTO `temp` VALUES ('Injection', 'IN0049', 'Cimetidine Injection', 'Amp', '10', '4');
INSERT INTO `temp` VALUES ('Oral Medicine', 'OM0023', 'Pengesic 50mg (Tramadol)', 'Tablet', '4', '2');
INSERT INTO `temp` VALUES ('Injection', 'IN0050', 'F-MELACLEAR', 'Bottle', '2', '4');
INSERT INTO `temp` VALUES ('Topical Product', 'TP0085', 'Vitara TXPPE', 'Tube', '3', '1');

-- ----------------------------
-- Table structure for `ticket_statuses`
-- ----------------------------
DROP TABLE IF EXISTS `ticket_statuses`;
CREATE TABLE `ticket_statuses` (
  `id` int(10) NOT NULL,
  `branch_id` int(10) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of ticket_statuses
-- ----------------------------
INSERT INTO `ticket_statuses` VALUES ('-1', '1', 'Canceled');
INSERT INTO `ticket_statuses` VALUES ('1', '1', 'Waiting');
INSERT INTO `ticket_statuses` VALUES ('4', '1', 'Serving');
INSERT INTO `ticket_statuses` VALUES ('5', '1', 'Closed');

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
) ENGINE=InnoDB AUTO_INCREMENT=1684 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of um_sessions
-- ----------------------------
INSERT INTO `um_sessions` VALUES ('1683', '1', 'DXM20FKAEFC711EH2E7C9801A7BZD311', 'admin@gmail.com', '1', '2023-01-06 15:52:07', '2023-01-06 15:52:07', 'KWn47a774L631O59hciW06Vf17DU5rlfs0oGfA', 'LY8vhU2v1nV4gJ1h93B8nAwhGxEimB6EFIjR5a', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpaXMiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAiLCJhdWQiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAiLCJpYXQiOjE2NzI5OTUxMjcsIm5iZiI6MTY3Mjk5NTEyNywiZXhwIjoxNjcyOTk4NzI3LCJsYW5nIjoiZW4iLCJ1c2VyX2NsYXNzIjoiYWRtaW4iLCJvZmZpY2lhbF9pZCI6bnVsbCwiaWQiOjEsImxvZ2luX25hbWUiOiJhZG1pbkBnbWFpbC5jb20iLCJicmFuY2hfaWQiOjEsImZ1bGxfbmFtZSI6IlNhbXNldGh5Iiwic3RhdHVzIjoiYWN0aXZlIiwiaXNfbG9ja2VkIjowLCJlbWFpbCI6bnVsbCwicGhvbmVfbnVtYmVyIjoiMDEyNTc4OTAiLCJvdHBfY29kZSI6bnVsbH0.8RSv8sSoZl3m9oWIdv4GW4BCUlhpQPPKezT6NKKTS2U', null, 'en');

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
INSERT INTO `um_users` VALUES ('1', 'admin@gmail.com', '01257890', null, '$2y$10$9s0nFmOKK6xEc8c63nT7KeQSGb4UoUio39dTBoQKrArZ3TlRh7LYK', '2023-01-02 22:14:20.076836', 'DXM20FKAEFC711EH2E7C9801A7BZD311', null, '1', 'Admin', '0', 'active', 'Samsethy', null, 'admin', 'admin@gmail.com', '3', '2021-09-13 04:00:26', '0001', null, null, 'en');

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
  
