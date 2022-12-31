/*
Navicat MySQL Data Transfer

Source Server         : connection1
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : mclinic_db

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2022-12-31 08:39:44
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
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of appointments
-- ----------------------------
INSERT INTO `appointments` VALUES ('49', '1', '2', '2022-12-08', '2022-12-09 11:06:10', null, 'Ms Darany', '012555653', 'dddyahoocom', null, '0', '13', null, '67', 'Samsethy', '1', '2022-12-01 10:18:10.000000', 'Samsethy', '1', '2022-12-03 17:54:51', 'F', '3', '', 'Followup', 'Normal');
INSERT INTO `appointments` VALUES ('53', '1', '2', '2022-12-08', '2022-12-10 19:07:26', null, 'KKKKK', '0125656765', 'kk.gg-m@yahoo.com', null, '2', '0', null, '71', 'Samsethy', '1', '2022-12-03 17:38:30.000000', 'Samsethy', '1', '2022-12-07 13:35:48', 'F', '3', 'P100060', 'On demand', 'Normal');
INSERT INTO `appointments` VALUES ('55', '1', '2', '2022-12-18', '2022-12-09 11:17:03', null, 'new name 111', '012555666', null, null, '0', '15', null, '72', 'Samsethy', '1', '2022-12-04 13:18:46.000000', 'Samsethy', '1', '2022-12-05 18:58:26', 'F', '3', '', 'On demand', 'Normal');
INSERT INTO `appointments` VALUES ('57', '1', '2', '2023-01-18', '2022-12-29 23:28:18', null, 'DSDF AAA', '0112225653', null, null, '2', '17', null, '74', 'Samsethy', '1', '2022-12-04 13:41:17.000000', 'Samsethy', '1', '2022-12-04 13:48:47', 'F', '3', '', 'On demand', 'Normal');
INSERT INTO `appointments` VALUES ('58', '1', '2', '2023-01-10', '2022-12-09 11:17:12', null, 'NEW ONE', '012998898', null, null, '2', '18', null, '75', 'Samsethy', '1', '2022-12-04 13:43:17.000000', 'Samsethy', '1', '2022-12-04 14:10:11', 'F', '3', '', 'On demand', 'Normal');
INSERT INTO `appointments` VALUES ('59', '1', '2', '2022-12-15', '2022-12-09 10:34:47', null, 'Bun Sobana', '0115656565', 'babab@gmail.com', null, '2', '19', null, '76', 'Samsethy', '1', '2022-12-06 11:21:11.000000', null, null, null, 'F', '2', '', 'Followup', 'Urgent');
INSERT INTO `appointments` VALUES ('64', '1', '2', '2022-12-15', '2022-12-09 11:03:50', null, 'Bun Sobana', '0115656565', null, null, '2', '0', null, '76', 'Samsethy', '1', '2022-12-06 12:46:58.000000', 'Samsethy', '1', '2022-12-07 10:54:17', 'F', '3', 'P100061', 'On demand', 'Normal');
INSERT INTO `appointments` VALUES ('66', '1', '2', '2022-12-16', '2022-12-09 10:36:03', null, 'Sonary', '0102256765', 'info@vectorasoft.com', null, '2', '22', null, '79', 'Samsethy', '1', '2022-12-08 09:51:36.000000', null, null, null, 'F', '3', '', 'On demand', 'Normal');
INSERT INTO `appointments` VALUES ('69', '1', '2', '2023-01-27', '2022-12-09 10:34:47', null, 'some one', '012565656', 'info@vectorasoft.com', null, '2', '25', null, '82', 'Samsethy', '1', '2022-12-09 10:03:50.000000', null, null, null, 'F', '2', '', 'Followup', 'Normal');
INSERT INTO `appointments` VALUES ('71', '1', '2', '2022-12-22', '2022-12-10 19:14:08', null, 'KKK1', '01245656', null, null, '2', '27', null, '84', 'Samsethy', '1', '2022-12-10 19:13:54.000000', null, null, null, 'F', '3', '', 'On demand', 'Normal');
INSERT INTO `appointments` VALUES ('83', '1', '2', '2022-12-12', '2022-12-11 12:33:06', null, 'sdgdfhfdhgfh', '012456576', null, null, '2', '32', null, '89', 'Samsethy', '1', '2022-12-10 20:38:31.000000', null, null, null, 'F', '3', '', 'On demand', 'Normal');
INSERT INTO `appointments` VALUES ('87', '1', '2', '2022-12-12', '2022-12-11 12:24:33', null, 'sdgdfhfdhgfh', '012456576', null, null, '2', '32', null, '89', 'Samsethy', '1', '2022-12-10 20:43:54.000000', null, null, null, 'F', '3', '', 'On demand', 'Normal');
INSERT INTO `appointments` VALUES ('93', '1', '2', '2022-12-15', '2022-12-12 01:44:14', null, 'HJKJKJK', '010566767', null, null, '2', '37', null, '92', 'Samsethy', '1', '2022-12-12 01:43:48.000000', null, null, null, 'F', '3', '', 'On demand', 'Normal');
INSERT INTO `appointments` VALUES ('94', '1', '2', '2022-12-16', '2022-12-17 09:37:50', null, 'sovanna', '012565656', null, null, '2', '0', null, '82', 'Samsethy', '1', '2022-12-14 12:50:24.000000', 'Samsethy', '1', '2022-12-16 17:46:16', 'F', '3', 'P100067', 'On demand', 'Normal');
INSERT INTO `appointments` VALUES ('95', '1', '2', '2022-12-17', '2022-12-16 14:10:32', null, 'vikara', '0102343322', null, null, '2', '38', null, '93', 'Samsethy', '1', '2022-12-14 12:51:17.000000', null, null, null, 'M', '3', '', 'On demand', 'Normal');

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
INSERT INTO `appt_chief_complaints` VALUES (null, '4', '1', 'Samsethy', '2022-12-11 19:53:03.000000', '50');
INSERT INTO `appt_chief_complaints` VALUES (null, '6', '1', 'Samsethy', '2022-12-12 19:12:08.000000', '53');
INSERT INTO `appt_chief_complaints` VALUES ('95', '3', '1', 'Samsethy', '2022-12-16 14:10:32.753681', '76');
INSERT INTO `appt_chief_complaints` VALUES (null, '4', '1', 'Samsethy', '2022-12-14 17:56:48.000000', '52');
INSERT INTO `appt_chief_complaints` VALUES ('94', '3', null, null, '2022-12-17 09:37:50.103780', '77');
INSERT INTO `appt_chief_complaints` VALUES ('94', '4', null, null, '2022-12-17 09:37:50.103780', '77');
INSERT INTO `appt_chief_complaints` VALUES (null, '5', '1', 'Samsethy', '2022-12-17 09:38:53.000000', '53');

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
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8mb4;

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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_items
-- ----------------------------

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_units
-- ----------------------------

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
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=94 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
INSERT INTO `patients` VALUES ('83', '1', '1', '63', 'P100069', 'Samsethy', '1', '2022-12-10 19:10:53', null, null, null, null, 'OPD');
INSERT INTO `patients` VALUES ('84', '1', '1', '64', 'P100070', 'Samsethy', '1', '2022-12-10 19:14:08', null, null, null, null, 'OPD');
INSERT INTO `patients` VALUES ('85', '1', '1', '65', 'P100071', 'Samsethy', '1', '2022-12-10 19:23:16', null, null, null, null, 'OPD');
INSERT INTO `patients` VALUES ('86', '1', '1', '66', 'P100072', 'Samsethy', '1', '2022-12-10 19:25:59', null, null, null, null, 'OPD');
INSERT INTO `patients` VALUES ('87', '1', '1', '67', 'P100073', 'Samsethy', '1', '2022-12-10 19:30:24', null, null, null, null, 'OPD');
INSERT INTO `patients` VALUES ('88', '1', '1', '68', 'P100074', 'Samsethy', '1', '2022-12-10 20:53:28', null, null, null, null, 'OPD');
INSERT INTO `patients` VALUES ('89', '1', '1', '69', 'P100075', 'Samsethy', '1', '2022-12-10 20:55:18', null, null, null, null, 'OPD');
INSERT INTO `patients` VALUES ('90', '1', '1', '70', 'P100076', 'Samsethy', '1', '2022-12-11 11:46:44', null, null, null, null, 'OPD');
INSERT INTO `patients` VALUES ('91', '1', '1', '71', 'P100077', 'Samsethy', '1', '2022-12-11 12:53:57', null, null, null, null, 'OPD');
INSERT INTO `patients` VALUES ('92', '1', '1', '72', 'P100078', 'Samsethy', '1', '2022-12-12 01:44:14', null, null, null, null, 'OPD');
INSERT INTO `patients` VALUES ('93', '1', '1', '73', 'P100079', 'Samsethy', '1', '2022-12-16 14:10:24', null, null, null, null, 'OPD');

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
INSERT INTO `patient_code_control` VALUES ('1', '79', null, 'P');

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
) ENGINE=InnoDB AUTO_INCREMENT=195 DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB AUTO_INCREMENT=353 DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of persons
-- ----------------------------
INSERT INTO `persons` VALUES ('1', '1', 'Dr. Sinora', 'Sinora', 'Sin', 'F', null, null, '012567672', null, null, null, null, null, null, '', '0', null, null, null, null, null);
INSERT INTO `persons` VALUES ('2', '1', 'Dr. Phina', 'Phina', 'Chea', 'F', null, null, '0112225652', null, null, null, null, null, null, '', '0', null, null, null, null, null);
INSERT INTO `persons` VALUES ('50', '1', 'Ms Darany', 'Darany', 'Ms', 'F', '2022-10-10', '14', '012555653', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-01 10:19:48', null, null, null, null);
INSERT INTO `persons` VALUES ('51', '1', 'KKKKK', '', 'KKKKK', 'F', '2022-09-12', '14', '0125656765', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-03 17:39:11', null, null, null, null);
INSERT INTO `persons` VALUES ('52', '1', 'new name client one', 'name client one', 'new', 'F', null, '14', '012555666', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-04 13:19:03', null, null, null, null);
INSERT INTO `persons` VALUES ('53', '1', 'DDDDDD``', '', 'DDDDDD``', 'F', null, '14', '093488789', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-04 13:40:21', null, null, null, null);
INSERT INTO `persons` VALUES ('54', '1', 'DSDF AAA', 'AAA', 'DSDF', 'F', null, '14', '0112225653', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-04 13:41:53', null, null, null, null);
INSERT INTO `persons` VALUES ('55', '1', 'NEW ONE', 'ONE', 'NEW', 'F', null, '14', '012998898', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-04 14:09:38', null, null, null, null);
INSERT INTO `persons` VALUES ('56', '1', 'Bun Sobana', 'Sobana', 'Bun', 'F', '2022-10-03', '14', '0115656565', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-06 11:24:58', null, null, null, null);
INSERT INTO `persons` VALUES ('57', '1', 'Borya', '', 'Borya', 'F', '2022-09-05', '14', '0125689898', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-06 12:02:15', null, null, null, null);
INSERT INTO `persons` VALUES ('58', '1', 'DDGDGDGD', '', 'DDGDGDGD', 'F', '2022-12-06', '14', '0125686455', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-07 17:20:23', null, null, null, null);
INSERT INTO `persons` VALUES ('59', '1', 'Sonary', '', 'Sonary', 'F', '2022-08-02', '14', '0102256765', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-08 09:52:09', null, null, null, null);
INSERT INTO `persons` VALUES ('60', '1', 'Ginara', '', 'Ginara', 'F', '2022-09-05', '14', '01023765423', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-08 10:03:45', null, null, null, null);
INSERT INTO `persons` VALUES ('61', '1', 'Funny name', 'name', 'Funny', 'F', '2022-10-10', '14', '011235768', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-08 11:01:25', null, null, null, null);
INSERT INTO `persons` VALUES ('62', '1', 'some one', 'one', 'some', 'F', '2022-06-06', '14', '012565656', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-09 10:04:17', null, null, null, null);
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
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of service_queue
-- ----------------------------
INSERT INTO `service_queue` VALUES ('50', 'D100005', '2022-12-09 11:06:10.000000', 'Samsethy', '1', '67', '2', null, '2022-12-09', '2', '1', '49', '50', '1', 'Normal', 'On Demand', null);
INSERT INTO `service_queue` VALUES ('51', 'D100006', '2022-12-09 11:17:03.000000', 'Samsethy', '1', '72', '2', null, '2022-12-09', null, '1', '55', '52', '1', 'Normal', 'On Demand', null);
INSERT INTO `service_queue` VALUES ('52', 'P100001', '2022-12-09 11:17:12.000000', 'Samsethy', '1', '75', '3', null, '2022-12-09', null, '1', '58', '55', '1', 'Normal', 'On Demand', null);
INSERT INTO `service_queue` VALUES ('53', 'D100007', '2022-12-09 12:20:13.000000', 'Samsethy', '1', '80', '2', null, '2022-12-09', null, '1', '67', '60', '1', 'Normal', 'On Demand', null);
INSERT INTO `service_queue` VALUES ('54', 'P100002', '2022-12-09 14:04:06.000000', 'Samsethy', '1', '81', '3', null, '2022-12-09', '1', '1', '68', '61', null, null, 'On Demand', 'She is beautifucl');
INSERT INTO `service_queue` VALUES ('55', 'D100010', '2022-12-09 14:08:51.000000', 'Samsethy', '1', '77', '2', null, '2022-12-09', '1', '1', '60', '57', null, null, 'On Demand', 'Notes about the patient');
INSERT INTO `service_queue` VALUES ('56', 'D100001', '2022-12-10 19:07:26.000000', 'Samsethy', '1', '71', '2', null, '2022-12-10', '1', '1', '53', '51', null, null, 'On Demand', null);
INSERT INTO `service_queue` VALUES ('57', 'D100002', '2022-12-10 19:07:45.000000', 'Samsethy', '1', '78', '2', null, '2022-12-10', null, '1', '65', '58', null, null, 'On Demand', null);
INSERT INTO `service_queue` VALUES ('58', 'D100003', '2022-12-10 19:13:09.000000', 'Samsethy', '1', '83', '2', null, '2022-12-10', null, '1', '70', '63', null, null, 'On Demand', null);
INSERT INTO `service_queue` VALUES ('59', 'D100004', '2022-12-10 19:14:08.000000', 'Samsethy', '1', '84', '2', null, '2022-12-10', '1', '1', null, '64', null, null, 'On Demand', null);
INSERT INTO `service_queue` VALUES ('60', 'D100005', '2022-12-10 19:23:21.000000', 'Samsethy', '1', '85', '2', null, '2022-12-10', null, '1', '72', '65', null, null, 'On Demand', null);
INSERT INTO `service_queue` VALUES ('61', 'D100006', '2022-12-10 19:23:29.000000', 'Samsethy', '1', '85', '2', null, '2022-12-10', null, '1', '72', '65', null, null, 'On Demand', null);
INSERT INTO `service_queue` VALUES ('62', 'G100001', '2022-12-10 19:23:37.000000', 'Samsethy', '1', '85', '1', null, '2022-12-10', null, '1', '72', '65', null, null, 'On Demand', null);
INSERT INTO `service_queue` VALUES ('63', 'D100007', '2022-12-10 19:23:43.000000', 'Samsethy', '1', '85', '2', null, '2022-12-10', null, '1', '72', '65', null, null, 'On Demand', null);
INSERT INTO `service_queue` VALUES ('64', 'D100008', '2022-12-10 19:26:04.000000', 'Samsethy', '1', '86', '2', null, '2022-12-10', null, '1', '73', '66', null, null, 'On Demand', null);
INSERT INTO `service_queue` VALUES ('65', 'P100001', '2022-12-10 19:30:28.000000', 'Samsethy', '1', '87', '3', null, '2022-12-10', null, '1', '74', '67', null, null, 'On Demand', null);
INSERT INTO `service_queue` VALUES ('66', 'D100009', '2022-12-10 20:55:24.000000', 'Samsethy', '1', '88', '2', null, '2022-12-10', null, null, '89', '68', null, null, 'On Demand', null);
INSERT INTO `service_queue` VALUES ('67', 'D100001', '2022-12-11 11:47:21.000000', 'Samsethy', '1', '90', '2', null, '2022-12-11', '2', null, '91', '70', null, null, 'On Demand', null);
INSERT INTO `service_queue` VALUES ('68', 'D100002', '2022-12-11 12:24:33.000000', 'Samsethy', '1', '89', '2', null, '2022-12-11', null, null, '87', '69', null, null, 'On Demand', null);
INSERT INTO `service_queue` VALUES ('69', 'D100003', '2022-12-11 12:33:06.000000', 'Samsethy', '1', '89', '2', null, '2022-12-11', null, null, '83', '69', null, null, 'On Demand', null);
INSERT INTO `service_queue` VALUES ('70', 'D100004', '2022-12-11 12:33:33.000000', 'Samsethy', '1', '89', '2', null, '2022-12-11', null, null, '86', '69', null, null, 'On Demand', null);
INSERT INTO `service_queue` VALUES ('71', 'D100005', '2022-12-11 19:50:45.000000', 'Samsethy', '1', '91', '2', null, '2022-12-11', '1', '1', '92', '71', null, null, 'On Demand', 'asdsfsdgdgdfg');
INSERT INTO `service_queue` VALUES ('72', 'D100006', '2022-12-11 19:51:49.000000', 'Samsethy', '1', '91', '2', null, '2022-12-11', '2', '1', '92', '71', null, null, 'On Demand', 'asdsfsdgdgdfg');
INSERT INTO `service_queue` VALUES ('73', 'D100007', '2022-12-11 19:52:01.000000', 'Samsethy', '1', '91', '2', null, '2022-12-11', '2', '1', '92', '71', null, null, 'On Demand', 'asdsfsdgdgdfg');
INSERT INTO `service_queue` VALUES ('74', 'D100008', '2022-12-11 19:52:33.000000', 'Samsethy', '1', '91', '2', null, '2022-12-11', '2', '1', '92', '71', null, null, 'On Demand', 'asdsfsdgdgdfg');
INSERT INTO `service_queue` VALUES ('75', 'P100001', '2022-12-12 01:44:14.000000', 'Samsethy', '1', '92', '3', null, '2022-12-12', '1', '1', null, '72', null, null, 'On Demand', null);
INSERT INTO `service_queue` VALUES ('76', 'D100001', '2022-12-16 14:10:32.000000', 'Samsethy', '1', '93', '2', null, '2022-12-16', null, '1', '95', '73', null, null, 'On Demand', null);
INSERT INTO `service_queue` VALUES ('77', 'D100001', '2022-12-17 09:37:50.000000', 'Samsethy', '1', '82', '2', null, '2022-12-17', '1', '1', '94', '62', null, null, 'On Demand', 'vdfgdfgdfgfh');
INSERT INTO `service_queue` VALUES ('78', 'D100001', '2022-12-29 23:28:18.000000', 'Samsethy', '1', '74', '2', null, '2022-12-29', '1', '1', '57', '54', null, null, 'On Demand', null);

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
) ENGINE=InnoDB AUTO_INCREMENT=1624 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of um_sessions
-- ----------------------------
INSERT INTO `um_sessions` VALUES ('1623', '1', 'DXM20FKAEFC711EH2E7C9801A7BZD311', 'admin@gmail.com', '1', '2022-12-30 23:51:20', '2022-12-30 23:51:20', 'UCtz89WIb1h065hTuSmsaQzpNB4QeCBNK9MS2k', 't7gLJRn5xOr7joK42qpg8NigEa14qbJCO4Yzr5', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpaXMiOm51bGwsImF1ZCI6bnVsbCwiaWF0IjoxNjcyNDE5MDgwLCJuYmYiOjE2NzI0MTkwODAsImV4cCI6MTY3MjQyMjY4MCwibGFuZyI6ImVuIiwidXNlcl9jbGFzcyI6ImFkbWluIiwib2ZmaWNpYWxfaWQiOm51bGwsImlkIjoxLCJsb2dpbl9uYW1lIjoiYWRtaW5AZ21haWwuY29tIiwiYnJhbmNoX2lkIjoxLCJmdWxsX25hbWUiOiJTYW1zZXRoeSIsInN0YXR1cyI6ImFjdGl2ZSIsImlzX2xvY2tlZCI6MCwiZW1haWwiOm51bGwsInBob25lX251bWJlciI6IjAxMjU3ODkwIiwib3RwX2NvZGUiOm51bGx9.ZT_Ma-esDO3-JkgZwtHsygSEHr_ukSuTs8wJ7c4wP6I', null, 'en');

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
INSERT INTO `um_users` VALUES ('1', 'admin@gmail.com', '01257890', null, '$2y$10$9s0nFmOKK6xEc8c63nT7KeQSGb4UoUio39dTBoQKrArZ3TlRh7LYK', '2022-12-21 07:20:20.123416', 'DXM20FKAEFC711EH2E7C9801A7BZD311', null, '1', 'Admin', '0', 'active', 'Samsethy', null, 'admin', 'admin@gmail.com', '3', '2021-09-13 04:00:26', '0001', null, null, 'en');

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
CREATE  FUNCTION `formatDate`(mDate Date) RETURNS varchar(50) DETERMINISTIC
BEGIN
  return DATE_FORMAT(mDate,'%d %b %Y');
END;
 
-- ----------------------------
-- Function structure for `formatDateTime`
-- ----------------------------

DROP FUNCTION IF EXISTS `formatDateTime`;
CREATE  FUNCTION `formatDateTime`(mDate Date) RETURNS varchar(50) DETERMINISTIC
BEGIN
  return DATE_FORMAT(mDate,'%d %b %Y %r');
END;


-- ----------------------------
-- Function structure for `formatTime`
-- ----------------------------

DROP FUNCTION IF EXISTS `formatTime`;
CREATE  FUNCTION `formatTime`(mDate Date) RETURNS varchar(30) DETERMINISTIC
BEGIN
  return DATE_FORMAT(mDate,'%r');
END;


-- ----------------------------
-- Function structure for `getApptStatus`
-- ----------------------------

DROP FUNCTION IF EXISTS `getApptStatus`;
CREATE  FUNCTION `getApptStatus`(branchid INT,statusid INT) RETURNS varchar(20) DETERMINISTIC
BEGIN
   declare ss varchar(20); 
   SET ss = (select `name` from appt_statuses where id =statusid AND branch_id =branchid LIMIT 1);  
   return IFNULL(ss,'Pending');
END;


-- ----------------------------
-- Function structure for `getConsultanName`
-- ----------------------------

DROP FUNCTION IF EXISTS `getConsultanName`;
CREATE  FUNCTION `getConsultanName`(consultantid INT) RETURNS varchar(50) DETERMINISTIC
BEGIN
 declare cname varchar(50);
 set cname = (select `name` from persons as p INNER JOIN employees as e ON e.person_id = p.id WHERE p.id = consultantid LIMIT 1);
 return cname; 
end;


-- ----------------------------
-- Function structure for `getPatientCode`
-- ----------------------------

DROP FUNCTION IF EXISTS `getPatientCode`;
CREATE  FUNCTION `getPatientCode`(branchid INT,clientid INT) RETURNS varchar(30) DETERMINISTIC
begin
  DECLARE cc varchar(30); 
  set cc = (select `code` from patients as p where p.branch_id =branchid AND p.id =clientid LIMIT 1);
  return cc;
end;


-- ----------------------------
-- Function structure for `getTicketNumber`
-- ----------------------------

DROP FUNCTION IF EXISTS `getTicketNumber`;
CREATE  FUNCTION `getTicketNumber`(branchid INT,apptid INT) RETURNS varchar(30) DETERMINISTIC
BEGIN
 declare ticket varchar(30); 
 SET ticket = (SELECT ticket_number FROM service_queue where branch_id=branchid and appt_id = apptid LIMIT 1);
 RETURN ticket; 
END;


-- ----------------------------
-- Function structure for `getTicketStatus`
-- ----------------------------

DROP FUNCTION IF EXISTS `getTicketStatus`;
CREATE  FUNCTION `getTicketStatus`(branchid INT,ticketid INT) RETURNS varchar(30) DETERMINISTIC
BEGIN
  declare tstatus varchar(30);
  SET tstatus = (select sts.`name` from ticket_statuses AS sts INNER JOIN service_queue as s ON s.status_id = sts.id where s.id =ticketid LIMIT 1);
  return tstatus;
END;


-- ----------------------------
-- Function structure for `hasPosition`
-- ----------------------------
DROP FUNCTION IF EXISTS `hasPosition`;
CREATE  FUNCTION `hasPosition`(empid INT,posid INT) RETURNS int(11) DETERMINISTIC
BEGIN
  SET @d= (EXISTS(select id from employee_positions as e WHERE e.emp_id = empid AND e.position_id = posid LIMIT 1));
  RETURN @d;
END;
 

-- ----------------------------
-- Function structure for `hasPositions`
-- ----------------------------

DROP FUNCTION IF EXISTS `hasPositions`;
CREATE  FUNCTION `hasPositions`(empid INT,posid INT) RETURNS int(11) DETERMINISTIC
BEGIN
  SET @d= (EXISTS(select id from employee_positions as e WHERE e.emp_id = empid AND e.position_id = posid LIMIT 1));
  RETURN @d;
END;