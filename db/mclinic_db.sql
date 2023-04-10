/*
Navicat MySQL Data Transfer

Source Server         : connection1
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : mclinic_db

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2023-04-10 11:55:43
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
) ENGINE=InnoDB AUTO_INCREMENT=212 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of appointments
-- ----------------------------
INSERT INTO `appointments` VALUES ('193', '1', '2', '2023-03-07', '2023-03-21 03:56:21', null, 'Dyna', '023546657567', null, null, '1', '80', null, '118', 'Samsethy', '1', '2023-03-06 15:29:32.000000', null, null, null, 'F', '3', '', 'On demand', 'Normal');
INSERT INTO `appointments` VALUES ('194', '1', '2', '2023-03-06', '2023-03-06 16:20:43', null, 'Gonna', '0123543546', null, null, '1', '81', null, '119', 'Samsethy', '1', '2023-03-06 16:20:07.000000', null, null, null, 'F', '3', '', 'On demand', 'Normal');
INSERT INTO `appointments` VALUES ('195', '1', '2', '2023-03-22', '2023-03-21 03:44:24', null, 'Sovana sam', '011255671', null, null, '1', '82', null, '120', 'Samsethy', '1', '2023-03-21 03:10:55.000000', null, null, null, 'F', '3', '', 'On demand', 'Normal');
INSERT INTO `appointments` VALUES ('198', '1', '2', '2023-04-12', '2023-04-04 16:30:17', null, 'Sopheara', '0112226735', null, null, '1', '83', null, '122', 'Samsethy', '1', '2023-04-04 16:29:28.000000', null, null, null, 'F', '3', '', 'On demand', 'Normal');
INSERT INTO `appointments` VALUES ('210', '1', '2', '2023-04-10', '2023-04-09 15:13:02', null, 'DGdfgdfgfdh', '01146456', null, null, '1', '94', null, '126', 'Samsethy', '1', '2023-04-09 10:13:52.000000', null, null, null, 'F', '2', '', 'On demand', 'Normal');
INSERT INTO `appointments` VALUES ('211', '1', '2', '2023-04-11', '2023-04-09 15:44:20', null, 'Some one A', '011456456', null, null, '1', '95', null, '127', 'Samsethy', '1', '2023-04-09 15:43:10.000000', null, null, null, 'F', '3', '', 'On demand', 'Normal');

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
  `ticket_id` int(10) DEFAULT NULL,
  `description` varchar(250) DEFAULT NULL,
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `update_uid` int(11) DEFAULT NULL,
  `update_user` int(11) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of appt_chief_complaints
-- ----------------------------
INSERT INTO `appt_chief_complaints` VALUES (null, '3', '1', 'Samsethy', '2023-03-11 11:10:41.000000', '1', 'Bruised', '1', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES (null, '5', '1', 'Samsethy', '2023-03-12 10:41:53.137473', '114', 'Facial Cleansing', '7', null, null, '2023-03-12 10:41:53.137473');
INSERT INTO `appt_chief_complaints` VALUES (null, '4', '1', 'Samsethy', '2023-03-13 08:57:59.797536', '114', 'Dark skin', '9', null, null, '2023-03-13 08:57:59.797536');
INSERT INTO `appt_chief_complaints` VALUES ('195', '3', null, null, null, null, null, '10', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('195', '5', null, null, null, null, null, '12', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('196', '11', '1', 'Samsethy', '2023-03-27 16:13:19.044591', '122', 'Im too beautiful ', '13', null, null, '2023-03-27 16:13:19.044591');
INSERT INTO `appt_chief_complaints` VALUES ('196', '14', '1', 'Samsethy', '2023-03-27 16:13:19.044591', '122', 'dgsdfgdfhf', '14', null, null, '2023-03-27 16:13:19.044591');
INSERT INTO `appt_chief_complaints` VALUES ('193', '11', '1', 'Samsethy', '2023-03-21 11:55:23.000000', '120', 'Im too beautiful ', '15', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES (null, '2', '1', 'Samsethy', '2023-03-31 13:19:43.000000', '123', null, '16', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES (null, '5', '1', 'Samsethy', '2023-03-31 13:19:48.000000', '123', null, '17', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('196', '13', '1', 'Samsethy', '2023-03-31 13:26:55.000000', '122', 'ggghh', '18', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('196', '14', '1', 'Samsethy', '2023-03-31 13:26:57.000000', '122', 'dgsdfgdfhf', '19', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES (null, '5', '1', 'Samsethy', '2023-04-05 15:25:29.000000', '123', null, '20', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('207', '3', '1', 'Samsethy', '2023-04-08 22:37:52.000000', null, null, '21', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('207', '4', '1', 'Samsethy', '2023-04-08 22:37:52.000000', null, null, '22', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('208', '3', '1', 'Samsethy', '2023-04-08 22:39:03.000000', null, null, '23', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('208', '1', '1', 'Samsethy', '2023-04-08 22:39:03.000000', null, null, '24', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('208', '5', null, null, null, null, null, '25', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('209', '3', '1', 'Samsethy', '2023-04-08 22:55:02.000000', null, null, '26', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('209', '4', '1', 'Samsethy', '2023-04-08 22:55:02.000000', null, null, '27', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('209', '1', '1', 'Samsethy', '2023-04-08 22:55:02.000000', null, null, '28', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('210', '3', '1', 'Samsethy', '2023-04-09 10:31:49.105719', '127', null, '29', null, null, '2023-04-09 10:31:49.105719');
INSERT INTO `appt_chief_complaints` VALUES ('210', '1', '1', 'Samsethy', '2023-04-09 10:31:49.105719', '127', null, '30', null, null, '2023-04-09 10:31:49.105719');
INSERT INTO `appt_chief_complaints` VALUES (null, '3', '1', 'Samsethy', '2023-04-09 12:28:37.000000', '130', null, '31', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES (null, '5', '1', 'Samsethy', '2023-04-09 12:28:40.000000', '130', null, '32', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('211', '4', '1', 'Samsethy', '2023-04-09 15:44:20.067832', '131', null, '33', null, null, '2023-04-09 15:44:20.067832');
INSERT INTO `appt_chief_complaints` VALUES ('211', '1', '1', 'Samsethy', '2023-04-09 15:44:20.067832', '131', null, '34', null, null, '2023-04-09 15:44:20.067832');
INSERT INTO `appt_chief_complaints` VALUES (null, '10', '1', 'Samsethy', '2023-04-10 05:11:25.000000', '132', 'Facial Acne', '35', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES (null, '14', '1', 'Samsethy', '2023-04-10 05:11:28.000000', '132', 'dgsdfgdfhf', '36', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES (null, '12', '1', 'Samsethy', '2023-04-10 05:11:32.000000', '132', 'sdfsdgfdg', '37', null, null, null);

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
-- Table structure for `bills`
-- ----------------------------
DROP TABLE IF EXISTS `bills`;
CREATE TABLE `bills` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `issue_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `vendor_id` int(10) NOT NULL,
  `vendor_address` varchar(250) DEFAULT NULL,
  `vendor_email` varchar(100) DEFAULT NULL,
  `vendor_phone` varchar(50) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `discount` decimal(10,2) NOT NULL,
  `discount_type` varchar(10) NOT NULL,
  `net_amount` decimal(10,2) NOT NULL,
  `status` varchar(15) NOT NULL,
  `recurring` tinyint(6) NOT NULL,
  `create_uid` int(10) NOT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_uid` int(10) DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of bills
-- ----------------------------

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
-- Table structure for `consultations`
-- ----------------------------
DROP TABLE IF EXISTS `consultations`;
CREATE TABLE `consultations` (
  `id` int(10) NOT NULL,
  `branch_id` int(10) DEFAULT NULL,
  `com_branch_id` int(10) DEFAULT NULL,
  `consultant_id` int(10) DEFAULT NULL,
  `consult_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `description` varchar(250) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_user` varchar(50) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `ticket_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of consultations
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
-- Table structure for `currencies`
-- ----------------------------
DROP TABLE IF EXISTS `currencies`;
CREATE TABLE `currencies` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `name` varchar(50) NOT NULL,
  `code` varchar(10) NOT NULL,
  `create_uid` int(10) NOT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `symbol` varchar(10) DEFAULT NULL,
  `symbol_after` tinyint(6) DEFAULT NULL,
  `decimal_points` int(10) DEFAULT 2,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of currencies
-- ----------------------------
INSERT INTO `currencies` VALUES ('1', '1', 'American Dollar', 'USD', '1', 'Admin', null, null, '2023-01-06 17:38:12.676399', '$', '0', '2', null);
INSERT INTO `currencies` VALUES ('2', '1', 'Riel', 'KHR', '1', 'Admin', null, null, '2023-01-06 17:38:15.991101', 'KHR', '0', '2', null);
INSERT INTO `currencies` VALUES ('3', '1', 'asdasd', 'USD1', '1', 'Samsethy', null, null, null, '$', '0', '2', '2023-01-14 12:04:54.000000');
INSERT INTO `currencies` VALUES ('6', '1', 'asdagsd', 'USD3', '1', 'Samsethy', null, null, null, '$', '0', '2', '2023-01-14 12:11:03.000000');
INSERT INTO `currencies` VALUES ('7', '1', 'Khmer Riel', 'USD2', '1', 'Samsethy', null, null, null, '៛', '0', '2', '2023-04-09 13:33:04.000000');

-- ----------------------------
-- Table structure for `currency_pairs`
-- ----------------------------
DROP TABLE IF EXISTS `currency_pairs`;
CREATE TABLE `currency_pairs` (
  `id` int(10) NOT NULL DEFAULT 0,
  `currency_pair` varchar(25) CHARACTER SET utf8 NOT NULL,
  `create_user` varchar(50) CHARACTER SET utf8 NOT NULL,
  `create_uid` int(10) NOT NULL,
  `create_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_uid` int(10) DEFAULT NULL,
  `update_user` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `update_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `branch_id` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of currency_pairs
-- ----------------------------
INSERT INTO `currency_pairs` VALUES ('1', 'USDKHR', 'Samsethy', '1', '2023-01-24 18:15:27.000000', null, null, null, '1');
INSERT INTO `currency_pairs` VALUES ('14', 'USDKHR', 'Samsethy', '1', '2023-01-24 18:49:32.000000', null, null, null, '1');
INSERT INTO `currency_pairs` VALUES ('15', 'USDKHR', 'Samsethy', '1', '2023-01-24 18:49:33.000000', null, null, null, '1');
INSERT INTO `currency_pairs` VALUES ('16', 'USDKHR', 'Samsethy', '1', '2023-01-24 18:49:34.000000', null, null, null, '1');
INSERT INTO `currency_pairs` VALUES ('17', 'USD-KHR', 'Samsethy', '1', '2023-01-24 18:52:12.000000', null, null, null, '1');
INSERT INTO `currency_pairs` VALUES ('18', 'USD-KHR1', 'Samsethy', '1', '2023-01-24 18:52:35.000000', null, null, null, '1');

-- ----------------------------
-- Table structure for `customers`
-- ----------------------------
DROP TABLE IF EXISTS `customers`;
CREATE TABLE `customers` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `name` varchar(250) NOT NULL,
  `customer_type` varchar(35) NOT NULL COMMENT 'customer_type = {individual, corporate,other}',
  `person_id` int(10) DEFAULT NULL,
  `phone_number` varchar(250) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` varchar(350) DEFAULT NULL,
  `cp_phone_number` varchar(50) DEFAULT NULL,
  `cp_email` varchar(100) DEFAULT NULL,
  `cp_address` varchar(350) DEFAULT NULL,
  `business_type` varchar(50) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_uid` int(10) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `inactive` tinyint(6) DEFAULT NULL,
  `currency_code` varchar(15) DEFAULT NULL,
  `code` varchar(25) DEFAULT NULL,
  `remarks` varchar(150) DEFAULT NULL,
  `cp_name` varchar(100) DEFAULT NULL,
  `billing_address` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of customers
-- ----------------------------
INSERT INTO `customers` VALUES ('7', '1', 'dfgfhfgh', 'Corporate', null, '0126456456', null, null, null, null, null, null, '2022-12-21 10:24:38.060623', '1', 'Samsethy', '2022-12-21 10:24:38.060623', null, null, null, null, '100002', null, null, null);
INSERT INTO `customers` VALUES ('8', '1', 'AAAAA', 'Corporate', null, '01245645', null, null, null, null, null, null, '2022-12-21 10:31:03.038375', '1', 'Samsethy', '2022-12-21 10:31:03.038375', null, null, null, null, '100003', null, null, null);
INSERT INTO `customers` VALUES ('11', '1', 'AAAAA', 'Corporate', null, '01245645', null, null, null, null, null, null, '2022-12-21 12:14:06.385702', '1', 'Samsethy', '2022-12-21 12:14:06.385702', null, null, null, null, '100006', null, null, null);
INSERT INTO `customers` VALUES ('12', '1', 'Samsethy', 'Corporate', null, '01245645', null, null, null, null, null, null, '2022-12-21 12:14:18.795927', '1', 'Samsethy', '2022-12-21 12:14:18.795927', null, null, null, null, '100007', null, null, null);
INSERT INTO `customers` VALUES ('13', '1', 'BBBBBB', 'Corporate', null, '01245645', null, null, null, null, null, null, '2022-12-21 12:14:34.601007', '1', 'Samsethy', '2022-12-21 12:14:34.601007', null, null, null, null, '100008', null, null, null);
INSERT INTO `customers` VALUES ('17', '1', 'Sovanna', 'Corporate', null, '012324', null, null, null, null, null, null, '2022-12-21 17:07:47.002570', '1', 'Samsethy', '2022-12-21 17:07:47.002570', 'Samsethy', '1', null, null, '100016', null, null, null);
INSERT INTO `customers` VALUES ('19', '1', 'Chanika', 'Corporate', null, '024235', null, null, null, null, null, null, '2022-12-21 12:19:05.112574', '1', 'Samsethy', '2022-12-21 12:19:05.112574', null, null, null, null, '100014', null, null, null);
INSERT INTO `customers` VALUES ('20', '1', 'Nika One', 'Corporate', null, '0125346456', null, null, null, null, null, null, '2022-12-21 12:19:43.668391', '1', 'Samsethy', '2022-12-21 12:19:43.668391', null, null, null, null, '100015', null, null, null);
INSERT INTO `customers` VALUES ('23', '1', 'XYZ Col Ltd', 'Corporate', null, '0235656756', 'infoxyzcom', 'address of XYZ', '012456657', 'somanea@gmail.com', 'dfgfhggfhhgju', null, '2022-12-23 00:18:09.543663', '1', 'Samsethy', '2022-12-23 00:18:09.543663', 'Samsethy', '1', null, null, '100028', null, 'somanea', null);

-- ----------------------------
-- Table structure for `customer_code_control`
-- ----------------------------
DROP TABLE IF EXISTS `customer_code_control`;
CREATE TABLE `customer_code_control` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `com_branch_id` int(10) DEFAULT NULL,
  `last_id` int(10) NOT NULL,
  `prefix` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of customer_code_control
-- ----------------------------
INSERT INTO `customer_code_control` VALUES ('1', '1', null, '28', '');

-- ----------------------------
-- Table structure for `departments`
-- ----------------------------
DROP TABLE IF EXISTS `departments`;
CREATE TABLE `departments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `branch_id` int(11) NOT NULL,
  `com_branch_id` int(11) DEFAULT 0,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent_department_id` int(10) DEFAULT NULL,
  `description` varchar(350) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `create_user` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_uid` int(11) NOT NULL,
  `update_user` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `update_uid` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL,
  `inactive` tinyint(4) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of departments
-- ----------------------------
INSERT INTO `departments` VALUES ('1', '1', '0', 'Dermatology', null, 'Dermatology', 'Samsethy', '1', 'Samsethy', '1', '2023-03-23 10:32:58', '2023-03-23 10:32:58', '0');
INSERT INTO `departments` VALUES ('2', '1', '0', 'Pastic Surgery', null, 'Pastic Surgery', 'Samsethy', '1', null, null, '2023-01-06 19:40:16', null, '0');
INSERT INTO `departments` VALUES ('12', '1', '0', 'General', null, 'General', 'Samsethy', '1', null, null, '2023-03-07 18:07:23', null, '0');

-- ----------------------------
-- Table structure for `employees`
-- ----------------------------
DROP TABLE IF EXISTS `employees`;
CREATE TABLE `employees` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `branch_id` int(11) NOT NULL,
  `person_id` int(11) NOT NULL,
  `code` varchar(25) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position_id` int(11) DEFAULT NULL,
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
  `photo_file_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo_file_name` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of employees
-- ----------------------------
INSERT INTO `employees` VALUES ('1', '1', '1', '11111', '2', '1', 'full time', '0.00', 'USD', '1', '0', 'Samsethy', '1', '2023-03-22 15:44:29', '2023-03-22 15:44:29', 'png', '1_file_1641abfed8914720230322_030329.png');
INSERT INTO `employees` VALUES ('2', '1', '2', '100014', '3', '1', 'full time', '0.00', 'USD', '1', '0', 'Samsethy', '1', '2023-03-23 11:02:11', '2023-03-23 11:02:11', 'png', '1_file_1641bcf4317e1820230323_110311.png');

-- ----------------------------
-- Table structure for `employee_code_control`
-- ----------------------------
DROP TABLE IF EXISTS `employee_code_control`;
CREATE TABLE `employee_code_control` (
  `branch_id` int(10) NOT NULL,
  `last_id` int(10) NOT NULL,
  `classify_by` varchar(20) DEFAULT NULL,
  `prefix` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of employee_code_control
-- ----------------------------
INSERT INTO `employee_code_control` VALUES ('1', '14', null, null);

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
-- Table structure for `exchange_rates`
-- ----------------------------
DROP TABLE IF EXISTS `exchange_rates`;
CREATE TABLE `exchange_rates` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `buy_rate` decimal(10,4) NOT NULL,
  `sell_rate` decimal(10,4) DEFAULT NULL,
  `x_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `x_month` int(11) DEFAULT NULL,
  `x_year` int(11) DEFAULT NULL,
  `branch_id` int(10) NOT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `currency_pair` varchar(25) DEFAULT NULL,
  `update_uid` int(11) DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of exchange_rates
-- ----------------------------
INSERT INTO `exchange_rates` VALUES ('1', '4000.0000', '4000.0000', null, '1', '1970', '1', '1', 'Samsethy', '2023-03-23 10:27:30.235421', 'USDKHR', '1', 'Samsethy', '2023-03-23 10:27:30');
INSERT INTO `exchange_rates` VALUES ('2', '4100.0000', '4200.0000', '2023-03-22 00:00:00.000000', '3', '2023', '1', '1', 'Samsethy', '2023-03-23 10:30:47.144100', 'USDKHR', '1', 'Samsethy', '2023-03-23 10:30:47');

-- ----------------------------
-- Table structure for `invoices`
-- ----------------------------
DROP TABLE IF EXISTS `invoices`;
CREATE TABLE `invoices` (
  `branch_id` int(10) DEFAULT NULL,
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `entry_id` varchar(50) DEFAULT '' COMMENT 'double_entry_activity_id is linked to "transactions.activity_id"',
  `ref_number` varchar(30) CHARACTER SET latin1 DEFAULT NULL,
  `issue_date` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `terms` varchar(50) DEFAULT NULL,
  `due_date` date DEFAULT NULL COMMENT 'Due Date is NULL => the due dates can be set in separate payment schedule by Installment, OR there is no specific due date',
  `customer_id` int(11) DEFAULT NULL,
  `billing_address` varchar(150) CHARACTER SET utf8 DEFAULT '',
  `customer_email` varchar(150) CHARACTER SET latin1 DEFAULT '',
  `customer_phone` varchar(150) CHARACTER SET latin1 DEFAULT '',
  `customer_tax_number` varchar(150) CHARACTER SET latin1 DEFAULT '',
  `currency_code` varchar(10) CHARACTER SET latin1 NOT NULL,
  `exchange_rate` decimal(10,4) NOT NULL,
  `status_code` varchar(30) CHARACTER SET latin1 NOT NULL,
  `cashflow_activity_id` int(11) DEFAULT NULL,
  `cashflow_activity` varchar(150) DEFAULT NULL,
  `total_cost` decimal(10,2) NOT NULL DEFAULT 0.00,
  `amount` decimal(10,2) NOT NULL,
  `discount_percent` decimal(10,2) NOT NULL DEFAULT 0.00,
  `payback_price` decimal(10,2) DEFAULT 0.00,
  `reversed_cost` decimal(10,2) DEFAULT 0.00,
  `amount_due` decimal(10,2) NOT NULL,
  `amount_paid` decimal(10,2) NOT NULL,
  `tax_amount` decimal(10,4) DEFAULT 0.0000,
  `quotation_id` int(11) DEFAULT NULL,
  `recurring_name` varchar(30) CHARACTER SET latin1 DEFAULT '',
  `recurring_days` int(11) DEFAULT 0,
  `description` varchar(150) CHARACTER SET utf8 DEFAULT NULL,
  `import_session_id` int(20) DEFAULT NULL,
  `inactive` tinyint(6) NOT NULL,
  `create_user` varchar(255) CHARACTER SET latin1 NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `create_uid` int(8) DEFAULT NULL,
  `authorized` tinyint(4) DEFAULT 0,
  `auth_date` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `auth_user` varchar(40) DEFAULT NULL,
  `inactive_date` date DEFAULT NULL,
  `invoice_type` varchar(5) DEFAULT 'CI' COMMENT 'invoice_type = {CI,TI}   TI = Tax Invoice, CI = commeercial Invoice',
  `invoice_notes` varchar(200) CHARACTER SET utf8 DEFAULT '',
  `receivable_account_id` int(11) DEFAULT NULL,
  `pmt_bank_name` varchar(50) DEFAULT '',
  `pmt_account_name` varchar(35) DEFAULT '',
  `pmt_account_number` varchar(35) DEFAULT '',
  `signer_name` varchar(35) DEFAULT NULL,
  `discount_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `update_uid` int(10) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `total_tax` decimal(10,4) DEFAULT 0.0000,
  `tax_rate` decimal(10,2) DEFAULT 0.00,
  `discount_type` varchar(10) DEFAULT NULL,
  `invoice_class` varchar(20) DEFAULT '' COMMENT '{Medical,Regular}',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=134 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of invoices
-- ----------------------------
INSERT INTO `invoices` VALUES ('1', '56', '', 'V12023-00026', '2023-02-25 11:38:12.007421', 'net 60', '2023-02-12', '11', null, null, '01245645', '', 'USD', '4501.0000', 'active', null, null, '0.00', '101.50', '0.00', '0.00', '0.00', '101.50', '100.00', '0.0000', null, '', '0', null, null, '0', 'Samsethy', '2023-02-16 09:45:50', '1', '0', '2023-02-25 11:38:12', null, null, 'CI', null, null, 'ABA', 'Samsethy', '00601893', 'Samsethy', '0.00', null, '2023-02-25 11:38:12.007421', null, '0.0000', '0.00', null, null);
INSERT INTO `invoices` VALUES ('1', '60', '', 'V12023-00030', '2023-03-07 14:53:40.850070', 'net 60', '2023-02-12', '11', null, null, '01245645', '', 'USD', '4501.0000', 'active', null, null, '0.00', '101.50', '0.00', '0.00', '0.00', '101.50', '0.00', '0.0000', null, '', '0', null, null, '0', 'Samsethy', '2023-02-16 10:01:04', '1', '0', '2023-03-07 14:53:40', null, null, 'CI', null, null, 'ABA', 'Samsethy', '00601893', 'Samsethy', '0.00', null, '2023-03-07 14:53:40.850070', null, '0.0000', '0.00', null, null);
INSERT INTO `invoices` VALUES ('1', '68', '', 'V12023-00036', '2023-03-07 14:53:08.897653', 'net 30', '2023-02-19', '20', null, null, '0125346456', '', 'USD', '4501.0000', 'active', null, null, '0.00', '800.00', '0.00', '0.00', '0.00', '800.00', '50.00', '2.5000', null, '', '0', 'sdsfsdgsd', null, '0', 'Samsethy', '2023-02-19 12:29:25', '1', '0', '2023-03-07 14:53:08', null, null, 'CI', null, null, 'ABA', 'Samsethy', '00601893', 'Samsethy', '0.00', null, '2023-03-07 14:53:08.897653', null, '40.0000', '5.00', null, null);
INSERT INTO `invoices` VALUES ('1', '92', '', 'V12023-00059', '2023-04-06 15:27:59.746403', '0', '2023-04-06', '20', null, null, '0125346456', '', 'USD', '4501.0000', 'active', null, null, '0.00', '105.00', '0.00', '0.00', '0.00', '105.00', '0.00', '5.0000', null, '', '0', null, null, '0', 'Samsethy', '2023-04-06 15:27:59', '1', '0', '2023-04-06 15:27:59', null, null, 'CI', null, null, 'ABA', 'Samsethy', '00601893', 'Samsethy', '0.00', null, '2023-04-06 15:27:59.746403', null, '0.0000', '5.00', 'percentage', 'Regular');
INSERT INTO `invoices` VALUES ('1', '102', '', 'V12023-00060', '2023-04-06 23:27:19.619644', 'NA', '2023-04-06', '121', null, null, '0124565464', '', 'USD', '4501.0000', 'active', null, null, '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.0000', null, '', '0', null, null, '0', 'Samsethy', '2023-04-06 23:27:19', '1', '0', '2023-04-06 23:27:19', null, null, 'CI', null, null, 'ABA', 'Samsethy', '00601893', 'Samsethy', '0.00', null, '2023-04-06 23:27:19.619644', null, '0.0000', '0.00', 'percentage', 'Medical');
INSERT INTO `invoices` VALUES ('1', '109', '', 'V12023-00067', '2023-04-07 00:16:04.279971', 'NA', '2023-04-07', '122', null, null, '0112226735', '', 'USD', '4501.0000', 'active', null, null, '0.00', '3990.00', '0.00', '0.00', '0.00', '3990.00', '0.00', '190.0000', null, '', '0', null, null, '0', 'Samsethy', '2023-04-07 00:16:04', '1', '0', '2023-04-07 00:16:04', null, null, 'CI', null, null, 'ABA', 'Samsethy', '00601893', 'Samsethy', '0.00', null, '2023-04-07 00:16:04.279971', null, '0.0000', '2.50', 'percentage', 'Medical');
INSERT INTO `invoices` VALUES ('1', '110', '', 'V12023-00068', '2023-04-07 00:16:54.234231', 'NA', '2023-04-07', '122', null, null, '0112226735', '', 'USD', '4501.0000', 'active', null, null, '0.00', '3990.00', '0.00', '0.00', '0.00', '3990.00', '0.00', '190.0000', null, '', '0', null, null, '0', 'Samsethy', '2023-04-07 00:16:54', '1', '0', '2023-04-07 00:16:54', null, null, 'CI', null, null, 'ABA', 'Samsethy', '00601893', 'Samsethy', '0.00', null, '2023-04-07 00:16:54.234231', null, '0.0000', '2.50', 'percentage', 'Medical');
INSERT INTO `invoices` VALUES ('1', '113', '', 'V12023-00069', '2023-04-07 00:23:47.853846', 'NA', '2023-04-07', '121', null, null, '0124565464', '', 'USD', '4501.0000', 'active', null, null, '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.0000', null, '', '0', null, null, '0', 'Samsethy', '2023-04-07 00:23:47', '1', '0', '2023-04-07 00:23:47', null, null, 'CI', null, null, 'ABA', 'Samsethy', '00601893', 'Samsethy', '0.00', null, '2023-04-07 00:23:47.853846', null, '0.0000', '0.00', 'percentage', 'Medical');
INSERT INTO `invoices` VALUES ('1', '115', '', 'V12023-00071', '2023-04-07 00:25:23.491102', 'NA', '2023-04-07', '122', null, null, '0112226735', '', 'USD', '4501.0000', 'active', null, null, '0.00', '3990.00', '0.00', '0.00', '0.00', '3990.00', '0.00', '190.0000', null, '', '0', null, null, '0', 'Samsethy', '2023-04-07 00:25:23', '1', '0', '2023-04-07 00:25:23', null, null, 'CI', null, null, 'ABA', 'Samsethy', '00601893', 'Samsethy', '0.00', null, '2023-04-07 00:25:23.491102', null, '0.0000', '2.50', 'percentage', 'Medical');
INSERT INTO `invoices` VALUES ('1', '116', '', 'V12023-00072', '2023-04-07 00:25:58.958794', 'NA', '2023-04-07', '121', null, null, '0124565464', '', 'USD', '4501.0000', 'active', null, null, '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.0000', null, '', '0', null, null, '0', 'Samsethy', '2023-04-07 00:25:58', '1', '0', '2023-04-07 00:25:58', null, null, 'CI', null, null, 'ABA', 'Samsethy', '00601893', 'Samsethy', '0.00', null, '2023-04-07 00:25:58.958794', null, '0.0000', '0.00', 'percentage', 'Medical');
INSERT INTO `invoices` VALUES ('1', '131', '', 'V12023-00087', '2023-04-10 05:32:03.326624', 'NA', '2023-04-10', '127', null, null, '011456456', '', 'USD', '4501.0000', 'active', null, null, '0.00', '2855.00', '0.00', '0.00', '0.00', '2855.00', '0.00', '125.0000', null, '', '0', null, null, '0', 'Samsethy', '2023-04-10 05:32:03', '1', '0', '2023-04-10 05:32:03', null, null, 'CI', null, null, 'ABA', 'Samsethy', '00601893', 'Samsethy', '0.00', null, '2023-04-10 05:32:03.326624', null, '0.0000', '3.33', 'percentage', 'Medical');
INSERT INTO `invoices` VALUES ('1', '133', '', 'V12023-00089', '2023-04-10 10:36:58.946512', null, '2023-04-10', '127', null, null, '011456456', '', 'USD', '4501.0000', 'active', null, null, '0.00', '1260.00', '0.00', '0.00', '0.00', '1260.00', '0.00', '60.0000', null, '', '0', null, null, '0', 'Samsethy', '2023-04-10 10:13:49', '1', '0', '2023-04-10 10:36:58', null, null, 'CI', null, null, 'ABA', 'Samsethy', '00601893', 'Samsethy', '0.00', '1', '2023-04-10 10:36:58.946512', 'Samsethy', '0.0000', '5.00', 'percentage', 'Medical');

-- ----------------------------
-- Table structure for `invoice_items`
-- ----------------------------
DROP TABLE IF EXISTS `invoice_items`;
CREATE TABLE `invoice_items` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) DEFAULT NULL,
  `invoice_id` varchar(35) NOT NULL,
  `item_id` bigint(11) DEFAULT NULL,
  `item_name` varchar(150) CHARACTER SET latin1 DEFAULT NULL,
  `description` varchar(250) DEFAULT NULL,
  `sku` varchar(150) CHARACTER SET latin1 DEFAULT NULL,
  `qty` decimal(10,2) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `discount_percent` decimal(10,2) NOT NULL,
  `cost` decimal(10,2) DEFAULT 0.00,
  `tax_id` int(7) DEFAULT NULL,
  `tax_rate` decimal(7,2) NOT NULL,
  `tax_amount` decimal(10,2) DEFAULT 0.00,
  `net_amount` decimal(10,2) DEFAULT 0.00 COMMENT 'net_amount = qty* (price - discount) not including tax amount',
  `create_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `create_uid` int(8) DEFAULT NULL,
  `create_user` varchar(255) CHARACTER SET latin1 NOT NULL,
  `import_session_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `discount_amount` decimal(10,2) DEFAULT 0.00,
  `discount_type` varchar(10) DEFAULT NULL,
  `item_code` varchar(25) DEFAULT NULL,
  `invoice_item_class` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=409 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of invoice_items
-- ----------------------------
INSERT INTO `invoice_items` VALUES ('81', '1', '56', '1', 'Bioselenium Shampoo 100ml', 'sdddsfsdf', 'Bottle', '2.00', '25.00', '5.00', '0.00', null, '0.00', '0.00', '47.50', '2023-02-16 09:45:50', '1', 'Samsethy', null, '2023-02-16 09:45:50', '2023-02-16 09:45:50', '0.00', null, null, null);
INSERT INTO `invoice_items` VALUES ('82', '1', '56', '2', 'Fixderma Moisturizing Cream', 'sdfghgjkjh', 'Tube', '3.00', '20.00', '10.00', '0.00', null, '0.00', '0.00', '54.00', '2023-02-16 09:45:50', '1', 'Samsethy', null, '2023-02-16 09:45:50', '2023-02-16 09:45:50', '0.00', null, null, null);
INSERT INTO `invoice_items` VALUES ('89', '1', '60', '1', 'Bioselenium Shampoo 100ml', 'sdddsfsdf', 'Bottle', '2.00', '25.00', '5.00', '0.00', null, '0.00', '0.00', '47.50', '2023-02-16 10:01:04', '1', 'Samsethy', null, '2023-02-16 10:01:04', '2023-02-16 10:01:04', '0.00', null, null, null);
INSERT INTO `invoice_items` VALUES ('90', '1', '60', '2', 'Fixderma Moisturizing Cream', 'sdfghgjkjh', 'Tube', '3.00', '20.00', '10.00', '0.00', null, '0.00', '0.00', '54.00', '2023-02-16 10:01:04', '1', 'Samsethy', null, '2023-02-16 10:01:04', '2023-02-16 10:01:04', '0.00', null, null, null);
INSERT INTO `invoice_items` VALUES ('101', '1', '68', '245', 'Y Mycin A ', 'Y Mycin A ', 'Tube', '20.00', '50.00', '20.00', '0.00', null, '5.00', '40.00', '800.00', '2023-02-19 12:29:25', '1', 'Samsethy', null, '2023-02-19 12:29:25', '2023-02-19 12:29:25', '0.00', null, null, null);
INSERT INTO `invoice_items` VALUES ('146', '1', '92', '245', 'Y Mycin A ', 'Y Mycin A ', 'Tube', '1.00', '100.00', '0.00', '0.00', null, '5.00', '5.00', '105.00', '2023-04-06 15:27:59', '1', 'Samsethy', null, '2023-04-06 15:27:59', '2023-04-06 15:27:59', '0.00', 'percentage', null, 'Product');
INSERT INTO `invoice_items` VALUES ('147', '1', '102', '28', 'Medical Consultation', 'Medical Consultation', 'none', '0.00', '0.00', '0.00', null, null, '0.00', '0.00', '0.00', '2023-04-06 23:27:19', '1', 'Samsethy', null, '2023-04-06 23:27:19', '2023-04-06 23:27:19', '0.00', 'percentage', null, 'service');
INSERT INTO `invoice_items` VALUES ('154', '1', '109', '81', 'VIK 1-vitamin K1 inj 10mg/1ml', 'VIK 1-vitamin K1 inj 10mg/1ml', 'Amp', '15.00', '100.00', '0.00', '0.00', null, '5.00', '75.00', '1575.00', '2023-04-07 00:16:04', '1', 'Samsethy', null, '2023-04-07 00:16:04', '2023-04-07 00:16:04', '0.00', 'percentage', null, 'product');
INSERT INTO `invoice_items` VALUES ('155', '1', '109', '232', 'Whiteness lightening serum', 'Whiteness lightening serum', 'Tube', '20.00', '100.00', '0.00', '0.00', null, '5.00', '100.00', '2100.00', '2023-04-07 00:16:04', '1', 'Samsethy', null, '2023-04-07 00:16:04', '2023-04-07 00:16:04', '0.00', 'percentage', null, 'product');
INSERT INTO `invoice_items` VALUES ('156', '1', '109', '63', 'Zithrosun-250', 'Zithrosun-250', 'Tablet', '3.00', '100.00', '0.00', '0.00', null, '5.00', '15.00', '315.00', '2023-04-07 00:16:04', '1', 'Samsethy', null, '2023-04-07 00:16:04', '2023-04-07 00:16:04', '0.00', 'percentage', null, 'product');
INSERT INTO `invoice_items` VALUES ('157', '1', '109', '2', 'Facial treatment', 'Facial treatment', 'none', '1.00', '0.00', '0.00', '0.00', null, '0.00', '0.00', '0.00', '2023-04-07 00:16:04', '1', 'Samsethy', null, '2023-04-07 00:16:04', '2023-04-07 00:16:04', '0.00', 'percentage', null, 'service');
INSERT INTO `invoice_items` VALUES ('158', '1', '109', '11', 'Skin whitening Natural', 'Skin whitening Natural', 'none', '1.00', '0.00', '0.00', null, null, '0.00', '0.00', '0.00', '2023-04-07 00:16:04', '1', 'Samsethy', null, '2023-04-07 00:16:04', '2023-04-07 00:16:04', '0.00', 'percentage', null, 'service');
INSERT INTO `invoice_items` VALUES ('159', '1', '109', '32', 'Urine test', 'Urine test', 'none', '1.00', '0.00', '0.00', null, null, '0.00', '0.00', '0.00', '2023-04-07 00:16:04', '1', 'Samsethy', null, '2023-04-07 00:16:04', '2023-04-07 00:16:04', '0.00', 'percentage', null, 'labo');
INSERT INTO `invoice_items` VALUES ('160', '1', '110', '81', 'VIK 1-vitamin K1 inj 10mg/1ml', 'VIK 1-vitamin K1 inj 10mg/1ml', 'Amp', '15.00', '100.00', '0.00', '0.00', null, '5.00', '75.00', '1575.00', '2023-04-07 00:16:54', '1', 'Samsethy', null, '2023-04-07 00:16:54', '2023-04-07 00:16:54', '0.00', 'percentage', null, 'product');
INSERT INTO `invoice_items` VALUES ('161', '1', '110', '232', 'Whiteness lightening serum', 'Whiteness lightening serum', 'Tube', '20.00', '100.00', '0.00', '0.00', null, '5.00', '100.00', '2100.00', '2023-04-07 00:16:54', '1', 'Samsethy', null, '2023-04-07 00:16:54', '2023-04-07 00:16:54', '0.00', 'percentage', null, 'product');
INSERT INTO `invoice_items` VALUES ('162', '1', '110', '63', 'Zithrosun-250', 'Zithrosun-250', 'Tablet', '3.00', '100.00', '0.00', '0.00', null, '5.00', '15.00', '315.00', '2023-04-07 00:16:54', '1', 'Samsethy', null, '2023-04-07 00:16:54', '2023-04-07 00:16:54', '0.00', 'percentage', null, 'product');
INSERT INTO `invoice_items` VALUES ('163', '1', '110', '2', 'Facial treatment', 'Facial treatment', 'none', '1.00', '0.00', '0.00', '0.00', null, '0.00', '0.00', '0.00', '2023-04-07 00:16:54', '1', 'Samsethy', null, '2023-04-07 00:16:54', '2023-04-07 00:16:54', '0.00', 'percentage', null, 'service');
INSERT INTO `invoice_items` VALUES ('164', '1', '110', '11', 'Skin whitening Natural', 'Skin whitening Natural', 'none', '1.00', '0.00', '0.00', null, null, '0.00', '0.00', '0.00', '2023-04-07 00:16:54', '1', 'Samsethy', null, '2023-04-07 00:16:54', '2023-04-07 00:16:54', '0.00', 'percentage', null, 'service');
INSERT INTO `invoice_items` VALUES ('165', '1', '110', '32', 'Urine test', 'Urine test', 'none', '1.00', '0.00', '0.00', null, null, '0.00', '0.00', '0.00', '2023-04-07 00:16:54', '1', 'Samsethy', null, '2023-04-07 00:16:54', '2023-04-07 00:16:54', '0.00', 'percentage', null, 'labo');
INSERT INTO `invoice_items` VALUES ('166', '1', '113', '28', 'Medical Consultation', 'Medical Consultation', 'none', '0.00', '0.00', '0.00', null, null, '0.00', '0.00', '0.00', '2023-04-07 00:23:47', '1', 'Samsethy', null, '2023-04-07 00:23:47', '2023-04-07 00:23:47', '0.00', 'percentage', null, 'service');
INSERT INTO `invoice_items` VALUES ('173', '1', '115', '81', 'VIK 1-vitamin K1 inj 10mg/1ml', 'VIK 1-vitamin K1 inj 10mg/1ml', 'Amp', '15.00', '100.00', '0.00', '0.00', null, '5.00', '75.00', '1575.00', '2023-04-07 00:25:23', '1', 'Samsethy', null, '2023-04-07 00:25:23', '2023-04-07 00:25:23', '0.00', 'percentage', null, 'product');
INSERT INTO `invoice_items` VALUES ('174', '1', '115', '232', 'Whiteness lightening serum', 'Whiteness lightening serum', 'Tube', '20.00', '100.00', '0.00', '0.00', null, '5.00', '100.00', '2100.00', '2023-04-07 00:25:23', '1', 'Samsethy', null, '2023-04-07 00:25:23', '2023-04-07 00:25:23', '0.00', 'percentage', null, 'product');
INSERT INTO `invoice_items` VALUES ('175', '1', '115', '63', 'Zithrosun-250', 'Zithrosun-250', 'Tablet', '3.00', '100.00', '0.00', '0.00', null, '5.00', '15.00', '315.00', '2023-04-07 00:25:23', '1', 'Samsethy', null, '2023-04-07 00:25:23', '2023-04-07 00:25:23', '0.00', 'percentage', null, 'product');
INSERT INTO `invoice_items` VALUES ('176', '1', '115', '2', 'Facial treatment', 'Facial treatment', 'none', '1.00', '0.00', '0.00', '0.00', null, '0.00', '0.00', '0.00', '2023-04-07 00:25:23', '1', 'Samsethy', null, '2023-04-07 00:25:23', '2023-04-07 00:25:23', '0.00', 'percentage', null, 'service');
INSERT INTO `invoice_items` VALUES ('177', '1', '115', '11', 'Skin whitening Natural', 'Skin whitening Natural', 'none', '1.00', '0.00', '0.00', null, null, '0.00', '0.00', '0.00', '2023-04-07 00:25:23', '1', 'Samsethy', null, '2023-04-07 00:25:23', '2023-04-07 00:25:23', '0.00', 'percentage', null, 'service');
INSERT INTO `invoice_items` VALUES ('178', '1', '115', '32', 'Urine test', 'Urine test', 'none', '1.00', '0.00', '0.00', null, null, '0.00', '0.00', '0.00', '2023-04-07 00:25:23', '1', 'Samsethy', null, '2023-04-07 00:25:23', '2023-04-07 00:25:23', '0.00', 'percentage', null, 'labo');
INSERT INTO `invoice_items` VALUES ('179', '1', '116', '28', 'Medical Consultation', 'Medical Consultation', 'none', '0.00', '0.00', '0.00', null, null, '0.00', '0.00', '0.00', '2023-04-07 00:25:58', '1', 'Samsethy', null, '2023-04-07 00:25:58', '2023-04-07 00:25:58', '0.00', 'percentage', null, 'service');
INSERT INTO `invoice_items` VALUES ('279', '1', '131', '245', 'Y Mycin A ', 'Y Mycin A ', 'Tube', '10.00', '100.00', '0.00', '0.00', null, '5.00', '50.00', '1050.00', '2023-04-10 05:32:03', '1', 'Samsethy', null, '2023-04-10 05:32:03', '2023-04-10 05:32:03', '0.00', 'percentage', null, 'product');
INSERT INTO `invoice_items` VALUES ('280', '1', '131', '244', 'Y Mycin N', 'Y Mycin N', 'Tube', '15.00', '100.00', '0.00', '0.00', null, '5.00', '75.00', '1575.00', '2023-04-10 05:32:03', '1', 'Samsethy', null, '2023-04-10 05:32:03', '2023-04-10 05:32:03', '0.00', 'percentage', null, 'product');
INSERT INTO `invoice_items` VALUES ('281', '1', '131', '35', 'Package 1', 'Package 1', 'none', '1.00', '230.00', '0.00', '0.00', null, '0.00', '0.00', '230.00', '2023-04-10 05:32:03', '1', 'Samsethy', null, '2023-04-10 05:32:03', '2023-04-10 05:32:03', '0.00', 'percentage', null, 'service');
INSERT INTO `invoice_items` VALUES ('406', '1', '133', '245', 'Y Mycin A ', 'Y Mycin A ', 'Tube', '10.00', '100.00', '0.00', '0.00', null, '5.00', '50.00', '1050.00', '2023-04-10 10:42:55', '1', 'Samsethy', null, '2023-04-10 10:42:55', '2023-04-10 10:42:55', '0.00', 'percentage', null, 'product');
INSERT INTO `invoice_items` VALUES ('407', '1', '133', '32', 'Syringe 5ml-25G Vinahankook B/100P', 'Urine test', 'Tube', '1.00', '100.00', '0.00', '0.00', null, '5.00', '5.00', '105.00', '2023-04-10 10:42:55', '1', 'Samsethy', null, '2023-04-10 10:42:55', '2023-04-10 10:42:55', '0.00', 'percentage', null, 'labo');
INSERT INTO `invoice_items` VALUES ('408', '1', '133', '32', 'Syringe 5ml-25G Vinahankook B/100P', 'Urine test', 'Tube', '1.00', '100.00', '0.00', '0.00', null, '5.00', '5.00', '105.00', '2023-04-10 10:42:55', '1', 'Samsethy', null, '2023-04-10 10:42:55', '2023-04-10 10:42:55', '0.00', 'percentage', null, 'labo');

-- ----------------------------
-- Table structure for `invoice_number_control`
-- ----------------------------
DROP TABLE IF EXISTS `invoice_number_control`;
CREATE TABLE `invoice_number_control` (
  `doc_class` varchar(25) NOT NULL,
  `com_branch_id` int(10) DEFAULT 0 COMMENT 'voucher_type = {income,expense,expenditure}',
  `branch_id` int(10) NOT NULL,
  `issue_year` int(10) NOT NULL,
  `prefix` varchar(10) DEFAULT NULL,
  `last_id` int(10) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of invoice_number_control
-- ----------------------------
INSERT INTO `invoice_number_control` VALUES ('tax_line', null, '1', '2023', '', '89');
INSERT INTO `invoice_number_control` VALUES ('tax_line', null, '1', '2025', '', '2');

-- ----------------------------
-- Table structure for `invoice_payments`
-- ----------------------------
DROP TABLE IF EXISTS `invoice_payments`;
CREATE TABLE `invoice_payments` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `invoice_id` int(10) NOT NULL,
  `payment_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `notes` varchar(250) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `currency_code` varchar(10) DEFAULT NULL,
  `exchange_rate` decimal(10,2) DEFAULT 1.00,
  `tax_amount` decimal(10,2) DEFAULT 0.00,
  `ref_number` varchar(25) DEFAULT NULL,
  `amount_after_tax` decimal(10,2) DEFAULT 0.00,
  `payer_name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of invoice_payments
-- ----------------------------
INSERT INTO `invoice_payments` VALUES ('93', '1', '56', '2023-02-25 11:37:58.827754', '50.00', null, '1', '2023-02-25 11:37:58.827754', 'Samsethy', null, '2023-02-25 11:37:58.827754', null, 'USD', '1.00', '0.00', 'P12023-00084', '0.00', null);
INSERT INTO `invoice_payments` VALUES ('94', '1', '56', '2023-02-25 11:38:11.989372', '50.00', null, '1', '2023-02-25 11:38:11.989372', 'Samsethy', null, '2023-02-25 11:38:11.989372', null, 'USD', '1.00', '0.00', 'P12023-00085', '0.00', null);
INSERT INTO `invoice_payments` VALUES ('95', '1', '68', '2023-03-07 14:53:08.886449', '50.00', 'sdgdfgfd', '1', '2023-03-07 14:53:08.886449', 'Samsethy', null, '2023-03-07 14:53:08.886449', null, 'USD', '1.00', '2.50', 'P12023-00086', '0.00', null);

-- ----------------------------
-- Table structure for `inv_adjustment_types`
-- ----------------------------
DROP TABLE IF EXISTS `inv_adjustment_types`;
CREATE TABLE `inv_adjustment_types` (
  `id` int(10) NOT NULL DEFAULT 0,
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
  `warehouse_id` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_adjustment_types
-- ----------------------------
INSERT INTO `inv_adjustment_types` VALUES ('1', '1', 'Missing', 'Missing', null, null, '2022-12-02 10:38:09.982458', null, null, '2022-12-02 10:38:09.982458', null, '0');
INSERT INTO `inv_adjustment_types` VALUES ('2', '1', 'shrinkage', 'shrinkage', null, null, '2022-12-02 10:37:20.193295', null, null, '2022-12-02 10:37:20.193295', null, '0');
INSERT INTO `inv_adjustment_types` VALUES ('3', '1', 'broken', 'broken', null, null, null, null, null, null, null, '0');
INSERT INTO `inv_adjustment_types` VALUES ('4', '1', 'Theft', 'Theft', null, null, null, null, null, null, null, '0');

-- ----------------------------
-- Table structure for `inv_blocks`
-- ----------------------------
DROP TABLE IF EXISTS `inv_blocks`;
CREATE TABLE `inv_blocks` (
  `id` int(10) NOT NULL DEFAULT 0,
  `branch_id` int(10) NOT NULL,
  `name` varchar(150) NOT NULL,
  `code` varchar(10) NOT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_uid` int(10) DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_blocks
-- ----------------------------
INSERT INTO `inv_blocks` VALUES ('1', '1', 'Block A', 'A', '1', 'Admin', null, null, null, null);

-- ----------------------------
-- Table structure for `inv_brands`
-- ----------------------------
DROP TABLE IF EXISTS `inv_brands`;
CREATE TABLE `inv_brands` (
  `id` int(10) NOT NULL DEFAULT 0,
  `name` varchar(100) NOT NULL DEFAULT '',
  `branch_id` int(10) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_user` varchar(50) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `name_kh` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
-- Table structure for `inv_categories`
-- ----------------------------
DROP TABLE IF EXISTS `inv_categories`;
CREATE TABLE `inv_categories` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `name` varchar(150) NOT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `description` varchar(250) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `item_class` varchar(50) DEFAULT NULL COMMENT 'item_class ={RM,FG,MI}. RM = Raw Materials, FG = Finsihed Goods, MI = Merchandising Items',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_categories
-- ----------------------------
INSERT INTO `inv_categories` VALUES ('1', '1', 'Topical Product', 'Admin', '1', '2023-01-14 16:33:59.575929', 'Topical Product', '2023-01-14 16:33:59.575929', null, null, 'MI');
INSERT INTO `inv_categories` VALUES ('2', '1', 'Oral Medicine', 'Admin', '1', '2023-01-14 23:08:21.635936', 'Oral Medicine', '2023-01-14 23:08:21.000000', 'Samsethy', '1', 'MI');
INSERT INTO `inv_categories` VALUES ('3', '1', 'Equipment', 'Admin', '1', '2023-01-14 16:34:02.352747', 'Equipment', '2023-01-14 16:34:02.352747', 'Samsethy', '1', 'MI');
INSERT INTO `inv_categories` VALUES ('4', '1', 'Injection', 'Admin', '1', '2023-01-14 16:34:03.661090', 'Injection', '2023-01-14 16:34:03.661090', null, null, 'MI');
INSERT INTO `inv_categories` VALUES ('5', '1', 'Sale product', 'Admin', '1', '2023-01-14 16:34:04.815243', 'Sale product', '2023-01-14 16:34:04.815243', null, null, 'MI');
INSERT INTO `inv_categories` VALUES ('27', '1', 'Raw Material', 'Samsethy', '1', '2023-01-20 16:51:13.000000', null, null, null, null, 'MI');
INSERT INTO `inv_categories` VALUES ('28', '1', 'Sam Category', 'Samsethy', '1', '2023-02-04 14:42:33.000000', null, null, null, null, 'MI');
INSERT INTO `inv_categories` VALUES ('29', '1', 'Sam Category1', 'Samsethy', '1', '2023-02-05 17:15:55.000000', null, null, null, null, 'MI');

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
-- Table structure for `inv_current_stocks`
-- ----------------------------
DROP TABLE IF EXISTS `inv_current_stocks`;
CREATE TABLE `inv_current_stocks` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `item_id` int(10) NOT NULL,
  `item_code` varchar(25) DEFAULT NULL,
  `qty` decimal(10,2) NOT NULL DEFAULT 0.00,
  `create_uid` int(10) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `sku` varchar(25) DEFAULT '',
  `last_count_date` date DEFAULT NULL,
  `warehouse_id` int(10) NOT NULL,
  `stockclass_code` varchar(25) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_current_stocks
-- ----------------------------
INSERT INTO `inv_current_stocks` VALUES ('1', '1', '145', 'TP0061', '30.00', null, null, '2023-02-12 19:41:14.021374', 'Samsethy', '1', '2023-02-12 19:41:14.000000', 'bottle', null, '1', 'A');
INSERT INTO `inv_current_stocks` VALUES ('2', '1', '147', 'TP0063', '110.00', null, null, '2023-02-13 11:19:05.172936', 'Samsethy', '1', '2023-02-13 11:19:05.000000', 'box', null, '1', 'A');
INSERT INTO `inv_current_stocks` VALUES ('3', '1', '125', '100016', '260.00', null, null, '2023-04-09 12:26:14.619403', 'Samsethy', '1', '2023-04-09 12:26:14.000000', 'Bottle', null, '1', 'A');
INSERT INTO `inv_current_stocks` VALUES ('4', '1', '106', 'TP0048', '15.00', null, null, '2023-04-09 12:26:14.613385', 'Samsethy', '1', '2023-04-09 12:26:14.000000', 'Bottle', null, '1', 'A');
INSERT INTO `inv_current_stocks` VALUES ('5', '1', '244', 'TP0074', '20.00', null, null, null, 'Samsethy', '1', '2023-04-09 12:25:02.000000', 'Tube', null, '1', 'A');
INSERT INTO `inv_current_stocks` VALUES ('6', '1', '52', '100137', '25.00', null, null, '2023-04-10 11:11:28.769072', 'Samsethy', '1', '2023-04-10 11:11:28.000000', 'Box', null, '1', 'A');
INSERT INTO `inv_current_stocks` VALUES ('7', '1', '27', '100135', '20.00', null, null, '2023-04-10 11:19:56.812231', 'Samsethy', '1', '2023-04-10 11:19:56.000000', 'Bottle', null, '1', 'A');
INSERT INTO `inv_current_stocks` VALUES ('8', '1', '20', 'TP0019', '10.00', null, null, null, 'Samsethy', '1', '2023-04-10 11:37:58.000000', 'Tube', null, '1', 'A');
INSERT INTO `inv_current_stocks` VALUES ('9', '1', '66', 'OM0014', '8.00', null, null, '2023-04-10 11:42:04.944325', 'Samsethy', '1', '2023-04-10 11:42:04.000000', 'Tablet', null, '1', 'A');

-- ----------------------------
-- Table structure for `inv_daily_stocks`
-- ----------------------------
DROP TABLE IF EXISTS `inv_daily_stocks`;
CREATE TABLE `inv_daily_stocks` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `stockclass_code` varchar(15) NOT NULL,
  `warehouse_id` int(10) NOT NULL,
  `block_code` varchar(15) DEFAULT NULL,
  `item_id` int(10) NOT NULL,
  `item_code` varchar(25) NOT NULL,
  `unit_id` int(10) NOT NULL,
  `sku` varchar(15) NOT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) NOT NULL,
  `update_uid` int(10) NOT NULL,
  `remarks` varchar(200) DEFAULT NULL,
  `begin_qty` decimal(10,2) NOT NULL,
  `purchase_qty` decimal(10,2) NOT NULL,
  `sold_qty` decimal(10,2) NOT NULL,
  `customer_return_qty` decimal(10,2) NOT NULL,
  `vendor_return_qty` decimal(10,2) NOT NULL,
  `adjust_qty` decimal(10,2) NOT NULL,
  `qty` decimal(10,2) NOT NULL DEFAULT 0.00,
  `trx_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_uid` int(10) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_daily_stocks
-- ----------------------------
INSERT INTO `inv_daily_stocks` VALUES ('1', '1', 'A', '1', null, '145', 'TP0061', '145', 'bottle', '2023-02-12 19:41:13.000000', 'admin@gmail.com', '1', null, '0.00', '30.00', '0.00', '0.00', '0.00', '0.00', '0.00', '2023-02-12 19:41:13.992328', '2023-02-12 19:41:13.992328', '1', 'admin@gmail.com');
INSERT INTO `inv_daily_stocks` VALUES ('2', '1', 'A', '1', null, '147', 'TP0063', '147', 'box', '2023-02-12 19:41:14.000000', 'admin@gmail.com', '1', null, '0.00', '30.00', '0.00', '0.00', '0.00', '0.00', '0.00', '2023-02-12 19:41:14.008877', '2023-02-12 19:41:14.008877', '1', 'admin@gmail.com');
INSERT INTO `inv_daily_stocks` VALUES ('3', '1', 'A', '1', null, '147', 'TP0063', '147', 'box', '2023-02-13 11:19:05.000000', 'admin@gmail.com', '1', null, '30.00', '80.00', '0.00', '0.00', '0.00', '0.00', '0.00', '2023-02-13 11:19:05.103073', '2023-02-13 11:19:05.103073', '1', 'admin@gmail.com');
INSERT INTO `inv_daily_stocks` VALUES ('4', '1', 'A', '1', null, '125', '100016', '125', 'bottle', '2023-02-13 11:19:05.000000', 'admin@gmail.com', '1', null, '0.00', '60.00', '0.00', '0.00', '0.00', '0.00', '0.00', '2023-02-13 11:19:05.077330', '2023-02-13 11:19:05.077330', '1', 'admin@gmail.com');
INSERT INTO `inv_daily_stocks` VALUES ('5', '1', 'A', '1', null, '125', '100016', '125', 'bottle', '2023-04-08 12:23:00.000000', 'admin@gmail.com', '1', null, '60.00', '170.00', '0.00', '0.00', '0.00', '0.00', '0.00', '2023-04-08 12:23:00.043076', '2023-04-08 12:23:00.043076', '1', 'admin@gmail.com');
INSERT INTO `inv_daily_stocks` VALUES ('6', '1', 'A', '1', null, '106', 'TP0048', '106', 'Bottle', '2023-04-09 12:26:14.000000', 'admin@gmail.com', '1', null, '0.00', '15.00', '0.00', '0.00', '0.00', '0.00', '0.00', '2023-04-09 12:26:14.566385', '2023-04-09 12:26:14.566385', '1', 'admin@gmail.com');
INSERT INTO `inv_daily_stocks` VALUES ('7', '1', 'A', '1', null, '244', 'TP0074', '244', 'Tube', '2023-04-09 12:25:02.000000', 'admin@gmail.com', '1', null, '0.00', '20.00', '0.00', '0.00', '0.00', '0.00', '0.00', '2023-04-09 12:25:02.430749', '2023-04-09 12:25:02.430749', '1', 'admin@gmail.com');
INSERT INTO `inv_daily_stocks` VALUES ('8', '1', 'A', '1', null, '125', '100016', '125', 'Bottle', '2023-04-09 12:26:14.000000', 'admin@gmail.com', '1', null, '230.00', '30.00', '0.00', '0.00', '0.00', '0.00', '0.00', '2023-04-09 12:26:14.592812', '2023-04-09 12:26:14.592812', '1', 'admin@gmail.com');
INSERT INTO `inv_daily_stocks` VALUES ('9', '1', 'A', '1', null, '52', '100137', '52', 'Box', '2023-04-10 11:11:28.000000', 'admin@gmail.com', '1', null, '0.00', '25.00', '0.00', '0.00', '0.00', '0.00', '0.00', '2023-04-10 11:11:28.755614', '2023-04-10 11:11:28.755614', '1', 'admin@gmail.com');
INSERT INTO `inv_daily_stocks` VALUES ('10', '1', 'A', '1', null, '27', '100135', '27', 'Bottle', '2023-04-10 11:19:56.000000', 'admin@gmail.com', '1', null, '0.00', '20.00', '0.00', '0.00', '0.00', '0.00', '0.00', '2023-04-10 11:19:56.797446', '2023-04-10 11:19:56.797446', '1', 'admin@gmail.com');
INSERT INTO `inv_daily_stocks` VALUES ('11', '1', 'A', '1', null, '20', 'TP0019', '20', 'Tube', '2023-04-10 11:37:58.000000', 'admin@gmail.com', '1', null, '0.00', '10.00', '0.00', '0.00', '0.00', '0.00', '0.00', '2023-04-10 11:37:58.638147', '2023-04-10 11:37:58.638147', '1', 'admin@gmail.com');
INSERT INTO `inv_daily_stocks` VALUES ('12', '1', 'A', '1', null, '66', 'OM0014', '66', 'Tablet', '2023-04-10 11:42:04.000000', 'admin@gmail.com', '1', null, '0.00', '8.00', '0.00', '0.00', '0.00', '0.00', '0.00', '2023-04-10 11:42:04.930866', '2023-04-10 11:42:04.930866', '1', 'admin@gmail.com');

-- ----------------------------
-- Table structure for `inv_detailed_types`
-- ----------------------------
DROP TABLE IF EXISTS `inv_detailed_types`;
CREATE TABLE `inv_detailed_types` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `category_id` int(10) NOT NULL,
  `create_uid` int(10) NOT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_detailed_types
-- ----------------------------
INSERT INTO `inv_detailed_types` VALUES ('1', '0', 'General', '0', '1', 'Admin', null);

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
-- Table structure for `inv_group_code_control`
-- ----------------------------
DROP TABLE IF EXISTS `inv_group_code_control`;
CREATE TABLE `inv_group_code_control` (
  `branch_id` int(10) NOT NULL,
  `last_id` int(10) NOT NULL,
  `classify_by` varchar(20) DEFAULT NULL,
  `prefix` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_group_code_control
-- ----------------------------
INSERT INTO `inv_group_code_control` VALUES ('1', '1', null, 'DOL');
INSERT INTO `inv_group_code_control` VALUES ('1', '1', null, 'PAR');
INSERT INTO `inv_group_code_control` VALUES ('1', '1', null, 'SDG');
INSERT INTO `inv_group_code_control` VALUES ('1', '1', null, 'DDG');
INSERT INTO `inv_group_code_control` VALUES ('1', '1', null, 'OIL');
INSERT INTO `inv_group_code_control` VALUES ('1', '1', null, 'TES');
INSERT INTO `inv_group_code_control` VALUES ('1', '1', null, 'DDD');
INSERT INTO `inv_group_code_control` VALUES ('1', '5', null, 'ACN');

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
  `brand_id` int(10) DEFAULT NULL,
  `manufacturer_id` int(10) DEFAULT NULL,
  `made_in_country_id` int(10) DEFAULT NULL,
  `cost` decimal(10,2) DEFAULT 0.00,
  `sku` varchar(20) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `selling_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `ws_selling_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `item_class` varchar(5) DEFAULT 'MI',
  `sales_tax_rate` decimal(10,2) DEFAULT 0.00,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=615 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_items
-- ----------------------------
INSERT INTO `inv_items` VALUES ('1', '1', 'TP0066', 'Bioselenium Shampoo 100ml', 'Bioselenium Shampoo 100ml', 'Bioselenium Shampoo 100ml', '1', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('2', '1', '100146', 'Fixderma Moisturizing Cream', 'Fixderma Moisturizing Cream', 'Fixderma Moisturizing Cream', '2', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', 'Samsethy', null, null, null, '4', null, null, null, '0.00', 'Tube', '1', '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('3', '1', 'TP0003', 'Tidact gel', 'Tidact gel', 'Tidact gel', '3', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('4', '1', 'TP0001', 'Tacroz', 'Tacroz', 'Tacroz', '4', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('5', '1', 'TP0004', 'Disut-H Cream 15g', 'Disut-H Cream 15g', 'Disut-H Cream 15g', '5', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('6', '1', 'TP0005', 'Tacopic 0.1%', 'Tacopic 0.1%', 'Tacopic 0.1%', '6', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('7', '1', 'TP0006', 'Disuf-B cream 15g', 'Disuf-B cream 15g', 'Disuf-B cream 15g', '7', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('8', '1', 'TP0007', 'Candid-B Cream', 'Candid-B Cream', 'Candid-B Cream', '8', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('9', '1', 'TP0008', 'Candid Cream', 'Candid Cream', 'Candid Cream', '9', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('10', '1', 'TP0009', 'Elosone Cream', 'Elosone Cream', 'Elosone Cream', '10', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('11', '1', 'TP0010', 'Cloderm Cream 15g', 'Cloderm Cream 15g', 'Cloderm Cream 15g', '11', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('12', '1', 'TP0011', 'Beprosalic Ointment ', 'Beprosalic Ointment ', 'Beprosalic Ointment ', '12', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('13', '1', 'TP0012', 'Rozex gel 50g', 'Rozex gel 50g', 'Rozex gel 50g', '13', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('14', '1', 'TP0013', 'Beprogel Lotion 30ml', 'Beprogel Lotion 30ml', 'Beprogel Lotion 30ml', '14', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('15', '1', 'TP0014', 'Virest Cream', 'Virest Cream', 'Virest Cream', '15', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('16', '1', 'TP0015', 'H-cort Cream', 'H-cort Cream', 'H-cort Cream', '16', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('17', '1', 'TP0016', 'Ecocort Cream', 'Ecocort Cream', 'Ecocort Cream', '17', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('18', '1', 'TP0017', 'Disuf Cream', 'Disuf Cream', 'Disuf Cream', '18', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('19', '1', 'TP0018', 'Supirocine Ointment 5g', 'Supirocine Ointment 5g', 'Supirocine Ointment 5g', '19', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('20', '1', 'TP0019', 'Akne-Derm 5% Cream', 'Akne-Derm 5% Cream', 'Akne-Derm 5% Cream', '20', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('21', '1', 'TP0020', 'Diprosalic Pommade', 'Diprosalic Pommade', 'Diprosalic Pommade', '21', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('22', '1', 'TP0021', 'Neutriderm Moisturizing Lotion 125ml', 'Neutriderm Moisturizing Lotion 125ml', 'Neutriderm Moisturizing Lotion 125ml', '22', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('23', '1', 'TP0022', 'Dermavive Nappy Rash Cream', 'Dermavive Nappy Rash Cream', 'Dermavive Nappy Rash Cream', '23', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('24', '1', 'TP0023', 'Fixderma Moisturizing Lotion', 'Fixderma Moisturizing Lotion', 'Fixderma Moisturizing Lotion', '24', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('25', '1', 'EP0001', 'Serum physiodose 5ml', 'Serum physiodose 5ml', 'Serum physiodose 5ml', '25', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('26', '1', 'OM0001', 'Prednisolone', 'Prednisolone', 'Prednisolone', '26', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '4', null, null, null, '0.00', 'Tablet', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('27', '1', '100135', 'Acnotin', 'Acnotin', null, '27', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', 'Samsethy', null, null, null, '2', null, '4', null, '0.00', 'Bottle', '1', '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('28', '1', 'OM0003', 'Doxycycline cap 100mg', 'Doxycycline cap 100mg', 'Doxycycline cap 100mg', '28', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '4', null, null, null, '0.00', 'Tablet', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('29', '1', 'OM0004', 'Promethazine 25mg', 'Promethazine 25mg', 'Promethazine 25mg', '29', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '4', null, null, null, '0.00', 'Tablet', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('30', '1', 'EP0002', 'Syringe 3ml Vinahankook B/100P', 'Syringe 3ml Vinahankook B/100P', 'Syringe 3ml Vinahankook B/100P', '30', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('31', '1', 'EP0003', 'Syringe 1ml Vinahankook B/100P', 'Syringe 1ml Vinahankook B/100P', 'Syringe 1ml Vinahankook B/100P', '31', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('32', '1', 'EP0004', 'Syringe 5ml-25G Vinahankook B/100P', 'Syringe 5ml-25G Vinahankook B/100P', 'Syringe 5ml-25G Vinahankook B/100P', '32', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('33', '1', 'EP0005', 'Syringe 10ml Vinahankook B/100P', 'Syringe 10ml Vinahankook B/100P', 'Syringe 10ml Vinahankook B/100P', '33', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('34', '1', 'EP0006', 'Glove Sterile 7.0', 'Glove Sterile 7.0', 'Glove Sterile 7.0', '34', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '5', null, null, null, '0.00', 'Set', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('35', '1', 'IN0001', 'Nss 500ml China ', 'Nss 500ml China ', 'Nss 500ml China ', '35', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('36', '1', 'EP0007', 'Compress Sterile 20*20cm', 'Compress Sterile 20*20cm', 'Compress Sterile 20*20cm', '36', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '6', null, null, null, '0.00', 'Pack', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('37', '1', 'EP0008', 'Catheter 18G-Healflon IND(100/BOX)', 'Catheter 18G-Healflon IND(100/BOX)', 'Catheter 18G-Healflon IND(100/BOX)', '37', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '7', null, null, null, '0.00', 'Box', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('38', '1', 'EP0009', 'Catheter 24G-Healflon B/100unit', 'Catheter 24G-Healflon B/100unit', 'Catheter 24G-Healflon B/100unit', '38', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '7', null, null, null, '0.00', 'Box', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('39', '1', 'EP0010', 'Nipro Catherter24G*3/4 B/50 ', 'Nipro Catherter24G*3/4 B/50 ', 'Nipro Catherter24G*3/4 B/50 ', '39', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '7', null, null, null, '0.00', 'Box', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('40', '1', 'EP0011', 'Trouss china(R, orange color) P/25', 'Trouss china(R, orange color) P/25', 'Trouss china(R, orange color) P/25', '40', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '6', null, null, null, '0.00', 'Pack', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('41', '1', 'EP0012', 'Nipro Needle 18G B/100', 'Nipro Needle 18G B/100', 'Nipro Needle 18G B/100', '41', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '7', null, null, null, '0.00', 'Box', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('42', '1', 'EP0013', 'Nipro Needle 21G B/100', 'Nipro Needle 21G B/100', 'Nipro Needle 21G B/100', '42', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '7', null, null, null, '0.00', 'Box', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('43', '1', 'EP0014', 'Nipro Needle 30G B/100', 'Nipro Needle 30G B/100', 'Nipro Needle 30G B/100', '43', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '7', null, null, null, '0.00', 'Box', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('44', '1', 'EP0015', 'Scalp Vein set24 B/50', 'Scalp Vein set24 B/50', 'Scalp Vein set24 B/50', '44', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '7', null, null, null, '0.00', 'Box', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('45', '1', 'EP0016', 'Betadine dermique 125ml 10%Fr ', 'Betadine dermique 125ml 10%Fr ', 'Betadine dermique 125ml 10%Fr ', '45', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('46', '1', 'EP0017', 'Wellgard no powder size S ', 'Wellgard no powder size S ', 'Wellgard no powder size S ', '46', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '7', null, null, null, '0.00', 'Box', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('47', '1', 'EP0018', 'Wellgard no powder size M', 'Wellgard no powder size M', 'Wellgard no powder size M', '47', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '7', null, null, null, '0.00', 'Box', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('48', '1', 'EP0019', 'Safety box 5L', 'Safety box 5L', 'Safety box 5L', '48', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '7', null, null, null, '0.00', 'Box', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('49', '1', 'EP0020', 'Vaseline Petrolatum Gauze B/10', 'Vaseline Petrolatum Gauze B/10', 'Vaseline Petrolatum Gauze B/10', '49', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '7', null, null, null, '0.00', 'Box', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('50', '1', 'EP0021', 'Innoplastic B/100', 'Innoplastic B/100', 'Innoplastic B/100', '50', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '7', null, null, null, '0.00', 'Box', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('51', '1', 'EP0022', 'CRL-aperture adhesive plaster 18cm*4cm', 'CRL-aperture adhesive plaster 18cm*4cm', 'CRL-aperture adhesive plaster 18cm*4cm', '51', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '7', null, null, null, '0.00', 'Box', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('52', '1', '100137', 'Adhesive plaster with holes', 'Adhesive plaster with holes', 'Adhesive plaster with holes', '52', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', 'Samsethy', null, null, null, '7', null, null, null, '0.00', 'Box', '1', '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('53', '1', 'EP0024', 'Vaseline pet jelly orig 100ml/fl', 'Vaseline pet jelly orig 100ml/fl', 'Vaseline pet jelly orig 100ml/fl', '53', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('54', '1', 'EP0025', 'Needle dermapen VIP 42 ', 'Needle dermapen VIP 42 ', 'Needle dermapen VIP 42 ', '54', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '7', null, null, null, '0.00', 'Box', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('55', '1', 'IN0002', 'Prednisolone USA 1FL', 'Prednisolone USA 1FL', 'Prednisolone USA 1FL', '55', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('56', '1', 'TP0067', 'KTC Scalp solution', 'KTC Scalp solution', 'KTC Scalp solution', '56', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('57', '1', 'OM0005', 'Neocilor ', 'Neocilor ', 'Neocilor ', '57', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '4', null, null, null, '0.00', 'Tablet', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('58', '1', 'OM0006', 'Telfast Hd 180mg', 'Telfast Hd 180mg', 'Telfast Hd 180mg', '58', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '4', null, null, null, '0.00', 'Tablet', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('59', '1', 'OM0007', 'Atarax 25mg', 'Atarax 25mg', 'Atarax 25mg', '59', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '4', null, null, null, '0.00', 'Tablet', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('60', '1', 'OM0008', 'Cloxacap 500mg', 'Cloxacap 500mg', 'Cloxacap 500mg', '60', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '4', null, null, null, '0.00', 'Tablet', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('61', '1', 'OM0009', 'Terbinaforce 250mg', 'Terbinaforce 250mg', 'Terbinaforce 250mg', '61', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '4', null, null, null, '0.00', 'Tablet', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('62', '1', 'OM0010', 'Inox 100mg', 'Inox 100mg', 'Inox 100mg', '62', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '4', null, null, null, '0.00', 'Tablet', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('63', '1', 'OM0011', 'Zithrosun-250', 'Zithrosun-250', 'Zithrosun-250', '63', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '4', null, null, null, '0.00', 'Tablet', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('65', '1', 'OM0013', 'Codalgin Forte 500', 'Codalgin Forte 500', 'Codalgin Forte 500', '64', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '4', null, null, null, '0.00', 'Tablet', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('66', '1', 'OM0014', 'Alpha Choay 4.15mg', 'Alpha Choay 4.15mg', 'Alpha Choay 4.15mg', '65', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '4', null, null, null, '0.00', 'Tablet', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('67', '1', 'OM0015', 'Esome 40mg', 'Esome 40mg', 'Esome 40mg', '66', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '4', null, null, null, '0.00', 'Tablet', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('68', '1', 'TP0025', 'Deriva MS gel 15g', 'Deriva MS gel 15g', 'Deriva MS gel 15g', '67', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('69', '1', 'IN0003', 'Medi-Ceftriaxone inj', 'Medi-Ceftriaxone inj', 'Medi-Ceftriaxone inj', '68', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '8', null, null, null, '0.00', 'Vial', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('70', '1', 'IN0004', 'Clavox 1.2g IV', 'Clavox 1.2g IV', 'Clavox 1.2g IV', '69', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '9', null, null, null, '0.00', 'FL', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('71', '1', 'IN0005', 'Lidocaine 2% 50ml', 'Lidocaine 2% 50ml', 'Lidocaine 2% 50ml', '70', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '9', null, null, null, '0.00', 'FL', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('72', '1', 'IN0006', 'Tanganil 500mg/5ml IV', 'Tanganil 500mg/5ml IV', 'Tanganil 500mg/5ml IV', '71', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '10', null, null, null, '0.00', 'Amp', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('73', '1', 'IN0007', 'Met-Sil 2ml', 'Met-Sil 2ml', 'Met-Sil 2ml', '72', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '10', null, null, null, '0.00', 'Amp', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('74', '1', 'IN0008', 'Para Kabi 1000mg/100ml', 'Para Kabi 1000mg/100ml', 'Para Kabi 1000mg/100ml', '73', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('75', '1', 'IN0009', 'Anadol Inj 100mg/2ml', 'Anadol Inj 100mg/2ml', 'Anadol Inj 100mg/2ml', '74', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '10', null, null, null, '0.00', 'Amp', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('76', '1', 'IN0010', 'Remopain 3% Inj', 'Remopain 3% Inj', 'Remopain 3% Inj', '75', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '10', null, null, null, '0.00', 'Amp', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('77', '1', '100139', 'Adrenaline Inj 1ml', 'Adrenaline Inj 1ml', 'Adrenaline Inj 1ml', '76', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', 'Samsethy', null, null, null, '10', null, '1', null, '0.00', 'Amp', '1', '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('78', '1', 'IN0012', 'Dexamedico inj', 'Dexamedico inj', 'Dexamedico inj', '77', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '10', null, null, null, '0.00', 'Amp', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('79', '1', 'IN0013', 'Genta inj-uto', 'Genta inj-uto', 'Genta inj-uto', '78', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '10', null, null, null, '0.00', 'Amp', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('80', '1', 'IN0014', 'Hydromark-100', 'Hydromark-100', 'Hydromark-100', '79', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '8', null, null, null, '0.00', 'Vial', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('81', '1', 'IN0015', 'VIK 1-vitamin K1 inj 10mg/1ml', 'VIK 1-vitamin K1 inj 10mg/1ml', 'VIK 1-vitamin K1 inj 10mg/1ml', '80', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '10', null, null, null, '0.00', 'Amp', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('82', '1', 'IN0016', 'Onasia', 'Onasia', 'Onasia', '81', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '10', null, null, null, '0.00', 'Amp', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('83', '1', 'IN0017', 'Exacyl inj', 'Exacyl inj', 'Exacyl inj', '82', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '10', null, null, null, '0.00', 'Amp', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('84', '1', 'TP0026', 'Effaclar Duo(+) 40ml', 'Effaclar Duo(+) 40ml', 'Effaclar Duo(+) 40ml', '83', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('85', '1', '100141', 'Anthelios Antishine', 'Anthelios Anti-shine', 'Anthelios Antishine', '84', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', 'Samsethy', null, null, null, '3', null, null, null, '0.00', 'Tube', '1', '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('86', '1', 'TP0028', 'Anthelios Fluid invisible', 'Anthelios Fluid invisible', 'Anthelios Fluid invisible', '85', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('87', '1', 'TP0029', 'Cicaplast gel B5 40ml', 'Cicaplast gel B5 40ml', 'Cicaplast gel B5 40ml', '86', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('88', '1', 'TP0030', 'Cicaplast Baume B5 100ml', 'Cicaplast Baume B5 100ml', 'Cicaplast Baume B5 100ml', '87', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('89', '1', 'TP0031', 'Water Max Milk Cleanser 1200ml', 'Water Max Milk Cleanser 1200ml', 'Water Max Milk Cleanser 1200ml', '88', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '7', null, null, null, '0.00', 'Box', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('90', '1', 'TP0032', 'Counteractive Bubble Clear 150ml', 'Counteractive Bubble Clear 150ml', 'Counteractive Bubble Clear 150ml', '89', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('91', '1', 'TP0033', 'Alpha Cleansing Foam 1200ml', 'Alpha Cleansing Foam 1200ml', 'Alpha Cleansing Foam 1200ml', '90', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('92', '1', 'TP0034', 'Peppermint Cool plus modeling mask 1kg', 'Peppermint Cool plus modeling mask 1kg', 'Peppermint Cool plus modeling mask 1kg', '91', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '6', null, null, null, '0.00', 'Pack', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('93', '1', 'TP0035', 'Gold Plus Modeling mask 1kg', 'Gold Plus Modeling mask 1kg', 'Gold Plus Modeling mask 1kg', '92', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '6', null, null, null, '0.00', 'Pack', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('94', '1', 'TP0036', 'Marine Aqua Plus Modeling mask 1kg', 'Marine Aqua Plus Modeling mask 1kg', 'Marine Aqua Plus Modeling mask 1kg', '93', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '6', null, null, null, '0.00', 'Pack', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('95', '1', 'TP0037', 'Azulene Complex Ampoule 72 150ml', 'Azulene Complex Ampoule 72 150ml', 'Azulene Complex Ampoule 72 150ml', '94', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('96', '1', 'TP0038', 'EGF Complex Ampoule 50 150ml', 'EGF Complex Ampoule 50 150ml', 'EGF Complex Ampoule 50 150ml', '95', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('97', '1', 'TP0039', 'Hyaluron Complex Ampoule 62 150ml', 'Hyaluron Complex Ampoule 62 150ml', 'Hyaluron Complex Ampoule 62 150ml', '96', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('98', '1', 'TP0040', 'History Conductive Gel 500ml ', 'History Conductive Gel 500ml ', 'History Conductive Gel 500ml ', '97', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '7', null, null, null, '0.00', 'Box', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('99', '1', 'TP0041', 'Histo HQ Cream 1000ml', 'Histo HQ Cream 1000ml', 'Histo HQ Cream 1000ml', '98', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '7', null, null, null, '0.00', 'Box', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('100', '1', 'TP0042', 'Histo Aloe Vera gel 1200ml', 'Histo Aloe Vera gel 1200ml', 'Histo Aloe Vera gel 1200ml', '99', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('101', '1', 'TP0043', 'Gamma Crystal Serum 500ml', 'Gamma Crystal Serum 500ml', 'Gamma Crystal Serum 500ml', '100', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('102', '1', 'TP0044', 'Beta Fresh toner 1200ml', 'Beta Fresh toner 1200ml', 'Beta Fresh toner 1200ml', '101', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('103', '1', 'TP0045', 'Premium renewal Essence 500ml', 'Premium renewal Essence 500ml', 'Premium renewal Essence 500ml', '102', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('104', '1', 'TP0046', 'Premium Timeless Cream 250g', 'Premium Timeless Cream 250g', 'Premium Timeless Cream 250g', '103', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '7', null, null, null, '0.00', 'Box', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('105', '1', 'TP0047', 'Premium Eye Cream 250g', 'Premium Eye Cream 250g', 'Premium Eye Cream 250g', '104', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '7', null, null, null, '0.00', 'Box', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('106', '1', 'TP0048', 'Whiteness Lightening Serum 80ml', 'Whiteness Lightening Serum 80ml', 'Whiteness Lightening Serum 80ml', '105', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('107', '1', 'TP0049', 'Triangle Peel PA 80ml', 'Triangle Peel PA 80ml', 'Triangle Peel PA 80ml', '106', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('108', '1', 'TP0050', 'Triangle Peel PB 80ml', 'Triangle Peel PB 80ml', 'Triangle Peel PB 80ml', '107', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('109', '1', 'TP0051', 'Delta Active Cream 500ml', 'Delta Active Cream 500ml', 'Delta Active Cream 500ml', '108', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '7', null, null, null, '0.00', 'Box', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('110', '1', 'TP0052', 'Glycolic Skin Peel 70% 480ml', 'Glycolic Skin Peel 70% 480ml', 'Glycolic Skin Peel 70% 480ml', '109', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('111', '1', 'TP0053', 'Lactic acid Peel 70% 480ml', 'Lactic acid Peel 70% 480ml', 'Lactic acid Peel 70% 480ml', '110', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('112', '1', 'TP0054', 'Combination Peel 240ml', 'Combination Peel 240ml', 'Combination Peel 240ml', '111', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('113', '1', 'TP0055', 'Salicylic Peel 30% 120ml', 'Salicylic Peel 30% 120ml', 'Salicylic Peel 30% 120ml', '112', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('114', '1', 'TP0056', 'Ice Jeju Aloe 300ml(Thefaceshop)', 'Ice Jeju Aloe 300ml(Thefaceshop)', 'Ice Jeju Aloe 300ml(Thefaceshop)', '113', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '7', null, null, null, '0.00', 'Box', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('115', '1', 'TP0057', 'Aloe 99% 300ml(Thefaceshop)', 'Aloe 99% 300ml(Thefaceshop)', 'Aloe 99% 300ml(Thefaceshop)', '114', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '7', null, null, null, '0.00', 'Box', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('116', '1', 'TP0058', 'Smart Peeling Honey Scrub (thefaceshop)', 'Smart Peeling Honey Scrub (thefaceshop)', 'Smart Peeling Honey Scrub (thefaceshop)', '115', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('117', '1', 'TP0059', 'Smart Peeling white jewel', 'Smart Peeling white jewel', 'Smart Peeling white jewel', '116', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('118', '1', 'EP0026', 'Centrifuge Virtuose', 'Centrifuge Virtuose', 'Centrifuge Virtuose', '117', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '7', null, null, null, '0.00', 'Box', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('119', '1', 'EP0027', 'PRP tube 9ml Virtuose', 'PRP tube 9ml Virtuose', 'PRP tube 9ml Virtuose', '118', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('120', '1', 'EP0028', 'Dermapen A6', 'Dermapen A6', 'Dermapen A6', '119', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '7', null, null, null, '0.00', 'Box', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('121', '1', 'EP0029', 'Needle Dermapen A6 nano', 'Needle Dermapen A6 nano', 'Needle Dermapen A6 nano', '120', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '6', null, null, null, '0.00', 'Pack', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('122', '1', 'EP0030', 'Needle Dermapen A6 42', 'Needle Dermapen A6 42', 'Needle Dermapen A6 42', '121', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '6', null, null, null, '0.00', 'Pack', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('123', '1', 'EP0031', 'Skin marker', 'Skin marker', 'Skin marker', '122', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '6', null, null, null, '0.00', 'Pack', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('124', '1', '100148', 'Cotton Facial pad', 'Cotton Facial pad', 'Cotton Facial pad', '123', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', 'Samsethy', null, null, null, '6', null, null, null, '0.00', 'Pack', '1', '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('125', '1', '100016', 'Acne extraction', 'Acne extraction', 'Acne extraction', '124', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', 'Samsethy', null, null, null, '2', '0', '0', null, '0.00', 'Bottle', '1', '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('126', '1', 'EP0034', 'Cautery ', 'Cautery ', 'Cautery ', '125', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '6', null, null, null, '0.00', 'Pack', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('127', '1', '100129', 'Peel', '???? Peel', 'Peel', '126', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', 'Samsethy', null, null, null, '6', null, null, null, '0.00', 'Pack', '1', '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('128', '1', 'IN0018', 'Meso GTM Gold cell PDRN8% (Box/10 3,3ml)', 'Meso GTM Gold cell PDRN8% (Box/10 3,3ml)', 'Meso GTM Gold cell PDRN8% (Box/10 3,3ml)', '127', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('129', '1', 'IN0019', 'Meso Restructurer Innoaesthetic (B/4 5ml)', 'Meso Restructurer Innoaesthetic (B/4 5ml)', 'Meso Restructurer Innoaesthetic (B/4 5ml)', '128', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('130', '1', 'IN0020', 'Meso Redness ID innoaethetic (B/4 2.5ml)', 'Meso Redness ID innoaethetic (B/4 2.5ml)', 'Meso Redness ID innoaethetic (B/4 2.5ml)', '129', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('131', '1', 'IN0021', 'Meso Melatocin Essence Melasma (B/10 5ml)', 'Meso Melatocin Essence Melasma (B/10 5ml)', 'Meso Melatocin Essence Melasma (B/10 5ml)', '130', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('132', '1', 'IN0022', 'Meso GTM mela cell 3% melasma (B/10 3,5ml)', 'Meso GTM mela cell 3% melasma (B/10 3,5ml)', 'Meso GTM mela cell 3% melasma (B/10 3,5ml)', '131', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('133', '1', 'IN0023', 'Placenta Melsmon 2ml ', 'Placenta Melsmon 2ml ', 'Placenta Melsmon 2ml ', '132', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '10', null, null, null, '0.00', 'Amp', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('134', '1', 'IN0024', 'Placenta Lannec 2ml', 'Placenta Lannec 2ml', 'Placenta Lannec 2ml', '133', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '10', null, null, null, '0.00', 'Amp', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('135', '1', 'IN0025', 'Botulax 100UI ', 'Botulax 100UI ', 'Botulax 100UI ', '134', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('136', '1', 'IN0027', 'AMC Slimming Drip', 'AMC Slimming Drip', 'AMC Slimming Drip', '135', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '5', null, null, null, '0.00', 'Set', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('137', '1', 'IN0026', 'Japan Whitening Drip', 'Japan Whitening Drip', 'Japan Whitening Drip', '136', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '5', null, null, null, '0.00', 'Set', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('138', '1', 'EP0036', 'Meso Multi Needle', 'Meso Multi Needle', 'Meso Multi Needle', '137', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '6', null, null, null, '0.00', 'Pack', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('139', '1', 'IN0028', 'Sivkoit (Triamcinolone) 80mg', 'Sivkoit (Triamcinolone) 80mg', 'Sivkoit (Triamcinolone) 80mg', '138', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '10', null, null, null, '0.00', 'Amp', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('140', '1', 'IN0029', 'Para Inj 300mg ', 'Para Inj 300mg ', 'Para Inj 300mg ', '139', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '10', null, null, null, '0.00', 'Amp', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('141', '1', 'IN0030', 'NSS 100ml Thai', 'NSS 100ml Thai', 'NSS 100ml Thai', '140', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '9', null, null, null, '0.00', 'FL', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('142', '1', 'IN0031', 'NSS 500ml Thai', 'NSS 500ml Thai', 'NSS 500ml Thai', '141', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '9', null, null, null, '0.00', 'FL', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('143', '1', 'EP0037', 'Surgical cap', 'Surgical cap', 'Surgical cap', '142', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '6', null, null, null, '0.00', 'Pack', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('144', '1', 'TP0060', 'Skinoren Cream 30g', 'Skinoren Cream 30g', 'Skinoren Cream 30g', '143', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('145', '1', 'TP0061', 'Skarfix-TX cream', 'Skarfix-TX cream', 'Skarfix-TX cream', '144', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('146', '1', 'TP0062', 'Isis Teen Derm gel sensitive 100ml', 'Isis Teen Derm gel sensitive 100ml', 'Isis Teen Derm gel sensitive 100ml', '145', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('147', '1', 'TP0063', 'Isis Neotone Gel 150ml', 'Isis Neotone Gel 150ml', 'Isis Neotone Gel 150ml', '146', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('148', '1', 'TP0064', 'Isis Ruboril Expert S', 'Isis Ruboril Expert S', 'Isis Ruboril Expert S', '147', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('149', '1', 'TP0065', 'Isis Aqua Ruboril 250ml', 'Isis Aqua Ruboril 250ml', 'Isis Aqua Ruboril 250ml', '148', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('150', '1', 'IN0032', 'NSS 250ml korea', 'NSS 250ml korea', 'NSS 250ml korea', '149', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '9', null, null, null, '0.00', 'FL', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('151', '1', 'IN0033', 'Neuramis gold', 'Neuramis gold', 'Neuramis gold', '150', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '7', null, null, null, '0.00', 'Box', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('152', '1', 'EP0038', 'Needle 30G 4mm', 'Needle 30G 4mm', 'Needle 30G 4mm', '151', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '11', null, null, null, '0.00', 'pcs', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('153', '1', 'IN0034', 'D5W Thai 500ml', 'D5W Thai 500ml', 'D5W Thai 500ml', '152', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '9', null, null, null, '0.00', 'FL', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('154', '1', 'IN0035', 'Lactate Thai 500ml', 'Lactate Thai 500ml', 'Lactate Thai 500ml', '153', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '9', null, null, null, '0.00', 'FL', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('155', '1', 'IN0036', 'D10W Thai ', 'D10W Thai ', 'D10W Thai ', '154', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '9', null, null, null, '0.00', 'FL', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('156', '1', 'EP0039', 'Glove Sterile 6.5', 'Glove Sterile 6.5', 'Glove Sterile 6.5', '155', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '6', null, null, null, '0.00', 'Pack', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('157', '1', 'EP0040', 'Nipro Needle 30G 13mm', 'Nipro Needle 30G 13mm', 'Nipro Needle 30G 13mm', '156', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '7', null, null, null, '0.00', 'Box', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('158', '1', 'TP0068', 'Saforelle soin', 'Saforelle soin', 'Saforelle soin', '157', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('159', '1', 'SP0001', 'ISIS Aqua Ruboril 400ml', 'ISIS Aqua Ruboril 400ml', 'ISIS Aqua Ruboril 400ml', '158', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('160', '1', 'SP0002', 'ISIS Ketoplast Cracks 40ml', 'ISIS Ketoplast Cracks 40ml', 'ISIS Ketoplast Cracks 40ml', '159', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('161', '1', 'SP0003', 'ISIS Ketoplast Scars SPF50+ 40ml', 'ISIS Ketoplast Scars SPF50+ 40ml', 'ISIS Ketoplast Scars SPF50+ 40ml', '160', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('162', '1', 'SP0004', 'ISIS Neotone Aqua 250ml', 'ISIS Neotone Aqua 250ml', 'ISIS Neotone Aqua 250ml', '161', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('163', '1', 'SP0005', 'ISIS Neotone Body 100ml', 'ISIS Neotone Body 100ml', 'ISIS Neotone Body 100ml', '162', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('164', '1', 'SP0006', 'ISIS Neotone Eyes 15ml', 'ISIS Neotone Eyes 15ml', 'ISIS Neotone Eyes 15ml', '163', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('165', '1', 'SP0007', 'ISIS Neotone Prevent SPF50+ Mineral Tinted', 'ISIS Neotone Prevent SPF50+ Mineral Tinted', 'ISIS Neotone Prevent SPF50+ Mineral Tinted', '164', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('166', '1', 'SP0008', 'ISIS Neotone Radiance SPF50+ 30ml', 'ISIS Neotone Radiance SPF50+ 30ml', 'ISIS Neotone Radiance SPF50+ 30ml', '165', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('167', '1', 'SP0009', 'ISIS Neotone Sensitive 30ml', 'ISIS Neotone Sensitive 30ml', 'ISIS Neotone Sensitive 30ml', '166', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('168', '1', 'SP0011', 'ISIS Ruboril Expert M 40ml', 'ISIS Ruboril Expert M 40ml', 'ISIS Ruboril Expert M 40ml', '167', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('169', '1', 'SP0012', 'ISIS Ruboril Expert SPF 50+ 40ml', 'ISIS Ruboril Expert SPF 50+ 40ml', 'ISIS Ruboril Expert SPF 50+ 40ml', '168', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('170', '1', 'SP0013', 'ISIS Ruboril Expert Intense 15ml', 'ISIS Ruboril Expert Intense 15ml', 'ISIS Ruboril Expert Intense 15ml', '169', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('171', '1', 'SP0014', 'ISIS Ruboril Expert Lotion 250ml', 'ISIS Ruboril Expert Lotion 250ml', 'ISIS Ruboril Expert Lotion 250ml', '170', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('172', '1', 'SP0015', 'ISIS Secalia AHA 200ml', 'ISIS Secalia AHA 200ml', 'ISIS Secalia AHA 200ml', '171', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('173', '1', 'SP0016', 'ISIS Secalia Balm 200ml', 'ISIS Secalia Balm 200ml', 'ISIS Secalia Balm 200ml', '172', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('174', '1', 'SP0017', 'ISIS Secalia Ultra 200ml', 'ISIS Secalia Ultra 200ml', 'ISIS Secalia Ultra 200ml', '173', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('175', '1', 'SP0018', 'ISIS Sensylia 24h 40ml', 'ISIS Sensylia 24h 40ml', 'ISIS Sensylia 24h 40ml', '174', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('176', '1', 'SP0019', 'ISIS Sensylia 24h Legere 40ml', 'ISIS Sensylia 24h Legere 40ml', 'ISIS Sensylia 24h Legere 40ml', '175', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('177', '1', 'SP0020', 'ISIS Sensylia Aqua 100ml', 'ISIS Sensylia Aqua 100ml', 'ISIS Sensylia Aqua 100ml', '176', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('178', '1', 'SP0021', 'ISIS Sensylia Gelee 250ml', 'ISIS Sensylia Gelee 250ml', 'ISIS Sensylia Gelee 250ml', '177', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('179', '1', 'SP0022', 'ISIS Suavigel 40ml', 'ISIS Suavigel 40ml', 'ISIS Suavigel 40ml', '178', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('180', '1', 'SP0023', 'ISIS Teen Derm Aqua 100ml', 'ISIS Teen Derm Aqua 100ml', 'ISIS Teen Derm Aqua 100ml', '179', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('181', '1', 'SP0024', 'ISIS Teen Derm Aqua 250ml', 'ISIS Teen Derm Aqua 250ml', 'ISIS Teen Derm Aqua 250ml', '180', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('182', '1', 'SP0025', 'ISIS Teen Derm Alpha Pure 30ml', 'ISIS Teen Derm Alpha Pure 30ml', 'ISIS Teen Derm Alpha Pure 30ml', '181', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('183', '1', 'SP0026', 'ISIS Teen Derm Gel 40ml', 'ISIS Teen Derm Gel 40ml', 'ISIS Teen Derm Gel 40ml', '182', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('184', '1', 'SP0027', 'ISIS Teen Derm Gel 150ml', 'ISIS Teen Derm Gel 150ml', 'ISIS Teen Derm Gel 150ml', '183', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('185', '1', 'SP0028', 'ISIS Teen Derm Gel Sensitive 250ml', 'ISIS Teen Derm Gel Sensitive 250ml', 'ISIS Teen Derm Gel Sensitive 250ml', '184', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('186', '1', 'SP0029', 'ISIS Teen Derm Hydra 40ml', 'ISIS Teen Derm Hydra 40ml', 'ISIS Teen Derm Hydra 40ml', '185', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('187', '1', 'SP0030', 'ISIS Teen Derm K 30ml', 'ISIS Teen Derm K 30ml', 'ISIS Teen Derm K 30ml', '186', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('188', '1', 'SP0031', 'ISIS Teen Derm K Concentrate 30ml', 'ISIS Teen Derm K Concentrate 30ml', 'ISIS Teen Derm K Concentrate 30ml', '187', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('189', '1', 'SP0032', 'ISIS Urelia 10 150ml', 'ISIS Urelia 10 150ml', 'ISIS Urelia 10 150ml', '188', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('190', '1', 'SP0033', 'ISIS Urelia 50 40ml', 'ISIS Urelia 50 40ml', 'ISIS Urelia 50 40ml', '189', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('191', '1', 'SP0034', 'ISIS Urelia Gel 200ml', 'ISIS Urelia Gel 200ml', 'ISIS Urelia Gel 200ml', '190', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('192', '1', 'SP0035', 'ISIS SPF50+ Day Secure Invisible', 'ISIS SPF50+ Day Secure Invisible', 'ISIS SPF50+ Day Secure Invisible', '191', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('193', '1', 'SP0036', 'ISIS SPF50+ Invisible Fluid 40ml', 'ISIS SPF50+ Invisible Fluid 40ml', 'ISIS SPF50+ Invisible Fluid 40ml', '192', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('194', '1', 'SP0037', 'ISIS SPF50+ Light Tinted Fluid 40ml', 'ISIS SPF50+ Light Tinted Fluid 40ml', 'ISIS SPF50+ Light Tinted Fluid 40ml', '193', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('195', '1', 'SP0038', 'ISIS SPF50+ Tinted Mineral Cream', 'ISIS SPF50+ Tinted Mineral Cream', 'ISIS SPF50+ Tinted Mineral Cream', '194', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('196', '1', 'SP0039', 'ISIS SPF50+ Mineral Cream 40ml', 'ISIS SPF50+ Mineral Cream 40ml', 'ISIS SPF50+ Mineral Cream 40ml', '195', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('197', '1', 'SP0040', 'ISIS SPF30+ Dry Touch 40ml', 'ISIS SPF30+ Dry Touch 40ml', 'ISIS SPF30+ Dry Touch 40ml', '196', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('198', '1', 'SP0041', 'ISIS SPF80 Invisible cream 40ml', 'ISIS SPF80 Invisible cream 40ml', 'ISIS SPF80 Invisible cream 40ml', '197', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('199', '1', 'SP0042', 'ISIS Vitiskin 50ml', 'ISIS Vitiskin 50ml', 'ISIS Vitiskin 50ml', '198', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('200', '1', 'SP0043', 'Noreva Norelift Day Cream', 'Noreva Norelift Day Cream', 'Noreva Norelift Day Cream', '199', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('201', '1', 'SP0044', 'Noreva Actipur BB light 30ml', 'Noreva Actipur BB light 30ml', 'Noreva Actipur BB light 30ml', '200', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('202', '1', 'SP0045', 'Noreva Actipur BB Golden 30ml', 'Noreva Actipur BB Golden 30ml', 'Noreva Actipur BB Golden 30ml', '201', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('203', '1', 'SP0046', 'Noreva Actipur Cleansing Gel 150ml', 'Noreva Actipur Cleansing Gel 150ml', 'Noreva Actipur Cleansing Gel 150ml', '202', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('204', '1', 'SP0047', 'Noreva Exfoliac Global 6 30ml', 'Noreva Exfoliac Global 6 30ml', 'Noreva Exfoliac Global 6 30ml', '203', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('205', '1', 'SP0048', 'Noreva Exfoliac Foaming Gel 200ml', 'Noreva Exfoliac Foaming Gel 200ml', 'Noreva Exfoliac Foaming Gel 200ml', '204', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('206', '1', 'SP0049', 'Noreva Trio Dark Spot Serum 30ml', 'Noreva Trio Dark Spot Serum 30ml', 'Noreva Trio Dark Spot Serum 30ml', '205', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('207', '1', 'SP0050', 'Noreva Trio Dark Spot Care SPF 50+ ', 'Noreva Trio Dark Spot Care SPF 50+ ', 'Noreva Trio Dark Spot Care SPF 50+ ', '206', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('208', '1', 'SP0051', 'Noreva Trio Dark Spot Care 30ml', 'Noreva Trio Dark Spot Care 30ml', 'Noreva Trio Dark Spot Care 30ml', '207', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('209', '1', 'SP0052', 'Noreva Xerodiane AP+ Cream 400ml', 'Noreva Xerodiane AP+ Cream 400ml', 'Noreva Xerodiane AP+ Cream 400ml', '208', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('210', '1', 'SP0053', 'Noreva Xerodiane AP+ Cleaning Shower', 'Noreva Xerodiane AP+ Cleaning Shower', 'Noreva Xerodiane AP+ Cleaning Shower', '209', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('211', '1', 'SP0054', 'Noreva Sensidiane AR Anti-Redness cream 30ml', 'Noreva Sensidiane AR Anti-Redness cream 30ml', 'Noreva Sensidiane AR Anti-Redness cream 30ml', '210', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('212', '1', 'SP0055', 'Embryolisse Lait-Creme Concentre 30ml', 'Embryolisse Lait-Creme Concentre 30ml', 'Embryolisse Lait-Creme Concentre 30ml', '211', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('213', '1', 'SP0056', 'Embryolisse Lait-Creme Fluide 75ml', 'Embryolisse Lait-Creme Fluide 75ml', 'Embryolisse Lait-Creme Fluide 75ml', '212', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('214', '1', 'SP0057', 'Embryolisse Eua De Beaute 200ml', 'Embryolisse Eua De Beaute 200ml', 'Embryolisse Eua De Beaute 200ml', '213', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('215', '1', 'SP0058', 'Embryolisse Lotion Micellaire 250ml', 'Embryolisse Lotion Micellaire 250ml', 'Embryolisse Lotion Micellaire 250ml', '214', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('216', '1', 'SP0059', 'Embryolisse lashes & brows Booster 6.5ml', 'Embryolisse lashes & brows Booster 6.5ml', 'Embryolisse lashes & brows Booster 6.5ml', '215', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('217', '1', 'SP0060', 'Embryolisse Intense Smooth 50ml', 'Embryolisse Intense Smooth 50ml', 'Embryolisse Intense Smooth 50ml', '216', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('218', '1', 'SP0061', 'Embryolisse Complexion BB Cream', 'Embryolisse Complexion BB Cream', 'Embryolisse Complexion BB Cream', '217', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('219', '1', 'SP0062', 'Embryolisse Complexion CC Cream 30ml', 'Embryolisse Complexion CC Cream 30ml', 'Embryolisse Complexion CC Cream 30ml', '218', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('220', '1', 'SP0063', 'Embryolisse Consealer (Beige) 8ml', 'Embryolisse Consealer (Beige) 8ml', 'Embryolisse Consealer (Beige) 8ml', '219', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('221', '1', 'SP0064', 'Embryolisse Consealer (PInk) 8ml', 'Embryolisse Consealer (PInk) 8ml', 'Embryolisse Consealer (PInk) 8ml', '220', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('222', '1', 'SP0065', 'Embryolisse Smooth Rodiant 40ml', 'Embryolisse Smooth Rodiant 40ml', 'Embryolisse Smooth Rodiant 40ml', '221', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('223', '1', 'SP0066', 'Embryolisse Radiant Powder 12g', 'Embryolisse Radiant Powder 12g', 'Embryolisse Radiant Powder 12g', '222', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('224', '1', 'SP0067', 'Embryolisse Radiant Eye 4.5g', 'Embryolisse Radiant Eye 4.5g', 'Embryolisse Radiant Eye 4.5g', '223', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('225', '1', 'SP0010', 'ISIS Neotone Serum 30ml', 'ISIS Neotone Serum 30ml', 'ISIS Neotone Serum 30ml', '224', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('226', '1', 'IN0037', 'Bupivacaine ', 'Bupivacaine ', 'Bupivacaine ', '225', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '10', null, null, null, '0.00', 'Amp', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('227', '1', 'IN0038', 'Glucose Thai inj 50%', 'Glucose Thai inj 50%', 'Glucose Thai inj 50%', '226', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '10', null, null, null, '0.00', 'Amp', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('228', '1', 'EP0041', 'Cannula 25G*50MM', 'Cannula 25G*50MM', 'Cannula 25G*50MM', '227', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '11', null, null, null, '0.00', 'pcs', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('229', '1', 'EP0042', 'Cannula 18G*50MM', 'Cannula 18G*50MM', 'Cannula 18G*50MM', '228', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '11', null, null, null, '0.00', 'pcs', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('230', '1', 'EP0043', 'Skin marker white ', 'Skin marker white ', 'Skin marker white ', '229', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '11', null, null, null, '0.00', 'pcs', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('231', '1', 'IN0039', 'Botox USA', 'Botox USA', 'Botox USA', '230', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('232', '1', 'TP0069', 'Whiteness lightening serum', 'Whiteness lightening serum', 'Whiteness lightening serum', '231', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('233', '1', 'OM0017', 'Firide 1mg', 'Firide 1mg', 'Firide 1mg', '232', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '4', null, null, null, '0.00', 'Tablet', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('234', '1', '100143', 'Minoxin 5', 'Minoxin 5%', 'Minoxin 5', '233', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', 'Samsethy', null, null, null, '2', null, null, null, '0.00', 'Bottle', '1', '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('235', '1', '100132', 'Acnetin 005', 'Acnetin 0.05', 'Acnetin 005', '234', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', 'Samsethy', null, null, null, '3', null, '1', null, '0.00', 'Tube', '1', '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('236', '1', 'IN0040', 'F-ACN (FUSION)', 'F-ACN (FUSION)', 'F-ACN (FUSION)', '235', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('237', '1', 'IN0041', 'F-RADIAN (FUSION)', 'F-RADIAN (FUSION)', 'F-RADIAN (FUSION)', '236', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('238', '1', '42', 'F-EYECONTOUR (FUSION)', 'F-EYECONTOUR (FUSION)', 'F-EYECONTOUR (FUSION)', '237', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('239', '1', 'IN0043', 'F-HAIR MEN (FUSION)', 'F-HAIR MEN (FUSION)', 'F-HAIR MEN (FUSION)', '238', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('240', '1', 'TP0072', 'Minoxin 2%', 'Minoxin 2%', 'Minoxin 2%', '239', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('241', '1', 'TP0073', 'Orrepast', 'Orrepast', 'Orrepast', '240', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('242', '1', 'OM0018', 'Mediclovir 400mg', 'Mediclovir 400mg', 'Mediclovir 400mg', '241', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '4', null, null, null, '0.00', 'Tablet', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('243', '1', 'OM0019', 'Gofen 400mg', 'Gofen 400mg', 'Gofen 400mg', '242', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '4', null, null, null, '0.00', 'Tablet', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('244', '1', 'TP0074', 'Y Mycin N', 'Y Mycin N', 'Y Mycin N', '243', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('245', '1', 'TP0075', 'Y Mycin A ', 'Y Mycin A ', 'Y Mycin A ', '244', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('246', '1', 'EP0044', 'Nitrile No powder Size S', 'Nitrile No powder Size S', 'Nitrile No powder Size S', '245', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '7', null, null, null, '0.00', 'Box', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('247', '1', 'EP0045', 'Nitrile No powder Size M', 'Nitrile No powder Size M', 'Nitrile No powder Size M', '246', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '7', null, null, null, '0.00', 'Box', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('248', '1', 'OM0020', 'Lergicet 10mg', 'Lergicet 10mg', 'Lergicet 10mg', '247', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '4', null, null, null, '0.00', 'Tablet', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('249', '1', 'OM0021', 'Falete 250mg', 'Falete 250mg', 'Falete 250mg', '248', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '4', null, null, null, '0.00', 'Tablet', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('250', '1', 'IN0044', 'Medixon 125mg ', 'Medixon 125mg ', 'Medixon 125mg ', '249', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '9', null, null, null, '0.00', 'FL', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('251', '1', 'TP0076', 'Cicaplast Baume B5 40ml', 'Cicaplast Baume B5 40ml', 'Cicaplast Baume B5 40ml', '250', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('252', '1', 'TP0077', 'Bioderma Sensibio Gel moussant 200ml', 'Bioderma Sensibio Gel moussant 200ml', 'Bioderma Sensibio Gel moussant 200ml', '251', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('253', '1', 'TP0078', 'Bioderma Sensibio Gel moussant 45ml', 'Bioderma Sensibio Gel moussant 45ml', 'Bioderma Sensibio Gel moussant 45ml', '252', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('254', '1', '100138', 'AkneDerm 25 Cream', 'Akne-Derm 2.5 Cream', 'AkneDerm 25 Cream', '253', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', 'Samsethy', null, null, null, '3', null, '4', null, '0.00', 'Tube', '1', '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('255', '1', 'EP0046', 'Syringe Leur Lock 3ml', 'Syringe Leur Lock 3ml', 'Syringe Leur Lock 3ml', '254', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '7', null, null, null, '0.00', 'Box', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('256', '1', 'EP0047', 'Syringe Leur Lock 5ml', 'Syringe Leur Lock 5ml', 'Syringe Leur Lock 5ml', '255', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '7', null, null, null, '0.00', 'Box', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('257', '1', 'EP0048', 'Syringe Leur Lock 10ml', 'Syringe Leur Lock 10ml', 'Syringe Leur Lock 10ml', '256', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '7', null, null, null, '0.00', 'Box', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('258', '1', 'EP0049', 'Syringe Leur Lock 50ml', 'Syringe Leur Lock 50ml', 'Syringe Leur Lock 50ml', '257', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '7', null, null, null, '0.00', 'Box', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('259', '1', 'OM0022', 'Biotin Nature Own', 'Biotin Nature Own', 'Biotin Nature Own', '258', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('260', '1', 'TP0080', 'Hydrogel Brightening Mask', 'Hydrogel Brightening Mask', 'Hydrogel Brightening Mask', '259', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '11', null, null, null, '0.00', 'pcs', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('261', '1', 'TP0081', 'Hydrogel Gold Mask', 'Hydrogel Gold Mask', 'Hydrogel Gold Mask', '260', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '11', null, null, null, '0.00', 'pcs', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('262', '1', 'TP0082', 'Hydrogel Snail Mask', 'Hydrogel Snail Mask', 'Hydrogel Snail Mask', '261', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '11', null, null, null, '0.00', 'pcs', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('263', '1', '2', 'Grand Compress (Bloc)', 'Grand Compress (Bloc)', 'Grand Compress (Bloc)', '262', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '11', null, null, null, '0.00', 'pcs', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('264', '1', '4', 'Esome 40mg(Injection)', 'Esome 40mg(Injection)', 'Esome 40mg(Injection)', '263', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '10', null, null, null, '0.00', 'Amp', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('265', '1', 'TP0083', 'LRP Spray SPF50+', 'LRP Spray SPF50+', 'LRP Spray SPF50+', '264', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('266', '1', 'TP0084', 'M-Cain Cream', 'M-Cain Cream', 'M-Cain Cream', '265', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '7', null, null, null, '0.00', 'Box', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('267', '1', 'IN0046', 'Neuramis Gray', 'Neuramis Gray', 'Neuramis Gray', '266', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '7', null, null, null, '0.00', 'Box', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('268', '1', 'IN0047', 'Liporase', 'Liporase', 'Liporase', '267', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('269', '1', 'EP0051', 'PRP Tube USA', 'PRP Tube USA', 'PRP Tube USA', '268', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('270', '1', 'IN0048', 'Genta Injection', 'Genta Injection', 'Genta Injection', '269', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '10', null, null, null, '0.00', 'Amp', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('271', '1', 'IN0049', 'Cimetidine Injection', 'Cimetidine Injection', 'Cimetidine Injection', '270', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '10', null, null, null, '0.00', 'Amp', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('272', '1', 'OM0023', 'Pengesic 50mg (Tramadol)', 'Pengesic 50mg (Tramadol)', 'Pengesic 50mg (Tramadol)', '271', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '4', null, null, null, '0.00', 'Tablet', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('273', '1', 'IN0050', 'F-MELACLEAR', 'F-MELACLEAR', 'F-MELACLEAR', '272', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, null, null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('274', '1', 'TP0085', 'Vitara TXPPE', 'Vitara TXPPE', 'Vitara TXPPE', '273', null, null, '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '3', null, null, null, '0.00', 'Tube', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('612', '1', '100140', 'Doliprane 500mg', null, 'Doliprane 500mg', '512', '1', 'Samsethy', '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '11', null, '1', null, '0.00', 'pcs', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('613', '1', '100142', 'Paracetamol 1000mg', null, 'Paracetamol 1000mg', '513', '1', 'Samsethy', '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '2', null, '1', null, '0.00', 'Bottle', null, '100.00', '0.00', 'MI', '5.00');
INSERT INTO `inv_items` VALUES ('614', '1', '100144', 'OPR One', null, 'OPR One', '516', '1', 'Samsethy', '2023-04-05 20:00:51.364448', '2023-04-05 20:00:51.364448', null, null, null, null, '21', null, '1', null, '0.00', 'kg', null, '100.00', '0.00', 'MI', '5.00');

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
-- Table structure for `inv_item_code_control`
-- ----------------------------
DROP TABLE IF EXISTS `inv_item_code_control`;
CREATE TABLE `inv_item_code_control` (
  `branch_id` int(10) NOT NULL,
  `last_id` int(10) NOT NULL,
  `classify_by` varchar(20) DEFAULT NULL,
  `prefix` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_item_code_control
-- ----------------------------
INSERT INTO `inv_item_code_control` VALUES ('1', '148', null, null);

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
  `description` varchar(250) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `category_id` int(10) NOT NULL DEFAULT 0,
  `code` varchar(20) DEFAULT NULL,
  `brand_name` varchar(100) DEFAULT NULL,
  `manufacturer_id` int(10) DEFAULT NULL,
  `upc` varchar(10) DEFAULT NULL,
  `sku` varchar(20) DEFAULT NULL,
  `unit_id` int(10) DEFAULT NULL,
  `detail_type_id` int(10) NOT NULL DEFAULT 0,
  `brand_id` int(10) DEFAULT NULL,
  `cost` decimal(10,2) NOT NULL DEFAULT 0.00,
  `selling_price` decimal(20,2) NOT NULL DEFAULT 0.00,
  `ws_selling_price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=519 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_item_groups
-- ----------------------------
INSERT INTO `inv_item_groups` VALUES ('1', '1', 'Bioselenium Shampoo 100ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0066', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('2', '1', 'Fixderma Moisturizing Cream', 'Admin', '1', '2023-02-06 00:12:48.225574', null, '2023-02-06 00:12:48.000000', 'Samsethy', '1', '2', 'GTP0002', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('3', '1', 'Tidact gel', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0003', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('4', '1', 'Tacroz', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0001', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('5', '1', 'Disut-H Cream 15g', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0004', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('6', '1', 'Tacopic 0.1%', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0005', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('7', '1', 'Disuf-B cream 15g', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0006', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('8', '1', 'Candid-B Cream', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0007', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('9', '1', 'Candid Cream', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0008', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('10', '1', 'Elosone Cream', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0009', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('11', '1', 'Cloderm Cream 15g', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0010', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('12', '1', 'Beprosalic Ointment ', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0011', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('13', '1', 'Rozex gel 50g', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0012', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('14', '1', 'Beprogel Lotion 30ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0013', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('15', '1', 'Virest Cream', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0014', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('16', '1', 'H-cort Cream', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0015', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('17', '1', 'Ecocort Cream', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0016', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('18', '1', 'Disuf Cream', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0017', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('19', '1', 'Supirocine Ointment 5g', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0018', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('20', '1', 'Akne-Derm 5% Cream', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0019', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('21', '1', 'Diprosalic Pommade', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0020', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('22', '1', 'Neutriderm Moisturizing Lotion 125ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0021', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('23', '1', 'Dermavive Nappy Rash Cream', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0022', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('24', '1', 'Fixderma Moisturizing Lotion', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0023', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('25', '1', 'Serum physiodose 5ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0001', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('26', '1', 'Prednisolone', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GOM0001', null, null, null, 'Tablet', '4', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('27', '1', 'Acnotin', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'G100128', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('28', '1', 'Doxycycline cap 100mg', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GOM0003', null, null, null, 'Tablet', '4', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('29', '1', 'Promethazine 25mg', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GOM0004', null, null, null, 'Tablet', '4', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('30', '1', 'Syringe 3ml Vinahankook B/100P', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0002', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('31', '1', 'Syringe 1ml Vinahankook B/100P', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0003', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('32', '1', 'Syringe 5ml-25G Vinahankook B/100P', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0004', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('33', '1', 'Syringe 10ml Vinahankook B/100P', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0005', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('34', '1', 'Glove Sterile 7.0', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0006', null, null, null, 'Set', '5', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('35', '1', 'Nss 500ml China ', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0001', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('36', '1', 'Compress Sterile 20*20cm', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0007', null, null, null, 'Pack', '6', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('37', '1', 'Catheter 18G-Healflon IND(100/BOX)', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0008', null, null, null, 'Box', '7', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('38', '1', 'Catheter 24G-Healflon B/100unit', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0009', null, null, null, 'Box', '7', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('39', '1', 'Nipro Catherter24G*3/4 B/50 ', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0010', null, null, null, 'Box', '7', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('40', '1', 'Trouss china(R, orange color) P/25', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0011', null, null, null, 'Pack', '6', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('41', '1', 'Nipro Needle 18G B/100', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0012', null, null, null, 'Box', '7', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('42', '1', 'Nipro Needle 21G B/100', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0013', null, null, null, 'Box', '7', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('43', '1', 'Nipro Needle 30G B/100', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0014', null, null, null, 'Box', '7', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('44', '1', 'Scalp Vein set24 B/50', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0015', null, null, null, 'Box', '7', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('45', '1', 'Betadine dermique 125ml 10%Fr ', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0016', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('46', '1', 'Wellgard no powder size S ', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0017', null, null, null, 'Box', '7', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('47', '1', 'Wellgard no powder size M', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0018', null, null, null, 'Box', '7', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('48', '1', 'Safety box 5L', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0019', null, null, null, 'Box', '7', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('49', '1', 'Vaseline Petrolatum Gauze B/10', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0020', null, null, null, 'Box', '7', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('50', '1', 'Innoplastic B/100', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0021', null, null, null, 'Box', '7', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('51', '1', 'CRL-aperture adhesive plaster 18cm*4cm', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0022', null, null, null, 'Box', '7', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('52', '1', 'Adhesive plaster with holes', 'Admin', '1', '2023-02-06 00:46:39.190810', null, '2023-02-06 00:46:39.000000', 'Samsethy', '1', '2', 'GEP0023', null, null, null, 'Box', '7', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('53', '1', 'Vaseline pet jelly orig 100ml/fl', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0024', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('54', '1', 'Needle dermapen VIP 42 ', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0025', null, null, null, 'Box', '7', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('55', '1', 'Prednisolone USA 1FL', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0002', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('56', '1', 'KTC Scalp solution', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0067', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('57', '1', 'Neocilor ', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GOM0005', null, null, null, 'Tablet', '4', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('58', '1', 'Telfast Hd 180mg', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GOM0006', null, null, null, 'Tablet', '4', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('59', '1', 'Atarax 25mg', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GOM0007', null, null, null, 'Tablet', '4', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('60', '1', 'Cloxacap 500mg', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GOM0008', null, null, null, 'Tablet', '4', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('61', '1', 'Terbinaforce 250mg', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GOM0009', null, null, null, 'Tablet', '4', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('62', '1', 'Inox 100mg', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GOM0010', null, null, null, 'Tablet', '4', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('63', '1', 'Zithrosun-250', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GOM0011', null, null, null, 'Tablet', '4', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('64', '1', 'Codalgin Forte 500', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GOM0013', null, null, null, 'Tablet', '4', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('65', '1', 'Alpha Choay 4.15mg', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GOM0014', null, null, null, 'Tablet', '4', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('66', '1', 'Esome 40mg', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GOM0015', null, null, null, 'Tablet', '4', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('67', '1', 'Deriva MS gel 15g', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0025', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('68', '1', 'Medi-Ceftriaxone inj', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0003', null, null, null, 'Vial', '8', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('69', '1', 'Clavox 1.2g IV', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0004', null, null, null, 'FL', '9', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('70', '1', 'Lidocaine 2% 50ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0005', null, null, null, 'FL', '9', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('71', '1', 'Tanganil 500mg/5ml IV', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0006', null, null, null, 'Amp', '10', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('72', '1', 'Met-Sil 2ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0007', null, null, null, 'Amp', '10', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('73', '1', 'Para Kabi 1000mg/100ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0008', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('74', '1', 'Anadol Inj 100mg/2ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0009', null, null, null, 'Amp', '10', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('75', '1', 'Remopain 3% Inj', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0010', null, null, null, 'Amp', '10', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('76', '1', 'Adrenaline Inj 1ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0011', null, null, null, 'Amp', '10', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('77', '1', 'Dexamedico inj', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0012', null, null, null, 'Amp', '10', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('78', '1', 'Genta inj-uto', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0013', null, null, null, 'Amp', '10', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('79', '1', 'Hydromark-100', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0014', null, null, null, 'Vial', '8', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('80', '1', 'VIK 1-vitamin K1 inj 10mg/1ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0015', null, null, null, 'Amp', '10', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('81', '1', 'Onasia', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0016', null, null, null, 'Amp', '10', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('82', '1', 'Exacyl inj', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0017', null, null, null, 'Amp', '10', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('83', '1', 'Effaclar Duo(+) 40ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0026', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('84', '1', 'Anthelios Anti-shine', 'Admin', '1', '2023-01-16 16:14:43.070177', null, '2023-01-16 16:14:43.000000', 'Samsethy', '1', '2', 'GTP0027', null, null, null, null, null, '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('85', '1', 'Anthelios Fluid invisible', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0028', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('86', '1', 'Cicaplast gel B5 40ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0029', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('87', '1', 'Cicaplast Baume B5 100ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0030', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('88', '1', 'Water Max Milk Cleanser 1200ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0031', null, null, null, 'Box', '7', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('89', '1', 'Counteractive Bubble Clear 150ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0032', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('90', '1', 'Alpha Cleansing Foam 1200ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0033', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('91', '1', 'Peppermint Cool plus modeling mask 1kg', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0034', null, null, null, 'Pack', '6', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('92', '1', 'Gold Plus Modeling mask 1kg', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0035', null, null, null, 'Pack', '6', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('93', '1', 'Marine Aqua Plus Modeling mask 1kg', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0036', null, null, null, 'Pack', '6', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('94', '1', 'Azulene Complex Ampoule 72 150ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0037', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('95', '1', 'EGF Complex Ampoule 50 150ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0038', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('96', '1', 'Hyaluron Complex Ampoule 62 150ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0039', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('97', '1', 'History Conductive Gel 500ml ', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0040', null, null, null, 'Box', '7', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('98', '1', 'Histo HQ Cream 1000ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0041', null, null, null, 'Box', '7', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('99', '1', 'Histo Aloe Vera gel 1200ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0042', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('100', '1', 'Gamma Crystal Serum 500ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0043', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('101', '1', 'Beta Fresh toner 1200ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0044', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('102', '1', 'Premium renewal Essence 500ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0045', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('103', '1', 'Premium Timeless Cream 250g', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0046', null, null, null, 'Box', '7', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('104', '1', 'Premium Eye Cream 250g', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0047', null, null, null, 'Box', '7', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('105', '1', 'Whiteness Lightening Serum 80ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0048', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('106', '1', 'Triangle Peel PA 80ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0049', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('107', '1', 'Triangle Peel PB 80ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0050', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('108', '1', 'Delta Active Cream 500ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0051', null, null, null, 'Box', '7', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('109', '1', 'Glycolic Skin Peel 70% 480ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0052', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('110', '1', 'Lactic acid Peel 70% 480ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0053', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('111', '1', 'Combination Peel 240ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0054', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('112', '1', 'Salicylic Peel 30% 120ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0055', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('113', '1', 'Ice Jeju Aloe 300ml(Thefaceshop)', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0056', null, null, null, 'Box', '7', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('114', '1', 'Aloe 99% 300ml(Thefaceshop)', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0057', null, null, null, 'Box', '7', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('115', '1', 'Smart Peeling Honey Scrub (thefaceshop)', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0058', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('116', '1', 'Smart Peeling white jewel', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0059', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('117', '1', 'Centrifuge Virtuose', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0026', null, null, null, 'Box', '7', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('118', '1', 'PRP tube 9ml Virtuose', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0027', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('119', '1', 'Dermapen A6', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0028', null, null, null, 'Box', '7', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('120', '1', 'Needle Dermapen A6 nano', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0029', null, null, null, 'Pack', '6', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('121', '1', 'Needle Dermapen A6 42', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0030', null, null, null, 'Pack', '6', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('122', '1', 'Skin marker', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0031', null, null, null, 'Pack', '6', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('123', '1', 'Cotton Facial pad', 'Admin', '1', '2023-02-13 07:49:53.377633', null, '2023-02-13 07:49:53.000000', 'Samsethy', '1', '2', 'GEP0032', null, null, null, 'Pack', '6', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('124', '1', 'Acne extraction', 'Admin', '1', '2023-02-13 08:11:32.147728', 'dsfgdfg efdsgd sdfdfg', '2023-02-13 08:11:32.000000', 'Samsethy', '1', '2', 'G100016', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('125', '1', 'Cautery ', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0034', null, null, null, 'Pack', '6', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('126', '1', 'Peel', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'G100129', null, null, null, 'Pack', '6', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('127', '1', 'Meso GTM Gold cell PDRN8% (Box/10 3,3ml)', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0018', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('128', '1', 'Meso Restructurer Innoaesthetic (B/4 5ml)', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0019', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('129', '1', 'Meso Redness ID innoaethetic (B/4 2.5ml)', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0020', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('130', '1', 'Meso Melatocin Essence Melasma (B/10 5ml)', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0021', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('131', '1', 'Meso GTM mela cell 3% melasma (B/10 3,5ml)', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0022', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('132', '1', 'Placenta Melsmon 2ml ', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0023', null, null, null, 'Amp', '10', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('133', '1', 'Placenta Lannec 2ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0024', null, null, null, 'Amp', '10', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('134', '1', 'Botulax 100UI ', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0025', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('135', '1', 'AMC Slimming Drip', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0027', null, null, null, 'Set', '5', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('136', '1', 'Japan Whitening Drip', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0026', null, null, null, 'Set', '5', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('137', '1', 'Meso Multi Needle', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0036', null, null, null, 'Pack', '6', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('138', '1', 'Sivkoit (Triamcinolone) 80mg', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0028', null, null, null, 'Amp', '10', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('139', '1', 'Para Inj 300mg ', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0029', null, null, null, 'Amp', '10', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('140', '1', 'NSS 100ml Thai', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0030', null, null, null, 'FL', '9', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('141', '1', 'NSS 500ml Thai', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0031', null, null, null, 'FL', '9', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('142', '1', 'Surgical cap', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0037', null, null, null, 'Pack', '6', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('143', '1', 'Skinoren Cream 30g', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0060', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('144', '1', 'Skarfix-TX cream', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0061', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('145', '1', 'Isis Teen Derm gel sensitive 100ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0062', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('146', '1', 'Isis Neotone Gel 150ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0063', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('147', '1', 'Isis Ruboril Expert S', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0064', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('148', '1', 'Isis Aqua Ruboril 250ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0065', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('149', '1', 'NSS 250ml korea', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0032', null, null, null, 'FL', '9', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('150', '1', 'Neuramis gold', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0033', null, null, null, 'Box', '7', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('151', '1', 'Needle 30G 4mm', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0038', null, null, null, 'pcs', '11', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('152', '1', 'D5W Thai 500ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0034', null, null, null, 'FL', '9', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('153', '1', 'Lactate Thai 500ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0035', null, null, null, 'FL', '9', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('154', '1', 'D10W Thai ', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0036', null, null, null, 'FL', '9', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('155', '1', 'Glove Sterile 6.5', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0039', null, null, null, 'Pack', '6', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('156', '1', 'Nipro Needle 30G 13mm', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0040', null, null, null, 'Box', '7', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('157', '1', 'Saforelle soin', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0068', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('158', '1', 'ISIS Aqua Ruboril 400ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0001', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('159', '1', 'ISIS Ketoplast Cracks 40ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0002', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('160', '1', 'ISIS Ketoplast Scars SPF50+ 40ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0003', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('161', '1', 'ISIS Neotone Aqua 250ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0004', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('162', '1', 'ISIS Neotone Body 100ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0005', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('163', '1', 'ISIS Neotone Eyes 15ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0006', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('164', '1', 'ISIS Neotone Prevent SPF50+ Mineral Tinted', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0007', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('165', '1', 'ISIS Neotone Radiance SPF50+ 30ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0008', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('166', '1', 'ISIS Neotone Sensitive 30ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0009', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('167', '1', 'ISIS Ruboril Expert M 40ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0011', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('168', '1', 'ISIS Ruboril Expert SPF 50+ 40ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0012', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('169', '1', 'ISIS Ruboril Expert Intense 15ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0013', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('170', '1', 'ISIS Ruboril Expert Lotion 250ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0014', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('171', '1', 'ISIS Secalia AHA 200ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0015', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('172', '1', 'ISIS Secalia Balm 200ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0016', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('173', '1', 'ISIS Secalia Ultra 200ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0017', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('174', '1', 'ISIS Sensylia 24h 40ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0018', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('175', '1', 'ISIS Sensylia 24h Legere 40ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0019', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('176', '1', 'ISIS Sensylia Aqua 100ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0020', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('177', '1', 'ISIS Sensylia Gelee 250ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0021', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('178', '1', 'ISIS Suavigel 40ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0022', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('179', '1', 'ISIS Teen Derm Aqua 100ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0023', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('180', '1', 'ISIS Teen Derm Aqua 250ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0024', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('181', '1', 'ISIS Teen Derm Alpha Pure 30ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0025', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('182', '1', 'ISIS Teen Derm Gel 40ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0026', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('183', '1', 'ISIS Teen Derm Gel 150ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0027', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('184', '1', 'ISIS Teen Derm Gel Sensitive 250ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0028', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('185', '1', 'ISIS Teen Derm Hydra 40ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0029', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('186', '1', 'ISIS Teen Derm K 30ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0030', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('187', '1', 'ISIS Teen Derm K Concentrate 30ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0031', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('188', '1', 'ISIS Urelia 10 150ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0032', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('189', '1', 'ISIS Urelia 50 40ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0033', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('190', '1', 'ISIS Urelia Gel 200ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0034', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('191', '1', 'ISIS SPF50+ Day Secure Invisible', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0035', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('192', '1', 'ISIS SPF50+ Invisible Fluid 40ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0036', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('193', '1', 'ISIS SPF50+ Light Tinted Fluid 40ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0037', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('194', '1', 'ISIS SPF50+ Tinted Mineral Cream', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0038', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('195', '1', 'ISIS SPF50+ Mineral Cream 40ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0039', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('196', '1', 'ISIS SPF30+ Dry Touch 40ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0040', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('197', '1', 'ISIS SPF80 Invisible cream 40ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0041', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('198', '1', 'ISIS Vitiskin 50ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0042', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('199', '1', 'Noreva Norelift Day Cream', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0043', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('200', '1', 'Noreva Actipur BB light 30ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0044', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('201', '1', 'Noreva Actipur BB Golden 30ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0045', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('202', '1', 'Noreva Actipur Cleansing Gel 150ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0046', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('203', '1', 'Noreva Exfoliac Global 6 30ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0047', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('204', '1', 'Noreva Exfoliac Foaming Gel 200ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0048', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('205', '1', 'Noreva Trio Dark Spot Serum 30ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0049', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('206', '1', 'Noreva Trio Dark Spot Care SPF 50+ ', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0050', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('207', '1', 'Noreva Trio Dark Spot Care 30ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0051', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('208', '1', 'Noreva Xerodiane AP+ Cream 400ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0052', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('209', '1', 'Noreva Xerodiane AP+ Cleaning Shower', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0053', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('210', '1', 'Noreva Sensidiane AR Anti-Redness cream 30ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0054', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('211', '1', 'Embryolisse Lait-Creme Concentre 30ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0055', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('212', '1', 'Embryolisse Lait-Creme Fluide 75ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0056', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('213', '1', 'Embryolisse Eua De Beaute 200ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0057', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('214', '1', 'Embryolisse Lotion Micellaire 250ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0058', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('215', '1', 'Embryolisse lashes & brows Booster 6.5ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0059', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('216', '1', 'Embryolisse Intense Smooth 50ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0060', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('217', '1', 'Embryolisse Complexion BB Cream', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0061', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('218', '1', 'Embryolisse Complexion CC Cream 30ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0062', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('219', '1', 'Embryolisse Consealer (Beige) 8ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0063', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('220', '1', 'Embryolisse Consealer (PInk) 8ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0064', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('221', '1', 'Embryolisse Smooth Rodiant 40ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0065', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('222', '1', 'Embryolisse Radiant Powder 12g', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0066', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('223', '1', 'Embryolisse Radiant Eye 4.5g', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0067', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('224', '1', 'ISIS Neotone Serum 30ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GSP0010', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('225', '1', 'Bupivacaine ', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0037', null, null, null, 'Amp', '10', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('226', '1', 'Glucose Thai inj 50%', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0038', null, null, null, 'Amp', '10', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('227', '1', 'Cannula 25G*50MM', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0041', null, null, null, 'pcs', '11', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('228', '1', 'Cannula 18G*50MM', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0042', null, null, null, 'pcs', '11', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('229', '1', 'Skin marker white ', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0043', null, null, null, 'pcs', '11', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('230', '1', 'Botox USA', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0039', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('231', '1', 'Whiteness lightening serum', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0069', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('232', '1', 'Firide 1mg', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GOM0017', null, null, null, 'Tablet', '4', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('233', '1', 'Minoxin 5%', 'Admin', '1', '2023-01-17 23:35:38.519204', null, '2023-01-17 23:35:38.000000', 'Samsethy', '1', '2', 'GTP0070', null, null, null, null, null, '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('234', '1', 'Acnetin 005', 'Admin', '1', '2023-02-06 00:46:46.325097', 'dfgd', '2023-02-06 00:46:46.000000', 'Samsethy', '1', '2', 'ACN100005', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('235', '1', 'F-ACN (FUSION)', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0040', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('236', '1', 'F-RADIAN (FUSION)', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0041', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('237', '1', 'F-EYECONTOUR (FUSION)', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'G42', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('238', '1', 'F-HAIR MEN (FUSION)', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0043', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('239', '1', 'Minoxin 2%', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0072', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('240', '1', 'Orrepast', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0073', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('241', '1', 'Mediclovir 400mg', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GOM0018', null, null, null, 'Tablet', '4', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('242', '1', 'Gofen 400mg', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GOM0019', null, null, null, 'Tablet', '4', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('243', '1', 'Y Mycin N', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0074', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('244', '1', 'Y Mycin A ', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0075', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('245', '1', 'Nitrile No powder Size S', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0044', null, null, null, 'Box', '7', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('246', '1', 'Nitrile No powder Size M', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0045', null, null, null, 'Box', '7', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('247', '1', 'Lergicet 10mg', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GOM0020', null, null, null, 'Tablet', '4', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('248', '1', 'Falete 250mg', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GOM0021', null, null, null, 'Tablet', '4', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('249', '1', 'Medixon 125mg ', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0044', null, null, null, 'FL', '9', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('250', '1', 'Cicaplast Baume B5 40ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0076', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('251', '1', 'Bioderma Sensibio Gel moussant 200ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0077', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('252', '1', 'Bioderma Sensibio Gel moussant 45ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0078', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('253', '1', 'Akne-Derm 2.5 Cream', 'Admin', '1', '2023-01-16 15:14:41.791054', null, '2023-01-16 15:14:41.791054', null, null, '2', 'GTP0079', null, null, null, null, null, '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('254', '1', 'Syringe Leur Lock 3ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0046', null, null, null, 'Box', '7', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('255', '1', 'Syringe Leur Lock 5ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0047', null, null, null, 'Box', '7', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('256', '1', 'Syringe Leur Lock 10ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0048', null, null, null, 'Box', '7', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('257', '1', 'Syringe Leur Lock 50ml', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0049', null, null, null, 'Box', '7', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('258', '1', 'Biotin Nature Own', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GOM0022', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('259', '1', 'Hydrogel Brightening Mask', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0080', null, null, null, 'pcs', '11', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('260', '1', 'Hydrogel Gold Mask', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0081', null, null, null, 'pcs', '11', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('261', '1', 'Hydrogel Snail Mask', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0082', null, null, null, 'pcs', '11', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('262', '1', 'Grand Compress (Bloc)', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'G2', null, null, null, 'pcs', '11', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('263', '1', 'Esome 40mg(Injection)', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'G4', null, null, null, 'Amp', '10', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('264', '1', 'LRP Spray SPF50+', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0083', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('265', '1', 'M-Cain Cream', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0084', null, null, null, 'Box', '7', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('266', '1', 'Neuramis Gray', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0046', null, null, null, 'Box', '7', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('267', '1', 'Liporase', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0047', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('268', '1', 'PRP Tube USA', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GEP0051', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('269', '1', 'Genta Injection', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0048', null, null, null, 'Amp', '10', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('270', '1', 'Cimetidine Injection', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0049', null, null, null, 'Amp', '10', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('271', '1', 'Pengesic 50mg (Tramadol)', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GOM0023', null, null, null, 'Tablet', '4', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('272', '1', 'F-MELACLEAR', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GIN0050', null, null, null, 'Bottle', '2', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('273', '1', 'Vitara TXPPE', 'Admin', '1', '2023-02-06 00:08:17.533105', null, '2023-02-06 00:08:17.533105', null, null, '2', 'GTP0085', null, null, null, 'Tube', '3', '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('512', '1', 'Doliprane', 'Samsethy', '1', '2023-01-16 16:10:11.586906', null, '2023-01-16 16:10:11.586906', null, null, '2', 'DOL100001', null, null, null, null, null, '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('513', '1', 'Paracetamol', 'Samsethy', '1', '2023-01-16 16:15:36.759593', null, '2023-01-16 16:15:36.000000', 'Samsethy', '1', '2', 'PAR100001', null, null, null, null, null, '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('514', '1', 'sdgdfgfdh', 'Samsethy', '1', '2023-01-16 17:25:41.112911', null, '2023-01-16 17:25:41.112911', null, null, '1', 'SDG100001', null, null, null, null, null, '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('515', '1', 'ddggdfhfghf', 'Samsethy', '1', '2023-01-16 17:25:49.191979', null, '2023-01-16 17:25:49.191979', null, null, '1', 'DDG100001', null, null, null, null, null, '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('516', '1', 'Oil Palm Residue', 'Samsethy', '1', '2023-01-20 16:51:31.639055', null, '2023-01-20 16:51:31.000000', 'Samsethy', '1', '27', 'OIL100001', null, null, null, null, null, '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('517', '1', 'tesdfdfd', 'Samsethy', '1', '2023-02-04 14:43:21.788385', 'New group', '2023-02-04 14:43:21.788385', null, null, '1', 'TES100001', null, null, null, null, null, '0', null, '0.00', '0.00', null);
INSERT INTO `inv_item_groups` VALUES ('518', '1', 'ddddd', 'Samsethy', '1', '2023-02-04 14:43:27.013423', 'New group', '2023-02-04 14:43:27.013423', null, null, '1', 'DDD100001', null, null, null, null, null, '0', null, '0.00', '0.00', null);

-- ----------------------------
-- Table structure for `inv_last_stocks`
-- ----------------------------
DROP TABLE IF EXISTS `inv_last_stocks`;
CREATE TABLE `inv_last_stocks` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `stockclass_code` varchar(15) NOT NULL,
  `warehouse_id` int(10) NOT NULL,
  `block_code` varchar(15) DEFAULT NULL,
  `item_id` int(10) NOT NULL,
  `item_code` varchar(25) NOT NULL,
  `qty` decimal(10,2) NOT NULL,
  `unit_id` int(10) NOT NULL,
  `sku` varchar(15) NOT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) NOT NULL,
  `update_uid` int(10) NOT NULL,
  `remarks` varchar(200) DEFAULT NULL,
  `begining_qty` decimal(10,2) NOT NULL,
  `purhase_qty` decimal(10,2) NOT NULL,
  `sold_qty` decimal(10,2) NOT NULL,
  `customer_return_qty` decimal(10,2) NOT NULL,
  `vendor_return_qty` decimal(10,2) NOT NULL,
  `adjust_qty` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_last_stocks
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
  `create_user` varchar(50) NOT NULL DEFAULT '',
  `update_uid` int(10) DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_manufacturers
-- ----------------------------
INSERT INTO `inv_manufacturers` VALUES ('1', '1', 'Unknown', null, '1', 'Samsethy', null, null, '2023-01-16 15:38:03.791280', '2023-01-16 15:38:03.791280');
INSERT INTO `inv_manufacturers` VALUES ('4', '1', 'FFFFF', null, '1', 'Samsethy', null, null, null, '2023-01-16 15:42:40.000000');

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
-- Table structure for `inv_purchased_items`
-- ----------------------------
DROP TABLE IF EXISTS `inv_purchased_items`;
CREATE TABLE `inv_purchased_items` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `bill_id` int(10) NOT NULL,
  `item_id` int(10) NOT NULL,
  `description` varchar(200) NOT NULL,
  `qty` decimal(10,2) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `discount` decimal(10,2) NOT NULL,
  `discount_type` varchar(10) NOT NULL COMMENT 'discount_type ={percent,amount}',
  `currency_code` varchar(10) NOT NULL,
  `line_total` decimal(10,2) NOT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_purchased_items
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
-- Table structure for `inv_shop_stocks`
-- ----------------------------
DROP TABLE IF EXISTS `inv_shop_stocks`;
CREATE TABLE `inv_shop_stocks` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `trx_id` int(10) NOT NULL,
  `shop_id` int(10) NOT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_user` varchar(50) DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_shop_stocks
-- ----------------------------

-- ----------------------------
-- Table structure for `inv_shop_summary`
-- ----------------------------
DROP TABLE IF EXISTS `inv_shop_summary`;
CREATE TABLE `inv_shop_summary` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `trx_date` date NOT NULL COMMENT 'unlike in table "warehouse_transactions", the columns (trx_date, item_code) cannot be duplicate value',
  `shop_id` int(10) NOT NULL,
  `item_id` int(10) NOT NULL,
  `item_code` varchar(35) DEFAULT NULL,
  `qty_in` decimal(10,2) NOT NULL DEFAULT 0.00,
  `qty_out` decimal(10,2) NOT NULL DEFAULT 0.00,
  `create_uid` int(10) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_uid` int(10) NOT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_user` varchar(50) DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_shop_summary
-- ----------------------------

-- ----------------------------
-- Table structure for `inv_sold_items`
-- ----------------------------
DROP TABLE IF EXISTS `inv_sold_items`;
CREATE TABLE `inv_sold_items` (
  `id` int(10) NOT NULL,
  `branch_id` int(10) NOT NULL,
  `stockclass_code` varchar(10) NOT NULL,
  `warehouse_id` int(10) NOT NULL,
  `com_branch_id` int(10) DEFAULT NULL,
  `item_id` int(10) NOT NULL,
  `item_code` varchar(20) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `selling_price` decimal(10,2) NOT NULL,
  `discount` decimal(10,2) NOT NULL,
  `discount_type` varchar(10) NOT NULL,
  `line_total` decimal(10,2) NOT NULL,
  `qty` decimal(10,2) NOT NULL,
  `cost` decimal(10,2) NOT NULL,
  `create_uid` int(10) NOT NULL,
  `create_user` varchar(50) NOT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_uid` int(10) DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL,
  `ref_type` varchar(15) NOT NULL COMMENT 'ref_type = {invoice,sale-receipt}',
  `ref_id` int(10) NOT NULL,
  `trx_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `customer_id` int(10) DEFAULT NULL,
  `ref_number` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_sold_items
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
  `code` varchar(5) NOT NULL COMMENT 'code ={A,B,C, etc...}',
  `name` varchar(50) NOT NULL COMMENT 'name ={"For Sales","Internal Usage"}',
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_user` varchar(50) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_stock_classes
-- ----------------------------
INSERT INTO `inv_stock_classes` VALUES ('1', '1', 'A', 'For Sales', '2023-01-14 15:21:34.162570', 'Admin', '1', '2023-01-14 15:21:34.162570', null, null);
INSERT INTO `inv_stock_classes` VALUES ('2', '1', 'B', 'Internal Usage', '2023-01-14 15:21:34.574335', 'Admin', '1', '2023-01-14 15:21:34.574335', null, null);
INSERT INTO `inv_stock_classes` VALUES ('3', '1', 'C', 'Charitty', null, 'Admin', '1', null, null, null);

-- ----------------------------
-- Table structure for `inv_stock_log`
-- ----------------------------
DROP TABLE IF EXISTS `inv_stock_log`;
CREATE TABLE `inv_stock_log` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `create_user` varchar(50) NOT NULL,
  `description` varchar(250) NOT NULL,
  `action_name` varchar(20) NOT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_uid` int(10) DEFAULT NULL,
  `qty` decimal(10,2) NOT NULL DEFAULT 0.00,
  `trx_id` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=324 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_stock_log
-- ----------------------------
INSERT INTO `inv_stock_log` VALUES ('137', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 00:15:50.000000', '1', '0.00', '19');
INSERT INTO `inv_stock_log` VALUES ('138', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 00:15:50.000000', '1', '0.00', '20');
INSERT INTO `inv_stock_log` VALUES ('139', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 00:15:51.000000', '1', '0.00', '19');
INSERT INTO `inv_stock_log` VALUES ('140', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 00:15:51.000000', '1', '0.00', '20');
INSERT INTO `inv_stock_log` VALUES ('141', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 00:15:51.000000', '1', '0.00', '19');
INSERT INTO `inv_stock_log` VALUES ('142', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 00:15:51.000000', '1', '0.00', '20');
INSERT INTO `inv_stock_log` VALUES ('143', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 00:15:52.000000', '1', '0.00', '19');
INSERT INTO `inv_stock_log` VALUES ('144', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 00:15:52.000000', '1', '0.00', '20');
INSERT INTO `inv_stock_log` VALUES ('145', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 00:16:56.000000', '1', '0.00', '19');
INSERT INTO `inv_stock_log` VALUES ('146', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 00:16:56.000000', '1', '0.00', '20');
INSERT INTO `inv_stock_log` VALUES ('147', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 00:19:49.000000', '1', '0.00', '19');
INSERT INTO `inv_stock_log` VALUES ('148', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 00:19:49.000000', '1', '0.00', '20');
INSERT INTO `inv_stock_log` VALUES ('149', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 00:20:03.000000', '1', '0.00', '19');
INSERT INTO `inv_stock_log` VALUES ('150', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 00:20:03.000000', '1', '0.00', '20');
INSERT INTO `inv_stock_log` VALUES ('151', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 00:20:13.000000', '1', '0.00', '19');
INSERT INTO `inv_stock_log` VALUES ('152', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 00:20:13.000000', '1', '0.00', '20');
INSERT INTO `inv_stock_log` VALUES ('153', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 00:20:50.000000', '1', '0.00', '19');
INSERT INTO `inv_stock_log` VALUES ('154', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 00:20:50.000000', '1', '0.00', '20');
INSERT INTO `inv_stock_log` VALUES ('155', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 00:21:30.000000', '1', '0.00', '19');
INSERT INTO `inv_stock_log` VALUES ('156', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 00:21:30.000000', '1', '0.00', '20');
INSERT INTO `inv_stock_log` VALUES ('157', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 00:24:46.000000', '1', '0.00', '19');
INSERT INTO `inv_stock_log` VALUES ('158', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 00:24:46.000000', '1', '0.00', '20');
INSERT INTO `inv_stock_log` VALUES ('159', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 00:27:48.000000', '1', '0.00', '19');
INSERT INTO `inv_stock_log` VALUES ('160', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 00:27:48.000000', '1', '0.00', '20');
INSERT INTO `inv_stock_log` VALUES ('161', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 00:31:24.000000', '1', '0.00', '19');
INSERT INTO `inv_stock_log` VALUES ('162', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 00:31:24.000000', '1', '0.00', '20');
INSERT INTO `inv_stock_log` VALUES ('163', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 00:31:58.000000', '1', '0.00', '19');
INSERT INTO `inv_stock_log` VALUES ('164', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 00:31:58.000000', '1', '0.00', '20');
INSERT INTO `inv_stock_log` VALUES ('165', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 00:34:12.000000', '1', '0.00', '19');
INSERT INTO `inv_stock_log` VALUES ('166', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 00:34:12.000000', '1', '0.00', '20');
INSERT INTO `inv_stock_log` VALUES ('167', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 00:34:49.000000', '1', '0.00', '19');
INSERT INTO `inv_stock_log` VALUES ('168', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 00:34:49.000000', '1', '0.00', '20');
INSERT INTO `inv_stock_log` VALUES ('169', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 00:34:51.000000', '1', '0.00', '19');
INSERT INTO `inv_stock_log` VALUES ('170', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 00:34:51.000000', '1', '0.00', '20');
INSERT INTO `inv_stock_log` VALUES ('171', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 00:34:52.000000', '1', '0.00', '19');
INSERT INTO `inv_stock_log` VALUES ('172', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 00:34:52.000000', '1', '0.00', '20');
INSERT INTO `inv_stock_log` VALUES ('173', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 00:35:34.000000', '1', '0.00', '19');
INSERT INTO `inv_stock_log` VALUES ('174', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 00:35:34.000000', '1', '0.00', '20');
INSERT INTO `inv_stock_log` VALUES ('175', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 00:36:57.000000', '1', '0.00', '19');
INSERT INTO `inv_stock_log` VALUES ('176', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 00:36:57.000000', '1', '0.00', '20');
INSERT INTO `inv_stock_log` VALUES ('177', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 00:37:11.000000', '1', '0.00', '19');
INSERT INTO `inv_stock_log` VALUES ('178', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 00:37:11.000000', '1', '0.00', '20');
INSERT INTO `inv_stock_log` VALUES ('179', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 00:38:14.000000', '1', '0.00', '19');
INSERT INTO `inv_stock_log` VALUES ('180', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 00:38:14.000000', '1', '0.00', '20');
INSERT INTO `inv_stock_log` VALUES ('181', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 00:38:30.000000', '1', '0.00', '19');
INSERT INTO `inv_stock_log` VALUES ('182', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 00:38:30.000000', '1', '0.00', '20');
INSERT INTO `inv_stock_log` VALUES ('183', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 09:18:49.000000', '1', '0.00', '19');
INSERT INTO `inv_stock_log` VALUES ('184', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 09:18:49.000000', '1', '0.00', '20');
INSERT INTO `inv_stock_log` VALUES ('185', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 09:19:26.000000', '1', '0.00', '19');
INSERT INTO `inv_stock_log` VALUES ('186', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 09:19:26.000000', '1', '0.00', '20');
INSERT INTO `inv_stock_log` VALUES ('187', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 09:19:49.000000', '1', '0.00', '19');
INSERT INTO `inv_stock_log` VALUES ('188', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 09:19:49.000000', '1', '0.00', '20');
INSERT INTO `inv_stock_log` VALUES ('189', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 14:52:47.000000', '1', '0.00', '24');
INSERT INTO `inv_stock_log` VALUES ('190', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 14:52:47.000000', '1', '0.00', '25');
INSERT INTO `inv_stock_log` VALUES ('191', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 14:53:23.000000', '1', '0.00', '26');
INSERT INTO `inv_stock_log` VALUES ('192', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 14:53:23.000000', '1', '0.00', '27');
INSERT INTO `inv_stock_log` VALUES ('193', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 15:03:01.000000', '1', '0.00', '28');
INSERT INTO `inv_stock_log` VALUES ('194', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 15:03:01.000000', '1', '0.00', '29');
INSERT INTO `inv_stock_log` VALUES ('195', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 15:04:12.000000', '1', '0.00', '30');
INSERT INTO `inv_stock_log` VALUES ('196', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 15:04:12.000000', '1', '0.00', '31');
INSERT INTO `inv_stock_log` VALUES ('197', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 15:04:28.000000', '1', '0.00', '32');
INSERT INTO `inv_stock_log` VALUES ('198', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 15:04:28.000000', '1', '0.00', '33');
INSERT INTO `inv_stock_log` VALUES ('199', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 15:10:03.000000', '1', '0.00', '34');
INSERT INTO `inv_stock_log` VALUES ('200', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 15:10:03.000000', '1', '0.00', '35');
INSERT INTO `inv_stock_log` VALUES ('201', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 15:10:09.000000', '1', '0.00', '36');
INSERT INTO `inv_stock_log` VALUES ('202', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 15:10:09.000000', '1', '0.00', '37');
INSERT INTO `inv_stock_log` VALUES ('203', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 15:11:18.000000', '1', '0.00', '38');
INSERT INTO `inv_stock_log` VALUES ('204', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 15:11:18.000000', '1', '0.00', '39');
INSERT INTO `inv_stock_log` VALUES ('205', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 15:11:59.000000', '1', '0.00', '40');
INSERT INTO `inv_stock_log` VALUES ('206', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 15:11:59.000000', '1', '0.00', '41');
INSERT INTO `inv_stock_log` VALUES ('207', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 16:01:19.000000', '1', '0.00', '42');
INSERT INTO `inv_stock_log` VALUES ('208', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 16:01:19.000000', '1', '0.00', '43');
INSERT INTO `inv_stock_log` VALUES ('209', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 16:03:05.000000', '1', '0.00', '44');
INSERT INTO `inv_stock_log` VALUES ('210', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 16:03:05.000000', '1', '0.00', '45');
INSERT INTO `inv_stock_log` VALUES ('211', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 16:03:24.000000', '1', '0.00', '46');
INSERT INTO `inv_stock_log` VALUES ('212', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 16:03:24.000000', '1', '0.00', '47');
INSERT INTO `inv_stock_log` VALUES ('213', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 16:14:46.000000', '1', '0.00', '48');
INSERT INTO `inv_stock_log` VALUES ('214', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 16:14:46.000000', '1', '0.00', '49');
INSERT INTO `inv_stock_log` VALUES ('215', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 16:15:06.000000', '1', '0.00', '50');
INSERT INTO `inv_stock_log` VALUES ('216', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 16:15:06.000000', '1', '0.00', '51');
INSERT INTO `inv_stock_log` VALUES ('217', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 16:15:08.000000', '1', '0.00', '52');
INSERT INTO `inv_stock_log` VALUES ('218', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 16:15:08.000000', '1', '0.00', '53');
INSERT INTO `inv_stock_log` VALUES ('219', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 16:15:11.000000', '1', '0.00', '54');
INSERT INTO `inv_stock_log` VALUES ('220', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 16:15:11.000000', '1', '0.00', '55');
INSERT INTO `inv_stock_log` VALUES ('221', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 16:44:08.000000', '1', '0.00', '56');
INSERT INTO `inv_stock_log` VALUES ('222', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 16:44:08.000000', '1', '0.00', '57');
INSERT INTO `inv_stock_log` VALUES ('223', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 16:44:45.000000', '1', '0.00', '56');
INSERT INTO `inv_stock_log` VALUES ('224', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 16:44:45.000000', '1', '0.00', '57');
INSERT INTO `inv_stock_log` VALUES ('225', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 16:45:14.000000', '1', '0.00', '56');
INSERT INTO `inv_stock_log` VALUES ('226', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 16:45:14.000000', '1', '0.00', '57');
INSERT INTO `inv_stock_log` VALUES ('227', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 16:46:11.000000', '1', '0.00', '58');
INSERT INTO `inv_stock_log` VALUES ('228', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 16:46:11.000000', '1', '0.00', '59');
INSERT INTO `inv_stock_log` VALUES ('229', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 16:57:33.000000', '1', '0.00', '60');
INSERT INTO `inv_stock_log` VALUES ('230', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 16:57:33.000000', '1', '0.00', '61');
INSERT INTO `inv_stock_log` VALUES ('231', '1', 'admin@gmail.com', 'Samsethy receives PO 1 bottle', 'receive', '2023-02-05 16:58:25.000000', '1', '0.00', '60');
INSERT INTO `inv_stock_log` VALUES ('232', '1', 'admin@gmail.com', 'Samsethy receives PO 1 box', 'receive', '2023-02-05 16:58:25.000000', '1', '0.00', '61');
INSERT INTO `inv_stock_log` VALUES ('233', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-02-05 16:59:33.000000', '1', '0.00', '60');
INSERT INTO `inv_stock_log` VALUES ('234', '1', 'admin@gmail.com', 'Samsethy receives PO 10 box', 'receive', '2023-02-05 16:59:33.000000', '1', '0.00', '61');
INSERT INTO `inv_stock_log` VALUES ('235', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-02-05 17:16:52.000000', '1', '0.00', '60');
INSERT INTO `inv_stock_log` VALUES ('236', '1', 'admin@gmail.com', 'Samsethy receives PO 10 box', 'receive', '2023-02-05 17:16:52.000000', '1', '0.00', '61');
INSERT INTO `inv_stock_log` VALUES ('237', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-02-05 17:16:54.000000', '1', '0.00', '60');
INSERT INTO `inv_stock_log` VALUES ('238', '1', 'admin@gmail.com', 'Samsethy receives PO 10 box', 'receive', '2023-02-05 17:16:54.000000', '1', '0.00', '61');
INSERT INTO `inv_stock_log` VALUES ('239', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-02-05 23:51:44.000000', '1', '0.00', '60');
INSERT INTO `inv_stock_log` VALUES ('240', '1', 'admin@gmail.com', 'Samsethy receives PO 10 box', 'receive', '2023-02-05 23:51:44.000000', '1', '0.00', '61');
INSERT INTO `inv_stock_log` VALUES ('241', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-02-12 09:38:41.000000', '1', '0.00', '0');
INSERT INTO `inv_stock_log` VALUES ('242', '1', 'admin@gmail.com', 'Samsethy receives PO 10 box', 'receive', '2023-02-12 09:38:41.000000', '1', '0.00', '0');
INSERT INTO `inv_stock_log` VALUES ('243', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-02-12 09:43:06.000000', '1', '0.00', '0');
INSERT INTO `inv_stock_log` VALUES ('244', '1', 'admin@gmail.com', 'Samsethy receives PO 10 box', 'receive', '2023-02-12 09:43:06.000000', '1', '0.00', '0');
INSERT INTO `inv_stock_log` VALUES ('245', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-02-12 09:43:33.000000', '1', '0.00', '0');
INSERT INTO `inv_stock_log` VALUES ('246', '1', 'admin@gmail.com', 'Samsethy receives PO 10 box', 'receive', '2023-02-12 09:43:33.000000', '1', '0.00', '0');
INSERT INTO `inv_stock_log` VALUES ('247', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-02-12 10:34:26.000000', '1', '0.00', '0');
INSERT INTO `inv_stock_log` VALUES ('248', '1', 'admin@gmail.com', 'Samsethy receives PO 10 box', 'receive', '2023-02-12 10:34:26.000000', '1', '0.00', '0');
INSERT INTO `inv_stock_log` VALUES ('249', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-02-12 10:34:28.000000', '1', '0.00', '0');
INSERT INTO `inv_stock_log` VALUES ('250', '1', 'admin@gmail.com', 'Samsethy receives PO 10 box', 'receive', '2023-02-12 10:34:28.000000', '1', '0.00', '0');
INSERT INTO `inv_stock_log` VALUES ('251', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-02-12 10:34:29.000000', '1', '0.00', '0');
INSERT INTO `inv_stock_log` VALUES ('252', '1', 'admin@gmail.com', 'Samsethy receives PO 10 box', 'receive', '2023-02-12 10:34:29.000000', '1', '0.00', '0');
INSERT INTO `inv_stock_log` VALUES ('253', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-02-12 14:38:47.000000', '1', '0.00', '0');
INSERT INTO `inv_stock_log` VALUES ('254', '1', 'admin@gmail.com', 'Samsethy receives PO 10 box', 'receive', '2023-02-12 14:38:47.000000', '1', '0.00', '0');
INSERT INTO `inv_stock_log` VALUES ('255', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-02-12 17:33:05.000000', '1', '0.00', '0');
INSERT INTO `inv_stock_log` VALUES ('256', '1', 'admin@gmail.com', 'Samsethy receives PO 10 box', 'receive', '2023-02-12 17:33:05.000000', '1', '0.00', '0');
INSERT INTO `inv_stock_log` VALUES ('257', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-02-12 17:33:34.000000', '1', '0.00', '0');
INSERT INTO `inv_stock_log` VALUES ('258', '1', 'admin@gmail.com', 'Samsethy receives PO 10 box', 'receive', '2023-02-12 17:33:34.000000', '1', '0.00', '0');
INSERT INTO `inv_stock_log` VALUES ('259', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-02-12 18:04:51.000000', '1', '0.00', '0');
INSERT INTO `inv_stock_log` VALUES ('260', '1', 'admin@gmail.com', 'Samsethy receives PO 10 box', 'receive', '2023-02-12 18:04:51.000000', '1', '0.00', '0');
INSERT INTO `inv_stock_log` VALUES ('261', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-02-12 18:05:50.000000', '1', '0.00', '0');
INSERT INTO `inv_stock_log` VALUES ('262', '1', 'admin@gmail.com', 'Samsethy receives PO 10 box', 'receive', '2023-02-12 18:05:50.000000', '1', '0.00', '0');
INSERT INTO `inv_stock_log` VALUES ('263', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-02-12 19:10:30.000000', '1', '0.00', '0');
INSERT INTO `inv_stock_log` VALUES ('264', '1', 'admin@gmail.com', 'Samsethy receives PO 10 box', 'receive', '2023-02-12 19:10:30.000000', '1', '0.00', '0');
INSERT INTO `inv_stock_log` VALUES ('265', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-02-12 19:12:56.000000', '1', '0.00', '0');
INSERT INTO `inv_stock_log` VALUES ('266', '1', 'admin@gmail.com', 'Samsethy receives PO 10 box', 'receive', '2023-02-12 19:12:56.000000', '1', '0.00', '0');
INSERT INTO `inv_stock_log` VALUES ('267', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-02-12 19:15:24.000000', '1', '0.00', '0');
INSERT INTO `inv_stock_log` VALUES ('268', '1', 'admin@gmail.com', 'Samsethy receives PO 10 box', 'receive', '2023-02-12 19:15:24.000000', '1', '0.00', '0');
INSERT INTO `inv_stock_log` VALUES ('269', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-02-12 19:15:43.000000', '1', '0.00', '0');
INSERT INTO `inv_stock_log` VALUES ('270', '1', 'admin@gmail.com', 'Samsethy receives PO 10 box', 'receive', '2023-02-12 19:15:43.000000', '1', '0.00', '0');
INSERT INTO `inv_stock_log` VALUES ('271', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-02-12 19:16:04.000000', '1', '0.00', '0');
INSERT INTO `inv_stock_log` VALUES ('272', '1', 'admin@gmail.com', 'Samsethy receives PO 10 box', 'receive', '2023-02-12 19:16:04.000000', '1', '0.00', '0');
INSERT INTO `inv_stock_log` VALUES ('273', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-02-12 19:17:04.000000', '1', '0.00', '0');
INSERT INTO `inv_stock_log` VALUES ('274', '1', 'admin@gmail.com', 'Samsethy receives PO 10 box', 'receive', '2023-02-12 19:17:04.000000', '1', '0.00', '0');
INSERT INTO `inv_stock_log` VALUES ('275', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-02-12 19:19:32.000000', '1', '0.00', '0');
INSERT INTO `inv_stock_log` VALUES ('276', '1', 'admin@gmail.com', 'Samsethy receives PO 10 box', 'receive', '2023-02-12 19:19:32.000000', '1', '0.00', '0');
INSERT INTO `inv_stock_log` VALUES ('277', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-02-12 19:27:27.000000', '1', '0.00', '0');
INSERT INTO `inv_stock_log` VALUES ('278', '1', 'admin@gmail.com', 'Samsethy receives PO 10 box', 'receive', '2023-02-12 19:27:27.000000', '1', '0.00', '0');
INSERT INTO `inv_stock_log` VALUES ('279', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-02-12 19:28:17.000000', '1', '0.00', '0');
INSERT INTO `inv_stock_log` VALUES ('280', '1', 'admin@gmail.com', 'Samsethy receives PO 10 box', 'receive', '2023-02-12 19:28:17.000000', '1', '0.00', '0');
INSERT INTO `inv_stock_log` VALUES ('281', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-02-12 19:31:13.000000', '1', '0.00', '1');
INSERT INTO `inv_stock_log` VALUES ('282', '1', 'admin@gmail.com', 'Samsethy receives PO 10 box', 'receive', '2023-02-12 19:31:13.000000', '1', '0.00', '2');
INSERT INTO `inv_stock_log` VALUES ('283', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-02-12 19:41:14.000000', '1', '0.00', '1');
INSERT INTO `inv_stock_log` VALUES ('284', '1', 'admin@gmail.com', 'Samsethy receives PO 10 box', 'receive', '2023-02-12 19:41:14.000000', '1', '0.00', '2');
INSERT INTO `inv_stock_log` VALUES ('285', '1', 'admin@gmail.com', 'Samsethy receives PO 10 box', 'receive', '2023-02-13 07:51:37.000000', '1', '0.00', '3');
INSERT INTO `inv_stock_log` VALUES ('286', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-02-13 07:52:04.000000', '1', '0.00', '4');
INSERT INTO `inv_stock_log` VALUES ('287', '1', 'admin@gmail.com', 'Samsethy receives PO 10 box', 'receive', '2023-02-13 07:52:04.000000', '1', '0.00', '3');
INSERT INTO `inv_stock_log` VALUES ('288', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-02-13 07:58:52.000000', '1', '0.00', '4');
INSERT INTO `inv_stock_log` VALUES ('289', '1', 'admin@gmail.com', 'Samsethy receives PO 10 box', 'receive', '2023-02-13 07:58:52.000000', '1', '0.00', '3');
INSERT INTO `inv_stock_log` VALUES ('290', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-02-13 08:00:08.000000', '1', '0.00', '4');
INSERT INTO `inv_stock_log` VALUES ('291', '1', 'admin@gmail.com', 'Samsethy receives PO 10 box', 'receive', '2023-02-13 08:00:08.000000', '1', '0.00', '3');
INSERT INTO `inv_stock_log` VALUES ('292', '1', 'admin@gmail.com', 'Samsethy receives PO 10 box', 'receive', '2023-02-13 08:00:16.000000', '1', '0.00', '3');
INSERT INTO `inv_stock_log` VALUES ('293', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-02-13 08:00:31.000000', '1', '0.00', '4');
INSERT INTO `inv_stock_log` VALUES ('294', '1', 'admin@gmail.com', 'Samsethy receives PO 10 box', 'receive', '2023-02-13 08:00:31.000000', '1', '0.00', '3');
INSERT INTO `inv_stock_log` VALUES ('295', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-02-13 11:19:05.000000', '1', '0.00', '4');
INSERT INTO `inv_stock_log` VALUES ('296', '1', 'admin@gmail.com', 'Samsethy receives PO 10 box', 'receive', '2023-02-13 11:19:05.000000', '1', '0.00', '3');
INSERT INTO `inv_stock_log` VALUES ('297', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-04-08 09:33:21.000000', '1', '0.00', '5');
INSERT INTO `inv_stock_log` VALUES ('298', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-04-08 09:33:24.000000', '1', '0.00', '5');
INSERT INTO `inv_stock_log` VALUES ('299', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-04-08 09:33:25.000000', '1', '0.00', '5');
INSERT INTO `inv_stock_log` VALUES ('300', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-04-08 09:33:26.000000', '1', '0.00', '5');
INSERT INTO `inv_stock_log` VALUES ('301', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-04-08 09:34:33.000000', '1', '0.00', '5');
INSERT INTO `inv_stock_log` VALUES ('302', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-04-08 09:34:35.000000', '1', '0.00', '5');
INSERT INTO `inv_stock_log` VALUES ('303', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-04-08 12:21:45.000000', '1', '0.00', '5');
INSERT INTO `inv_stock_log` VALUES ('304', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-04-08 12:21:46.000000', '1', '0.00', '5');
INSERT INTO `inv_stock_log` VALUES ('305', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-04-08 12:21:47.000000', '1', '0.00', '5');
INSERT INTO `inv_stock_log` VALUES ('306', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-04-08 12:21:48.000000', '1', '0.00', '5');
INSERT INTO `inv_stock_log` VALUES ('307', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-04-08 12:21:49.000000', '1', '0.00', '5');
INSERT INTO `inv_stock_log` VALUES ('308', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-04-08 12:22:14.000000', '1', '0.00', '5');
INSERT INTO `inv_stock_log` VALUES ('309', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-04-08 12:22:20.000000', '1', '0.00', '5');
INSERT INTO `inv_stock_log` VALUES ('310', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-04-08 12:22:22.000000', '1', '0.00', '5');
INSERT INTO `inv_stock_log` VALUES ('311', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-04-08 12:22:23.000000', '1', '0.00', '5');
INSERT INTO `inv_stock_log` VALUES ('312', '1', 'admin@gmail.com', 'Samsethy receives PO 10 bottle', 'receive', '2023-04-08 12:23:00.000000', '1', '0.00', '5');
INSERT INTO `inv_stock_log` VALUES ('313', '1', 'admin@gmail.com', 'Samsethy receives PO 5 Bottle', 'receive', '2023-04-09 12:25:02.000000', '1', '0.00', '6');
INSERT INTO `inv_stock_log` VALUES ('314', '1', 'admin@gmail.com', 'Samsethy receives PO 10 Tube', 'receive', '2023-04-09 12:25:02.000000', '1', '0.00', '7');
INSERT INTO `inv_stock_log` VALUES ('315', '1', 'admin@gmail.com', 'Samsethy receives PO 5 Bottle', 'receive', '2023-04-09 12:26:14.000000', '1', '0.00', '6');
INSERT INTO `inv_stock_log` VALUES ('316', '1', 'admin@gmail.com', 'Samsethy receives PO 15 Bottle', 'receive', '2023-04-09 12:26:14.000000', '1', '0.00', '8');
INSERT INTO `inv_stock_log` VALUES ('317', '1', 'admin@gmail.com', 'Samsethy receives PO 10 Box', 'receive', '2023-04-10 11:10:31.000000', '1', '0.00', '9');
INSERT INTO `inv_stock_log` VALUES ('318', '1', 'admin@gmail.com', 'Samsethy receives PO 5 Box', 'receive', '2023-04-10 11:11:28.000000', '1', '0.00', '9');
INSERT INTO `inv_stock_log` VALUES ('319', '1', 'admin@gmail.com', 'Samsethy receives PO 7 Bottle', 'receive', '2023-04-10 11:19:15.000000', '1', '0.00', '10');
INSERT INTO `inv_stock_log` VALUES ('320', '1', 'admin@gmail.com', 'Samsethy receives PO 6 Bottle', 'receive', '2023-04-10 11:19:56.000000', '1', '0.00', '10');
INSERT INTO `inv_stock_log` VALUES ('321', '1', 'admin@gmail.com', 'Samsethy receives PO 5 Tube', 'receive', '2023-04-10 11:37:58.000000', '1', '0.00', '11');
INSERT INTO `inv_stock_log` VALUES ('322', '1', 'admin@gmail.com', 'Samsethy receives PO 5 Tablet', 'receive', '2023-04-10 11:41:40.000000', '1', '0.00', '12');
INSERT INTO `inv_stock_log` VALUES ('323', '1', 'admin@gmail.com', 'Samsethy receives PO 3 Tablet', 'receive', '2023-04-10 11:42:04.000000', '1', '0.00', '12');

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
  `description` varchar(100) DEFAULT NULL,
  `parent_unit_id` int(10) DEFAULT NULL,
  `branch_id` int(10) DEFAULT 0,
  `qty` decimal(10,2) DEFAULT 1.00,
  `create_uid` int(10) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `item_id` int(10) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_units
-- ----------------------------
INSERT INTO `inv_units` VALUES ('2', 'Bottle', 'Bottle', null, '1', '1.00', null, null, null, null, null, null, '0');
INSERT INTO `inv_units` VALUES ('3', 'Tube', 'Tube', null, '1', '1.00', null, null, null, null, null, null, '0');
INSERT INTO `inv_units` VALUES ('4', 'Tablet', 'Tablet', null, '1', '1.00', null, null, null, null, null, null, '0');
INSERT INTO `inv_units` VALUES ('5', 'Set', 'Set', null, '1', '1.00', null, null, null, null, null, null, '0');
INSERT INTO `inv_units` VALUES ('6', 'Pack', 'Pack', null, '1', '1.00', null, null, null, null, null, null, '0');
INSERT INTO `inv_units` VALUES ('7', 'Box', 'Box', null, '1', '1.00', null, null, null, null, null, null, '0');
INSERT INTO `inv_units` VALUES ('8', 'Vial', 'Vial', null, '1', '1.00', null, null, null, null, null, null, '0');
INSERT INTO `inv_units` VALUES ('9', 'FL', 'FL', null, '1', '1.00', null, null, null, null, null, null, '0');
INSERT INTO `inv_units` VALUES ('10', 'Amp', 'Amp', null, '1', '1.00', null, null, null, null, null, null, '0');
INSERT INTO `inv_units` VALUES ('11', 'pcs', 'pcs', null, '1', '1.00', null, null, null, null, null, null, '0');
INSERT INTO `inv_units` VALUES ('16', 'bottles', null, '17', '1', '20.00', '1', 'Samsethy', '2023-01-16 01:47:37.237984', '2023-01-16 01:47:37.000000', 'Samsethy', '1', '0');
INSERT INTO `inv_units` VALUES ('17', 'dd', null, null, '1', '1.00', '1', 'Samsethy', '2023-01-16 01:47:37.000000', null, null, null, '0');
INSERT INTO `inv_units` VALUES ('18', 'bottle', null, null, '1', '1.00', '1', 'Samsethy', '2023-01-16 10:59:45.000000', null, null, null, '0');
INSERT INTO `inv_units` VALUES ('19', 'pills', null, '18', '1', '20.00', '1', 'Samsethy', '2023-01-16 10:59:45.000000', null, null, null, '0');
INSERT INTO `inv_units` VALUES ('20', 'ss', null, null, '1', '1.00', '1', 'Samsethy', '2023-01-16 15:42:27.000000', null, null, null, '0');
INSERT INTO `inv_units` VALUES ('21', 'kg', null, null, '1', '1.00', '1', 'Samsethy', '2023-01-20 16:51:24.000000', null, null, null, '0');

-- ----------------------------
-- Table structure for `inv_warehouses`
-- ----------------------------
DROP TABLE IF EXISTS `inv_warehouses`;
CREATE TABLE `inv_warehouses` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `name` varchar(250) NOT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `address` varchar(250) DEFAULT NULL,
  `loc_lng` decimal(10,0) DEFAULT NULL,
  `loc_lat` decimal(10,0) DEFAULT NULL,
  `decription` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_warehouses
-- ----------------------------
INSERT INTO `inv_warehouses` VALUES ('1', '1', 'Default warehouse', '1', 'Admin', null, null, null, null, null, null, null, 'Default warehouse');

-- ----------------------------
-- Table structure for `inv_warehouse_summary`
-- ----------------------------
DROP TABLE IF EXISTS `inv_warehouse_summary`;
CREATE TABLE `inv_warehouse_summary` (
  `id` int(10) NOT NULL,
  `warehouse_id` int(10) NOT NULL,
  `branch_id` int(10) NOT NULL,
  `trx_date` date NOT NULL,
  `begin_qty` decimal(10,2) NOT NULL DEFAULT 0.00,
  `qty_in` decimal(10,2) NOT NULL DEFAULT 0.00,
  `auth_user` varchar(10) DEFAULT NULL,
  `auth_uid` int(10) DEFAULT NULL,
  `auth_time` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `qty_out` decimal(10,2) NOT NULL DEFAULT 0.00,
  `notes` varchar(250) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_uid` int(10) DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL,
  `item_id` int(10) DEFAULT NULL,
  `item_code` varchar(35) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_warehouse_summary
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
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
INSERT INTO `leads` VALUES ('50', 'AAAA', 'F', '012345345', '2', '1', 'Samsethy', null, null, '2023-01-19 18:17:04', null, '1', null);
INSERT INTO `leads` VALUES ('51', 'DDDD', 'F', '012454545', '2', '1', 'Samsethy', null, null, '2023-01-19 18:20:17', null, '1', null);
INSERT INTO `leads` VALUES ('52', 'GDGDGd', 'F', '0234456456', '2', '1', 'Samsethy', null, null, '2023-01-19 18:23:44', null, '1', null);
INSERT INTO `leads` VALUES ('53', 'dfgdfhf', 'F', '02334534543', '2', '1', 'Samsethy', null, null, '2023-01-19 18:25:34', null, '1', null);
INSERT INTO `leads` VALUES ('54', 'sadsfd', 'F', '012324332', '2', '1', 'Samsethy', null, null, '2023-01-19 18:34:05', null, '1', null);
INSERT INTO `leads` VALUES ('55', 'sdfgdgf', 'F', '02324', '2', '1', 'Samsethy', null, null, '2023-01-19 18:46:20', null, '1', null);
INSERT INTO `leads` VALUES ('56', 'dfdfg', 'F', 'sdffdg', '2', '1', 'Samsethy', null, null, '2023-01-19 18:47:01', null, '1', null);
INSERT INTO `leads` VALUES ('57', 'Sovanny', 'F', '012235456', '2', '1', 'Samsethy', null, null, '2023-02-22 05:01:38', null, '1', null);
INSERT INTO `leads` VALUES ('58', 'srey pov', 'F', '01255665', '2', '1', 'Samsethy', null, null, '2023-02-22 05:03:06', null, '1', null);
INSERT INTO `leads` VALUES ('59', 'jghjghjg', 'F', '012324235', '2', '1', 'Samsethy', null, null, '2023-02-22 06:45:25', null, '1', null);
INSERT INTO `leads` VALUES ('60', 'Dyna', 'F', '01325435', '2', '1', 'Samsethy', null, null, '2023-02-22 06:47:28', null, '1', null);
INSERT INTO `leads` VALUES ('61', 'Ggfdgdfhfd', 'F', '012435462', '2', '1', 'Samsethy', null, null, '2023-03-04 14:01:00', null, '1', null);
INSERT INTO `leads` VALUES ('62', 'BBBBBB', 'M', '023453463', '2', '1', 'Samsethy', null, null, '2023-03-04 14:03:37', null, '1', null);
INSERT INTO `leads` VALUES ('63', 'sdghfgfghgf', 'F', '024354354', '2', '1', 'Samsethy', null, null, '2023-03-04 16:01:42', null, '1', null);
INSERT INTO `leads` VALUES ('64', 'vikara one', 'F', '0102343321', '2', '1', 'Samsethy', null, null, '2023-03-04 16:24:06', null, '1', null);
INSERT INTO `leads` VALUES ('65', 'sfdgdfgfdhg', 'F', '0125654765', '2', '1', 'Samsethy', null, null, '2023-03-04 17:18:00', null, '1', null);
INSERT INTO `leads` VALUES ('66', 'sdfgdgf', 'F', '02324324325', '2', '1', 'Samsethy', null, null, '2023-03-04 17:36:32', null, '1', null);
INSERT INTO `leads` VALUES ('67', '012423554', 'F', '0124235345', '2', '1', 'Samsethy', null, null, '2023-03-04 18:11:49', null, '1', null);
INSERT INTO `leads` VALUES ('68', 'sdvsdg', 'M', '023234235', '2', '1', 'Samsethy', null, null, '2023-03-04 18:28:25', null, '1', null);
INSERT INTO `leads` VALUES ('69', 'sdghfrtj', 'M', '023235346', '2', '1', 'Samsethy', null, null, '2023-03-04 19:03:54', null, '1', null);
INSERT INTO `leads` VALUES ('70', 'sdfsfgdgdfgdfghfh', 'M', '012324354', '2', '1', 'Samsethy', null, null, '2023-03-04 19:15:50', null, '1', null);
INSERT INTO `leads` VALUES ('71', 'sdfdgdfhfg', 'F', '01265weer', '2', '1', 'Samsethy', null, null, '2023-03-05 10:21:40', null, '1', null);
INSERT INTO `leads` VALUES ('72', 'JOYFUL', 'F', '0122354345', '2', '1', 'Samsethy', null, null, '2023-03-06 11:25:27', null, '1', null);
INSERT INTO `leads` VALUES ('73', 'JOY of the day', 'F', '012436', '2', '1', 'Samsethy', null, null, '2023-03-06 11:27:46', null, '1', null);
INSERT INTO `leads` VALUES ('74', 'HHHHH', 'F', '01233254346', '2', '1', 'Samsethy', null, null, '2023-03-06 11:29:03', null, '1', null);
INSERT INTO `leads` VALUES ('75', 'DSfdghfdhfgh', 'F', '01232434546', '2', '1', 'Samsethy', null, null, '2023-03-06 11:30:06', null, '1', null);
INSERT INTO `leads` VALUES ('76', 'Daravan', 'F', '012435455', '2', '1', 'Samsethy', null, null, '2023-03-06 11:36:13', null, '1', null);
INSERT INTO `leads` VALUES ('77', 'HKKK', 'F', '012456575', '2', '1', 'Samsethy', null, null, '2023-03-06 14:00:34', null, '1', null);
INSERT INTO `leads` VALUES ('78', 'Sin Sophana', 'F', '0234565756', '2', '1', 'Samsethy', null, null, '2023-03-06 14:15:22', null, '1', null);
INSERT INTO `leads` VALUES ('79', 'Solika', 'F', '012464565', '2', '1', 'Samsethy', null, null, '2023-03-06 14:30:59', null, '1', null);
INSERT INTO `leads` VALUES ('80', 'Dyna', 'F', '023546657567', '2', '1', 'Samsethy', null, null, '2023-03-06 15:29:32', null, '1', null);
INSERT INTO `leads` VALUES ('81', 'Gonna', 'F', '0123543546', '2', '1', 'Samsethy', null, null, '2023-03-06 16:20:07', null, '1', null);
INSERT INTO `leads` VALUES ('82', 'GGG', 'F', '011255671', '2', '1', 'Samsethy', null, null, '2023-03-21 03:10:55', null, '1', null);
INSERT INTO `leads` VALUES ('83', 'Sopheara', 'F', '0112226735', '2', '1', 'Samsethy', null, null, '2023-04-04 16:29:28', null, '1', null);
INSERT INTO `leads` VALUES ('84', 'New girl', 'F', '012555555', '2', '1', 'Samsethy', null, null, '2023-04-08 22:09:57', null, '1', null);
INSERT INTO `leads` VALUES ('85', 'Sopan', 'F', '01167661', '2', '1', 'Samsethy', null, null, '2023-04-08 22:16:07', null, '1', null);
INSERT INTO `leads` VALUES ('86', 'GGG', 'M', '01111111', '2', '1', 'Samsethy', null, null, '2023-04-08 22:19:10', null, '1', null);
INSERT INTO `leads` VALUES ('87', 'KKK', 'F', '022898989', '2', '1', 'Samsethy', null, null, '2023-04-08 22:23:43', null, '1', null);
INSERT INTO `leads` VALUES ('88', 'KLKLK', 'F', '02278989', '2', '1', 'Samsethy', null, null, '2023-04-08 22:26:56', null, '1', null);
INSERT INTO `leads` VALUES ('89', 'fdhfg', 'M', '0123324', '2', '1', 'Samsethy', null, null, '2023-04-08 22:29:26', null, '1', null);
INSERT INTO `leads` VALUES ('90', 'dsfgdg', 'F', '0132221341', '2', '1', 'Samsethy', null, null, '2023-04-08 22:31:08', null, '1', null);
INSERT INTO `leads` VALUES ('91', 'dsgfd', 'F', '6547658', '2', '1', 'Samsethy', null, null, '2023-04-08 22:37:52', null, '1', null);
INSERT INTO `leads` VALUES ('92', 'Sinara', 'F', '01111221', '2', '1', 'Samsethy', null, null, '2023-04-08 22:39:03', null, '1', null);
INSERT INTO `leads` VALUES ('93', 'Sotheara', 'F', '015556765', '2', '1', 'Samsethy', null, null, '2023-04-08 22:55:02', null, '1', null);
INSERT INTO `leads` VALUES ('94', 'DGdfgdfgfdh', 'F', '01146456', '2', '1', 'Samsethy', null, null, '2023-04-09 10:13:52', null, '1', null);
INSERT INTO `leads` VALUES ('95', 'Some one A', 'F', '011456456', '2', '1', 'Samsethy', null, null, '2023-04-09 15:43:10', null, '1', null);

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
  `create_uid` int(11) DEFAULT NULL,
  `update_uid` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_date` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `loc_cities_country_id_foreign` (`country_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of loc_cities
-- ----------------------------
INSERT INTO `loc_cities` VALUES ('13', '14', 'ក្រុងភ្នំពេញ', 'ក្រុងភ្នំពេញ', 'Puthea', '2021-11-22 06:45:27', null, '1', null, null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_cities` VALUES ('14', '15', 'Bangkok', 'Bangkok', 'admin@gmail.com', '2022-04-20 09:41:06', null, '1', null, null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48', '2023-03-28 00:22:48');

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
  `update_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `create_uid` int(11) DEFAULT NULL,
  `update_uid` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `loc_communes_country_id_foreign` (`country_id`),
  KEY `loc_communes_city_id_foreign` (`city_id`),
  KEY `loc_communes_district_id_foreign` (`district_id`)
) ENGINE=InnoDB AUTO_INCREMENT=152 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of loc_communes
-- ----------------------------
INSERT INTO `loc_communes` VALUES ('57', '14', '13', '37', 'ទន្លេបាសាក់', '1', 'ទន្លេបាសាក់', null, 'Puthea', '2021-11-22 06:57:18', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('58', '14', '13', '37', 'បឹងកេងកងទី ១', '1', 'បឹងកេងកងទី ១', null, 'Puthea', '2021-11-22 07:00:18', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('59', '14', '13', '37', 'បឹងកេងកងទី ២', '1', 'បឹងកេងកងទី ២', null, 'Puthea', '2021-11-22 07:00:30', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('60', '14', '13', '37', 'បឹងកេងកងទី ៣', '1', 'បឹងកេងកងទី ៣', null, 'Puthea', '2021-11-22 07:00:53', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('61', '14', '13', '37', 'អូឡាំពិក', '1', 'អូឡាំពិក', null, 'Puthea', '2021-11-22 07:01:34', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('62', '14', '13', '37', 'ទួលស្វាយព្រៃទី ១', '1', 'ទួលស្វាយព្រៃទី ១', null, 'Puthea', '2021-11-22 07:01:53', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('63', '14', '13', '37', 'ទួលស្វាយព្រៃទី ២', '1', 'ទួលស្វាយព្រៃទី ២', null, 'Puthea', '2021-11-22 07:02:08', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('64', '14', '13', '37', 'ទំនប់ទឹក', '1', 'ទំនប់ទឹក', null, 'Puthea', '2021-11-22 07:02:24', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('65', '14', '13', '37', 'ទួលទំពូងទី២', '1', 'ទួលទំពូងទី២', null, 'Puthea', '2021-11-22 07:02:38', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('66', '14', '13', '37', 'ទួលទំពូងទី១', '1', 'ទួលទំពូងទី១', null, 'Puthea', '2021-11-22 07:02:51', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('67', '14', '13', '37', 'បឹងត្របែក', '1', 'បឹងត្របែក', null, 'Puthea', '2021-11-22 07:03:03', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('68', '14', '13', '37', 'ផ្សាដើមថ្កូវ', '1', 'ផ្សាដើមថ្កូវ', null, 'Puthea', '2021-11-22 07:03:13', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('69', '14', '13', '38', 'ដង្កោ', '1', 'ដង្កោ', null, 'Puthea', '2021-11-22 22:33:12', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('70', '14', '13', '38', 'ពងទឹក', '1', 'ពងទឹក', null, 'Puthea', '2021-11-22 22:34:15', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('71', '14', '13', '38', 'ព្រៃវែង', '1', 'ព្រៃវែង', null, 'Puthea', '2021-11-22 22:34:27', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('72', '14', '13', '38', 'ព្រៃស', '1', 'ព្រៃស', null, 'Puthea', '2021-11-22 22:34:45', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('73', '14', '13', '38', 'ក្រាំងពង្រ', '1', 'ក្រាំងពង្រ', null, 'Puthea', '2021-11-22 22:34:54', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('74', '14', '13', '38', 'ប្រទះឡាង', '1', 'ប្រទះឡាង', null, 'Puthea', '2021-11-22 22:35:11', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('75', '14', '13', '38', 'សាក់សំពៅ', '1', 'សាក់សំពៅ', null, 'Puthea', '2021-11-22 22:35:23', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('76', '14', '13', '38', 'ជយ័ជំនះ', '1', 'ជយ័ជំនះ', null, 'Puthea', '2021-11-22 22:35:34', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('77', '14', '13', '38', 'ផ្សាចាស់', '1', 'ផ្សាចាស់', null, 'Puthea', '2021-11-22 22:35:54', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('78', '14', '13', '38', 'វត្តភ្នំ', '1', 'វត្តភ្នំ', null, 'Puthea', '2021-11-22 22:36:09', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('79', '14', '13', '39', 'ផ្សាដេប៉ូទី១', '1', 'ផ្សាដេប៉ូទី១', null, 'Puthea', '2021-11-22 22:37:43', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('80', '14', '13', '39', 'ផ្សាដេប៉ូទី២', '1', 'ផ្សាដេប៉ូទី២', null, 'Puthea', '2021-11-22 22:48:19', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('81', '14', '13', '39', 'ផ្សាដេប៉ូទី៣', '1', 'ផ្សាដេប៉ូទី៣', null, 'Puthea', '2021-11-22 22:48:31', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('82', '14', '13', '39', 'ទឹកល្អក់ទី១', '1', 'ទឹកល្អក់ទី១', null, 'Puthea', '2021-11-22 22:48:43', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('83', '14', '13', '39', 'ទឹកល្អក់ទី២', '1', 'ទឹកល្អក់ទី២', null, 'Puthea', '2021-11-22 22:48:55', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('84', '14', '13', '39', 'ទឹកល្អក់ទី៣', '1', 'ទឹកល្អក់ទី៣', null, 'Puthea', '2021-11-22 22:49:06', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('85', '14', '13', '39', 'បឹងកក់ទី១', '1', 'បឹងកក់ទី១', null, 'Puthea', '2021-11-22 22:49:17', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('86', '14', '13', '39', 'ជើងអែក', '1', 'ជើងអែក', null, 'Puthea', '2021-11-22 22:49:53', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('87', '14', '13', '39', 'គងនយ', '1', 'គងនយ', null, 'Puthea', '2021-11-22 22:50:06', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('88', '14', '13', '39', 'ព្រែកកំពឹស', '1', 'ព្រែកកំពឹស', null, 'Puthea', '2021-11-22 22:50:16', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('89', '14', '13', '39', 'រលួស', '1', 'រលួស', null, 'Puthea', '2021-11-22 22:50:27', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('90', '14', '13', '39', 'ស្ពានថ្ម', '1', 'ស្ពានថ្ម', null, 'Puthea', '2021-11-22 22:50:39', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('91', '14', '13', '39', 'ទៀន', '1', 'ទៀន', null, 'Puthea', '2021-11-22 22:50:53', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('92', '14', '13', '40', 'អូឬស្សីទី១', '1', 'អូឬស្សីទី១', null, 'Puthea', '2021-11-22 22:51:40', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('93', '14', '13', '40', 'អូឬស្សីទី៣', '1', 'អូឬស្សីទី៣', null, 'Puthea', '2021-11-22 22:52:11', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('94', '14', '13', '40', 'អូឬស្សីទី៤', '1', 'អូឬស្សីទី៤', null, 'Puthea', '2021-11-22 22:52:11', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('95', '14', '13', '40', 'មនោរម្យ', '1', 'មនោរម្យ', null, 'Puthea', '2021-11-22 22:52:23', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('96', '14', '13', '40', 'មិត្តភាព', '1', 'មិត្តភាព', null, 'Puthea', '2021-11-22 22:52:32', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('97', '14', '13', '40', 'វាលវង់', '1', 'វាលវង់', null, 'Puthea', '2021-11-22 22:52:41', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('98', '14', '13', '40', 'បឹងព្រលិត', '1', 'បឹងព្រលិត', null, 'Puthea', '2021-11-22 22:52:51', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('99', '14', '13', '41', 'ទួលសង្កែ', '1', 'ទួលសង្កែ', null, 'Puthea', '2021-11-22 22:53:08', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('100', '14', '13', '41', 'ស្វាយប៉ាក', '1', 'ស្វាយប៉ាក', null, 'Puthea', '2021-11-22 22:53:21', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('101', '14', '13', '41', 'គីឡូម៉ែតលេខ៦', '1', 'គីឡូម៉ែតលេខ៦', null, 'Puthea', '2021-11-22 22:53:32', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('102', '14', '13', '41', 'ឬស្សីកែង', '1', 'ឬស្សីកែង', null, 'Puthea', '2021-11-22 22:53:43', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('103', '14', '13', '41', 'ច្រាំងចំរេះទី១', '1', 'ច្រាំងចំរេះទី១', null, 'Puthea', '2021-11-22 22:53:53', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('104', '14', '13', '41', 'ច្រាំងចំរេះទី២', '1', 'ច្រាំងចំរេះទី២', null, 'Puthea', '2021-11-22 22:54:03', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('105', '14', '13', '42', 'ភ្នំពេញថ្មី', '1', 'ភ្នំពេញថ្មី', null, 'Puthea', '2021-11-22 22:54:23', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('106', '14', '13', '42', 'ទឹកថ្លា', '1', 'ទឹកថ្លា', null, 'Puthea', '2021-11-22 22:54:34', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('107', '14', '13', '42', 'ឈ្នួល', '1', 'ឈ្នួល', null, 'Puthea', '2021-11-22 22:54:47', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('108', '14', '13', '42', 'ក្រាំងថ្នង់', '1', 'ក្រាំងថ្នង់', null, 'Puthea', '2021-11-22 22:55:00', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('109', '14', '13', '43', 'ត្រពាំងក្រសាំង', '1', 'ត្រពាំងក្រសាំង', null, 'Puthea', '2021-11-22 22:55:24', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('110', '14', '13', '43', 'ភ្លើងឆេះរទិះ', '1', 'ភ្លើងឆេះរទិះ', null, 'Puthea', '2021-11-22 22:55:43', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('111', '14', '13', '43', 'ចោមចៅ', '1', 'ចោមចៅ', null, 'Puthea', '2021-11-22 22:55:43', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('112', '14', '13', '43', 'កាកាប', '1', 'កាកាប', null, 'Puthea', '2021-11-22 22:55:52', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('113', '14', '13', '43', 'សំរោងក្រោម', '1', 'សំរោងក្រោម', null, 'Puthea', '2021-11-22 22:56:02', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('114', '14', '13', '43', 'បឹងធំ', '1', 'បឹងធំ', null, 'Puthea', '2021-11-22 22:56:11', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('115', '14', '13', '43', 'កំបូល', '1', 'កំបូល', null, 'Puthea', '2021-11-22 22:56:22', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('116', '14', '13', '43', 'កន្ទោក', '1', 'កន្ទោក', null, 'Puthea', '2021-11-22 22:56:32', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('117', '14', '13', '43', 'ឪឡោក', '1', 'ឪឡោក', null, 'Puthea', '2021-11-22 22:56:42', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('118', '14', '13', '43', 'ស្នើរ', '1', 'ស្នើរ', null, 'Puthea', '2021-11-22 22:56:51', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('119', '14', '13', '44', 'ព្រែកភ្នៅ', '1', 'ព្រែកភ្នៅ', null, 'Puthea', '2021-11-22 22:57:08', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('120', '14', '13', '44', 'ពញាពន់', '1', 'ពញាពន់', null, 'Puthea', '2021-11-22 22:57:18', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('121', '14', '13', '44', 'សំរោង', '1', 'សំរោង', null, 'Puthea', '2021-11-22 22:57:27', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('122', '14', '13', '44', 'គោករកា', '1', 'គោករកា', null, 'Puthea', '2021-11-22 22:57:38', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('123', '14', '13', '44', 'កន្សែង', '1', 'កន្សែង', null, 'Puthea', '2021-11-22 22:57:47', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('124', '14', '13', '45', 'ផ្សារថ្មីទី១', '1', 'ផ្សារថ្មីទី១', null, 'Puthea', '2021-11-22 22:58:06', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('125', '14', '13', '45', 'ផ្សារថ្មីទី២', '1', 'ផ្សារថ្មីទី២', null, 'Puthea', '2021-11-22 22:58:18', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('126', '14', '13', '45', 'ផ្សារថ្មីទី៣', '1', 'ផ្សារថ្មីទី៣', null, 'Puthea', '2021-11-22 22:58:34', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('127', '14', '13', '45', 'បឹងរាំង', '1', 'បឹងរាំង', null, 'Puthea', '2021-11-22 22:58:45', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('128', '14', '13', '45', 'ផ្សាកណ្ដាលទី១', '1', 'ផ្សាកណ្ដាលទី១', null, 'Puthea', '2021-11-22 22:58:54', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('129', '14', '13', '45', 'ផ្សាកណ្ដាលទី២', '1', 'ផ្សាកណ្ដាលទី២', null, 'Puthea', '2021-11-22 22:59:03', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('130', '14', '13', '45', 'ចតុមុខ', '1', 'ចតុមុខ', null, 'Puthea', '2021-11-22 22:59:17', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('131', '14', '13', '46', 'ស្ទឹងមានជយ័', '1', 'ស្ទឹងមានជយ័', null, 'Puthea', '2021-11-22 22:59:50', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('132', '14', '13', '46', 'បឹងទំពុន', '1', 'បឹងទំពុន', null, 'Puthea', '2021-11-22 23:00:01', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('133', '14', '13', '46', 'ចាក់អង្រែលើ', '1', 'ចាក់អង្រែលើ', null, 'Puthea', '2021-11-22 23:00:10', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('134', '14', '13', '46', 'ចាក់អង្រែក្រោម', '1', 'ចាក់អង្រែក្រោម', null, 'Puthea', '2021-11-22 23:00:21', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('136', '14', '13', '47', 'ព្រែកលាប', '1', 'ព្រែកលាប', null, 'Puthea', '2021-11-22 23:00:50', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('137', '14', '13', '47', 'ព្រែកតាសេក', '1', 'ព្រែកតាសេក', null, 'Puthea', '2021-11-22 23:01:09', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('138', '14', '13', '47', 'កោះដាច់', '1', 'កោះដាច់', null, 'Puthea', '2021-11-22 23:01:09', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('139', '14', '13', '47', 'បាក់ខែង', '1', 'បាក់ខែង', null, 'Puthea', '2021-11-22 23:02:59', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('140', '14', '13', '48', 'ច្បាអំពៅទី១', '1', 'ច្បាអំពៅទី១', null, 'Puthea', '2021-11-22 23:03:49', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('141', '14', '13', '48', 'ច្បាអំពៅទី២', '1', 'ច្បាអំពៅទី២', null, 'Puthea', '2021-11-22 23:03:59', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('142', '14', '13', '48', 'និរោធ', '1', 'និរោធ', null, 'Puthea', '2021-11-22 23:04:09', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('143', '14', '13', '48', 'ព្រែកប្រា', '1', 'ព្រែកប្រា', null, 'Puthea', '2021-11-22 23:04:29', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('144', '14', '13', '48', 'វាលស្បូវ', '1', 'វាលស្បូវ', null, 'Puthea', '2021-11-22 23:04:30', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('145', '14', '13', '48', 'ព្រែកអែង', '1', 'ព្រែកអែង', null, 'Puthea', '2021-11-22 23:04:51', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('146', '14', '13', '48', 'ក្បាលកោះ', '1', 'ក្បាលកោះ', null, 'Puthea', '2021-11-22 23:05:05', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('147', '14', '13', '38', 'ស្រះចក', '1', 'ស្រះចក', null, 'Puthea', '2021-11-22 23:08:13', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('148', '14', '13', '40', 'អូឬស្សីទី២', '1', 'អូឬស្សីទី២', null, 'Puthea', '2021-11-22 23:10:43', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('149', '14', '13', '48', 'ព្រែកថ្មី', '1', 'ព្រែកថ្មី', null, 'Puthea', '2021-11-22 23:13:40', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('150', '14', '13', '47', 'ជ្រោយចង្វារ', '1', 'ជ្រោយចង្វារ', null, 'Puthea', '2021-11-24 03:20:41', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_communes` VALUES ('151', '14', '13', '39', 'Kabol', '1', 'Kabol', null, 'admin@gmail.com', '2021-12-24 08:45:20', '2023-03-28 00:22:48', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48');

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
  `create_uid` int(11) DEFAULT NULL,
  `update_uid` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_date` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of loc_countries
-- ----------------------------
INSERT INTO `loc_countries` VALUES ('14', 'Cambodia', 'Cambodia', 'Puthea', '2021-11-22 06:30:12', '1', null, 'Cambodia', null, null, '2023-03-28 00:22:47', '2023-03-28 00:22:47', '2023-03-28 00:22:48');
INSERT INTO `loc_countries` VALUES ('15', 'Thailand', 'Thailand', 'admin@gmail.com', '2022-04-20 09:40:50', '1', null, 'Thailand', null, null, '2023-03-28 00:22:47', '2023-03-28 00:22:47', '2023-03-28 00:22:48');

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
  `create_uid` int(11) DEFAULT NULL,
  `update_uid` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_date` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `loc_districts_city_id_foreign` (`city_id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of loc_districts
-- ----------------------------
INSERT INTO `loc_districts` VALUES ('35', '12', 'ខណ្ឌចំការមន', 'ខណ្ឌចំការមន', 'Puthea', '2021-11-22 06:40:17', null, '1', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_districts` VALUES ('36', '12', 'ខណ្ឌ័ដង្កោ', 'ខណ្ឌ័ដង្កោ', 'Puthea', '2021-11-22 06:40:59', null, '1', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_districts` VALUES ('37', '13', 'ខណ្ឌ័ចំការមន', 'ខណ្ឌ័ចំការមន', 'Sopha', '2021-11-22 06:42:11', null, '1', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_districts` VALUES ('38', '13', 'ខណ្ឌ័ដង្កោ', 'ខណ្ឌ័ដង្កោ', 'Sopha', '2021-11-22 06:42:27', null, '1', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_districts` VALUES ('39', '13', 'ខណ្ឌ័ទួលគក', 'ខណ្ឌ័ទួលគក', 'Puthea', '2021-11-22 06:44:55', null, '1', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_districts` VALUES ('40', '13', 'ខណ្ឌ័៧មករា', 'ខណ្ឌ័៧មករា', 'Puthea', '2021-11-22 06:49:35', null, '1', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_districts` VALUES ('41', '13', 'ខណ្ឌ័ឬស្សីកែវ', 'ខណ្ឌ័ឬស្សីកែវ', 'Puthea', '2021-11-22 06:50:18', null, '1', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_districts` VALUES ('42', '13', 'ខណ្ឌ័សែនសុខ', 'ខណ្ឌ័សែនសុខ', 'Puthea', '2021-11-22 06:50:40', null, '1', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_districts` VALUES ('43', '13', 'ខណ្ឌ័ពោសែនជយ័', 'ខណ្ឌ័ពោសែនជយ័', 'Puthea', '2021-11-22 06:50:54', null, '1', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_districts` VALUES ('44', '13', 'ខណ្ឌ័ព្រែកភ្នៅ', 'ខណ្ឌ័ព្រែកភ្នៅ', 'Puthea', '2021-11-22 06:51:16', null, '1', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_districts` VALUES ('45', '13', 'ខណ្ឌ័ដូនពេញ', 'ខណ្ឌ័ដូនពេញ', 'Puthea', '2021-11-22 06:51:37', null, '1', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_districts` VALUES ('46', '13', 'ខណ្ឌ័មានជយ័', 'ខណ្ឌ័មានជយ័', 'Puthea', '2021-11-22 06:51:58', null, '1', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_districts` VALUES ('47', '13', 'ខណ្ឌ័ជ្រោយចង្វារ', 'ខណ្ឌ័ជ្រោយចង្វារ', 'Puthea', '2021-11-22 06:52:15', null, '1', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48', '2023-03-28 00:22:48');
INSERT INTO `loc_districts` VALUES ('48', '13', 'ខណ្ឌ័ច្បាអំពៅ', 'ខណ្ឌ័ច្បាអំពៅ', 'Puthea', '2021-11-22 06:52:32', null, '1', null, null, '2023-03-28 00:22:48', '2023-03-28 00:22:48', '2023-03-28 00:22:48');

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
-- Table structure for `medical_services`
-- ----------------------------
DROP TABLE IF EXISTS `medical_services`;
CREATE TABLE `medical_services` (
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
  `price` decimal(10,2) DEFAULT 0.00,
  `currency_code` varchar(10) DEFAULT 'USD',
  `cost` decimal(10,2) DEFAULT 0.00,
  `department_id` int(10) NOT NULL,
  `treatment_method` varchar(25) DEFAULT '' COMMENT 'treatment_type ={non-surgery,minor suregery,surgery}',
  `service_type` varchar(25) DEFAULT 'treatment' COMMENT 'service_type = {treatment, labo,consultation,loyalty package}',
  `tax_rate` decimal(10,2) DEFAULT 0.00,
  `sku` varchar(15) DEFAULT 'none',
  `category_id` int(10) DEFAULT 1 COMMENT 'category_id => 1=regular sevice, 2=consultation, 3=loyalty package, 4 = treatment service, 5 = labo',
  `is_package` tinyint(4) DEFAULT 0,
  `invoice_item_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of medical_services
-- ----------------------------
INSERT INTO `medical_services` VALUES ('1', '1', 'Skin cleaning', 'Skin cleaning', '1', 'Admin', '2023-01-06 17:22:21.590731', '2023-01-06 17:22:21.590731', null, null, '0.00', 'USD', '0.00', '0', null, 'treatment', '0.00', 'none', '1', '0', null);
INSERT INTO `medical_services` VALUES ('9', '1', 'Facial treatment', 'Facial treatment', '1', 'Samsethy', '2023-04-09 19:12:02.088480', '2023-04-09 19:12:02.000000', 'Samsethy', '1', null, 'USD', null, '1', 'none', 'consultation', '0.00', 'none', '1', '0', null);
INSERT INTO `medical_services` VALUES ('10', '1', 'Mole removal', 'Facial treatment', '1', 'Samsethy', '2023-04-09 19:12:05.276872', '2023-04-09 19:12:05.000000', 'Samsethy', '1', null, 'USD', null, '1', 'none', 'consultation', '0.00', 'none', '1', '0', null);
INSERT INTO `medical_services` VALUES ('11', '1', 'Skin whitening Natural', 'Facial treatment', '1', 'Samsethy', '2023-01-09 16:57:25.187427', '2023-01-09 16:57:25.000000', 'Samsethy', '1', '10.00', 'USD', null, '1', 'nonsurgery', 'treatment', '0.00', 'none', '1', '0', null);
INSERT INTO `medical_services` VALUES ('22', '1', 'Body message', 'Facial treatment', '1', 'Samsethy', '2023-01-09 16:57:06.508011', '2023-01-09 16:57:06.000000', 'Samsethy', '1', null, 'USD', null, '1', 'nonsurgery', 'treatment', '0.00', 'none', '1', '0', null);
INSERT INTO `medical_services` VALUES ('27', '1', 'Blood test', 'Blood test', '1', 'Samsethy', '2023-01-07 00:23:42.000000', null, null, null, null, 'USD', null, '1', 'nonsurgery', 'labo', '0.00', 'none', '1', '0', null);
INSERT INTO `medical_services` VALUES ('28', '1', 'Medical Consultation', 'Medical Consultation', '1', 'Samsethy', '2023-02-22 09:50:07.603905', '2023-02-22 09:50:07.000000', 'Samsethy', '1', null, 'USD', null, '1', 'none', 'consultation', '0.00', 'none', '1', '0', null);
INSERT INTO `medical_services` VALUES ('32', '1', 'Urine test', 'Urine test', '1', 'Samsethy', '2023-04-05 19:46:30.981386', '2023-04-05 19:46:30.981386', 'Samsethy', '1', '50.00', 'USD', null, '12', 'none', 'labo', '0.00', 'none', '1', '0', null);
INSERT INTO `medical_services` VALUES ('33', '1', 'Blood test special', 'special test', '1', 'Samsethy', '2023-03-10 12:38:00.000000', null, null, null, '15.00', 'USD', null, '12', 'none', 'labo', '0.00', 'none', '1', '0', null);
INSERT INTO `medical_services` VALUES ('35', '1', 'Package 1', 'dfdsgsgd', '1', 'Samsethy', '2023-04-09 22:27:18.000000', null, null, null, '230.00', 'USD', '0.00', '0', '', 'treatment', '0.00', 'none', '3', '1', null);
INSERT INTO `medical_services` VALUES ('36', '1', 'Pakce 555', '1', '1', 'Samsethy', '2023-04-09 23:13:22.000000', null, null, null, '150.00', 'USD', '0.00', '0', '', 'treatment', '0.00', 'none', '3', '1', null);
INSERT INTO `medical_services` VALUES ('37', '1', 'Super Promotion Plan', 'This is great opportunity', '1', 'Samsethy', '2023-04-09 23:34:19.545597', '2023-04-09 23:34:19.000000', 'Samsethy', '1', '160.00', 'USD', '0.00', '0', '', 'treatment', '0.00', 'none', '3', '1', null);
INSERT INTO `medical_services` VALUES ('38', '1', 'AAAAA', 'dfdg', '1', 'Samsethy', '2023-04-09 23:45:44.887138', '2023-04-09 23:45:44.000000', 'Samsethy', '1', '350.00', 'USD', '0.00', '0', '', 'treatment', '0.00', 'none', '3', '1', null);

-- ----------------------------
-- Table structure for `migrations`
-- ----------------------------
DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
INSERT INTO `migrations` VALUES ('14', '2022_12_23_233609_create_db', '1');
INSERT INTO `migrations` VALUES ('15', '2022_12_23_233609_create_db', '1');
INSERT INTO `migrations` VALUES ('16', '2022_12_23_233609_create_db', '1');
INSERT INTO `migrations` VALUES ('17', '2022_12_23_233609_create_db', '1');
INSERT INTO `migrations` VALUES ('18', '2022_12_23_233609_create_db', '1');

-- ----------------------------
-- Table structure for `partners`
-- ----------------------------
DROP TABLE IF EXISTS `partners`;
CREATE TABLE `partners` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `name` varchar(250) NOT NULL,
  `address` varchar(350) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone_number` varchar(50) DEFAULT NULL,
  `phone_number1` varchar(50) DEFAULT NULL,
  `partner_type` varchar(25) DEFAULT 'institution' COMMENT 'partner_type = {person,institution}',
  `create_user` varchar(50) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_uid` int(6) DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL,
  `person_id` int(10) DEFAULT NULL,
  `cp_name` varchar(100) DEFAULT NULL,
  `cp_phone_number` varchar(100) DEFAULT NULL,
  `cp_email` varchar(100) DEFAULT NULL,
  `status_id` int(11) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of partners
-- ----------------------------
INSERT INTO `partners` VALUES ('1', '1', 'Biomed', 'fdsgfgfdg', null, '012345345', null, 'institution', 'Samsethy', '1', '2023-03-10 10:55:20.103175', '2023-03-10 10:55:20.000000', '1', 'Samsethy', null, 'some one', '012345345', null, '1');
INSERT INTO `partners` VALUES ('4', '1', 'Super Lab', null, null, '012345345', null, 'institution', 'Samsethy', '1', '2023-03-10 17:36:06.879696', '2023-03-10 17:36:06.000000', '1', 'Samsethy', null, 'some one', '012345345', null, '1');
INSERT INTO `partners` VALUES ('6', '1', 'ABD Lab', null, 'dsds', '012345345', null, 'institution', 'Samsethy', '1', '2023-02-03 14:45:44.000000', null, null, null, null, 'someone', '0122234234', null, '1');

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
  `photo_file_name` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo_file_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `billing_address` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=129 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of patients
-- ----------------------------
INSERT INTO `patients` VALUES ('73', '1', '1', '53', 'P100055', 'Samsethy', '1', '2022-12-04 13:40:21', null, null, null, null, 'OPD', null, null, null);
INSERT INTO `patients` VALUES ('74', '1', '1', '54', 'P100058', 'Samsethy', '1', '2022-12-04 13:41:53', null, null, null, null, 'OPD', null, null, null);
INSERT INTO `patients` VALUES ('75', '1', '1', '55', 'P100059', 'Samsethy', '1', '2022-12-04 14:09:38', null, null, null, null, 'OPD', null, null, null);
INSERT INTO `patients` VALUES ('76', '1', '1', '56', 'P100061', 'Samsethy', '1', '2022-12-06 12:01:00', null, null, null, null, 'OPD', null, null, null);
INSERT INTO `patients` VALUES ('77', '1', '1', '57', 'P100062', 'Samsethy', '1', '2022-12-06 12:02:15', null, null, null, null, 'OPD', null, null, null);
INSERT INTO `patients` VALUES ('114', '1', '1', '113', 'P100107', 'Samsethy', '1', '2023-03-06 14:15:52', null, null, null, null, 'OPD', null, null, null);
INSERT INTO `patients` VALUES ('115', '1', '1', '114', 'P100108', 'Samsethy', '1', '2023-03-06 14:31:31', null, null, null, null, 'OPD', null, null, null);
INSERT INTO `patients` VALUES ('116', '1', '1', '73', 'P100109', 'Samsethy', '1', '2023-03-06 15:05:57', null, null, null, null, 'OPD', null, null, null);
INSERT INTO `patients` VALUES ('117', '1', '1', '66', 'P100110', 'Samsethy', '1', '2023-03-06 15:25:23', null, null, null, null, 'OPD', null, null, null);
INSERT INTO `patients` VALUES ('118', '1', '1', '115', 'P100111', 'Samsethy', '1', '2023-03-06 15:29:47', null, null, null, null, 'OPD', null, null, null);
INSERT INTO `patients` VALUES ('119', '1', '1', '116', 'P100112', 'Samsethy', '1', '2023-03-06 16:20:43', null, null, null, null, 'OPD', null, null, null);
INSERT INTO `patients` VALUES ('120', '1', '1', '118', 'P100113', 'Samsethy', '1', '2023-03-21 03:32:25', null, null, null, null, 'OPD', null, null, null);
INSERT INTO `patients` VALUES ('121', '1', '1', '119', 'P100114', 'Samsethy', '1', '2023-03-31 12:45:55', null, null, null, null, 'OPD', null, null, null);
INSERT INTO `patients` VALUES ('122', '1', '1', '120', 'P100115', 'Samsethy', '1', '2023-04-04 16:30:17', null, null, null, null, 'OPD', null, null, null);
INSERT INTO `patients` VALUES ('123', '1', '1', '121', 'P100116', 'Samsethy', '1', '2023-04-08 22:42:16', null, null, null, null, 'OPD', null, null, null);
INSERT INTO `patients` VALUES ('124', '1', '1', '122', 'P100117', 'Samsethy', '1', '2023-04-08 22:42:37', null, null, null, null, 'OPD', null, null, null);
INSERT INTO `patients` VALUES ('125', '1', '1', '123', 'P100118', 'Samsethy', '1', '2023-04-08 22:55:18', null, null, null, null, 'OPD', null, null, null);
INSERT INTO `patients` VALUES ('127', '1', '1', '125', 'P100120', 'Samsethy', '1', '2023-04-09 15:43:38', null, null, null, null, 'OPD', null, null, null);
INSERT INTO `patients` VALUES ('128', '1', '1', '126', 'P100121', 'Samsethy', '1', '2023-04-09 16:09:00', null, null, null, null, 'OPD', null, null, null);

-- ----------------------------
-- Table structure for `patient_advice`
-- ----------------------------
DROP TABLE IF EXISTS `patient_advice`;
CREATE TABLE `patient_advice` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `category` varchar(50) NOT NULL,
  `content` varchar(500) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_uid` int(10) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL,
  `ticket_id` int(10) DEFAULT NULL,
  `patient_id` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of patient_advice
-- ----------------------------
INSERT INTO `patient_advice` VALUES ('1', '1', 'General', 'DO NOT DRINK ALCOHOL sdfdsfsdfsd', '2023-03-13 16:15:26.163323', '2023-03-13 16:15:26.000000', '1', '1', 'Samsethy', 'Samsethy', '114', '119');
INSERT INTO `patient_advice` VALUES ('2', '1', 'General', 'sdfdgfdhd', '2023-03-21 11:39:38.000000', '2023-03-21 11:39:38.000000', '1', '1', 'Samsethy', 'Samsethy', '121', '118');
INSERT INTO `patient_advice` VALUES ('3', '1', 'General', 'Do not eat alcohol', '2023-03-21 12:53:08.356815', '2023-03-21 12:53:08.000000', '1', '1', 'Samsethy', 'Samsethy', '120', '118');
INSERT INTO `patient_advice` VALUES ('4', '1', 'General', 'dfgdfhgf', '2023-04-09 15:03:20.000000', '2023-04-09 15:03:20.000000', '1', '1', 'Samsethy', 'Samsethy', '130', '117');

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
INSERT INTO `patient_code_control` VALUES ('1', '121', null, 'P');

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
-- Table structure for `patient_diagnosis`
-- ----------------------------
DROP TABLE IF EXISTS `patient_diagnosis`;
CREATE TABLE `patient_diagnosis` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) DEFAULT NULL,
  `patient_id` int(10) DEFAULT NULL,
  `consult_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `ticket_id` int(10) DEFAULT NULL,
  `content` varchar(800) DEFAULT '',
  `category` varchar(50) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of patient_diagnosis
-- ----------------------------
INSERT INTO `patient_diagnosis` VALUES ('1', '1', '119', '2023-03-13 16:15:17.000000', '114', 'This is doing fine now dfdgg esfdgdfg', 'General', '1', '2023-03-13 16:15:17.638809', 'Samsethy', '1', '2023-03-13 16:15:17.000000', 'Samsethy');
INSERT INTO `patient_diagnosis` VALUES ('2', '1', '118', '2023-03-21 12:07:20.000000', '120', 'dfgfdgfdgfdg', 'General', '1', '2023-03-21 12:07:20.518975', 'Samsethy', '1', '2023-03-21 12:07:20.000000', 'Samsethy');
INSERT INTO `patient_diagnosis` VALUES ('3', '1', '120', '2023-03-21 12:49:21.000000', '119', 'sfsd  dgfdhfhf', 'General', '1', '2023-03-21 12:49:21.000000', 'Samsethy', '1', '2023-03-21 12:49:21.000000', 'Samsethy');
INSERT INTO `patient_diagnosis` VALUES ('4', '1', '118', '2023-03-31 13:27:53.000000', '122', 'vxcvcxvxvxvxc ssdgsd dsfsdgsdg sdfsdgd', 'General', '1', '2023-03-31 13:27:53.000000', 'Samsethy', '1', '2023-03-31 13:27:53.000000', 'Samsethy');

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
  `test_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `result_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `consultant_comments` varchar(800) DEFAULT '',
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
  `remarks` varchar(150) DEFAULT NULL,
  `labo_id` int(10) NOT NULL DEFAULT 0,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of patient_labo_tests
-- ----------------------------
INSERT INTO `patient_labo_tests` VALUES ('2', '1', '119', '114', '27', null, null, '', null, null, null, '1', 'Samsethy', '2023-03-12 20:37:46.000000', null, null, null, '0.00', 'dfgfdhfdfgdf', '6', '2023-03-21 11:46:56');
INSERT INTO `patient_labo_tests` VALUES ('6', '1', '119', '114', '32', null, null, '', null, null, null, '1', 'Samsethy', '2023-03-12 20:41:54.000000', null, null, null, '0.00', 'sdfdgfdhgfhfgjgjghgh', '6', '2023-03-21 11:46:56');
INSERT INTO `patient_labo_tests` VALUES ('7', '1', '118', '121', '32', '2023-03-21 11:47:59.613087', '2023-03-21 11:47:59.613087', '', null, null, null, '1', 'Samsethy', '2023-03-21 11:47:59.613087', '2023-03-21 11:47:59.613087', 'Samsethy', '1', '0.00', 'dgfdhg', '6', '2023-03-21 11:47:59');
INSERT INTO `patient_labo_tests` VALUES ('8', '1', '118', '121', '27', '2023-03-21 11:48:04.910370', '2023-03-21 11:48:04.910370', '', null, null, null, '1', 'Samsethy', '2023-03-21 11:48:04.910370', '2023-03-21 11:48:04.910370', 'Samsethy', '1', '0.00', 'dfdgdfhfhgfh', '4', '2023-03-21 11:48:04');
INSERT INTO `patient_labo_tests` VALUES ('9', '1', '120', '119', '27', null, null, '', null, null, null, '1', 'Samsethy', '2023-03-21 11:53:00.000000', null, null, null, '0.00', 'fdgfdghfg', '6', '2023-03-21 11:53:00');
INSERT INTO `patient_labo_tests` VALUES ('10', '1', '120', '119', '32', null, null, '', null, null, null, '1', 'Samsethy', '2023-03-21 11:53:07.000000', null, null, null, '0.00', 'dfgfdghfd', '4', '2023-03-21 11:53:07');
INSERT INTO `patient_labo_tests` VALUES ('11', '1', '118', '120', '27', null, null, '', null, null, null, '1', 'Samsethy', '2023-03-21 11:54:18.000000', null, null, null, '0.00', 'fgfdhf dgdf dfgdfh', '6', '2023-03-21 11:54:18');
INSERT INTO `patient_labo_tests` VALUES ('14', '1', '118', '120', '27', null, null, '', null, null, null, '1', 'Samsethy', '2023-03-21 12:14:36.000000', null, null, null, '0.00', 'sdfdsgdf', '4', '2023-03-21 12:14:36');
INSERT INTO `patient_labo_tests` VALUES ('19', '1', '118', '122', '27', '2023-03-31 13:27:27.519225', '2023-03-31 13:27:27.519225', '', null, null, null, '1', 'Samsethy', '2023-03-31 13:27:27.519225', '2023-03-31 13:27:27.519225', 'Samsethy', '1', '0.00', 'cvcxbcbvcb', '6', '2023-03-31 13:27:27');
INSERT INTO `patient_labo_tests` VALUES ('20', '1', '118', '122', '27', null, null, '', null, null, null, '1', 'Samsethy', '2023-03-31 13:27:44.000000', null, null, null, '0.00', 'bbbbb', '4', '2023-03-31 13:27:44');
INSERT INTO `patient_labo_tests` VALUES ('21', '1', '122', '124', '32', '2023-04-05 19:46:49.021499', '2023-04-05 19:46:49.021499', '', null, null, null, '1', 'Samsethy', '2023-04-05 19:46:49.021499', '2023-04-05 19:46:49.021499', 'Samsethy', '1', '50.00', 'dfdgdf', '6', '2023-04-05 19:46:49');
INSERT INTO `patient_labo_tests` VALUES ('22', '1', '127', '132', '32', '2023-04-10 06:20:30.389303', '2023-04-10 06:20:30.389303', '', null, null, null, '1', 'Samsethy', '2023-04-10 06:20:30.389303', '2023-04-10 06:20:30.389303', 'Samsethy', '1', '50.00', 'sdfgd', '1', '2023-04-10 06:20:30');
INSERT INTO `patient_labo_tests` VALUES ('23', '1', '127', '132', '32', null, null, '', null, null, null, '1', 'Samsethy', '2023-04-10 06:43:50.000000', null, null, null, '50.00', 'vbdfghfjgfh', '1', '2023-04-10 06:43:50');

-- ----------------------------
-- Table structure for `patient_medical_advice`
-- ----------------------------
DROP TABLE IF EXISTS `patient_medical_advice`;
CREATE TABLE `patient_medical_advice` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) DEFAULT NULL,
  `patient_id` int(10) DEFAULT NULL,
  `ticket_id` int(10) DEFAULT NULL,
  `content` varchar(800) DEFAULT '',
  `category` varchar(50) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of patient_medical_advice
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
) ENGINE=InnoDB AUTO_INCREMENT=269 DEFAULT CHARSET=utf8mb4;

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
INSERT INTO `patient_medical_conditions` VALUES ('214', '1', '103', '3', '0', 'Active', '2023-01-11 16:12:58.000000', '1', 'Samsethy', '2023-01-11 16:12:58.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('218', '1', '104', '3', '0', 'Active', '2023-01-19 18:32:32.000000', '1', 'Samsethy', '2023-01-19 18:32:32.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('220', '1', '105', '3', '0', 'Active', '2023-01-19 18:36:28.000000', '1', 'Samsethy', '2023-01-19 18:36:28.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('222', '1', '106', '3', '0', 'Active', '2023-02-09 07:40:26.000000', '1', 'Samsethy', '2023-02-09 07:40:26.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('224', '1', '107', '3', '0', 'Active', '2023-02-22 06:19:49.000000', '1', 'Samsethy', '2023-02-22 06:19:49.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('228', '1', '108', '3', '0', 'Active', '2023-02-22 06:37:21.000000', '1', 'Samsethy', '2023-02-22 06:37:21.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('230', '1', '109', '3', '0', 'Active', '2023-02-22 06:39:19.000000', '1', 'Samsethy', '2023-02-22 06:39:19.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('232', '1', '110', '3', '0', 'Active', '2023-02-22 06:45:38.000000', '1', 'Samsethy', '2023-02-22 06:45:38.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('234', '1', '111', '3', '0', 'Active', '2023-02-22 06:47:42.000000', '1', 'Samsethy', '2023-02-22 06:47:42.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('236', '1', '112', '3', '0', 'Active', '2023-03-06 11:36:39.000000', '1', 'Samsethy', '2023-03-06 11:36:39.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('238', '1', '113', '3', '1', 'Active', '2023-03-06 14:01:22.000000', '1', 'Samsethy', '2023-03-06 14:01:22.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('240', '1', '114', '3', '1', 'Active', '2023-03-06 14:22:13.000000', '1', 'Samsethy', '2023-03-06 14:22:13.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('242', '1', '115', '3', '1', 'Active', '2023-03-06 14:31:31.000000', '1', 'Samsethy', '2023-03-06 14:31:31.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('244', '1', '116', '3', '0', 'Active', '2023-03-06 15:05:57.000000', '1', 'Samsethy', '2023-03-06 15:05:57.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('246', '1', '117', '3', '0', 'Active', '2023-03-06 15:25:24.000000', '1', 'Samsethy', '2023-03-06 15:25:24.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('248', '1', '118', '3', '0', 'Active', '2023-03-06 15:29:47.000000', '1', 'Samsethy', '2023-03-06 15:29:47.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('250', '1', '119', '3', '0', 'Active', '2023-03-06 16:20:43.000000', '1', 'Samsethy', '2023-03-06 16:20:43.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('252', '1', '120', '3', '0', 'Active', '2023-03-21 03:32:25.000000', '1', 'Samsethy', '2023-03-21 03:32:25.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('254', '1', '121', '3', '0', 'Active', '2023-03-31 12:45:55.000000', '1', 'Samsethy', '2023-03-31 12:45:55.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('256', '1', '122', '3', '1', 'Active', '2023-04-04 16:30:17.000000', '1', 'Samsethy', '2023-04-04 16:30:17.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('258', '1', '123', '3', '0', 'Active', '2023-04-08 22:42:16.000000', '1', 'Samsethy', '2023-04-08 22:42:16.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('260', '1', '124', '3', '0', 'Active', '2023-04-08 22:42:37.000000', '1', 'Samsethy', '2023-04-08 22:42:37.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('262', '1', '125', '3', '0', 'Active', '2023-04-08 22:55:18.000000', '1', 'Samsethy', '2023-04-08 22:55:18.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('264', '1', '126', '3', '0', 'Active', '2023-04-09 10:14:06.000000', '1', 'Samsethy', '2023-04-09 10:14:06.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('266', '1', '127', '3', '0', 'Active', '2023-04-09 15:43:38.000000', '1', 'Samsethy', '2023-04-09 15:43:38.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('268', '1', '128', '3', '0', 'Active', '2023-04-09 16:09:00.000000', '1', 'Samsethy', '2023-04-09 16:09:00.000000', null, null, null, 'Conjunctivitis', null);

-- ----------------------------
-- Table structure for `patient_medical_history`
-- ----------------------------
DROP TABLE IF EXISTS `patient_medical_history`;
CREATE TABLE `patient_medical_history` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `ticket_id` int(10) NOT NULL,
  `category` varchar(50) NOT NULL,
  `content` varchar(800) DEFAULT '',
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_user` varchar(50) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `update_uid` int(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of patient_medical_history
-- ----------------------------
INSERT INTO `patient_medical_history` VALUES ('6', '1', '1', 'Traveling Abroad', 'Yes', '2023-03-11 14:50:14.000000', 'Samsethy', '1', null, null, null);
INSERT INTO `patient_medical_history` VALUES ('7', '1', '1', 'Family Diabete', 'Maybe', '2023-03-11 14:50:14.000000', 'Samsethy', '1', null, null, null);
INSERT INTO `patient_medical_history` VALUES ('8', '1', '1', 'Allergy', 'No', '2023-03-11 14:50:14.000000', 'Samsethy', '1', null, null, null);
INSERT INTO `patient_medical_history` VALUES ('9', '1', '114', 'Personal History', 'AAADSFSGFsdfgfdhfg \nsdfgfdhgf\nh', '2023-03-13 16:15:10.509287', 'Samsethy', '1', '2023-03-13 16:15:10.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('10', '1', '114', 'Family History', 'sdfdgdfhfg sdfgdfgfdgdfh  sdfgfdgfd sdfgfdgfd', '2023-03-13 16:15:10.515593', 'Samsethy', '1', '2023-03-13 16:15:10.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('11', '1', '114', 'Traveling', 'asfsdgdfhgh', '2023-03-13 16:15:10.520377', 'Samsethy', '1', '2023-03-13 16:15:10.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('12', '1', '114', 'Vacination', 'sdfbnfnghjkkyhjkggdfghtfyrfhtrhundefined', '2023-03-13 16:15:10.525313', 'Samsethy', '1', '2023-03-13 16:15:10.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('13', '1', '114', 'Allergy', 'sdfdfgdfgfdhfgdfdsfdsf', '2023-03-13 16:15:10.531424', 'Samsethy', '1', '2023-03-13 16:15:10.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('14', '1', '114', 'Surgery', 'sdfdggdfhdf dfgdfgfdgf', '2023-03-13 16:15:10.536214', 'Samsethy', '1', '2023-03-13 16:15:10.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('15', '1', '121', 'Personal History', 'sdfsdg', '2023-03-21 11:40:30.380183', 'Samsethy', '1', '2023-03-21 11:40:30.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('16', '1', '121', 'Family History', 'dgdgfdgdfh', '2023-03-21 11:40:30.000000', 'Samsethy', '1', null, null, null);
INSERT INTO `patient_medical_history` VALUES ('17', '1', '120', 'Personal History', 'dfdsgffdgdfdgdf  dgfdhgfhh', '2023-04-08 19:41:19.980201', 'Samsethy', '1', '2023-04-08 19:41:19.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('18', '1', '120', 'Family History', 'dfdgg', '2023-04-08 19:41:19.985565', 'Samsethy', '1', '2023-04-08 19:41:19.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('19', '1', '119', 'Personal History', 'sdfdgd dfgdff fgfhg', '2023-03-21 12:49:46.301537', 'Samsethy', '1', '2023-03-21 12:49:46.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('20', '1', '119', 'Family History', 'dfgfh dfghgfhj', '2023-03-21 12:49:46.307340', 'Samsethy', '1', '2023-03-21 12:49:46.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('21', '1', '119', 'Traveling', 'gfhj fgfhgfhgfjgjg', '2023-03-21 12:49:46.312915', 'Samsethy', '1', '2023-03-21 12:49:46.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('22', '1', '119', 'Vacination', 'fdsfdgd', '2023-03-21 12:49:46.000000', 'Samsethy', '1', null, null, null);
INSERT INTO `patient_medical_history` VALUES ('23', '1', '122', 'Personal History', 'dsfsdggdfhf', '2023-03-31 13:26:29.691619', 'Samsethy', '1', '2023-03-31 13:26:29.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('24', '1', '122', 'Family History', 'sdgdfhfdg', '2023-03-31 13:26:29.697077', 'Samsethy', '1', '2023-03-31 13:26:29.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('25', '1', '122', 'Traveling', 'sdgfdhgf', '2023-03-31 13:26:29.701744', 'Samsethy', '1', '2023-03-31 13:26:29.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('26', '1', '122', 'Vacination', 'sdfgegf', '2023-03-31 13:26:29.706182', 'Samsethy', '1', '2023-03-31 13:26:29.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('27', '1', '122', 'Allergy', 'swdfefgfeheh', '2023-03-31 13:26:29.000000', 'Samsethy', '1', null, null, null);
INSERT INTO `patient_medical_history` VALUES ('28', '1', '124', 'Personal History', 'No allergy', '2023-04-04 18:08:24.704101', 'Samsethy', '1', '2023-04-04 18:08:24.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('29', '1', '124', 'Family History', 'has grand parents', '2023-04-04 18:08:24.710525', 'Samsethy', '1', '2023-04-04 18:08:24.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('30', '1', '124', 'Traveling', 'Went to USA', '2023-04-04 18:08:24.717409', 'Samsethy', '1', '2023-04-04 18:08:24.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('31', '1', '124', 'Vacination', '3 times vacination', '2023-04-04 18:08:24.723064', 'Samsethy', '1', '2023-04-04 18:08:24.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('32', '1', '124', 'Allergy', 'NA', '2023-04-04 18:08:24.729634', 'Samsethy', '1', '2023-04-04 18:08:24.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('33', '1', '124', 'Surgery', '2 times', '2023-04-04 18:08:24.000000', 'Samsethy', '1', null, null, null);
INSERT INTO `patient_medical_history` VALUES ('34', '1', '130', 'Personal History', 'dfdgdf', '2023-04-09 15:02:54.498496', 'Samsethy', '1', '2023-04-09 15:02:54.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('35', '1', '130', 'Family History', 'cvbbfn', '2023-04-09 15:02:54.503824', 'Samsethy', '1', '2023-04-09 15:02:54.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('36', '1', '130', 'Traveling', 'dgf', '2023-04-09 15:02:54.508238', 'Samsethy', '1', '2023-04-09 15:02:54.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('37', '1', '130', 'Vacination', 'dsgfe', '2023-04-09 15:02:54.513027', 'Samsethy', '1', '2023-04-09 15:02:54.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('38', '1', '130', 'Allergy', 'dfghfh', '2023-04-09 15:02:54.000000', 'Samsethy', '1', null, null, null);
INSERT INTO `patient_medical_history` VALUES ('39', '1', '132', 'Personal History', 'fgjghj', '2023-04-10 09:35:07.100525', 'Samsethy', '1', '2023-04-10 09:35:07.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('40', '1', '132', 'Family History', 'dfghfhj', '2023-04-10 09:35:07.105541', 'Samsethy', '1', '2023-04-10 09:35:07.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('41', '1', '132', 'Traveling', 'dfghhfbcvn', '2023-04-10 09:35:07.110018', 'Samsethy', '1', '2023-04-10 09:35:07.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('42', '1', '132', 'Vacination', 'fhgfjfj', '2023-04-10 09:35:07.115223', 'Samsethy', '1', '2023-04-10 09:35:07.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('43', '1', '132', 'Allergy', 'sdgfghgf', '2023-04-10 09:35:07.119585', 'Samsethy', '1', '2023-04-10 09:35:07.000000', 'Samsethy', null);

-- ----------------------------
-- Table structure for `patient_pe`
-- ----------------------------
DROP TABLE IF EXISTS `patient_pe`;
CREATE TABLE `patient_pe` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `ticket_id` int(10) NOT NULL,
  `category` varchar(100) NOT NULL DEFAULT '',
  `content` varchar(500) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `patient_id` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of patient_pe
-- ----------------------------
INSERT INTO `patient_pe` VALUES ('4', '1', '1', 'general', 'sdfsdfdfg', 'Samsethy', '1', '2023-03-11 16:53:47.160286', '2023-03-11 16:53:47.000000', 'Samsethy', '1', null);
INSERT INTO `patient_pe` VALUES ('5', '1', '114', 'General', 'fsddxg  dfgfdhfhg\ndgfdhdf\ndhdf\nhfdfjfggfjfgjfgj', 'Samsethy', '1', '2023-03-12 10:42:34.035712', '2023-03-12 10:42:34.000000', 'Samsethy', '1', null);
INSERT INTO `patient_pe` VALUES ('6', '1', '121', 'General', 'fgdfghd', 'Samsethy', '1', '2023-03-21 11:44:53.841541', '2023-03-21 11:44:53.000000', 'Samsethy', '1', null);
INSERT INTO `patient_pe` VALUES ('7', '1', '119', 'General', 'sdgdfhfgh df gfdh zHzh', 'Samsethy', '1', '2023-03-21 12:49:34.429913', '2023-03-21 12:49:34.000000', 'Samsethy', '1', null);
INSERT INTO `patient_pe` VALUES ('8', '1', '120', 'General', 'dfdgghfdhfdh', 'Samsethy', '1', '2023-03-21 12:34:59.177408', '2023-03-21 12:34:59.000000', 'Samsethy', '1', null);
INSERT INTO `patient_pe` VALUES ('9', '1', '118', 'General', 'sfdsgdgdf sdffdgfdhfh', 'Samsethy', '1', '2023-03-21 12:37:37.862558', '2023-03-21 12:37:37.000000', 'Samsethy', '1', null);
INSERT INTO `patient_pe` VALUES ('10', '1', '122', 'General', 'vcxbvcbcvbvcbn', 'Samsethy', '1', '2023-03-31 13:27:11.000000', '2023-03-31 13:27:11.000000', 'Samsethy', '1', null);
INSERT INTO `patient_pe` VALUES ('11', '1', '124', 'General', 'This pe for test', 'Samsethy', '1', '2023-04-04 18:09:01.000000', '2023-04-04 18:09:01.000000', 'Samsethy', '1', null);
INSERT INTO `patient_pe` VALUES ('12', '1', '132', 'General', 'dfdfgfdh', 'Samsethy', '1', '2023-04-10 05:11:49.000000', '2023-04-10 05:11:49.000000', 'Samsethy', '1', null);

-- ----------------------------
-- Table structure for `patient_photos`
-- ----------------------------
DROP TABLE IF EXISTS `patient_photos`;
CREATE TABLE `patient_photos` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `category` varchar(35) NOT NULL,
  `file_name` varchar(250) NOT NULL,
  `file_type` varchar(10) DEFAULT '',
  `create_user` varchar(50) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_uid` int(10) DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `ticket_id` int(10) DEFAULT NULL,
  `patient_id` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of patient_photos
-- ----------------------------
INSERT INTO `patient_photos` VALUES ('29', '1', 'general', '1_file_1641ad7b9153e020230322_050301.jpg', 'jpg', 'Samsethy', '2023-03-22 17:26:01.000000', '1', null, null, null, '120', '118');
INSERT INTO `patient_photos` VALUES ('32', '1', 'general', '1_file_1641ad9a2ddb6820230322_050310.png', 'png', 'Samsethy', '2023-03-22 17:34:10.000000', '1', null, null, null, '119', '120');
INSERT INTO `patient_photos` VALUES ('33', '1', 'general', '1_file_1641ad9a5e9d0620230322_050313.jpg', 'jpg', 'Samsethy', '2023-03-22 17:34:14.000000', '1', null, null, null, '119', '120');
INSERT INTO `patient_photos` VALUES ('34', '1', 'general', '1_file_1641bc9d090ad820230323_100356.jpg', 'jpg', 'Samsethy', '2023-03-23 10:38:56.000000', '1', null, null, null, '120', '118');
INSERT INTO `patient_photos` VALUES ('39', '1', 'general', '1_file_1643154d9e408120230408_060445.png', 'png', 'Samsethy', '2023-04-08 18:49:45.000000', '1', null, null, null, '124', '122');
INSERT INTO `patient_photos` VALUES ('40', '1', 'general', '1_file_1643277d88627c20230409_030420.jpg', 'jpg', 'Samsethy', '2023-04-09 15:31:20.000000', '1', null, null, null, '130', '117');
INSERT INTO `patient_photos` VALUES ('41', '1', 'general', '1_file_1643277dd47fc720230409_030425.png', 'png', 'Samsethy', '2023-04-09 15:31:25.000000', '1', null, null, null, '130', '117');
INSERT INTO `patient_photos` VALUES ('42', '1', 'general', '1_file_1643287d17bde320230409_040429.png', 'png', 'Samsethy', '2023-04-09 16:39:29.000000', '1', null, null, null, '130', '117');

-- ----------------------------
-- Table structure for `patient_prescription_items`
-- ----------------------------
DROP TABLE IF EXISTS `patient_prescription_items`;
CREATE TABLE `patient_prescription_items` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `item_id` int(10) DEFAULT NULL,
  `usage` varchar(150) DEFAULT '',
  `reason` varchar(200) DEFAULT '',
  `create_uid` int(10) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_uid` int(10) DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `remarks` varchar(150) DEFAULT NULL,
  `qty` decimal(10,2) DEFAULT 0.00,
  `sku` varchar(25) DEFAULT NULL,
  `duration_days` decimal(10,2) NOT NULL DEFAULT 0.00,
  `ticket_id` int(10) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT 0.00,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of patient_prescription_items
-- ----------------------------
INSERT INTO `patient_prescription_items` VALUES ('1', '1', '15', 'sdfg', 'dfgdfg', '1', 'Samsethy', '2023-03-12 12:23:31.039009', '1', 'Samsethy', '2023-03-12 12:23:31.000000', null, '20.00', 'Box', '30.00', '114', '0.00');
INSERT INTO `patient_prescription_items` VALUES ('5', '1', '245', 'sdfdghfgf', 'fghhgfhfg', '1', 'Samsethy', '2023-03-12 12:23:39.267598', '1', 'Samsethy', '2023-03-12 12:23:39.000000', null, '30.00', 'Tube', '15.00', '114', '0.00');
INSERT INTO `patient_prescription_items` VALUES ('6', '1', '46', 'sdfdgfdh', 'dfdgfdh', '1', 'Samsethy', '2023-03-12 12:24:46.153961', '1', 'Samsethy', '2023-03-12 12:24:46.000000', null, '2.00', 'Box', '7.00', '114', '0.00');
INSERT INTO `patient_prescription_items` VALUES ('8', '1', '81', '2 times per day', 'for safety', '1', 'Samsethy', '2023-04-05 20:11:28.080241', '1', 'Samsethy', '2023-04-05 20:11:28.000000', null, '15.00', 'Box', '30.00', '124', '100.00');
INSERT INTO `patient_prescription_items` VALUES ('9', '1', '232', 'apply', 'need it', '1', 'Samsethy', '2023-04-05 20:11:30.246051', '1', 'Samsethy', '2023-04-05 20:11:30.000000', null, '20.00', 'Box', '45.00', '124', '100.00');
INSERT INTO `patient_prescription_items` VALUES ('11', '1', '63', 'sadsdg', null, '1', 'Samsethy', '2023-04-05 20:11:32.757352', '1', 'Samsethy', '2023-04-05 20:11:32.000000', null, '3.00', 'Tube', '50.00', '124', '100.00');
INSERT INTO `patient_prescription_items` VALUES ('12', '1', '106', 'hhh', null, '1', 'Samsethy', '2023-04-06 00:28:00.748720', '1', 'Samsethy', '2023-04-06 00:28:00.000000', null, '5.00', 'Bottle', '30.00', '120', '100.00');
INSERT INTO `patient_prescription_items` VALUES ('13', '1', '106', null, null, '1', 'Samsethy', '2023-04-06 00:32:45.000000', null, null, null, null, '5.00', 'Bottle', '0.00', '122', '100.00');
INSERT INTO `patient_prescription_items` VALUES ('14', '1', '106', 'dfdg', null, '1', 'Samsethy', '2023-04-09 15:03:30.924214', '1', 'Samsethy', '2023-04-09 15:03:30.000000', null, '20.00', 'Bottle', '20.00', '130', '100.00');
INSERT INTO `patient_prescription_items` VALUES ('15', '1', '245', 'egfhfh', null, '1', 'Samsethy', '2023-04-09 15:03:41.252373', '1', 'Samsethy', '2023-04-09 15:03:41.000000', null, '10.00', 'Tube', '25.00', '130', '100.00');
INSERT INTO `patient_prescription_items` VALUES ('16', '1', '245', '2 per day', 'sdfdsfds', '1', 'Samsethy', '2023-04-10 05:17:11.797868', '1', 'Samsethy', '2023-04-10 05:17:11.000000', null, '10.00', 'Tube', '20.00', '132', '100.00');

-- ----------------------------
-- Table structure for `patient_services`
-- ----------------------------
DROP TABLE IF EXISTS `patient_services`;
CREATE TABLE `patient_services` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `service_id` int(10) NOT NULL,
  `emp_id` int(11) DEFAULT NULL,
  `perform_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `remarks` varchar(150) DEFAULT NULL,
  `qty` decimal(10,2) NOT NULL DEFAULT 1.00,
  `sku` varchar(15) NOT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_user` varchar(50) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_uid` int(10) DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL,
  `ticket_id` int(10) DEFAULT NULL,
  `patient_id` int(10) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT 0.00,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of patient_services
-- ----------------------------
INSERT INTO `patient_services` VALUES ('1', '1', '11', '1', '2023-03-12 13:38:07.364916', 'fdsfgfd', '1.00', 'none', '2023-03-12 13:38:07.364916', 'Samsethy', '1', '2023-03-12 13:38:07.000000', '1', 'Samsethy', null, null, '0.00');
INSERT INTO `patient_services` VALUES ('2', '1', '27', '1', '2023-03-12 14:22:29.573772', 'fgeryer', '1.00', 'none', '2023-03-12 14:22:29.573772', 'Samsethy', '1', '2023-03-12 14:22:29.000000', '1', 'Samsethy', '114', '119', '0.00');
INSERT INTO `patient_services` VALUES ('4', '1', '1', '13', '2023-03-12 19:11:41.428103', 'g', '1.00', 'none', '2023-03-12 19:11:41.428103', 'Samsethy', '1', '2023-03-12 19:11:41.000000', '1', 'Samsethy', '114', '119', '0.00');
INSERT INTO `patient_services` VALUES ('5', '1', '2', '12', '2023-03-13 08:58:40.558218', 'dfdgdfh', '1.00', 'none', '2023-03-13 08:58:40.558218', 'Samsethy', '1', '2023-03-13 08:58:40.000000', '1', 'Samsethy', '114', '119', '0.00');
INSERT INTO `patient_services` VALUES ('6', '1', '10', '2', '2023-03-21 12:06:40.541989', 'kkkk', '1.00', 'none', '2023-03-21 12:06:40.541989', 'Samsethy', '1', '2023-03-21 12:06:40.000000', '1', 'Samsethy', '120', '118', '0.00');
INSERT INTO `patient_services` VALUES ('7', '1', '1', '1', '2023-03-21 12:06:36.848099', 'gggg', '0.00', 'none', '2023-03-21 12:06:36.848099', 'Samsethy', '1', '2023-03-21 12:06:36.000000', '1', 'Samsethy', '120', '118', '0.00');
INSERT INTO `patient_services` VALUES ('8', '1', '11', '1', '2023-03-21 12:06:27.420816', 'sfddgdfg', '1.00', 'none', '2023-03-21 12:06:27.420816', 'Samsethy', '1', '2023-03-21 12:06:27.000000', '1', 'Samsethy', '120', '118', '0.00');
INSERT INTO `patient_services` VALUES ('9', '1', '28', null, null, null, '0.00', 'none', '2023-04-04 22:44:05.000000', 'Samsethy', '1', null, null, null, '123', '121', '0.00');
INSERT INTO `patient_services` VALUES ('10', '1', '2', '2', '2023-04-05 20:16:50.084772', 'dfdsgsdgdg', '1.00', 'none', '2023-04-05 20:16:50.084772', 'Samsethy', '1', '2023-04-05 20:16:50.000000', '1', 'Samsethy', '124', '122', '0.00');
INSERT INTO `patient_services` VALUES ('11', '1', '11', '1', '2023-04-05 20:16:52.227373', 'dfdsgsdgdsgd', '1.00', 'none', '2023-04-05 20:16:52.227373', 'Samsethy', '1', '2023-04-05 20:16:52.000000', '1', 'Samsethy', '124', '122', '10.00');

-- ----------------------------
-- Table structure for `patient_vital_signs`
-- ----------------------------
DROP TABLE IF EXISTS `patient_vital_signs`;
CREATE TABLE `patient_vital_signs` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `ticket_id` int(10) DEFAULT NULL,
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=501 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of patient_vital_signs
-- ----------------------------
INSERT INTO `patient_vital_signs` VALUES ('461', '114', '119', '1', '2.00', 'Body temperature', '2023-03-06 16:20:43.000000', '2023-03-06 16:20:43.000000', '1', 'Samsethy', null, null, null, '1', '194');
INSERT INTO `patient_vital_signs` VALUES ('462', '114', '119', '2', '5.00', 'Impulse rate', '2023-03-06 16:20:43.000000', '2023-03-06 16:20:43.000000', '1', 'Samsethy', null, null, null, '1', '194');
INSERT INTO `patient_vital_signs` VALUES ('463', '114', '119', '3', '6.00', 'Respiration Rate', '2023-03-06 16:20:43.000000', '2023-03-06 16:20:43.000000', '1', 'Samsethy', null, null, null, '1', '194');
INSERT INTO `patient_vital_signs` VALUES ('464', '114', '119', '4', '1.00', 'Blood pressure', '2023-03-06 16:20:43.000000', '2023-03-06 16:20:43.000000', '1', 'Samsethy', null, null, null, '1', '194');
INSERT INTO `patient_vital_signs` VALUES ('465', '119', '120', '1', '25.00', 'Body temperature', '2023-03-21 03:43:09.758511', '2023-03-21 03:43:09.758511', '1', 'Samsethy', '2023-03-21 03:43:09.758511', null, null, '1', '195');
INSERT INTO `patient_vital_signs` VALUES ('466', '119', '120', '2', '12.00', 'Impulse rate', '2023-03-21 03:43:09.758511', '2023-03-21 03:43:09.758511', '1', 'Samsethy', '2023-03-21 03:43:09.758511', null, null, '1', '195');
INSERT INTO `patient_vital_signs` VALUES ('467', '119', '120', '3', '16.00', 'Respiration Rate', '2023-03-21 03:43:09.758511', '2023-03-21 03:43:09.758511', '1', 'Samsethy', '2023-03-21 03:43:09.758511', null, null, '1', '195');
INSERT INTO `patient_vital_signs` VALUES ('468', '119', '120', '4', '2.00', 'Blood pressure', '2023-03-21 03:43:09.758511', '2023-03-21 03:43:09.758511', '1', 'Samsethy', '2023-03-21 03:43:09.758511', null, null, '1', '195');
INSERT INTO `patient_vital_signs` VALUES ('493', '131', '127', '1', '20.00', 'Body temperature', '2023-04-09 15:44:20.074962', '2023-04-09 15:44:20.074962', '1', 'Samsethy', '2023-04-09 15:44:20.074962', null, null, '1', '211');
INSERT INTO `patient_vital_signs` VALUES ('494', '131', '127', '2', '20.00', 'Impulse rate', '2023-04-09 15:44:20.074962', '2023-04-09 15:44:20.074962', '1', 'Samsethy', '2023-04-09 15:44:20.074962', null, null, '1', '211');
INSERT INTO `patient_vital_signs` VALUES ('495', '131', '127', '3', '20.00', 'Respiration Rate', '2023-04-09 15:44:20.074962', '2023-04-09 15:44:20.074962', '1', 'Samsethy', '2023-04-09 15:44:20.074962', null, null, '1', '211');
INSERT INTO `patient_vital_signs` VALUES ('496', '131', '127', '4', '12.00', 'Blood pressure', '2023-04-09 15:44:20.074962', '2023-04-09 15:44:20.074962', '1', 'Samsethy', '2023-04-09 15:44:20.074962', null, null, '1', '211');
INSERT INTO `patient_vital_signs` VALUES ('497', null, '128', '1', null, 'Body temperature', '2023-04-09 16:09:00.000000', '2023-04-09 16:09:00.000000', '1', 'Samsethy', null, null, null, '1', null);
INSERT INTO `patient_vital_signs` VALUES ('498', null, '128', '2', null, 'Impulse rate', '2023-04-09 16:09:00.000000', '2023-04-09 16:09:00.000000', '1', 'Samsethy', null, null, null, '1', null);
INSERT INTO `patient_vital_signs` VALUES ('499', null, '128', '3', null, 'Respiration Rate', '2023-04-09 16:09:00.000000', '2023-04-09 16:09:00.000000', '1', 'Samsethy', null, null, null, '1', null);
INSERT INTO `patient_vital_signs` VALUES ('500', null, '128', '4', null, 'Blood pressure', '2023-04-09 16:09:00.000000', '2023-04-09 16:09:00.000000', '1', 'Samsethy', null, null, null, '1', null);

-- ----------------------------
-- Table structure for `persons`
-- ----------------------------
DROP TABLE IF EXISTS `persons`;
CREATE TABLE `persons` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `branch_id` int(11) NOT NULL,
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
  `photo_file_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo_file_name` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=127 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of persons
-- ----------------------------
INSERT INTO `persons` VALUES ('1', '1', 'Sinora', 'Sin', 'F', '2023-03-12', '15', '012567672', null, 'dd@gmailcom', null, null, null, null, '', '0', null, 'Samsethy', '1', '2023-03-22 15:44:29', null, null, null);
INSERT INTO `persons` VALUES ('2', '1', 'THOUN', 'Samsethy', 'M', '2023-03-20', '14', '012345646', null, 'samg@mailcom', null, null, null, null, '', '0', null, 'Samsethy', '1', '2023-03-23 11:02:11', null, null, null);
INSERT INTO `persons` VALUES ('50', '1', 'Darany', 'Ms', 'F', '2022-10-10', '14', '012555653', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-01 10:19:48', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('51', '1', '', 'KKKKK', 'F', '2022-09-12', '14', '0125656765', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-03 17:39:11', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('52', '1', 'name client one', 'new', 'M', '2023-01-02', '14', '012555666', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-04 13:19:03', 'Samsethy', '1', '2023-01-01 15:55:42', null, null, null);
INSERT INTO `persons` VALUES ('53', '1', '', 'DDDDDD``', 'F', null, '14', '093488789', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-04 13:40:21', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('54', '1', 'AAA', 'DSDF', 'F', null, '14', '0112225653', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-04 13:41:53', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('55', '1', 'ONE', 'NEW', 'M', '2022-11-07', '14', '012333221', null, 'cddsg', 'fsdgdgfd', null, null, null, 'Samsethy', '1', '2022-12-04 14:09:38', 'Samsethy', '1', '2023-01-01 16:02:03', null, null, null);
INSERT INTO `persons` VALUES ('56', '1', 'Sobana', 'Bun', 'F', '2022-10-03', '14', '0115656565', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-06 11:24:58', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('57', '1', '', 'Borya', 'M', '2022-09-05', '14', '0125689898', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-06 12:02:15', 'Samsethy', '1', '2023-03-01 16:13:21', null, null, null);
INSERT INTO `persons` VALUES ('58', '1', '', 'DDGDGDGD', 'F', '2022-12-06', '14', '0125686455', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-07 17:20:23', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('59', '1', '', 'Sonary', 'F', '2022-08-02', '14', '0102256765', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-08 09:52:09', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('60', '1', '', 'Ginara', 'F', '2022-09-05', '14', '01023765423', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-08 10:03:45', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('61', '1', 'name', 'Funny', 'F', '2022-10-10', '14', '011235768', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-08 11:01:25', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('62', '1', 'one', 'some', 'M', '2022-06-06', '14', '012565656', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-09 10:04:17', 'Samsethy', '1', '2023-01-01 14:41:17', null, null, null);
INSERT INTO `persons` VALUES ('63', '1', '', 'KKKKK', 'F', null, '14', '01025657667', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-10 19:10:53', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('64', '1', '', 'KKK1', 'F', null, '14', '01245656', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-10 19:14:08', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('65', '1', '', 'HHH2', 'F', null, '14', '011023255', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-10 19:23:16', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('66', '1', '', 'HKKK', 'F', null, '14', '01245657', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-10 19:25:59', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('67', '1', '', 'GGG1', 'M', null, '14', '0125765676', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-10 19:30:24', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('68', '1', '', 'sfddgfdgdfgdfg', 'F', null, '14', '012234353', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-10 20:53:28', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('69', '1', '', 'sdgdfhfdhgfh', 'F', null, '14', '012456576', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-10 20:55:17', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('70', '1', '', 'sdfdggdf', 'F', '2022-08-08', '14', '012456546', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-11 11:46:44', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('71', '1', '', 'sfsdgfdgd', 'F', null, '14', '012565676', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-11 12:53:57', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('72', '1', '', 'HJKJKJK', 'F', null, '14', '010566767', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-12 01:44:14', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('73', '1', '', 'vikara', 'M', null, '14', '0102343322', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-16 14:10:24', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('74', '1', null, null, 'M', '2022-10-03', null, '012565656', null, null, null, null, null, null, 'Samsethy', '1', '2023-01-01 12:42:35', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('75', '1', null, null, 'M', '2022-06-06', null, '012565656', null, null, null, null, null, null, 'Samsethy', '1', '2023-01-01 12:42:54', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('76', '1', null, null, 'M', '2022-06-06', null, '012565656', null, null, 'admingmailcom', null, null, null, 'Samsethy', '1', '2023-01-01 12:45:07', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('77', '1', null, null, 'M', '1998-03-02', null, '012565656', null, null, null, null, null, null, 'Samsethy', '1', '2023-01-01 12:45:19', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('78', '1', null, null, 'M', '2022-09-05', null, '012998898', null, null, null, null, null, null, 'Samsethy', '1', '2023-01-01 12:46:04', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('79', '1', '', 'MMMMMM', 'F', '2007-07-10', '14', '012455465', null, null, null, null, null, null, 'Samsethy', '1', '2023-01-01 14:54:26', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('80', '1', '', 'HEHEERER', 'F', null, '14', '0122323243', null, null, null, null, null, null, 'Samsethy', '1', '2023-01-01 16:01:05', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('81', '1', 'changed name', 'different', 'F', '2022-11-07', '14', '01255666756', null, null, null, null, null, null, 'Samsethy', '1', '2023-01-01 16:08:04', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('82', '1', '', 'sovannary', 'M', '2022-06-02', '14', '093488777', null, null, null, null, null, null, 'Samsethy', '1', '2023-01-01 16:15:20', 'Samsethy', '1', '2023-01-01 16:33:51', null, null, null);
INSERT INTO `persons` VALUES ('83', '1', 'Dane', 'Chea', 'M', '2022-08-08', '14', '012456565', null, null, null, null, null, null, 'Samsethy', '1', '2023-01-01 16:19:36', 'Samsethy', '1', '2023-01-01 16:44:08', null, null, null);
INSERT INTO `persons` VALUES ('84', '1', '', 'GGGGG1', 'M', '2023-01-09', '14', '012546565', null, null, null, null, null, null, 'Samsethy', '1', '2023-01-01 16:27:42', 'Samsethy', '1', '2023-01-01 16:44:49', null, null, null);
INSERT INTO `persons` VALUES ('85', '1', '', 'Liza', 'M', '2022-11-07', '14', '01234546', null, null, null, null, null, null, 'Samsethy', '1', '2023-01-02 22:15:53', 'Samsethy', '1', '2023-01-02 22:34:18', null, null, null);
INSERT INTO `persons` VALUES ('86', '1', '', 'dsfsfdsf', 'M', '2022-09-06', '14', '012234324', null, null, null, null, null, null, 'Samsethy', '1', '2023-01-05 09:57:54', 'Samsethy', '1', '2023-01-05 09:59:33', null, null, null);
INSERT INTO `persons` VALUES ('87', '1', '', 'Dyna', 'M', '2022-08-08', '14', '0124565464', null, null, null, null, null, null, 'Samsethy', '1', '2023-01-05 10:28:35', 'Samsethy', '1', '2023-01-10 18:45:28', null, null, null);
INSERT INTO `persons` VALUES ('88', '1', 'pat', 'ABC', 'F', '2022-11-06', '14', '012456456', null, null, null, null, null, null, 'Samsethy', '1', '2023-01-11 16:12:58', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('89', '1', null, null, 'M', '2000-01-01', null, '012345646', null, 'sam2gmailcom', null, null, null, null, 'Samsethy', '1', '2023-01-12 09:39:59', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('90', '1', null, null, 'M', '2000-01-01', null, '012345646', null, 'sam2gmailcom', null, null, null, null, 'Samsethy', '1', '2023-01-12 09:40:33', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('91', '1', null, null, 'M', '2000-01-01', null, '012345646', null, 'sam2gmailcom', null, null, null, null, 'Samsethy', '1', '2023-01-12 09:44:37', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('92', '1', null, null, 'M', '2000-01-01', null, '012345646', null, 'sam2gmailcom', null, null, null, null, 'Samsethy', '1', '2023-01-12 09:44:39', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('93', '1', null, null, 'M', '2000-01-01', null, '012345646', null, 'sam2gmailcom', null, null, null, null, 'Samsethy', '1', '2023-01-12 09:44:40', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('94', '1', null, null, 'M', '2000-01-01', null, '012345646', null, 'samgmailcom', null, null, null, null, 'Samsethy', '1', '2023-01-12 09:47:49', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('95', '1', null, null, 'M', '2000-01-01', null, '012345646', null, 'samgmailcom', null, null, null, null, 'Samsethy', '1', '2023-01-12 09:47:51', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('96', '1', null, null, 'M', '2000-01-01', null, '012345646', null, 'samgmailcom', null, null, null, null, 'Samsethy', '1', '2023-01-12 09:52:04', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('97', '1', null, null, 'M', '2000-01-01', null, '012345646', null, 'samgmailcom', null, null, null, null, 'Samsethy', '1', '2023-01-12 09:52:42', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('98', '1', null, null, 'M', '2000-01-01', null, '012345646', null, 'samgmailcom', null, null, null, null, 'Samsethy', '1', '2023-01-12 10:10:27', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('99', '1', null, null, 'M', '2000-01-01', null, '012345646', null, 'samgmailcom', null, null, null, null, 'Samsethy', '1', '2023-01-12 10:10:28', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('100', '1', null, null, 'M', '2000-01-01', null, '012345646', null, 'samgmailcom', null, null, null, null, 'Samsethy', '1', '2023-01-12 10:10:28', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('101', '1', null, null, 'M', '2000-01-01', null, '012345646', null, 'samgmailcom', null, null, null, null, 'Samsethy', '1', '2023-01-12 10:10:29', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('102', '1', null, null, 'M', '2000-01-01', null, '012345646', null, 'samgmailcom', null, null, null, null, 'Samsethy', '1', '2023-01-12 10:10:29', 'Samsethy', '1', '2023-02-22 04:43:50', null, null, null);
INSERT INTO `persons` VALUES ('103', '1', null, null, 'M', '2000-01-01', null, '012345646', null, 'samgmailcom', null, null, null, null, 'Samsethy', '1', '2023-01-12 10:10:41', 'Samsethy', '1', '2023-01-14 22:29:45', null, null, null);
INSERT INTO `persons` VALUES ('104', '1', null, null, 'M', '2000-01-01', null, '012345646', null, 'samgmailcom', null, null, null, null, 'Samsethy', '1', '2023-01-12 13:48:25', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('105', '1', '', 'dfgdfhf', 'F', null, '14', '02334534543', null, null, null, null, null, null, 'Samsethy', '1', '2023-01-19 18:27:48', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('106', '1', '', 'sadsfd', 'F', '2023-01-02', '14', '012324332', null, null, null, null, null, null, 'Samsethy', '1', '2023-01-19 18:36:28', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('107', '1', '', 'sdfgdgf', 'F', null, '14', '02324', null, null, null, null, null, null, 'Samsethy', '1', '2023-02-09 07:40:25', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('108', '1', 'pov', 'srey', 'F', null, '14', '01255665', null, null, null, null, null, null, 'Samsethy', '1', '2023-02-22 06:19:49', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('109', '1', '', 'jghjghjg', 'F', null, '14', '012324235', null, null, null, null, null, null, 'Samsethy', '1', '2023-02-22 06:45:38', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('110', '1', '', 'Dyna', 'F', null, '14', '01325435', null, null, null, null, null, null, 'Samsethy', '1', '2023-02-22 06:47:42', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('111', '1', '', 'Daravan', 'M', '2023-03-06', '14', '012435455', null, null, 'sdfsdgdg', null, null, null, 'Samsethy', '1', '2023-03-06 11:36:39', 'Samsethy', '1', '2023-03-06 13:23:05', null, null, null);
INSERT INTO `persons` VALUES ('112', '1', '', 'HKKK', 'M', '2023-01-08', '14', '012456575', null, null, null, null, null, null, 'Samsethy', '1', '2023-03-06 14:01:22', 'Samsethy', '1', '2023-03-06 14:14:40', null, null, null);
INSERT INTO `persons` VALUES ('113', '1', 'Sophana', 'Sin', 'F', '2022-09-11', '14', '0234565756', null, null, null, null, null, null, 'Samsethy', '1', '2023-03-06 14:15:52', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('114', '1', '', 'Solika', 'F', '2023-02-05', '14', '012464565', null, null, null, null, null, null, 'Samsethy', '1', '2023-03-06 14:31:31', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('115', '1', '', 'Dyna', 'F', null, '14', '023546657567', null, null, null, null, null, null, 'Samsethy', '1', '2023-03-06 15:29:47', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('116', '1', '', 'Gonna', 'F', '2023-03-26', '14', '0123543546', null, null, null, null, null, null, 'Samsethy', '1', '2023-03-06 16:20:43', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('117', '1', 'THOUN', 'Samsethy', 'M', '2000-01-01', null, '012345646', null, 'samgmailcom', null, null, null, null, 'sam', '4', '2023-03-20 19:52:13', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('118', '1', '', 'GGG', 'F', '2022-12-05', '14', '011255671', null, null, null, null, null, null, 'Samsethy', '1', '2023-03-21 03:32:25', 'Samsethy', '1', '2023-03-21 03:44:24', null, null, null);
INSERT INTO `persons` VALUES ('119', '1', '', 'Dynano', 'F', '2023-03-05', '14', '0124565464', null, null, null, null, null, null, 'Samsethy', '1', '2023-03-31 12:45:55', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('120', '1', '', 'Sopheara', 'F', null, '14', '0112226735', null, null, null, null, null, null, 'Samsethy', '1', '2023-04-04 16:30:17', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('121', '1', '', 'Sinara', 'F', '2022-10-16', '14', '01111221', null, null, null, null, null, null, 'Samsethy', '1', '2023-04-08 22:42:16', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('122', '1', '', 'Sopan', 'F', '2023-02-12', '14', '01167661', null, null, null, null, null, null, 'Samsethy', '1', '2023-04-08 22:42:37', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('123', '1', '', 'Sotheara', 'F', '2023-04-02', '14', '015556765', null, null, null, null, null, null, 'Samsethy', '1', '2023-04-08 22:55:18', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('124', '1', '', 'DGdfgdfgfdh', 'F', '2023-04-02', '14', '01146456', null, null, null, null, null, null, 'Samsethy', '1', '2023-04-09 10:14:06', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('125', '1', 'one A', 'Some', 'F', '2022-02-06', '14', '011456456', null, null, null, null, null, null, 'Samsethy', '1', '2023-04-09 15:43:38', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('126', '1', '', 'sasfsd', 'M', '2023-04-09', '14', '012214234', null, null, null, null, null, null, 'Samsethy', '1', '2023-04-09 16:09:00', null, null, null, null, null, null);

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
  `inactive` int(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of positions
-- ----------------------------
INSERT INTO `positions` VALUES ('1', '1', '1', 'General Practicioner', '1', 'Admin', '1', 'Samsethy', '2023-01-12 14:41:13', '2022-11-16 12:21:45', null);
INSERT INTO `positions` VALUES ('2', '1', '1', 'Medical Doctor', '1', 'Admin', '1', 'Samsethy', '2023-01-12 14:41:32', '2022-11-16 12:21:45', null);
INSERT INTO `positions` VALUES ('3', '1', '1', 'Surgoen', '1', 'Admin', null, null, null, '2022-11-16 12:21:45', null);
INSERT INTO `positions` VALUES ('4', '1', '1', 'Accountant', '1', 'Admin', null, null, null, '2022-11-16 12:21:45', null);
INSERT INTO `positions` VALUES ('5', '1', '1', 'Medical Doctor', '1', 'Samsethy', null, null, null, '2023-01-12 14:41:38', null);
INSERT INTO `positions` VALUES ('7', '1', null, 'Medical Doctor', '1', 'Samsethy', null, null, null, '2023-01-12 14:52:26', null);
INSERT INTO `positions` VALUES ('8', '1', null, 'Medical Doctor', '1', 'Samsethy', null, null, null, '2023-01-12 14:52:30', null);
INSERT INTO `positions` VALUES ('9', '1', '2', 'Medical Doctor', '1', 'Samsethy', null, null, null, '2023-01-12 14:53:17', null);
INSERT INTO `positions` VALUES ('10', '1', '2', 'Medical Doctor', '1', 'Samsethy', null, null, null, '2023-01-12 14:53:18', null);

-- ----------------------------
-- Table structure for `prescriptions`
-- ----------------------------
DROP TABLE IF EXISTS `prescriptions`;
CREATE TABLE `prescriptions` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `ticket_id` int(10) NOT NULL,
  `patient_id` int(10) NOT NULL,
  `issue_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `consultant_id` int(10) NOT NULL,
  `remarks` varchar(200) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_user` varchar(50) DEFAULT NULL,
  `create_uid` int(6) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_uid` int(10) DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of prescriptions
-- ----------------------------

-- ----------------------------
-- Table structure for `prescription_items`
-- ----------------------------
DROP TABLE IF EXISTS `prescription_items`;
CREATE TABLE `prescription_items` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `presciption_id` int(10) NOT NULL,
  `item_id` int(10) NOT NULL,
  `usage` varchar(200) DEFAULT NULL,
  `duration` decimal(10,2) NOT NULL,
  `duration_unit` varchar(15) NOT NULL,
  `reason` varchar(150) DEFAULT NULL,
  `remarks` varchar(150) DEFAULT NULL,
  `qty` int(10) NOT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_user` varchar(50) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_uid` int(10) DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL,
  `sku` varchar(25) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT 0.00,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of prescription_items
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
INSERT INTO `queue_ticket_control` VALUES ('1', '1', '1', 'G', '2023-01-11', '1');
INSERT INTO `queue_ticket_control` VALUES ('1', '3', '1', 'G', '2023-01-19', '1');
INSERT INTO `queue_ticket_control` VALUES ('1', '1', '1', 'G', '2023-02-09', '1');
INSERT INTO `queue_ticket_control` VALUES ('1', '1', '1', 'G', '2023-02-21', '1');
INSERT INTO `queue_ticket_control` VALUES ('1', '8', '1', 'G', '2023-02-22', null);
INSERT INTO `queue_ticket_control` VALUES ('1', '3', '2', 'D', '2023-02-22', null);
INSERT INTO `queue_ticket_control` VALUES ('1', '1', '1', 'G', '2023-03-01', null);
INSERT INTO `queue_ticket_control` VALUES ('1', '9', '1', 'G', '2023-03-06', null);
INSERT INTO `queue_ticket_control` VALUES ('1', '6', '1', 'G', '2023-03-21', null);
INSERT INTO `queue_ticket_control` VALUES ('1', '1', '2', 'D', '2023-03-21', null);
INSERT INTO `queue_ticket_control` VALUES ('1', '1', '1', 'G', '2023-03-27', null);
INSERT INTO `queue_ticket_control` VALUES ('1', '1', '1', 'G', '2023-03-31', null);
INSERT INTO `queue_ticket_control` VALUES ('1', '1', '1', 'G', '2023-04-04', null);
INSERT INTO `queue_ticket_control` VALUES ('1', '1', '1', 'G', '2023-04-08', null);
INSERT INTO `queue_ticket_control` VALUES ('1', '1', '2', 'D', '2023-04-08', null);
INSERT INTO `queue_ticket_control` VALUES ('1', '1', '12', 'P', '2023-04-09', null);
INSERT INTO `queue_ticket_control` VALUES ('1', '4', '1', 'G', '2023-04-09', null);
INSERT INTO `queue_ticket_control` VALUES ('1', '1', '12', 'P', '2023-04-10', null);

-- ----------------------------
-- Table structure for `receipt_number_control`
-- ----------------------------
DROP TABLE IF EXISTS `receipt_number_control`;
CREATE TABLE `receipt_number_control` (
  `doc_class` varchar(25) NOT NULL,
  `com_branch_id` int(10) DEFAULT 0 COMMENT 'voucher_type = {income,expense,expenditure}',
  `branch_id` int(10) NOT NULL,
  `issue_year` int(10) NOT NULL,
  `prefix` varchar(10) DEFAULT NULL,
  `last_id` int(10) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of receipt_number_control
-- ----------------------------
INSERT INTO `receipt_number_control` VALUES ('tax_line', null, '1', '2023', 'P', '86');

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
-- Table structure for `reports1`
-- ----------------------------
DROP TABLE IF EXISTS `reports1`;
CREATE TABLE `reports1` (
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
-- Records of reports1
-- ----------------------------
INSERT INTO `reports1` VALUES ('1', '100', 'product items', 'Product Items report', 'Raw Materials', 'start_date|end_date', '4', '0');
INSERT INTO `reports1` VALUES ('2', '100', 'RM items', 'RM Items report', 'Raw Materials', 'loan_type_id|start_date|end_date', '3', '0');
INSERT INTO `reports1` VALUES ('3', '100', 'customer list', 'Customer List report', 'Sales', 'start_date|end_date', '5', '0');
INSERT INTO `reports1` VALUES ('4', '100', 'vendor list', 'Vendor List report', 'Accounting', 'start_date|end_date|loan_type_id|borrower_id|user_id', '2', '0');
INSERT INTO `reports1` VALUES ('5', '100', 'active customer list', 'Active Customers (last puchase last month)', 'Sales', 'start_date|end_date', '5', '0');
INSERT INTO `reports1` VALUES ('6', '100', 'PO by vendor', 'PO by Vendors/ by Dates', 'Raw Materials', 'loan_type_id', '5', '0');
INSERT INTO `reports1` VALUES ('7', '100', 'RM stock', 'RM Stock Report', 'Raw Materials', '', '1', '0');
INSERT INTO `reports1` VALUES ('0', '100', 'FG stock', 'FG Stock report', '', null, null, '0');
INSERT INTO `reports1` VALUES ('0', '100', 'expenses', 'Expenses report', '', null, null, '0');
INSERT INTO `reports1` VALUES ('0', '100', 'AP aging', 'AP Aging Report', '', null, null, '0');
INSERT INTO `reports1` VALUES ('0', '100', 'AR aging', 'AR Aging Report', '', null, null, '0');

-- ----------------------------
-- Table structure for `service_categories`
-- ----------------------------
DROP TABLE IF EXISTS `service_categories`;
CREATE TABLE `service_categories` (
  `id` int(10) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of service_categories
-- ----------------------------
INSERT INTO `service_categories` VALUES ('1', 'regular', 'regular service');
INSERT INTO `service_categories` VALUES ('2', 'consultation', 'consultation service');
INSERT INTO `service_categories` VALUES ('3', 'loyalty package', null);
INSERT INTO `service_categories` VALUES ('4', 'other', null);

-- ----------------------------
-- Table structure for `service_plans`
-- ----------------------------
DROP TABLE IF EXISTS `service_plans`;
CREATE TABLE `service_plans` (
  `id` int(10) NOT NULL,
  `branch_id` int(10) NOT NULL,
  `pmt_cycle` varchar(25) NOT NULL DEFAULT 'monthly',
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_user` varchar(50) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `photo_file_name` varchar(200) DEFAULT NULL,
  `currency_code` varchar(15) DEFAULT 'USD',
  `service_id` int(10) DEFAULT NULL COMMENT 'service_plan is also a service. This table link services to be service_plan',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of service_plans
-- ----------------------------

-- ----------------------------
-- Table structure for `service_plan_items`
-- ----------------------------
DROP TABLE IF EXISTS `service_plan_items`;
CREATE TABLE `service_plan_items` (
  `service_plan_id` int(10) NOT NULL,
  `service_id` int(10) NOT NULL,
  `max_sku` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'max number of sku of the service'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of service_plan_items
-- ----------------------------

-- ----------------------------
-- Table structure for `settings_invoice_currency`
-- ----------------------------
DROP TABLE IF EXISTS `settings_invoice_currency`;
CREATE TABLE `settings_invoice_currency` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `currency_code` varchar(10) NOT NULL,
  `exchange_rate` decimal(10,4) NOT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_uid` int(10) DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of settings_invoice_currency
-- ----------------------------
INSERT INTO `settings_invoice_currency` VALUES ('1', '1', 'USD', '4501.0000', '2023-02-14 11:42:54.000000', '1', 'Admin');

-- ----------------------------
-- Table structure for `settings_number`
-- ----------------------------
DROP TABLE IF EXISTS `settings_number`;
CREATE TABLE `settings_number` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `key` varchar(20) NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `description` varchar(150) DEFAULT NULL,
  `category` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of settings_number
-- ----------------------------
INSERT INTO `settings_number` VALUES ('1', '1', 'USE_TRACK_PREFIX', '1.00', 'Use Prefix for tracking number', null);
INSERT INTO `settings_number` VALUES ('3', '1', 'PRICE_PER_KG', '0.15', 'Delivery Fee per KG', null);
INSERT INTO `settings_number` VALUES ('4', '1', 'MULTI_WS_OP', '1.00', 'Multiple Warehouse Operation = 1 or 0. This denotes if the company has multiple branches in differrent locations or diffent offices ', null);
INSERT INTO `settings_number` VALUES ('13', '1', 'COD_FEE_PERCENT', '0.07', null, null);
INSERT INTO `settings_number` VALUES ('14', '1', 'EXCHANGE_RATE_BUY', '4100.00', null, null);
INSERT INTO `settings_number` VALUES ('15', '1', 'EXCHANGE_RATE_SELL', '4100.00', null, null);
INSERT INTO `settings_number` VALUES ('16', '0', 'DEFAULT_BASE_FEE', '1.20', null, null);

-- ----------------------------
-- Table structure for `settings_string`
-- ----------------------------
DROP TABLE IF EXISTS `settings_string`;
CREATE TABLE `settings_string` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `op_key` varchar(25) NOT NULL,
  `op_value` varchar(200) DEFAULT '',
  `description` varchar(150) DEFAULT NULL,
  `category` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of settings_string
-- ----------------------------
INSERT INTO `settings_string` VALUES ('1', '1', 'invoice_signer_name', 'Samsethy', null, null);
INSERT INTO `settings_string` VALUES ('2', '1', 'pmt_account_number', '00601893', null, null);
INSERT INTO `settings_string` VALUES ('3', '1', 'pmt_account_name', 'Samsethy', null, null);
INSERT INTO `settings_string` VALUES ('4', '1', 'pmt_bank_name', 'ABA', null, null);
INSERT INTO `settings_string` VALUES ('5', '1', 'invoice_base_currency', 'USD', null, null);
INSERT INTO `settings_string` VALUES ('6', '1', 'invoice_currency', 'USD', null, null);

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
-- Table structure for `test_labos`
-- ----------------------------
DROP TABLE IF EXISTS `test_labos`;
CREATE TABLE `test_labos` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `test_id` int(10) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `labo_id` int(10) NOT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_uid` int(10) DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `description` varchar(250) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `currency_code` varchar(10) DEFAULT NULL,
  `prefer_rank` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of test_labos
-- ----------------------------
INSERT INTO `test_labos` VALUES ('24', '27', '37.00', '4', '1', 'Samsethy', '2023-03-10 17:06:09.000000', null, null, null, null, '1', 'USD', '0');
INSERT INTO `test_labos` VALUES ('26', '32', '19.00', '6', '1', 'Samsethy', '2023-03-10 17:08:42.000000', null, null, null, null, '1', 'USD', '0');
INSERT INTO `test_labos` VALUES ('27', '27', '10.00', '6', '1', 'Samsethy', '2023-03-10 17:53:10.000000', null, null, null, null, '1', 'USD', '0');
INSERT INTO `test_labos` VALUES ('29', '32', '58.00', '4', '1', 'Samsethy', '2023-04-06 09:01:15.000000', null, null, null, null, '1', 'USD', '0');
INSERT INTO `test_labos` VALUES ('30', '27', '100.00', '1', '1', 'Samsethy', '2023-04-06 09:01:37.000000', null, null, null, null, '1', 'USD', '0');

-- ----------------------------
-- Table structure for `tickets`
-- ----------------------------
DROP TABLE IF EXISTS `tickets`;
CREATE TABLE `tickets` (
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
  `status_id` int(10) DEFAULT NULL COMMENT 'status_id = {1,2}.  status => "Waiting", "Serving","Served"',
  `priority` varchar(35) DEFAULT NULL,
  `schedule_type` varchar(35) DEFAULT NULL,
  `remarks` varchar(250) DEFAULT NULL,
  `com_branch_id` int(11) DEFAULT NULL,
  `invoice_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=133 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of tickets
-- ----------------------------
INSERT INTO `tickets` VALUES ('58', 'D100003', '2023-01-02 22:24:27.234849', 'Samsethy', '1', '83', '2', null, '2022-12-10', null, '1', '70', '63', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('59', 'D100004', '2023-01-02 22:24:27.234849', 'Samsethy', '1', '84', '2', null, '2022-12-10', '1', '1', null, '64', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('60', 'D100005', '2023-01-02 22:24:27.234849', 'Samsethy', '1', '85', '2', null, '2022-12-10', null, '1', '72', '65', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('61', 'D100006', '2023-01-02 22:24:27.234849', 'Samsethy', '1', '85', '2', null, '2022-12-10', null, '1', '72', '65', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('62', 'G100001', '2023-01-02 22:24:27.234849', 'Samsethy', '1', '85', '1', null, '2022-12-10', null, '1', '72', '65', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('63', 'D100007', '2023-01-02 22:24:27.234849', 'Samsethy', '1', '85', '2', null, '2022-12-10', null, '1', '72', '65', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('65', 'P100001', '2023-01-02 22:24:27.234849', 'Samsethy', '1', '87', '3', null, '2022-12-10', null, '1', '74', '67', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('66', 'D100009', '2023-01-02 22:24:27.234849', 'Samsethy', '1', '88', '2', null, '2022-12-10', null, null, '89', '68', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('67', 'D100001', '2023-01-02 22:24:27.234849', 'Samsethy', '1', '90', '2', null, '2022-12-11', '2', null, '91', '70', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('68', 'D100002', '2023-01-02 22:24:27.234849', 'Samsethy', '1', '89', '2', null, '2022-12-11', null, null, '87', '69', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('69', 'D100003', '2023-01-02 22:24:27.234849', 'Samsethy', '1', '89', '2', null, '2022-12-11', null, null, '83', '69', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('70', 'D100004', '2023-01-02 22:24:27.234849', 'Samsethy', '1', '89', '2', null, '2022-12-11', null, null, '86', '69', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('71', 'D100005', '2023-01-02 22:24:27.234849', 'Samsethy', '1', '91', '2', null, '2022-12-11', '1', '1', '92', '71', '1', null, 'On Demand', 'asdsfsdgdgdfg', null, null);
INSERT INTO `tickets` VALUES ('72', 'D100006', '2023-01-02 22:24:27.234849', 'Samsethy', '1', '91', '2', null, '2022-12-11', '2', '1', '92', '71', '1', null, 'On Demand', 'asdsfsdgdgdfg', null, null);
INSERT INTO `tickets` VALUES ('73', 'D100007', '2023-01-02 22:24:27.234849', 'Samsethy', '1', '91', '2', null, '2022-12-11', '2', '1', '92', '71', '1', null, 'On Demand', 'asdsfsdgdgdfg', null, null);
INSERT INTO `tickets` VALUES ('74', 'D100008', '2023-01-02 22:24:27.234849', 'Samsethy', '1', '91', '2', null, '2022-12-11', '2', '1', '92', '71', '1', null, 'On Demand', 'asdsfsdgdgdfg', null, null);
INSERT INTO `tickets` VALUES ('75', 'P100001', '2023-01-02 22:24:27.234849', 'Samsethy', '1', '92', '3', null, '2022-12-12', '1', '1', null, '72', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('87', 'D100001', '2023-01-05 09:58:10.000000', 'Samsethy', '1', '101', '2', null, '2023-01-05', '1', '1', '109', '86', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('88', 'D100002', '2023-01-05 10:30:13.000000', 'Samsethy', '1', '102', '2', null, '2023-01-05', '1', '1', '110', '87', '1', null, 'On Demand', 'xcvdcgdgdf', null, null);
INSERT INTO `tickets` VALUES ('89', 'G100001', '2023-01-11 16:17:54.000000', 'Samsethy', '1', '103', '1', null, '2023-01-11', '1', '1', '111', '88', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('90', 'G100001', '2023-01-19 18:27:48.000000', 'Samsethy', '1', '104', '1', null, '2023-01-19', '1', '1', null, '105', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('91', 'G100002', '2023-01-19 18:32:32.000000', 'Samsethy', '1', '104', '1', null, '2023-01-19', '1', '1', null, '105', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('92', 'G100003', '2023-01-19 18:36:28.000000', 'Samsethy', '1', '105', '1', null, '2023-01-19', '2', '1', null, '106', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('93', 'G100001', '2023-02-09 07:40:26.000000', 'Samsethy', '1', '106', '1', null, '2023-02-09', '2', '1', null, '107', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('95', 'G100002', '2023-02-22 06:30:51.000000', 'Samsethy', '1', '107', '1', null, '2023-02-22', '1', '1', '128', '108', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('96', 'G100003', '2023-02-22 06:32:47.000000', 'Samsethy', '1', '107', '1', null, '2023-02-22', '1', '1', '128', '108', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('97', 'G100004', '2023-02-22 06:33:43.000000', 'Samsethy', '1', '107', '1', null, '2023-02-22', '2', '1', '128', '108', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('98', 'G100005', '2023-02-22 06:34:36.000000', 'Samsethy', '1', '107', '1', null, '2023-02-22', '1', '1', '128', '108', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('99', 'D100001', '2023-02-22 06:34:46.000000', 'Samsethy', '1', '107', '2', null, '2023-02-22', '2', '1', '128', '108', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('100', 'G100006', '2023-02-22 06:37:28.000000', 'Samsethy', '1', '108', '1', null, '2023-02-22', '2', '1', '129', '87', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('102', 'G100007', '2023-02-22 06:45:38.000000', 'Samsethy', '1', '110', '1', null, '2023-02-22', '1', '1', null, '109', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('103', 'D100003', '2023-02-22 06:47:42.000000', 'Samsethy', '1', '111', '2', null, '2023-02-22', '1', '1', null, '110', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('104', 'G100008', '2023-02-22 08:06:03.000000', 'Samsethy', '1', '108', '1', null, '2023-02-22', '1', '1', '133', '87', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('114', 'G100009', '2023-03-06 16:20:43.000000', 'Samsethy', '1', '119', '1', null, '2023-03-06', '1', '1', null, '116', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('115', 'G100001', '2023-03-21 03:34:47.000000', 'Samsethy', '1', '120', '1', null, '2023-03-21', null, '1', '195', '118', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('116', 'G100002', '2023-03-21 03:35:01.000000', 'Samsethy', '1', '120', '1', null, '2023-03-21', null, '1', '195', '118', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('117', 'G100003', '2023-03-21 03:40:01.000000', 'Samsethy', '1', '120', '1', null, '2023-03-21', null, '1', '195', '118', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('118', 'G100004', '2023-03-21 03:41:08.000000', 'Samsethy', '1', '120', '1', null, '2023-03-21', null, '1', '195', '118', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('119', 'G100005', '2023-03-21 03:43:09.000000', 'Samsethy', '1', '120', '1', null, '2023-03-21', null, '1', '195', '118', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('120', 'G100006', '2023-03-21 03:56:21.000000', 'Samsethy', '1', '118', '1', null, '2023-03-21', '1', '1', '193', '115', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('126', 'D100001', '2023-04-08 22:55:18.000000', 'Samsethy', '1', '125', '2', null, '2023-04-08', null, '1', null, '123', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('128', 'G100001', '2023-04-09 10:39:51.000000', 'Samsethy', '1', '122', '1', null, '2023-04-09', null, '1', null, '120', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('129', 'G100002', '2023-04-09 10:41:35.000000', 'Samsethy', '1', '121', '1', null, '2023-04-09', '1', '1', null, '119', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('130', 'G100003', '2023-04-09 10:42:45.000000', 'Samsethy', '1', '117', '1', null, '2023-04-09', null, '1', null, '66', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('131', 'G100004', '2023-04-09 15:44:20.000000', 'Samsethy', '1', '127', '1', null, '2023-04-09', '1', '1', '211', '125', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('132', 'P100001', '2023-04-10 10:13:49.982123', 'Samsethy', '1', '127', '12', null, '2023-04-10', '1', '1', null, '125', '4', null, 'On Demand', null, null, '133');

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
INSERT INTO `ticket_statuses` VALUES ('2', '1', 'Serving');
INSERT INTO `ticket_statuses` VALUES ('3', '1', 'Served');
INSERT INTO `ticket_statuses` VALUES ('4', '1', 'Payment');
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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_uid` int(11) DEFAULT NULL,
  `create_uid` int(11) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT curtime(),
  PRIMARY KEY (`branch_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of um_branches
-- ----------------------------
INSERT INTO `um_branches` VALUES ('1', 'ESTHEDERM CLINIC', 'ESTHEDERM CLINIC', '1_logo_20230323_040355.jpg', 'jpg', '#458 Street 24BT Sangkat Boeung Tompon Khan Meanchey Phnom Penh Cambodia', '012222333', 'solida', null, null, null, null, null, null, 'ផ្ទះលេខ៤៥៨ ផ្លូវ២៤BT សង្កាត់បឹងទំពន់ ខណ្ឌមានជ័យ រាធធានីភ្នំពេញ', 'infopucedukh', 'admin@gmail.com', '2023-03-23 04:11:55.582346', null, '2023-02-02 10:51:33', null, null, '2023-03-25 20:39:28');

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
) ENGINE=InnoDB AUTO_INCREMENT=2033 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of um_sessions
-- ----------------------------
INSERT INTO `um_sessions` VALUES ('1840', '1', 'DXM20FKAEFC711EH2E7C9801A7BZD311', 'Bory', '2', '2023-02-02 11:04:47', '2023-02-02 11:04:47', 'TWY286rzc1Oucpp07znsiww3n89D8dF5UkwK8P', 'ukswNQRSy9ek72svrQlPHIs8RGQu68D3oMXCJ8', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpaXMiOm51bGwsImF1ZCI6bnVsbCwiaWF0IjoxNjc1MzEwNjg3LCJuYmYiOjE2NzUzMTA2ODcsImV4cCI6MTY3NTMxNDI4NywibGFuZyI6ImVuIiwiaWQiOjIsInVzZXJfY2xhc3MiOiJhZG1pbiIsIm9mZmljaWFsX2lkIjpudWxsLCJvZmZpY2lhbF9jb2RlIjpudWxsLCJsb2dpbl9uYW1lIjoiQm9yeSIsImJyYW5jaF9pZCI6MSwiZnVsbF9uYW1lIjoiQm9yeSIsInN0YXR1cyI6ImFjdGl2ZSIsImlzX2xvY2tlZCI6MCwiZW1haWwiOm51bGwsInBob25lX251bWJlciI6bnVsbCwib3RwX2NvZGUiOm51bGx9.YsJr6g2Lqu2QLmArmZ3-tTLHU7jP2ceDspbDvCXD4Zg', null, 'en');
INSERT INTO `um_sessions` VALUES ('1982', '1', 'DXM20FKAEFC711EH2E7C9801A7BZD311', 'sam', '4', '2023-03-20 19:49:20', '2023-03-20 19:49:20', '203n6I9eh82Ulmi32FAlGOpaNJ2vooN5w634oU', 'S9wjDJs5CWk9Yf1PhM578wndkcaoCx8EHpn9kD', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpaXMiOm51bGwsImF1ZCI6bnVsbCwiaWF0IjoxNjc5MzE2NTYwLCJuYmYiOjE2NzkzMTY1NjAsImV4cCI6MTY3OTMyNzM2MCwibGFuZyI6ImVuIiwiaWQiOjQsInVzZXJfY2xhc3MiOiJhZG1pbiIsIm9mZmljaWFsX2lkIjpudWxsLCJvZmZpY2lhbF9jb2RlIjpudWxsLCJsb2dpbl9uYW1lIjoic2FtIiwiYnJhbmNoX2lkIjoxLCJmdWxsX25hbWUiOiJzYW0iLCJzdGF0dXMiOiJhY3RpdmUiLCJpc19sb2NrZWQiOjAsImVtYWlsIjpudWxsLCJwaG9uZV9udW1iZXIiOm51bGwsIm90cF9jb2RlIjpudWxsfQ.FQBl_5dutCxYYSw8ByBJDeV_a5r4cuoTF5vqm2kCPWk', null, 'en');
INSERT INTO `um_sessions` VALUES ('2032', '1', 'DXM20FKAEFC711EH2E7C9801A7BZD311', 'admin@gmail.com', '1', '2023-04-10 11:01:10', '2023-04-10 11:01:10', '85ww767MTGAdhJ1fG7aKvE7auAGYB1Jx16BBmV', 'BvH5rz49S4feU1Bwtlp34Cocfgoqfx8246q8H6', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpaXMiOm51bGwsImF1ZCI6bnVsbCwiaWF0IjoxNjgxMDk5MjcwLCJuYmYiOjE2ODEwOTkyNzAsImV4cCI6MTY4MTE0MzA3MCwibGFuZyI6ImVuIiwiaWQiOjEsInVzZXJfY2xhc3MiOiJhZG1pbiIsIm9mZmljaWFsX2lkIjpudWxsLCJvZmZpY2lhbF9jb2RlIjoiMDAwMSIsImxvZ2luX25hbWUiOiJhZG1pbkBnbWFpbC5jb20iLCJicmFuY2hfaWQiOjEsImZ1bGxfbmFtZSI6IlNhbXNldGh5Iiwic3RhdHVzIjoiYWN0aXZlIiwiaXNfbG9ja2VkIjowLCJlbWFpbCI6bnVsbCwicGhvbmVfbnVtYmVyIjoiMDEyNTc4OTAiLCJvdHBfY29kZSI6bnVsbH0.-78K4cken_wDgNwFN20tzSwH-FZJqZrf5YytQXRtrVo', null, 'en');

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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of um_users
-- ----------------------------
INSERT INTO `um_users` VALUES ('1', 'admin@gmail.com', '01257890', null, '$2y$10$9s0nFmOKK6xEc8c63nT7KeQSGb4UoUio39dTBoQKrArZ3TlRh7LYK', '2023-02-17 10:59:01.040229', 'DXM20FKAEFC711EH2E7C9801A7BZD311', null, '1', 'Admin', '0', 'active', 'Samsethy', null, 'admin', 'admin@gmail.com', '3', '2021-09-13 04:00:26', '0001', null, null, 'en', '2023-02-02 11:01:45');
INSERT INTO `um_users` VALUES ('2', 'Bory', null, null, '$2y$10$L7GTLkc8nljBQlTXBe8Pb.iYD7WohbkziOO5BpH1VqXb/.Z/CObx2', null, 'DXM20FKAEFC711EH2E7C9801A7BZD311', null, '1', 'standard', '0', 'active', 'Bory', null, 'admin', 'Samsethy', '1', null, null, null, null, 'en', '2023-02-02 11:01:53');
INSERT INTO `um_users` VALUES ('3', 'Admin1', null, null, '$2y$10$i9dEkdttYHGKXuUBS2a23.IDs30JcUhC5f/cdcLzzdogBfiHLIzi2', null, 'DXM20FKAEFC711EH2E7C9801A7BZD311', null, '1', 'standard', '0', 'active', 'Admin1', null, 'admin', 'Samsethy', '1', null, null, null, null, 'en', '2023-02-02 11:03:48');
INSERT INTO `um_users` VALUES ('4', 'sam', null, null, '$2y$10$PIDtZi/IXS8kdAhxErHbFOayAP0ehJ8jxBo.s2tJiN1NqonlSvehe', null, 'DXM20FKAEFC711EH2E7C9801A7BZD311', null, '1', 'standard', '0', 'active', 'sam', null, 'admin', 'Samsethy', '1', null, null, null, null, 'en', '2023-03-20 19:49:07');

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
INSERT INTO `um_user_roles` VALUES ('2', '2', 'DXM20FKAEFC711EH2E7C9801A7BZD311', '0', '1');
INSERT INTO `um_user_roles` VALUES ('3', '2', 'DXM20FKAEFC711EH2E7C9801A7BZD311', '0', '1');
INSERT INTO `um_user_roles` VALUES ('4', '2', 'DXM20FKAEFC711EH2E7C9801A7BZD311', '0', '1');

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
-- Table structure for `vendors`
-- ----------------------------
DROP TABLE IF EXISTS `vendors`;
CREATE TABLE `vendors` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `name` varchar(150) NOT NULL,
  `phone_number` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `city_id` int(10) DEFAULT NULL,
  `country_id` int(10) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `billing_address` varchar(200) DEFAULT NULL,
  `vendor_type_id` int(10) DEFAULT NULL,
  `tax_number` varchar(25) DEFAULT NULL,
  `currency_code` varchar(10) DEFAULT NULL,
  `person_id` int(10) DEFAULT NULL,
  `photo_file_name` varchar(200) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of vendors
-- ----------------------------
INSERT INTO `vendors` VALUES ('1', '1', 'General Vendor', '023767676', 'gen@gmail.com', null, null, null, null, null, '2023-04-07 19:12:05.200330', null, '1', null, null, null, null, '1', 'Samsethy', '2023-04-07 19:12:05.000000');
INSERT INTO `vendors` VALUES ('2', '1', 'Phear', '012456456', 'dd@gmail.com', null, null, null, '1', 'Samsethy', '2023-04-07 19:11:33.666045', null, '4', null, null, null, null, '1', 'Samsethy', '2023-04-07 19:11:33.000000');

-- ----------------------------
-- Table structure for `vendor_types`
-- ----------------------------
DROP TABLE IF EXISTS `vendor_types`;
CREATE TABLE `vendor_types` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `description` varchar(100) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_user` varchar(50) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_uid` int(10) DEFAULT NULL,
  `branch_id` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of vendor_types
-- ----------------------------
INSERT INTO `vendor_types` VALUES ('1', 'Local', '1', 'Samsethy', '2023-04-07 19:12:00.000000', null, '2023-04-07 19:12:00.563361', null, null);
INSERT INTO `vendor_types` VALUES ('2', 'Foreign', '1', 'Samsethy', '2023-04-07 18:47:11.000000', null, '2023-04-07 18:47:11.088901', null, null);
INSERT INTO `vendor_types` VALUES ('4', 'New oneDD', '1', 'Samsethy', '2023-04-07 18:32:00.000000', 'Samsethy', '2023-04-07 18:32:00.208628', '1', '1');
INSERT INTO `vendor_types` VALUES ('14', 'ggg', null, null, null, 'Samsethy', '2023-04-07 18:40:43.000000', '1', '1');

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
-- Table structure for `warehouses`
-- ----------------------------
DROP TABLE IF EXISTS `warehouses`;
CREATE TABLE `warehouses` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `name` varchar(150) NOT NULL,
  `loc_lng` decimal(10,0) DEFAULT NULL,
  `loc_lat` decimal(10,0) DEFAULT NULL,
  `address` varchar(250) DEFAULT NULL,
  `loc_city_id` int(10) DEFAULT NULL,
  `loc_country_id` int(10) DEFAULT NULL,
  `loc_district_id` int(10) DEFAULT NULL,
  `loc_commune_id` int(10) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_uid` int(10) DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of warehouses
-- ----------------------------
INSERT INTO `warehouses` VALUES ('1', '1', 'Main warehouse', '0', '0', null, null, null, null, null, null, null, null, null, null, null);

-- ----------------------------
-- Table structure for `warehouse_to_warehouse`
-- ----------------------------
DROP TABLE IF EXISTS `warehouse_to_warehouse`;
CREATE TABLE `warehouse_to_warehouse` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `warehouse_id` int(10) NOT NULL,
  `trx_id` int(10) NOT NULL,
  `auth_user` varchar(50) DEFAULT NULL,
  `auth_time` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `auth_uid` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of warehouse_to_warehouse
-- ----------------------------

-- ----------------------------
-- Table structure for `warehouse_transactions`
-- ----------------------------
DROP TABLE IF EXISTS `warehouse_transactions`;
CREATE TABLE `warehouse_transactions` (
  `id` int(10) NOT NULL,
  `warehouse_id` int(10) NOT NULL,
  `trx_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `qty` int(10) NOT NULL,
  `sku` varchar(30) NOT NULL,
  `po_id` int(10) DEFAULT NULL,
  `item_id` int(10) NOT NULL,
  `item_code` varchar(30) DEFAULT NULL,
  `local_code` varchar(30) DEFAULT NULL,
  `expire_date` date DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `trx_type_id` int(10) DEFAULT NULL COMMENT 'trx_type_id = 1= receive PO, 2 = transfer to shop, 3 = transfer to other warehouse, 4 = returned to vendor, 5 = disposal, 6 = take for operational Internal usage, 7 = take into WIP,  6 = takeout for other reason such as Charity',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of warehouse_transactions
-- ----------------------------

 