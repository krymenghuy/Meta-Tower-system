/*
Navicat MySQL Data Transfer

Source Server         : connection1
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : mclinic_db

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2023-05-23 10:37:11
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `accounts`
-- ----------------------------
DROP TABLE IF EXISTS `accounts`;
CREATE TABLE `accounts` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `name` varchar(250) NOT NULL,
  `code` varchar(20) NOT NULL,
  `account_type_id` int(10) NOT NULL,
  `detail_type_id` int(10) DEFAULT NULL,
  `currency_code` varchar(10) NOT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_uid` int(10) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `inactive` tinyint(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of accounts
-- ----------------------------

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
  `q_date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=237 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of appointments
-- ----------------------------
INSERT INTO `appointments` VALUES ('224', '1', '2', '2023-04-24', '2023-04-30 09:00:00', 'sdsdfdsfdsf', 'ABC P', '011334546', 'sss@gmail.com', null, '2', '103', null, '0', 'Samsethy', '1', '2023-04-24 18:00:37.000000', 'Samsethy', '1', '2023-04-30 15:49:09', 'M', '1', '', 'On demand', 'Normal', null);
INSERT INTO `appointments` VALUES ('225', '1', '2', '2023-04-24', '2023-04-24 00:00:00', 'sdfdgfd', 'new lead', '01123435', 'lead@gmail.com', null, '2', '104', null, '0', 'Samsethy', '1', '2023-04-24 18:21:18.000000', null, null, null, 'M', '1', '', 'On demand', 'Normal', null);
INSERT INTO `appointments` VALUES ('232', '1', '2', '2023-04-28', '2023-04-27 01:10:23', null, 'Liza', '0123454645', null, null, '2', '111', null, '144', 'Samsethy', '1', '2023-04-27 01:10:09.000000', null, null, null, 'F', '3', '', 'On demand', 'Normal', '2023-04-27');
INSERT INTO `appointments` VALUES ('233', '1', '2', '2023-04-28', '2023-04-30 18:09:41', 'SDFDSGFD', 'new name', '0124354365', null, null, '2', '112', null, '145', 'Samsethy', '1', '2023-04-27 01:11:00.000000', null, null, null, 'M', '3', '', 'On demand', 'Normal', '2023-04-27');
INSERT INTO `appointments` VALUES ('234', '1', '2', '2023-04-28', '2023-04-29 13:46:01', 'dfdfgf', 'Super p1', '012345346', null, null, '2', '113', null, '146', 'Samsethy', '1', '2023-04-27 17:53:20.000000', null, null, null, 'M', '3', '', 'On demand', 'Normal', '2023-04-27');
INSERT INTO `appointments` VALUES ('235', '1', '2', '2023-04-28', '2023-04-27 18:48:42', null, 'Sopheara sdsfds', 'fdsdfsdg', 'sdfsdfdsdfdsg email', null, '0', '114', null, '0', 'Samsethy', '1', '2023-04-27 18:48:42.000000', null, null, null, 'M', '1', '', 'On demand', 'Normal', null);

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
) ENGINE=InnoDB AUTO_INCREMENT=94 DEFAULT CHARSET=utf8mb4;

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
INSERT INTO `appt_chief_complaints` VALUES (null, '12', '1', 'Samsethy', '2023-04-11 12:52:46.000000', '133', 'sdfsdgfdg', '38', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES (null, '12', '1', 'Samsethy', '2023-04-13 15:42:28.000000', '135', 'sdfsdgfdg', '39', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES (null, '14', '1', 'Samsethy', '2023-04-13 15:42:32.000000', '135', 'dgsdfgdfhf', '40', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES (null, '10', '1', 'Samsethy', '2023-04-14 01:01:02.000000', '136', 'Facial Acne', '41', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES (null, '13', '1', 'Samsethy', '2023-04-14 01:01:08.000000', '136', 'ggghh', '42', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES (null, '12', '1', 'Samsethy', '2023-04-14 01:01:20.000000', '136', 'sdfsdgfdg', '43', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES (null, '10', '1', 'Samsethy', '2023-04-16 22:15:13.000000', '138', 'Facial Acne', '44', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES (null, '12', '1', 'Samsethy', '2023-04-16 22:15:15.000000', '138', 'sdfsdgfdg', '45', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES (null, '10', '1', 'Samsethy', '2023-04-16 22:16:59.000000', '138', 'Facial Acne', '46', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES (null, '11', '1', 'Samsethy', '2023-04-16 22:17:01.000000', '138', 'Im too beautiful ', '47', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES (null, '10', '1', 'Samsethy', '2023-04-16 22:17:03.000000', '138', 'Facial Acne', '48', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES (null, '11', '1', 'Samsethy', '2023-04-16 22:17:05.000000', '138', 'Im too beautiful ', '49', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES (null, '10', '1', 'Samsethy', '2023-04-16 22:17:08.000000', '138', 'Facial Acne', '50', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES (null, '13', '1', 'Samsethy', '2023-04-16 22:17:14.000000', '138', 'ggghh', '51', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES (null, '12', '1', 'Samsethy', '2023-04-16 22:21:47.000000', '138', 'sdfsdgfdg', '52', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('214', '2', '1', 'Samsethy', '2023-04-21 23:13:06.000000', null, null, '53', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('214', '5', '1', 'Samsethy', '2023-04-21 23:13:06.000000', null, null, '54', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('215', '2', '1', 'Samsethy', '2023-04-21 23:24:24.000000', null, null, '55', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('215', '1', '1', 'Samsethy', '2023-04-21 23:24:24.000000', null, null, '56', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('216', '3', '1', 'Samsethy', '2023-04-21 23:26:49.636631', '146', null, '57', null, null, '2023-04-21 23:26:49.636631');
INSERT INTO `appt_chief_complaints` VALUES ('216', '1', '1', 'Samsethy', '2023-04-21 23:26:49.636631', '146', null, '58', null, null, '2023-04-21 23:26:49.636631');
INSERT INTO `appt_chief_complaints` VALUES ('217', '2', '1', 'Samsethy', '2023-04-21 23:47:31.000000', null, null, '59', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES (null, '3', '1', 'Samsethy', '2023-04-21 23:49:41.000000', '147', null, '60', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('218', '2', '1', 'Samsethy', '2023-04-23 22:36:57.354852', '148', null, '61', null, null, '2023-04-23 22:36:57.354852');
INSERT INTO `appt_chief_complaints` VALUES ('218', '1', '1', 'Samsethy', '2023-04-23 22:36:57.354852', '148', null, '62', null, null, '2023-04-23 22:36:57.354852');
INSERT INTO `appt_chief_complaints` VALUES ('219', '1', '1', 'Samsethy', '2023-04-23 23:28:04.199727', '149', null, '63', null, null, '2023-04-23 23:28:04.199727');
INSERT INTO `appt_chief_complaints` VALUES ('219', '3', null, null, null, null, null, '64', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('219', '5', null, null, null, null, null, '65', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('220', '4', '1', 'Samsethy', '2023-04-24 00:04:25.544061', '150', null, '66', null, null, '2023-04-24 00:04:25.544061');
INSERT INTO `appt_chief_complaints` VALUES ('221', '3', '1', 'Samsethy', '2023-04-24 01:17:30.000000', null, null, '67', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('222', '2', '1', 'Samsethy', '2023-04-24 01:28:51.000000', null, null, '68', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('222', '4', '1', 'Samsethy', '2023-04-24 01:28:51.000000', null, null, '69', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('223', '2', '1', 'Samsethy', '2023-04-24 09:35:29.000000', null, null, '70', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('223', '4', '1', 'Samsethy', '2023-04-24 09:35:29.000000', null, null, '71', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('224', '2', '1', 'Samsethy', '2023-04-24 18:00:37.000000', null, null, '72', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('224', '1', '1', 'Samsethy', '2023-04-24 18:00:37.000000', null, null, '73', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('225', '3', '1', 'Samsethy', '2023-04-24 18:21:18.000000', null, null, '74', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('225', '1', '1', 'Samsethy', '2023-04-24 18:21:18.000000', null, null, '75', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('226', '15', '1', 'Samsethy', '2023-04-27 00:26:39.000000', null, null, '76', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('226', '14', '1', 'Samsethy', '2023-04-27 00:26:39.000000', null, null, '77', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('227', '2', '1', 'Samsethy', '2023-04-27 00:50:10.000000', null, null, '79', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('228', '2', '1', 'Samsethy', '2023-04-27 00:58:35.000000', null, null, '80', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('228', '1', '1', 'Samsethy', '2023-04-27 00:58:35.000000', null, null, '81', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('229', '2', '1', 'Samsethy', '2023-04-27 01:02:07.000000', null, null, '82', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('230', '3', '1', 'Samsethy', '2023-04-27 01:06:23.000000', null, null, '83', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('230', '2', '1', 'Samsethy', '2023-04-27 01:06:23.000000', null, null, '84', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('231', '3', '1', 'Samsethy', '2023-04-27 01:08:51.000000', null, null, '85', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('231', '1', '1', 'Samsethy', '2023-04-27 01:08:51.000000', null, null, '86', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('232', '4', '1', 'Samsethy', '2023-04-27 01:10:09.000000', null, null, '87', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('233', '3', '1', 'Samsethy', '2023-04-27 01:11:00.000000', null, null, '88', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('233', '1', '1', 'Samsethy', '2023-04-27 01:11:00.000000', null, null, '89', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES (null, '12', '1', 'Samsethy', '2023-04-27 10:28:45.000000', '161', 'sdfsdgfdg', '90', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES (null, '14', '1', 'Samsethy', '2023-04-27 10:28:47.000000', '161', 'dgsdfgdfhf', '91', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('234', '4', '1', 'Samsethy', '2023-04-27 17:53:20.000000', null, null, '92', null, null, null);
INSERT INTO `appt_chief_complaints` VALUES ('236', '4', '1', 'Samsethy', '2023-04-27 18:49:33.000000', null, null, '93', null, null, null);

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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4;

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
INSERT INTO `chief_complaints` VALUES ('15', '1', 'sdgsdgdg', '15', '2023-04-27 00:26:13.388041', 'Samsethy', '1', null, null, '2023-04-27 00:26:13.388041', null);

-- ----------------------------
-- Table structure for `client_discounts`
-- ----------------------------
DROP TABLE IF EXISTS `client_discounts`;
CREATE TABLE `client_discounts` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `client_id` int(10) NOT NULL,
  `branch_id` int(10) NOT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_user` varchar(50) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `discount` decimal(10,2) NOT NULL,
  `discount_type` varchar(15) NOT NULL DEFAULT 'percentage',
  `target_code` varchar(15) DEFAULT 'service' COMMENT 'target_code = the string that idicate whether dicount is applied to "product", "service", or "all"',
  `expiry_date` date DEFAULT NULL,
  `description` varchar(255) DEFAULT 'membership card' COMMENT 'description = membership card, coupon',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of client_discounts
-- ----------------------------

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
) ENGINE=InnoDB AUTO_INCREMENT=135 DEFAULT CHARSET=utf8mb4;

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
INSERT INTO `invoices` VALUES ('1', '131', '', 'V12023-00087', '2023-05-04 00:39:32.787725', null, '2023-04-10', '127', null, null, '011456456', '', 'USD', '4501.0000', 'active', null, null, '0.00', '2855.00', '0.00', '0.00', '0.00', '2855.00', '0.00', '125.0000', null, '', '0', null, null, '0', 'Samsethy', '2023-04-10 05:32:03', '1', '0', '2023-05-04 00:39:32', null, null, 'CI', null, null, 'ABA', 'Samsethy', '00601893', 'Samsethy', '0.00', '1', '2023-05-04 00:39:32.787725', 'Samsethy', '0.0000', '3.33', 'percentage', 'Medical');
INSERT INTO `invoices` VALUES ('1', '133', '', 'V12023-00089', '2023-04-24 15:25:53.831565', null, '2023-04-10', '127', null, null, '011456456', '', 'USD', '4501.0000', 'active', null, null, '0.00', '1785.00', '0.00', '0.00', '0.00', '1785.00', '220.00', '11.0000', null, '', '0', null, null, '0', 'Samsethy', '2023-04-10 10:13:49', '1', '0', '2023-04-24 15:25:53', null, null, 'CI', null, null, 'ABA', 'Samsethy', '00601893', 'Samsethy', '0.00', '1', '2023-04-24 15:25:53.831565', 'Samsethy', '0.0000', '5.00', 'percentage', 'Medical');

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
) ENGINE=InnoDB AUTO_INCREMENT=522 DEFAULT CHARSET=utf8mb4;

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
INSERT INTO `invoice_items` VALUES ('409', '1', '133', '245', 'Y Mycin A ', 'Y Mycin A ', 'Tube', '10.00', '100.00', '0.00', '0.00', null, '5.00', '50.00', '1050.00', '2023-04-12 01:05:47', '1', 'Samsethy', null, '2023-04-12 01:05:47', '2023-04-12 01:05:47', '0.00', 'percentage', null, 'Product');
INSERT INTO `invoice_items` VALUES ('410', '1', '133', '244', 'Y Mycin N', 'Y Mycin N', 'Tube', '3.00', '100.00', '0.00', '0.00', null, '5.00', '15.00', '315.00', '2023-04-12 01:05:47', '1', 'Samsethy', null, '2023-04-12 01:05:47', '2023-04-12 01:05:47', '0.00', 'percentage', null, 'Product');
INSERT INTO `invoice_items` VALUES ('411', '1', '133', '245', 'Y Mycin A ', 'Y Mycin A ', 'Tube', '1.00', '100.00', '0.00', '0.00', null, '5.00', '5.00', '105.00', '2023-04-12 01:05:47', '1', 'Samsethy', null, '2023-04-12 01:05:47', '2023-04-12 01:05:47', '0.00', 'percentage', null, 'Product');
INSERT INTO `invoice_items` VALUES ('412', '1', '133', '245', 'Y Mycin A ', 'Y Mycin A ', 'Tube', '1.00', '100.00', '0.00', '0.00', null, '5.00', '5.00', '105.00', '2023-04-12 01:05:47', '1', 'Samsethy', null, '2023-04-12 01:05:47', '2023-04-12 01:05:47', '0.00', 'percentage', null, 'Product');
INSERT INTO `invoice_items` VALUES ('413', '1', '133', '106', 'Whiteness Lightening Serum 80ml', 'Whiteness Lightening Serum 80ml', 'Bottle', '1.00', '100.00', '0.00', '0.00', null, '5.00', '5.00', '105.00', '2023-04-12 01:05:47', '1', 'Samsethy', null, '2023-04-12 01:05:47', '2023-04-12 01:05:47', '0.00', 'percentage', null, 'Product');
INSERT INTO `invoice_items` VALUES ('414', '1', '133', '106', 'Whiteness Lightening Serum 80ml', 'Whiteness Lightening Serum 80ml', 'Bottle', '1.00', '100.00', '0.00', '0.00', null, '5.00', '5.00', '105.00', '2023-04-12 01:05:47', '1', 'Samsethy', null, '2023-04-12 01:05:47', '2023-04-12 01:05:47', '0.00', 'percentage', null, 'Product');
INSERT INTO `invoice_items` VALUES ('519', '1', '131', '244', 'Y Mycin N', 'Y Mycin N', 'Tube', '15.00', '100.00', '0.00', '0.00', null, '5.00', '75.00', '1575.00', '2023-05-04 00:39:32', '1', 'Samsethy', null, '2023-05-04 00:39:32', '2023-05-04 00:39:32', '0.00', 'percentage', null, 'Product');
INSERT INTO `invoice_items` VALUES ('520', '1', '131', '245', 'Y Mycin A ', 'Y Mycin A ', 'Tube', '10.00', '100.00', '0.00', '0.00', null, '5.00', '50.00', '1050.00', '2023-05-04 00:39:32', '1', 'Samsethy', null, '2023-05-04 00:39:32', '2023-05-04 00:39:32', '0.00', 'percentage', null, 'Product');
INSERT INTO `invoice_items` VALUES ('521', '1', '131', '35', 'Package 1', 'Package 1', 'none', '1.00', '230.00', '0.00', '0.00', null, '0.00', '0.00', '230.00', '2023-05-04 00:39:32', '1', 'Samsethy', null, '2023-05-04 00:39:32', '2023-05-04 00:39:32', '0.00', 'percentage', null, 'Service');

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
INSERT INTO `invoice_number_control` VALUES ('tax_line', null, '1', '2023', '', '90');
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
  `pmt_method_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of invoice_payments
-- ----------------------------
INSERT INTO `invoice_payments` VALUES ('93', '1', '56', '2023-02-25 11:37:58.827754', '50.00', null, '1', '2023-02-25 11:37:58.827754', 'Samsethy', null, '2023-02-25 11:37:58.827754', null, 'USD', '1.00', '0.00', 'P12023-00084', '0.00', null, null);
INSERT INTO `invoice_payments` VALUES ('94', '1', '56', '2023-02-25 11:38:11.989372', '50.00', null, '1', '2023-02-25 11:38:11.989372', 'Samsethy', null, '2023-02-25 11:38:11.989372', null, 'USD', '1.00', '0.00', 'P12023-00085', '0.00', null, null);
INSERT INTO `invoice_payments` VALUES ('95', '1', '68', '2023-03-07 14:53:08.886449', '50.00', 'sdgdfgfd', '1', '2023-03-07 14:53:08.886449', 'Samsethy', null, '2023-03-07 14:53:08.886449', null, 'USD', '1.00', '2.50', 'P12023-00086', '0.00', null, null);
INSERT INTO `invoice_payments` VALUES ('96', '1', '133', '2023-04-13 00:00:00.000000', '100.00', null, '1', '2023-05-01 22:27:11.067086', 'Samsethy', '1', '2023-05-01 22:27:11.000000', 'Samsethy', 'USD', '1.00', '5.00', 'P12023-00087', '0.00', null, '3');
INSERT INTO `invoice_payments` VALUES ('97', '1', '133', '2023-04-24 15:25:53.820503', '120.00', null, '1', '2023-04-24 15:25:53.820503', 'Samsethy', null, '2023-04-24 15:25:53.820503', null, 'USD', '1.00', '6.00', 'P12023-00088', '0.00', null, '2');

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
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL DEFAULT '',
  `branch_id` int(10) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_user` varchar(50) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `name_kh` varchar(100) DEFAULT NULL,
  `item_class` varchar(10) DEFAULT 'MI',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=143 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_brands
-- ----------------------------
INSERT INTO `inv_brands` VALUES ('1', 'General Brand', '1', null, null, null, null, null, null, null, 'MI');
INSERT INTO `inv_brands` VALUES ('107', 'ab', '1', '2022-12-03 12:05:09.000000', 'Samsethy', '1', null, null, null, 'ab', 'MI');
INSERT INTO `inv_brands` VALUES ('108', 'dicta', '1', '2022-12-03 12:06:17.000000', 'Samsethy', '1', null, null, null, 'dicta', 'MI');
INSERT INTO `inv_brands` VALUES ('109', 'aut', '1', '2022-12-03 12:06:41.000000', 'Samsethy', '1', null, null, null, 'aut', 'MI');
INSERT INTO `inv_brands` VALUES ('110', 'rerum', '1', '2022-12-03 12:09:52.000000', 'Samsethy', '1', null, null, null, 'rerum', 'MI');
INSERT INTO `inv_brands` VALUES ('111', 'mollitia', '1', '2022-12-03 12:23:28.000000', 'Samsethy', '1', null, null, null, 'mollitia', 'MI');
INSERT INTO `inv_brands` VALUES ('112', 'aut', '1', '2022-12-03 12:24:41.000000', 'Samsethy', '1', null, null, null, 'aut', 'MI');
INSERT INTO `inv_brands` VALUES ('113', 'laborum', '1', '2022-12-03 12:24:51.000000', 'Samsethy', '1', null, null, null, 'laborum', 'MI');
INSERT INTO `inv_brands` VALUES ('114', 'quas', '1', '2023-05-22 09:17:52.726253', 'Samsethy', '1', '2023-05-22 09:17:52.000000', 'Samsethy', '1', 'quas', 'MI');
INSERT INTO `inv_brands` VALUES ('115', 'omnis BB', '1', '2023-05-22 00:57:49.144297', 'Samsethy', '1', '2023-05-22 00:57:49.000000', 'Samsethy', '1', 'omnis', 'MI');
INSERT INTO `inv_brands` VALUES ('117', 'minus', '1', '2022-12-03 12:31:27.000000', 'Samsethy', '1', null, null, null, 'minus', 'MI');
INSERT INTO `inv_brands` VALUES ('118', 'ratione NNNsdfdgfh BBB', '1', '2023-05-22 08:33:19.628878', 'Samsethy', '1', '2023-05-22 08:33:19.000000', 'Samsethy', '1', 'ratione', 'MI');
INSERT INTO `inv_brands` VALUES ('119', 'ducimus', '1', '2022-12-03 12:38:43.000000', 'Samsethy', '1', null, null, null, 'ducimus', 'MI');
INSERT INTO `inv_brands` VALUES ('120', 'illum', '1', '2022-12-07 09:56:45.000000', 'Samsethy', '1', null, null, null, 'illum', 'MI');
INSERT INTO `inv_brands` VALUES ('121', 'Vectorasoft', null, '2023-01-06 15:53:36.000000', 'Samsethy', '1', null, null, null, 'Vectorasoft', 'MI');
INSERT INTO `inv_brands` VALUES ('122', 'Vectorasoft', null, '2023-01-06 15:56:58.000000', 'Samsethy', '1', null, null, null, 'Vectorasoft', 'MI');
INSERT INTO `inv_brands` VALUES ('123', 'CC brand', '1', '2023-05-22 10:11:00.668579', 'Samsethy', '1', '2023-05-22 10:11:00.000000', 'Samsethy', '1', null, 'MI');
INSERT INTO `inv_brands` VALUES ('141', 'WOW', '1', '2023-05-22 10:06:33.000000', 'Samsethy', '1', null, null, null, null, 'MI');

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
  `qty` decimal(10,2) NOT NULL DEFAULT 0.00,
  `create_uid` int(10) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `uom` varchar(25) DEFAULT '',
  `last_count_date` date DEFAULT NULL,
  `warehouse_id` int(10) NOT NULL,
  `stockclass_code` varchar(25) NOT NULL,
  `sku` varchar(30) DEFAULT NULL,
  `expiration_date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_current_stocks
-- ----------------------------
INSERT INTO `inv_current_stocks` VALUES ('16', '1', '664', '10.00', null, null, null, 'Samsethy', '1', '2023-05-22 17:43:56.000000', 'tablet', null, '1', 'C', 'PRO-NEW -230522174356-FD7', null);
INSERT INTO `inv_current_stocks` VALUES ('17', '1', '664', '40.00', null, null, '2023-05-23 10:00:46.556673', 'Samsethy', '1', '2023-05-23 10:00:46.000000', 'tablet', null, '1', 'A', 'PRO-NEW -230523100046-936', null);

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
  `uom` varchar(15) NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_daily_stocks
-- ----------------------------
INSERT INTO `inv_daily_stocks` VALUES ('24', '1', 'C', '1', null, '664', '100201', 'tablet', '2023-05-22 17:43:56.000000', 'admin@gmail.com', '1', null, '0.00', '10.00', '0.00', '0.00', '0.00', '0.00', '0.00', '2023-05-22 17:43:56.119877', '2023-05-22 17:43:56.119877', '1', 'admin@gmail.com');
INSERT INTO `inv_daily_stocks` VALUES ('25', '1', 'A', '1', null, '664', '100201', 'tablet', '2023-05-22 17:44:14.000000', 'admin@gmail.com', '1', null, '0.00', '30.00', '0.00', '0.00', '0.00', '0.00', '0.00', '2023-05-22 17:44:14.015962', '2023-05-22 17:44:14.015962', '1', 'admin@gmail.com');
INSERT INTO `inv_daily_stocks` VALUES ('26', '1', 'A', '1', null, '664', '100201', 'tablet', '2023-05-23 10:00:46.000000', 'admin@gmail.com', '1', null, '30.00', '10.00', '0.00', '0.00', '0.00', '0.00', '0.00', '2023-05-23 10:00:46.525213', '2023-05-23 10:00:46.525213', '1', 'admin@gmail.com');

-- ----------------------------
-- Table structure for `inv_default_unit`
-- ----------------------------
DROP TABLE IF EXISTS `inv_default_unit`;
CREATE TABLE `inv_default_unit` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `uom` varchar(25) NOT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_user` varchar(50) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `usage` varchar(20) DEFAULT '' COMMENT 'usage must be {retail,wholesale,purchase}',
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_uid` int(10) DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL,
  `item_id` int(11) DEFAULT NULL,
  `unit_id` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_default_unit
-- ----------------------------
INSERT INTO `inv_default_unit` VALUES ('7', 'Tube', '2023-05-14 17:29:14.114279', 'Samsethy', '1', 'retail', '2023-05-14 17:29:14.000000', '1', 'Samsethy', '661', '30', '1');
INSERT INTO `inv_default_unit` VALUES ('8', '', '2023-05-14 17:29:14.143122', 'Samsethy', '1', 'purchase', '2023-05-14 17:29:14.000000', '1', 'Samsethy', '661', '37', '1');
INSERT INTO `inv_default_unit` VALUES ('9', 'Tube', '2023-05-20 12:09:19.681321', 'Samsethy', '1', 'retail', '2023-05-20 12:09:19.000000', '1', 'Samsethy', '662', '33', '1');
INSERT INTO `inv_default_unit` VALUES ('10', 'Tube', '2023-05-20 12:09:19.697170', 'Samsethy', '1', 'wholesale', '2023-05-20 12:09:19.000000', '1', 'Samsethy', '662', '33', '1');
INSERT INTO `inv_default_unit` VALUES ('11', 'Tube', '2023-05-20 12:09:19.711453', 'Samsethy', '1', 'purchase', '2023-05-20 12:09:19.000000', '1', 'Samsethy', '662', '33', '1');
INSERT INTO `inv_default_unit` VALUES ('12', 'Tube', '2023-05-14 17:29:14.129929', 'Samsethy', '1', 'wholesale', '2023-05-14 17:29:14.000000', '1', 'Samsethy', '661', '30', '1');
INSERT INTO `inv_default_unit` VALUES ('13', 'umo1', '2023-05-20 12:08:59.000000', 'Samsethy', '1', 'retail', null, null, null, '653', '38', '1');
INSERT INTO `inv_default_unit` VALUES ('14', 'umo1', '2023-05-20 12:08:59.000000', 'Samsethy', '1', 'wholesale', null, null, null, '653', '38', '1');
INSERT INTO `inv_default_unit` VALUES ('15', 'umo1', '2023-05-20 12:08:59.000000', 'Samsethy', '1', 'purchase', null, null, null, '653', '38', '1');
INSERT INTO `inv_default_unit` VALUES ('16', 'Tablet', '2023-05-21 11:36:56.156581', 'Samsethy', '1', 'retail', '2023-05-21 11:36:56.000000', '1', 'Samsethy', '652', '40', '1');
INSERT INTO `inv_default_unit` VALUES ('17', 'Tablet', '2023-05-21 11:36:56.170917', 'Samsethy', '1', 'wholesale', '2023-05-21 11:36:56.000000', '1', 'Samsethy', '652', '40', '1');
INSERT INTO `inv_default_unit` VALUES ('18', 'Tablet', '2023-05-21 11:36:56.185611', 'Samsethy', '1', 'purchase', '2023-05-21 11:36:56.000000', '1', 'Samsethy', '652', '40', '1');
INSERT INTO `inv_default_unit` VALUES ('19', 'Tube', '2023-05-21 12:14:37.708436', 'Samsethy', '1', 'retail', '2023-05-21 12:14:37.000000', '1', 'Samsethy', '663', '42', '1');
INSERT INTO `inv_default_unit` VALUES ('20', 'Tube', '2023-05-21 12:14:37.726079', 'Samsethy', '1', 'wholesale', '2023-05-21 12:14:37.000000', '1', 'Samsethy', '663', '42', '1');
INSERT INTO `inv_default_unit` VALUES ('21', 'Tube', '2023-05-21 12:14:37.739997', 'Samsethy', '1', 'purchase', '2023-05-21 12:14:37.000000', '1', 'Samsethy', '663', '42', '1');
INSERT INTO `inv_default_unit` VALUES ('22', 'tablet', '2023-05-22 14:57:08.163795', 'Samsethy', '1', 'retail', '2023-05-22 14:57:08.000000', '1', 'Samsethy', '664', '43', '1');
INSERT INTO `inv_default_unit` VALUES ('23', 'tablet', '2023-05-22 14:57:08.179820', 'Samsethy', '1', 'wholesale', '2023-05-22 14:57:08.000000', '1', 'Samsethy', '664', '43', '1');
INSERT INTO `inv_default_unit` VALUES ('24', 'tablet', '2023-05-22 14:57:08.196070', 'Samsethy', '1', 'purchase', '2023-05-22 14:57:08.000000', '1', 'Samsethy', '664', '43', '1');

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
  `item_class` varchar(10) DEFAULT 'MI',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_detailed_types
-- ----------------------------
INSERT INTO `inv_detailed_types` VALUES ('1', '0', 'General', '0', '1', 'Admin', null, 'MI');

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
INSERT INTO `inv_group_code_control` VALUES ('1', '2', null, 'DEL');
INSERT INTO `inv_group_code_control` VALUES ('1', '1', null, 'ERE');
INSERT INTO `inv_group_code_control` VALUES ('1', '2', null, 'HEH');
INSERT INTO `inv_group_code_control` VALUES ('1', '2', null, 'GGG');
INSERT INTO `inv_group_code_control` VALUES ('1', '2', null, 'GG');
INSERT INTO `inv_group_code_control` VALUES ('1', '1', null, 'SDF');
INSERT INTO `inv_group_code_control` VALUES ('1', '2', null, 'TOP');
INSERT INTO `inv_group_code_control` VALUES ('1', '1', null, 'DFD');
INSERT INTO `inv_group_code_control` VALUES ('1', '1', null, 'KKK');

-- ----------------------------
-- Table structure for `inv_group_units`
-- ----------------------------
DROP TABLE IF EXISTS `inv_group_units`;
CREATE TABLE `inv_group_units` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `uom` varchar(50) NOT NULL,
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
  `group_id` int(10) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_group_units
-- ----------------------------
INSERT INTO `inv_group_units` VALUES ('1', 'tablet', null, null, '1', '1.00', '1', 'Samsethy', '2023-05-22 14:53:26.000000', null, null, null, '531');

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
  `brand_id` int(10) DEFAULT NULL,
  `manufacturer_id` int(10) DEFAULT NULL,
  `made_in_country_id` int(10) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `item_class` varchar(5) DEFAULT 'MI',
  `sales_tax_rate` decimal(10,2) DEFAULT 0.00,
  `cost_account_id` int(11) DEFAULT NULL,
  `revenue_account_id` int(11) DEFAULT NULL,
  `tax_account_id` int(11) DEFAULT NULL,
  `inventory_account_id` int(11) DEFAULT NULL,
  `purchase_tax_rate` decimal(10,2) DEFAULT 0.00,
  `default_uom` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=665 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_items
-- ----------------------------
INSERT INTO `inv_items` VALUES ('664', '1', '100201', 'Product One 1', null, 'sdfdsfgdsg dsfsdf', '531', '1', 'Samsethy', '2023-05-22 14:57:08.144948', '2023-05-22 14:57:08.000000', 'Samsethy', null, null, null, '114', '12', null, '1', 'MI', '0.00', null, null, null, null, '0.00', 'tablet');

 
-- ----------------------------
-- Table structure for `inv_item_accounts`
-- ----------------------------
DROP TABLE IF EXISTS `inv_item_accounts`;
CREATE TABLE `inv_item_accounts` (
  `item_id` int(10) NOT NULL,
  `revenue_account_id` int(10) DEFAULT NULL,
  `cogs_account_id` int(10) DEFAULT NULL,
  `tax_account_id` int(10) DEFAULT NULL,
  `inventory_account_id` int(10) DEFAULT NULL,
  `receivable_account_id` int(10) DEFAULT NULL,
  `updated` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_user` varchar(50) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `payable_account_id` int(10) DEFAULT NULL,
  `purchase_account_id` int(10) DEFAULT NULL COMMENT 'Inventory Assets account keeps value of ivnentory in money. The Puchase Account is to track amount of puchase of the item',
  `branch_id` int(10) DEFAULT NULL,
  `freight_expense_account_id` int(11) DEFAULT NULL,
  `puchase_account_id` int(11) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_item_accounts
-- ----------------------------
INSERT INTO `inv_item_accounts` VALUES ('629', null, null, null, null, null, null, null, null, '2023-05-08 14:16:17.000000', 'Samsethy', '1', null, null, '1', null, null, null);
INSERT INTO `inv_item_accounts` VALUES ('630', null, null, null, null, null, null, null, null, '2023-05-08 14:20:33.000000', 'Samsethy', '1', null, null, '1', null, null, null);
INSERT INTO `inv_item_accounts` VALUES ('631', null, null, null, null, null, null, null, null, '2023-05-08 15:09:32.000000', 'Samsethy', '1', null, null, '1', null, null, null);
INSERT INTO `inv_item_accounts` VALUES ('632', null, null, null, null, null, null, null, null, '2023-05-08 15:10:32.000000', 'Samsethy', '1', null, null, '1', null, null, null);
INSERT INTO `inv_item_accounts` VALUES ('638', null, null, null, null, null, '2023-05-09 12:51:46.264045', 'Samsethy', '1', '2023-05-09 12:51:46.264045', 'Samsethy', '1', null, null, '1', null, null, '2023-05-09 12:51:46.000000');
INSERT INTO `inv_item_accounts` VALUES ('646', null, null, null, null, null, null, null, null, '2023-05-13 17:31:25.000000', 'Samsethy', '1', null, null, '1', null, null, null);
INSERT INTO `inv_item_accounts` VALUES ('647', null, null, null, null, null, null, null, null, '2023-05-13 17:41:44.000000', 'Samsethy', '1', null, null, '1', null, null, null);

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
INSERT INTO `inv_item_code_control` VALUES ('1', '201', null, null);

-- ----------------------------
-- Table structure for `inv_item_costs`
-- ----------------------------
DROP TABLE IF EXISTS `inv_item_costs`;
CREATE TABLE `inv_item_costs` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `item_id` int(10) NOT NULL,
  `cost` decimal(10,2) NOT NULL,
  `uom` varchar(20) NOT NULL,
  `unit_id` int(10) NOT NULL,
  `create_uid` int(10) NOT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_user` varchar(50) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `currency_code` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_item_costs
-- ----------------------------
INSERT INTO `inv_item_costs` VALUES ('9', '1', '662', '25.00', 'Tube', '33', '1', '2023-05-20 12:09:19.721167', 'Samsethy', '2023-05-20 12:09:19.000000', 'Samsethy', '1', 'USD');
INSERT INTO `inv_item_costs` VALUES ('10', '1', '653', '50.00', 'umo1', '38', '1', '2023-05-20 12:08:59.000000', 'Samsethy', null, null, null, 'USD');
INSERT INTO `inv_item_costs` VALUES ('11', '1', '652', '10.00', 'Tablet', '40', '1', '2023-05-21 11:36:56.200117', 'Samsethy', '2023-05-21 11:36:56.000000', 'Samsethy', '1', 'USD');
INSERT INTO `inv_item_costs` VALUES ('12', '1', '663', '5.00', 'Tube', '42', '1', '2023-05-21 12:14:37.748273', 'Samsethy', '2023-05-21 12:14:37.000000', 'Samsethy', '1', 'USD');
INSERT INTO `inv_item_costs` VALUES ('13', '1', '664', '35.00', 'tablet', '43', '1', '2023-05-22 14:57:08.209342', 'Samsethy', '2023-05-22 14:57:08.000000', 'Samsethy', '1', 'USD');

-- ----------------------------
-- Table structure for `inv_item_costs_log`
-- ----------------------------
DROP TABLE IF EXISTS `inv_item_costs_log`;
CREATE TABLE `inv_item_costs_log` (
  `id` int(10) unsigned NOT NULL DEFAULT 0,
  `branch_id` int(10) NOT NULL,
  `item_id` int(10) NOT NULL,
  `cost` decimal(10,2) NOT NULL,
  `uom` varchar(20) NOT NULL,
  `unit_id` int(10) NOT NULL,
  `create_uid` int(10) NOT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_user` varchar(50) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_item_costs_log
-- ----------------------------

-- ----------------------------
-- Table structure for `inv_item_files`
-- ----------------------------
DROP TABLE IF EXISTS `inv_item_files`;
CREATE TABLE `inv_item_files` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `directory` varchar(200) NOT NULL,
  `file_name` varchar(100) NOT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_user` varchar(50) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `file_type` varchar(15) DEFAULT 'image',
  `item_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_item_files
-- ----------------------------
INSERT INTO `inv_item_files` VALUES ('1', '1', 'http://127.0.0.1/uploads/public/1_data/item/images', '1_file_16452998d15e3520230504_120541.png', '2023-05-04 00:27:41.101684', 'Samsethy', '1', '2023-05-04 00:27:41.101684', null, null, 'image', '125');
INSERT INTO `inv_item_files` VALUES ('2', '1', 'http://127.0.0.1/uploads/public/1_data/item/images', '1_file_16469a16e92ec720230521_110526.png', '2023-05-21 11:43:26.000000', 'Samsethy', '1', null, null, null, 'image', '663');
INSERT INTO `inv_item_files` VALUES ('3', '1', 'http://127.0.0.1/uploads/public/1_data/item/images', '1_file_16469a17d595ee20230521_110541.png', '2023-05-21 11:43:41.000000', 'Samsethy', '1', null, null, null, 'image', '652');

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
  `cost_account_id` int(11) DEFAULT NULL,
  `revenue_account_id` int(11) DEFAULT NULL,
  `tax_account_id` int(11) DEFAULT NULL,
  `inventory_account_id` int(11) DEFAULT NULL,
  `purchase_tax_rate` decimal(10,2) DEFAULT 0.00,
  `item_class` varchar(10) DEFAULT 'MI',
  `uom` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=533 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_item_groups
-- ----------------------------
INSERT INTO `inv_item_groups` VALUES ('531', '1', 'Product 1', 'Samsethy', '1', '2023-05-22 14:57:08.158076', 'sdfdsgfdgfdgfdg', '2023-05-22 14:57:08.000000', 'Samsethy', '1', '36', 'GGG100002', null, '12', null, null, null, '0', '114', '0.00', '0.00', null, null, null, null, null, '0.00', 'MI', 'tablet');

-- ----------------------------
-- Table structure for `inv_item_groups_del`
 
-- ----------------------------
-- Table structure for `inv_item_prices`
-- ----------------------------
DROP TABLE IF EXISTS `inv_item_prices`;
CREATE TABLE `inv_item_prices` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `item_id` int(10) NOT NULL,
  `sales_type` varchar(20) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `uom` varchar(20) NOT NULL,
  `unit_id` int(10) NOT NULL,
  `create_uid` int(10) NOT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_user` varchar(50) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `currency_code` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_item_prices
-- ----------------------------
INSERT INTO `inv_item_prices` VALUES ('3', '1', '661', 'retail', '150.00', 'Tube', '30', '1', '2023-05-14 17:29:14.121609', 'Samsethy', '2023-05-14 17:29:14.000000', 'Samsethy', '1', 'USD');
INSERT INTO `inv_item_prices` VALUES ('4', '1', '661', 'wholesale', '120.00', 'Tube', '30', '1', '2023-05-14 17:29:14.135410', 'Samsethy', '2023-05-14 17:29:14.000000', 'Samsethy', '1', 'USD');
INSERT INTO `inv_item_prices` VALUES ('5', '1', '662', 'retail', '3021.00', 'Tube', '33', '1', '2023-05-20 12:09:19.691048', 'Samsethy', '2023-05-20 12:09:19.000000', 'Samsethy', '1', 'USD');
INSERT INTO `inv_item_prices` VALUES ('6', '1', '662', 'wholesale', '110.00', 'Tube', '33', '1', '2023-05-20 12:09:19.703308', 'Samsethy', '2023-05-20 12:09:19.000000', 'Samsethy', '1', 'USD');
INSERT INTO `inv_item_prices` VALUES ('7', '1', '653', 'retail', '110.00', 'umo1', '38', '1', '2023-05-20 12:08:59.000000', 'Samsethy', null, null, null, 'USD');
INSERT INTO `inv_item_prices` VALUES ('8', '1', '653', 'wholesale', '100.00', 'umo1', '38', '1', '2023-05-20 12:08:59.000000', 'Samsethy', null, null, null, 'USD');
INSERT INTO `inv_item_prices` VALUES ('9', '1', '652', 'retail', '30.00', 'Tablet', '40', '1', '2023-05-21 11:36:56.164420', 'Samsethy', '2023-05-21 11:36:56.000000', 'Samsethy', '1', 'USD');
INSERT INTO `inv_item_prices` VALUES ('10', '1', '652', 'wholesale', '25.00', 'Tablet', '40', '1', '2023-05-21 11:36:56.176801', 'Samsethy', '2023-05-21 11:36:56.000000', 'Samsethy', '1', 'USD');
INSERT INTO `inv_item_prices` VALUES ('11', '1', '663', 'retail', '15.00', 'Tube', '42', '1', '2023-05-21 12:14:37.720291', 'Samsethy', '2023-05-21 12:14:37.000000', 'Samsethy', '1', 'USD');
INSERT INTO `inv_item_prices` VALUES ('12', '1', '663', 'wholesale', '10.00', 'Tube', '42', '1', '2023-05-21 12:14:37.733555', 'Samsethy', '2023-05-21 12:14:37.000000', 'Samsethy', '1', 'USD');
INSERT INTO `inv_item_prices` VALUES ('13', '1', '664', 'retail', '120.00', 'tablet', '43', '1', '2023-05-22 14:57:08.173841', 'Samsethy', '2023-05-22 14:57:08.000000', 'Samsethy', '1', 'USD');
INSERT INTO `inv_item_prices` VALUES ('14', '1', '664', 'wholesale', '100.00', 'tablet', '43', '1', '2023-05-22 14:57:08.186174', 'Samsethy', '2023-05-22 14:57:08.000000', 'Samsethy', '1', 'USD');

-- ----------------------------
-- Table structure for `inv_item_prices_log`
-- ----------------------------
DROP TABLE IF EXISTS `inv_item_prices_log`;
CREATE TABLE `inv_item_prices_log` (
  `id` int(10) unsigned NOT NULL DEFAULT 0,
  `branch_id` int(10) NOT NULL,
  `item_id` int(10) NOT NULL,
  `sales_type` varchar(20) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `uom` varchar(20) NOT NULL,
  `unit_id` int(10) NOT NULL,
  `create_uid` int(10) NOT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_user` varchar(50) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_item_prices_log
-- ----------------------------

-- ----------------------------
-- Table structure for `inv_item_sku`
-- ----------------------------
DROP TABLE IF EXISTS `inv_item_sku`;
CREATE TABLE `inv_item_sku` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `sku` varchar(30) NOT NULL,
  `item_id` int(10) NOT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_uid` int(10) DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_item_sku
-- ----------------------------

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
  `item_class` varchar(10) DEFAULT 'MI',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_manufacturers
-- ----------------------------
INSERT INTO `inv_manufacturers` VALUES ('6', '1', 'man22', null, '1', 'Samsethy', '1', 'Samsethy', '2023-05-22 09:56:06.000000', '2023-05-22 09:56:06.597038', 'MI');
INSERT INTO `inv_manufacturers` VALUES ('8', '1', 'new bb', null, '1', 'Samsethy', null, null, null, '2023-05-13 15:58:10.000000', 'MI');
INSERT INTO `inv_manufacturers` VALUES ('9', '1', 'DELL Super', null, '1', 'Samsethy', '1', 'Samsethy', '2023-05-22 09:44:56.000000', '2023-05-22 09:44:56.626457', 'MI');
INSERT INTO `inv_manufacturers` VALUES ('11', '1', 'NEW MAN', null, '1', 'Samsethy', null, null, null, '2023-05-22 09:50:28.000000', 'MI');
INSERT INTO `inv_manufacturers` VALUES ('12', '1', 'new MM jst add', null, '1', 'Samsethy', null, null, null, '2023-05-22 14:56:44.000000', 'MI');

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
-- Table structure for `inv_shop_transactions`
-- ----------------------------
DROP TABLE IF EXISTS `inv_shop_transactions`;
CREATE TABLE `inv_shop_transactions` (
  `id` int(10) NOT NULL,
  `branch_id` int(10) NOT NULL,
  `trx_id` int(10) NOT NULL,
  `qty` decimal(10,2) NOT NULL,
  `item_id` int(10) NOT NULL,
  `sku` varchar(30) NOT NULL,
  `trx_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_shop_transactions
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
  `item_class` varchar(10) DEFAULT 'MI',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_stock_classes
-- ----------------------------
INSERT INTO `inv_stock_classes` VALUES ('1', '1', 'A', 'For Sales', '2023-01-14 15:21:34.162570', 'Admin', '1', '2023-01-14 15:21:34.162570', null, null, 'MI');
INSERT INTO `inv_stock_classes` VALUES ('2', '1', 'B', 'Internal Usage', '2023-01-14 15:21:34.574335', 'Admin', '1', '2023-01-14 15:21:34.574335', null, null, 'MI');
INSERT INTO `inv_stock_classes` VALUES ('3', '1', 'C', 'Charitty', null, 'Admin', '1', null, null, null, 'MI');

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
) ENGINE=InnoDB AUTO_INCREMENT=350 DEFAULT CHARSET=utf8mb4;

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
INSERT INTO `inv_stock_log` VALUES ('324', '1', 'admin@gmail.com', 'Samsethy receives PO 10 Tube', 'receive', '2023-04-24 10:10:32.000000', '1', '0.00', '13');
INSERT INTO `inv_stock_log` VALUES ('325', '1', 'admin@gmail.com', 'Samsethy receives PO 15 Bottle', 'receive', '2023-04-24 10:10:32.000000', '1', '0.00', '14');
INSERT INTO `inv_stock_log` VALUES ('326', '1', 'admin@gmail.com', 'Samsethy receives PO 10 Tube', 'receive', '2023-05-04 00:38:01.000000', '1', '0.00', '15');
INSERT INTO `inv_stock_log` VALUES ('327', '1', 'admin@gmail.com', 'Samsethy receives PO 5 PRO-NEW -230522164313-A95', 'receive', '2023-05-22 16:43:13.000000', '1', '0.00', '16');
INSERT INTO `inv_stock_log` VALUES ('328', '1', 'admin@gmail.com', 'Samsethy receives PO 5 PRO-NEW -230522164315-CBD', 'receive', '2023-05-22 16:43:15.000000', '1', '0.00', '16');
INSERT INTO `inv_stock_log` VALUES ('329', '1', 'admin@gmail.com', 'Samsethy receives PO 5 PRO-NEW -230522164338-ED6', 'receive', '2023-05-22 16:43:38.000000', '1', '0.00', '16');
INSERT INTO `inv_stock_log` VALUES ('330', '1', 'admin@gmail.com', 'Samsethy receives PO 5 PRO-NEW -230522164528-582', 'receive', '2023-05-22 16:45:28.000000', '1', '0.00', '16');
INSERT INTO `inv_stock_log` VALUES ('331', '1', 'admin@gmail.com', 'Samsethy receives PO 5 PRO-NEW -230522164635-A79', 'receive', '2023-05-22 16:46:35.000000', '1', '0.00', '17');
INSERT INTO `inv_stock_log` VALUES ('332', '1', 'admin@gmail.com', 'Samsethy receives PO 5 PRO-NEW -230522164838-05F', 'receive', '2023-05-22 16:48:38.000000', '1', '0.00', '17');
INSERT INTO `inv_stock_log` VALUES ('333', '1', 'admin@gmail.com', 'Samsethy receives PO 5 PRO-NEW -230522165007-874', 'receive', '2023-05-22 16:50:07.000000', '1', '0.00', '17');
INSERT INTO `inv_stock_log` VALUES ('334', '1', 'admin@gmail.com', 'Samsethy receives PO 5 PRO-NEW -230522165833-09F', 'receive', '2023-05-22 16:58:33.000000', '1', '0.00', '17');
INSERT INTO `inv_stock_log` VALUES ('335', '1', 'admin@gmail.com', 'Samsethy receives PO 5 PRO-NEW -230522170032-947', 'receive', '2023-05-22 17:00:32.000000', '1', '0.00', '17');
INSERT INTO `inv_stock_log` VALUES ('336', '1', 'admin@gmail.com', 'Samsethy receives PO 5 PRO-NEW -230522170144-DF5', 'receive', '2023-05-22 17:01:44.000000', '1', '0.00', '17');
INSERT INTO `inv_stock_log` VALUES ('337', '1', 'admin@gmail.com', 'Samsethy receives PO 5 PRO-NEW -230522170215-EA2', 'receive', '2023-05-22 17:02:15.000000', '1', '0.00', '18');
INSERT INTO `inv_stock_log` VALUES ('338', '1', 'admin@gmail.com', 'Samsethy receives PO 5 PRO-NEW -230522170349-CC5', 'receive', '2023-05-22 17:03:49.000000', '1', '0.00', '19');
INSERT INTO `inv_stock_log` VALUES ('339', '1', 'admin@gmail.com', 'Samsethy receives PO 2 PRO-NEW -230522170704-9D4', 'receive', '2023-05-22 17:07:04.000000', '1', '0.00', '20');
INSERT INTO `inv_stock_log` VALUES ('340', '1', 'admin@gmail.com', 'Samsethy receives PO 15 PRO-NEW -230522172148-12B', 'receive', '2023-05-22 17:21:48.000000', '1', '0.00', '21');
INSERT INTO `inv_stock_log` VALUES ('341', '1', 'admin@gmail.com', 'Samsethy receives PO 2 PRO-NEW -230522172257-AD9', 'receive', '2023-05-22 17:22:57.000000', '1', '0.00', '22');
INSERT INTO `inv_stock_log` VALUES ('342', '1', 'admin@gmail.com', 'Samsethy receives PO 3 PRO-NEW -230522173925-872', 'receive', '2023-05-22 17:39:25.000000', '1', '0.00', '23');
INSERT INTO `inv_stock_log` VALUES ('343', '1', 'admin@gmail.com', 'Samsethy receives PO 3 PRO-NEW -230522174110-96E', 'receive', '2023-05-22 17:41:10.000000', '1', '0.00', '23');
INSERT INTO `inv_stock_log` VALUES ('344', '1', 'admin@gmail.com', 'Samsethy receives PO 3 PRO-NEW -230522174112-AB7', 'receive', '2023-05-22 17:41:12.000000', '1', '0.00', '23');
INSERT INTO `inv_stock_log` VALUES ('345', '1', 'admin@gmail.com', 'Samsethy receives PO 3 PRO-NEW -230522174252-3C6', 'receive', '2023-05-22 17:42:52.000000', '1', '0.00', '23');
INSERT INTO `inv_stock_log` VALUES ('346', '1', 'admin@gmail.com', 'Samsethy receives PO 10 PRO-NEW -230522174356-FD7', 'receive', '2023-05-22 17:43:56.000000', '1', '0.00', '24');
INSERT INTO `inv_stock_log` VALUES ('347', '1', 'admin@gmail.com', 'Samsethy receives PO 30 PRO-NEW -230522174414-D05', 'receive', '2023-05-22 17:44:14.000000', '1', '0.00', '25');
INSERT INTO `inv_stock_log` VALUES ('348', '1', 'admin@gmail.com', 'Samsethy receives PO 5 PRO-NEW -230523095750-6F7', 'receive', '2023-05-23 09:57:50.000000', '1', '0.00', '26');
INSERT INTO `inv_stock_log` VALUES ('349', '1', 'admin@gmail.com', 'Samsethy receives PO 5 PRO-NEW -230523100046-936', 'receive', '2023-05-23 10:00:46.000000', '1', '0.00', '26');

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
  `uom` varchar(50) NOT NULL,
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
  `item_id` int(10) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_units
-- ----------------------------
INSERT INTO `inv_units` VALUES ('43', 'tablet', null, null, '1', '1.00', '1', 'Samsethy', '2023-05-22 14:54:40.000000', null, null, null, '664');

-- ----------------------------
-- Table structure for `inv_uom`
-- ----------------------------
DROP TABLE IF EXISTS `inv_uom`;
CREATE TABLE `inv_uom` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `uom` varchar(25) NOT NULL,
  `branch_id` int(10) NOT NULL,
  `item_class` varchar(10) DEFAULT 'MI',
  `create_uid` int(10) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_uid` int(10) DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_uom
-- ----------------------------
INSERT INTO `inv_uom` VALUES ('77', 'tube', '1', 'MI', '1', 'Samsethy', '2023-05-22 10:28:30.000000', null, null, null);
INSERT INTO `inv_uom` VALUES ('78', 'tablet', '1', 'MI', '1', 'Samsethy', '2023-05-22 10:31:50.000000', null, null, null);
INSERT INTO `inv_uom` VALUES ('79', 'mo', '1', 'MI', '1', 'Samsethy', '2023-05-22 14:56:57.000000', null, null, null);

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
-- Table structure for `inv_wholesale_prices_del`
-- ----------------------------
DROP TABLE IF EXISTS `inv_wholesale_prices_del`;
CREATE TABLE `inv_wholesale_prices_del` (
  `id` int(10) NOT NULL DEFAULT 0,
  `item_id` int(10) NOT NULL,
  `uom` varchar(25) NOT NULL,
  `unit_id` int(10) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `price_type` varchar(15) NOT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_user` varchar(50) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of inv_wholesale_prices_del
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
) ENGINE=InnoDB AUTO_INCREMENT=116 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
INSERT INTO `leads` VALUES ('96', 'NNNN', 'M', '0124654576', '2', '1', 'Samsethy', null, null, '2023-04-13 11:52:46', null, '1', null);
INSERT INTO `leads` VALUES ('97', 'Some one A', 'F', '011456456456', '2', '1', 'Samsethy', null, null, '2023-04-21 23:47:31', null, '1', null);
INSERT INTO `leads` VALUES ('98', 'Davan', 'F', '0112324234', '2', '1', 'Samsethy', null, null, '2023-04-24 01:17:30', null, '1', null);
INSERT INTO `leads` VALUES ('99', 'New Patient', 'M', '012235345', '2', '1', 'Samsethy', null, null, '2023-04-24 01:28:51', null, '1', null);
INSERT INTO `leads` VALUES ('100', 'NEW PPP', 'M', '011223434234', '2', '1', 'Samsethy', null, null, '2023-04-24 01:42:11', null, '1', null);
INSERT INTO `leads` VALUES ('101', 'fdgfdgdfgdfg', 'F', '012243545', '2', '1', 'Samsethy', null, null, '2023-04-24 09:35:29', null, '1', null);
INSERT INTO `leads` VALUES ('102', 'Pisara', 'F', '0113242345', '2', '1', 'Samsethy', null, null, '2023-04-24 11:01:08', null, '1', null);
INSERT INTO `leads` VALUES ('103', 'ABC P', 'M', '011334546', '2', '1', 'Samsethy', null, null, '2023-04-24 18:00:37', null, '1', null);
INSERT INTO `leads` VALUES ('104', 'new lead', 'M', '01123435', '2', '1', 'Samsethy', null, null, '2023-04-24 18:21:18', null, '1', 'lead@gmail.com');
INSERT INTO `leads` VALUES ('105', 'fsdfdsfgdgfd', 'M', '012214324523', '2', '1', 'Samsethy', null, null, '2023-04-27 00:26:39', null, '1', null);
INSERT INTO `leads` VALUES ('106', 'LLOL', 'M', '01134234', '2', '1', 'Samsethy', null, null, '2023-04-27 00:42:48', null, '1', null);
INSERT INTO `leads` VALUES ('107', 'fdfdgfdgfdg', 'M', '011234232', '2', '1', 'Samsethy', null, null, '2023-04-27 00:52:02', null, '1', null);
INSERT INTO `leads` VALUES ('108', 'DFFFSdf', 'F', '012435456', '2', '1', 'Samsethy', null, null, '2023-04-27 01:02:07', null, '1', null);
INSERT INTO `leads` VALUES ('109', 'fsddfg', 'M', '0124543645', '2', '1', 'Samsethy', null, null, '2023-04-27 01:06:23', null, '1', null);
INSERT INTO `leads` VALUES ('110', 'sdsdfgfdgfdgfd', 'M', '0123534645', '2', '1', 'Samsethy', null, null, '2023-04-27 01:08:51', null, '1', null);
INSERT INTO `leads` VALUES ('111', 'Liza', 'F', '0123454645', '2', '1', 'Samsethy', null, null, '2023-04-27 01:10:09', null, '1', null);
INSERT INTO `leads` VALUES ('112', 'erewrewreteterbb', 'F', '0124354365', '2', '1', 'Samsethy', null, null, '2023-04-27 01:11:00', null, '1', null);
INSERT INTO `leads` VALUES ('113', 'sdfdsfdsgdfgfdg', 'F', '012345346543', '2', '1', 'Samsethy', null, null, '2023-04-27 17:53:20', null, '1', null);
INSERT INTO `leads` VALUES ('114', 'Sopheara sdsfds', 'M', 'fdsdfsdg', '2', '1', 'Samsethy', null, null, '2023-04-27 18:43:53', null, '1', 'sdfsdfdsdfdsg email');
INSERT INTO `leads` VALUES ('115', 'fg', 'F', '012334534', '2', '1', 'Samsethy', null, null, '2023-04-27 18:49:28', null, '1', null);

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
  `nationality_kh` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of loc_countries
-- ----------------------------
INSERT INTO `loc_countries` VALUES ('14', 'Cambodia', 'Cambodia', 'Puthea', '2021-11-22 06:30:12', '1', null, 'Cambodia', null, null, '2023-03-28 00:22:47', '2023-03-28 00:22:47', '2023-03-28 00:22:48', null);
INSERT INTO `loc_countries` VALUES ('15', 'Thailand', 'Thailand', 'admin@gmail.com', '2022-04-20 09:40:50', '1', null, 'Thailand', null, null, '2023-03-28 00:22:47', '2023-03-28 00:22:47', '2023-03-28 00:22:48', null);

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
  `name` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=148 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of patients
-- ----------------------------
INSERT INTO `patients` VALUES ('73', '1', '1', '53', 'P100055', 'Samsethy', '1', '2022-12-04 13:40:21', null, null, null, null, 'OPD', '1_file_1644fa0b7739d020230501_060527.png', null, null, 'DDDDDD');
INSERT INTO `patients` VALUES ('74', '1', '1', '54', 'P100058', 'Samsethy', '1', '2022-12-04 13:41:53', null, null, null, null, 'OPD', null, null, null, 'DSDF AAA');
INSERT INTO `patients` VALUES ('76', '1', '1', '56', 'P100061', 'Samsethy', '1', '2022-12-06 12:01:00', null, null, null, null, 'OPD', null, null, null, 'Bun Sobana');
INSERT INTO `patients` VALUES ('77', '1', '1', '57', 'P100062', 'Samsethy', '1', '2022-12-06 12:02:15', null, null, null, null, 'OPD', null, null, null, 'Borya ');
INSERT INTO `patients` VALUES ('114', '1', '1', '113', 'P100107', 'Samsethy', '1', '2023-03-06 14:15:52', null, null, null, null, 'OPD', null, null, null, 'Sin Sophana');
INSERT INTO `patients` VALUES ('115', '1', '1', '114', 'P100108', 'Samsethy', '1', '2023-03-06 14:31:31', null, null, null, null, 'OPD', null, null, null, 'Solika ');
INSERT INTO `patients` VALUES ('116', '1', '1', '73', 'P100109', 'Samsethy', '1', '2023-03-06 15:05:57', null, null, null, null, 'OPD', null, null, null, 'vikara ');
INSERT INTO `patients` VALUES ('117', '1', '1', '66', 'P100110', 'Samsethy', '1', '2023-03-06 15:25:23', null, null, null, null, 'OPD', null, null, null, 'HKKK ');
INSERT INTO `patients` VALUES ('118', '1', '1', '115', 'P100111', 'Samsethy', '1', '2023-03-06 15:29:47', null, null, null, null, 'OPD', '1_file_164454e9b5de8620230423_100427.png', null, null, 'Dyna ');
INSERT INTO `patients` VALUES ('119', '1', '1', '116', 'P100112', 'Samsethy', '1', '2023-03-06 16:20:43', null, null, null, null, 'OPD', '1_file_16442b9c8abd2b20230421_110456.png', null, null, 'Gonna ');
INSERT INTO `patients` VALUES ('120', '1', '1', '118', 'P100113', 'Samsethy', '1', '2023-03-21 03:32:25', null, null, null, null, 'OPD', '1_file_16442b2e62384820230421_100434.png', null, null, 'GGG ');
INSERT INTO `patients` VALUES ('121', '1', '1', '119', 'P100114', 'Samsethy', '1', '2023-03-31 12:45:55', null, null, null, null, 'OPD', null, null, null, 'Dynano ');
INSERT INTO `patients` VALUES ('122', '1', '1', '120', 'P100115', 'Samsethy', '1', '2023-04-04 16:30:17', null, null, null, null, 'OPD', null, null, null, 'Sopheara ');
INSERT INTO `patients` VALUES ('123', '1', '1', '121', 'P100116', 'Samsethy', '1', '2023-04-08 22:42:16', null, null, null, null, 'OPD', null, null, null, 'Sinara ');
INSERT INTO `patients` VALUES ('124', '1', '1', '122', 'P100117', 'Samsethy', '1', '2023-04-08 22:42:37', null, null, null, null, 'OPD', null, null, null, 'Sopan ');
INSERT INTO `patients` VALUES ('125', '1', '1', '123', 'P100118', 'Samsethy', '1', '2023-04-08 22:55:18', null, null, null, null, 'OPD', null, null, null, 'Sotheara ');
INSERT INTO `patients` VALUES ('127', '1', '1', '125', 'P100120', 'Samsethy', '1', '2023-04-09 15:43:38', null, null, null, null, 'OPD', null, null, null, 'Some one A');
INSERT INTO `patients` VALUES ('128', '1', '1', '126', 'P100121', 'Samsethy', '1', '2023-04-09 16:09:00', null, null, null, null, 'OPD', '1_file_164424ca328ea120230421_030415.png', null, null, 'sasfsd ');
INSERT INTO `patients` VALUES ('129', '1', '1', '124', 'P100122', 'Samsethy', '1', '2023-04-15 12:35:59', null, null, null, null, 'OPD', '1_file_164424ca6ed10420230421_030418.png', null, null, 'new DG Name');
INSERT INTO `patients` VALUES ('131', '1', '1', '139', 'P100124', 'Samsethy', '1', '2023-04-21 15:44:11', null, null, null, null, 'OPD', '1_file_164424d51ca9d620230421_030409.png', null, null, null);
INSERT INTO `patients` VALUES ('134', '1', '1', '142', 'P100127', 'Samsethy', '1', '2023-04-21 15:58:41', null, null, null, null, 'OPD', '1_file_1644250bdace8a20230421_040445.png', null, null, 'HYPER AND REAL V');
INSERT INTO `patients` VALUES ('135', '1', '1', '143', 'P100128', 'Samsethy', '1', '2023-04-21 23:48:29', null, null, null, null, 'OPD', '1_file_16442c1e6e43a520230422_120434.png', null, null, 'Some one A');
INSERT INTO `patients` VALUES ('136', '1', '1', '144', 'P100129', 'Samsethy', '1', '2023-04-24 01:18:09', null, null, null, null, 'OPD', null, null, null, null);
INSERT INTO `patients` VALUES ('137', '1', '1', '145', 'P100130', 'Samsethy', '1', '2023-04-24 01:29:31', null, null, null, null, 'OPD', null, null, null, null);
INSERT INTO `patients` VALUES ('138', '1', '1', '146', 'P100131', 'Samsethy', '1', '2023-04-24 09:39:03', null, null, null, null, 'OPD', '1_file_16445ebfa7dc9d20230424_090454.png', null, null, null);
INSERT INTO `patients` VALUES ('139', '1', '1', '147', 'P100132', 'Samsethy', '1', '2023-04-27 00:27:36', null, null, null, null, 'OPD', null, null, null, 'fsdfdsfgdgfd');
INSERT INTO `patients` VALUES ('140', '1', '1', '148', 'P100133', 'Samsethy', '1', '2023-04-27 00:59:00', null, null, null, null, 'OPD', null, null, null, null);
INSERT INTO `patients` VALUES ('141', '1', '1', '149', 'P100134', 'Samsethy', '1', '2023-04-27 01:02:36', null, null, null, null, 'OPD', null, null, null, 'DFFFSdf');
INSERT INTO `patients` VALUES ('142', '1', '1', '150', 'P100135', 'Samsethy', '1', '2023-04-27 01:06:41', null, null, null, null, 'OPD', null, null, null, null);
INSERT INTO `patients` VALUES ('143', '1', '1', '151', 'P100136', 'Samsethy', '1', '2023-04-27 01:09:21', null, null, null, null, 'OPD', null, null, null, 'sdsdfgfdgfdgfd');
INSERT INTO `patients` VALUES ('144', '1', '1', '152', 'P100137', 'Samsethy', '1', '2023-04-27 01:10:23', null, null, null, null, 'OPD', '1_file_1645299af1385920230504_120515.png', null, null, 'Liza');

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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of patient_advice
-- ----------------------------
INSERT INTO `patient_advice` VALUES ('1', '1', 'General', 'DO NOT DRINK ALCOHOL sdfdsfsdfsd', '2023-03-13 16:15:26.163323', '2023-03-13 16:15:26.000000', '1', '1', 'Samsethy', 'Samsethy', '114', '119');
INSERT INTO `patient_advice` VALUES ('2', '1', 'General', 'sdfdgfdhd', '2023-03-21 11:39:38.000000', '2023-03-21 11:39:38.000000', '1', '1', 'Samsethy', 'Samsethy', '121', '118');
INSERT INTO `patient_advice` VALUES ('3', '1', 'General', 'Do not eat alcohol', '2023-03-21 12:53:08.356815', '2023-03-21 12:53:08.000000', '1', '1', 'Samsethy', 'Samsethy', '120', '118');
INSERT INTO `patient_advice` VALUES ('4', '1', 'General', 'dfgdfhgf', '2023-04-09 15:03:20.000000', '2023-04-09 15:03:20.000000', '1', '1', 'Samsethy', 'Samsethy', '130', '117');
INSERT INTO `patient_advice` VALUES ('5', '1', 'General', 'sfgdfg gdfg\ngdfgdf', '2023-04-16 23:50:42.000000', '2023-04-16 23:50:42.000000', '1', '1', 'Samsethy', 'Samsethy', '138', '129');
INSERT INTO `patient_advice` VALUES ('6', '1', 'General', 'dtr dgfhy gfdg', '2023-04-24 09:47:11.963958', '2023-04-24 09:47:11.000000', '1', '1', 'Samsethy', 'Samsethy', '153', '138');

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
INSERT INTO `patient_code_control` VALUES ('1', '140', null, 'P');

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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of patient_diagnosis
-- ----------------------------
INSERT INTO `patient_diagnosis` VALUES ('1', '1', '119', '2023-03-13 16:15:17.000000', '114', 'This is doing fine now dfdgg esfdgdfg', 'General', '1', '2023-03-13 16:15:17.638809', 'Samsethy', '1', '2023-03-13 16:15:17.000000', 'Samsethy');
INSERT INTO `patient_diagnosis` VALUES ('2', '1', '118', '2023-03-21 12:07:20.000000', '120', 'dfgfdgfdgfdg', 'General', '1', '2023-03-21 12:07:20.518975', 'Samsethy', '1', '2023-03-21 12:07:20.000000', 'Samsethy');
INSERT INTO `patient_diagnosis` VALUES ('3', '1', '120', '2023-03-21 12:49:21.000000', '119', 'sfsd  dgfdhfhf', 'General', '1', '2023-03-21 12:49:21.000000', 'Samsethy', '1', '2023-03-21 12:49:21.000000', 'Samsethy');
INSERT INTO `patient_diagnosis` VALUES ('4', '1', '118', '2023-03-31 13:27:53.000000', '122', 'vxcvcxvxvxvxc ssdgsd dsfsdgsdg sdfsdgd', 'General', '1', '2023-03-31 13:27:53.000000', 'Samsethy', '1', '2023-03-31 13:27:53.000000', 'Samsethy');
INSERT INTO `patient_diagnosis` VALUES ('5', '1', '122', '2023-04-13 15:17:12.000000', '135', 'sdfdhfghjgf', 'General', '1', '2023-04-13 15:17:12.000000', 'Samsethy', '1', '2023-04-13 15:17:12.000000', 'Samsethy');
INSERT INTO `patient_diagnosis` VALUES ('6', '1', '145', '2023-04-27 12:53:57.000000', '161', 'eter yery sdgfdg fGDGDGD', 'General', '1', '2023-04-27 12:53:57.994192', 'Samsethy', '1', '2023-04-27 12:53:57.000000', 'Samsethy');
INSERT INTO `patient_diagnosis` VALUES ('7', '1', '146', '2023-04-27 23:02:46.000000', '162', 'vfdsgfd gdfdf dgdfh dfgdfh dffghgf', 'General', '1', '2023-04-27 23:02:46.000000', 'Samsethy', '1', '2023-04-27 23:02:46.000000', 'Samsethy');

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
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4;

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
INSERT INTO `patient_labo_tests` VALUES ('30', '1', '125', '134', '32', '2023-04-12 10:09:29.630321', '2023-04-12 10:09:29.630321', '', null, null, null, '1', 'Samsethy', '2023-04-12 10:09:29.630321', '2023-04-12 10:09:29.630321', 'Samsethy', '1', '50.00', 'dfdgfd', '1', '2023-04-12 10:09:29');
INSERT INTO `patient_labo_tests` VALUES ('31', '1', '125', '134', '32', null, null, '', null, null, null, '1', 'Samsethy', '2023-04-12 10:09:36.000000', null, null, null, '50.00', 'vbfghfg', '1', '2023-04-12 10:09:36');
INSERT INTO `patient_labo_tests` VALUES ('32', '1', '122', '135', '27', null, null, '', null, null, null, '1', 'Samsethy', '2023-04-13 15:16:58.000000', null, null, null, '0.00', 'sdfdghgfh', '1', '2023-04-13 15:16:58');
INSERT INTO `patient_labo_tests` VALUES ('33', '1', '129', '137', '27', null, null, '', null, null, null, '1', 'Samsethy', '2023-04-15 22:16:20.000000', null, null, null, '0.00', 'hgfhgfh', '6', '2023-04-15 22:16:20');
INSERT INTO `patient_labo_tests` VALUES ('34', '1', '129', '138', '27', '2023-04-16 10:53:14.182521', '2023-04-16 10:53:14.182521', '', null, null, null, '1', 'Samsethy', '2023-04-16 10:53:14.182521', '2023-04-16 10:53:14.182521', 'Samsethy', '1', '0.00', 'sdfsdfdsfs', '6', '2023-04-16 10:53:14');
INSERT INTO `patient_labo_tests` VALUES ('35', '1', '135', '149', '27', null, null, '', null, null, null, '1', 'Samsethy', '2023-04-24 00:00:55.000000', null, null, null, '0.00', 'dfgdfg dfgfdg', '6', '2023-04-24 00:00:55');
INSERT INTO `patient_labo_tests` VALUES ('37', '1', '138', '153', '27', null, null, '', null, null, null, '1', 'Samsethy', '2023-04-24 09:44:02.000000', null, null, null, '0.00', 'fdgfghgf', '6', '2023-04-24 09:44:02');
INSERT INTO `patient_labo_tests` VALUES ('38', '1', '138', '153', '32', null, null, '', null, null, null, '1', 'Samsethy', '2023-04-24 09:44:09.000000', null, null, null, '50.00', 'gchgfhg', '4', '2023-04-24 09:44:09');
INSERT INTO `patient_labo_tests` VALUES ('39', '1', '145', '161', '33', null, null, '', null, null, null, '1', 'Samsethy', '2023-04-27 10:30:00.000000', null, null, null, '15.00', 'sfggetret', '4', '2023-04-27 10:30:00');
INSERT INTO `patient_labo_tests` VALUES ('40', '1', '145', '161', '27', null, null, '', null, null, null, '1', 'Samsethy', '2023-04-27 10:30:07.000000', null, null, null, '0.00', 'frertrety', '6', '2023-04-27 10:30:07');
INSERT INTO `patient_labo_tests` VALUES ('41', '1', '146', '162', '33', null, null, '', null, null, null, '1', 'Samsethy', '2023-04-27 23:03:31.000000', null, null, null, '15.00', 'dfgfdgf', '4', '2023-04-27 23:03:31');

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
) ENGINE=InnoDB AUTO_INCREMENT=307 DEFAULT CHARSET=utf8mb4;

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
INSERT INTO `patient_medical_conditions` VALUES ('270', '1', '129', '3', '0', 'Active', '2023-04-15 12:35:59.000000', '1', 'Samsethy', '2023-04-15 12:35:59.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('272', '1', '130', '3', '0', 'Active', '2023-04-18 11:48:33.000000', '1', 'Samsethy', '2023-04-18 11:48:33.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('274', '1', '131', '3', '0', 'Active', '2023-04-21 15:44:11.000000', '1', 'Samsethy', '2023-04-21 15:44:11.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('276', '1', '132', '3', '0', 'Active', '2023-04-21 15:47:02.000000', '1', 'Samsethy', '2023-04-21 15:47:02.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('278', '1', '133', '3', '1', 'Active', '2023-04-21 15:55:54.000000', '1', 'Samsethy', '2023-04-21 15:55:54.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('280', '1', '134', '3', '1', 'Active', '2023-04-21 15:58:41.000000', '1', 'Samsethy', '2023-04-21 15:58:41.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('282', '1', '135', '3', '0', 'Active', '2023-04-21 23:48:29.000000', '1', 'Samsethy', '2023-04-21 23:48:29.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('284', '1', '136', '3', '0', 'Active', '2023-04-24 01:18:09.000000', '1', 'Samsethy', '2023-04-24 01:18:09.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('286', '1', '137', '3', '0', 'Active', '2023-04-24 01:29:31.000000', '1', 'Samsethy', '2023-04-24 01:29:31.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('288', '1', '138', '3', '1', 'Active', '2023-04-24 09:39:03.000000', '1', 'Samsethy', '2023-04-24 09:39:03.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('290', '1', '139', '3', '0', 'Active', '2023-04-27 00:27:36.000000', '1', 'Samsethy', '2023-04-27 00:27:36.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('292', '1', '140', '3', '0', 'Active', '2023-04-27 00:59:00.000000', '1', 'Samsethy', '2023-04-27 00:59:00.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('294', '1', '141', '3', '0', 'Active', '2023-04-27 01:02:36.000000', '1', 'Samsethy', '2023-04-27 01:02:36.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('296', '1', '142', '3', '0', 'Active', '2023-04-27 01:06:41.000000', '1', 'Samsethy', '2023-04-27 01:06:41.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('298', '1', '143', '3', '0', 'Active', '2023-04-27 01:09:21.000000', '1', 'Samsethy', '2023-04-27 01:09:21.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('300', '1', '144', '3', '0', 'Active', '2023-04-27 01:10:23.000000', '1', 'Samsethy', '2023-04-27 01:10:23.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('302', '1', '145', '3', '0', 'Active', '2023-04-27 01:11:13.000000', '1', 'Samsethy', '2023-04-27 01:11:13.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('304', '1', '146', '3', '0', 'Active', '2023-04-27 17:53:52.000000', '1', 'Samsethy', '2023-04-27 17:53:52.000000', null, null, null, 'Conjunctivitis', null);
INSERT INTO `patient_medical_conditions` VALUES ('306', '1', '147', '3', '0', 'Active', '2023-05-01 18:53:18.000000', '1', 'Samsethy', '2023-05-01 18:53:18.000000', null, null, null, 'Conjunctivitis', null);

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
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4;

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
INSERT INTO `patient_medical_history` VALUES ('44', '1', '133', 'Personal History', 'dfgdf dfgfdf', '2023-04-11 15:57:07.379160', 'Samsethy', '1', '2023-04-11 15:57:07.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('45', '1', '133', 'Family History', 'sdffdgfh hgjjytruyt rytuyt', '2023-04-11 15:57:07.384390', 'Samsethy', '1', '2023-04-11 15:57:07.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('46', '1', '133', 'Traveling', 'sdffhgfh', '2023-04-11 15:57:07.000000', 'Samsethy', '1', null, null, null);
INSERT INTO `patient_medical_history` VALUES ('47', '1', '135', 'Personal History', 'fdhgk,uhj', '2023-04-13 15:16:46.963801', 'Samsethy', '1', '2023-04-13 15:16:46.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('48', '1', '135', 'Family History', 'wfghfgjhgkj', '2023-04-13 15:16:46.972158', 'Samsethy', '1', '2023-04-13 15:16:46.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('49', '1', '135', 'Traveling', 'dsgfhgfj', '2023-04-13 15:16:46.977171', 'Samsethy', '1', '2023-04-13 15:16:46.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('50', '1', '135', 'Vacination', 'dghhjg fghgjhgj', '2023-04-13 15:16:46.981371', 'Samsethy', '1', '2023-04-13 15:16:46.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('51', '1', '135', 'Allergy', 'sdfghgjhgj dfghfghj', '2023-04-13 15:16:46.985950', 'Samsethy', '1', '2023-04-13 15:16:46.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('52', '1', '135', 'Surgery', 'sdffghgj dfggfhgj', '2023-04-13 15:16:46.000000', 'Samsethy', '1', null, null, null);
INSERT INTO `patient_medical_history` VALUES ('53', '1', '138', 'Personal History', 'ddfgfdhfdh', '2023-04-16 22:26:31.444208', 'Samsethy', '1', '2023-04-16 22:26:31.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('54', '1', '138', 'Family History', 'dgdfgfdh', '2023-04-16 22:26:31.449687', 'Samsethy', '1', '2023-04-16 22:26:31.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('55', '1', '138', 'Traveling', 'gdfhfhfgh', '2023-04-16 22:26:31.453880', 'Samsethy', '1', '2023-04-16 22:26:31.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('56', '1', '138', 'Vacination', 'fsdgdsgdgdfg', '2023-04-16 22:26:31.458207', 'Samsethy', '1', '2023-04-16 22:26:31.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('57', '1', '138', 'Allergy', 'xvdgdfgdfgdfh', '2023-04-16 22:26:31.000000', 'Samsethy', '1', null, null, null);
INSERT INTO `patient_medical_history` VALUES ('58', '1', '139', 'Personal History', 'dfdgfdg', '2023-04-17 17:27:46.296759', 'Samsethy', '1', '2023-04-17 17:27:46.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('59', '1', '150', 'Personal History', 'dfdgfdgfgdf', '2023-04-24 00:27:20.580418', 'Samsethy', '1', '2023-04-24 00:27:20.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('60', '1', '150', 'Family History', 'dfgdfdfgf', '2023-04-24 00:27:20.586101', 'Samsethy', '1', '2023-04-24 00:27:20.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('61', '1', '150', 'Traveling', 'dfgdfgdfgf', '2023-04-24 00:27:20.590458', 'Samsethy', '1', '2023-04-24 00:27:20.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('62', '1', '150', 'Vacination', 'dfgdfgdf', '2023-04-24 00:27:20.596026', 'Samsethy', '1', '2023-04-24 00:27:20.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('63', '1', '150', 'Allergy', 'fdgfghgf', '2023-04-24 00:27:20.000000', 'Samsethy', '1', null, null, null);
INSERT INTO `patient_medical_history` VALUES ('64', '1', '153', 'Personal History', 'gff', '2023-04-24 09:43:01.712725', 'Samsethy', '1', '2023-04-24 09:43:01.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('65', '1', '153', 'Family History', 'eftfy', '2023-04-24 09:43:01.718805', 'Samsethy', '1', '2023-04-24 09:43:01.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('66', '1', '153', 'Traveling', 'dfghfh', '2023-04-24 09:43:01.723616', 'Samsethy', '1', '2023-04-24 09:43:01.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('67', '1', '153', 'Vacination', 'fgdfg', '2023-04-24 09:43:01.729690', 'Samsethy', '1', '2023-04-24 09:43:01.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('68', '1', '153', 'Allergy', 'dfgfd', '2023-04-24 09:43:01.000000', 'Samsethy', '1', null, null, null);
INSERT INTO `patient_medical_history` VALUES ('69', '1', '161', 'Personal History', 'sometimes', '2023-04-27 11:58:37.323629', 'Samsethy', '1', '2023-04-27 11:58:37.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('70', '1', '161', 'Family History', 'No', '2023-04-27 11:58:37.329201', 'Samsethy', '1', '2023-04-27 11:58:37.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('71', '1', '161', 'Traveling', 'USA', '2023-04-27 11:58:37.334993', 'Samsethy', '1', '2023-04-27 11:58:37.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('72', '1', '161', 'Vacination', '4 times', '2023-04-27 11:58:37.340268', 'Samsethy', '1', '2023-04-27 11:58:37.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('73', '1', '161', 'Allergy', 'Yes', '2023-04-27 11:58:37.345268', 'Samsethy', '1', '2023-04-27 11:58:37.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('74', '1', '161', 'Surgery', 'No', '2023-04-27 11:58:37.350328', 'Samsethy', '1', '2023-04-27 11:58:37.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('75', '1', '162', 'Personal History', 'sfdsgdg', '2023-04-27 23:06:56.089475', 'Samsethy', '1', '2023-04-27 23:06:56.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('76', '1', '162', 'Family History', 'sdfdsfgdsg', '2023-04-27 23:06:56.098327', 'Samsethy', '1', '2023-04-27 23:06:56.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('77', '1', '162', 'Vacination', 'dfdgfdfdg', '2023-04-27 23:06:56.108669', 'Samsethy', '1', '2023-04-27 23:06:56.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('78', '1', '162', 'Traveling', 'dsfgdgfg', '2023-04-27 23:06:56.104095', 'Samsethy', '1', '2023-04-27 23:06:56.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('79', '1', '162', 'Allergy', 'fdfgfdgfdgfdg', '2023-04-27 23:06:56.113610', 'Samsethy', '1', '2023-04-27 23:06:56.000000', 'Samsethy', null);
INSERT INTO `patient_medical_history` VALUES ('80', '1', '162', 'Surgery', 'dgdfdg', '2023-04-27 23:06:56.000000', 'Samsethy', '1', null, null, null);

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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4;

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
INSERT INTO `patient_pe` VALUES ('13', '1', '153', 'General', 'xgdftfsd   sfdg dfgdfgdfg fghfg dfgf  dfgf dfgfh', 'Samsethy', '1', '2023-04-24 09:43:46.000000', '2023-04-24 09:43:46.000000', 'Samsethy', '1', null);
INSERT INTO `patient_pe` VALUES ('14', '1', '161', 'General', 'eftrter rge\ngehrty sdfdhfgh\ndgfdhfdhfghf', 'Samsethy', '1', '2023-04-27 12:11:38.998242', '2023-04-27 12:11:38.000000', 'Samsethy', '1', '145');
INSERT INTO `patient_pe` VALUES ('15', '1', '162', 'General', 'dfdsfdsfdsfdsgd\nddfg\ndfgdfhd \ndfgfdhfgh', 'Samsethy', '1', '2023-04-27 23:04:59.965411', '2023-04-27 23:04:59.000000', 'Samsethy', '1', '146');

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
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4;

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
INSERT INTO `patient_photos` VALUES ('47', '1', 'general', '1_file_164456a364d6be20230424_120414.jpg', 'jpg', 'Samsethy', '2023-04-24 00:26:14.000000', '1', null, null, null, '150', '134');
INSERT INTO `patient_photos` VALUES ('48', '1', 'general', '1_file_164456a421ddbd20230424_120426.png', 'png', 'Samsethy', '2023-04-24 00:26:26.000000', '1', null, null, null, '150', '134');
INSERT INTO `patient_photos` VALUES ('49', '1', 'general', '1_file_164456a4b6e87c20230424_120435.png', 'png', 'Samsethy', '2023-04-24 00:26:35.000000', '1', null, null, null, '150', '134');
INSERT INTO `patient_photos` VALUES ('50', '1', 'general', '1_file_16445ec5a6ac9120230424_090430.jpg', 'jpg', 'Samsethy', '2023-04-24 09:41:30.000000', '1', null, null, null, '153', '138');
INSERT INTO `patient_photos` VALUES ('51', '1', 'general', '1_file_16445ec5d4105b20230424_090433.png', 'png', 'Samsethy', '2023-04-24 09:41:33.000000', '1', null, null, null, '153', '138');

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
  `patient_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of patient_prescription_items
-- ----------------------------
INSERT INTO `patient_prescription_items` VALUES ('1', '1', '15', 'sdfg', 'dfgdfg', '1', 'Samsethy', '2023-03-12 12:23:31.039009', '1', 'Samsethy', '2023-03-12 12:23:31.000000', null, '20.00', 'Box', '30.00', '114', '0.00', null);
INSERT INTO `patient_prescription_items` VALUES ('5', '1', '245', 'sdfdghfgf', 'fghhgfhfg', '1', 'Samsethy', '2023-03-12 12:23:39.267598', '1', 'Samsethy', '2023-03-12 12:23:39.000000', null, '30.00', 'Tube', '15.00', '114', '0.00', null);
INSERT INTO `patient_prescription_items` VALUES ('6', '1', '46', 'sdfdgfdh', 'dfdgfdh', '1', 'Samsethy', '2023-03-12 12:24:46.153961', '1', 'Samsethy', '2023-03-12 12:24:46.000000', null, '2.00', 'Box', '7.00', '114', '0.00', null);
INSERT INTO `patient_prescription_items` VALUES ('8', '1', '81', '2 times per day', 'for safety', '1', 'Samsethy', '2023-04-05 20:11:28.080241', '1', 'Samsethy', '2023-04-05 20:11:28.000000', null, '15.00', 'Box', '30.00', '124', '100.00', null);
INSERT INTO `patient_prescription_items` VALUES ('9', '1', '232', 'apply', 'need it', '1', 'Samsethy', '2023-04-05 20:11:30.246051', '1', 'Samsethy', '2023-04-05 20:11:30.000000', null, '20.00', 'Box', '45.00', '124', '100.00', null);
INSERT INTO `patient_prescription_items` VALUES ('11', '1', '63', 'sadsdg', null, '1', 'Samsethy', '2023-04-05 20:11:32.757352', '1', 'Samsethy', '2023-04-05 20:11:32.000000', null, '3.00', 'Tube', '50.00', '124', '100.00', null);
INSERT INTO `patient_prescription_items` VALUES ('12', '1', '106', 'hhh', null, '1', 'Samsethy', '2023-04-06 00:28:00.748720', '1', 'Samsethy', '2023-04-06 00:28:00.000000', null, '5.00', 'Bottle', '30.00', '120', '100.00', null);
INSERT INTO `patient_prescription_items` VALUES ('13', '1', '106', null, null, '1', 'Samsethy', '2023-04-06 00:32:45.000000', null, null, null, null, '5.00', 'Bottle', '0.00', '122', '100.00', null);
INSERT INTO `patient_prescription_items` VALUES ('14', '1', '106', 'dfdg', null, '1', 'Samsethy', '2023-04-09 15:03:30.924214', '1', 'Samsethy', '2023-04-09 15:03:30.000000', null, '20.00', 'Bottle', '20.00', '130', '100.00', null);
INSERT INTO `patient_prescription_items` VALUES ('15', '1', '245', 'egfhfh', null, '1', 'Samsethy', '2023-04-09 15:03:41.252373', '1', 'Samsethy', '2023-04-09 15:03:41.000000', null, '10.00', 'Tube', '25.00', '130', '100.00', null);
INSERT INTO `patient_prescription_items` VALUES ('16', '1', '245', '2 per day', 'sdfdsfds', '1', 'Samsethy', '2023-04-10 05:17:11.797868', '1', 'Samsethy', '2023-04-10 05:17:11.000000', null, '10.00', 'Tube', '20.00', '132', '100.00', null);
INSERT INTO `patient_prescription_items` VALUES ('24', '1', '123', null, null, '1', 'Samsethy', '2023-04-11 20:04:12.902543', '1', 'Samsethy', '2023-04-11 20:04:12.000000', null, '0.00', 'Tube', '0.00', '133', '100.00', null);
INSERT INTO `patient_prescription_items` VALUES ('25', '1', '46', null, null, '1', 'Samsethy', '2023-04-11 20:04:08.994465', '1', 'Samsethy', '2023-04-11 20:04:08.000000', null, '0.00', 'Tablet', '0.00', '133', '100.00', null);
INSERT INTO `patient_prescription_items` VALUES ('26', '1', '244', null, null, '1', 'Samsethy', '2023-04-11 13:43:45.052799', '1', 'Samsethy', '2023-04-11 13:43:45.000000', null, '0.00', 'Tube', '1.00', '133', '100.00', null);
INSERT INTO `patient_prescription_items` VALUES ('27', '1', '106', null, null, '1', 'Samsethy', '2023-04-11 23:11:35.817080', '1', 'Samsethy', '2023-04-11 23:11:35.000000', null, '0.00', 'Tube', '0.00', '133', '100.00', null);
INSERT INTO `patient_prescription_items` VALUES ('28', '1', '106', null, null, '1', 'Samsethy', '2023-04-11 13:58:26.000000', null, null, null, null, '0.00', 'Tube', '0.00', '133', '100.00', null);
INSERT INTO `patient_prescription_items` VALUES ('29', '1', '232', null, null, '1', 'Samsethy', '2023-04-11 14:02:01.000000', null, null, null, null, '10.00', 'Tube', '0.00', '133', '100.00', null);
INSERT INTO `patient_prescription_items` VALUES ('30', '1', '245', 'dfsddsf', null, '1', 'Samsethy', '2023-04-12 00:35:01.317649', '1', 'Samsethy', '2023-04-12 00:35:01.000000', null, '3.00', 'Tube', '3.00', '134', '100.00', null);
INSERT INTO `patient_prescription_items` VALUES ('31', '1', '46', 'dfdsfdsgd', null, '1', 'Samsethy', '2023-04-12 00:42:13.891704', '1', 'Samsethy', '2023-04-12 00:42:13.000000', null, '2.00', 'Bottle', '0.00', '134', '100.00', null);
INSERT INTO `patient_prescription_items` VALUES ('32', '1', '245', 'fdsgdsdsg', null, '1', 'Samsethy', '2023-04-12 00:35:07.190148', '1', 'Samsethy', '2023-04-12 00:35:07.000000', null, '7.00', 'Tube', '2.00', '134', '100.00', null);
INSERT INTO `patient_prescription_items` VALUES ('33', '1', '245', 'dfsdgdsds', null, '1', 'Samsethy', '2023-04-12 01:08:45.730718', '1', 'Samsethy', '2023-04-12 01:08:45.000000', null, '3.00', 'Bottle', '0.00', '134', '100.00', null);
INSERT INTO `patient_prescription_items` VALUES ('39', '1', '106', 'zxcxcvc', null, '1', 'Samsethy', '2023-04-12 10:35:03.979548', '1', 'Samsethy', '2023-04-12 10:35:03.000000', null, '30.00', 'Bottle', '0.00', '134', '100.00', null);
INSERT INTO `patient_prescription_items` VALUES ('40', '1', '106', 'dsfdsfgf', null, '1', 'Samsethy', '2023-04-12 10:35:08.412215', '1', 'Samsethy', '2023-04-12 10:35:08.000000', null, '70.00', 'Bottle', '0.00', '134', '100.00', null);
INSERT INTO `patient_prescription_items` VALUES ('41', '1', '62', 'dfdgdgfdg', null, '1', 'Samsethy', '2023-04-12 10:35:11.152656', '1', 'Samsethy', '2023-04-12 10:35:11.000000', null, '80.00', 'Tablet', '0.00', '134', '100.00', null);
INSERT INTO `patient_prescription_items` VALUES ('42', '1', '106', 'sdfd', null, '1', 'Samsethy', '2023-04-12 10:35:06.000000', null, null, null, null, '0.00', 'Bottle', '0.00', '134', '100.00', null);
INSERT INTO `patient_prescription_items` VALUES ('43', '1', '106', '15', null, '1', 'Samsethy', '2023-04-13 15:17:21.415184', '1', 'Samsethy', '2023-04-13 15:17:21.000000', null, '1.00', 'Bottle', '0.00', '135', '100.00', null);
INSERT INTO `patient_prescription_items` VALUES ('44', '1', '106', 'sdfdsf', null, '1', 'Samsethy', '2023-04-15 22:50:58.708407', '1', 'Samsethy', '2023-04-15 22:50:58.000000', null, '3.00', 'Bottle', '0.00', '137', '100.00', null);
INSERT INTO `patient_prescription_items` VALUES ('45', '1', '106', null, null, '1', 'Samsethy', '2023-04-15 22:51:03.000000', null, null, null, null, '3.00', 'Bottle', '0.00', '137', '100.00', null);
INSERT INTO `patient_prescription_items` VALUES ('46', '1', '106', 'dfdgert', null, '1', 'Samsethy', '2023-04-27 12:49:10.151445', '1', 'Samsethy', '2023-04-27 12:49:10.000000', null, '2.00', 'Bottle', '20.00', '161', '100.00', '145');
INSERT INTO `patient_prescription_items` VALUES ('47', '1', '106', 'fdgfd', null, '1', 'Samsethy', '2023-04-27 12:49:07.857225', '1', 'Samsethy', '2023-04-27 12:49:07.000000', null, '30.00', 'Bottle', '15.00', '161', '100.00', '145');
INSERT INTO `patient_prescription_items` VALUES ('48', '1', '106', '10', 'sfdsgdgdg', '1', 'Samsethy', '2023-04-27 23:03:09.840529', '1', 'Samsethy', '2023-04-27 23:03:09.000000', null, '2.00', 'Bottle', '0.00', '162', '100.00', '146');

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
  `doctor_id` int(11) DEFAULT NULL,
  `first_nurse_id` int(11) DEFAULT NULL,
  `second_nurse_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of patient_services
-- ----------------------------
INSERT INTO `patient_services` VALUES ('1', '1', '11', '1', '2023-03-12 13:38:07.364916', 'fdsfgfd', '1.00', 'none', '2023-03-12 13:38:07.364916', 'Samsethy', '1', '2023-03-12 13:38:07.000000', '1', 'Samsethy', null, null, '0.00', null, null, null);
INSERT INTO `patient_services` VALUES ('2', '1', '27', '1', '2023-03-12 14:22:29.573772', 'fgeryer', '1.00', 'none', '2023-03-12 14:22:29.573772', 'Samsethy', '1', '2023-03-12 14:22:29.000000', '1', 'Samsethy', '114', '119', '0.00', null, null, null);
INSERT INTO `patient_services` VALUES ('4', '1', '1', '13', '2023-03-12 19:11:41.428103', 'g', '1.00', 'none', '2023-03-12 19:11:41.428103', 'Samsethy', '1', '2023-03-12 19:11:41.000000', '1', 'Samsethy', '114', '119', '0.00', null, null, null);
INSERT INTO `patient_services` VALUES ('5', '1', '2', '12', '2023-03-13 08:58:40.558218', 'dfdgdfh', '1.00', 'none', '2023-03-13 08:58:40.558218', 'Samsethy', '1', '2023-03-13 08:58:40.000000', '1', 'Samsethy', '114', '119', '0.00', null, null, null);
INSERT INTO `patient_services` VALUES ('6', '1', '10', '2', '2023-03-21 12:06:40.541989', 'kkkk', '1.00', 'none', '2023-03-21 12:06:40.541989', 'Samsethy', '1', '2023-03-21 12:06:40.000000', '1', 'Samsethy', '120', '118', '0.00', null, null, null);
INSERT INTO `patient_services` VALUES ('7', '1', '1', '1', '2023-03-21 12:06:36.848099', 'gggg', '0.00', 'none', '2023-03-21 12:06:36.848099', 'Samsethy', '1', '2023-03-21 12:06:36.000000', '1', 'Samsethy', '120', '118', '0.00', null, null, null);
INSERT INTO `patient_services` VALUES ('8', '1', '11', '1', '2023-03-21 12:06:27.420816', 'sfddgdfg', '1.00', 'none', '2023-03-21 12:06:27.420816', 'Samsethy', '1', '2023-03-21 12:06:27.000000', '1', 'Samsethy', '120', '118', '0.00', null, null, null);
INSERT INTO `patient_services` VALUES ('9', '1', '28', null, null, null, '0.00', 'none', '2023-04-04 22:44:05.000000', 'Samsethy', '1', null, null, null, '123', '121', '0.00', null, null, null);
INSERT INTO `patient_services` VALUES ('10', '1', '2', '2', '2023-04-05 20:16:50.084772', 'dfdsgsdgdg', '1.00', 'none', '2023-04-05 20:16:50.084772', 'Samsethy', '1', '2023-04-05 20:16:50.000000', '1', 'Samsethy', '124', '122', '0.00', null, null, null);
INSERT INTO `patient_services` VALUES ('11', '1', '11', '1', '2023-04-05 20:16:52.227373', 'dfdsgsdgdsgd', '1.00', 'none', '2023-04-05 20:16:52.227373', 'Samsethy', '1', '2023-04-05 20:16:52.000000', '1', 'Samsethy', '124', '122', '10.00', null, null, null);
INSERT INTO `patient_services` VALUES ('13', '1', '11', null, null, null, '0.00', 'none', '2023-04-11 19:58:33.000000', 'Samsethy', '1', null, null, null, '133', '122', '10.00', null, null, null);
INSERT INTO `patient_services` VALUES ('14', '1', '11', null, null, null, '0.00', 'none', '2023-04-11 19:58:35.000000', 'Samsethy', '1', null, null, null, '133', '122', '10.00', null, null, null);
INSERT INTO `patient_services` VALUES ('15', '1', '11', '1', '2023-04-12 09:11:29.585850', null, '1.00', 'none', '2023-04-12 09:11:29.585850', 'Samsethy', '1', '2023-04-12 09:11:29.000000', '1', 'Samsethy', '134', '125', '10.00', null, null, null);
INSERT INTO `patient_services` VALUES ('16', '1', '11', '1', '2023-04-12 09:11:34.434269', null, '1.00', 'none', '2023-04-12 09:11:34.434269', 'Samsethy', '1', '2023-04-12 09:11:34.000000', '1', 'Samsethy', '134', '125', '10.00', null, null, null);
INSERT INTO `patient_services` VALUES ('17', '1', '11', null, null, null, '0.00', 'none', '2023-04-12 09:11:36.000000', 'Samsethy', '1', null, null, null, '134', '125', '10.00', null, null, null);
INSERT INTO `patient_services` VALUES ('18', '1', '36', '2', '2023-04-13 15:17:27.397886', null, '1.00', 'none', '2023-04-13 15:17:27.397886', 'Samsethy', '1', '2023-04-13 15:17:27.000000', '1', 'Samsethy', '135', '122', '150.00', null, null, null);
INSERT INTO `patient_services` VALUES ('19', '1', '1', null, null, null, '0.00', 'none', '2023-04-16 23:51:15.000000', 'Samsethy', '1', null, null, null, '138', '129', '0.00', null, null, null);
INSERT INTO `patient_services` VALUES ('20', '1', '11', '1', '2023-04-24 09:48:47.088551', 'fgfdgf', '1.00', 'none', '2023-04-24 09:48:47.088551', 'Samsethy', '1', '2023-04-24 09:48:47.000000', '1', 'Samsethy', '153', '138', '10.00', null, null, null);
INSERT INTO `patient_services` VALUES ('21', '1', '37', '2', '2023-04-24 09:48:53.033917', 'fgfdghf', '1.00', 'none', '2023-04-24 09:48:53.033917', 'Samsethy', '1', '2023-04-24 09:48:53.000000', '1', 'Samsethy', '153', '138', '160.00', null, null, null);
INSERT INTO `patient_services` VALUES ('22', '1', '1', '2', '2023-04-27 10:31:04.098072', 'dfgfgdfgfd', '1.00', 'none', '2023-04-27 10:31:04.098072', 'Samsethy', '1', '2023-04-27 10:31:04.000000', '1', 'Samsethy', '161', '145', '0.00', null, null, null);
INSERT INTO `patient_services` VALUES ('23', '1', '11', '1', '2023-04-27 22:13:24.951740', 'dfgdgfdg', '1.00', 'none', '2023-04-27 22:13:24.951740', 'Samsethy', '1', '2023-04-27 22:13:24.000000', '1', 'Samsethy', '161', '145', '10.00', null, null, null);
INSERT INTO `patient_services` VALUES ('24', '1', '11', '1', '2023-04-27 10:31:18.805877', 'dgdgd', '1.00', 'none', '2023-04-27 10:31:18.805877', 'Samsethy', '1', '2023-04-27 10:31:18.000000', '1', 'Samsethy', '161', '145', '10.00', null, null, null);
INSERT INTO `patient_services` VALUES ('25', '1', '11', null, '2023-04-27 22:49:19.038989', 'dfgfdh', '1.00', 'none', '2023-04-27 22:49:19.038989', 'Samsethy', '1', '2023-04-27 22:49:19.000000', '1', 'Samsethy', '162', '146', '10.00', '2', '1', null);
INSERT INTO `patient_services` VALUES ('26', '1', '1', null, '2023-04-27 23:00:15.082572', '3213', '1.00', 'none', '2023-04-27 23:00:15.082572', 'Samsethy', '1', '2023-04-27 23:00:15.000000', '1', 'Samsethy', '162', '146', '0.00', '1', '2', null);
INSERT INTO `patient_services` VALUES ('27', '1', '11', null, '2023-04-27 23:02:20.206771', null, '1.00', 'none', '2023-04-27 23:02:20.206771', 'Samsethy', '1', '2023-04-27 23:02:20.000000', '1', 'Samsethy', '162', '146', '10.00', '2', '1', null);

-- ----------------------------
-- Table structure for `patient_vital_signs`
-- ----------------------------
DROP TABLE IF EXISTS `patient_vital_signs`;
CREATE TABLE `patient_vital_signs` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `ticket_id` int(10) DEFAULT NULL,
  `patient_id` int(10) DEFAULT NULL,
  `vital_sign_id` int(10) DEFAULT NULL,
  `vital_sign_value` varchar(50) DEFAULT NULL,
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
  `updat_uid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=628 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of patient_vital_signs
-- ----------------------------
INSERT INTO `patient_vital_signs` VALUES ('535', '136', '125', '1', '30', 'Body temperature', null, '2023-04-14 00:44:41.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('536', '136', '125', '2', '17', 'Impulse rate', '2023-04-14 00:59:29.907571', '2023-04-14 00:59:29.907571', '1', 'Samsethy', '2023-04-14 00:59:29.000000', '1', 'Samsethy', '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('537', '136', '125', '2', '17', 'Impulse rate', '2023-04-14 00:59:29.907571', '2023-04-14 00:59:29.907571', '1', 'Samsethy', '2023-04-14 00:59:29.000000', '1', 'Samsethy', '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('538', '136', '125', '3', '26', 'Respiration Rate', null, '2023-04-14 00:58:42.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('539', '136', '125', '4', '10', 'Blood pressure', null, '2023-04-14 00:58:48.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('544', '137', '129', '1', '3', 'Body temperature', null, '2023-04-15 21:44:09.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('545', '137', '129', '2', '1', 'Impulse rate', null, '2023-04-15 21:44:10.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('546', '137', '129', '3', '2', 'Respiration Rate', null, '2023-04-15 21:44:11.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('547', '137', '129', '4', '5', 'Blood pressure', null, '2023-04-15 21:44:12.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('552', '142', '131', '1', '25', 'Body temperature', '2023-04-21 15:44:11.000000', '2023-04-21 15:44:11.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('553', '142', '131', '2', '12', 'Impulse rate', '2023-04-21 15:44:11.000000', '2023-04-21 15:44:11.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('554', '142', '131', '3', '8', 'Respiration Rate', '2023-04-21 15:44:11.000000', '2023-04-21 15:44:11.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('555', '142', '131', '4', '1/5', 'Blood pressure', '2023-04-21 15:44:11.000000', '2023-04-21 15:44:11.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('564', '145', '134', '1', '12', 'Body temperature', '2023-04-21 15:58:41.000000', '2023-04-21 15:58:41.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('565', '145', '134', '2', '5', 'Impulse rate', '2023-04-21 15:58:41.000000', '2023-04-21 15:58:41.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('566', '145', '134', '3', '6', 'Respiration Rate', '2023-04-21 15:58:41.000000', '2023-04-21 15:58:41.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('567', '145', '134', '4', '12/16', 'Blood pressure', '2023-04-21 15:58:41.000000', '2023-04-21 15:58:41.000000', '1', 'Samsethy', null, null, null, '1', null, null);
INSERT INTO `patient_vital_signs` VALUES ('604', '160', '144', '1', null, 'Body temperature', '2023-04-27 01:10:23.000000', '2023-04-27 01:10:23.000000', '1', 'Samsethy', null, null, null, '1', '232', null);
INSERT INTO `patient_vital_signs` VALUES ('605', '160', '144', '2', null, 'Impulse rate', '2023-04-27 01:10:23.000000', '2023-04-27 01:10:23.000000', '1', 'Samsethy', null, null, null, '1', '232', null);
INSERT INTO `patient_vital_signs` VALUES ('606', '160', '144', '3', null, 'Respiration Rate', '2023-04-27 01:10:23.000000', '2023-04-27 01:10:23.000000', '1', 'Samsethy', null, null, null, '1', '232', null);
INSERT INTO `patient_vital_signs` VALUES ('607', '160', '144', '4', null, 'Blood pressure', '2023-04-27 01:10:23.000000', '2023-04-27 01:10:23.000000', '1', 'Samsethy', null, null, null, '1', '232', null);

-- ----------------------------
-- Table structure for `payment_methods`
-- ----------------------------
DROP TABLE IF EXISTS `payment_methods`;
CREATE TABLE `payment_methods` (
  `id` int(10) NOT NULL,
  `name` varchar(150) NOT NULL,
  `method_type` varchar(50) DEFAULT NULL,
  `branch_id` int(11) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of payment_methods
-- ----------------------------
INSERT INTO `payment_methods` VALUES ('1', 'Cash', 'Cash', '1');
INSERT INTO `payment_methods` VALUES ('2', 'ACLEDA', 'Bank', '1');
INSERT INTO `payment_methods` VALUES ('3', 'ABA', 'Bank', '1');
INSERT INTO `payment_methods` VALUES ('4', 'WING', 'Bank', '1');
INSERT INTO `payment_methods` VALUES ('5', 'True Money', 'Agent', '1');

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
) ENGINE=InnoDB AUTO_INCREMENT=157 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of persons
-- ----------------------------
INSERT INTO `persons` VALUES ('1', '1', 'Sinora', 'Sin', 'M', '2023-03-12', '15', '012567672', null, 'dd@gmailcom', null, null, null, null, '', '0', null, 'Samsethy', '1', '2023-04-19 15:53:33', null, null, null);
INSERT INTO `persons` VALUES ('2', '1', 'DR', 'Samsethy', 'M', '2023-03-20', '14', '012345646', null, 'samg@mailcom', null, null, null, null, '', '0', null, 'Samsethy', '1', '2023-04-19 15:53:37', null, null, null);
INSERT INTO `persons` VALUES ('50', '1', 'Darany', 'Ms', 'F', '2022-10-10', '14', '012555653', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-01 10:19:48', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('51', '1', '', 'KKKKK', 'F', '2022-09-12', '14', '0125656765', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-03 17:39:11', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('52', '1', 'name client one', 'new', 'M', '2023-01-02', '14', '012555666', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-04 13:19:03', 'Samsethy', '1', '2023-01-01 15:55:42', null, null, null);
INSERT INTO `persons` VALUES ('53', '1', '', 'DDDDDD', 'M', '2023-05-08', '14', '093488789', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-04 13:40:21', 'Samsethy', '1', '2023-05-01 19:14:24', null, null, null);
INSERT INTO `persons` VALUES ('54', '1', 'AAA', 'DSDF', 'M', '2023-05-17', '14', '0112225653', null, null, null, null, null, null, 'Samsethy', '1', '2022-12-04 13:41:53', 'Samsethy', '1', '2023-05-01 19:14:05', null, null, null);
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
INSERT INTO `persons` VALUES ('115', '1', '', 'Dyna', 'M', '2023-01-08', '14', '023546657', null, null, null, null, null, null, 'Samsethy', '1', '2023-03-06 15:29:47', 'Samsethy', '1', '2023-04-19 23:57:41', null, null, null);
INSERT INTO `persons` VALUES ('116', '1', '', 'Gonna', 'M', '2023-03-26', '14', '023546641', null, null, null, null, null, null, 'Samsethy', '1', '2023-03-06 16:20:43', 'Samsethy', '1', '2023-04-20 00:01:13', null, null, null);
INSERT INTO `persons` VALUES ('117', '1', 'THOUN', 'Samsethy', 'M', '2000-01-01', null, '012345646', null, 'samgmailcom', null, null, null, null, 'sam', '4', '2023-03-20 19:52:13', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('118', '1', 'sfddsg', 'GGG', 'M', '2022-12-05', '14', '011255671', null, null, null, null, null, null, 'Samsethy', '1', '2023-03-21 03:32:25', 'Samsethy', '1', '2023-04-20 00:23:45', null, null, null);
INSERT INTO `persons` VALUES ('119', '1', '', 'Dynano', 'F', '2023-03-05', '14', '0124565464', null, null, null, null, null, null, 'Samsethy', '1', '2023-03-31 12:45:55', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('120', '1', 'sdsfds', 'Sopheara', 'M', '2022-11-06', '14', '023546645', null, 'sdfsdfdsdfdsg email', 'adddfdfgdgdresss', null, null, null, 'Samsethy', '1', '2023-04-04 16:30:17', 'Samsethy', '1', '2023-04-19 23:59:01', null, null, null);
INSERT INTO `persons` VALUES ('121', '1', '', 'Sinara', 'F', '2022-10-16', '14', '01111221', null, null, null, null, null, null, 'Samsethy', '1', '2023-04-08 22:42:16', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('122', '1', '', 'Sopan', 'F', '2023-02-12', '14', '01167661', null, null, null, null, null, null, 'Samsethy', '1', '2023-04-08 22:42:37', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('123', '1', '', 'Sotheara', 'F', '2023-04-02', '14', '015556765', null, null, null, null, null, null, 'Samsethy', '1', '2023-04-08 22:55:18', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('124', '1', 'DG Name', 'new', 'M', '2023-04-02', '14', '01146456', null, 'sfdssdgdgcom', 'dsfdsgdfg', null, null, null, 'Samsethy', '1', '2023-04-09 10:14:06', 'Samsethy', '1', '2023-04-20 00:35:04', null, null, null);
INSERT INTO `persons` VALUES ('125', '1', 'one A', 'Some', 'F', '2022-02-06', '14', '011456456', null, null, null, null, null, null, 'Samsethy', '1', '2023-04-09 15:43:38', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('126', '1', '', 'sasfsd', 'M', '2023-04-09', '14', '012214234', null, null, null, null, null, null, 'Samsethy', '1', '2023-04-09 16:09:00', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('127', '1', '', 'Fana', 'M', '1998-04-18', '14', '0124546456', null, 'fana@gmailcom', null, null, null, null, 'Samsethy', '1', '2023-04-18 11:48:33', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('136', '0', null, null, '', null, null, null, null, null, null, null, null, null, '', '0', null, null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('137', '1', 'HHH', 'GGG', 'M', null, '14', '011565656', null, 'sds@gmailcom', null, null, null, null, 'Samsethy', '1', '2023-04-19 15:31:25', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('138', '1', ' KKK', 'JJJ', 'M', null, '14', '0234234', null, 'dd@gmailcom', null, null, null, null, 'Samsethy', '1', '2023-04-19 15:32:37', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('139', '1', 'P', 'NEW', 'F', '2000-04-21', '14', '011235325', null, 'dd@gmailcom', null, null, null, null, 'Samsethy', '1', '2023-04-21 15:44:11', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('140', '1', 'LALA', 'NEW', 'F', '1998-04-21', '14', '0125657567', null, 'sdfdf@gmailcom', null, null, null, null, 'Samsethy', '1', '2023-04-21 15:47:02', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('141', '1', 'VVV', 'NEW', 'M', '1993-04-21', '14', '423756357690', null, null, null, null, null, null, 'Samsethy', '1', '2023-04-21 15:55:54', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('142', '1', 'AND REAL V', 'HYPER', 'M', '1998-04-21', '14', '011456457657', null, 'sdsgmailcom', null, null, null, null, 'Samsethy', '1', '2023-04-21 15:58:41', 'Samsethy', '1', '2023-04-21 22:28:45', null, null, null);
INSERT INTO `persons` VALUES ('143', '1', 'one A', 'Some', 'M', '1990-04-21', '14', '011456456456', null, null, null, null, null, null, 'Samsethy', '1', '2023-04-21 23:48:29', 'Samsethy', '1', '2023-04-23 22:28:36', null, null, null);
INSERT INTO `persons` VALUES ('144', '1', '', 'Davan', 'F', '1995-04-24', '14', '0112324234', null, 'dfdsf', null, null, null, null, 'Samsethy', '1', '2023-04-24 01:18:09', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('145', '1', 'Patient', 'New', 'M', '1991-04-24', '14', '012235345', null, null, null, null, null, null, 'Samsethy', '1', '2023-04-24 01:29:31', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('146', '1', '', 'fdgfdgdfgdfg', 'F', '1990-04-24', '14', '012243545', null, null, null, null, null, null, 'Samsethy', '1', '2023-04-24 09:39:03', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('147', '1', '', 'fsdfdsfgdgfd', 'M', '1990-04-27', '14', '012214324523', null, 'ddgmailcom', 'fgertert', null, null, null, 'Samsethy', '1', '2023-04-27 00:27:36', 'Samsethy', '1', '2023-05-01 21:25:02', null, null, null);
INSERT INTO `persons` VALUES ('148', '1', '', 'fdfdgfdgfdg', 'M', '1987-04-27', '14', '011234232', null, null, null, null, null, null, 'Samsethy', '1', '2023-04-27 00:59:00', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('149', '1', '', 'DFFFSdf', 'M', '1987-04-27', '14', '012435456', null, 'dfdggdf', 'dfdghfdh', null, null, null, 'Samsethy', '1', '2023-04-27 01:02:36', 'Samsethy', '1', '2023-05-02 10:27:08', null, null, null);
INSERT INTO `persons` VALUES ('150', '1', '', 'fsddfg', 'M', '1988-04-27', '14', '0124543645', null, null, null, null, null, null, 'Samsethy', '1', '2023-04-27 01:06:41', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('151', '1', '', 'sdsdfgfdgfdgfd', 'M', '1990-04-27', '14', '0123534645', null, 'errt', 'dfdgdfhfghfghfg', null, null, null, 'Samsethy', '1', '2023-04-27 01:09:21', 'Samsethy', '1', '2023-05-01 19:20:44', null, null, null);
INSERT INTO `persons` VALUES ('152', '1', '', 'Liza', 'M', '2022-12-05', '14', '0123454645', null, 'somegmailcom', 'sfddsgf BBB', null, null, null, 'Samsethy', '1', '2023-04-27 01:10:23', 'Samsethy', '1', '2023-05-01 19:27:28', null, null, null);
INSERT INTO `persons` VALUES ('153', '1', 'name', 'new', 'M', '2022-10-02', '14', '0124354365', null, null, null, null, null, null, 'Samsethy', '1', '2023-04-27 01:11:13', 'Samsethy', '1', '2023-04-30 18:09:41', null, null, null);
INSERT INTO `persons` VALUES ('154', '1', 'p1', 'Super', 'M', '2022-12-05', '14', '012345346', null, null, null, null, null, null, 'Samsethy', '1', '2023-04-27 17:53:52', 'Samsethy', '1', '2023-05-01 11:42:40', null, null, null);
INSERT INTO `persons` VALUES ('155', '1', 'NEW', 'BBB', 'M', '1993-05-01', '14', '0123243543', null, 'dfdsfdfd', null, null, null, null, 'Samsethy', '1', '2023-05-01 18:53:18', null, null, null, null, null, null);
INSERT INTO `persons` VALUES ('156', '1', '', 'Sotheary', 'M', '2023-03-12', '14', '012234325345', null, 'sotheary@gmail.com', null, null, null, null, 'Samsethy', '1', '2023-05-23 09:49:26', 'Samsethy', '1', '2023-05-23 09:49:37', null, null, null);

-- ----------------------------
-- Table structure for `plan_subscriptions`
-- ----------------------------
DROP TABLE IF EXISTS `plan_subscriptions`;
CREATE TABLE `plan_subscriptions` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `client_id` int(10) NOT NULL,
  `service_plan_id` int(10) NOT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_user` varchar(50) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `remarks` varchar(100) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `sales_agent_id` int(11) DEFAULT NULL,
  `sales_agent_type` varchar(35) DEFAULT 'Freelancer',
  `price` decimal(10,2) DEFAULT 0.00,
  `agent_commission` decimal(10,2) DEFAULT 0.00,
  `expiration_date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of plan_subscriptions
-- ----------------------------
INSERT INTO `plan_subscriptions` VALUES ('4', '1', '129', '41', '2023-04-18 00:11:13.000000', 'Samsethy', '1', null, null, null, '', null, null, null, 'Freelancer', '0.00', '0.00', null);
INSERT INTO `plan_subscriptions` VALUES ('19', '1', '143', '47', '2023-05-23 10:12:36.000000', 'Samsethy', '1', null, null, null, null, null, null, null, 'Staff', '0.00', '0.00', '2023-06-22');
INSERT INTO `plan_subscriptions` VALUES ('20', '1', '142', '47', '2023-05-23 10:13:04.000000', 'Samsethy', '1', null, null, null, null, null, null, null, 'Staff', '0.00', '0.00', '2023-06-22');

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
INSERT INTO `queue_ticket_control` VALUES ('1', '1', '1', 'G', '2023-04-11', null);
INSERT INTO `queue_ticket_control` VALUES ('1', '1', '1', 'G', '2023-04-12', null);
INSERT INTO `queue_ticket_control` VALUES ('1', '1', '1', 'G', '2023-04-13', null);
INSERT INTO `queue_ticket_control` VALUES ('1', '1', '1', 'G', '2023-04-14', null);
INSERT INTO `queue_ticket_control` VALUES ('1', '1', '1', 'G', '2023-04-15', null);
INSERT INTO `queue_ticket_control` VALUES ('1', '1', '1', 'G', '2023-04-16', null);
INSERT INTO `queue_ticket_control` VALUES ('1', '1', '1', 'G', '2023-04-17', null);
INSERT INTO `queue_ticket_control` VALUES ('1', '2', '1', 'G', '2023-04-18', null);
INSERT INTO `queue_ticket_control` VALUES ('1', '2', '1', 'G', '2023-04-21', null);
INSERT INTO `queue_ticket_control` VALUES ('1', '4', '2', 'D', '2023-04-21', null);
INSERT INTO `queue_ticket_control` VALUES ('1', '2', '1', 'G', '2023-04-23', null);
INSERT INTO `queue_ticket_control` VALUES ('1', '4', '1', 'G', '2023-04-24', null);
INSERT INTO `queue_ticket_control` VALUES ('1', '5', '1', 'G', '2023-04-27', null);
INSERT INTO `queue_ticket_control` VALUES ('1', '2', '2', 'D', '2023-04-27', null);
INSERT INTO `queue_ticket_control` VALUES ('1', '2', '12', 'P', '2023-04-27', null);
INSERT INTO `queue_ticket_control` VALUES ('1', '1', '1', 'G', '2023-05-01', null);

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
INSERT INTO `receipt_number_control` VALUES ('tax_line', null, '1', '2023', 'P', '88');

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
INSERT INTO `reports` VALUES ('1', '100', 'revenues', 'Revenues', 'Finance', 'start_date|end_date', '1', '0');
INSERT INTO `reports` VALUES ('1', '100', 'rev_by_category', 'Revenue by section', 'Finance', 'start_date|end_date', '2', '0');
INSERT INTO `reports` VALUES ('1', '100', 'rev_by_client', 'Revenue by client', 'Finance', 'start_date|end_date', '2', '0');
INSERT INTO `reports` VALUES ('1', '100', 'invoice_list', 'Invoice List', 'Finance', 'start_date|end_date', '2', '0');
INSERT INTO `reports` VALUES ('1', '100', 'profit_and_losss', 'Profit and Loss', 'Finance', 'start_date|end_date', '2', '0');
INSERT INTO `reports` VALUES ('2', '100', 'staff_list', 'Staff List', 'HRM', 'department_id', '3', '0');
INSERT INTO `reports` VALUES ('3', '100', 'client_list', 'Client List', 'Sales', '', '5', '0');
INSERT INTO `reports` VALUES ('4', '100', 'product_list', 'Product List', 'Inventory', '', '2', '0');
INSERT INTO `reports` VALUES ('5', '100', 'on_hand_stocks', 'On-hand Stocks', 'Inventory', 'warehouse_id|start_date|end_date', '5', '0');
INSERT INTO `reports` VALUES ('5', '100', 'labo_tests', 'Labo Tests', 'Operation', 'start_date|end_date', '5', '0');
INSERT INTO `reports` VALUES ('5', '100', 'services', 'Services', 'Operation', 'emp_id|start_date|end_date', '5', '0');

-- ----------------------------
-- Table structure for `services_performed`
-- ----------------------------
DROP TABLE IF EXISTS `services_performed`;
CREATE TABLE `services_performed` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `service_id` int(10) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `doctor_id` int(10) DEFAULT NULL,
  `first_nurse_id` int(10) DEFAULT NULL,
  `second_nurse_id` int(10) DEFAULT NULL,
  `third_nurse_id` int(10) DEFAULT NULL,
  `patient_id` int(10) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_user` varchar(50) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `service_plan_id` int(10) DEFAULT NULL,
  `invoice_id` int(10) DEFAULT NULL,
  `invoice_item_id` int(10) DEFAULT NULL,
  `doctor_commission` decimal(10,2) DEFAULT 0.00,
  `first_nurse_commission` decimal(10,2) DEFAULT 0.00,
  `service_date` date DEFAULT NULL,
  `client_id` int(11) DEFAULT NULL,
  `invoice_number` varchar(35) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of services_performed
-- ----------------------------

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
  `member_count` int(11) DEFAULT 0,
  `create_uid` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of service_plans
-- ----------------------------
INSERT INTO `service_plans` VALUES ('44', '1', 'monthly', '2023-05-02 06:05:24.472961', 'Samsethy', '2023-05-02 06:05:24.472961', null, null, null, 'USD', null, '0', '1', '120.00');
INSERT INTO `service_plans` VALUES ('47', '1', 'monthly', '2023-05-23 10:13:04.312314', 'Samsethy', '2023-05-23 10:13:04.312314', null, null, null, 'USD', null, '2', '1', '350.00');

-- ----------------------------
-- Table structure for `service_plan_items`
-- ----------------------------
DROP TABLE IF EXISTS `service_plan_items`;
CREATE TABLE `service_plan_items` (
  `service_plan_id` int(10) NOT NULL,
  `service_id` int(10) NOT NULL,
  `max_sku` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'max number of sku of the service',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_user` varchar(50) DEFAULT NULL,
  `update_uid` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `create_user` varchar(50) DEFAULT NULL,
  `create_uid` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of service_plan_items
-- ----------------------------
INSERT INTO `service_plan_items` VALUES ('47', '9', '25.00', '2023-05-23 10:04:15', 'Samsethy', null, '2023-05-02 05:48:43', 'Samsethy', '1', '1');
INSERT INTO `service_plan_items` VALUES ('44', '9', '50.00', '2023-05-23 10:04:22', 'Samsethy', null, '2023-05-02 06:14:06', 'Samsethy', '1', '1');

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
-- Table structure for `shops`
-- ----------------------------
DROP TABLE IF EXISTS `shops`;
CREATE TABLE `shops` (
  `id` int(10) NOT NULL,
  `branch_id` int(10) NOT NULL,
  `name` varchar(150) NOT NULL,
  `loc_at` decimal(10,0) DEFAULT NULL,
  `loc_lang` decimal(10,0) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `country_id` int(10) DEFAULT NULL,
  `city_id` int(10) DEFAULT NULL,
  `district_id` int(10) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_uid` int(10) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `shop_type` varchar(15) NOT NULL DEFAULT 'branch' COMMENT 'shop_type = branch|shop',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of shops
-- ----------------------------

-- ----------------------------
-- Table structure for `start_count`
-- ----------------------------
DROP TABLE IF EXISTS `start_count`;
CREATE TABLE `start_count` (
  `v_count` int(11) DEFAULT 0,
  `start_time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of start_count
-- ----------------------------
INSERT INTO `start_count` VALUES ('1', '2023-05-09 08:12:00');

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
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of test_labos
-- ----------------------------
INSERT INTO `test_labos` VALUES ('26', '32', '19.00', '6', '1', 'Samsethy', '2023-03-10 17:08:42.000000', null, null, null, null, '1', 'USD', '0');
INSERT INTO `test_labos` VALUES ('27', '27', '10.00', '6', '1', 'Samsethy', '2023-03-10 17:53:10.000000', null, null, null, null, '1', 'USD', '0');
INSERT INTO `test_labos` VALUES ('29', '32', '58.00', '4', '1', 'Samsethy', '2023-04-06 09:01:15.000000', null, null, null, null, '1', 'USD', '0');
INSERT INTO `test_labos` VALUES ('30', '27', '100.00', '1', '1', 'Samsethy', '2023-04-06 09:01:37.000000', null, null, null, null, '1', 'USD', '0');
INSERT INTO `test_labos` VALUES ('33', '27', '50.00', '4', '1', 'Samsethy', '2023-05-04 00:40:02.000000', null, null, null, null, '1', 'USD', '0');

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
) ENGINE=InnoDB AUTO_INCREMENT=164 DEFAULT CHARSET=utf8mb4;

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
INSERT INTO `tickets` VALUES ('133', 'G100001', '2023-04-11 11:42:38.000000', 'Samsethy', '1', '122', '1', null, '2023-04-11', '1', '1', null, '120', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('134', 'G100001', '2023-04-12 00:06:06.000000', 'Samsethy', '1', '125', '1', null, '2023-04-12', null, '1', null, '123', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('135', 'G100001', '2023-04-13 15:14:57.000000', 'Samsethy', '1', '122', '1', null, '2023-04-13', '2', '1', null, '120', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('136', 'G100001', '2023-04-14 00:38:05.000000', 'Samsethy', '1', '125', '1', null, '2023-04-14', null, '1', null, '123', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('137', 'G100001', '2023-04-15 12:35:59.000000', 'Samsethy', '1', '129', '1', null, '2023-04-15', null, '1', null, '124', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('138', 'G100001', '2023-04-16 10:52:36.000000', 'Samsethy', '1', '129', '1', null, '2023-04-16', '1', '1', null, '124', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('139', 'G100001', '2023-04-17 09:29:21.000000', 'Samsethy', '1', '122', '1', null, '2023-04-17', null, '1', null, '120', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('140', 'G100001', '2023-04-18 11:21:21.000000', 'Samsethy', '1', '129', '1', null, '2023-04-18', null, '1', null, '124', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('142', 'G100001', '2023-04-21 15:44:11.000000', 'Samsethy', '1', '131', '1', null, '2023-04-21', '1', '1', null, '139', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('145', 'D100003', '2023-04-21 15:58:41.000000', 'Samsethy', '1', '134', '2', null, '2023-04-21', '1', '1', null, '142', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('146', 'D100004', '2023-04-21 23:26:49.000000', 'Samsethy', '1', '120', '2', null, '2023-04-21', '2', '1', '216', '118', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('147', 'G100002', '2023-04-21 23:48:29.000000', 'Samsethy', '1', '135', '1', null, '2023-04-21', '2', '1', null, '143', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('149', 'G100002', '2023-04-23 23:28:04.000000', 'Samsethy', '1', '135', '1', null, '2023-04-23', '1', '1', '219', '143', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('150', 'G100001', '2023-04-24 00:04:25.000000', 'Samsethy', '1', '134', '1', null, '2023-04-24', '1', '1', '220', '142', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('151', 'G100002', '2023-04-24 01:18:09.000000', 'Samsethy', '1', '136', '1', null, '2023-04-24', '1', '1', null, '144', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('152', 'G100003', '2023-04-24 01:37:38.510782', 'Samsethy', '1', '137', '1', null, '2023-04-24', '1', '1', '222', '145', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('154', 'G100001', '2023-04-27 00:05:36.000000', 'Samsethy', '1', '138', '1', null, '2023-04-27', '2', '1', null, '146', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('155', 'G100002', '2023-04-27 00:27:36.000000', 'Samsethy', '1', '139', '1', null, '2023-04-27', '2', '1', null, '147', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('156', 'G100003', '2023-04-27 00:59:00.000000', 'Samsethy', '1', '140', '1', null, '2023-04-27', null, '1', null, '148', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('157', 'G100004', '2023-04-27 01:02:36.000000', 'Samsethy', '1', '141', '1', null, '2023-04-27', '2', '1', null, '149', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('158', 'D100001', '2023-04-27 01:06:41.000000', 'Samsethy', '1', '142', '2', null, '2023-04-27', null, '1', null, '150', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('159', 'P100001', '2023-04-27 01:09:21.000000', 'Samsethy', '1', '143', '12', null, '2023-04-27', null, '1', null, '151', '1', null, 'On Demand', null, null, null);
INSERT INTO `tickets` VALUES ('160', 'P100002', '2023-04-27 01:10:23.000000', 'Samsethy', '1', '144', '12', null, '2023-04-27', null, '1', null, '152', '1', null, 'On Demand', null, null, null);

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
INSERT INTO `um_branches` VALUES ('1', 'ESTHEDERM CLINIC', 'ESTHEDERM CLINIC', '1_file_164573eeeb090e20230507_010522.png', null, '#458 Street 24BT Sangkat Boeung Tompon Khan Meanchey Phnom Penh Cambodia', '012222333', 'solida', null, null, null, null, null, null, 'ផ្ទះលេខ៤៥៨ ផ្លូវ២៤BT សង្កាត់បឹងទំពន់ ខណ្ឌមានជ័យ រាធធានីភ្នំពេញ', 'infopucedukh', 'admin@gmail.com', '2023-05-07 13:02:25.000000', null, '2023-02-02 10:51:33', null, null, '2023-03-25 20:39:28');

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
) ENGINE=InnoDB AUTO_INCREMENT=246 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of um_role_permissions
-- ----------------------------
INSERT INTO `um_role_permissions` VALUES ('244', '101', '1', '1');
INSERT INTO `um_role_permissions` VALUES ('245', '103', '1', '1');

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
) ENGINE=InnoDB AUTO_INCREMENT=2126 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of um_sessions
-- ----------------------------
INSERT INTO `um_sessions` VALUES ('1840', '1', 'DXM20FKAEFC711EH2E7C9801A7BZD311', 'Bory', '2', '2023-02-02 11:04:47', '2023-02-02 11:04:47', 'TWY286rzc1Oucpp07znsiww3n89D8dF5UkwK8P', 'ukswNQRSy9ek72svrQlPHIs8RGQu68D3oMXCJ8', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpaXMiOm51bGwsImF1ZCI6bnVsbCwiaWF0IjoxNjc1MzEwNjg3LCJuYmYiOjE2NzUzMTA2ODcsImV4cCI6MTY3NTMxNDI4NywibGFuZyI6ImVuIiwiaWQiOjIsInVzZXJfY2xhc3MiOiJhZG1pbiIsIm9mZmljaWFsX2lkIjpudWxsLCJvZmZpY2lhbF9jb2RlIjpudWxsLCJsb2dpbl9uYW1lIjoiQm9yeSIsImJyYW5jaF9pZCI6MSwiZnVsbF9uYW1lIjoiQm9yeSIsInN0YXR1cyI6ImFjdGl2ZSIsImlzX2xvY2tlZCI6MCwiZW1haWwiOm51bGwsInBob25lX251bWJlciI6bnVsbCwib3RwX2NvZGUiOm51bGx9.YsJr6g2Lqu2QLmArmZ3-tTLHU7jP2ceDspbDvCXD4Zg', null, 'en');
INSERT INTO `um_sessions` VALUES ('1982', '1', 'DXM20FKAEFC711EH2E7C9801A7BZD311', 'sam', '4', '2023-03-20 19:49:20', '2023-03-20 19:49:20', '203n6I9eh82Ulmi32FAlGOpaNJ2vooN5w634oU', 'S9wjDJs5CWk9Yf1PhM578wndkcaoCx8EHpn9kD', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpaXMiOm51bGwsImF1ZCI6bnVsbCwiaWF0IjoxNjc5MzE2NTYwLCJuYmYiOjE2NzkzMTY1NjAsImV4cCI6MTY3OTMyNzM2MCwibGFuZyI6ImVuIiwiaWQiOjQsInVzZXJfY2xhc3MiOiJhZG1pbiIsIm9mZmljaWFsX2lkIjpudWxsLCJvZmZpY2lhbF9jb2RlIjpudWxsLCJsb2dpbl9uYW1lIjoic2FtIiwiYnJhbmNoX2lkIjoxLCJmdWxsX25hbWUiOiJzYW0iLCJzdGF0dXMiOiJhY3RpdmUiLCJpc19sb2NrZWQiOjAsImVtYWlsIjpudWxsLCJwaG9uZV9udW1iZXIiOm51bGwsIm90cF9jb2RlIjpudWxsfQ.FQBl_5dutCxYYSw8ByBJDeV_a5r4cuoTF5vqm2kCPWk', null, 'en');
INSERT INTO `um_sessions` VALUES ('2125', '1', 'DXM20FKAEFC711EH2E7C9801A7BZD311', 'admin@gmail.com', '1', '2023-05-23 09:47:54', '2023-05-23 09:47:54', 'pI1MeG5JNZ0q8EQMh2rIdJw15C3A7eGs2Djcej', '9HsJ4W52jRovxf4zKbODPy5N8csd3b7lzuOkR8', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpaXMiOm51bGwsImF1ZCI6bnVsbCwiaWF0IjoxNjg0ODEwMDc0LCJuYmYiOjE2ODQ4MTAwNzQsImV4cCI6MTY4NDgyMDg3NCwibGFuZyI6ImVuIiwiaWQiOjEsInVzZXJfY2xhc3MiOiJhZG1pbiIsIm9mZmljaWFsX2lkIjpudWxsLCJvZmZpY2lhbF9jb2RlIjoiMDAwMSIsImxvZ2luX25hbWUiOiJhZG1pbkBnbWFpbC5jb20iLCJicmFuY2hfaWQiOjEsImZ1bGxfbmFtZSI6IlNhbXNldGh5Iiwic3RhdHVzIjoiYWN0aXZlIiwiaXNfbG9ja2VkIjowLCJlbWFpbCI6bnVsbCwicGhvbmVfbnVtYmVyIjoiMDEyNTc4OTAiLCJvdHBfY29kZSI6bnVsbH0.kX-mZOVG6GtmYOHxxN8LX8o9WPXIYHEjqujU2VhFwOw', null, 'en');

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
INSERT INTO `um_users` VALUES ('1', 'admin@gmail.com', '01257890', null, '$2y$10$9s0nFmOKK6xEc8c63nT7KeQSGb4UoUio39dTBoQKrArZ3TlRh7LYK', '2023-05-09 10:16:14.193786', 'DXM20FKAEFC711EH2E7C9801A7BZD311', null, '1', 'Admin', '0', 'active', 'Samsethy', null, 'admin', 'admin@gmail.com', '3', '2021-09-13 04:00:26', '0001', '0', null, 'en', '2023-05-09 00:00:00');
INSERT INTO `um_users` VALUES ('2', 'Bory', null, null, '$2y$10$L7GTLkc8nljBQlTXBe8Pb.iYD7WohbkziOO5BpH1VqXb/.Z/CObx2', '2023-05-09 10:16:14.193786', 'DXM20FKAEFC711EH2E7C9801A7BZD311', null, '1', 'standard', '0', 'active', 'Bory', null, 'admin', 'Samsethy', '1', null, null, '0', null, 'en', '2023-05-09 00:00:00');
INSERT INTO `um_users` VALUES ('3', 'Admin1', null, null, '$2y$10$i9dEkdttYHGKXuUBS2a23.IDs30JcUhC5f/cdcLzzdogBfiHLIzi2', '2023-05-09 10:16:14.193786', 'DXM20FKAEFC711EH2E7C9801A7BZD311', null, '1', 'standard', '0', 'active', 'Admin1', null, 'admin', 'Samsethy', '1', null, null, '0', null, 'en', '2023-05-09 00:00:00');
INSERT INTO `um_users` VALUES ('4', 'sam', null, null, '$2y$10$PIDtZi/IXS8kdAhxErHbFOayAP0ehJ8jxBo.s2tJiN1NqonlSvehe', '2023-05-09 10:16:14.193786', 'DXM20FKAEFC711EH2E7C9801A7BZD311', null, '1', 'standard', '0', 'active', 'sam', null, 'admin', 'Samsethy', '1', null, null, '0', null, 'en', '2023-05-09 00:00:00');

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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of vendors
-- ----------------------------
INSERT INTO `vendors` VALUES ('1', '1', 'General Vendor', '023767676', 'gen@gmail.com', null, null, null, null, null, '2023-04-07 19:12:05.200330', null, '1', null, null, null, null, '1', 'Samsethy', '2023-04-07 19:12:05.000000');
INSERT INTO `vendors` VALUES ('4', '1', 'New vendor', '012234234', null, null, null, null, '1', 'Samsethy', '2023-05-23 09:48:21.000000', null, '1', null, null, null, null, null, null, null);

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
INSERT INTO `vital_signs` VALUES ('1', 'body_temperatur', 'Body temperature', 'string', '1', null, '2023-04-12 23:59:31', '1', '1', '-1');
INSERT INTO `vital_signs` VALUES ('2', 'impulse_rate', 'Impulse rate', 'string', '1', null, '2023-04-12 23:59:31', '1', '1', '-1');
INSERT INTO `vital_signs` VALUES ('3', 'respiration_', 'Respiration Rate', 'string', '1', null, '2023-04-12 23:59:31', '1', '1', '-1');
INSERT INTO `vital_signs` VALUES ('4', 'Blood pressure', 'Blood pressure', 'string', '1', null, '2023-04-12 23:55:36', '1', '1', '-1');

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
  `transfer_type` varchar(10) DEFAULT NULL COMMENT 'transfer_type = {to,from}',
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
  `uom` varchar(30) NOT NULL,
  `po_id` int(10) DEFAULT NULL,
  `item_id` int(10) NOT NULL,
  `item_code` varchar(30) DEFAULT NULL,
  `local_code` varchar(30) DEFAULT NULL,
  `expiration_date` date DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `trx_type_id` int(10) DEFAULT NULL COMMENT 'trx_type_id = 1= receive PO, 2 = transfer to shop, 3 = transfer to other warehouse, 4 = returned to vendor, 5 = disposal, 6 = take for operational Internal usage, 7 = take into WIP,  6 = takeout for other reason such as Charity',
  `remarks` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of warehouse_transactions
-- ----------------------------

-- ----------------------------
-- Table structure for `wholesale_prices`
-- ----------------------------
DROP TABLE IF EXISTS `wholesale_prices`;
CREATE TABLE `wholesale_prices` (
  `id` int(10) NOT NULL DEFAULT 0,
  `item_id` int(10) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_user` varchar(50) DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `update_uid` int(10) DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `price_type` varchar(15) DEFAULT NULL COMMENT 'price_type = retail|wholesale',
  `uom` varchar(10) DEFAULT NULL,
  `unit_id` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of wholesale_prices
-- ----------------------------

-- ----------------------------
-- Function structure for `displayMoney`
-- ----------------------------
DROP FUNCTION IF EXISTS `displayMoney`;
DELIMITER ;;
CREATE  FUNCTION `displayMoney`(amt decimal(10,2),ccode varchar(10)) RETURNS varchar(100) CHARSET utf8mb4
    DETERMINISTIC
BEGIN
  declare sym varchar(15);
  declare symbol_after int;
  declare dec_points int;
  declare val varchar(100);
  if (amt IS null) then
    set amt =0;
  end if;
 
  SELECT c.symbol, c.symbol_after, c.decimal_points INTO sym, symbol_after,dec_points FROM currencies as c WHERE c.code =ccode limit 1;
  IF (symbol_after =1) THEN
    set val = concat(amt,sym);
  ELSE set val= concat(sym,amt); 
  END IF;
  return val; 
end
;;
DELIMITER ;

-- ----------------------------
-- Function structure for `formatDate`
-- ----------------------------
DROP FUNCTION IF EXISTS `formatDate`;
DELIMITER ;;
CREATE  FUNCTION `formatDate`(mDate Date) RETURNS varchar(50) CHARSET utf8mb4
    DETERMINISTIC
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
CREATE  FUNCTION `formatDateTime`(mDate Date) RETURNS varchar(50) CHARSET utf8mb4
    DETERMINISTIC
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
CREATE  FUNCTION `formatTime`(mDate Date) RETURNS varchar(30) CHARSET utf8mb4
    DETERMINISTIC
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
CREATE  FUNCTION `getApptStatus`(branchid INT,statusid INT) RETURNS varchar(20) CHARSET utf8mb4
    DETERMINISTIC
BEGIN
   declare ss varchar(20); 
   SET ss = (select `name` from appt_statuses where id =statusid AND branch_id =branchid LIMIT 1);  
   return IFNULL(ss,'Pending');
END
;;
DELIMITER ;

-- ----------------------------
-- Function structure for `getConsultanName`
-- ----------------------------
DROP FUNCTION IF EXISTS `getConsultanName`;
DELIMITER ;;
CREATE  FUNCTION `getConsultanName`(consultantid INT) RETURNS varchar(50) CHARSET utf8mb4
    DETERMINISTIC
BEGIN
 declare cname varchar(50);
 set cname = (select concat(first_name,' ',last_name) as `fullname` from persons as p INNER JOIN employees as e ON e.person_id = p.id WHERE p.id = consultantid LIMIT 1);
 return cname; 
end
;;
DELIMITER ;

-- ----------------------------
-- Function structure for `getCurSymbol`
-- ----------------------------
DROP FUNCTION IF EXISTS `getCurSymbol`;
DELIMITER ;;
CREATE  FUNCTION `getCurSymbol`(ccode varchar(10)) RETURNS varchar(10) CHARSET utf8mb4
    DETERMINISTIC
BEGIN
  declare ss varchar(10);
  SET ss = (select `symbol` from currencies as c where c.`code` = ccode limit 1);
  return ss;
end
;;
DELIMITER ;

-- ----------------------------
-- Function structure for `getCustomerName`
-- ----------------------------
DROP FUNCTION IF EXISTS `getCustomerName`;
DELIMITER ;;
CREATE  FUNCTION `getCustomerName`(cid INT) RETURNS varchar(150) CHARSET utf8mb4
BEGIN
 declare cname varchar(150);
 set cname = (select `name`from customers where id = cid LIMIT 1);
 return cname;  
end
;;
DELIMITER ;

-- ----------------------------
-- Function structure for `getEmpName`
-- ----------------------------
DROP FUNCTION IF EXISTS `getEmpName`;
DELIMITER ;;
CREATE  FUNCTION `getEmpName`(empid int) RETURNS varchar(100) CHARSET utf8mb4
BEGIN
 declare ename varchar(100);
 SET ename = (select concat(p.last_name,' ',p.first_name) from employees as e inner join persons as p ON p.id = e.person_id WHERE e.id = empid LIMIT 1);
 return ename; 
END
;;
DELIMITER ;

-- ----------------------------
-- Function structure for `getGroupQty`
-- ----------------------------
DROP FUNCTION IF EXISTS `getGroupQty`;
DELIMITER ;;
CREATE  FUNCTION `getGroupQty`(groupid INT) RETURNS decimal(10,2)
    DETERMINISTIC
BEGIN
  declare qty decimal(10,2);
  SET qty = (SELECT SUM(IFNULL(c.qty,0)) AS qty FROM inv_item_groups AS g INNER JOIN inv_items AS i ON i.group_id = g.id INNER JOIN inv_current_stocks AS c ON i.id = c.item_id WHERE g.id =groupid LIMIT 1);
  return qty;      
END
;;
DELIMITER ;

-- ----------------------------
-- Function structure for `getItemDetailType`
-- ----------------------------
DROP FUNCTION IF EXISTS `getItemDetailType`;
DELIMITER ;;
CREATE  FUNCTION `getItemDetailType`(detailtypeid INT) RETURNS varchar(150) CHARSET utf8mb4
    DETERMINISTIC
BEGIN
  declare detailtype varchar(150);
  SET detailtype = (select d.`name` from inv_detailed_types as d where d.id =detailtypeid LIMIT 1);
  RETURN detailtype;   
END
;;
DELIMITER ;

-- ----------------------------
-- Function structure for `getItemQty`
-- ----------------------------
DROP FUNCTION IF EXISTS `getItemQty`;
DELIMITER ;;
CREATE  FUNCTION `getItemQty`(itemid INT) RETURNS decimal(10,2)
    DETERMINISTIC
BEGIN
  declare qty decimal(10,2);
  SET qty = (SELECT IFNULL(c.qty,0) AS qty FROM inv_current_stocks AS c INNER JOIN inv_items AS i ON i.id = c.item_id WHERE i.id =itemid LIMIT 1);
  return qty;      
END
;;
DELIMITER ;

-- ----------------------------
-- Function structure for `getLastStockDate`
-- ----------------------------
DROP FUNCTION IF EXISTS `getLastStockDate`;
DELIMITER ;;
CREATE  FUNCTION `getLastStockDate`(itemid int,stockclass_code varchar(25)) RETURNS varchar(30) CHARSET utf8mb4
BEGIN
  declare stockdate varchar(30);
  IF (IFNULL(stockclass_code,'') ='') THEN
    set stockdate = (select created_at from inv_current_stocks as d where d.item_id = itemid and d.stockclass_code = stockclass_code ORDER BY d.id DESC LIMIT 1);
  ELSE
    set stockdate = (select created_at from inv_current_stocks as d where d.item_id = itemid and d.stockclass_code = stockclass_code LIMIT 1);
  END IF;
  return stockdate;
END
;;
DELIMITER ;

-- ----------------------------
-- Function structure for `getPatientCode`
-- ----------------------------
DROP FUNCTION IF EXISTS `getPatientCode`;
DELIMITER ;;
CREATE  FUNCTION `getPatientCode`(branchid INT,clientid INT) RETURNS varchar(30) CHARSET utf8mb4
    DETERMINISTIC
begin
  DECLARE cc varchar(30); 
  set cc = (select `code` from patients as p where p.branch_id =branchid AND p.id =clientid LIMIT 1);
  return cc;
end
;;
DELIMITER ;

-- ----------------------------
-- Function structure for `getPatientName`
-- ----------------------------
DROP FUNCTION IF EXISTS `getPatientName`;
DELIMITER ;;
CREATE  FUNCTION `getPatientName`(cid INT) RETURNS varchar(150) CHARSET utf8mb4
BEGIN
 declare cname varchar(150);
 set cname = (select `name`from patients where id = cid LIMIT 1);
 return cname;  
end
;;
DELIMITER ;

-- ----------------------------
-- Function structure for `getReceivable`
-- ----------------------------
DROP FUNCTION IF EXISTS `getReceivable`;
DELIMITER ;;
CREATE  FUNCTION `getReceivable`(branchid INT, clientid INT) RETURNS decimal(10,2)
BEGIN
  DECLARE mYear int;
  declare amount decimal(10,2);
  SET mYear = YEAR(NOW()) -3; 
  SET amount = (SELECT SUM(amount_due - amount_paid) FROM invoices WHERE branch_id =branchid AND customer_id = clientid AND IFNULL(inactive,0) =0 AND YEAR(invoices.issue_date) >=mYear);
  RETURN amount;
END
;;
DELIMITER ;

-- ----------------------------
-- Function structure for `getTicketNumber`
-- ----------------------------
DROP FUNCTION IF EXISTS `getTicketNumber`;
DELIMITER ;;
CREATE  FUNCTION `getTicketNumber`(branchid INT,apptid INT) RETURNS varchar(30) CHARSET utf8mb4
    DETERMINISTIC
BEGIN
 declare ticket varchar(30); 
 SET ticket = (SELECT ticket_number FROM tickets where branch_id=branchid and appt_id = apptid LIMIT 1);
 RETURN ticket; 
END
;;
DELIMITER ;

-- ----------------------------
-- Function structure for `getTicketStatus`
-- ----------------------------
DROP FUNCTION IF EXISTS `getTicketStatus`;
DELIMITER ;;
CREATE  FUNCTION `getTicketStatus`(branchid INT,ticketid INT) RETURNS varchar(30) CHARSET utf8mb4
    DETERMINISTIC
BEGIN
  declare tstatus varchar(30);
  SET tstatus = (select sts.`name` from ticket_statuses AS sts INNER JOIN service_queue as s ON s.status_id = sts.id where s.id =ticketid LIMIT 1);
  return tstatus;
END
;;
DELIMITER ;

-- ----------------------------
-- Function structure for `hasPosition`
-- ----------------------------
DROP FUNCTION IF EXISTS `hasPosition`;
DELIMITER ;;
CREATE  FUNCTION `hasPosition`(empid INT,posid INT) RETURNS int(11)
    DETERMINISTIC
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
CREATE  FUNCTION `hasPositions`(empid INT,posid INT) RETURNS int(11)
    DETERMINISTIC
BEGIN
  SET @d= (EXISTS(select id from employee_positions as e WHERE e.emp_id = empid AND e.position_id = posid LIMIT 1));
  RETURN @d;
END
;;
DELIMITER ;

-- ----------------------------
-- Function structure for `has_child`
-- ----------------------------
DROP FUNCTION IF EXISTS `has_child`;
DELIMITER ;;
CREATE  FUNCTION `has_child`(groupid INT) RETURNS tinyint(4)
BEGIN
  DECLARE child_id INT;
  SET child_id = (select id from inv_items as i where i.group_id = groupid LIMIT 1);
  IF(child_id>0) THEN return 1;
  ELSE return 0;
  END IF;  
END
;;
DELIMITER ;

-- ----------------------------
-- Function structure for `has_prn`
-- ----------------------------
DROP FUNCTION IF EXISTS `has_prn`;
DELIMITER ;;
CREATE  FUNCTION `has_prn`(roleid INT, prnid INT) RETURNS tinyint(4)
BEGIN
  IF EXISTS(SELECT rp.permission_id FROM um_role_permissions as rp WHERE rp.role_id =roleid and rp.permission_id = prnid limit 1) THEN 
      return 1;
  ELSE return 0;
  end if;  

END
;;
DELIMITER ;

-- ----------------------------
-- Function structure for `has_variane`
-- ----------------------------
DROP FUNCTION IF EXISTS `has_variane`;
DELIMITER ;;
CREATE  FUNCTION `has_variane`(groupid INT) RETURNS tinyint(4)
BEGIN
  DECLARE child_id INT;
  SET child_id = (select id from inv_items as i where i.group_id = groupid LIMIT 1);
  IF(child_id>0) THEN return 1;
  ELSE return 0;
  END IF;  
END
;;
DELIMITER ;
