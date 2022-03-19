/*
Navicat MySQL Data Transfer

Source Server         : connection1
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : delivery_db

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2022-03-09 13:36:34
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `agent_code_control`
-- ----------------------------
DROP TABLE IF EXISTS `agent_code_control`;
CREATE TABLE `agent_code_control` (
  `id` int(10) NOT NULL DEFAULT 0,
  `branch_id` int(10) NOT NULL,
  `last_agent_number` int(10) NOT NULL,
  `prefix` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of agent_code_control
-- ----------------------------
INSERT INTO `agent_code_control` VALUES ('1', '1', '10', 'A');

-- ----------------------------
-- Table structure for `cash_disbursements`
-- ----------------------------
DROP TABLE IF EXISTS `cash_disbursements`;
CREATE TABLE `cash_disbursements` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `payment_date` timestamp NULL DEFAULT NULL,
  `description` varchar(150) NOT NULL,
  `amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `payee_id` int(10) DEFAULT NULL,
  `payee_type` varchar(25) DEFAULT NULL,
  `payee_name` varchar(150) DEFAULT NULL,
  `pmt_method` varchar(20) NOT NULL DEFAULT '',
  `cashier_name` varchar(35) NOT NULL,
  `create_user` varchar(35) NOT NULL,
  `create_date` timestamp NULL DEFAULT NULL,
  `create_uid` int(10) DEFAULT NULL,
  `pmt_type` varchar(30) DEFAULT NULL,
  `file_name` varchar(350) DEFAULT NULL,
  `file_type` varchar(10) DEFAULT NULL,
  `settlement_id` varchar(35) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of cash_disbursements
-- ----------------------------
INSERT INTO `cash_disbursements` VALUES ('28', '1', '2022-03-02 22:58:27', 'sfdgdf', '44.00', '39', 'sender', 'Seng Kimly', 'Cash', 'Admin@gmail.com', 'Admin@gmail.com', '2022-03-02 22:58:27', null, 'Payment to Vendor', '1_62204c2085589_20220303_120328.jpg', 'jpg', '11621F942377124');

-- ----------------------------
-- Table structure for `cash_disbursements_attachments`
-- ----------------------------
DROP TABLE IF EXISTS `cash_disbursements_attachments`;
CREATE TABLE `cash_disbursements_attachments` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `trx_id` int(10) NOT NULL,
  `upload_id` int(10) NOT NULL,
  `file_url` varchar(350) DEFAULT NULL,
  `create_user` varchar(35) DEFAULT NULL,
  `create_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `trx_type` varchar(25) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of cash_disbursements_attachments
-- ----------------------------

-- ----------------------------
-- Table structure for `cash_receipts`
-- ----------------------------
DROP TABLE IF EXISTS `cash_receipts`;
CREATE TABLE `cash_receipts` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `payer_name` varchar(50) DEFAULT NULL,
  `payer_type` varchar(15) NOT NULL,
  `payer_id` int(10) DEFAULT NULL,
  `payment_date` timestamp NULL DEFAULT NULL,
  `cashier_name` varchar(50) NOT NULL,
  `pmt_type` varchar(20) NOT NULL DEFAULT '' COMMENT 'driver payment, sender payment',
  `pmt_method` varchar(35) NOT NULL,
  `create_user` varchar(35) NOT NULL,
  `create_date` timestamp NULL DEFAULT NULL,
  `update_user` varchar(35) DEFAULT NULL,
  `update_date` timestamp NULL DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `description` varchar(150) DEFAULT NULL,
  `file_name` varchar(350) DEFAULT NULL,
  `file_type` varchar(10) DEFAULT NULL,
  `settlement_id` varchar(35) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of cash_receipts
-- ----------------------------
INSERT INTO `cash_receipts` VALUES ('35', '1', 'Phoeun Sopha', 'driver', '28', '2021-12-20 00:44:47', 'admin@gmail.com', 'driver payment', 'Cash', 'admin@gmail.com', '2021-12-20 00:44:47', null, null, '66.00', 'Payment received', null, null, '1161BF293FCC690');
INSERT INTO `cash_receipts` VALUES ('36', '1', 'Phoeun Sopha', 'driver', '28', '2021-12-20 00:44:47', 'admin@gmail.com', 'driver payment', 'Wing', 'admin@gmail.com', '2021-12-20 00:44:47', null, null, '25.00', 'Payment received', null, null, '1161BF293FCC690');
INSERT INTO `cash_receipts` VALUES ('41', '1', 'Khit Puthea', 'driver', '27', '2022-01-16 22:40:25', 'admin@gmail.com', 'driver payment', 'Cash', 'admin@gmail.com', '2022-01-16 22:40:25', null, null, '81.65', 'Payment received', null, null, '1161E393A93F414');
INSERT INTO `cash_receipts` VALUES ('42', '1', 'Khit Puthea', 'driver', '27', '2022-01-16 22:40:25', 'admin@gmail.com', 'driver payment', 'ABA', 'admin@gmail.com', '2022-01-16 22:40:25', null, null, '80.00', 'Payment received', null, null, '1161E393A93F414');
INSERT INTO `cash_receipts` VALUES ('45', '1', 'Phoeun Sopha', 'driver', '28', '2022-03-02 00:55:36', 'admin@gmail.com', 'driver payment', 'Cash', 'admin@gmail.com', '2022-03-02 00:55:36', null, null, '0.00', 'Payment received', null, null, '11621E5E18377D1');

-- ----------------------------
-- Table structure for `cash_receipts_attchments`
-- ----------------------------
DROP TABLE IF EXISTS `cash_receipts_attchments`;
CREATE TABLE `cash_receipts_attchments` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `trx_id` int(10) NOT NULL,
  `branch_id` int(10) NOT NULL,
  `upload_id` int(10) NOT NULL,
  `create_user` varchar(35) DEFAULT NULL,
  `create_date` timestamp NULL DEFAULT NULL,
  `file_url` varchar(350) DEFAULT NULL,
  `trx_type` varchar(25) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of cash_receipts_attchments
-- ----------------------------

-- ----------------------------
-- Table structure for `category`
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of category
-- ----------------------------

-- ----------------------------
-- Table structure for `change_info_otp`
-- ----------------------------
DROP TABLE IF EXISTS `change_info_otp`;
CREATE TABLE `change_info_otp` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `login_name` varchar(35) NOT NULL,
  `action_name` varchar(25) NOT NULL COMMENT 'action__name =''change_phone_number'', ''change_email'',''change_login_name''',
  `org_value` varchar(25) NOT NULL,
  `new_value` varchar(25) NOT NULL,
  `otp_code` varchar(10) DEFAULT NULL,
  `create_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `branch_id` int(10) NOT NULL,
  `user_id` int(10) NOT NULL,
  `expiry_time` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of change_info_otp
-- ----------------------------

-- ----------------------------
-- Table structure for `delivery`
-- ----------------------------
DROP TABLE IF EXISTS `delivery`;
CREATE TABLE `delivery` (
  `branch_id` int(10) NOT NULL,
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `order_id` int(10) DEFAULT NULL COMMENT 'order_id is linked to "orders" table',
  `driver_id` int(10) DEFAULT NULL,
  `status_id` tinyint(6) DEFAULT NULL,
  `depart_time` timestamp NULL DEFAULT NULL,
  `notes` varchar(200) DEFAULT NULL,
  `package_count` int(10) NOT NULL DEFAULT 0,
  `delivered_count` int(10) NOT NULL DEFAULT 0,
  `failed_count` int(10) DEFAULT 0,
  `create_user` varchar(50) DEFAULT NULL,
  `create_date` timestamp NULL DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL,
  `update_date` timestamp NULL DEFAULT NULL,
  `fleet_tracking_number` varchar(35) DEFAULT '' COMMENT 'fleet_tracking_number is used by delivery company to track each driver progoess',
  `warehouse_id` int(10) DEFAULT NULL,
  `vehicle_type` varchar(25) DEFAULT NULL,
  `delivery_type` varchar(25) DEFAULT NULL,
  `ctd_count` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of delivery
-- ----------------------------
INSERT INTO `delivery` VALUES ('1', '45', null, '27', '3', '2021-12-02 19:00:00', null, '2', '0', '0', 'admin@gmail.com', '2021-12-03 04:49:24', 'admin@gmail.com', '2021-12-03 04:49:24', '100003', '1', 'motobike', 'Normal', null);
INSERT INTO `delivery` VALUES ('1', '47', null, '0', '1', '2021-12-02 19:00:00', null, '0', '0', null, 'admin@gmail.com', '2021-12-03 04:38:42', 'admin@gmail.com', '2021-12-03 04:38:42', '', '1', 'motobike', 'Normal', null);
INSERT INTO `delivery` VALUES ('1', '48', null, '0', '1', '2021-12-02 19:00:00', null, '0', '0', null, 'admin@gmail.com', '2021-12-03 04:40:20', 'admin@gmail.com', '2021-12-03 04:40:20', '', '1', 'motobike', 'Normal', null);
INSERT INTO `delivery` VALUES ('1', '49', null, '28', '3', '2021-12-02 19:00:00', null, '6', '0', '0', 'admin@gmail.com', '2021-12-03 04:49:09', 'admin@gmail.com', '2021-12-03 04:49:09', '100004', '1', 'motobike', 'Normal', null);
INSERT INTO `delivery` VALUES ('1', '50', null, '27', '3', '2021-12-02 19:00:00', null, '2', '0', '0', 'admin@gmail.com', '2021-12-03 04:48:06', 'admin@gmail.com', '2021-12-03 04:48:06', '100005', '1', 'motobike', 'Normal', null);
INSERT INTO `delivery` VALUES ('1', '51', null, '28', '3', '2021-12-03 19:00:00', null, '7', '0', '0', 'admin@gmail.com', '2021-12-04 08:46:01', 'admin@gmail.com', '2021-12-04 08:46:01', '100006', '1', 'motobike', 'Normal', null);
INSERT INTO `delivery` VALUES ('1', '52', null, '27', '3', '2021-12-04 19:00:00', null, '3', '0', '0', 'admin@gmail.com', '2021-12-04 12:05:29', 'admin@gmail.com', '2021-12-04 12:05:29', '100007', '1', 'motobike', 'Normal', null);
INSERT INTO `delivery` VALUES ('1', '53', null, '28', '3', '2021-12-04 19:00:00', null, '5', '0', '0', 'admin@gmail.com', '2021-12-05 03:52:40', 'admin@gmail.com', '2021-12-05 03:52:40', '100008', '1', 'motobike', 'Normal', null);
INSERT INTO `delivery` VALUES ('1', '54', null, '27', '3', '2021-12-04 19:00:00', null, '5', '0', '0', 'admin@gmail.com', '2021-12-05 03:54:54', 'admin@gmail.com', '2021-12-05 03:54:54', '100009', '1', 'motobike', 'Normal', null);
INSERT INTO `delivery` VALUES ('1', '55', null, '28', '3', '2021-12-06 12:00:00', null, '1', '1', '0', 'admin@gmail.com', '2021-12-12 04:47:07', '081802428', '2021-12-11 21:47:07', '100010', '1', 'motobike', 'Normal', '0');
INSERT INTO `delivery` VALUES ('1', '59', null, '28', '3', '2021-12-14 12:00:00', null, '1', '0', '1', 'admin@gmail.com', '2021-12-15 02:05:18', '081802428', '2021-12-14 19:05:18', '100014', '1', 'motobike', 'Normal', '0');
INSERT INTO `delivery` VALUES ('1', '60', null, '28', '3', '2021-12-14 12:00:00', null, '1', '1', '0', 'admin@gmail.com', '2021-12-15 02:18:00', '081802428', '2021-12-14 19:18:00', '100015', '1', 'motobike', 'Normal', '0');
INSERT INTO `delivery` VALUES ('1', '61', null, '0', '1', '2021-12-16 12:00:00', null, '0', '0', null, 'admin@gmail.com', '2021-12-17 00:24:17', 'admin@gmail.com', '2021-12-17 07:24:17', '', '1', 'motobike', 'Normal', null);
INSERT INTO `delivery` VALUES ('1', '62', null, '0', '1', '2021-12-16 12:00:00', null, '0', '0', null, 'admin@gmail.com', '2021-12-17 00:24:38', 'admin@gmail.com', '2021-12-17 07:24:38', '', '1', 'motobike', 'Normal', null);
INSERT INTO `delivery` VALUES ('1', '63', null, '0', '1', '2021-12-16 12:00:00', null, '0', '0', null, 'admin@gmail.com', '2021-12-17 00:27:46', 'admin@gmail.com', '2021-12-17 07:27:46', '', '1', 'motobike', 'Normal', null);
INSERT INTO `delivery` VALUES ('1', '64', null, '0', '1', '2021-12-16 12:00:00', null, '0', '0', null, 'admin@gmail.com', '2021-12-17 00:28:21', 'admin@gmail.com', '2021-12-17 07:28:21', '', '1', 'motobike', 'Normal', null);
INSERT INTO `delivery` VALUES ('1', '65', null, '0', '1', '2021-12-16 12:00:00', null, '0', '0', null, 'admin@gmail.com', '2021-12-17 00:31:10', 'admin@gmail.com', '2021-12-17 07:31:10', '', '1', 'motobike', 'Normal', null);
INSERT INTO `delivery` VALUES ('1', '66', null, '0', '1', '2021-12-16 12:00:00', null, '0', '0', null, 'admin@gmail.com', '2021-12-17 00:31:55', 'admin@gmail.com', '2021-12-17 07:31:55', '', '1', 'motobike', 'Normal', null);
INSERT INTO `delivery` VALUES ('1', '67', null, '0', '1', '2021-12-16 12:00:00', null, '0', '0', null, 'admin@gmail.com', '2021-12-17 00:33:42', 'admin@gmail.com', '2021-12-17 07:33:42', '', '1', 'motobike', 'Normal', null);
INSERT INTO `delivery` VALUES ('1', '68', null, '0', '1', '2021-12-16 12:00:00', null, '0', '0', null, 'admin@gmail.com', '2021-12-17 00:36:28', 'admin@gmail.com', '2021-12-17 07:36:28', '', '1', 'motobike', 'Normal', null);
INSERT INTO `delivery` VALUES ('1', '69', null, '0', '1', '2021-12-16 12:00:00', null, '0', '0', null, 'admin@gmail.com', '2021-12-17 00:39:14', 'admin@gmail.com', '2021-12-17 07:39:14', '', '1', 'motobike', 'Normal', null);
INSERT INTO `delivery` VALUES ('1', '70', null, '0', '1', '2021-12-16 12:00:00', null, '0', '0', null, 'admin@gmail.com', '2021-12-17 00:41:16', 'admin@gmail.com', '2021-12-17 07:41:16', '', '1', 'motobike', 'Normal', null);
INSERT INTO `delivery` VALUES ('1', '71', null, '0', '1', '2021-12-16 12:00:00', null, '0', '0', null, 'admin@gmail.com', '2021-12-17 00:45:14', 'admin@gmail.com', '2021-12-17 07:45:14', '', '1', 'motobike', 'Normal', null);
INSERT INTO `delivery` VALUES ('1', '72', null, '0', '1', '2021-12-16 12:00:00', null, '0', '0', null, 'admin@gmail.com', '2021-12-17 01:07:32', 'admin@gmail.com', '2021-12-17 08:07:32', '', '1', 'motobike', 'Normal', null);
INSERT INTO `delivery` VALUES ('1', '73', null, '0', '1', '2021-12-16 12:00:00', null, '0', '0', null, 'admin@gmail.com', '2021-12-17 01:08:59', 'admin@gmail.com', '2021-12-17 08:08:59', '', '1', 'motobike', 'Normal', null);
INSERT INTO `delivery` VALUES ('1', '74', null, '28', '3', '2021-12-17 12:00:00', null, '5', '0', '0', 'admin@gmail.com', '2021-12-21 05:09:17', 'admin@gmail.com', '2021-12-21 05:09:17', '100016', '1', 'motobike', 'Normal', null);
INSERT INTO `delivery` VALUES ('1', '76', null, '27', '3', '2021-12-21 05:04:23', null, '10', '0', '0', null, '2021-12-21 05:04:23', 'admin@gmail.com', '2021-12-21 05:04:23', '100020', '1', 'motobike', null, '0');
INSERT INTO `delivery` VALUES ('1', '78', null, '30', '3', '2021-12-21 21:55:33', null, '3', '3', '0', null, '2022-01-24 03:05:07', '081802428', '2022-02-26 02:37:13', '100022', '1', 'moto bike', null, '0');
INSERT INTO `delivery` VALUES ('1', '79', null, '28', '3', '2022-03-01 23:45:18', null, '5', '0', '0', null, null, 'Admin@gmail.com', '2022-03-01 23:45:18', '100001', '1', 'motobike', null, '0');
INSERT INTO `delivery` VALUES ('1', '87', null, '30', '3', '2022-03-02 00:31:16', null, '0', '0', '0', null, null, 'admin@gmail.com', '2022-03-02 00:41:59', '100008', '1', 'moto bike', null, '0');
INSERT INTO `delivery` VALUES ('1', '89', null, '31', '2', '2022-03-07 12:21:08', null, '1', '0', '0', null, null, 'admin@gmail.com', '2022-03-07 12:21:08', '100010', '1', 'moto bike', null, '0');

-- ----------------------------
-- Table structure for `delivery_conditions`
-- ----------------------------
DROP TABLE IF EXISTS `delivery_conditions`;
CREATE TABLE `delivery_conditions` (
  `branch_id` int(10) NOT NULL,
  `name` varchar(30) NOT NULL,
  `display_name` varchar(150) NOT NULL,
  `delivery_in_minutes` int(10) NOT NULL DEFAULT -1 COMMENT 'delivery_in_minutes = 60 => system tracks if in 60 minutes the delivery is not delivered => notify or mark the deliveries failed',
  `is_default` tinyint(6) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of delivery_conditions
-- ----------------------------
INSERT INTO `delivery_conditions` VALUES ('1', 'VIP', 'VIP', '-1', '0');
INSERT INTO `delivery_conditions` VALUES ('1', 'MA', 'Pick Morning and Deliver Afternoon', '-1', '0');
INSERT INTO `delivery_conditions` VALUES ('1', 'AT', 'Pick Afternoon and Deliver Tomorrow', '-1', '0');
INSERT INTO `delivery_conditions` VALUES ('1', 'Normal', 'Default option when Creating Delivery at Office without pickup ', '-1', '1');

-- ----------------------------
-- Table structure for `delivery_statuses`
-- ----------------------------
DROP TABLE IF EXISTS `delivery_statuses`;
CREATE TABLE `delivery_statuses` (
  `id` int(10) NOT NULL,
  `name` varchar(255) NOT NULL COMMENT 'name ={Canceled,Delivery Started,Done}',
  `display_order` int(6) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of delivery_statuses
-- ----------------------------
INSERT INTO `delivery_statuses` VALUES ('0', 'Canceled', '1');
INSERT INTO `delivery_statuses` VALUES ('1', 'Pending', '2');
INSERT INTO `delivery_statuses` VALUES ('2', 'On Delivery', '3');
INSERT INTO `delivery_statuses` VALUES ('3', 'Done', '4');
INSERT INTO `delivery_statuses` VALUES ('4', 'Delayed', '5');

-- ----------------------------
-- Table structure for `driver`
-- ----------------------------
DROP TABLE IF EXISTS `driver`;
CREATE TABLE `driver` (
  `id` int(15) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `name` varchar(50) NOT NULL,
  `name_kh` varchar(50) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `phone_number` varchar(100) DEFAULT NULL,
  `national_id` varchar(35) DEFAULT '' COMMENT 'NID',
  `driver_license_number` varchar(35) DEFAULT NULL,
  `address` varchar(150) DEFAULT '',
  `vehicle_type` varchar(15) DEFAULT NULL COMMENT 'vehicle_type ={taxi,motobike,bicycle,drone}',
  `vehicle_number` varchar(15) DEFAULT '',
  `vehicle_make` varchar(35) DEFAULT NULL,
  `vehicle_year` int(10) DEFAULT NULL,
  `vehicle_des` varchar(150) DEFAULT NULL,
  `emp_type` varchar(20) NOT NULL,
  `salary` decimal(10,2) NOT NULL DEFAULT 0.00,
  `commission_percent` decimal(10,2) NOT NULL DEFAULT 0.00,
  `cp_phone_number` varchar(50) DEFAULT '',
  `cp_relationship` varchar(30) DEFAULT NULL,
  `cp_name` varchar(50) DEFAULT NULL,
  `code` varchar(25) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `status_code` varchar(20) DEFAULT NULL,
  `update_user` varchar(35) DEFAULT NULL,
  `update_date` timestamp NULL DEFAULT NULL,
  `create_user` varchar(35) DEFAULT NULL,
  `create_date` timestamp NULL DEFAULT NULL,
  `sex` varchar(10) DEFAULT NULL,
  `shift` varchar(15) DEFAULT '',
  `allow_fast_delivery` tinyint(4) DEFAULT NULL,
  `delivery_commission_type` varchar(15) DEFAULT NULL,
  `pickup_commission_type` varchar(15) DEFAULT NULL,
  `role` varchar(15) DEFAULT NULL,
  `photo_file_type` varchar(150) DEFAULT NULL,
  `photo_file_name` varchar(350) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of driver
-- ----------------------------
INSERT INTO `driver` VALUES ('27', '1', 'Khit Puthea', 'ឃិត ពុទ្ធា', null, '077312154', '001', null, '#458 St.24BT, Sangkat Boeung Tompon, Khan Meanchey, Phnom Penh, Cambodia', 'motobike', 'កំពង់ចាម 030390', null, null, null, 'full time', '0.00', '0.00', null, null, null, '10001', 'farmersonexpress01@gmail.com', 'active', 'admin@gmail.com', '2021-12-07 12:58:11', 'Puthea', '2021-12-07 12:58:11', 'M', 'FD', '0', null, null, null, null, null);
INSERT INTO `driver` VALUES ('28', '1', 'Phun Sopha', 'ភឿន សុផា', null, '010428632', '002', null, 'ខេត្ត កំពង់ចាម DFDF', 'motobike', 'គំពង់ចាម 030390', null, null, null, 'full time', '0.00', '0.00', null, null, null, '10002', null, 'active', 'admin@gmail.com', '2022-02-17 03:41:08', 'Puthea', '2022-02-17 03:41:08', 'M', 'FD', '0', null, null, null, 'png', '1_driver_profile_20220216_030208.png.png');
INSERT INTO `driver` VALUES ('30', '1', 'Dy Sovan', 'Dy Sovan', null, '012678901', null, null, 'sdfdsgfg', 'moto bike', 'PP1056741', null, null, null, 'part time', '0.00', '0.00', null, null, null, '10004', 'dysovan@gmail.com', 'active', null, '2021-12-21 03:41:43', 'admin@gmail.com', '2021-12-21 03:41:43', 'M', 'FD', '0', null, null, null, null, null);
INSERT INTO `driver` VALUES ('31', '1', '081802428', '081802428', null, '081802428', '081802428', null, 'sdgfh', 'moto bike', null, null, null, null, 'part time', '0.00', '0.00', null, null, null, '10005', null, 'active', null, null, 'admin@gmail.com', '2022-03-07 09:51:01', 'M', 'FD', '0', null, null, null, null, null);

-- ----------------------------
-- Table structure for `driver_code_control`
-- ----------------------------
DROP TABLE IF EXISTS `driver_code_control`;
CREATE TABLE `driver_code_control` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `last_driver_number` int(10) NOT NULL,
  `prefix` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of driver_code_control
-- ----------------------------
INSERT INTO `driver_code_control` VALUES ('2', '1', '5', null);

-- ----------------------------
-- Table structure for `driver_commissions`
-- ----------------------------
DROP TABLE IF EXISTS `driver_commissions`;
CREATE TABLE `driver_commissions` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `driver_id` int(10) NOT NULL,
  `delivery_type` varchar(30) NOT NULL,
  `pickup_commission_rate` decimal(10,2) DEFAULT 0.00,
  `delivery_commission_rate` decimal(10,2) DEFAULT 0.00,
  `pickup_commission` decimal(10,2) NOT NULL DEFAULT 0.00,
  `delivery_commission` decimal(10,2) NOT NULL DEFAULT 0.00,
  `use_rate` tinyint(6) NOT NULL DEFAULT 0 COMMENT 'use_rate=1 => use percentage of delivery fee',
  `is_current` tinyint(6) NOT NULL DEFAULT 1,
  `create_user` varchar(35) NOT NULL,
  `create_date` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `commission_per_pickup` tinyint(6) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of driver_commissions
-- ----------------------------
INSERT INTO `driver_commissions` VALUES ('17', '1', '27', 'normal', '0.00', '0.00', '0.12', '0.13', '0', '1', 'admin@gmail.com', '2021-11-29 01:09:27.000000', '1');
INSERT INTO `driver_commissions` VALUES ('18', '1', '27', 'fast', '0.00', '0.00', '0.13', '0.25', '0', '1', 'admin@gmail.com', '2021-11-29 01:09:27.000000', '1');
INSERT INTO `driver_commissions` VALUES ('19', '1', '28', 'normal', '0.00', '0.00', '0.13', '0.13', '0', '1', 'admin@gmail.com', '2021-11-29 01:09:48.000000', '1');
INSERT INTO `driver_commissions` VALUES ('20', '1', '28', 'fast', '0.00', '0.00', '0.13', '0.25', '0', '1', 'admin@gmail.com', '2021-11-29 01:09:48.000000', '1');

-- ----------------------------
-- Table structure for `driver_statuses`
-- ----------------------------
DROP TABLE IF EXISTS `driver_statuses`;
CREATE TABLE `driver_statuses` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `code` varchar(35) NOT NULL,
  `name` varchar(35) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of driver_statuses
-- ----------------------------
INSERT INTO `driver_statuses` VALUES ('1', 'active', 'Active');
INSERT INTO `driver_statuses` VALUES ('2', 'inactive', 'Inactive');

-- ----------------------------
-- Table structure for `driver_warehouses`
-- ----------------------------
DROP TABLE IF EXISTS `driver_warehouses`;
CREATE TABLE `driver_warehouses` (
  `branch_id` int(10) NOT NULL,
  `driver_id` int(10) NOT NULL,
  `warehouse_id` int(10) NOT NULL,
  `create_user` varchar(35) DEFAULT NULL,
  `create_date` timestamp NULL DEFAULT NULL,
  `is_default` tinyint(6) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of driver_warehouses
-- ----------------------------
INSERT INTO `driver_warehouses` VALUES ('1', '3', '1', null, null, '1');
INSERT INTO `driver_warehouses` VALUES ('1', '7', '1', null, null, '1');
INSERT INTO `driver_warehouses` VALUES ('1', '6', '1', null, null, '1');
INSERT INTO `driver_warehouses` VALUES ('1', '16', '1', null, null, '1');
INSERT INTO `driver_warehouses` VALUES ('1', '14', '1', null, null, '1');
INSERT INTO `driver_warehouses` VALUES ('1', '24', '1', null, null, '1');
INSERT INTO `driver_warehouses` VALUES ('1', '25', '1', null, null, '1');
INSERT INTO `driver_warehouses` VALUES ('1', '26', '1', null, null, '1');
INSERT INTO `driver_warehouses` VALUES ('1', '27', '1', null, null, '1');
INSERT INTO `driver_warehouses` VALUES ('1', '28', '1', null, null, '1');
INSERT INTO `driver_warehouses` VALUES ('1', '29', '1', null, null, '1');
INSERT INTO `driver_warehouses` VALUES ('1', '30', '1', null, null, '1');
INSERT INTO `driver_warehouses` VALUES ('1', '31', '1', null, null, '1');

-- ----------------------------
-- Table structure for `employment_types`
-- ----------------------------
DROP TABLE IF EXISTS `employment_types`;
CREATE TABLE `employment_types` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of employment_types
-- ----------------------------
INSERT INTO `employment_types` VALUES ('1', 'part time');
INSERT INTO `employment_types` VALUES ('2', 'full time');

-- ----------------------------
-- Table structure for `exchange_rates`
-- ----------------------------
DROP TABLE IF EXISTS `exchange_rates`;
CREATE TABLE `exchange_rates` (
  `branch_id` int(10) NOT NULL,
  `buy_rate` decimal(10,4) NOT NULL DEFAULT 1.0000,
  `sell_rate` decimal(10,4) NOT NULL DEFAULT 1.0000,
  `x_date` date DEFAULT NULL,
  `x_month` int(10) NOT NULL DEFAULT 0,
  `create_user` varchar(35) NOT NULL,
  `create_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of exchange_rates
-- ----------------------------
INSERT INTO `exchange_rates` VALUES ('1', '4100.0000', '4100.0000', null, '0', '', '2021-10-21 11:44:20');

-- ----------------------------
-- Table structure for `expenses`
-- ----------------------------
DROP TABLE IF EXISTS `expenses`;
CREATE TABLE `expenses` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `description` varchar(150) DEFAULT NULL,
  `expense_type` varchar(30) NOT NULL,
  `accrued` tinyint(6) NOT NULL DEFAULT 0,
  `credit_account_id` int(10) DEFAULT NULL,
  `expense_date` timestamp(6) NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `create_user` varchar(35) DEFAULT NULL,
  `create_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of expenses
-- ----------------------------

-- ----------------------------
-- Table structure for `failture_reason`
-- ----------------------------
DROP TABLE IF EXISTS `failture_reason`;
CREATE TABLE `failture_reason` (
  `id` int(10) NOT NULL,
  `reason` varchar(100) NOT NULL,
  `action` varchar(25) NOT NULL DEFAULT '0' COMMENT 'action = {Dliver again later, Returned to Sender}',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of failture_reason
-- ----------------------------

-- ----------------------------
-- Table structure for `faq_list`
-- ----------------------------
DROP TABLE IF EXISTS `faq_list`;
CREATE TABLE `faq_list` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `question_text` varchar(500) NOT NULL,
  `answer_text` varchar(500) NOT NULL,
  `branch_id` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of faq_list
-- ----------------------------

-- ----------------------------
-- Table structure for `guests`
-- ----------------------------
DROP TABLE IF EXISTS `guests`;
CREATE TABLE `guests` (
  `id` int(10) NOT NULL DEFAULT 0,
  `official_code` varchar(20) DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  `name_native` varchar(50) DEFAULT NULL,
  `full_address` varchar(150) DEFAULT NULL,
  `phone_number` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `sex` varchar(10) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of guests
-- ----------------------------

-- ----------------------------
-- Table structure for `invoices`
-- ----------------------------
DROP TABLE IF EXISTS `invoices`;
CREATE TABLE `invoices` (
  `invoice_id` varchar(50) NOT NULL,
  `invoice_date` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `sender_id` bigint(10) NOT NULL,
  `sender_email` varchar(50) NOT NULL,
  `sender_phone` varchar(50) NOT NULL,
  `sender_address` varchar(200) DEFAULT NULL,
  `invoice_number` varchar(25) DEFAULT NULL,
  `receiverr_name` varchar(50) NOT NULL,
  `receiver_email` varchar(50) DEFAULT NULL,
  `receiver_phone` varchar(50) NOT NULL,
  `receiver_address` varchar(200) DEFAULT NULL,
  `terms` varchar(25) NOT NULL,
  `create_date` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `create_user` varchar(50) NOT NULL,
  `package_id` bigint(10) NOT NULL,
  `branch_id` int(10) NOT NULL,
  PRIMARY KEY (`invoice_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of invoices
-- ----------------------------

-- ----------------------------
-- Table structure for `invoice_items`
-- ----------------------------
DROP TABLE IF EXISTS `invoice_items`;
CREATE TABLE `invoice_items` (
  `invoice_id` varchar(50) NOT NULL,
  `item_id` int(10) NOT NULL,
  `item_name` varchar(150) NOT NULL,
  `sku` varchar(25) NOT NULL,
  `qty` decimal(10,2) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `discount_percent` decimal(10,2) NOT NULL,
  `discount_amount` decimal(10,2) NOT NULL,
  `tax_percent` decimal(10,2) NOT NULL,
  `tax_amount` decimal(10,2) NOT NULL,
  `line_total` decimal(10,2) NOT NULL,
  `id` bigint(10) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of invoice_items
-- ----------------------------

-- ----------------------------
-- Table structure for `journal_entries`
-- ----------------------------
DROP TABLE IF EXISTS `journal_entries`;
CREATE TABLE `journal_entries` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `trx_date` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `description` varchar(200) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `impact` varchar(10) NOT NULL,
  `account_id` int(10) DEFAULT NULL,
  `account_type` varchar(25) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of journal_entries
-- ----------------------------

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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of loc_cities
-- ----------------------------
INSERT INTO `loc_cities` VALUES ('13', '14', 'ក្រុងភ្នំពេញ', 'ក្រុងភ្នំពេញ', 'Puthea', '2021-11-22 06:45:27', null, '1', null);

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
  `map_location` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of loc_countries
-- ----------------------------
INSERT INTO `loc_countries` VALUES ('14', 'Cambodia', 'Cambodia', 'Puthea', '2021-11-22 06:30:12', '1', null);

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
-- Table structure for `migrations`
-- ----------------------------
DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of migrations
-- ----------------------------
INSERT INTO `migrations` VALUES ('1', '2016_06_01_000001_create_oauth_auth_codes_table', '1');
INSERT INTO `migrations` VALUES ('2', '2016_06_01_000002_create_oauth_access_tokens_table', '1');
INSERT INTO `migrations` VALUES ('3', '2016_06_01_000003_create_oauth_refresh_tokens_table', '1');
INSERT INTO `migrations` VALUES ('4', '2016_06_01_000004_create_oauth_clients_table', '1');
INSERT INTO `migrations` VALUES ('5', '2016_06_01_000005_create_oauth_personal_access_clients_table', '1');
INSERT INTO `migrations` VALUES ('6', '2021_08_18_082420_create_category', '1');
INSERT INTO `migrations` VALUES ('7', '2021_08_18_082605_create_um_branch', '1');
INSERT INTO `migrations` VALUES ('8', '2021_08_18_082734_create_country', '1');
INSERT INTO `migrations` VALUES ('9', '2021_08_18_082808_create_city', '1');
INSERT INTO `migrations` VALUES ('10', '2021_08_18_082853_create_district', '1');
INSERT INTO `migrations` VALUES ('11', '2021_08_18_082922_create_commune', '1');
INSERT INTO `migrations` VALUES ('12', '2021_08_20_023252_create_slides', '1');
INSERT INTO `migrations` VALUES ('13', '2021_09_06_154629_create_sessions_table', '2');
INSERT INTO `migrations` VALUES ('14', '0000_00_00_000000_create_websockets_statistics_entries_table', '3');
INSERT INTO `migrations` VALUES ('15', '2014_10_12_100000_create_password_resets_table', '4');
INSERT INTO `migrations` VALUES ('17', '2022_02_23_082813_create_users_table', '5');

-- ----------------------------
-- Table structure for `mobile_brand_images`
-- ----------------------------
DROP TABLE IF EXISTS `mobile_brand_images`;
CREATE TABLE `mobile_brand_images` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `app_id` varchar(50) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `file_name` varchar(350) NOT NULL,
  `file_type` varchar(20) NOT NULL,
  `display_order` tinyint(6) DEFAULT NULL,
  `create_user` varchar(35) NOT NULL,
  `create_date` timestamp NULL DEFAULT NULL,
  `description` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of mobile_brand_images
-- ----------------------------
INSERT INTO `mobile_brand_images` VALUES ('18', '38DC051E122D11EC89909801A7B0D1FCH', '1', '1_622083faa76da_20220303_040346.jpg', 'jpg', null, 'Admin@gmail.com', '2022-03-03 16:01:46', null);
INSERT INTO `mobile_brand_images` VALUES ('22', '38DC051E122D11EC89909801A7B0D1FCH', '1', '1_62208e56d56df_20220303_040358.jpg', 'jpg', null, 'samsethy', '2022-03-03 16:45:58', null);
INSERT INTO `mobile_brand_images` VALUES ('24', '38DC051E122D11EC89909801A7B0D1FCH', '1', '1_622092a1808b9_20220303_050317.jpg', 'jpg', null, 'samsethy', '2022-03-03 17:04:17', null);
INSERT INTO `mobile_brand_images` VALUES ('25', '38DC051E122D11EC89909801A7B0D1FCH', '1', '1_622092b1d1ae9_20220303_050333.jpg', 'jpg', null, 'samsethy', '2022-03-03 17:04:33', null);
INSERT INTO `mobile_brand_images` VALUES ('26', '38DC051E122D11EC89909801A7B0D1FCH', '1', '1_622093ef81798_20220303_050351.jpg', 'jpg', null, 'samsethy', '2022-03-03 17:09:51', null);
INSERT INTO `mobile_brand_images` VALUES ('27', '584C7FF2122D11EC89909801A8B0D7XKD', '1', '1_62209c04d38fe_20220303_050320.jpg', 'jpg', null, 'samsethy', '2022-03-03 17:44:20', null);
INSERT INTO `mobile_brand_images` VALUES ('28', '584C7FF2122D11EC89909801A8B0D7XKD', '1', '1_62209c08c2e6f_20220303_050324.jpg', 'jpg', null, 'samsethy', '2022-03-03 17:44:24', null);
INSERT INTO `mobile_brand_images` VALUES ('29', '584C7FF2122D11EC89909801A8B0D7XKD', '1', '1_62209c0e09a47_20220303_050330.jpg', 'jpg', null, 'samsethy', '2022-03-03 17:44:30', null);

-- ----------------------------
-- Table structure for `mobile_images`
-- ----------------------------
DROP TABLE IF EXISTS `mobile_images`;
CREATE TABLE `mobile_images` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `file_name` varchar(350) NOT NULL,
  `app_id` varchar(50) NOT NULL,
  `user_id` int(10) NOT NULL,
  `is_private` tinyint(6) NOT NULL DEFAULT 0,
  `create_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_user` varchar(35) NOT NULL,
  `category` varchar(35) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of mobile_images
-- ----------------------------

-- ----------------------------
-- Table structure for `mobile_user_uploads`
-- ----------------------------
DROP TABLE IF EXISTS `mobile_user_uploads`;
CREATE TABLE `mobile_user_uploads` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `file_name` varchar(350) NOT NULL,
  `file_type` varchar(15) NOT NULL,
  `category` varchar(20) NOT NULL,
  `create_user` varchar(35) NOT NULL DEFAULT 'current_timestamp',
  `create_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of mobile_user_uploads
-- ----------------------------

-- ----------------------------
-- Table structure for `notifications`
-- ----------------------------
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `app_id` varchar(50) NOT NULL,
  `user_id` int(10) DEFAULT NULL COMMENT 'user_id is the sanser_id or driver_id',
  `message` varchar(250) NOT NULL,
  `title` varchar(100) NOT NULL,
  `expiry_time` timestamp NULL DEFAULT NULL,
  `is_read` tinyint(6) NOT NULL DEFAULT 0,
  `image_url` varchar(350) DEFAULT NULL,
  `create_date` timestamp NULL DEFAULT NULL,
  `user_class` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of notifications
-- ----------------------------
INSERT INTO `notifications` VALUES ('9', '1', '584C7FF2122D11EC89909801A8B0D7XKD', '122', 'One driver assigned to pick up something', 'Driver Assignment', '2022-03-07 22:21:28', '0', 'https://dms.vectorasfot.com/images/test.png', '2022-03-05 22:21:29', 'driver');
INSERT INTO `notifications` VALUES ('10', '1', '38DC051E122D11EC89909801A7B0D1FCH', '122', 'A driver has accepted your order', 'Order Accepted', '2022-03-07 22:23:30', '0', 'https://dms.vectorasfot.com/images/test.png', '2022-03-05 22:23:31', 'merchant');
INSERT INTO `notifications` VALUES ('11', '1', '38DC051E122D11EC89909801A7B0D1FCH', '122', 'A driver has accepted your order', 'Order Accepted', '2022-03-07 22:23:34', '0', 'https://dms.vectorasfot.com/images/test.png', '2022-03-05 22:23:34', 'merchant');
INSERT INTO `notifications` VALUES ('12', '1', '38DC051E122D11EC89909801A7B0D1FCH', '122', 'A driver has accepted your order', 'Order Accepted', '2022-03-07 22:23:44', '0', 'https://dms.vectorasfot.com/images/test.png', '2022-03-05 22:23:45', 'merchant');
INSERT INTO `notifications` VALUES ('13', '1', '38DC051E122D11EC89909801A7B0D1FCH', '127', 'A driver has accepted your order', 'Order Accepted', '2022-03-07 22:23:50', '0', 'https://dms.vectorasfot.com/images/test.png', '2022-03-05 22:23:50', 'merchant');
INSERT INTO `notifications` VALUES ('14', '1', '38DC051E122D11EC89909801A7B0D1FCH', '127', 'A driver has accepted your order', 'Order Accepted', '2022-03-07 22:30:06', '0', 'https://dms.vectorasfot.com/images/test.png', '2022-03-05 22:30:07', 'merchant');

-- ----------------------------
-- Table structure for `notification_reads`
-- ----------------------------
DROP TABLE IF EXISTS `notification_reads`;
CREATE TABLE `notification_reads` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `notif_id` int(10) NOT NULL,
  `user_id` int(10) NOT NULL COMMENT 'user_id is official_id such as sender_id or driver_id',
  `is_read` tinyint(6) NOT NULL,
  `create_date` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of notification_reads
-- ----------------------------

-- ----------------------------
-- Table structure for `oauth_access_tokens_not_used`
-- ----------------------------
DROP TABLE IF EXISTS `oauth_access_tokens_not_used`;
CREATE TABLE `oauth_access_tokens_not_used` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `client_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scopes` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `revoked` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_access_tokens_user_id_index` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of oauth_access_tokens_not_used
-- ----------------------------

-- ----------------------------
-- Table structure for `oauth_auth_codes_not_used`
-- ----------------------------
DROP TABLE IF EXISTS `oauth_auth_codes_not_used`;
CREATE TABLE `oauth_auth_codes_not_used` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `client_id` bigint(20) unsigned NOT NULL,
  `scopes` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `revoked` tinyint(1) NOT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_auth_codes_user_id_index` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of oauth_auth_codes_not_used
-- ----------------------------

-- ----------------------------
-- Table structure for `oauth_clients_not_used`
-- ----------------------------
DROP TABLE IF EXISTS `oauth_clients_not_used`;
CREATE TABLE `oauth_clients_not_used` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `secret` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provider` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `redirect` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `personal_access_client` tinyint(1) NOT NULL,
  `password_client` tinyint(1) NOT NULL,
  `revoked` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_clients_user_id_index` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of oauth_clients_not_used
-- ----------------------------
INSERT INTO `oauth_clients_not_used` VALUES ('1', null, 'Laravel Personal Access Client', 'limsUtcYz3lAkqEkI34yveI6lxEeRPSc2LcsXhRz', null, 'http://localhost', '1', '0', '0', '2021-09-02 16:44:17', '2021-09-02 16:44:17');
INSERT INTO `oauth_clients_not_used` VALUES ('2', null, 'Laravel Password Grant Client', 'ViGwqyG270Gkc5snHfROEUKCrFxd10rpVUuN1Bqh', 'users', 'http://localhost', '0', '1', '0', '2021-09-02 16:44:17', '2021-09-02 16:44:17');

-- ----------------------------
-- Table structure for `oauth_personal_access_clients_not_used`
-- ----------------------------
DROP TABLE IF EXISTS `oauth_personal_access_clients_not_used`;
CREATE TABLE `oauth_personal_access_clients_not_used` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `client_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of oauth_personal_access_clients_not_used
-- ----------------------------
INSERT INTO `oauth_personal_access_clients_not_used` VALUES ('1', '1', '2021-09-02 16:44:17', '2021-09-02 16:44:17');

-- ----------------------------
-- Table structure for `oauth_refresh_tokens_not_used`
-- ----------------------------
DROP TABLE IF EXISTS `oauth_refresh_tokens_not_used`;
CREATE TABLE `oauth_refresh_tokens_not_used` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `access_token_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `revoked` tinyint(1) NOT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_refresh_tokens_access_token_id_index` (`access_token_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of oauth_refresh_tokens_not_used
-- ----------------------------

-- ----------------------------
-- Table structure for `order`
-- ----------------------------
DROP TABLE IF EXISTS `order`;
CREATE TABLE `order` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `request_date` timestamp NULL DEFAULT NULL,
  `delivery_condition` varchar(30) DEFAULT NULL COMMENT 'delivery_condition = {VIP,MA,AA, AT}. VIP immediate pickup, MA = Picked in morning an delivered Afternoon, AT = Picked Afternoon and deliver Tomorrow, AA= Pick Afternoon and deliver in the Afternoon',
  `sender_id` int(10) NOT NULL,
  `sender_type_id` int(10) NOT NULL,
  `request_vehicle_type` varchar(30) NOT NULL,
  `product_type` varchar(30) NOT NULL COMMENT 'product_type ={mixed, @specific_category }',
  `qty` decimal(10,0) DEFAULT 0,
  `pickup_address` varchar(200) DEFAULT NULL COMMENT 'pickup_address = {use old one, new entry, pin}',
  `pickup_location` varchar(150) DEFAULT '' COMMENT 'digital map location',
  `create_user` varchar(50) DEFAULT NULL,
  `create_date` timestamp NULL DEFAULT NULL,
  `update_date` timestamp NULL DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL,
  `status_id` int(10) DEFAULT NULL COMMENT 'status ={Arrived at warehouse,pending,picked,accepted, Done, Partially Done, }',
  `driver_id` int(10) DEFAULT NULL,
  `pickup_time` timestamp NULL DEFAULT NULL,
  `order_canceled` tinyint(6) NOT NULL DEFAULT 0 COMMENT 'if order_canceled =1 => status_id = 7 (Canceled)',
  `code` varchar(30) DEFAULT NULL,
  `tracking_number` varchar(30) DEFAULT NULL,
  `delivery_type` varchar(15) DEFAULT 'Normal' COMMENT 'delivery_type = {Normal,Fast}',
  `pickup_date` timestamp(6) NULL DEFAULT current_timestamp(6),
  `pickup_notes` varchar(100) DEFAULT NULL,
  `pickup_method` varchar(20) DEFAULT 'Driver' COMMENT 'pickup_method = {driver,None}.  pickup_method =  "Driver" means the goods are picked by driver, otherwise, the goods are brought in by Seller or sender etc',
  `request_pickup_time` timestamp NULL DEFAULT NULL,
  `completed` tinyint(4) DEFAULT NULL,
  `loc_lat` decimal(11,8) DEFAULT NULL,
  `loc_lng` decimal(11,8) DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=231 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of order
-- ----------------------------
INSERT INTO `order` VALUES ('50', '1', '2021-12-14 05:38:27', 'Normal', '37', '1', 'Moto', 'ខោហ្គេន', '2', 'កាពីតូលទួលទំពូង', '', 'admin@gmail.com', '2021-12-14 05:38:27', '2021-12-14 05:38:27', null, '5', '0', '2021-12-14 05:38:27', '0', 'BR0000000050', null, 'Normal', '2021-12-14 05:38:27.024469', null, 'None', '2021-12-14 05:38:27', '1', null, null, null);
INSERT INTO `order` VALUES ('51', '1', '2021-12-14 05:38:27', 'Normal', '40', '2', 'Moto', 'គ្រឿងសំអាង', '1', 'អូទ្បាំពិច', '', 'admin@gmail.com', '2021-12-14 05:38:27', '2021-12-14 05:38:27', null, '5', '0', '2021-12-14 05:38:27', '0', 'BR0000000051', null, 'Normal', '2021-12-14 05:38:27.024469', null, 'None', '2021-12-14 05:38:27', '1', null, null, null);
INSERT INTO `order` VALUES ('52', '1', '2021-12-14 05:38:27', 'VIP', '39', '1', 'Moto', 'ខោអាវ', '3', 'ស្ទឹងមានជ័យ', '', 'admin@gmail.com', '2021-12-14 05:38:27', '2021-12-14 05:38:27', null, '5', '28', '2021-12-14 05:38:27', '0', 'BR0000000052', null, 'Normal', '2021-12-14 05:38:27.024469', null, 'Driver', '2021-12-14 05:38:27', '1', null, null, null);
INSERT INTO `order` VALUES ('53', '1', '2021-12-14 05:38:27', 'Normal', '38', '1', 'Moto', 'ត្រង់ឌឺ', '3', 'បេនទ្បានផ្សារថ្មី', '', 'admin@gmail.com', '2021-12-14 05:38:27', '2021-12-14 05:38:27', null, '5', '27', '2021-12-14 05:38:27', '0', 'BR0000000053', null, 'Normal', '2021-12-14 05:38:27.024469', null, 'Driver', '2021-12-14 05:38:27', '1', null, null, null);
INSERT INTO `order` VALUES ('54', '1', '2021-12-14 05:38:27', 'VIP', '41', '2', 'Moto', 'ខោអាវ', '1', 'ដំបូកខ្ពស់', '', 'admin@gmail.com', '2021-12-14 05:38:27', '2021-12-14 05:38:27', null, '5', '27', '2021-12-14 05:38:27', '0', 'BR0000000054', null, 'Normal', '2021-12-14 05:38:27.024469', null, 'Driver', '2021-12-14 05:38:27', '1', null, null, null);
INSERT INTO `order` VALUES ('56', '1', '2021-12-14 05:38:27', 'VIP', '37', '1', 'Moto', 'Shoes', '2', 'វត្តដំបូកខ្ពស់', '', 'admin@gmail.com', '2021-12-14 05:38:27', '2021-12-14 05:38:27', null, '5', '0', '2021-12-14 05:38:27', '0', 'BR0000000056', null, 'Normal', '2021-12-14 05:38:27.024469', null, 'None', '2021-12-14 05:38:27', '1', null, null, null);
INSERT INTO `order` VALUES ('57', '1', '2021-12-14 05:38:27', 'MA', '39', '1', 'TUK TUK', 'costmetic', '2', null, '', 'admin@gmail.com', '2021-12-14 05:38:27', '2021-12-14 05:38:27', null, '5', '27', '2021-12-14 05:38:27', '0', 'BR0000000057', null, 'Normal', '2021-12-14 05:38:27.024469', null, 'Driver', '2021-12-14 05:38:27', '1', null, null, null);
INSERT INTO `order` VALUES ('58', '1', '2021-12-14 05:38:27', 'Normal', '39', '1', 'Moto', 'shoes', '1', 'rtgy4hy6hju6jh6ju', '', 'admin@gmail.com', '2021-12-14 05:38:27', '2021-12-14 05:38:27', null, '5', '27', '2021-12-14 05:38:27', '0', 'BR0000000058', null, 'Normal', '2021-12-14 05:38:27.024469', null, 'Driver', '2021-12-14 05:38:27', '1', null, null, null);
INSERT INTO `order` VALUES ('59', '1', '2021-12-14 05:38:27', 'Normal', '39', '1', 'Moto', 'ខោអាវ', '3', 'ស្ទឹងមានជ័យ', '', 'admin@gmail.com', '2021-12-14 05:38:27', '2021-12-14 05:38:27', null, '5', '0', '2021-12-14 05:38:27', '0', 'BR0000000059', null, 'Normal', '2021-12-14 05:38:27.024469', null, 'None', '2021-12-14 05:38:27', '1', null, null, null);
INSERT INTO `order` VALUES ('60', '1', '2021-12-14 05:38:27', 'VIP', '37', '1', 'Moto', 'ខោហ្គេន', '2', 'បេនទ្បានទួលទំពូង', '', 'admin@gmail.com', '2021-12-14 05:38:27', '2021-12-14 05:38:27', null, '5', '27', '2021-12-14 05:38:27', '0', 'BR0000000060', null, 'Normal', '2021-12-14 05:38:27.024469', null, 'Driver', '2021-12-14 05:38:27', '1', null, null, null);
INSERT INTO `order` VALUES ('61', '1', '2021-12-14 05:38:27', 'Normal', '41', '2', 'Moto', 'ខោអាវ', '1', 'បឹងទំពន់', '', 'admin@gmail.com', '2021-12-14 05:38:27', '2021-12-14 05:38:27', null, '5', '28', '2021-12-14 05:38:27', '0', 'BR0000000061', null, 'Normal', '2021-12-14 05:38:27.024469', null, 'Driver', '2021-12-14 05:38:27', '1', null, null, null);
INSERT INTO `order` VALUES ('62', '1', '2021-12-14 05:38:27', 'Normal', '40', '2', 'Moto', 'គ្រឿងក្រអូប', '1', 'អូទ្បាំពិច', '', 'admin@gmail.com', '2021-12-14 05:38:27', '2021-12-14 05:38:27', null, '5', '28', '2021-12-14 05:38:27', '0', 'BR0000000062', null, 'Normal', '2021-12-14 05:38:27.024469', null, 'Driver', '2021-12-14 05:38:27', '1', null, null, null);
INSERT INTO `order` VALUES ('63', '1', '2021-12-14 05:38:27', 'VIP', '38', '1', 'Moto', 'រត្រង់ឌឺកាត់សក់', '3', 'បេនទ្បានផ្សារថ្មី', '', 'admin@gmail.com', '2021-12-14 05:38:27', '2021-12-14 05:38:27', null, '5', '28', '2021-12-14 05:38:27', '0', 'BR0000000063', null, 'Normal', '2021-12-14 05:38:27.024469', null, 'Driver', '2021-12-14 05:38:27', '1', null, null, null);
INSERT INTO `order` VALUES ('64', '1', '2021-12-14 05:38:27', 'Normal', '37', '1', 'Moto', 'ខោហ្គេន', '4', 'Seim Reap', '', 'admin@gmail.com', '2021-12-14 05:38:27', '2021-12-14 05:38:27', null, '5', '0', '2021-12-14 05:38:27', '0', 'BR0000000064', null, 'Normal', '2021-12-14 05:38:27.024469', null, 'None', '2021-12-14 05:38:27', '1', null, null, null);
INSERT INTO `order` VALUES ('65', '1', '2021-12-14 05:38:27', 'Normal', '41', '2', 'Moto', 'ខោអាវ', '1', 'Phnom Penh', '', 'admin@gmail.com', '2021-12-14 05:38:27', '2021-12-14 05:38:27', null, '5', '28', '2021-12-14 05:38:27', '0', 'BR0000000065', null, 'Normal', '2021-12-14 05:38:27.024469', null, 'Driver', '2021-12-14 05:38:27', '1', null, null, null);
INSERT INTO `order` VALUES ('66', '1', '2021-12-14 05:38:27', 'VIP', '38', '1', 'Moto', 'ត្រង់ឌឺ', '6', 'Kandal Province', '', 'admin@gmail.com', '2021-12-14 05:38:27', '2021-12-14 05:38:27', null, '5', '0', '2021-12-14 05:38:27', '0', 'BR0000000066', null, 'Normal', '2021-12-14 05:38:27.024469', null, 'None', '2021-12-14 05:38:27', '1', null, null, null);
INSERT INTO `order` VALUES ('67', '1', '2021-12-06 08:01:19', 'VIP', '39', '1', 'Moto', 'ខោអាវ', '8', 'Phnom Pengh', '', 'admin@gmail.com', '2021-12-06 08:01:19', '2021-12-06 08:01:19', null, '3', '27', '2021-12-06 08:01:19', '0', 'BR0000000067', null, 'Normal', '2021-12-06 08:01:19.424462', null, 'None', '2021-12-06 08:01:19', '0', null, null, null);
INSERT INTO `order` VALUES ('68', '1', '2021-12-14 05:38:27', 'Normal', '40', '2', 'Moto', 'គ្រឿងសំអាង', '1', 'Olympic Phnom Penh', '', 'admin@gmail.com', '2021-12-14 05:38:27', '2021-12-14 05:38:27', null, '5', '0', '2021-12-14 05:38:27', '0', 'BR0000000068', null, 'Normal', '2021-12-14 05:38:27.024469', null, 'None', '2021-12-14 05:38:27', '1', null, null, null);
INSERT INTO `order` VALUES ('70', '1', '2021-12-28 02:04:42', 'VIP', '37', '1', 'Moto', 'ខោអាវហ្គេន', '4', 'Seim Reap (បេនទ្បានផ្សារថ្មី)', '', 'admin@gmail.com', '2021-12-28 02:04:42', '2021-12-28 02:04:42', null, '5', '28', '2021-12-28 02:04:42', '0', 'BR0000000070', null, 'Normal', '2021-12-28 02:04:42.037327', null, 'Driver', '2021-12-28 02:04:42', '1', null, null, null);
INSERT INTO `order` VALUES ('72', '1', '2021-12-28 01:31:10', 'Normal', '40', '2', 'Moto', 'គ្រឿងសំអាង', '0', 'Olympic Phnom Penh', '', 'admin@gmail.com', '2021-12-28 01:31:10', '2021-12-28 01:31:10', null, '5', '27', '2021-12-28 01:31:10', '0', 'BR0000000072', null, 'Normal', '2021-12-28 01:31:10.416927', null, 'Driver', '2021-12-28 01:31:10', '1', null, null, null);
INSERT INTO `order` VALUES ('73', '1', '2021-12-14 05:38:27', 'Normal', '41', '2', 'Moto', 'គ្រឿងសំអាង', '1', 'Phnom Penh', '', 'admin@gmail.com', '2021-12-14 05:38:27', '2021-12-14 05:38:27', null, '5', '0', '2021-12-14 05:38:27', '0', 'BR0000000073', null, 'Normal', '2021-12-14 05:38:27.024469', null, 'None', '2021-12-14 05:38:27', '1', null, null, null);
INSERT INTO `order` VALUES ('74', '1', '2021-12-14 05:38:27', 'None', '39', '1', 'TUK TUK', 'Clothing', '1', 'Phnom Pengh', '', 'admin@gmail.com', '2021-12-14 05:38:27', '2021-12-14 05:38:27', null, '5', '0', '2021-12-14 05:38:27', '0', 'BR0000000074', null, 'Normal', '2021-12-14 05:38:27.024469', null, 'None', '2021-12-14 05:38:27', '1', null, null, null);
INSERT INTO `order` VALUES ('75', '1', '2021-12-14 05:38:27', 'None', '39', '1', 'Moto', 'Electronics', '1', 'Phnom Pengh', '', 'admin@gmail.com', '2021-12-14 05:38:27', '2021-12-14 05:38:27', null, '5', '0', '2021-12-14 05:38:27', '0', 'BR0000000075', null, 'Normal', '2021-12-14 05:38:27.024469', null, 'None', '2021-12-14 05:38:27', '1', null, null, null);
INSERT INTO `order` VALUES ('76', '1', '2021-12-14 05:38:27', 'None', '37', '1', 'Moto', 'Clothing', '1', 'Seim Reap', '', 'admin@gmail.com', '2021-12-14 05:38:27', '2021-12-14 05:38:27', null, '5', '0', '2021-12-14 05:38:27', '0', 'BR0000000076', null, 'Normal', '2021-12-14 05:38:27.024469', null, 'None', '2021-12-14 05:38:27', '1', null, null, null);
INSERT INTO `order` VALUES ('77', '1', '2021-12-14 05:38:27', 'None', '38', '1', 'Moto', 'Clothing', '1', 'Kandal Province', '', 'admin@gmail.com', '2021-12-14 05:38:27', '2021-12-14 05:38:27', null, '5', '0', '2021-12-14 05:38:27', '0', 'BR0000000077', null, 'Normal', '2021-12-14 05:38:27.024469', null, 'None', '2021-12-14 05:38:27', '1', null, null, null);
INSERT INTO `order` VALUES ('78', '1', '2021-12-14 05:38:27', 'None', '38', '1', 'Moto', 'Clothing', '1', 'Kandal Province', '', 'admin@gmail.com', '2021-12-14 05:38:27', '2021-12-14 05:38:27', null, '5', '0', '2021-12-14 05:38:27', '0', 'BR0000000078', null, 'Normal', '2021-12-14 05:38:27.024469', null, 'None', '2021-12-14 05:38:27', '1', null, null, null);
INSERT INTO `order` VALUES ('82', '1', '2021-12-28 02:12:48', 'None', '46', '2', 'TUK TUK', 'Cosmetics', '3', 'Testing', '', 'admin@gmail.com', '2021-12-28 02:12:48', '2021-12-28 02:12:48', null, '5', null, '2021-12-28 02:12:48', '0', 'BR0000000082', null, 'Normal', '2021-12-28 02:12:48.488416', null, 'None', '2021-12-28 02:12:48', '1', null, null, null);
INSERT INTO `order` VALUES ('119', '1', '2021-12-22 00:03:56', 'None', '65', '2', 'motobike', 'Cosmetic', '0', 'some where at BKK', '', '010428632', '2021-12-22 00:03:56', '2021-12-22 00:03:56', null, '5', '27', '2021-12-22 00:03:56', '0', 'BR0000000119', null, 'Normal', '2021-12-22 00:03:56.941146', null, 'Driver', '2021-12-22 00:03:56', '1', null, null, null);
INSERT INTO `order` VALUES ('122', '1', '2021-12-14 22:24:35', 'None', '39', '1', 'Moto', 'Clothing', '2', 'Phnom Pengh', '', 'admin@gmail.com', '2021-12-14 22:24:35', '2021-12-14 22:24:35', null, '5', '27', '2021-12-14 22:24:35', '0', 'BR0000000122', null, 'Normal', '2021-12-14 22:24:35.342390', null, 'None', '2021-12-14 22:24:35', '1', null, null, null);
INSERT INTO `order` VALUES ('128', '1', '2021-12-28 06:36:48', 'None', '65', '2', 'motobike', 'Cosmetic', '1', 'some where at BKK', '', '010428632', '2021-12-28 06:36:48', '2021-12-28 06:36:48', null, '5', '0', '2021-12-28 06:36:48', '0', 'BR0000000128', null, 'normal', '2021-12-28 06:36:48.892424', null, 'None', '2021-12-28 06:36:48', '1', null, null, null);
INSERT INTO `order` VALUES ('129', '1', '2021-12-28 06:36:48', 'None', '65', '2', 'motobike', 'Cosmetic', '1', 'some where at BKK', '', '010428632', '2021-12-28 06:36:48', '2021-12-28 06:36:48', null, '5', '0', '2021-12-28 06:36:48', '0', 'BR0000000129', null, 'normal', '2021-12-28 06:36:48.892424', null, 'None', '2021-12-28 06:36:48', '1', null, null, null);
INSERT INTO `order` VALUES ('135', '1', '2022-01-09 08:14:28', 'None', '41', '2', 'moto bike', 'Cosmetics', '3', 'Phnom Penh', '', 'admin@gmail.com', '2022-01-09 08:14:28', '2022-01-09 08:14:28', null, '5', null, '2022-01-09 08:14:28', '0', 'BR0000000135', null, 'normal', '2022-01-09 08:14:28.340313', null, 'None', '2022-01-09 08:14:28', '1', null, null, null);
INSERT INTO `order` VALUES ('137', '1', '2021-12-28 04:25:25', 'None', '41', '2', 'moto bike', 'Cosmetics', '2', 'Phnom Penh', '', 'admin@gmail.com', '2021-12-28 04:25:25', '2021-12-28 04:25:25', null, '5', null, '2021-12-28 04:25:25', '0', 'BR0000000137', null, 'normal', '2021-12-28 04:25:25.545084', null, 'Driver', '2021-12-28 04:25:25', '1', null, null, null);
INSERT INTO `order` VALUES ('138', '1', '2021-12-28 06:34:09', 'None', '39', '1', 'moto bike', 'Clothing', '1', 'Phnom Pengh', '', 'admin@gmail.com', '2021-12-28 06:34:09', '2021-12-28 06:34:09', null, '5', null, '2021-12-28 06:34:09', '0', 'BR0000000138', null, 'normal', '2021-12-28 06:34:09.653554', null, 'Driver', '2021-12-28 06:34:09', '1', null, null, null);
INSERT INTO `order` VALUES ('210', '1', '2022-02-25 05:48:48', 'None', '39', '1', 'motobike', 'Cosmetic', '2', 'some where at BKK', '', '0885858586', '2022-02-25 05:48:48', null, null, '3', null, null, '0', 'BR0000000210', null, 'Normal', '2022-02-25 05:48:48.118782', null, 'None', null, '0', '85.56900000', '23.56890000', '2022-03-06');
INSERT INTO `order` VALUES ('212', '1', '2022-02-25 05:48:50', 'None', '39', '1', 'motobike', 'Cosmetic', '2', 'some where at BKK', '', '0885858586', '2022-02-25 05:48:50', null, null, '3', null, null, '0', 'BR0000000212', null, 'Normal', '2022-02-25 05:48:50.370997', null, 'None', null, '0', '85.56900000', '23.56890000', '2022-03-06');
INSERT INTO `order` VALUES ('213', '1', '2022-02-25 05:48:51', 'None', '39', '1', 'motobike', 'Cosmetic', '2', 'some where at BKK', '', '0885858586', '2022-02-25 05:48:51', null, null, '3', null, null, '0', 'BR0000000213', null, 'Normal', '2022-02-25 05:48:51.318620', null, 'None', null, '0', '85.56900000', '23.56890000', '2022-03-06');
INSERT INTO `order` VALUES ('217', '1', '2022-03-01 23:21:12', 'None', '37', '1', 'moto bike', 'Clothing', '4', 'Seim Reap', '', 'Admin@gmail.com', '2022-03-01 23:21:12', null, null, '5', '27', null, '0', 'BR0000000217', null, 'normal', '2022-03-01 23:21:12.263565', null, 'Driver', null, '1', null, null, '2022-03-11');
INSERT INTO `order` VALUES ('218', '1', '2022-03-01 23:21:43', 'None', '38', '1', 'moto bike', 'Electronics', '3', 'Kandal Province', '', 'Admin@gmail.com', '2022-03-01 23:21:43', null, null, '5', '27', null, '0', 'BR0000000218', null, 'normal', '2022-03-01 23:21:43.411186', null, 'Driver', null, '1', null, null, '2022-03-11');
INSERT INTO `order` VALUES ('219', '1', '2022-03-01 23:22:14', 'None', '39', '1', 'moto bike', 'Clothing', '3', 'Phnom Pengh', '', 'Admin@gmail.com', '2022-03-01 23:22:14', null, null, '5', '28', null, '0', 'BR0000000219', null, 'normal', '2022-03-01 23:22:14.584615', null, 'Driver', null, '1', null, null, '2022-03-11');
INSERT INTO `order` VALUES ('220', '1', '2022-03-01 23:22:44', 'None', '40', '2', 'moto bike', 'Cosmetics', '1', 'Olympic Phnom Penh', '', 'Admin@gmail.com', '2022-03-01 23:22:44', null, null, '5', '28', null, '0', 'BR0000000220', null, 'normal', '2022-03-01 23:22:44.216837', null, 'Driver', null, '1', null, null, '2022-03-11');
INSERT INTO `order` VALUES ('221', '1', '2022-03-01 23:23:06', 'None', '41', '2', 'moto bike', 'Clothing', '1', 'Phnom Penh', '', 'Admin@gmail.com', '2022-03-01 23:23:06', null, null, '5', '27', null, '0', 'BR0000000221', null, 'normal', '2022-03-01 23:23:06.236926', null, 'Driver', null, '1', null, null, '2022-03-11');
INSERT INTO `order` VALUES ('227', '1', '2022-03-05 20:24:09', 'None', '65', '2', 'moto bike', 'Electronic', '2', 'this is pikcup address', '', '081802428', '2022-03-05 20:24:09', null, null, '2', '28', null, '0', 'BR0000000227', null, 'normal', '2022-03-05 20:24:09.807545', null, 'Driver', null, null, '90.25620000', '75.12300000', '2022-03-15');
INSERT INTO `order` VALUES ('228', '1', '2022-03-05 20:24:13', 'None', '65', '2', 'moto bike', 'Electronic', '2', 'this is pikcup address', '', '081802428', '2022-03-05 20:24:13', null, null, '1', null, null, '0', 'BR0000000228', null, 'normal', '2022-03-05 20:24:13.225393', null, 'Driver', null, '0', '90.25620000', '75.12300000', '2022-03-15');
INSERT INTO `order` VALUES ('229', '1', '2022-03-07 10:06:19', 'None', '65', '2', 'moto bike', 'Electronic', '2', 'this is pikcup address', '', '081802428', '2022-03-07 10:06:19', null, null, '2', '31', null, '0', 'BR0000000229', null, 'normal', '2022-03-07 10:06:19.042697', null, 'Driver', null, null, '90.25620000', '75.12300000', '2022-03-17');
INSERT INTO `order` VALUES ('230', '1', '2022-03-07 10:08:54', 'None', '65', '2', 'moto bike', 'Electronic', '2', 'this is pikcup address', '', '081802428', '2022-03-07 10:08:54', null, null, '5', '31', '2022-03-07 10:55:58', '0', 'BR0000000230', null, 'normal', '2022-03-07 10:08:54.555702', null, 'Driver', null, '1', '90.25620000', '75.12300000', '2022-03-17');

-- ----------------------------
-- Table structure for `order_receivers`
-- ----------------------------
DROP TABLE IF EXISTS `order_receivers`;
CREATE TABLE `order_receivers` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `order_id` int(10) NOT NULL,
  `receiver_phone` varchar(100) NOT NULL,
  `receiver_name` varchar(100) DEFAULT NULL,
  `zone_code` varchar(10) DEFAULT NULL,
  `receiver_address` varchar(200) DEFAULT NULL,
  `dim_x` decimal(10,2) DEFAULT 0.00,
  `dim_y` decimal(10,2) DEFAULT 0.00,
  `dim_h` decimal(10,2) DEFAULT 0.00,
  `weight_kg` decimal(10,2) DEFAULT 0.00,
  `cod` tinyint(6) DEFAULT 0,
  `price` decimal(10,2) DEFAULT 0.00,
  `df_payer` varchar(20) DEFAULT '',
  `forwarding_cost` decimal(10,2) DEFAULT 0.00,
  `delivery_fee` decimal(10,2) DEFAULT 0.00,
  `create_user` varchar(35) NOT NULL,
  `create_date` timestamp NULL DEFAULT NULL,
  `package_name` varchar(50) DEFAULT NULL,
  `actual_kg` decimal(10,2) DEFAULT 0.00,
  `billed_kg` decimal(10,2) DEFAULT 0.00,
  `cod_fee` decimal(10,2) DEFAULT 0.00,
  `zone_name` varchar(50) DEFAULT NULL,
  `delivery_type` varchar(30) DEFAULT NULL,
  `sender_confirmed` tinyint(4) DEFAULT NULL,
  `sender_net_amount` decimal(10,2) DEFAULT NULL,
  `qr_code` varchar(50) DEFAULT NULL,
  `sender_name` varchar(50) DEFAULT NULL,
  `sender_phone` varchar(100) DEFAULT NULL,
  `status_id` int(11) DEFAULT NULL,
  `base_fee` decimal(10,2) DEFAULT NULL,
  `sender_id` int(11) DEFAULT NULL,
  `sender_pmt_status_int` int(11) DEFAULT NULL,
  `sender_pmt_status_id` int(11) DEFAULT NULL,
  `delivery_notes` varchar(100) DEFAULT NULL,
  `driver_id` int(11) DEFAULT NULL,
  `warehouse_id` int(11) DEFAULT NULL,
  `delivery_id` int(11) DEFAULT NULL,
  `arrival_time` timestamp NULL DEFAULT NULL,
  `pickup_time` timestamp NULL DEFAULT NULL,
  `tracking_number` varchar(35) DEFAULT NULL,
  `outstanding` tinyint(4) DEFAULT 1,
  `exchange_rate` decimal(10,2) DEFAULT NULL,
  `sender_email` varchar(100) DEFAULT NULL,
  `sender_type` varchar(100) DEFAULT NULL,
  `tax_amount` decimal(10,2) DEFAULT NULL,
  `tax_percent` decimal(10,2) DEFAULT NULL,
  `driver_total` decimal(10,2) DEFAULT 0.00,
  `sender_total` decimal(10,2) DEFAULT 0.00,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=177 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of order_receivers
-- ----------------------------
INSERT INTO `order_receivers` VALUES ('26', '1', '74', '012555666', '012555666', 'C30', 'address testing', '25.00', '12.00', '9.00', '0.00', '1', '120.00', 'Receiver', '0.00', '0.00', 'admin@gmail.com', '2021-12-27 03:28:15', null, '0.00', '0.46', '0.00', null, 'Normal', null, null, null, null, null, '1', null, '39', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('27', '1', '75', '012567672', '012567672', 'C23', 'fe', '12.00', '56.00', '19.00', '0.00', '1', '135.00', 'Sender', '0.00', '0.00', 'admin@gmail.com', '2021-12-27 03:28:15', null, '3.00', '3.00', '0.00', null, 'Normal', null, null, null, null, null, '1', null, '39', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('28', '1', '76', '012678789', '012678789', 'C18', 'asdghjgh', '12.00', '67.00', '8.00', '0.00', '1', '120.00', 'Sender', '0.00', '0.00', 'admin@gmail.com', '2021-12-27 03:28:15', null, '0.00', '1.07', '0.00', null, 'Normal', null, null, null, null, null, '1', null, '37', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('29', '1', '77', '023436346', '023436346', 'C23', '01223242', '12.00', '5.00', '67.00', '0.00', '1', '55.00', 'Sender', '0.00', '0.00', 'admin@gmail.com', '2021-12-27 03:28:15', null, '1.00', '1.00', '0.00', null, 'Normal', null, null, null, null, null, '1', null, '38', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('30', '1', '78', '0125676867', '0125676867', 'C23', 'dfgdfhd', '12.00', '7.00', '23.00', '0.00', '1', '128.00', 'Sender', '0.00', '0.00', 'admin@gmail.com', '2021-12-27 03:28:15', null, '1.00', '1.00', '0.00', null, 'Normal', null, null, null, null, null, '1', null, '38', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('31', '1', '79', '012567657`', '012567657`', 'C23', 'sdfdggfd', '0.00', '0.00', '0.00', '0.00', '0', '135.00', 'Sender', '0.00', '0.00', 'admin@gmail.com', '2021-12-27 03:28:15', null, '0.00', '0.00', '0.00', null, 'Normal', null, null, null, null, null, '1', null, null, null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('32', '1', '80', '01256756867', '01256756867', 'C23', 'dsgdfgdf', '0.00', '0.00', '0.00', '0.00', '0', '125.00', 'Sender', '0.00', '-1.00', 'admin@gmail.com', '2021-12-27 03:28:15', null, '0.00', '0.00', '0.00', null, 'Normal', null, null, null, null, null, '1', null, null, null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('33', '1', '81', '012456575', '012456575', 'C23', 'sdfs', '0.00', '0.00', '0.00', '0.00', '0', '120.00', 'Sender', '0.00', '-1.00', 'admin@gmail.com', '2021-12-27 03:28:15', null, '0.00', '0.00', '0.00', null, 'Normal', null, null, null, null, null, '1', null, null, null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('34', '1', '122', 'ddsgfdgfdg', 'ddsgfdgfdg', 'C23', 'dfgdfgf', '0.00', '0.00', '0.00', '0.00', '0', '50.00', 'Sender', '0.00', '0.00', 'admin@gmail.com', '2021-12-27 03:28:15', null, '0.00', '0.00', '0.00', null, 'normal', null, null, null, null, null, '1', null, '39', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('35', '1', '122', 'dsfdfgd', 'dsfdfgd', 'C23', 'sdgdf', '0.00', '0.00', '0.00', '0.00', '0', '55.00', 'Sender', '0.00', '0.00', 'admin@gmail.com', '2021-12-27 03:28:15', null, '0.00', '0.00', '0.00', null, 'normal', null, null, null, null, null, '1', null, '39', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('36', '1', '123', '012555666', '012555666', 'C23', 'testing abc', '12.00', '56.00', '2.00', '0.00', '0', '157.00', 'Sender', '0.00', '0.00', 'admin@gmail.com', '2021-12-27 03:28:15', null, '0.00', '0.22', '0.00', null, 'fast', null, null, null, null, null, '1', null, '39', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('37', '1', '124', '015676876', '015676876', 'C23', 'sfsdgfdgdf', '25.00', '2.00', '6.00', '0.00', '0', '57.00', 'Sender', '0.00', '0.00', 'admin@gmail.com', '2021-12-27 03:28:15', null, '0.00', '0.05', '0.00', null, 'normal', null, null, null, null, null, '1', null, null, null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('38', '1', '126', '01245656756', '01245656756', 'C23', '02323543', '0.00', '0.00', '0.00', '0.00', '1', '125.00', 'Sender', '0.00', '-1.00', 'admin@gmail.com', '2021-12-27 03:28:15', null, '0.00', '0.00', '0.00', null, 'fast', null, null, null, null, null, '1', null, null, null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('39', '1', '132', '0126787', '0126787', 'A1', 'dgdfgf', '0.00', '0.00', '0.00', '0.00', '1', '12.00', 'Sender', '0.00', '0.00', 'admin@gmail.com', '2021-12-27 03:28:15', null, '0.00', '0.00', '0.00', null, 'normal', null, null, null, null, null, '1', null, '65', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('40', '1', '132', '0125678', '0125678', 'A13', 'dsfdgfd', '0.00', '0.00', '0.00', '0.00', '1', '126.00', 'Sender', '0.00', '0.00', 'admin@gmail.com', '2021-12-27 03:28:15', null, '0.00', '0.00', '0.00', null, 'normal', null, null, null, null, null, '1', null, '65', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('77', '1', '123', '012555666', null, 'C23', 'testing abc', null, null, null, '0.00', '0', '157.00', 'Sender', '0.00', '0.00', 'admin@gmail.com', '2021-12-27 03:28:15', null, '0.00', '0.22', '0.00', 'កន្ទោក', 'fast', null, null, null, null, null, '1', '0.00', '39', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('78', '1', '123', '012555666', null, 'C23', 'testing abc', null, null, null, '0.00', '0', '157.00', 'Sender', '0.00', '0.00', 'admin@gmail.com', '2021-12-27 03:28:15', null, '0.00', '0.22', '0.00', 'កន្ទោក', 'fast', null, null, null, null, null, '1', '0.00', '39', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('84', '1', '69', '678768777', null, 'A24', null, null, null, null, '0.00', '1', '8.00', 'Sender', '0.00', null, 'admin@gmail.com', '2022-01-21 05:16:08', null, null, null, '0.00', 'អូឬស្សីទី២', 'normal', null, null, null, null, null, '1', null, '39', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('85', '1', '69', '678768', null, 'A24', null, '25.00', '12.00', '50.00', '0.00', '1', null, 'Sender', '0.00', null, 'admin@gmail.com', '2022-01-21 05:16:08', null, null, null, '0.00', 'អូឬស្សីទី២', 'Normal', null, null, null, null, null, '1', '0.00', '39', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('118', '1', '82', '01256789', null, 'A25', 'sdfgdfgfdg', null, null, null, '0.00', '1', '120.00', 'Sender', '0.00', '0.00', 'admin@gmail.com', '2021-12-28 02:10:33', null, '0.00', '0.00', '0.00', 'អូឬស្សីទី៣', 'Normal', null, null, null, null, null, '1', '0.00', '46', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('119', '1', '82', '0125679', null, 'A10', null, '0.00', '0.00', '0.00', '0.00', '1', '130.00', 'Sender', '0.00', '0.00', 'admin@gmail.com', '2021-12-28 02:10:33', null, '0.00', '0.00', '0.00', 'ទួលទំពូងទី១', 'Fast', null, null, null, null, null, '1', '0.00', '46', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('124', '1', '82', '01256767', null, 'A23', null, '0.00', '0.00', '0.00', '0.00', '1', '130.00', 'Sender', '0.00', '0.00', 'admin@gmail.com', '2021-12-28 02:10:33', null, '0.00', '0.00', '0.00', 'អូឬស្សីទី១', 'Normal', null, null, null, null, null, '1', '0.00', '46', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('125', '1', '71', '012456657', null, 'A23', null, '0.00', '0.00', '0.00', '0.00', '1', '120.00', 'Sender', '0.00', '0.00', 'admin@gmail.com', '2022-01-21 05:15:58', null, '0.00', '0.00', '0.00', 'អូឬស្សីទី១', 'Normal', null, null, null, null, null, '1', '0.00', '38', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('126', '1', '70', '0233534654', null, 'A25', null, '0.00', '0.00', '0.00', '0.00', '1', '120.00', 'Sender', '0.00', '0.00', 'admin@gmail.com', '2021-12-28 02:02:57', null, '0.00', '0.00', '0.00', 'អូឬស្សីទី៣', 'Normal', null, null, null, null, null, '1', '0.00', '37', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('127', '1', '70', '01265768', null, 'A23', null, '0.00', '0.00', '0.00', '0.00', '1', '110.00', 'Sender', '0.00', '0.00', 'admin@gmail.com', '2021-12-28 02:03:11', null, '0.00', '0.00', '0.00', 'អូឬស្សីទី១', 'Fast', null, null, null, null, null, '1', '0.00', '37', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('128', '1', '137', '012567677', '012567677', 'A13', null, '0.00', '0.00', '0.00', '0.00', '1', '50.00', 'Sender', '0.00', '0.00', 'admin@gmail.com', '2021-12-28 04:25:16', null, '0.00', '0.00', '0.00', 'ជយ័ជំនះ', 'Normal', null, null, null, null, null, '1', '0.00', '41', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('129', '1', '137', '0125678', '0125678', 'A37', null, '0.00', '0.00', '0.00', '0.00', '1', '15.00', 'Sender', '0.00', '0.00', 'admin@gmail.com', '2021-12-28 04:25:14', null, '0.00', '0.00', '0.00', 'ចតុមុខ', 'Normal', null, null, null, null, null, '1', '0.00', '41', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('130', '1', '135', '01256768', null, 'A37', 'sdfdgfdg', '23.00', '67.00', '89.00', '0.00', '1', '160.00', 'Sender', '0.00', '0.00', 'admin@gmail.com', '2021-12-28 12:22:41', null, '2.00', '0.00', '0.00', 'ចតុមុខ', 'Normal', null, null, null, null, null, '1', '0.00', '41', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('131', '1', '135', '012567878', null, 'A25', 'sdgfdg dfhgfhfg', '53.00', '12.00', '89.00', '0.00', '1', '120.00', 'Sender', '0.00', '0.83', 'admin@gmail.com', '2022-01-08 04:20:28', null, '0.00', '9.41', '0.00', 'អូឬស្សីទី៣', 'Normal', null, null, null, null, null, '1', '0.00', '41', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('132', '1', '135', '01267111', null, 'A25', 'dgfdfhgfhgf', '11.00', '10.00', '9.00', '0.00', '1', '125.00', 'Sender', '0.00', '0.00', 'admin@gmail.com', '2021-12-28 12:22:41', null, '2.00', '2.00', '0.00', 'អូឬស្សីទី៣', 'Normal', null, null, null, null, null, '1', '0.00', '41', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('133', '1', '138', '0125678', null, 'A25', 'weretre ertretr', '12.00', '67.00', '89.00', '0.00', '1', '129.00', 'Sender', '0.00', '1.16', 'admin@gmail.com', '2021-12-28 06:34:04', null, '0.00', '11.90', '0.00', 'អូឬស្សីទី៣', 'Normal', null, null, null, null, null, '1', '1.00', '39', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('134', '1', '221', '098980899', null, 'C9', 'Test', '0.00', '0.00', '0.00', '0.00', '1', '23.00', 'Receiver', '0.00', '0.00', 'Admin@gmail.com', '2022-03-01 23:35:12', null, '0.00', '0.00', '0.00', 'ឬស្សីកែង', 'Normal', null, null, null, null, null, '4', '2.00', '41', null, null, null, '27', '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('135', '1', '220', '0989098', null, 'C9', 'ទួលសង្កែ', null, null, null, '0.00', '1', '10.00', 'Receiver', '0.00', '0.00', 'Admin@gmail.com', '2022-03-01 23:37:02', null, '0.00', '0.00', '0.00', 'ឬស្សីកែង', 'Normal', null, null, null, null, null, '1', '2.00', '40', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('136', '1', '219', '012345678', null, 'A25', 'Test', null, null, null, '0.00', '1', '20.00', 'Receiver', '0.00', '0.13', 'Admin@gmail.com', '2022-03-01 23:38:47', null, '0.00', '6.00', '0.00', 'អូឬស្សីទី៣', 'Normal', null, null, null, null, null, '4', '1.00', '39', null, null, null, '28', '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('137', '1', '219', '09890988', null, 'C24', 'Test', null, null, null, '0.00', '1', '20.00', 'Receiver', '0.00', '0.00', 'Admin@gmail.com', '2022-03-01 23:39:10', null, '0.00', '0.00', '0.00', 'ឪឡោក', 'Fast', null, null, null, null, null, '4', '2.50', '39', null, null, null, '28', '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('138', '1', '219', '09890988899', null, 'C28', 'Test', null, null, null, '0.00', '1', '20.00', 'Receiver', '0.00', '0.26', 'Admin@gmail.com', '2022-03-01 23:39:37', null, '0.00', '7.00', '0.00', 'សំរោង', 'Fast', null, null, null, null, null, '4', '2.50', '39', null, null, null, '28', '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('139', '1', '217', '12344343', null, 'C37', 'Test', null, null, null, '0.00', '1', '2.00', 'Receiver', '0.00', '0.00', 'Admin@gmail.com', '2022-03-01 23:41:32', null, '0.00', '8.00', '0.00', 'វាលស្បូវ', 'Fast', null, null, null, null, null, '4', '2.50', '37', null, null, null, '27', '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('140', '1', '217', '232425345645', null, 'A14', 'Test', null, null, null, '0.00', '1', '20.00', 'Receiver', '0.00', '0.52', 'Admin@gmail.com', '2022-03-01 23:42:05', null, '0.00', '9.00', '0.00', 'ផ្សាចាស់', 'Normal', null, null, null, null, null, '4', '1.00', '37', null, null, null, '27', '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('141', '1', '218', '6547675867', null, 'A28', 'Test', null, null, null, '0.00', '1', '20.00', 'Receiver', '0.00', '0.26', 'Admin@gmail.com', '2022-03-01 23:44:30', null, '0.00', '7.00', '0.00', 'មិត្តភាព', 'Fast', null, null, null, null, null, '1', '1.50', '38', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('142', '1', '218', '646765869', null, 'C24', 'Test', null, null, null, '0.00', '1', '20.00', 'Receiver', '0.00', '0.00', 'Admin@gmail.com', '2022-03-01 23:44:31', null, '0.00', '0.00', '0.00', 'ឪឡោក', 'Normal', null, null, null, null, null, '1', '2.00', '38', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('143', '1', '218', '4654765876989', null, 'C32', 'Test', null, null, null, '0.00', '1', '20.00', 'Receiver', '0.00', '0.00', 'Admin@gmail.com', '2022-03-01 23:44:32', null, '0.00', '0.00', '0.00', 'ព្រែកលាប', 'Fast', null, null, null, null, null, '1', '2.50', '38', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('144', '1', '222', '01256567', 'Mr. customer AAA', 'A8', null, '0.00', '0.00', '0.00', '0.00', '1', '25.00', 'sender', '0.00', '0.00', '010428632', '2022-03-05 11:38:57', null, '0.00', '3.00', '0.00', 'ទំនប់ទឹក', 'normal', null, null, null, null, null, '1', '0.00', '65', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('145', '1', '222', '01251245', 'Mr. customer BBB', 'A9', null, '0.00', '0.00', '0.00', '0.00', '1', '50.00', 'sender', '0.00', '0.00', '010428632', '2022-03-05 11:38:57', null, '0.00', '0.50', '0.00', 'ទួលទំពូងទី២', 'normal', null, null, null, null, null, '1', '0.00', '65', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('146', '1', '223', '01256567', 'Mr. customer AAA', 'A8', null, '0.00', '0.00', '0.00', '0.00', '1', '25.00', 'sender', '0.00', '0.00', '010428632', '2022-03-05 11:42:46', null, '0.00', '3.00', '0.00', 'ទំនប់ទឹក', 'normal', null, null, null, null, null, '1', '0.00', '65', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('147', '1', '223', '01251245', 'Mr. customer BBB', 'A9', null, '0.00', '0.00', '0.00', '0.00', '1', '50.00', 'sender', '0.00', '0.00', '010428632', '2022-03-05 11:42:46', null, '0.00', '0.50', '0.00', 'ទួលទំពូងទី២', 'normal', null, null, null, null, null, '1', '0.00', '65', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('148', '1', '224', '01256567', 'Mr. customer AAA', 'A8', null, '0.00', '0.00', '0.00', '0.00', '1', '25.00', 'sender', '0.00', '0.00', '010428632', '2022-03-05 11:42:52', null, '0.00', '3.00', '0.00', 'ទំនប់ទឹក', 'normal', null, null, null, null, null, '1', '0.00', '65', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('149', '1', '224', '01251245', 'Mr. customer BBB', 'A9', null, '0.00', '0.00', '0.00', '0.00', '1', '50.00', 'sender', '0.00', '0.00', '010428632', '2022-03-05 11:42:52', null, '0.00', '0.50', '0.00', 'ទួលទំពូងទី២', 'normal', null, null, null, null, null, '1', '0.00', '65', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('150', '1', '225', '01256567', 'Mr. customer AAA', 'A8', null, '0.00', '0.00', '0.00', '0.00', '1', '25.00', 'sender', '0.00', '0.00', '010428632', '2022-03-05 11:43:00', null, '0.00', '3.00', '0.00', 'ទំនប់ទឹក', 'normal', null, null, null, null, null, '1', '0.00', '65', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('151', '1', '225', '01251245', 'Mr. customer BBB', 'A9', null, '0.00', '0.00', '0.00', '0.00', '1', '50.00', 'sender', '0.00', '0.00', '010428632', '2022-03-05 11:43:00', null, '0.00', '0.50', '0.00', 'ទួលទំពូងទី២', 'normal', null, null, null, null, null, '1', '0.00', '65', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('152', '1', '226', '01256567', 'Mr. customer AAA', 'A8', null, '0.00', '0.00', '0.00', '0.00', '1', '25.00', 'sender', '0.00', '0.00', '010428632', '2022-03-05 11:49:56', null, '0.00', '3.00', '0.00', 'ទំនប់ទឹក', 'normal', null, null, null, null, null, '1', '0.00', '65', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('153', '1', '226', '01251245', 'Mr. customer BBB', 'A9', null, '0.00', '0.00', '0.00', '0.00', '1', '50.00', 'sender', '0.00', '0.00', '010428632', '2022-03-05 11:49:56', null, '0.00', '0.50', '0.00', 'ទួលទំពូងទី២', 'normal', null, null, null, null, null, '1', '0.00', '65', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('154', '1', '227', '01256567', 'Mr. customer AAA', 'A8', null, '0.00', '0.00', '0.00', '0.00', '1', '25.00', 'sender', '0.00', '0.00', '081802428', '2022-03-05 20:24:09', null, '0.00', '3.00', '0.00', 'ទំនប់ទឹក', 'normal', null, null, null, null, null, '1', '0.00', '65', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('155', '1', '227', '01251245', 'Mr. customer BBB', 'A9', null, '0.00', '0.00', '0.00', '0.00', '1', '50.00', 'sender', '0.00', '0.00', '081802428', '2022-03-05 20:24:09', null, '0.00', '0.50', '0.00', 'ទួលទំពូងទី២', 'normal', null, null, null, null, null, '1', '0.00', '65', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('156', '1', '228', '01256567', 'Mr. customer AAA', 'A8', null, '0.00', '0.00', '0.00', '0.00', '1', '25.00', 'sender', '0.00', '0.00', '081802428', '2022-03-05 20:24:13', null, '0.00', '3.00', '0.00', 'ទំនប់ទឹក', 'normal', null, null, null, null, null, '1', '0.00', '65', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('157', '1', '228', '01251245', 'Mr. customer BBB', 'A9', null, '0.00', '0.00', '0.00', '0.00', '1', '50.00', 'sender', '0.00', '0.00', '081802428', '2022-03-05 20:24:13', null, '0.00', '0.50', '0.00', 'ទួលទំពូងទី២', 'normal', null, null, null, null, null, '1', '0.00', '65', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('158', '1', '229', '01256567', 'Mr. customer AAA', 'A8', null, '0.00', '0.00', '0.00', '0.00', '1', '25.00', 'sender', '0.00', '0.00', '081802428', '2022-03-07 10:06:19', null, '0.00', '3.00', '0.00', 'ទំនប់ទឹក', 'normal', null, null, null, null, null, '1', '0.00', '65', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('159', '1', '229', '01251245', 'Mr. customer BBB', 'A9', null, '0.00', '0.00', '0.00', '0.00', '1', '50.00', 'sender', '0.00', '0.00', '081802428', '2022-03-07 10:06:19', null, '0.00', '0.50', '0.00', 'ទួលទំពូងទី២', 'normal', null, null, null, null, null, '1', '0.00', '65', null, null, null, null, '1', null, null, null, null, '1', null, null, null, null, null, '0.00', '0.00');
INSERT INTO `order_receivers` VALUES ('174', '1', '230', '012897865', 'some one name', 'A7', 'some address here', null, null, null, '0.00', '1', '25.00', 'Sender', '0.00', '-1.00', '081802428', '2022-03-07 12:07:52', null, '2.30', '2.30', '-0.23', null, 'Fast', null, null, '16562259328A1E4D', null, '010428632', '4', '-1.00', '65', null, null, null, '31', '1', null, '2022-03-07 12:07:52', '2022-03-07 12:07:52', 'BR0000000230', '1', '4100.00', null, 'Normal', '0.00', '0.00', '25.00', '-2.23');
INSERT INTO `order_receivers` VALUES ('175', '1', '230', '012897865', 'some one name', 'A7', 'some address here', null, null, null, '0.00', '1', '25.00', 'Sender', '0.00', '-1.00', '081802428', '2022-03-07 12:07:53', null, '2.30', '2.30', '-0.23', null, 'Fast', null, null, '165622593299ED06', null, '010428632', '4', '-1.00', '65', null, null, null, '31', '1', null, '2022-03-07 12:07:53', '2022-03-07 12:07:53', 'BR0000000230', '1', '4100.00', null, 'Normal', '0.00', '0.00', '25.00', '-2.23');

-- ----------------------------
-- Table structure for `package`
-- ----------------------------
DROP TABLE IF EXISTS `package`;
CREATE TABLE `package` (
  `id` int(15) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `qr_code` varchar(100) DEFAULT '',
  `package_name` varchar(150) DEFAULT NULL,
  `product_type` varchar(50) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `dimension` varchar(50) DEFAULT '',
  `dim_x` decimal(10,2) DEFAULT 0.00 COMMENT 'in centimere "cm"',
  `dim_y` decimal(10,2) DEFAULT 0.00 COMMENT 'in centimere "cm"',
  `dim_h` decimal(10,2) DEFAULT 0.00 COMMENT 'in centimere "cm"',
  `cubic_meter_size` decimal(10,2) DEFAULT 0.00,
  `status_id` tinyint(6) NOT NULL DEFAULT 5 COMMENT 'status = {IP,delivered,failed,TBD}',
  `returned` tinyint(6) NOT NULL DEFAULT 0 COMMENT 'returned = Returned to Seller',
  `failure_notes` varchar(200) DEFAULT '',
  `create_user` varchar(35) NOT NULL,
  `create_uid` int(11) DEFAULT NULL,
  `update_user` varchar(255) DEFAULT '',
  `update_uid` int(11) DEFAULT NULL,
  `order_id` int(11) DEFAULT NULL,
  `delivery_id` int(10) DEFAULT NULL,
  `cod` tinyint(4) NOT NULL DEFAULT 0,
  `cod_fee` decimal(10,2) NOT NULL DEFAULT 0.00,
  `df_payer` varchar(20) DEFAULT 'Receiver' COMMENT 'df_payer = {Receiver,Sender}',
  `delivery_fee` decimal(10,2) NOT NULL DEFAULT 0.00,
  `forwarding_cost` decimal(10,2) NOT NULL DEFAULT 0.00,
  `create_date` timestamp NULL DEFAULT NULL,
  `update_date` timestamp NULL DEFAULT NULL,
  `receiver_address` varchar(200) DEFAULT NULL,
  `zone_code` varchar(10) DEFAULT NULL,
  `zone_name` varchar(150) DEFAULT '',
  `receiver_phone` varchar(50) DEFAULT NULL,
  `receiver_name` varchar(50) DEFAULT NULL,
  `receiver_id` int(10) DEFAULT NULL COMMENT 'receiver_id is used only when Customers are registered in Custoemr Mobile App',
  `delivery_condition` varchar(15) DEFAULT NULL,
  `delivery_type` varchar(15) DEFAULT NULL,
  `sender_id` int(10) DEFAULT NULL,
  `sender_name` varchar(150) DEFAULT NULL,
  `sender_type` varchar(50) DEFAULT NULL,
  `sender_phone` varchar(50) DEFAULT NULL,
  `sender_email` varchar(50) DEFAULT NULL,
  `actual_kg` decimal(10,2) DEFAULT 0.00,
  `billed_kg` decimal(10,2) DEFAULT 0.00,
  `tracking_number` varchar(35) DEFAULT NULL COMMENT 'this tracking_number is used for Seller or sender to track all their packages',
  `delivery_time` timestamp NULL DEFAULT NULL,
  `arrival_time` timestamp NULL DEFAULT NULL,
  `outstanding` tinyint(6) DEFAULT 1,
  `applied_fixed_price` tinyint(6) DEFAULT 0,
  `pickup_time` timestamp NULL DEFAULT NULL,
  `delivery_notes` varchar(100) DEFAULT NULL,
  `agent_notes` varchar(150) DEFAULT NULL,
  `pickup_driver_id` int(11) DEFAULT NULL,
  `additional_fee` decimal(10,2) DEFAULT NULL,
  `base_fee` decimal(10,2) DEFAULT NULL,
  `tax_percent` decimal(10,2) DEFAULT NULL,
  `tax_amount` decimal(10,2) DEFAULT NULL,
  `adjust_amount` decimal(10,2) DEFAULT NULL,
  `warehouse_id` int(10) DEFAULT NULL,
  `driver_total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `sender_total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `exchange_rate` decimal(10,2) DEFAULT NULL,
  `driver_id` int(11) DEFAULT NULL,
  `driver_pmt_notes` varchar(150) DEFAULT NULL,
  `sender_pmt_notes` varchar(150) DEFAULT NULL,
  `driver_adjust_amount` decimal(10,2) DEFAULT NULL,
  `sender_adjust_amount` decimal(10,2) DEFAULT NULL,
  `driver_pmt_status_id` tinyint(4) DEFAULT NULL,
  `sender_net_amount` decimal(10,2) DEFAULT NULL,
  `sender_pmt_status_id` tinyint(4) DEFAULT NULL,
  `sender_confirmed` tinyint(4) DEFAULT NULL,
  `sender_settlement_id` varchar(35) DEFAULT NULL,
  `driver_settlement_id` varchar(35) DEFAULT NULL,
  `sender_trx_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_speedy` (`id`,`branch_id`,`qr_code`,`delivery_id`,`sender_id`,`order_id`,`driver_id`)
) ENGINE=InnoDB AUTO_INCREMENT=196 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of package
-- ----------------------------
INSERT INTO `package` VALUES ('75', '1', '1161A8872896BC9', '077225568', null, '0.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '50', '50', '1', '0.00', 'Receiver', '0.00', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'ស្ពានអាកាស៧មករា（យកខោ១ពីភ្ញៀវវិញផង', 'C13', 'ទឹកថ្លា', '077225568', '077225568', null, '0', 'Normal', '37', 'Rattana Hak', 'VIP', '016 285 878', null, '0.00', '0.00', 'BR0000000050', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '0', '0', '2022-02-20 04:35:10', null, null, '0', null, '2.00', '0.00', '0.00', null, '1', '12.00', '0.00', '4100.00', '27', null, null, '0.00', '0.00', '1', null, '0', null, null, '1161E393A93F414', '24');
INSERT INTO `package` VALUES ('76', '1', '1161A887289798C', '069239561', null, '32.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '50', '50', '1', '0.00', 'Receiver', '0.00', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'បុរីហេងមានជ័យ ច្បារអំពៅ', 'B12', 'ច្បាអំពៅទី១', '069239561', '069239561', null, '0', 'Normal', '37', 'Rattana Hak', 'VIP', '016 285 878', null, '0.00', '0.00', 'BR0000000050', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '0', '0', '2022-02-20 04:35:10', null, null, '0', null, '1.50', '0.00', '0.00', null, '1', '33.50', '0.00', '4100.00', '27', null, null, '0.00', '0.00', '1', null, '0', null, null, '1161E393A93F414', null);
INSERT INTO `package` VALUES ('77', '1', '1161A88860DD1A8', '095646930', null, '10.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '51', '49', '1', '0.00', 'Receiver', '0.00', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'វត្តទួល', 'C9', 'ឬស្សីកែង', '095646930', '095646930', null, '0', 'Normal', '40', 'អូន ធីដា', 'Normal', '087 823 080', null, '0.00', '0.00', 'BR0000000051', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '0', '0', '2022-02-20 04:35:10', null, null, '0', null, '2.00', '0.00', '0.00', null, '1', '12.00', '0.00', '4100.00', '28', null, null, '0.00', '0.00', '0', null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('78', '1', '1161A88AC4EC4D9', '011657985', null, '23.00', '', '0.00', '0.00', '0.00', '0.00', '11', '0', 'Rejected from Customer', 'admin@gmail.com', null, 'admin@gmail.com', null, '54', '49', '1', '0.00', 'Receiver', '0.65', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'BKK1', 'A2', 'បឹងកេងកងទី ១', '011657985', '011657985', null, '0', 'Normal', '41', 'Madam Q Homestore', 'Normal', '093488777', null, '0.00', '8.00', 'BR0000000054', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '0', '0', '2022-02-20 04:35:10', null, null, null, null, '1.00', '0.00', '0.00', null, '1', '24.65', '0.00', '4100.00', '28', null, null, null, null, '0', null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('79', '1', '1161A88B4947670', '086722237', null, '43.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '53', '49', '1', '0.00', 'Receiver', '0.00', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'ផ្សារចោមចៅ', 'C18', 'ចោមចៅ', '086722237', '086722237', null, '0', 'Normal', '38', 'Meng Korng', 'VIP', '015 877 768', null, '0.00', '0.00', 'BR0000000053', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '0', '0', '2022-02-20 04:35:10', null, null, null, null, '2.00', '0.00', '0.00', null, '1', '45.00', '0.00', '4100.00', '28', null, null, '0.00', '0.00', '0', null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('80', '1', '1161A88B949BF61', '012889964', null, '32.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '53', '52', '1', '0.00', 'Receiver', '0.26', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'ស្ពានអាកាសស្តុបដីហុយ', 'C13', 'ទឹកថ្លា', '012889964', '012889964', null, '0', 'Normal', '38', 'Meng Korng', 'VIP', '015 877 768', null, '0.00', '5.00', 'BR0000000053', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '0', '0', '2022-02-20 04:35:10', null, null, null, null, '2.50', '0.00', '0.00', null, '1', '34.76', '0.00', '4100.00', '27', null, null, '0.00', '0.00', '1', null, '0', null, null, '1161E393A93F414', null);
INSERT INTO `package` VALUES ('81', '1', '1161A88BF2E0079', '086666626', null, '23.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '53', '45', '1', '0.00', 'Receiver', '0.39', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'ព្រៃស', 'C3', 'ព្រៃស', '086666626', '086666626', null, '0', 'Normal', '38', 'Meng Korng', 'VIP', '015 877 768', null, '0.00', '6.00', 'BR0000000053', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '0', '0', '2022-02-20 04:35:10', null, null, null, null, '2.00', '0.00', '0.00', null, '1', '25.39', '0.00', '4100.00', '27', null, null, '0.00', '0.00', '1', null, '0', null, null, '1161E393A93F414', null);
INSERT INTO `package` VALUES ('82', '1', '1161A88C6CECD54', '070876906', null, '0.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '52', '51', '1', '0.00', 'Receiver', '0.00', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'ក្រោយវត្តព្រះពុទ្ទ', 'A16', 'វត្តភ្នំ', '070876906', '070876906', null, '0', 'Normal', '39', 'Seng Kimly', 'VIP', '088 585 8586', null, '0.00', '0.00', 'BR0000000052', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '0', '0', '2022-02-20 04:35:10', null, null, null, null, '1.00', '0.00', '0.00', null, '1', '35.00', '0.00', '4100.00', '28', null, null, '0.00', '0.00', '1', null, '1', null, '11621F942377124', '1161BF293FCC690', null);
INSERT INTO `package` VALUES ('83', '1', '1161A88C999D99C', '015662926', null, '0.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '52', '49', '1', '0.00', 'Receiver', '0.00', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'អូឡាំពិក', 'A5', 'អូឡាំពិក', '015662926', '015662926', null, '0', 'Normal', '39', 'Seng Kimly', 'VIP', '088 585 8586', null, '0.00', '0.00', 'BR0000000052', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '0', '0', '2022-02-20 04:35:10', null, null, null, null, '1.50', '0.00', '0.00', null, '1', '44.50', '0.00', '4100.00', '28', null, null, '0.00', '0.00', '1', null, '1', null, null, '1161BF293FCC690', '26');
INSERT INTO `package` VALUES ('84', '1', '1161A88CE92751A', '010515220', null, '0.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '52', '51', '1', '0.00', 'Receiver', '0.00', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'ចំការដូង', 'A38', 'ស្ទឹងមានជយ័', '010515220', '010515220', null, '0', 'Normal', '39', 'Seng Kimly', 'VIP', '088 585 8586', null, '0.00', '0.00', 'BR0000000052', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '0', '0', '2022-02-20 04:35:10', null, null, null, null, '1.50', '0.00', '0.00', null, '1', '11.50', '0.00', '4100.00', '28', null, null, '0.00', '0.00', '1', null, '1', null, null, '1161BF293FCC690', '26');
INSERT INTO `package` VALUES ('85', '1', '1161A8A2AFBD901', '67876867', null, '0.00', '', '23.00', '50.00', '32.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '56', '51', '0', '0.00', 'Receiver', '0.41', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'បុរីហេងមានជ័យ ច្បារអំពៅ', 'B12', 'ច្បាអំពៅទី១', '67876867', '67876867', null, '0', 'Normal', '37', 'Rattana Hak', 'VIP', '016 285 878', null, '0.00', '6.12', 'BR0000000056', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '0', '0', '2022-02-20 04:35:10', null, null, '0', null, '1.50', '0.00', '0.00', null, '1', '1.91', '0.00', '4100.00', '28', null, null, '0.00', null, '0', null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('86', '1', '1161A8A2AFBEBFD', '6756756', null, '10.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', 'hjymmkumikjyuyj', 'admin@gmail.com', null, 'samsethy', null, '56', null, '0', '0.00', 'Receiver', '0.00', '0.00', '2022-02-20 04:35:10', '2022-03-02 11:06:41', 'ស្ពានអាកាស៧មករា（យកខោ១ពីភ្ញៀវវិញផង', 'C13', 'ទឹកថ្លា', '6756756', '6756756', null, '0', 'Normal', '37', 'Rattana Hak', 'VIP', '016 285 878', null, '0.00', '0.00', 'BR0000000056', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '1', '0', '2022-02-20 04:35:10', null, null, '0', null, '2.00', '0.00', '0.00', null, '1', '2.00', '0.00', '4100.00', null, null, null, null, null, '0', null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('87', '1', '1161AA1E81B2B98', '015662926', null, '0.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '57', '51', '0', '0.00', 'Receiver', '0.00', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'អូឡាំពិក', 'A5', 'អូឡាំពិក', '015662926', '015662926', null, '0', 'Normal', '39', 'Seng Kimly', 'VIP', '088 585 8586', null, '0.00', '0.00', 'BR0000000057', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '0', '0', '2022-02-20 04:35:10', null, null, null, null, '1.50', '0.00', '0.00', null, '1', '1.50', '0.00', '4100.00', '28', null, null, '0.00', '0.00', '0', null, '1', null, null, null, '26');
INSERT INTO `package` VALUES ('88', '1', '1161AA1EAF48E5E', '010515220', null, '0.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '57', '51', '1', '0.00', 'Receiver', '0.00', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'ស្ទឹងមានជ័យ', 'A38', 'ស្ទឹងមានជយ័', '010515220', '010515220', null, '0', 'Normal', '39', 'Seng Kimly', 'VIP', '088 585 8586', null, '0.00', '0.00', 'BR0000000057', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '0', '0', '2022-02-20 04:35:10', null, null, null, null, '1.50', '0.00', '0.00', null, '1', '11.50', '0.00', '4100.00', '28', null, null, '0.00', '0.00', '0', null, '1', null, null, null, '27');
INSERT INTO `package` VALUES ('89', '1', '1161AA4D2306D87', '788990764', null, '90.00', '', '0.00', '0.00', '0.00', '0.00', '10', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '58', '52', '1', '0.00', 'Receiver', '0.65', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'ui7j7ij', 'C36', 'ព្រែកប្រា', '788990764', '788990764', null, '0', 'Normal', '39', 'Seng Kimly', 'VIP', '088 585 8586', null, '0.00', '8.00', 'BR0000000058', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '1', '0', '2022-02-20 04:35:10', null, null, null, null, '2.00', '0.00', '0.00', null, '1', '92.65', '0.00', '4100.00', '27', null, null, null, null, '0', null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('90', '1', '1161AB1E7E73BCB', '010515220', null, '0.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '59', '54', '1', '0.00', 'Receiver', '0.00', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'ស្ទឹងមានជ័យ', 'A38', 'ស្ទឹងមានជយ័', '010515220', '010515220', null, '0', 'Normal', '39', 'Seng Kimly', 'VIP', '088 585 8586', null, '0.00', '0.00', 'BR0000000059', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '0', '0', '2022-02-20 04:35:10', null, null, '0', null, '1.50', '0.00', '0.00', null, '1', '11.50', '0.00', '4100.00', '27', null, null, '0.00', '0.00', '1', null, '1', null, '11621F942377124', '1161E393A93F414', null);
INSERT INTO `package` VALUES ('91', '1', '1161AB1E7E74CB9', '015662926', null, '0.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '59', '54', '1', '0.00', 'Receiver', '0.00', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'អូឡាំពិក', 'A5', 'អូឡាំពិក', '015662926', '015662926', null, '0', 'Normal', '39', 'Seng Kimly', 'VIP', '088 585 8586', null, '0.00', '0.00', 'BR0000000059', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '0', '0', '2022-02-20 04:35:10', null, null, '0', null, '1.50', '0.00', '0.00', null, '1', '44.50', '0.00', '4100.00', '27', null, null, '0.00', '0.00', '1', null, '1', null, null, '1161E393A93F414', '26');
INSERT INTO `package` VALUES ('92', '1', '1161AB1E7E756FB', '070876906', null, '0.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '59', '54', '1', '0.00', 'Receiver', '0.00', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'ក្រោយវត្តព្រះពុទ្ទ', 'A16', 'វត្តភ្នំ', '070876906', '070876906', null, '0', 'Normal', '39', 'Seng Kimly', 'VIP', '088 585 8586', null, '0.00', '0.00', 'BR0000000059', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '0', '0', '2022-02-20 04:35:10', null, null, '0', null, '1.00', '0.00', '0.00', null, '1', '35.00', '0.00', '4100.00', '27', null, null, '0.00', '0.00', '0', null, '1', null, null, null, '26');
INSERT INTO `package` VALUES ('93', '1', '1161AB20E80E122', '077225568', null, '10.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '60', '54', '1', '0.00', 'Receiver', '0.00', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'ស្ពានអាកាស៧មករា（យកខោ១ពីភ្ញៀវវិញផង', 'C13', 'ទឹកថ្លា', '077225568', '077225568', null, '0', 'Normal', '37', 'Rattana Hak', 'VIP', '016 285 878', null, '0.00', '0.00', 'BR0000000060', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '0', '0', '2022-02-20 04:35:10', null, null, null, null, '2.00', '0.00', '0.00', null, '1', '12.00', '0.00', '4100.00', '27', null, null, '0.00', '0.00', '0', null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('94', '1', '1161AB2120B668D', '069239561', null, '32.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '60', '54', '1', '0.00', 'Receiver', '0.13', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'បុរីហេងមានជ័យ ច្បារអំពៅ', 'B12', 'ច្បាអំពៅទី១', '069239561', '069239561', null, '0', 'Normal', '37', 'Rattana Hak', 'VIP', '016 285 878', null, '0.00', '4.00', 'BR0000000060', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '0', '0', '2022-02-20 04:35:10', null, null, null, null, '1.50', '0.00', '0.00', null, '1', '33.63', '0.00', '4100.00', '27', null, null, '0.00', '0.00', '0', null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('95', '1', '1161AB21D435FCF', '011657985', null, '0.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '61', '53', '1', '0.00', 'Receiver', '0.65', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'បឹងគេងកង១', 'A2', 'បឹងកេងកងទី ១', '011657985', '011657985', null, '0', 'Normal', '41', 'Madam Q Homestore', 'Normal', '093488777', null, '0.00', '8.00', 'BR0000000061', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '0', '0', '2022-02-20 04:35:10', null, null, null, null, '1.00', '0.00', '0.00', null, '1', '24.65', '0.00', '4100.00', '28', null, 'dfgf', '0.00', '0.00', '0', null, '1', null, null, null, '25');
INSERT INTO `package` VALUES ('96', '1', '1161AB2223B441B', '095646930', null, '10.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '62', '53', '1', '0.00', 'Receiver', '0.00', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'វត្តទួល', 'C9', 'ឬស្សីកែង', '095646930', '095646930', null, '0', 'Normal', '40', 'អូន ធីដា', 'Normal', '087 823 080', null, '0.00', '0.00', 'BR0000000062', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '0', '0', '2022-02-20 04:35:10', null, null, null, null, '2.00', '0.00', '0.00', null, '1', '12.00', '0.00', '4100.00', '28', null, null, '0.00', '0.00', '0', null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('97', '1', '1161AB22732FBB8', '086722237', null, '43.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '63', '53', '1', '0.00', 'Receiver', '0.00', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'ផ្សារចោមចៅ', 'C18', 'ចោមចៅ', '086722237', '086722237', null, '0', 'Normal', '38', 'Meng Korng', 'VIP', '015 877 768', null, '0.00', '0.00', 'BR0000000063', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '0', '0', '2022-02-20 04:35:10', null, null, null, null, '2.00', '0.00', '0.00', null, '1', '45.00', '0.00', '4100.00', '28', null, null, '0.00', '0.00', '0', null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('98', '1', '1161AB234893773', '012889964', null, '32.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '63', '53', '1', '0.00', 'Receiver', '0.26', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'ស្ពានអាកាសស្តុបដីហុយ', 'C13', 'ទឹកថ្លា', '012889964', '012889964', null, '0', 'Normal', '38', 'Meng Korng', 'VIP', '015 877 768', null, '0.00', '5.00', 'BR0000000063', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '0', '0', '2022-02-20 04:35:10', null, null, null, null, '2.50', '0.00', '0.00', null, '1', '34.76', '0.00', '4100.00', '28', null, null, '0.00', '0.00', '0', null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('99', '1', '1161AB2389058B3', '086666626', null, '23.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '63', '53', '1', '0.00', 'Receiver', '0.39', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'ព្រៃស', 'C3', 'ព្រៃស', '086666626', '086666626', null, '0', 'Normal', '38', 'Meng Korng', 'VIP', '015 877 768', null, '0.00', '6.00', 'BR0000000063', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '0', '0', '2022-02-20 04:35:10', null, null, null, null, '2.00', '0.00', '0.00', null, '1', '25.39', '0.00', '4100.00', '28', null, null, '0.00', '0.00', '0', null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('101', '1', '1161ACA6785EBA6', '011657985', null, '10.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, '081802428', null, '68', '78', '1', '0.00', 'Receiver', '0.65', '0.00', '2022-02-20 04:35:10', '2022-02-26 02:37:13', 'បឹងគេងកង១', 'A2', 'បឹងកេងកងទី ១', '011657985', '011657985', null, '0', 'normal', '40', 'អូន ធីដា', 'Normal', '087 823 080', null, '0.00', '8.00', 'BR0000000068', '2022-02-20 04:35:10', '2022-02-26 02:37:13', '0', '0', '2022-02-20 04:35:10', null, null, '0', null, '1.00', '0.00', '0.00', null, '1', '11.65', '0.00', '4100.00', '30', null, null, null, null, '0', null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('102', '1', '1161ACA9FE844B3', '077225568', null, '10.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, '', null, '64', null, '1', '0.00', 'Receiver', '0.13', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'ស្ពានអាកាស៧មករា（យកខោ១ពីភ្ញៀវវិញផង', 'C13', 'ទឹកថ្លា', '077225568', '077225568', null, '0', 'normal', '37', 'Rattana Hak', 'VIP', '016 285 878', null, '0.00', '4.00', 'BR0000000064', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '1', '0', '2022-02-20 04:35:10', null, null, '0', null, '2.00', '0.00', '0.00', null, '1', '12.13', '0.00', '4100.00', null, null, null, null, null, '0', null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('103', '1', '1161ACA9FE8541E', '069239561', null, '32.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, '', null, '64', null, '1', '0.00', 'Receiver', '0.00', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'បុរីហេងមានជ័យ ច្បារអំពៅ', 'B12', 'ច្បាអំពៅទី១', '069239561', '069239561', null, '0', 'fast', '37', 'Rattana Hak', 'VIP', '016 285 878', null, '0.00', '0.00', 'BR0000000064', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '1', '0', '2022-02-20 04:35:10', null, null, '0', null, '2.00', '0.00', '0.00', null, '1', '34.00', '0.00', '4100.00', null, null, null, null, null, '0', null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('104', '1', '1161ACA9FE86063', '069777875', null, '20.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, 'admin@gmail.com', null, '64', null, '0', '0.00', 'Sender', '0.13', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'ទួលទំពូង', 'A10', 'ទួលទំពូងទី១', '069777875', '069777875', null, '0', 'normal', '37', 'Rattana Hak', 'VIP', '016 285 878', null, '0.00', '4.00', 'BR0000000064', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '1', '0', '2022-02-20 04:35:10', null, null, '0', null, '1.00', '0.00', '0.00', null, '1', '0.00', '1.13', '4100.00', null, null, null, null, null, '0', null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('105', '1', '1161ACA9FE868DE', '086511117', null, '25.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, '', null, '64', null, '1', '0.00', 'Receiver', '0.00', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'វត្តតាំងក្រសាំង', 'C15', 'ក្រាំងថ្នង់', '086511117', '086511117', null, '0', 'normal', '37', 'Rattana Hak', 'VIP', '016 285 878', null, '0.00', '0.00', 'BR0000000064', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '1', '0', '2022-02-20 04:35:10', null, null, '0', null, '2.00', '0.00', '0.00', null, '1', '27.00', '0.00', '4100.00', null, null, null, null, null, '0', null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('106', '1', '1161ACACB89003A', '011657985', null, '23.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, '', null, '65', null, '1', '0.00', 'Receiver', '0.65', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'បឹងគេងកង១', 'A2', 'បឹងកេងកងទី ១', '011657985', '011657985', null, '0', 'normal', '41', 'Madam Q Homestore', 'Normal', '093488777', null, '0.00', '8.00', 'BR0000000065', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '1', '0', '2022-02-20 04:35:10', null, null, null, null, '1.00', '0.00', '0.00', null, '1', '24.65', '0.00', '4100.00', null, null, null, null, null, '0', null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('107', '1', '1161ACAF43AE4A9', '069294099', null, '21.50', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, 'admin@gmail.com', null, '66', null, '1', '0.00', 'Receiver', '0.00', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'ផ្សារព្រៃទា', 'C2', 'ព្រៃវែង', '069294099', '069294099', null, '0', 'normal', '38', 'Meng Korng', 'VIP', '015 877 768', null, '0.00', '0.00', 'BR0000000066', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '1', '0', '2022-02-20 04:35:10', null, null, '0', null, '2.00', '0.00', '0.00', null, '1', '23.50', '0.00', '4100.00', null, null, null, null, null, '0', null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('108', '1', '1161ACAF43AFDDA', '081668888', null, '22.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, 'admin@gmail.com', null, '66', null, '1', '0.00', 'Receiver', '0.39', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'បុរីវិមានភ្នំពេញ ផ្លូវជាសុផារ៉ា', 'C12', 'ភ្នំពេញថ្មី', '081668888', '081668888', null, '0', 'normal', '38', 'Meng Korng', 'VIP', '015 877 768', null, '0.00', '6.00', 'BR0000000066', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '1', '0', '2022-02-20 04:35:10', null, null, '0', null, '2.00', '0.00', '0.00', null, '1', '24.39', '0.00', '4100.00', null, null, null, null, null, '0', null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('109', '1', '1161ACAF43B1291', '010673658', null, '21.50', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, 'admin@gmail.com', null, '66', null, '1', '0.00', 'Receiver', '0.00', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'អូឬស្សី', 'A23', 'អូឬស្សីទី១', '010673658', '010673658', null, '0', 'normal', '38', 'Meng Korng', 'VIP', '015 877 768', null, '0.00', '0.00', 'BR0000000066', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '1', '0', '2022-02-20 04:35:10', null, null, '0', null, '1.00', '0.00', '0.00', null, '1', '22.50', '0.00', '4100.00', null, null, null, null, null, '0', null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('110', '1', '1161ACAF43B2418', '086666626', null, '23.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, 'admin@gmail.com', null, '66', null, '1', '0.00', 'Receiver', '0.39', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'ព្រៃស', 'C3', 'ព្រៃស', '086666626', '086666626', null, '0', 'normal', '38', 'Meng Korng', 'VIP', '015 877 768', null, '0.00', '6.00', 'BR0000000066', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '1', '0', '2022-02-20 04:35:10', null, null, '0', null, '2.00', '0.00', '0.00', null, '1', '25.39', '0.00', '4100.00', null, null, null, null, null, '0', null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('111', '1', '1161ACAF43B39E2', '012889964', null, '32.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, 'admin@gmail.com', null, '66', null, '1', '0.00', 'Receiver', '0.26', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'ស្ពានអាកាសស្តុបដីហុយ', 'C13', 'ទឹកថ្លា', '012889964', '012889964', null, '0', 'fast', '38', 'Meng Korng', 'VIP', '015 877 768', null, '0.00', '5.00', 'BR0000000066', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '1', '0', '2022-02-20 04:35:10', null, null, '0', null, '2.50', '0.00', '0.00', null, '1', '34.76', '0.00', '4100.00', null, null, null, null, null, '0', null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('112', '1', '1161ACAF43B4F52', '086722237', null, '43.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, 'admin@gmail.com', null, '66', null, '1', '0.00', 'Receiver', '0.00', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'ផ្សារចោមចៅ', 'C18', 'ចោមចៅ', '086722237', '086722237', null, '0', 'normal', '38', 'Meng Korng', 'VIP', '015 877 768', null, '0.00', '0.00', 'BR0000000066', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '1', '0', '2022-02-20 04:35:10', null, null, '0', null, '2.00', '0.00', '0.00', null, '1', '45.00', '0.00', '4100.00', null, null, null, null, null, '0', null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('121', '1', '1161AD787AA2344', '011657985', null, '23.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', 'បញ្ចប់ដោយបុក្គលិកការិយាលយ័', 'admin@gmail.com', null, 'admin@gmail.com', null, '73', null, '1', '0.00', 'Receiver', '0.00', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'បឹងគេងកង១', 'A2', 'បឹងកេងកងទី ១', '011657985', '011657985', null, '0', 'normal', '41', 'Madam Q Homestore', 'Normal', '093488777', null, '0.00', '0.00', 'BR0000000073', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '1', '0', '2022-02-20 04:35:10', null, null, '0', null, '1.00', '0.00', '0.00', null, '1', '1.00', '0.00', '4100.00', null, null, null, null, null, '0', null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('122', '1', '1161ADAD5C615BA', '012555666', null, '120.00', '', '25.00', '12.00', '9.00', '0.00', '5', '0', 'fgefgfh', 'admin@gmail.com', null, 'admin@gmail.com', null, '74', null, '1', '0.00', 'Receiver', '0.00', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'address testing', 'C23', 'កន្ទោក', '012555666', '012555666', null, '0', 'Normal', '39', 'Seng Kimly', 'VIP', '088 585 8586', null, '0.00', '0.46', 'BR0000000074', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '1', '0', '2022-02-20 04:35:10', null, null, '0', null, '0.00', '0.00', '0.00', null, '1', '2.00', '0.00', '4100.00', null, null, null, null, null, '0', null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('123', '1', '1161AE026F93640', '012567673', null, '0.00', '', '12.00', '56.00', '19.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '75', '78', '1', '0.00', 'Sender', '0.00', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'fe', 'C23', 'កន្ទោក', '012567673', '012567673', null, '0', 'normal', '39', 'Seng Kimly', 'VIP', '088 585 8586', null, '3.00', '3.00', 'BR0000000075', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '0', '0', '2022-02-20 04:35:10', null, null, '0', null, '2.00', '0.00', '0.00', null, '1', '135.00', '2.00', '4100.00', '30', null, null, null, null, '0', null, '1', null, null, null, '26');
INSERT INTO `package` VALUES ('124', '1', '1161AE1B827E40E', '012678789', null, '120.00', '', '12.00', '67.00', '8.00', '0.00', '11', '0', 'sdfd', 'admin@gmail.com', null, 'admin@gmail.com', null, '76', '74', '1', '0.00', 'Sender', '0.00', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'asdghjgh', 'C23', 'កន្ទោក', '012678789', '012678789', null, '0', 'Normal', '37', 'Rattana Hak', 'VIP', '016 285 878', null, '1.00', '1.07', 'BR0000000076', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '0', '0', '2022-02-20 04:35:10', null, null, '0', null, '2.00', '0.00', '0.00', null, '1', '0.00', '2.00', '4100.00', '28', null, null, null, null, '0', null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('125', '1', '1161AE1F35B08F1', '023436346', null, '54.00', '', '12.00', '5.00', '67.00', '0.00', '8', '0', 'sfdsgffd', 'admin@gmail.com', null, '081802428', null, '77', '60', '1', '0.00', 'Sender', '0.00', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '01223242', 'C23', 'កន្ទោក', '023436346', '023436346', null, '0', 'Normal', '38', 'Meng Korng', 'VIP', '015 877 768', null, '1.00', '1.00', 'BR0000000077', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '0', '0', '2022-02-20 04:35:10', null, null, '0', null, '2.00', '0.00', '0.00', null, '1', '0.00', '2.00', '4100.00', '28', null, null, null, null, '0', null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('126', '1', '1161AE205DD4097', '0125676867', null, '128.00', '', '12.00', '7.00', '23.00', '0.00', '8', '0', '', 'admin@gmail.com', null, '081802428', null, '78', null, '1', '0.00', 'Sender', '0.00', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'dfgdfhd', 'C23', 'កន្ទោក', '0125676867', '0125676867', null, '0', 'normal', '38', 'Meng Korng', 'VIP', '015 877 768', null, '1.00', '1.00', 'BR0000000078', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '0', '0', '2022-02-20 04:35:10', null, null, '0', null, '2.00', '0.00', '0.00', null, '1', '128.00', '2.00', '4100.00', null, null, null, null, null, '0', null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('128', '1', '1161B80E3008D2D', '0126546', null, '0.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '122', '78', '1', '0.00', 'Sender', '0.00', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'dfgdfgf', 'C23', 'កន្ទោក', '0126546', '0126546', null, '0', 'Normal', '39', 'Seng Kimly', 'VIP', '0885858586', null, '0.00', '0.00', 'BR0000000122', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '0', '0', '2022-02-20 04:35:10', 'dfgdfgfd', null, '0', null, '2.00', '0.00', '0.00', null, '1', '50.00', '2.00', '4100.00', '30', null, null, null, null, '0', null, '1', null, null, null, '26');
INSERT INTO `package` VALUES ('129', '1', '1161B80E300AA5C', '023423', null, '55.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, '', null, '122', null, '1', '0.00', 'Sender', '0.00', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'sdgdf', 'C23', 'កន្ទោក', '023423', '023423', null, '0', 'normal', '39', 'Seng Kimly', 'VIP', '0885858586', null, '0.00', '0.00', 'BR0000000122', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '1', '0', '2022-02-20 04:35:10', null, null, '0', null, '2.00', '0.00', '0.00', null, '1', '55.00', '2.00', '4100.00', null, null, null, null, null, '0', null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('131', '1', '1161C15571799F1', '01245657', null, '28.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, 'admin@gmail.com', null, '129', null, '1', '0.00', 'Sender', '-1.00', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'asfdgfgfd', 'KB001', 'Kabol', '01245657', '01245657', null, '0', 'normal', '65', 'ME', 'Normal', '010428632', null, '0.00', '0.00', 'BR0000000129', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '1', '0', '2022-02-20 04:35:10', null, null, '0', null, '-1.00', '0.00', '0.00', null, '1', '28.00', '-2.00', '4100.00', null, null, null, null, null, null, null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('132', '1', '1161C16EA98D9A5', '023234', null, '125.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, '', null, '128', null, '1', '0.00', 'Sender', '0.00', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'sdfdgdf', 'A13', 'ជយ័ជំនះ', '023234', '023234', null, '0', 'normal', '65', 'ME', 'Normal', '010428632', null, '0.00', '0.00', 'BR0000000128', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '1', '0', '2022-02-20 04:35:10', null, null, '0', null, '1.00', '0.00', '0.00', null, '1', '125.00', '1.00', '4100.00', null, null, null, null, null, null, null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('139', '1', '1161C9653177D7D', '01265768', null, '110.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, '', null, '70', null, '1', '0.00', 'Sender', '0.00', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'អូឬស្សីទី១', 'A23', 'អូឬស្សីទី១', '01265768', '01265768', null, '0', 'Fast', '37', 'Rattana Hak', 'VIP', '016285878', null, '0.00', '0.00', 'BR0000000070', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '1', '0', '2022-02-20 04:35:10', null, null, null, null, '1.50', '0.00', '0.00', null, '1', '110.00', '1.50', '4100.00', null, null, null, null, null, null, null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('140', '1', '1161C965784DDC1', '02346435', null, '120.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, '', null, '70', null, '1', '0.00', 'Sender', '0.00', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'អូឬស្សីទី១', 'A23', 'អូឬស្សីទី១', '02346435', '02346435', null, '0', 'Normal', '37', 'Rattana Hak', 'VIP', '016285878', null, '0.00', '0.00', 'BR0000000070', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '1', '0', '2022-02-20 04:35:10', null, null, null, null, '1.00', '0.00', '0.00', null, '1', '120.00', '1.00', '4100.00', null, null, null, null, null, null, null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('141', '1', '1161C9658A05FBA', '02346435', null, '120.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, '', null, '70', null, '1', '0.00', 'Sender', '0.00', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'អូឬស្សីទី១', 'A23', 'អូឬស្សីទី១', '02346435', '02346435', null, '0', 'Normal', '37', 'Rattana Hak', 'VIP', '016285878', null, '0.00', '0.00', 'BR0000000070', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '1', '0', '2022-02-20 04:35:10', null, null, null, null, '1.00', '0.00', '0.00', null, '1', '120.00', '1.00', '4100.00', null, null, null, null, null, null, null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('142', '1', '1161C9658A07E33', '01265768', null, '110.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, '', null, '70', null, '1', '0.00', 'Sender', '0.00', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'អូឬស្សីទី១', 'A23', 'អូឬស្សីទី១', '01265768', '01265768', null, '0', 'Fast', '37', 'Rattana Hak', 'VIP', '016285878', null, '0.00', '0.00', 'BR0000000070', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '1', '0', '2022-02-20 04:35:10', null, null, null, null, '1.50', '0.00', '0.00', null, '1', '110.00', '1.50', '4100.00', null, null, null, null, null, null, null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('149', '1', '1161C96770721CF', '01256767', null, '130.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, '', null, '82', null, '1', '0.00', 'Sender', '0.00', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'អូឬស្សីទី១', 'A23', 'អូឬស្សីទី១', '01256767', '01256767', null, '0', 'Normal', '46', 'Jackie', 'Normal', '+855967174940', 'jackie@bro.com', '0.00', '0.00', 'BR0000000082', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '1', '0', '2022-02-20 04:35:10', null, null, null, null, '1.00', '0.00', '0.00', null, '1', '130.00', '1.00', '4100.00', null, null, null, null, null, null, null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('150', '1', '1161C96770742A5', '0125679', null, '130.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, '', null, '82', null, '1', '0.00', 'Sender', '-1.00', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'ទួលទំពូងទី១', 'A10', 'ទួលទំពូងទី១', '0125679', '0125679', null, '0', 'Fast', '46', 'Jackie', 'Normal', '+855967174940', 'jackie@bro.com', '0.00', '0.00', 'BR0000000082', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '1', '0', '2022-02-20 04:35:10', null, null, null, null, '-1.00', '0.00', '0.00', null, '1', '130.00', '-2.00', '4100.00', null, null, null, null, null, null, null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('151', '1', '1161C9677075F11', '01256789', null, '120.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, '', null, '82', null, '1', '0.00', 'Sender', '0.00', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'sdfgdfgfdg', 'A25', 'អូឬស្សីទី៣', '01256789', '01256789', null, '0', 'Normal', '46', 'Jackie', 'Normal', '+855967174940', 'jackie@bro.com', '0.00', '0.00', 'BR0000000082', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '1', '0', '2022-02-20 04:35:10', null, null, null, null, '1.00', '0.00', '0.00', null, '1', '120.00', '1.00', '4100.00', null, null, null, null, null, null, null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('152', '1', '1161C986857EE1A', '0125678', null, '15.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, '', null, '137', null, '1', '0.00', 'Sender', '0.00', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'ចតុមុខ', 'A37', 'ចតុមុខ', '0125678', '0125678', null, '0', 'Normal', '41', 'Madam Q Homestore', 'Normal', '093488777', null, '0.00', '0.00', 'BR0000000137', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '1', '0', '2022-02-20 04:35:10', null, null, null, null, '1.00', '0.00', '0.00', null, '1', '15.00', '1.00', '4100.00', null, null, null, null, null, null, null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('153', '1', '1161C9868583162', '012567677', null, '50.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, '', null, '137', null, '1', '0.00', 'Sender', '0.00', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'ជយ័ជំនះ', 'A13', 'ជយ័ជំនះ', '012567677', '012567677', null, '0', 'Normal', '41', 'Madam Q Homestore', 'Normal', '093488777', null, '0.00', '0.00', 'BR0000000137', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '1', '0', '2022-02-20 04:35:10', null, null, null, null, '1.00', '0.00', '0.00', null, '1', '50.00', '1.00', '4100.00', null, null, null, null, null, null, null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('154', '1', '1161C9A4B19D98F', '0125678', null, '129.00', '', '12.00', '67.00', '89.00', '0.00', '5', '0', '', 'admin@gmail.com', null, '', null, '138', null, '1', '0.00', 'Sender', '1.16', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'weretre ertretr', 'A25', 'អូឬស្សីទី៣', '0125678', '0125678', null, '0', 'Normal', '39', 'Seng Kimly', 'VIP', '0885858586', null, '0.00', '11.90', 'BR0000000138', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '1', '0', '2022-02-20 04:35:10', null, null, null, null, '1.00', '0.00', '0.00', null, '1', '129.00', '2.16', '4100.00', null, null, null, null, null, null, null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('158', '1', '1161D98E344E057', '01267111', null, '125.00', '', '11.00', '10.00', '9.00', '0.00', '5', '0', '', 'admin@gmail.com', null, 'admin@gmail.com', null, '135', null, '1', '0.00', 'Sender', '0.00', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'dgfdfhgfhgf', 'A25', 'អូឬស្សីទី៣', '01267111', '01267111', null, '0', 'normal', '41', 'Madam Q Homestore', 'Normal', '093488777', null, '2.00', '2.00', 'BR0000000135', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '1', '0', '2022-02-20 04:35:10', null, null, null, null, '1.00', '0.00', '0.00', null, '1', '125.00', '1.00', '4100.00', null, null, null, null, null, null, null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('159', '1', '1161D98E34500CD', '012567878', null, '120.00', '', '53.00', '12.00', '89.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '135', '76', '1', '0.00', 'Sender', '-1.00', '0.00', '2022-02-20 04:35:10', '2022-03-02 00:52:26', 'sdgfdg dfhgfhfg', 'A25', 'អូឬស្សីទី៣', '012567878', '012567878', null, '0', 'normal', '41', 'Madam Q Homestore', 'Normal', '093488777', null, '0.00', '9.41', 'BR0000000135', '2022-02-20 04:35:10', '2022-03-02 00:52:26', '0', '0', '2022-02-20 04:35:10', null, null, null, null, '-1.00', '0.00', '0.00', null, '1', '120.00', '-2.00', '4100.00', '27', null, null, null, null, '0', null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('160', '1', '1161D98E3451BC1', '01256768', null, '160.00', '', '23.00', '67.00', '89.00', '0.00', '5', '0', '', 'admin@gmail.com', null, '', null, '135', null, '1', '0.00', 'Sender', '0.00', '0.00', '2022-02-20 04:35:10', '2022-02-20 04:35:10', 'sdfdgfdg', 'A37', 'ចតុមុខ', '01256768', '01256768', null, '0', 'Normal', '41', 'Madam Q Homestore', 'Normal', '093488777', null, '2.00', '0.00', 'BR0000000135', '2022-02-20 04:35:10', '2022-02-20 04:35:10', '1', '0', '2022-02-20 04:35:10', null, null, null, null, '1.00', '0.00', '0.00', null, '1', '160.00', '1.00', '4100.00', null, null, null, null, null, null, null, '0', null, null, null, null);
INSERT INTO `package` VALUES ('161', '1', '11621E4B5C00F3B', '098980899', null, '0.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'Admin@gmail.com', null, 'admin@gmail.com', null, '221', '79', '1', '0.00', 'Receiver', '0.00', '0.00', '2022-03-01 23:35:40', '2022-03-02 00:52:46', 'Test', 'C9', 'ឬស្សីកែង', '098980899', '098980899', null, '0', 'Normal', '41', 'Madam Q Homestore', 'Normal', '093488777', null, '0.00', '0.00', 'BR0000000221', null, '2022-03-02 00:52:46', '0', '0', '2022-03-01 23:35:39', null, null, null, null, '2.00', '0.00', '0.00', null, '1', '25.00', '0.00', '4100.00', '28', null, 'dfgfhfghf', null, null, '1', null, '1', null, null, '11621E5E18377D1', '25');
INSERT INTO `package` VALUES ('162', '1', '11621E4BB0E10DF', '0989098', null, '10.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'Admin@gmail.com', null, 'admin@gmail.com', null, '220', '76', '1', '0.00', 'Receiver', '0.00', '0.00', '2022-03-01 23:37:04', '2022-03-02 00:52:14', 'ទួលសង្កែ', 'C9', 'ឬស្សីកែង', '0989098', '0989098', null, '0', 'Normal', '40', 'អូន ធីដា', 'Normal', '087823080', null, '0.00', '0.00', 'BR0000000220', null, '2022-03-02 00:52:14', '0', '0', '2022-03-01 23:37:04', null, null, null, null, '2.00', '0.00', '0.00', null, '1', '12.00', '0.00', '4100.00', '27', null, null, null, null, '0', null, null, null, null, null, null);
INSERT INTO `package` VALUES ('163', '1', '11621E4C8F2B391', '09890988899', null, '0.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'Admin@gmail.com', null, 'admin@gmail.com', null, '219', '76', '1', '0.00', 'Receiver', '0.26', '0.00', '2022-03-01 23:40:47', '2022-03-02 00:52:02', 'Test', 'C28', 'សំរោង', '09890988899', '09890988899', null, '0', 'Fast', '39', 'Seng Kimly', 'VIP', '0885858586', null, '0.00', '7.00', 'BR0000000219', null, '2022-03-02 00:52:02', '0', '0', '2022-03-01 23:40:47', null, null, null, null, '2.50', '0.00', '0.00', null, '1', '22.76', '0.00', '4100.00', '27', null, null, null, null, '0', null, '1', null, null, null, '26');
INSERT INTO `package` VALUES ('164', '1', '11621E4C8F2EF8E', '09890988', null, '0.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'Admin@gmail.com', null, 'admin@gmail.com', null, '219', '76', '1', '0.00', 'Receiver', '0.00', '0.00', '2022-03-01 23:40:47', '2022-03-02 00:52:08', 'Test', 'C24', 'ឪឡោក', '09890988', '09890988', null, '0', 'Fast', '39', 'Seng Kimly', 'VIP', '0885858586', null, '0.00', '0.00', 'BR0000000219', null, '2022-03-02 00:52:08', '0', '0', '2022-03-01 23:40:47', null, null, null, null, '2.50', '0.00', '0.00', null, '1', '22.50', '0.00', '4100.00', '27', null, null, null, null, '0', null, '1', null, null, null, '26');
INSERT INTO `package` VALUES ('165', '1', '11621E4C8F30F89', '012345678', null, '0.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'Admin@gmail.com', null, 'admin@gmail.com', null, '219', '79', '1', '0.00', 'Receiver', '0.13', '0.00', '2022-03-01 23:40:47', '2022-03-02 00:52:40', 'Test', 'A25', 'អូឬស្សីទី៣', '012345678', '012345678', null, '0', 'Normal', '39', 'Seng Kimly', 'VIP', '0885858586', null, '0.00', '6.00', 'BR0000000219', null, '2022-03-02 00:52:40', '0', '0', '2022-03-01 23:40:47', null, null, null, null, '1.00', '0.00', '0.00', null, '1', '21.13', '0.00', '4100.00', '28', null, null, null, null, '1', null, '1', null, null, '11621E5E18377D1', '26');
INSERT INTO `package` VALUES ('166', '1', '11621E4CE018EE1', '232425345645', null, '20.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'Admin@gmail.com', null, 'admin@gmail.com', null, '217', '79', '1', '0.00', 'Receiver', '0.52', '0.00', '2022-03-01 23:42:08', '2022-03-02 00:52:35', 'Test', 'A14', 'ផ្សាចាស់', '232425345645', '232425345645', null, '0', 'Normal', '37', 'Rattana Hak', 'VIP', '016285878', null, '0.00', '9.00', 'BR0000000217', null, '2022-03-02 00:52:35', '0', '0', '2022-03-01 23:42:08', null, null, null, null, '1.00', '0.00', '0.00', null, '1', '21.52', '0.00', '4100.00', '28', null, null, null, null, '1', null, null, null, null, '11621E5E18377D1', null);
INSERT INTO `package` VALUES ('168', '1', '11621E4D202CDF0', '6547567585', null, '20.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'Admin@gmail.com', null, 'admin@gmail.com', null, '217', '76', '1', '0.00', 'Receiver', '0.13', '0.00', '2022-03-01 23:43:12', '2022-03-02 00:51:27', 'Test', 'A25', 'អូឬស្សីទី៣', '6547567585', '6547567585', null, '0', 'Normal', '37', 'Rattana Hak', 'VIP', '016285878', null, '0.00', '0.00', 'BR0000000217', null, '2022-03-02 00:51:27', '0', '0', '2022-03-01 23:43:12', null, null, null, null, '1.00', '0.00', '0.00', null, '1', '21.13', '0.00', '4100.00', '27', null, null, null, null, '0', null, null, null, null, null, null);
INSERT INTO `package` VALUES ('169', '1', '11621E4D202EB96', '232425345645', null, '20.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'Admin@gmail.com', null, 'admin@gmail.com', null, '217', '76', '1', '0.00', 'Receiver', '0.52', '0.00', '2022-03-01 23:43:12', '2022-03-02 00:51:39', 'Test', 'A14', 'ផ្សាចាស់', '232425345645', '232425345645', null, '0', 'Normal', '37', 'Rattana Hak', 'VIP', '016285878', null, '0.00', '9.00', 'BR0000000217', null, '2022-03-02 00:51:39', '0', '0', '2022-03-01 23:43:12', null, null, null, null, '1.00', '0.00', '0.00', null, '1', '21.52', '0.00', '4100.00', '27', null, null, null, null, '0', null, null, null, null, null, null);
INSERT INTO `package` VALUES ('170', '1', '11621E4D721456F', '6547675867', null, '20.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'Admin@gmail.com', null, 'admin@gmail.com', null, '218', '76', '1', '0.00', 'Receiver', '0.26', '0.00', '2022-03-01 23:44:34', '2022-03-02 00:51:42', 'Test', 'A28', 'មិត្តភាព', '6547675867', '6547675867', null, '0', 'Fast', '38', 'Meng Korng', 'VIP', '015877768', null, '0.00', '7.00', 'BR0000000218', null, '2022-03-02 00:51:42', '0', '0', '2022-03-01 23:44:34', null, null, null, null, '1.50', '0.00', '0.00', null, '1', '21.76', '0.00', '4100.00', '27', null, null, null, null, '0', null, null, null, null, null, null);
INSERT INTO `package` VALUES ('171', '1', '11621E4D721655D', '646765869', null, '20.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'Admin@gmail.com', null, 'admin@gmail.com', null, '218', '76', '1', '0.00', 'Receiver', '0.00', '0.00', '2022-03-01 23:44:34', '2022-03-02 00:51:47', 'Test', 'C24', 'ឪឡោក', '646765869', '646765869', null, '0', 'Normal', '38', 'Meng Korng', 'VIP', '015877768', null, '0.00', '0.00', 'BR0000000218', null, '2022-03-02 00:51:47', '0', '0', '2022-03-01 23:44:34', null, null, null, null, '2.00', '0.00', '0.00', null, '1', '22.00', '0.00', '4100.00', '27', null, null, null, null, '0', null, null, null, null, null, null);
INSERT INTO `package` VALUES ('172', '1', '11621E4D72186CF', '4654765876989', null, '20.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', 'fghgcjfvkv', 'Admin@gmail.com', null, 'samsethy', null, '218', null, '1', '0.00', 'Receiver', '0.00', '0.00', '2022-03-01 23:44:34', '2022-03-02 10:59:32', 'Test', 'C32', 'ព្រែកលាប', '4654765876989', '4654765876989', null, '0', 'Fast', '38', 'Meng Korng', 'VIP', '015877768', null, '0.00', '0.00', 'BR0000000218', null, '2022-03-02 00:51:57', '1', '0', '2022-03-01 23:44:34', null, null, null, null, '2.50', '0.00', '0.00', null, '1', '22.50', '0.00', '4100.00', null, null, null, null, null, null, null, null, null, null, null, null);
INSERT INTO `package` VALUES ('194', '1', '116225961B0D4B6', '012897865', null, '25.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, '', null, '230', null, '1', '0.00', 'Sender', '0.00', '0.00', '2022-03-07 12:20:27', null, 'some address here', 'A7', 'ទួលស្វាយព្រៃទី ២', '012897865', '012897865', null, '0', 'Fast', '65', 'ME', 'Normal', '010428632', null, '2.30', '2.30', 'BR0000000230', null, '2022-03-07 12:20:27', '1', '0', '2022-03-07 00:00:00', null, null, null, null, '1.50', '0.00', '0.00', null, '1', '25.00', '1.50', '4100.00', null, null, null, null, null, null, null, null, null, null, null, null);
INSERT INTO `package` VALUES ('195', '1', '116225961B0F39F', '012897865', null, '25.00', '', '0.00', '0.00', '0.00', '0.00', '6', '0', '', 'admin@gmail.com', null, '', null, '230', '89', '1', '0.00', 'Sender', '0.00', '0.00', '2022-03-07 12:20:27', null, 'some address here', 'A7', 'ទួលស្វាយព្រៃទី ២', '012897865', '012897865', null, '0', 'Fast', '65', 'ME', 'Normal', '010428632', null, '2.30', '2.30', 'BR0000000230', null, '2022-03-07 12:20:27', '1', '0', '2022-03-07 00:00:00', null, null, null, null, '1.50', '0.00', '0.00', null, '1', '25.00', '1.50', '4100.00', '31', null, null, null, null, null, null, null, null, null, null, null);

-- ----------------------------
-- Table structure for `package_attachments`
-- ----------------------------
DROP TABLE IF EXISTS `package_attachments`;
CREATE TABLE `package_attachments` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `package_id` int(10) NOT NULL,
  `branch_id` int(10) NOT NULL,
  `file_name` varchar(350) NOT NULL,
  `file_type` varchar(10) NOT NULL,
  `create_user` varchar(35) NOT NULL,
  `create_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of package_attachments
-- ----------------------------

-- ----------------------------
-- Table structure for `package_names`
-- ----------------------------
DROP TABLE IF EXISTS `package_names`;
CREATE TABLE `package_names` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of package_names
-- ----------------------------

-- ----------------------------
-- Table structure for `package_statuses`
-- ----------------------------
DROP TABLE IF EXISTS `package_statuses`;
CREATE TABLE `package_statuses` (
  `id` tinyint(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `display_order` tinyint(6) DEFAULT NULL,
  `protected` tinyint(6) NOT NULL DEFAULT 0,
  `selectable` tinyint(6) NOT NULL DEFAULT 1 COMMENT 'selectable=1 => user can choose this status to update Pickup status',
  `outstanding` tinyint(6) NOT NULL DEFAULT 1,
  `stage` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of package_statuses
-- ----------------------------
INSERT INTO `package_statuses` VALUES ('1', 'Available for Pickup', '1', '1', '1', '1', 'pickup');
INSERT INTO `package_statuses` VALUES ('2', 'Accepted for Pickup', '2', '1', '1', '1', 'pickup');
INSERT INTO `package_statuses` VALUES ('3', 'Picked', '3', '1', '1', '1', 'pickup');
INSERT INTO `package_statuses` VALUES ('4', 'Picked and booked', '4', '1', '1', '1', 'pickup');
INSERT INTO `package_statuses` VALUES ('5', 'At Warehouse', '5', '1', '1', '1', 'delivery');
INSERT INTO `package_statuses` VALUES ('6', 'On Delivery', '6', '1', '1', '1', 'delivery');
INSERT INTO `package_statuses` VALUES ('7', 'Delayed', '8', '1', '1', '1', 'delivery');
INSERT INTO `package_statuses` VALUES ('8', 'Delivered', '7', '1', '1', '0', 'delivery');
INSERT INTO `package_statuses` VALUES ('9', 'Failed', '9', '1', '1', '1', 'delivery');
INSERT INTO `package_statuses` VALUES ('10', 'Continue To Deliver', '10', '1', '1', '1', 'delivery');
INSERT INTO `package_statuses` VALUES ('11', 'Returned', '11', '1', '1', '0', 'delivery');
INSERT INTO `package_statuses` VALUES ('12', 'Canceled', '12', '1', '0', '0', 'pickup');

-- ----------------------------
-- Table structure for `package_tracking`
-- ----------------------------
DROP TABLE IF EXISTS `package_tracking`;
CREATE TABLE `package_tracking` (
  `id` bigint(10) NOT NULL AUTO_INCREMENT,
  `tracking_number` varchar(25) NOT NULL,
  `package_id` bigint(10) NOT NULL,
  `oc_time` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `status_id` int(10) NOT NULL,
  `notes` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of package_tracking
-- ----------------------------

-- ----------------------------
-- Table structure for `password_resets`
-- ----------------------------
DROP TABLE IF EXISTS `password_resets`;
CREATE TABLE `password_resets` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `password_resets_email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of password_resets
-- ----------------------------

-- ----------------------------
-- Table structure for `pending_tasks`
-- ----------------------------
DROP TABLE IF EXISTS `pending_tasks`;
CREATE TABLE `pending_tasks` (
  `branch_id` int(10) NOT NULL,
  `user_id` int(10) NOT NULL,
  `official_id` int(10) DEFAULT NULL,
  `db_action` varchar(20) NOT NULL COMMENT 'db_action ={''insert'',''update'',''delete''}',
  `action_file_name` varchar(350) NOT NULL,
  `action_file_type` varchar(250) NOT NULL,
  `expiry_time` timestamp NULL DEFAULT NULL,
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `otp_code` varchar(15) NOT NULL,
  `create_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of pending_tasks
-- ----------------------------

-- ----------------------------
-- Table structure for `price_list`
-- ----------------------------
DROP TABLE IF EXISTS `price_list`;
CREATE TABLE `price_list` (
  `branch_id` int(1) NOT NULL,
  `price_per_kg` decimal(10,2) NOT NULL,
  `start_kg` decimal(10,2) NOT NULL,
  `end_kg` decimal(10,2) NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `never_expires` tinyint(6) NOT NULL DEFAULT 1,
  `price` decimal(10,2) DEFAULT NULL,
  `delivery_type` varchar(25) DEFAULT NULL,
  `base_price` decimal(10,2) DEFAULT NULL,
  `id` bigint(10) NOT NULL AUTO_INCREMENT,
  `sender_id` int(11) DEFAULT NULL,
  `price_option` varchar(15) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `create_date` timestamp NULL DEFAULT NULL,
  `zone_codes` varchar(500) DEFAULT NULL,
  `sender_ids` varchar(500) DEFAULT NULL,
  `price_list_id` int(10) DEFAULT NULL COMMENT 'price_list_id is reference to field id in table "price_list_names". price_list_id acts like version_id of the price_list ',
  `section` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`id`),
  FULLTEXT KEY `sender_ids` (`sender_ids`),
  FULLTEXT KEY `sender_ids_2` (`sender_ids`),
  FULLTEXT KEY `sender_ids_3` (`sender_ids`),
  FULLTEXT KEY `sender_ids_4` (`sender_ids`),
  FULLTEXT KEY `idx_zone_codes` (`zone_codes`)
) ENGINE=InnoDB AUTO_INCREMENT=153 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of price_list
-- ----------------------------
INSERT INTO `price_list` VALUES ('1', '0.00', '-1.00', '5.00', null, null, '1', '0.00', 'Fast', '1.50', '141', null, 'fixed', 'Admin@gmail.com', '2022-03-01 23:33:08', '|A1|A2|A10|A11|A12|A13|A14|A15|A16|A17|A18|A19|A20|A21|A22|A23|A24|A25|A26|A27|A28|A29|A3|A30|A31|A32|A33|A34|A35|A36|A37|A38|A39|A4|A5|A6|A7|A8|A9|', null, '7', 'below');
INSERT INTO `price_list` VALUES ('1', '0.00', '-1.00', '5.00', null, null, '1', '0.13', 'Normal', '1.00', '142', null, 'fixed', 'Admin@gmail.com', '2022-03-01 23:33:07', '|A1|A2|A10|A11|A12|A13|A14|A15|A16|A17|A18|A19|A20|A21|A22|A23|A24|A25|A26|A27|A28|A29|A3|A30|A31|A32|A33|A34|A35|A36|A37|A38|A39|A4|A5|A6|A7|A8|A9|', null, '7', 'below');
INSERT INTO `price_list` VALUES ('1', '0.13', '5.00', '-1.00', null, null, '1', '0.13', 'Fast', '1.50', '143', null, 'per kg', 'Admin@gmail.com', '2022-03-01 23:33:05', '|A1|A2|A10|A11|A12|A13|A14|A15|A16|A17|A18|A19|A20|A21|A22|A23|A24|A25|A26|A27|A28|A29|A3|A30|A31|A32|A33|A34|A35|A36|A37|A38|A39|A4|A5|A6|A7|A8|A9|', null, '7', 'above');
INSERT INTO `price_list` VALUES ('1', '0.13', '5.00', '-1.00', null, null, '1', '0.13', 'Normal', '1.00', '144', null, 'per kg', 'Admin@gmail.com', '2022-03-01 23:33:06', '|A1|A2|A10|A11|A12|A13|A14|A15|A16|A17|A18|A19|A20|A21|A22|A23|A24|A25|A26|A27|A28|A29|A3|A30|A31|A32|A33|A34|A35|A36|A37|A38|A39|A4|A5|A6|A7|A8|A9|', null, '7', 'above');
INSERT INTO `price_list` VALUES ('1', '0.00', '-1.00', '5.00', null, null, '1', '0.00', 'Fast', '2.00', '145', null, 'fixed', 'Admin@gmail.com', '2022-03-01 23:33:57', '|B1|B10|B11|B12|B13|B14|B2|B3|B4|B5|B6|B7|B8|B9|', null, '7', 'below');
INSERT INTO `price_list` VALUES ('1', '0.00', '-1.00', '5.00', null, null, '1', '0.00', 'Normal', '1.50', '146', null, 'fixed', 'Admin@gmail.com', '2022-03-01 23:33:58', '|B1|B10|B11|B12|B13|B14|B2|B3|B4|B5|B6|B7|B8|B9|', null, '7', 'below');
INSERT INTO `price_list` VALUES ('1', '0.13', '5.00', '-1.00', null, null, '1', '0.13', 'Fast', '2.00', '147', null, 'PER KG', 'Admin@gmail.com', '2022-03-01 23:33:59', '|B1|B10|B11|B12|B13|B14|B2|B3|B4|B5|B6|B7|B8|B9|', null, '7', 'above');
INSERT INTO `price_list` VALUES ('1', '0.13', '5.00', '-1.00', null, null, '1', '0.13', 'Normal', '1.50', '148', null, 'PER KG', 'Admin@gmail.com', '2022-03-01 23:34:00', '|B1|B10|B11|B12|B13|B14|B2|B3|B4|B5|B6|B7|B8|B9|', null, '7', 'above');
INSERT INTO `price_list` VALUES ('1', '0.00', '-1.00', '5.00', null, null, '1', '0.00', 'Fast', '2.50', '149', null, 'fixed', 'Admin@gmail.com', '2022-03-01 23:35:00', '|C1|C10|C11|C12|C13|C14|C15|C16|C17|C18|C19|C2|C20|C21|C22|C23|C24|C25|C26|C27|C28|C29|C3|C30|C31|C32|C33|C34|C35|C36|C37|C38|C39|C4|C40|C5|C6|C7|C8|C9|', null, '7', 'below');
INSERT INTO `price_list` VALUES ('1', '0.00', '-1.00', '5.00', null, null, '1', '0.00', 'Normal', '2.00', '150', null, 'fixed', 'Admin@gmail.com', '2022-03-01 23:34:58', '|C1|C10|C11|C12|C13|C14|C15|C16|C17|C18|C19|C2|C20|C21|C22|C23|C24|C25|C26|C27|C28|C29|C3|C30|C31|C32|C33|C34|C35|C36|C37|C38|C39|C4|C40|C5|C6|C7|C8|C9|', null, '7', 'below');
INSERT INTO `price_list` VALUES ('1', '0.13', '5.00', '-1.00', null, null, '1', '0.13', 'Fast', '2.50', '151', null, 'PER KG', 'Admin@gmail.com', '2022-03-01 23:34:56', '|C1|C10|C11|C12|C13|C14|C15|C16|C17|C18|C19|C2|C20|C21|C22|C23|C24|C25|C26|C27|C28|C29|C3|C30|C31|C32|C33|C34|C35|C36|C37|C38|C39|C4|C40|C5|C6|C7|C8|C9|', null, '7', 'above');
INSERT INTO `price_list` VALUES ('1', '0.13', '5.00', '-1.00', null, null, '1', '0.13', 'Normal', '2.00', '152', null, 'PER KG', 'Admin@gmail.com', '2022-03-01 23:34:55', '|C1|C10|C11|C12|C13|C14|C15|C16|C17|C18|C19|C2|C20|C21|C22|C23|C24|C25|C26|C27|C28|C29|C3|C30|C31|C32|C33|C34|C35|C36|C37|C38|C39|C4|C40|C5|C6|C7|C8|C9|', null, '7', 'above');

-- ----------------------------
-- Table structure for `price_list1`
-- ----------------------------
DROP TABLE IF EXISTS `price_list1`;
CREATE TABLE `price_list1` (
  `branch_id` int(1) NOT NULL,
  `price_per_kg` decimal(10,2) NOT NULL,
  `start_kg` decimal(10,2) NOT NULL,
  `end_kg` decimal(10,2) NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `never_expires` tinyint(6) NOT NULL DEFAULT 1,
  `price` decimal(10,2) DEFAULT NULL,
  `delivery_type` varchar(25) DEFAULT NULL,
  `base_price` decimal(10,2) DEFAULT NULL,
  `id` bigint(10) NOT NULL DEFAULT 0,
  `sender_id` int(11) DEFAULT NULL,
  `price_option` varchar(15) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `create_date` timestamp(6) NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `zone_codes` varchar(500) DEFAULT NULL,
  `sender_ids` varchar(500) DEFAULT NULL,
  `price_list_id` int(10) DEFAULT NULL COMMENT 'price_list_id is reference to field id in table "price_list_names". price_list_id acts like version_id of the price_list '
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of price_list1
-- ----------------------------
INSERT INTO `price_list1` VALUES ('1', '0.00', '-1.00', '3.00', '2021-11-27', null, '1', '0.00', 'Normal', '1.00', '73', '0', 'fixed', 'admin@gmail.com', '2022-01-26 02:02:09.931489', '|A1| A10|A11 |A12| A13|A14|A15|A16|A17|A18|A19|A2|A20|A21|A22|A23|A24|A25|A26|A27|A28|A29|A3|A30|A31|A32|A33|A34|A35|A36|A37|A38|A39|A4|A5|A6|A7|A8|A9|', '|35|34|33|36|', '1');
INSERT INTO `price_list1` VALUES ('1', '0.13', '3.00', '-1.00', '2021-11-27', null, '1', '0.00', 'Normal', '1.00', '74', '0', 'per_kg', 'admin@gmail.com', '2022-01-26 02:02:09.931489', '|A1|A10|A11|A12|A13|A14|A15|A16|A17|A18|A19|A2|A20|A21|A22|A23|A24|A25|A26|A27|A28|A29|A3|A30|A31|A32|A33|A34|A35|A36|A37|A38|A39|A4|A5|A6|A7|A8|A9|', '|35|34|36|', '1');
INSERT INTO `price_list1` VALUES ('1', '0.00', '-1.00', '3.00', '2021-11-27', null, '1', '0.00', 'Fast', '1.50', '75', '0', 'fixed', 'admin@gmail.com', '2022-01-26 02:02:09.931489', '|A1|A10|A11|A12|A13|A14|A15|A16|A17|A18|A19|A2|A20|A21|A22|A23|A24|A25|A26|A27|A28|A29|A3|A30|A31|A32|A33|A34|A35|A36|A37|A38|A39|A4|A5|A6|A7|A8|A9|', '|35|34|33|36|', '1');
INSERT INTO `price_list1` VALUES ('1', '0.00', '3.00', '-1.00', '2021-11-25', null, '1', '3.10', 'Fast', '1.50', '76', '0', 'fixed', 'admin@gmail.com', '2022-02-07 03:47:24.000000', '|A1|A10|A11|A12|A13|A14|A15|A16|A17|A18|A19|A2|A20|A21|A22|A23|A24|A25|A26|A27|A28|A29|A3|A30|A31|A32|A33|A34|A35|A36|A37|A38|A39|A4|A5|A6|A7|A8|A9|', '|35|34|33|36|', '1');
INSERT INTO `price_list1` VALUES ('1', '0.00', '-1.00', '3.00', '2021-11-27', null, '1', '0.00', 'Normal', '1.50', '77', '0', 'fixed', 'admin@gmail.com', '2022-01-26 02:02:09.931489', '|B1|B10|B11|B12|B13|B14|B2|B3|B4|B5|B6|B7|B8 |B9|', '|35|34|33|36|', '1');
INSERT INTO `price_list1` VALUES ('1', '0.13', '3.00', '-1.00', '2021-11-27', null, '1', '0.00', 'Normal', '1.50', '78', '0', 'per_kg', 'admin@gmail.com', '2022-01-26 02:02:09.931489', '|B1|B10|B11|B12|B13|B14|B2|B3|B4|B5|B6|B7|B8 |B9|', '|35|34|33|36|', '1');
INSERT INTO `price_list1` VALUES ('1', '0.00', '-1.00', '3.00', '2021-11-27', null, '1', '0.00', 'Fast', '2.00', '79', '0', 'fixed', 'admin@gmail.com', '2022-01-26 02:02:09.931489', '|B1|B10|B11|B12|B13|B14|B2|B3|B4|B5|B6|B7|B8|B9|', '|35|34|33|36|', '1');
INSERT INTO `price_list1` VALUES ('1', '0.13', '3.00', '-1.00', '2021-11-25', null, '1', '0.00', 'Fast', '2.00', '80', '0', 'per_kg', 'Puthea', '2022-01-26 02:02:09.931489', '|B1|B10|B11|B12|B13|B14|B2|B3|B4|B5|B6|B7|B8|B9|', '|35|34|33|36|', '1');
INSERT INTO `price_list1` VALUES ('1', '0.00', '-1.00', '3.00', '2021-11-27', null, '1', '0.00', 'Normal', '2.00', '81', '0', 'fixed', 'admin@gmail.com', '2022-01-26 02:02:09.931489', '|C1|C10|C11|C12|C13|C14|C15|C16|C17|C18|C19|C2|C20|C21|C22|C23|C24|C25|C26|C27|C28|C29|C3|C30|C31|C32|C33|C34|C35|C36|C37|C38|C39|C4|C40|C5|C6|C7|C8|C9|', '|35|34|33|36|', '1');
INSERT INTO `price_list1` VALUES ('1', '0.13', '3.00', '-1.00', '2021-11-27', null, '1', '0.00', 'Normal', '2.00', '82', '0', 'per_kg', 'admin@gmail.com', '2022-01-26 02:02:09.931489', '|C1|C10|C11|C12|C13|C14|C15|C16|C17|C18|C19|C2|C20|C21|C22|C23|C24|C25|C26|C27|C28|C29|C3|C30|C31|C32|C33|C34|C35|C36|C37|C38|C39|C4|C40|C5|C6|C7|C8|C9|', '|35|34|33|36|', '1');
INSERT INTO `price_list1` VALUES ('1', '0.00', '-1.00', '3.00', '2021-11-27', null, '1', '0.00', 'Fast', '2.50', '83', '0', 'fixed', 'admin@gmail.com', '2022-01-26 02:02:09.931489', '|C1|C10|C11|C12|C13|C14|C15|C16|C17|C18|C19|C2|C20|C21|C22|C23|C24|C25|C26|C27|C28|C29|C3|C30|C31|C32|C33|C34|C35|C36|C37|C38|C39|C4|C40|C5|C6|C7|C8|C9|', '|35|34|33|36|', '1');
INSERT INTO `price_list1` VALUES ('1', '0.13', '3.00', '-1.00', '2021-11-25', null, '1', '0.00', 'Fast', '2.50', '84', '0', 'per_kg', 'Puthea', '2022-01-26 02:02:09.931489', '|C1|C10|C11|C12|C13|C14|C15|C16|C17|C18|C19|C2|C20|C21|C22|C23|C24|C25|C26|C27|C28|C29|C3|C30|C31|C32|C33|C34|C35|C36|C37|C38|C39|C4|C40|C5|C6|C7|C8|C9|', '|35|34|33|36|', '1');
INSERT INTO `price_list1` VALUES ('1', '0.00', '-1.00', '3.00', '2021-11-27', null, '1', '0.00', 'Normal', '1.00', '85', '0', 'fixed', 'admin@gmail.com', '2022-01-26 02:02:09.931489', '|A1|A10|A11|A12|A13|A14|A15|A16|A17|A18|A19|A2|A20|A21|A22|A23|A24|A25|A26|A27|A28|A29|A3|A30|A31|A32|A33|A34|A35|A36|A37|A38|A39|A4|A5|A6|A7|A8|A9|', '|38|37|39|40|', '1');
INSERT INTO `price_list1` VALUES ('1', '0.13', '3.00', '-1.00', '2021-11-27', null, '1', '0.00', 'Normal', '1.00', '86', '0', 'per_kg', 'admin@gmail.com', '2022-01-26 02:02:09.931489', '|A1|A10|A11|A12|A13|A14|A15|A16|A17|A18|A19|A2|A20|A21|A22|A23|A24|A25|A26|A27|A28|A29|A3|A30|A31|A32|A33|A34|A35|A36|A37|A38|A39|A4|A5|A6|A7|A8|A9|', '|38|37|39|40|', '1');
INSERT INTO `price_list1` VALUES ('1', '0.00', '-1.00', '3.00', '2021-11-27', null, '1', '0.00', 'Fast', '1.50', '87', '0', 'fixed', 'admin@gmail.com', '2022-01-26 02:02:09.931489', '|A1|A10|A11|A12|A13|A14|A15|A16|A17|A18|A19|A2|A20|A21|A22|A23|A24|A25|A26|A27|A28|A29|A3|A30|A31|A32|A33|A34|A35|A36|A37|A38|A39|A4|A5|A6|A7|A8|A9|', '|38|37|39|40|', '1');
INSERT INTO `price_list1` VALUES ('1', '0.13', '3.00', '-1.00', '2021-11-27', null, '1', '0.00', 'Fast', '1.50', '88', '0', 'per_kg', 'admin@gmail.com', '2022-01-26 02:02:09.931489', '|A1|A10|A11|A12|A13|A14|A15|A16|A17|A18|A19|A2|A20|A21|A22|A23|A24|A25|A26|A27|A28|A29|A3|A30|A31|A32|A33|A34|A35|A36|A37|A38|A39|A4|A5|A6|A7|A8|A9|', '|38|37|39|40|', '1');
INSERT INTO `price_list1` VALUES ('1', '0.00', '-1.00', '3.00', '2021-11-27', null, '1', '0.00', 'Normal', '1.50', '89', '0', 'fixed', 'admin@gmail.com', '2022-01-26 02:02:09.931489', '|B1|B10|B11|B12|B13|B14|B2|B3|B4|B5|B6|B7|B8|B9|', '|38|37|39|40|', '1');
INSERT INTO `price_list1` VALUES ('1', '0.13', '3.00', '-1.00', '2021-11-27', null, '1', '0.00', 'Normal', '1.50', '90', '0', 'per_kg', 'admin@gmail.com', '2022-01-26 02:02:09.931489', '|B1|B10|B11|B12|B13|B14|B2|B3|B4|B5|B6|B7|B8|B9|', '|38|37|39|40|', '1');
INSERT INTO `price_list1` VALUES ('1', '0.00', '-1.00', '3.00', '2021-11-27', null, '1', '0.00', 'Fast', '2.00', '91', '0', 'fixed', 'admin@gmail.com', '2022-01-26 02:02:09.931489', '|B1|B10|B11|B12|B13|B14|B2|B3|B4|B5|B6|B7|B8|B9|', '|38|37|39|40|', '1');
INSERT INTO `price_list1` VALUES ('1', '0.13', '3.00', '-1.00', '2021-11-27', null, '1', '0.00', 'Fast', '2.00', '92', '0', 'per_kg', 'admin@gmail.com', '2022-01-26 02:02:09.931489', '|B1|B10|B11|B12|B13|B14|B2|B3|B4|B5|B6|B7|B8|B9|', '|38|37|39|40|', '1');
INSERT INTO `price_list1` VALUES ('1', '0.00', '-1.00', '3.00', '2021-11-27', null, '1', '0.00', 'Normal', '2.00', '93', '0', 'fixed', 'admin@gmail.com', '2022-01-26 02:02:09.931489', '|C1|C10|C11|C12|C13|C14|C15|C16|C17|C18|C19|C2|C20|C21|C22|C23|C24|C25|C26|C27|C28|C29|C3|C30|C31|C32|C33|C34|C35|C36|C37|C38|C39|C4|C40|C5|C6|C7|C8|C9|', '|38|37|39|40|', '1');
INSERT INTO `price_list1` VALUES ('1', '0.13', '3.00', '-1.00', '2021-12-25', null, '1', '0.00', 'Normal', '2.00', '94', '0', 'per_kg', 'admin@gmail.com', '2022-01-26 02:02:09.931489', '|A10|A11|A12|A13|A14|A15|C1|C10|C11|C12|C13|C14|C15|C16|C17|C18|C19|C2|C20|C21|C22|C23|C24|C25|C26|C27|C28|C29|C3|C30|C31|C32|C33|C34|C35|C36|C37|C38|C39|C4|C40|C5|C6|C7|C8|C9|', '|46|38|37|39|40|', '1');
INSERT INTO `price_list1` VALUES ('1', '0.00', '-1.00', '3.00', '2021-11-27', null, '1', '0.00', 'Fast', '2.50', '95', '0', 'fixed', 'admin@gmail.com', '2022-01-26 02:02:09.931489', '|C1|C10|C11|C12|C13|C14|C15|C16|C17|C18|C19|C2|C20|C21|C22|C23|C24|C25|C26|C27|C28|C29|C3|C30|C31|C32|C33|C34|C35|C36|C37|C38|C39|C4|C40|C5|C6|C7|C8|C9|', '|38|37|39|40|', '1');
INSERT INTO `price_list1` VALUES ('1', '0.13', '3.00', '-1.00', '2021-12-21', null, '1', '0.00', 'Fast', '2.50', '96', '0', 'per_kg', 'admin@gmail.com', '2022-01-26 02:02:09.931489', '|A1|A10|A11|A12|A13|A14|A15|A16|A17|A18|A19|', '|65|38|37|39|40|', '1');
INSERT INTO `price_list1` VALUES ('1', '0.00', '-1.00', '3.00', '2021-12-25', null, '1', '0.00', 'Normal', '1.00', '97', '0', 'fixed', 'admin@gmail.com', '2022-01-26 02:02:09.931489', '|A1|A10|A11|A12|A13|A14|A15|A16|A17|A18|A19|A2|A20|A21|A22|A23|A24|A25|A26|A27|A28|A29|A3|A30|A31|A32|A33|A34|A35|A36|A37|A38|A39|A4|A5|A6|A7|A8|A9|', '|46|41|65|', '1');
INSERT INTO `price_list1` VALUES ('1', '0.13', '3.00', '-1.00', '2021-12-25', null, '1', '0.00', 'Normal', '1.00', '98', '0', 'per_kg', 'admin@gmail.com', '2022-01-26 02:02:09.931489', '|A1|A10|A11|A12|A13|A14|A15|A16|A17|A18|A19|A2|A20|A21|A22|A23|A24|A25|A26|A27|A28|A29|A3|A30|A31|A32|A33|A34|A35|A36|A37|A38|A39|A4|A5|A6|A7|A8|A9|', '|46|41|65|', '1');
INSERT INTO `price_list1` VALUES ('1', '0.00', '3.00', '-1.00', null, null, '1', '0.00', 'Fast', '0.00', '99', null, 'Fixed', 'admin@gmail.com', '2022-02-07 03:47:42.000000', '|A1| A10|A11 |A12| A13|A14|A15|A16|A17|A18|A19|A2|A20|A21|A22|A23|A24|A25|A26|A27|A28|A29|A3|A30|A31|A32|A33|A34|A35|A36|A37|A38|A39|A4|A5|A6|A7|A8|A9|', null, '1');
INSERT INTO `price_list1` VALUES ('1', '0.00', '3.00', '-1.00', null, null, '1', '0.00', 'Normal', '0.00', '100', null, 'fixed', 'admin@gmail.com', '2022-02-07 03:16:07.000000', '|A1| A10|A11 |A12| A13|A14|A15|A16|A17|A18|A19|A2|A20|A21|A22|A23|A24|A25|A26|A27|A28|A29|A3|A30|A31|A32|A33|A34|A35|A36|A37|A38|A39|A4|A5|A6|A7|A8|A9|', null, '1');

-- ----------------------------
-- Table structure for `price_list_names`
-- ----------------------------
DROP TABLE IF EXISTS `price_list_names`;
CREATE TABLE `price_list_names` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `kg_marker` decimal(10,0) NOT NULL,
  `branch_id` int(10) NOT NULL,
  `create_user` varchar(35) DEFAULT NULL,
  `create_date` timestamp NULL DEFAULT NULL,
  `is_default` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of price_list_names
-- ----------------------------
INSERT INTO `price_list_names` VALUES ('7', 'PL1', '5', '1', 'Admin@gmail.com', '2022-03-01 23:26:15', null);

-- ----------------------------
-- Table structure for `priority`
-- ----------------------------
DROP TABLE IF EXISTS `priority`;
CREATE TABLE `priority` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT 'order_type = {VIP, Immediate Delivery, Delivery Later}',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of priority
-- ----------------------------
INSERT INTO `priority` VALUES ('1', 'VIP');
INSERT INTO `priority` VALUES ('2', 'Immediate');
INSERT INTO `priority` VALUES ('3', 'Deliver Later');

-- ----------------------------
-- Table structure for `product_types`
-- ----------------------------
DROP TABLE IF EXISTS `product_types`;
CREATE TABLE `product_types` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `name` varchar(150) NOT NULL,
  `create_user` varchar(35) NOT NULL,
  `create_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of product_types
-- ----------------------------
INSERT INTO `product_types` VALUES ('1', '1', 'Cosmetics', 'Admin', '2021-12-06 23:29:02');
INSERT INTO `product_types` VALUES ('2', '1', 'Clothing', 'Admin', '2021-12-06 23:29:16');
INSERT INTO `product_types` VALUES ('3', '1', 'Electronics', 'Admin', '2021-12-06 23:29:45');

-- ----------------------------
-- Table structure for `promotions`
-- ----------------------------
DROP TABLE IF EXISTS `promotions`;
CREATE TABLE `promotions` (
  `branch_id` int(10) NOT NULL,
  `category` varchar(150) NOT NULL DEFAULT '',
  `title` varchar(50) NOT NULL DEFAULT '',
  `description` varchar(390) DEFAULT '',
  `user_class` varchar(35) NOT NULL,
  `file_name` varchar(250) DEFAULT '',
  `file_type` varchar(100) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `expiry_date` timestamp NULL DEFAULT NULL,
  `create_date` timestamp NULL DEFAULT NULL,
  `create_user` varchar(35) NOT NULL,
  `id` int(10) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of promotions
-- ----------------------------
INSERT INTO `promotions` VALUES ('1', 'General', 'Worst Promo', 'This is the worst promo for seller sdfdsgdfhxgdgdfg dxgdfhgfdhf\ndfg\ndf\nghfdhgfhgfhhfg', 'merchant', '1_62217d6cb3685_20220304_090304.jpg', 'jpg', '2022-03-04', '2022-04-03 00:00:00', '2022-03-04 09:28:37', 'Admin@gmail.com', '27');
INSERT INTO `promotions` VALUES ('1', 'General', 'dfgf', 'dfdgd', 'merchant', '1_62217d8bb7e77_20220304_090335.jpg', 'jpg', '2022-03-04', '2022-04-03 00:00:00', '2022-03-04 09:28:23', 'Admin@gmail.com', '28');
INSERT INTO `promotions` VALUES ('1', 'General', 'weer', 'dfertytr', 'merchant', '1_6221c14f10c12_20220304_020343.jpg', 'jpg', '2022-03-04', '2022-04-03 14:35:43', '2022-03-04 14:35:43', 'samsethy', '29');

-- ----------------------------
-- Table structure for `receiver`
-- ----------------------------
DROP TABLE IF EXISTS `receiver`;
CREATE TABLE `receiver` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `address` varchar(200) DEFAULT NULL,
  `map_location` varchar(150) DEFAULT NULL,
  `phone_number` varchar(100) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `category_id` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of receiver
-- ----------------------------

-- ----------------------------
-- Table structure for `returned_packages`
-- ----------------------------
DROP TABLE IF EXISTS `returned_packages`;
CREATE TABLE `returned_packages` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `package_id` int(10) NOT NULL,
  `remarks` varchar(250) DEFAULT NULL,
  `create_user` varchar(35) NOT NULL,
  `create_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `return_date` date NOT NULL,
  `sender_id` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of returned_packages
-- ----------------------------
INSERT INTO `returned_packages` VALUES ('2', '1', '163', null, 'admin@gmail.com', '2022-03-01 11:34:41.000000', '2022-03-01', '37');

-- ----------------------------
-- Table structure for `salespersons`
-- ----------------------------
DROP TABLE IF EXISTS `salespersons`;
CREATE TABLE `salespersons` (
  `id` int(10) NOT NULL,
  `branch_id` int(10) NOT NULL,
  `name` varchar(50) NOT NULL,
  `sex` varchar(10) NOT NULL,
  `phone_number` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `national_id` varchar(25) DEFAULT NULL,
  `service_type` varchar(255) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of salespersons
-- ----------------------------

-- ----------------------------
-- Table structure for `sales_agents`
-- ----------------------------
DROP TABLE IF EXISTS `sales_agents`;
CREATE TABLE `sales_agents` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `agent_type_id` tinyint(6) DEFAULT 1,
  `name` varchar(50) NOT NULL,
  `name_kh` varchar(200) DEFAULT '',
  `phone_number` varchar(25) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `adr_country_id` int(10) DEFAULT NULL,
  `adr_city_id` int(10) DEFAULT NULL,
  `adr_district_id` int(10) DEFAULT NULL,
  `adr_commune_id` int(10) DEFAULT NULL,
  `address` varchar(250) DEFAULT '',
  `create_user` varchar(50) NOT NULL,
  `create_date` timestamp NULL DEFAULT NULL,
  `code` varchar(25) DEFAULT '',
  `branch_id` int(10) DEFAULT NULL,
  `status_code` varchar(20) DEFAULT 'active',
  `update_user` varchar(35) DEFAULT NULL,
  `update_date` timestamp NULL DEFAULT NULL,
  `commission` decimal(10,2) DEFAULT NULL,
  `commission_type` varchar(15) DEFAULT 'per_item' COMMENT 'commission_type = {''per_item'',''per_referal''}',
  `sex` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sales_agents
-- ----------------------------
INSERT INTO `sales_agents` VALUES ('1', '1', 'Lim Vannak', null, '011657985', 'vannaksuceedgmailcom', null, null, null, null, '#278 St90 Sangkat Buoeng Tompun Khan Meanchey Phnom Penh', 'admin@gmail.com', '2021-12-03 03:22:52', 'A100007', '1', 'Active', null, '2021-12-03 03:22:52', '0.08', 'per_item', null);
INSERT INTO `sales_agents` VALUES ('5', '1', 'Kim Chandara', null, '012765768', 'chandaragmailcom', null, null, null, null, '#123 St260 Sangkat BKK1 Khan Chamkarmon Phnom Penh', 'admin@gmail.com', '2021-12-03 03:24:33', 'A100011', '1', 'Active', null, '2021-12-03 03:24:33', '0.08', 'per_item', null);
INSERT INTO `sales_agents` VALUES ('6', '2', 'Lim racksmey', null, '089 798653', 'NA', null, null, null, null, '#12 St34 Sangkat Toul Sangke Khan Russey Keo Phnom Penh', 'admin@gmail.com', '2021-12-03 03:26:21', 'A100012', '1', 'Active', null, null, '0.08', 'per_item', null);
INSERT INTO `sales_agents` VALUES ('7', '2', 'Ros Sabay', null, '0897689876', 'NA', null, null, null, null, 'Takeo', 'admin@gmail.com', '2021-12-03 03:28:02', 'A100013', '1', 'Active', null, null, '0.08', 'per_item', null);
INSERT INTO `sales_agents` VALUES ('8', '2', 'Heng Samnang', null, '098765432', 'NA', null, null, null, null, 'Phnom Penh', 'admin@gmail.com', '2021-12-03 03:28:39', 'A100014', '1', 'Active', null, null, '0.08', 'per_item', null);
INSERT INTO `sales_agents` VALUES ('9', '1', 'Reak Chamreourn', null, '098765432', 'NA', null, null, null, null, 'Prey Veng', 'admin@gmail.com', '2021-12-03 03:29:22', 'A100015', '1', 'Active', null, null, '0.08', 'per_item', null);

-- ----------------------------
-- Table structure for `sales_agent_statuses`
-- ----------------------------
DROP TABLE IF EXISTS `sales_agent_statuses`;
CREATE TABLE `sales_agent_statuses` (
  `id` int(10) NOT NULL DEFAULT 0,
  `code` varchar(20) NOT NULL,
  `name` varchar(35) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sales_agent_statuses
-- ----------------------------
INSERT INTO `sales_agent_statuses` VALUES ('1', 'Active', 'Active');
INSERT INTO `sales_agent_statuses` VALUES ('2', 'Inactive', 'Inactive');

-- ----------------------------
-- Table structure for `sales_agent_types`
-- ----------------------------
DROP TABLE IF EXISTS `sales_agent_types`;
CREATE TABLE `sales_agent_types` (
  `id` int(10) NOT NULL,
  `name` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sales_agent_types
-- ----------------------------
INSERT INTO `sales_agent_types` VALUES ('1', 'Full time');
INSERT INTO `sales_agent_types` VALUES ('2', 'Freelancer');

-- ----------------------------
-- Table structure for `sender`
-- ----------------------------
DROP TABLE IF EXISTS `sender`;
CREATE TABLE `sender` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `sender_type_id` int(10) DEFAULT 1,
  `name` varchar(50) NOT NULL,
  `name_kh` varchar(200) DEFAULT '',
  `phone_number` varchar(25) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `adr_country_id` int(10) DEFAULT NULL,
  `adr_city_id` int(10) DEFAULT NULL,
  `adr_district_id` int(10) DEFAULT NULL,
  `adr_commune_id` int(10) DEFAULT NULL,
  `address` varchar(250) DEFAULT '',
  `business_type` varchar(50) DEFAULT NULL,
  `sender_type` varchar(30) DEFAULT NULL COMMENT 'sender_type ={merchant, individual}',
  `create_user` varchar(50) NOT NULL,
  `create_date` timestamp NULL DEFAULT NULL,
  `code` varchar(25) DEFAULT '',
  `zone_code` varchar(15) DEFAULT NULL,
  `map_location` varchar(150) DEFAULT NULL,
  `branch_id` int(10) DEFAULT NULL,
  `status_code` varchar(20) DEFAULT 'active',
  `update_user` varchar(35) DEFAULT NULL,
  `update_date` timestamp NULL DEFAULT NULL,
  `sales_agent_id` int(11) DEFAULT NULL,
  `photo_file_name` varchar(250) DEFAULT NULL,
  `photo_file_type` varchar(7) DEFAULT NULL,
  `price_list_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sender
-- ----------------------------
INSERT INTO `sender` VALUES ('33', '1', 'បងស្រី លីតា Lita', 'បងស្រី លីតា Lita', '010989805', null, null, null, null, null, 'ផ្សាស្ទឹងមានជយ័ថ្មី', 'Fashion and Clothing', null, 'Puthea', '2022-02-17 01:11:32', '10001', null, null, '1', 'active', 'admin@gmail.com', '2022-02-17 01:11:32', null, '1_merchant_profile_20220216_010232.png', 'png', '7');
INSERT INTO `sender` VALUES ('34', '1', 'បងស្រី ពិសិដ្ឋរៀម', 'បងស្រី ពិសិដ្ឋរៀម', '012​982009', null, null, null, null, null, 'បុរី​ ប៉េងហួត វាលស្បូវ', 'Cosmetics', null, 'Puthea', '2022-02-09 05:31:16', '10002', null, null, '1', 'active', 'Puthea', '2022-02-09 05:31:16', null, '/home3/parrotcloudapps/public_html/uploads/companies/1_data/merchants/1_profile_pic_20211202_101251.jpg', 'jpg', '7');
INSERT INTO `sender` VALUES ('35', '1', 'កញ្ញា ស្រីពេជ្រ', 'កញ្ញា ស្រីពេជ្រ', '093​758446', null, null, null, null, null, 'បុរី ភពថ្មីចំការដូង', 'Cosmetics', null, 'Puthea', '2022-02-09 05:31:16', '10003', null, null, '1', 'active', 'Puthea', '2022-02-09 05:31:16', null, '/home3/parrotcloudapps/public_html/uploads/companies/1_data/merchants/1_profile_pic_20211202_101251.jpg', 'jpg', '7');
INSERT INTO `sender` VALUES ('36', '1', 'អូន ដាវី', 'អូន ដាវី', '099403489', null, null, null, null, null, 'ទល់មុខពេទ្យរ៉ូសុី', 'Fashion and Clothing', null, 'Puthea', '2022-02-09 05:31:16', '10004', null, null, '1', 'active', 'Puthea', '2022-02-09 05:31:16', null, '/home3/parrotcloudapps/public_html/uploads/companies/1_data/merchants/1_profile_pic_20211202_101251.jpg', 'jpg', '7');
INSERT INTO `sender` VALUES ('37', '1', 'Rattana Hak', 'Rattana Hak', '016285878', null, null, null, null, null, 'Seim Reap', 'Online Sale', null, 'admin@gmail.com', '2022-02-09 05:31:16', '10005', null, null, '1', 'active', null, '2022-02-09 05:31:16', null, '/home3/parrotcloudapps/public_html/uploads/companies/1_data/merchants/1_profile_pic_20211202_101251.jpg', 'jpg', '7');
INSERT INTO `sender` VALUES ('38', '1', 'Meng Korng', 'Meng Korng', '015877768', null, null, null, null, null, 'Kandal Province', 'Online Sale', null, 'admin@gmail.com', '2022-02-09 05:31:16', '10006', null, null, '1', 'active', null, '2022-02-09 05:31:16', null, '/home3/parrotcloudapps/public_html/uploads/companies/1_data/merchants/1_profile_pic_20211202_101251.jpg', 'jpg', '7');
INSERT INTO `sender` VALUES ('39', '1', 'Seng Kimly', 'Seng Kimly', '0885858586', null, null, null, null, null, 'Phnom Pengh', 'Online Sale', null, 'admin@gmail.com', '2022-02-09 05:31:16', '10007', null, null, '1', 'active', null, '2022-02-09 05:31:16', null, '/home3/parrotcloudapps/public_html/uploads/companies/1_data/merchants/1_profile_pic_20211202_101251.jpg', 'jpg', '7');
INSERT INTO `sender` VALUES ('40', '2', 'អូន ធីដា', 'អូន ធីដា', '087823080', null, null, null, null, null, 'Olympic Phnom Penh', 'Online Sale', null, 'admin@gmail.com', '2022-02-09 05:31:16', '10008', null, null, '1', 'active', null, '2022-02-09 05:31:16', null, '/home3/parrotcloudapps/public_html/uploads/companies/1_data/merchants/1_profile_pic_20211202_101251.jpg', 'jpg', '7');
INSERT INTO `sender` VALUES ('41', '2', 'Madam Q Homestore', 'Madam Q Homestore', '093488777', null, null, null, null, null, 'Phnom Penh', 'Online Sale', null, 'admin@gmail.com', '2022-02-09 05:31:16', '10009', null, null, '1', 'active', null, '2022-02-09 05:31:16', null, '/home3/parrotcloudapps/public_html/uploads/companies/1_data/merchants/1_profile_pic_20211202_101251.jpg', 'jpg', '7');
INSERT INTO `sender` VALUES ('42', '2', 'Super Sales ABC', 'Super Sales ABC', '012555777', null, null, null, null, null, null, null, null, 'self register', '2022-02-09 05:31:16', '10010', null, null, '1', 'active', null, '2022-02-09 05:31:16', null, '/home3/parrotcloudapps/public_html/uploads/companies/1_data/merchants/1_profile_pic_20211202_101251.jpg', 'jpg', '7');
INSERT INTO `sender` VALUES ('43', null, 'Danny', 'ដានី', '012555771', null, null, null, null, null, 'Chamkaman', 'Food Shop', null, 'self register', '2022-02-09 05:31:16', '10011', null, null, '1', 'active', '012555771', '2022-02-09 05:31:16', null, '/home3/parrotcloudapps/public_html/uploads/companies/1_data/merchants/1_profile_pic_20211202_101251.jpg', 'jpg', '7');
INSERT INTO `sender` VALUES ('44', '2', 'Bopha', 'Bopha', '012555666', 'bopha@gmail.com', null, null, null, null, 'Testing', null, null, 'self register', '2022-02-09 05:31:16', '10012', null, null, '1', 'active', null, '2022-02-09 05:31:16', null, '/home3/parrotcloudapps/public_html/uploads/companies/1_data/merchants/1_profile_pic_20211202_101251.jpg', 'jpg', '7');
INSERT INTO `sender` VALUES ('45', '2', 'Benee', 'Benee', '066999988', 'benee@gmail.com', null, null, null, null, 'TEsting', null, null, 'self register', '2022-02-09 05:31:16', '10013', null, null, '1', 'active', null, '2022-02-09 05:31:16', null, '/home3/parrotcloudapps/public_html/uploads/companies/1_data/merchants/1_profile_pic_20211202_101251.jpg', 'jpg', '7');
INSERT INTO `sender` VALUES ('46', '2', 'Jackie', 'Jackie', '+855967174940', 'jackie@bro.com', null, null, null, null, 'Testing', null, null, 'self register', '2022-02-09 05:31:16', '10014', null, null, '1', 'active', null, '2022-02-09 05:31:16', null, null, null, '7');
INSERT INTO `sender` VALUES ('49', '2', 'Lim Vannak', 'Lim Vannak', '011657985', null, null, null, null, null, null, null, null, 'self register', '2022-02-09 05:31:16', '10017', null, null, '1', 'active', null, '2022-02-09 05:31:16', null, null, null, '7');
INSERT INTO `sender` VALUES ('65', '2', 'ME', 'ME', '010428632', null, null, null, null, null, null, null, null, 'self register', '2022-02-09 05:45:37', '10033', null, null, '1', 'active', null, '2022-02-09 05:45:37', null, null, null, '7');
INSERT INTO `sender` VALUES ('66', '1', '016285878', '016285878', '016285878', null, null, null, null, null, 'sdfdgfgfg', 'Fashion and Clothing', null, 'admin@gmail.com', '2022-03-06 19:13:02', '10034', null, null, '1', 'active', null, null, null, null, null, null);

-- ----------------------------
-- Table structure for `sender_bank_accounts`
-- ----------------------------
DROP TABLE IF EXISTS `sender_bank_accounts`;
CREATE TABLE `sender_bank_accounts` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `sender_id` int(10) NOT NULL,
  `branch_id` int(10) NOT NULL,
  `bank_name` varchar(100) NOT NULL,
  `account_number` varchar(25) NOT NULL,
  `account_name` varchar(50) NOT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `create_date` timestamp NULL DEFAULT NULL,
  `is_primary` tinyint(6) NOT NULL DEFAULT 0 COMMENT 'is_primary = 1 => the account is used as primary account',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sender_bank_accounts
-- ----------------------------
INSERT INTO `sender_bank_accounts` VALUES ('21', '9', '1', 'ABA', '111', 'DDD', 'admin@gmail.com', '2021-10-21 23:29:17', '1');
INSERT INTO `sender_bank_accounts` VALUES ('22', '9', '1', 'ACLEDA', '0222222', 'cbnbn', 'admin@gmail.com', '2021-10-21 23:29:17', '0');
INSERT INTO `sender_bank_accounts` VALUES ('23', '6', '1', 'ABA', '00997878', 'Samsethy', 'admin@gmail.com', '2021-10-21 23:30:11', '1');
INSERT INTO `sender_bank_accounts` VALUES ('24', '6', '1', 'ACLEDA', '00002086877878', 'samsethy THOUN', 'admin@gmail.com', '2021-10-21 23:30:11', '0');
INSERT INTO `sender_bank_accounts` VALUES ('25', '26', '1', 'ABA BANK', '000151572', 'LIM VANNAK', 'Sopha', '2021-11-07 05:02:52', '1');
INSERT INTO `sender_bank_accounts` VALUES ('26', '27', '1', 'ABA BANK', '000151572', 'LIM VANNAK', 'Sopha', '2021-11-07 05:30:44', '1');
INSERT INTO `sender_bank_accounts` VALUES ('27', '28', '1', 'ABA BANK', '000151572', 'LIM VANNAK', 'Sopha', '2021-11-07 06:39:08', '1');
INSERT INTO `sender_bank_accounts` VALUES ('28', '33', '1', 'ABA', '000257469', 'SEM SOLITA', 'admin@gmail.com', '2021-12-14 16:30:24', '1');
INSERT INTO `sender_bank_accounts` VALUES ('29', '34', '1', 'ABA', '000298000', 'TOUCH PISETHRAMY', 'Puthea', '2021-11-24 07:29:49', '1');
INSERT INTO `sender_bank_accounts` VALUES ('30', '35', '1', 'ABA', '000842441', 'SEM SREYPICH', 'Puthea', '2021-11-24 07:30:03', '1');
INSERT INTO `sender_bank_accounts` VALUES ('31', '36', '1', 'ABA', '500158818', 'CHIN DAVY', 'Puthea', '2021-11-26 04:54:45', '1');
INSERT INTO `sender_bank_accounts` VALUES ('57', '43', '1', 'Bank C', '000123321', 'Bank 3C', '012555771', '2021-11-30 23:17:58', '0');
INSERT INTO `sender_bank_accounts` VALUES ('58', '43', '1', 'back r', '000897678', 'bnk Er', '012555771', '2021-12-01 00:14:58', '1');
INSERT INTO `sender_bank_accounts` VALUES ('59', '43', '1', 'Bank J', '000234567', 'Janson', '012555771', '2021-12-01 00:17:15', '1');
INSERT INTO `sender_bank_accounts` VALUES ('60', '43', '1', 'Bank S', '12345678901', 'Sosan', '012555771', '2021-12-01 00:18:21', '1');
INSERT INTO `sender_bank_accounts` VALUES ('61', '43', '1', 'BankW', '09784326578', 'Asana', '012555771', '2021-12-01 00:19:56', '1');
INSERT INTO `sender_bank_accounts` VALUES ('62', '43', '1', 'Acleda', '000888999', 'Channy', '012555771', '2021-12-02 04:58:06', '1');

-- ----------------------------
-- Table structure for `sender_base_price`
-- ----------------------------
DROP TABLE IF EXISTS `sender_base_price`;
CREATE TABLE `sender_base_price` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `sender_id` int(10) NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `start_date` date NOT NULL,
  `never_expires` tinyint(6) NOT NULL DEFAULT 0,
  `end_date` date DEFAULT NULL,
  `update_user` varchar(50) NOT NULL,
  `update_date` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `zone_code` varchar(10) DEFAULT '' COMMENT 'zone in which base fixed price is applied. NOTE additional_fee = billed_kg * price_per_kg. This additional_fee is added to this @base_fixed_price ',
  `create_date` date DEFAULT NULL,
  `create_user` varchar(35) DEFAULT NULL,
  `delivery_type` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sender_base_price
-- ----------------------------
INSERT INTO `sender_base_price` VALUES ('3', '1', '9', '0.00', '2021-10-18', '1', null, 'chunheng', '2021-10-28 21:36:30.000000', 'all', '2021-10-28', 'chunheng', 'all');
INSERT INTO `sender_base_price` VALUES ('4', '1', '5', '1.00', '2021-10-18', '1', null, 'admin@gmail.com', '2021-10-25 19:52:13.917567', '', '2021-10-19', 'admin@gmail.com', 'all');
INSERT INTO `sender_base_price` VALUES ('5', '1', '1', '0.80', '2021-10-18', '1', null, 'admin@gmail.com', '2021-10-25 19:52:13.917567', '', '2021-10-21', 'admin@gmail.com', 'all');

-- ----------------------------
-- Table structure for `sender_business_types`
-- ----------------------------
DROP TABLE IF EXISTS `sender_business_types`;
CREATE TABLE `sender_business_types` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `business_type` varchar(150) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sender_business_types
-- ----------------------------
INSERT INTO `sender_business_types` VALUES ('1', 'Cosmetics');
INSERT INTO `sender_business_types` VALUES ('2', 'Food and Suplements');
INSERT INTO `sender_business_types` VALUES ('3', 'Fashion and Clothing');
INSERT INTO `sender_business_types` VALUES ('4', 'Foods and Beverage');
INSERT INTO `sender_business_types` VALUES ('5', 'Electronics');
INSERT INTO `sender_business_types` VALUES ('6', 'Phone and Accessories');

-- ----------------------------
-- Table structure for `sender_code_control`
-- ----------------------------
DROP TABLE IF EXISTS `sender_code_control`;
CREATE TABLE `sender_code_control` (
  `branch_id` int(10) NOT NULL,
  `last_sender_number` int(10) NOT NULL,
  `prefix` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sender_code_control
-- ----------------------------
INSERT INTO `sender_code_control` VALUES ('1', '34', null);

-- ----------------------------
-- Table structure for `sender_cod_charges`
-- ----------------------------
DROP TABLE IF EXISTS `sender_cod_charges`;
CREATE TABLE `sender_cod_charges` (
  `sender_id` int(10) NOT NULL,
  `cod_fee_percent` decimal(10,2) NOT NULL COMMENT 'cod_fee_percent = normally 0.05% percentage of package price',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `update_user` varchar(50) NOT NULL,
  `update_date` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `never_expires` tinyint(6) NOT NULL DEFAULT 0,
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `delivery_type` varchar(20) DEFAULT NULL,
  `remarks` varchar(150) DEFAULT NULL,
  `create_user` varchar(35) DEFAULT NULL,
  `create_date` timestamp(6) NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sender_cod_charges
-- ----------------------------

-- ----------------------------
-- Table structure for `sender_exchange_rates`
-- ----------------------------
DROP TABLE IF EXISTS `sender_exchange_rates`;
CREATE TABLE `sender_exchange_rates` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `sender_id` int(10) NOT NULL,
  `branch_id` int(10) NOT NULL,
  `buy_rate` decimal(10,4) NOT NULL,
  `sell_rate` decimal(10,4) NOT NULL,
  `x_month` int(10) NOT NULL DEFAULT 0,
  `create_user` varchar(35) DEFAULT NULL,
  `create_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sender_exchange_rates
-- ----------------------------

-- ----------------------------
-- Table structure for `sender_price_list`
-- ----------------------------
DROP TABLE IF EXISTS `sender_price_list`;
CREATE TABLE `sender_price_list` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `sender_id` int(10) NOT NULL,
  `price_per_kg` decimal(10,2) NOT NULL,
  `start_kg` decimal(10,2) NOT NULL,
  `end_kg` decimal(10,2) NOT NULL,
  `zone_code` varchar(15) NOT NULL DEFAULT '',
  `branch_id` int(10) NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `base_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `delivery_type` varchar(25) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `never_expires` tinyint(6) DEFAULT 1,
  `price_option` varchar(15) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `create_date` timestamp(6) NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sender_price_list
-- ----------------------------
INSERT INTO `sender_price_list` VALUES ('1', '4', '0.00', '0.00', '3.50', 'TTP', '1', '1.50', '0.00', 'Normal', '2021-10-16', null, '1', 'fixed', 'admin@gmail.com', '2021-10-17 11:17:13.000000');
INSERT INTO `sender_price_list` VALUES ('2', '4', '0.00', '0.00', '3.50', 'TTP', '1', '1.50', '0.00', 'Fast', '2021-10-16', null, '1', 'fixed', 'admin@gmail.com', '2021-10-17 11:17:37.000000');
INSERT INTO `sender_price_list` VALUES ('3', '4', '0.00', '0.00', '3.50', 'all', '1', '1.50', '0.00', 'Fast', '2021-10-16', null, '1', 'fixed', 'admin@gmail.com', '2021-10-17 11:18:00.000000');
INSERT INTO `sender_price_list` VALUES ('7', '4', '0.00', '0.00', '3.50', 'BKK', '1', '1.20', '0.00', 'Normal', '2021-10-16', null, '1', 'fixed', 'admin@gmail.com', '2021-10-17 11:49:23.000000');
INSERT INTO `sender_price_list` VALUES ('8', '4', '0.00', '0.00', '3.50', 'BKK', '1', '1.20', '0.00', 'Fast', '2021-10-16', null, '1', 'fixed', 'admin@gmail.com', '2021-10-17 11:52:45.000000');
INSERT INTO `sender_price_list` VALUES ('9', '4', '0.00', '0.00', '3.50', 'BKK', '1', '1.20', '0.00', 'Fast', '2021-10-16', null, '1', 'fixed', 'admin@gmail.com', '2021-10-17 11:53:14.000000');
INSERT INTO `sender_price_list` VALUES ('10', '4', '0.00', '0.00', '3.50', 'BKK', '1', '1.20', '0.00', 'Fast', '2021-10-16', null, '1', 'fixed', 'admin@gmail.com', '2021-10-17 11:53:33.000000');
INSERT INTO `sender_price_list` VALUES ('11', '4', '0.00', '0.00', '3.50', 'BKK', '1', '1.30', '0.00', 'Normal', '2021-10-16', null, '1', 'fixed', 'admin@gmail.com', '2021-10-17 12:05:52.000000');
INSERT INTO `sender_price_list` VALUES ('12', '4', '0.00', '0.00', '3.50', 'all', '1', '1.50', '0.00', 'Fast', '2021-10-16', null, '1', 'fixed', 'admin@gmail.com', '2021-10-17 12:06:28.000000');
INSERT INTO `sender_price_list` VALUES ('13', '4', '0.00', '0.00', '3.50', 'all', '1', '1.50', '0.00', 'Fast', '2021-10-16', null, '1', 'fixed', 'admin@gmail.com', '2021-10-17 12:06:34.000000');
INSERT INTO `sender_price_list` VALUES ('15', '4', '0.00', '0.00', '2.00', 'all', '1', '1.50', '0.00', 'Normal', '2021-10-19', null, '1', 'fixed', 'admin@gmail.com', '2021-10-20 07:42:16.000000');
INSERT INTO `sender_price_list` VALUES ('16', '4', '0.15', '3.50', '8.00', 'all', '1', '2.00', '0.00', 'Normal', '2021-10-28', null, '1', 'per_kg', 'chunheng', '2021-10-28 22:40:25.000000');
INSERT INTO `sender_price_list` VALUES ('17', '4', '0.00', '0.00', '2.00', 'CHK1', '1', '1.50', '0.00', 'Fast', '2021-10-17', null, '1', 'fixed', 'admin@gmail.com', '2021-10-18 00:35:21.000000');
INSERT INTO `sender_price_list` VALUES ('19', '4', '0.00', '0.00', '3.00', 'BKK', '1', '0.00', '2.00', 'Fast', '2021-10-28', null, '1', 'fixed', 'chunheng', '2021-10-28 22:33:19.000000');
INSERT INTO `sender_price_list` VALUES ('20', '4', '0.15', '3.00', '5.00', 'BKK', '1', '0.00', '2.00', 'Fast', '2021-10-28', null, '1', 'per_kg', 'chunheng', '2021-10-28 22:34:42.000000');
INSERT INTO `sender_price_list` VALUES ('21', '5', '0.00', '0.00', '3.00', 'BKK', '1', '0.00', '1.00', 'Normal', '2021-10-28', null, '1', 'fixed', 'chunheng', '2021-10-28 22:58:01.000000');
INSERT INTO `sender_price_list` VALUES ('22', '5', '0.00', '0.00', '3.00', 'CHK1', '1', '0.00', '1.00', 'Normal', '2021-10-28', null, '1', 'fixed', 'chunheng', '2021-10-28 22:58:23.000000');
INSERT INTO `sender_price_list` VALUES ('23', '10', '0.00', '-1.00', '0.00', 'BKK', '1', '1.00', '1.00', 'Normal', '2021-10-29', null, '1', 'fixed', 'admin@gmail.com', '2021-10-29 21:41:27.000000');
INSERT INTO `sender_price_list` VALUES ('24', '6', '0.00', '0.00', '3.00', 'all', '1', '0.00', '1.20', 'Normal', '2021-10-29', null, '1', 'per_kg', 'admin@gmail.com', '2021-10-30 01:54:32.000000');
INSERT INTO `sender_price_list` VALUES ('25', '6', '0.16', '3.00', '-1.00', 'all', '1', '0.00', '1.20', 'Normal', '2021-10-29', null, '1', 'per_kg', 'admin@gmail.com', '2021-10-30 01:54:59.000000');
INSERT INTO `sender_price_list` VALUES ('26', '6', '0.00', '0.00', '3.00', 'TTP', '1', '0.00', '1.10', 'Normal', '2021-10-29', null, '1', 'per_kg', 'admin@gmail.com', '2021-10-30 03:07:32.000000');
INSERT INTO `sender_price_list` VALUES ('27', '6', '0.15', '3.00', '0.00', 'TTP', '1', '0.15', '1.20', 'Normal', '2021-10-29', null, '1', 'per_kg', 'admin@gmail.com', '2021-10-30 03:14:35.000000');
INSERT INTO `sender_price_list` VALUES ('28', '5', '0.40', '-1.00', '0.00', 'BKK', '1', '0.00', '1.00', 'Normal', '2021-11-05', null, '1', 'per_kg', 'Sopha', '2021-11-06 11:18:58.000000');
INSERT INTO `sender_price_list` VALUES ('29', '27', '0.00', '-1.00', '3.00', 'BKK001', '1', '0.00', '1.00', 'Normal', '2021-11-06', null, '1', 'fixed', 'Sopha', '2021-11-07 06:29:13.000000');
INSERT INTO `sender_price_list` VALUES ('30', '27', '0.12', '3.00', '-1.00', 'BKK001', '1', '0.00', '1.00', 'Normal', '2021-11-06', null, '1', 'per_kg', 'Sopha', '2021-11-07 06:30:13.000000');

-- ----------------------------
-- Table structure for `sender_statuses`
-- ----------------------------
DROP TABLE IF EXISTS `sender_statuses`;
CREATE TABLE `sender_statuses` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `code` varchar(20) NOT NULL,
  `name` varchar(35) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sender_statuses
-- ----------------------------
INSERT INTO `sender_statuses` VALUES ('1', 'Active', 'Active');
INSERT INTO `sender_statuses` VALUES ('2', 'Inactive', 'Inactive');

-- ----------------------------
-- Table structure for `sender_type`
-- ----------------------------
DROP TABLE IF EXISTS `sender_type`;
CREATE TABLE `sender_type` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sender_type
-- ----------------------------
INSERT INTO `sender_type` VALUES ('1', '1', 'VIP');
INSERT INTO `sender_type` VALUES ('2', '1', 'Normal');

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
  `key` varchar(20) NOT NULL,
  `value` varchar(200) DEFAULT NULL,
  `description` varchar(150) DEFAULT NULL,
  `category` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of settings_string
-- ----------------------------
INSERT INTO `settings_string` VALUES ('1', '1', 'TRACK_PREFIX', 'BR', 'Prefix of tracking number', null);
INSERT INTO `settings_string` VALUES ('2', '0', '', null, null, null);
INSERT INTO `settings_string` VALUES ('3', '1', 'number', '0', '', null);
INSERT INTO `settings_string` VALUES ('4', '1', 'number', '0', '', null);
INSERT INTO `settings_string` VALUES ('5', '1', 'number', '0.07', null, null);
INSERT INTO `settings_string` VALUES ('6', '1', 'number', '0.07', null, null);
INSERT INTO `settings_string` VALUES ('7', '1', 'PICKUP_CMM_TYPE', 'per_pickup', null, null);
INSERT INTO `settings_string` VALUES ('8', '1', 'DELIVERY_CMM_TYPE', 'per_item', null, null);
INSERT INTO `settings_string` VALUES ('9', '1', 'OTP_SMS_TEMPLATE', 'លេខសម្ងាត់សំរាប់ការចុះឈ្មោះ​ #', null, null);

-- ----------------------------
-- Table structure for `slides`
-- ----------------------------
DROP TABLE IF EXISTS `slides`;
CREATE TABLE `slides` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of slides
-- ----------------------------

-- ----------------------------
-- Table structure for `status_history`
-- ----------------------------
DROP TABLE IF EXISTS `status_history`;
CREATE TABLE `status_history` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `status` varchar(50) NOT NULL,
  `change_date` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of status_history
-- ----------------------------

-- ----------------------------
-- Table structure for `temp_otp`
-- ----------------------------
DROP TABLE IF EXISTS `temp_otp`;
CREATE TABLE `temp_otp` (
  `branch_id` int(10) NOT NULL,
  `app_id` varchar(50) NOT NULL,
  `phone_number` varchar(50) NOT NULL,
  `otp_code` varchar(25) NOT NULL,
  `expiry_time` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of temp_otp
-- ----------------------------
INSERT INTO `temp_otp` VALUES ('1', '38DC051E122D11EC89909801A7B0D1FCH', '012528131', '732806', '2022-02-14 00:58:09.000000');

-- ----------------------------
-- Table structure for `testtable`
-- ----------------------------
DROP TABLE IF EXISTS `testtable`;
CREATE TABLE `testtable` (
  `create_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of testtable
-- ----------------------------
INSERT INTO `testtable` VALUES ('2022-02-20');
INSERT INTO `testtable` VALUES ('2022-02-20');
INSERT INTO `testtable` VALUES ('2022-02-20');
INSERT INTO `testtable` VALUES ('2022-02-20');

-- ----------------------------
-- Table structure for `tracking_numbers`
-- ----------------------------
DROP TABLE IF EXISTS `tracking_numbers`;
CREATE TABLE `tracking_numbers` (
  `branch_id` int(10) NOT NULL,
  `prefix` varchar(5) DEFAULT NULL,
  `last_number` bigint(10) NOT NULL DEFAULT 0,
  PRIMARY KEY (`branch_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tracking_numbers
-- ----------------------------

-- ----------------------------
-- Table structure for `trip_num_control`
-- ----------------------------
DROP TABLE IF EXISTS `trip_num_control`;
CREATE TABLE `trip_num_control` (
  `branch_id` int(10) NOT NULL,
  `last_trip_number` int(10) NOT NULL,
  `prefix` varchar(10) DEFAULT NULL,
  `op_year` int(10) NOT NULL,
  `op_month` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of trip_num_control
-- ----------------------------
INSERT INTO `trip_num_control` VALUES ('1', '5', null, '2021', '11');
INSERT INTO `trip_num_control` VALUES ('1', '22', null, '2021', '12');
INSERT INTO `trip_num_control` VALUES ('1', '10', null, '2022', '3');

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
INSERT INTO `um_applications` VALUES ('DFB15FKAEEC611EG2E7C9801A7CXD1HK', 'DMS', 'DMS');
INSERT INTO `um_applications` VALUES ('38DC051E122D11EC89909801A7B0D1FCH', 'Merchant App', 'Merchant App');
INSERT INTO `um_applications` VALUES ('584C7FF2122D11EC89909801A8B0D7XKD', 'Driver App', 'Driver App');

-- ----------------------------
-- Table structure for `um_app_modules`
-- ----------------------------
DROP TABLE IF EXISTS `um_app_modules`;
CREATE TABLE `um_app_modules` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `app_id` varchar(50) DEFAULT NULL,
  `ref_code` varchar(20) DEFAULT '',
  `module_name` varchar(150) NOT NULL,
  `module_name_native` varchar(150) DEFAULT NULL,
  `icon_image` varchar(100) DEFAULT '',
  `target_url` varchar(150) DEFAULT NULL,
  `hidden` tinyint(6) NOT NULL DEFAULT 0,
  `disabled` tinyint(6) NOT NULL DEFAULT 0,
  `display_order` int(10) DEFAULT NULL,
  `branch_id` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of um_app_modules
-- ----------------------------
INSERT INTO `um_app_modules` VALUES ('1', 'DFB15FKAEEC611EG2E7C9801A7CXD1HK', 'UMT', 'User Management', 'User Management', 'user.png', '/MainController/ClassManagementK12', '0', '0', '1', '1');
INSERT INTO `um_app_modules` VALUES ('2', 'DFB15FKAEEC611EG2E7C9801A7CXD1HK', 'PKR', 'Pickup Requests', 'Pickup Requests', '', '', '0', '0', '1', '1');
INSERT INTO `um_app_modules` VALUES ('3', 'DFB15FKAEEC611EG2E7C9801A7CXD1HK', 'DMT', 'Deliveries', 'Deliveries', '', '', '0', '0', '2', '1');
INSERT INTO `um_app_modules` VALUES ('4', 'DFB15FKAEEC611EG2E7C9801A7CXD1HK', 'FDM', 'Failed Deliveries', 'Failed Deliveries', '', '', '0', '0', '4', '1');
INSERT INTO `um_app_modules` VALUES ('5', 'DFB15FKAEEC611EG2E7C9801A7CXD1HK', 'BNP', 'Billing and Payments', 'Billing and Payments', 'shop.png', '', '0', '0', '5', '1');
INSERT INTO `um_app_modules` VALUES ('6', 'DFB15FKAEEC611EG2E7C9801A7CXD1HK', 'DRM', 'Driver Management', 'Driver Management', 'shop.png', '', '1', '1', '6', '1');
INSERT INTO `um_app_modules` VALUES ('7', 'DFB15FKAEEC611EG2E7C9801A7CXD1HK', 'MMT', 'Merchant Management', 'Merchant Management', 'users.png', '', '0', '0', '7', '1');
INSERT INTO `um_app_modules` VALUES ('8', 'DFB15FKAEEC611EG2E7C9801A7CXD1HK', 'SMT', 'Settings', 'Settings', 'settings.png', '', '0', '0', '8', '1');

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
INSERT INTO `um_branches` VALUES ('1', 'Dolgoal Co., Ltd', 'ក្រុមហ៊ុនដឹកជញ្ជូន ដល់ហ្គោល', 'E:\\LaravelApps\\DMS\\public/uploads/public/1_data/general/1_logo_20220301_100356.jpg', 'jpg', '#458 Street 24BT Sangkat Boeung Tompon Khan Meanchey Phnom Penh Cambodia', '011 657985', 'Lim Vannak', null, '០093 488777', null, null, null, null, 'ផ្ទះលេខ៤៥៨ ផ្លូវ២៤BT សង្កាត់បឹងទំពន់ ខណ្ឌមានជ័យ រាធធានីភ្នំពេញ', 'dolgoalgmailcom', 'admin@gmail.com', '2022-03-01 22:23:56.406102', 'www.broexpress.com');

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
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of um_permissions
-- ----------------------------
INSERT INTO `um_permissions` VALUES ('1', 'Create application user', '7', 'DFB15DEAEEC611EB9E8C9801A7B0D1FC');
INSERT INTO `um_permissions` VALUES ('8', 'Delete application user', '7', 'DFB15DEAEEC611EB9E8C9801A7B0D1FC');
INSERT INTO `um_permissions` VALUES ('9', 'Create role', '7', 'DFB15DEAEEC611EB9E8C9801A7B0D1FC');
INSERT INTO `um_permissions` VALUES ('10', 'Assign user role', '7', 'DFB15DEAEEC611EB9E8C9801A7B0D1FC');
INSERT INTO `um_permissions` VALUES ('11', 'Delete role', '7', 'DFB15DEAEEC611EB9E8C9801A7B0D1FC');
INSERT INTO `um_permissions` VALUES ('12', 'Edit role', '7', 'DFB15DEAEEC611EB9E8C9801A7B0D1FC');
INSERT INTO `um_permissions` VALUES ('13', 'Assign accessible module', '7', 'DFB15DEAEEC611EB9E8C9801A7B0D1FC');
INSERT INTO `um_permissions` VALUES ('14', 'Remove accessible module', '7', 'DFB15DEAEEC611EB9E8C9801A7B0D1FC');
INSERT INTO `um_permissions` VALUES ('15', 'Add role permission', '7', 'DFB15DEAEEC611EB9E8C9801A7B0D1FC');
INSERT INTO `um_permissions` VALUES ('16', 'Create new student', '2', 'DFB15DEAEEC611EB9E8C9801A7B0D1FC');
INSERT INTO `um_permissions` VALUES ('17', 'Create Student Group', '1', 'DFB15DEAEEC611EB9E8C9801A7B0D1FC');
INSERT INTO `um_permissions` VALUES ('18', 'Delete Student Group', '1', 'DFB15DEAEEC611EB9E8C9801A7B0D1FC');
INSERT INTO `um_permissions` VALUES ('19', 'Create classes for Student Group', '1', 'DFB15DEAEEC611EB9E8C9801A7B0D1FC');
INSERT INTO `um_permissions` VALUES ('20', 'Create curriculum', '1', 'DFB15DEAEEC611EB9E8C9801A7B0D1FC');
INSERT INTO `um_permissions` VALUES ('21', 'Add students to Group', '1', 'DFB15DEAEEC611EB9E8C9801A7B0D1FC');
INSERT INTO `um_permissions` VALUES ('22', 'Remove students from Group', '1', 'DFB15DEAEEC611EB9E8C9801A7B0D1FC');
INSERT INTO `um_permissions` VALUES ('23', 'Create new rooms', '1', 'DFB15DEAEEC611EB9E8C9801A7B0D1FC');
INSERT INTO `um_permissions` VALUES ('24', 'Delete rooms', '1', 'DFB15DEAEEC611EB9E8C9801A7B0D1FC');
INSERT INTO `um_permissions` VALUES ('25', 'Modify room details', '1', 'DFB15DEAEEC611EB9E8C9801A7B0D1FC');
INSERT INTO `um_permissions` VALUES ('26', 'Create Scheduling Master Data', '1', 'DFB15DEAEEC611EB9E8C9801A7B0D1FC');
INSERT INTO `um_permissions` VALUES ('27', 'Delete Scheduling Master Data', '6', 'DFB15DEAEEC611EB9E8C9801A7B0D1FC');
INSERT INTO `um_permissions` VALUES ('28', 'Modify class schedule', '1', 'DFB15DEAEEC611EB9E8C9801A7B0D1FC');
INSERT INTO `um_permissions` VALUES ('29', 'Add and remove charge fees   ', '3', 'DFB15DEAEEC611EB9E8C9801A7B0D1FC');
INSERT INTO `um_permissions` VALUES ('30', 'View Cashier Reports', '3', 'DFB15DEAEEC611EB9E8C9801A7B0D1FC');
INSERT INTO `um_permissions` VALUES ('31', 'View cashier UNPAID reports', '3', 'DFB15DEAEEC611EB9E8C9801A7B0D1FC');
INSERT INTO `um_permissions` VALUES ('32', 'View cashier Payment History reports', '3', 'DFB15DEAEEC611EB9E8C9801A7B0D1FC');
INSERT INTO `um_permissions` VALUES ('33', 'View cashier CANCELED payment reports', '3', 'DFB15DEAEEC611EB9E8C9801A7B0D1FC');
INSERT INTO `um_permissions` VALUES ('34', 'edit payment amount list Need clarification', '3', 'DFB15DEAEEC611EB9E8C9801A7B0D1FC');
INSERT INTO `um_permissions` VALUES ('35', 'Receive tuition payment', '3', 'DFB15DEAEEC611EB9E8C9801A7B0D1FC');
INSERT INTO `um_permissions` VALUES ('36', 'Change login name for users', '7', 'DFB15DEAEEC611EB9E8C9801A7B0D1FC');
INSERT INTO `um_permissions` VALUES ('37', 'Edit student profile', '2', 'DFB15DEAEEC611EB9E8C9801A7B0D1FC');
INSERT INTO `um_permissions` VALUES ('38', 'Delete student profile', '2', 'DFB15DEAEEC611EB9E8C9801A7B0D1FC');
INSERT INTO `um_permissions` VALUES ('39', 'Create user', '1', 'DFB15FKAEEC611EG2E7C9801A7CXD1HK');

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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of um_roles
-- ----------------------------
INSERT INTO `um_roles` VALUES ('DFB15FKAEEC611EG2E7C9801A7CXD1HK', '1', 'Admins', '1', null, '2021-09-11 09:54:38', 'admin_support');
INSERT INTO `um_roles` VALUES ('DFB15FKAEEC611EG2E7C9801A7CXD1HK', '7', 'HR Officers', '1', null, '2021-09-11 09:52:44', 'admin_support');
INSERT INTO `um_roles` VALUES ('DFB15FKAEEC611EG2E7C9801A7CXD1HK', '13', 'Drivers', '1', 'admin@gmail.com', '2021-09-11 02:54:18', 'driver');
INSERT INTO `um_roles` VALUES ('DFB15FKAEEC611EG2E7C9801A7CXD1HK', '14', 'Merchant', '1', 'admin@gmail.com', '2021-09-11 04:21:22', 'merchant');

-- ----------------------------
-- Table structure for `um_role_modules`
-- ----------------------------
DROP TABLE IF EXISTS `um_role_modules`;
CREATE TABLE `um_role_modules` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `role_id` int(10) NOT NULL,
  `module_id` int(10) NOT NULL,
  `branch_id` int(10) NOT NULL,
  `module_code` varchar(20) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of um_role_modules
-- ----------------------------
INSERT INTO `um_role_modules` VALUES ('2', '13', '3', '1', null);
INSERT INTO `um_role_modules` VALUES ('5', '6', '6', '1', null);
INSERT INTO `um_role_modules` VALUES ('6', '6', '8', '1', null);
INSERT INTO `um_role_modules` VALUES ('10', '5', '5', '1', null);
INSERT INTO `um_role_modules` VALUES ('11', '5', '3', '1', null);
INSERT INTO `um_role_modules` VALUES ('12', '6', '2', '1', null);
INSERT INTO `um_role_modules` VALUES ('13', '6', '7', '1', null);
INSERT INTO `um_role_modules` VALUES ('16', '8', '5', '1', null);
INSERT INTO `um_role_modules` VALUES ('17', '8', '8', '1', null);
INSERT INTO `um_role_modules` VALUES ('22', '13', '6', '1', null);
INSERT INTO `um_role_modules` VALUES ('23', '1', '6', '1', 'BSM');
INSERT INTO `um_role_modules` VALUES ('24', '1', '4', '1', 'HRM');
INSERT INTO `um_role_modules` VALUES ('26', '1', '5', '1', 'PRM');
INSERT INTO `um_role_modules` VALUES ('27', '1', '1', '1', 'SMK12');
INSERT INTO `um_role_modules` VALUES ('28', '1', '8', '1', 'SM');
INSERT INTO `um_role_modules` VALUES ('29', '1', '2', '1', 'SRM');
INSERT INTO `um_role_modules` VALUES ('30', '1', '7', '1', 'UM');
INSERT INTO `um_role_modules` VALUES ('34', '7', '5', '1', 'PRM');
INSERT INTO `um_role_modules` VALUES ('35', '7', '6', '1', 'BSM');
INSERT INTO `um_role_modules` VALUES ('36', '7', '2', '1', 'PKR');
INSERT INTO `um_role_modules` VALUES ('37', '7', '1', '1', 'UMT');
INSERT INTO `um_role_modules` VALUES ('38', '7', '8', '1', 'SMT');
INSERT INTO `um_role_modules` VALUES ('39', '7', '3', '1', 'DMT');

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
) ENGINE=InnoDB AUTO_INCREMENT=127 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of um_role_permissions
-- ----------------------------
INSERT INTO `um_role_permissions` VALUES ('30', '10', '1', '1');
INSERT INTO `um_role_permissions` VALUES ('42', '21', '1', '1');
INSERT INTO `um_role_permissions` VALUES ('45', '24', '1', '1');
INSERT INTO `um_role_permissions` VALUES ('46', '25', '1', '1');
INSERT INTO `um_role_permissions` VALUES ('48', '27', '1', '1');
INSERT INTO `um_role_permissions` VALUES ('49', '28', '1', '1');
INSERT INTO `um_role_permissions` VALUES ('71', '1', '1', '1');
INSERT INTO `um_role_permissions` VALUES ('72', '9', '1', '1');
INSERT INTO `um_role_permissions` VALUES ('73', '14', '1', '1');
INSERT INTO `um_role_permissions` VALUES ('74', '16', '1', '1');
INSERT INTO `um_role_permissions` VALUES ('75', '17', '1', '1');
INSERT INTO `um_role_permissions` VALUES ('76', '19', '1', '1');
INSERT INTO `um_role_permissions` VALUES ('77', '20', '1', '1');
INSERT INTO `um_role_permissions` VALUES ('78', '22', '1', '1');
INSERT INTO `um_role_permissions` VALUES ('79', '23', '1', '1');
INSERT INTO `um_role_permissions` VALUES ('81', '29', '1', '1');
INSERT INTO `um_role_permissions` VALUES ('87', '35', '1', '1');
INSERT INTO `um_role_permissions` VALUES ('91', '36', '1', '1');
INSERT INTO `um_role_permissions` VALUES ('92', '12', '1', '1');
INSERT INTO `um_role_permissions` VALUES ('94', '10', '5', '1');
INSERT INTO `um_role_permissions` VALUES ('96', '30', '5', '1');
INSERT INTO `um_role_permissions` VALUES ('97', '31', '5', '1');
INSERT INTO `um_role_permissions` VALUES ('98', '32', '5', '1');
INSERT INTO `um_role_permissions` VALUES ('99', '33', '5', '1');
INSERT INTO `um_role_permissions` VALUES ('103', '15', '5', '1');
INSERT INTO `um_role_permissions` VALUES ('104', '21', '5', '1');
INSERT INTO `um_role_permissions` VALUES ('105', '29', '5', '1');
INSERT INTO `um_role_permissions` VALUES ('107', '12', '13', '1');
INSERT INTO `um_role_permissions` VALUES ('108', '37', '1', '1');
INSERT INTO `um_role_permissions` VALUES ('109', '38', '1', '1');
INSERT INTO `um_role_permissions` VALUES ('111', '31', '7', '1');
INSERT INTO `um_role_permissions` VALUES ('113', '33', '7', '1');
INSERT INTO `um_role_permissions` VALUES ('114', '30', '1', '1');
INSERT INTO `um_role_permissions` VALUES ('115', '31', '1', '1');
INSERT INTO `um_role_permissions` VALUES ('116', '32', '1', '1');
INSERT INTO `um_role_permissions` VALUES ('117', '33', '1', '1');
INSERT INTO `um_role_permissions` VALUES ('126', '39', '7', '1');

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
  `session_id` varchar(50) DEFAULT NULL,
  `csrf_code` varchar(50) DEFAULT NULL,
  `access_token` varchar(50) DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL COMMENT 'status ={online,offline}',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1140 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of um_sessions
-- ----------------------------
INSERT INTO `um_sessions` VALUES ('197', '1', 'DFB15FKAEEC611EG2E7C9801A7CXD1HK', 'samsethy1', '4', '2021-09-10 23:59:17', '2021-09-10 23:59:17', 'UNZNry9u17ZbSMUYgT9sd9UxRCTcZFNzGsLQ56', '8Vz1KHME8wmmWm6DHLeDRkyspc8SRlZvQzesuc', 'YsLT9quYd78Ihp9zZimUp99S8mV8h75RJ7c1bW', null);
INSERT INTO `um_sessions` VALUES ('221', '1', 'DFB15FKAEEC611EG2E7C9801A7CXD1HK', '012528131', '5', '2021-09-12 13:59:56', '2021-09-12 13:59:56', '19092kEq8j8s57JQ6YCcNa88GFSltTcjH8O3qy', 'RC3L3x4h8f936SDVM7arFvVNBXmCmH8xONDH4k', 'u7UBa96cX3K78HK9G4oZg9UJU69ca7yJ1neabL', null);
INSERT INTO `um_sessions` VALUES ('447', '1', '584C7FF2122D11EC89909801A8B0D7XKD', '02356767', '18', '2021-10-27 20:17:34', '2021-10-27 20:17:34', 'QlFwEPLyD3Y0h5VWPFW8e69gzr0kHT7q4QV4z3', '8KGchrebkAMuLSRuoO91L3Uj15EsosY8GfiF9B', 'm3AMr02oaJCYAVM077Xh9P23kT1gJoe7lZ7eUY', null);
INSERT INTO `um_sessions` VALUES ('622', '1', '38DC051E122D11EC89909801A7B0D1FCH', '012333222', '33', '2021-11-29 05:03:29', '2021-11-29 05:03:29', 'L44538vGoTAeEjHpb4Jt5BfWzGwuFPLQL10bDK', 'XoUy9Ef4eoqMf71tBBWR8A9mHSYCSra1C4n66W', 'hO91HWFsYcFhOAbXfpv2TGsMM9nqvPsuPHzpd6', null);
INSERT INTO `um_sessions` VALUES ('630', '1', '38DC051E122D11EC89909801A7B0D1FCH', '012555777', '34', '2021-11-29 20:42:40', '2021-11-29 20:42:40', 'oULYjZ33S8EfQljE5OW9y8XAb6QzjRU4P7u7rP', 'DOffP3m66I497B4n9q2oYunUMLaiscKf1twPB2', '7nPOBVDwB96wVpeYtgSR4L47jVgTZD24F4XzTk', null);
INSERT INTO `um_sessions` VALUES ('632', '1', 'DFB15FKAEEC611EG2E7C9801A7CXD1HK', 'chunheng', '31', '2021-11-30 00:40:29', '2021-11-30 00:40:29', 'w2YGKpoveN3cxkUe3SfSbxo7S78sZNX5gF5C89', '2t1SwWK0uffkLmdspnMw9RhfeMlTusoK0i73e1', '01niQKGVVWgz95x2O5zhR3MahsHsXfUyGo24EC', null);
INSERT INTO `um_sessions` VALUES ('669', '1', '38DC051E122D11EC89909801A7B0D1FCH', '017777888', '35', '2021-12-05 23:40:16', '2021-12-05 23:40:16', 'r1Ee44MaoW7aB3NeL7Jb4kXCre0JKKl8gs26lu', 'FHbYJD8ZR68FC933qjxD75uPqwkwmFluJG0jy9', 'Q5TGCj9tc182DLEFOw7874BHVuBBhfC59G4iTC', null);
INSERT INTO `um_sessions` VALUES ('961', '1', '38DC051E122D11EC89909801A7B0D1FCH', '0967174940', '17', '2022-02-14 21:27:53', '2022-02-14 21:27:53', 'Rh6gy6cW5Vp686t89sEhHhAHjC4AhI3H92IQom', '5epwLSwM7xbgm6azvXz9DGVhIcN129z24I5Tpf', 'q0Q2YAN4H26ZARSqHrSueBVtPsm8CJAuZbNO48', null);
INSERT INTO `um_sessions` VALUES ('990', '1', '38DC051E122D11EC89909801A7B0D1FCH', '010989805', '62', '2022-02-18 09:36:58', '2022-02-18 09:36:58', '0kP432GFIH6RRH35Cf0DveStwLTzNT1ZNmw4tW', '78ZI1xC7XE37AwxnKSI93Zn7w1GLrl21glyg0F', 'OLE9V9oz02c9sMK2JZV69D6DaZpzHGbA1QYE75', null);
INSERT INTO `um_sessions` VALUES ('1035', '1', '38DC051E122D11EC89909801A7B0D1FCH', '0885858586', '63', '2022-02-22 10:00:02', '2022-02-22 10:00:02', 'ons83iF3E4PA2ZMysPPluBuhJf62SJ4JVk9DEV', 'ZHRQRvNj4v2fZgMQJ2AmgLZzkWo9XZ7l6iA56s', '2V7jS1QDTKBm3r71242lkYvdD6or1NqcO63mVl', null);
INSERT INTO `um_sessions` VALUES ('1100', '1', 'DFB15FKAEEC611EG2E7C9801A7CXD1HK', 'samsethy', '41', '2022-03-04 17:00:09', '2022-03-04 17:00:09', '9Npz141j544CHqHMtxEq1J22o4buJHL69dNA0x', 'rg5B62PhJG9tPcfFzL59ka1xZQ5AWUuhEnJATc', '0ra2nz7V8q9Vu1UI496j513fqQPT4VCAk59GOU', null);
INSERT INTO `um_sessions` VALUES ('1113', '1', '38DC051E122D11EC89909801A7B0D1FCH', '010428632', '61', '2022-03-05 11:36:29', '2022-03-05 11:36:29', 'WYt2OwOdqVj2gnvj7b654YqadY2GQD3kMQ7qjW', '1Wk4BeI0qSCM1D8vp9smlqu34o56kowuit8JzN', 'X1TIvoR8Wr2Mpq4h226LDboj478Bp6O560Wy2i', null);
INSERT INTO `um_sessions` VALUES ('1131', '1', '584C7FF2122D11EC89909801A8B0D7XKD', '010428632', '35', '2022-03-06 18:02:00', '2022-03-06 18:02:00', 'g1a5H0a8kToz7KNFwAuhrxOn7J3659HH0DHx89', 'CU79Ng4Au9QMTvcx14Roxx7KbVXYqMvoV9WAIs', '4J4K9cwGMz9Cvu88v1Ywy8699XkLF2lZZuqS9W', null);
INSERT INTO `um_sessions` VALUES ('1132', '1', '38DC051E122D11EC89909801A7B0D1FCH', '012555771', '37', '2022-03-06 18:43:16', '2022-03-06 18:43:16', 'SOU2R7qJE1tytr8R6zolgoC42Wr3s6UCHj2SJX', 'm3b0KB2ckpLR9MZDZgH6bu2l06AzZ4LJ5028vs', '1yYD7Db24rtG8xoP4x8nO2eaGJlb344x7dLdMB', null);
INSERT INTO `um_sessions` VALUES ('1134', '1', '38DC051E122D11EC89909801A7B0D1FCH', '016285878', '64', '2022-03-06 19:13:25', '2022-03-06 19:13:25', 'HlIi0f6yJNipL3ZJ6R7ee2b54i78lq92A9wxER', 'tjdgRtQG4Rbh3Z6pPuzD7LF9oujEfh7Aa2APmo', '91JQPDYpKfVIbthv6KaXFTincCUXvX6kNeEh0v', null);
INSERT INTO `um_sessions` VALUES ('1137', '1', '584C7FF2122D11EC89909801A8B0D7XKD', '081802428', '65', '2022-03-07 10:05:02', '2022-03-07 10:05:02', 'B3HovDEZFCCM7b3NMHX666XCr1JIc9o1KHHY7z', 'dxkd11XZrbjo35I6VKyQX87A4fdFtta8Qfko1c', 'M6qDPgWOB9QOI22xMAJpwKB8Xmeo48ATyk8XWV', null);
INSERT INTO `um_sessions` VALUES ('1139', '1', 'DFB15FKAEEC611EG2E7C9801A7CXD1HK', 'admin@gmail.com', '1', '2022-03-08 17:41:00', '2022-03-08 17:41:00', 'e1Ki62jTI37LajlHLKcUatLkQTJi8yXi8vvC1T', 'VdNdXhRIi545g4OEWECdME0VO81d29jA3KpkKA', 'sS4JM8yNjBXhUlBk7btkt3VoR9iM4Lx8mDVpVp', null);

-- ----------------------------
-- Table structure for `um_users`
-- ----------------------------
DROP TABLE IF EXISTS `um_users`;
CREATE TABLE `um_users` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `login_name` varchar(50) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
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
  `official_code` varchar(20) DEFAULT NULL,
  `work_location_id` int(10) DEFAULT NULL,
  `otp_code` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of um_users
-- ----------------------------
INSERT INTO `um_users` VALUES ('1', 'admin@gmail.com', '01257890', null, '$2y$10$9s0nFmOKK6xEc8c63nT7KeQSGb4UoUio39dTBoQKrArZ3TlRh7LYK', '2021-09-13 04:00:26.003673', 'DFB15FKAEEC611EG2E7C9801A7CXD1HK', null, '1', 'Admin', '0', 'active', 'Samsethy', null, 'admin_support', 'admin@gmail.com', '3', '2021-09-13 04:00:26', '0001', null, null);
INSERT INTO `um_users` VALUES ('16', '012567677', '02346567', 'ddgmailcom', '$2y$10$8/thDTlCF/L.ahg6jWPB2OgSY5CxwkzL9upccAEYzzxLsNJep/6le', '2021-12-02 07:03:26.262506', '38DC051E122D11EC89909801A7B0D1FCH', null, '1', 'Standard', '0', 'active', 'SOME STORE NAME', '1', 'merchant', 'admin@gmail.com', '1', '2021-12-02 07:03:26', '00001', null, null);
INSERT INTO `um_users` VALUES ('17', '0967174940', '0967174940', 'lyhuot@gmail.com', '$2y$10$riWHu0z/MKVrWk7/aA0YFOMsHfvXNRWnpYl9yFZVl0Hc3r8zVR.9C', '2021-12-02 06:50:36.053668', '38DC051E122D11EC89909801A7B0D1FCH', null, '1', 'Standard', '0', 'active', 'Ly Huot', '5', 'merchant', 'admin@gmail.com', '1', '2021-12-02 06:50:36', '0000005', null, null);
INSERT INTO `um_users` VALUES ('30', '012567878', '012567878', null, '$2y$10$YF4bIIm.3DGrnFziV975a.bgwtIk7YNGAcGXjgVPci4L/LoeoGVWW', '2021-10-20 13:22:13.911183', '38DC051E122D11EC89909801A7B0D1FCH', null, '1', 'Standard', '0', 'active', 'Samsethy', '9', 'merchant', 'admin@gmail.com', '1', '2021-10-20 13:22:13', 'BRS10004', null, null);
INSERT INTO `um_users` VALUES ('31', 'Puthea', null, null, '$2y$10$NXj3hX33srN9UB5/MhPf9./L6tkOdiMMcdVRSIdLh8giY4LSHxAcq', '2021-11-28 03:33:18.183871', 'DFB15FKAEEC611EG2E7C9801A7CXD1HK', null, '1', 'Standard', '0', 'active', 'Chunheng', null, 'admin_support', 'admin@gmail.com', '1', '2021-11-28 03:33:18', null, null, null);
INSERT INTO `um_users` VALUES ('32', 'sopha', null, null, '$2y$10$FLYjDz2HxEkWcPGsiIZH5OUtiaWbb6HvQwMd9S8aiPWZLxQAMxj2W', null, 'DFB15FKAEEC611EG2E7C9801A7CXD1HK', null, '1', 'Standard', '0', 'active', 'sopha', null, 'admin_support', 'chunheng', '31', '2021-11-05 22:53:29', null, null, null);
INSERT INTO `um_users` VALUES ('35', '010428632', '010428632', null, '$2y$10$vvYHdCxLFh79hhARv2sT2.TGPw5dCm7AYVYyhYDZp9GwV.oKqjTs.', '2022-03-06 11:06:35.236836', '584C7FF2122D11EC89909801A8B0D7XKD', null, '1', 'Standard', '0', 'active', 'Phoeun Sopha', '28', 'driver', 'admin@gmail.com', '1', '2022-02-17 03:09:55', '10002', null, null);
INSERT INTO `um_users` VALUES ('37', '012555771', '012555771', null, '$2y$10$z8yka7MYeOlmGthsN59PO.9Dyh1t/ZIrwmAquP2lODx3zorRGInja', '2021-12-02 19:29:21.458657', '38DC051E122D11EC89909801A7B0D1FCH', null, '1', 'standard', '0', 'active', 'ABC Bakery', '43', 'merchant', 'self register', null, '2021-12-02 19:29:21', '10011', null, null);
INSERT INTO `um_users` VALUES ('39', '012555666', '012555666', 'bopha@gmail.com', '$2y$10$L1HELwh4lJBVl7Rynj.dzOhNSL5XXslShaFxddWc6qFLI7eFlHMFq', null, '38DC051E122D11EC89909801A7B0D1FCH', null, '1', 'standard', '0', 'active', 'Bopha', '44', 'merchant', 'self register', null, '2021-12-02 20:06:30', '10012', null, '55');
INSERT INTO `um_users` VALUES ('40', '066999988', '066999988', 'benee@gmail.com', '$2y$10$Hw.8oeLSr/QfX7brPCHwF.o0KbpFpWrpq03I3Vt2fGm9p8ee18ZHq', null, '38DC051E122D11EC89909801A7B0D1FCH', null, '1', 'standard', '0', 'active', 'Benee', '45', 'merchant', 'self register', null, '2021-12-02 20:08:33', '10013', null, '69');
INSERT INTO `um_users` VALUES ('41', 'samsethy', null, null, '$2y$10$ke.nm3SaAKQKawZZ1Bqtr.JQwE2Nw4qxnFIKUg5Pg/GvJQzh82yau', null, 'DFB15FKAEEC611EG2E7C9801A7CXD1HK', null, '1', 'Standard', '0', 'active', 'samsethy', null, 'admin_support', 'admin@gmail.com', '1', '2021-12-04 11:15:16', null, null, null);
INSERT INTO `um_users` VALUES ('42', '+855967174940', '+855967174940', 'jackie@bro.com', '$2y$10$jvIm8W8ULtSmnuuKwUgIeeEMJBte2JQ70iUhVbEkZpZlJcw5jHxoG', null, '38DC051E122D11EC89909801A7B0D1FCH', null, '1', 'standard', '0', 'active', 'Jackie', '46', 'merchant', 'self register', null, '2021-12-07 04:41:45', '10014', null, '80');
INSERT INTO `um_users` VALUES ('45', '011657985', '011657985', null, '$2y$10$5iLt38YMxuarsMFU.cnQQuKHFe4iU7GhQQMNyKtn6uFVwUBExs3Aq', null, '38DC051E122D11EC89909801A7B0D1FCH', null, '1', 'standard', '0', 'active', 'Lim Vannak', '49', 'merchant', 'self register', null, '2021-12-07 03:01:32', '10017', null, '437088');
INSERT INTO `um_users` VALUES ('61', '010428632', '010428632', null, '$2y$10$1yTNuCYGP1JdpJvPQUW7LO.KheVEnl7.2cq1y2Wsv63aHQEuNhPh6', '2022-03-05 07:27:01.144843', '38DC051E122D11EC89909801A7B0D1FCH', null, '1', 'standard', '0', 'active', 'ME', '65', 'merchant', 'self register', null, '2021-12-07 04:41:44', '10033', null, '420781');
INSERT INTO `um_users` VALUES ('62', '010989805', '010989805', null, '$2y$10$zeHLUPUaLCg6sAEYHrVwVeLUcQWNGM0agPdaH6o/4qbNEVsm7vmJa', null, '38DC051E122D11EC89909801A7B0D1FCH', null, '1', 'Standard', '0', 'active', 'បងស្រី លីតា Lita', '33', 'merchant', 'admin@gmail.com', '1', '2022-02-17 00:19:30', '10001', null, null);
INSERT INTO `um_users` VALUES ('63', '0885858586', '0885858586', null, '$2y$10$BO.OmbR7zKo6VdGnYKD65e/ibq0t5YLuxaIm/iWkr0xL9dUlTnNXu', null, '38DC051E122D11EC89909801A7B0D1FCH', null, '1', 'Standard', '0', 'active', 'Seng Kimly', '39', 'merchant', 'admin@gmail.com', '1', '2022-02-18 11:04:50', '10007', null, null);
INSERT INTO `um_users` VALUES ('64', '016285878', '016285878', null, '$2y$10$JXR5DfckbOSLJBKv8Ly.0.SLEXjU2mWZniDyv9NQLhoj2.LsPmff6', null, '38DC051E122D11EC89909801A7B0D1FCH', null, '1', 'Standard', '0', 'active', '016285878', '66', 'merchant', 'admin@gmail.com', '1', '2022-03-06 19:13:21', '10034', null, null);
INSERT INTO `um_users` VALUES ('65', '081802428', '081802428', null, '$2y$10$VWcyKFhCIeYvgMQ9YsryFeIGFG1Tq1itzBxf/gj5z6fvyVEufhxCS', null, '584C7FF2122D11EC89909801A8B0D7XKD', null, '1', 'Standard', '0', 'active', '081802428', '31', 'driver', 'admin@gmail.com', '1', '2022-03-07 10:04:57', '10005', null, null);

-- ----------------------------
-- Table structure for `um_user_roles`
-- ----------------------------
DROP TABLE IF EXISTS `um_user_roles`;
CREATE TABLE `um_user_roles` (
  `user_id` int(10) NOT NULL,
  `role_id` int(10) NOT NULL,
  `app_id` varchar(50) NOT NULL,
  `branch_id` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of um_user_roles
-- ----------------------------
INSERT INTO `um_user_roles` VALUES ('12', '13', 'DFB15FKAEEC611EG2E7C9801A7CXD1HK', '1');
INSERT INTO `um_user_roles` VALUES ('13', '14', 'DFB15FKAEEC611EG2E7C9801A7CXD1HK', '1');
INSERT INTO `um_user_roles` VALUES ('14', '13', 'DFB15FKAEEC611EG2E7C9801A7CXD1HK', '1');
INSERT INTO `um_user_roles` VALUES ('15', '1', 'DFB15FKAEEC611EG2E7C9801A7CXD1HK', '1');
INSERT INTO `um_user_roles` VALUES ('16', '14', 'DFB15FKAEEC611EG2E7C9801A7CXD1HK', '1');
INSERT INTO `um_user_roles` VALUES ('17', '14', 'DFB15FKAEEC611EG2E7C9801A7CXD1HK', '1');
INSERT INTO `um_user_roles` VALUES ('21', '14', '38DC051E122D11EC89909801A7B0D1FCH', '1');
INSERT INTO `um_user_roles` VALUES ('22', '14', '38DC051E122D11EC89909801A7B0D1FCH', '1');
INSERT INTO `um_user_roles` VALUES ('23', '14', '38DC051E122D11EC89909801A7B0D1FCH', '1');
INSERT INTO `um_user_roles` VALUES ('18', '13', '584C7FF2122D11EC89909801A8B0D7XKD', '1');
INSERT INTO `um_user_roles` VALUES ('19', '13', '584C7FF2122D11EC89909801A8B0D7XKD', '1');
INSERT INTO `um_user_roles` VALUES ('20', '13', '584C7FF2122D11EC89909801A8B0D7XKD', '1');
INSERT INTO `um_user_roles` VALUES ('21', '13', '584C7FF2122D11EC89909801A8B0D7XKD', '1');
INSERT INTO `um_user_roles` VALUES ('22', '13', '584C7FF2122D11EC89909801A8B0D7XKD', '1');
INSERT INTO `um_user_roles` VALUES ('30', '14', 'DFB15FKAEEC611EG2E7C9801A7CXD1HK', '1');
INSERT INTO `um_user_roles` VALUES ('31', '1', 'DFB15FKAEEC611EG2E7C9801A7CXD1HK', '1');
INSERT INTO `um_user_roles` VALUES ('32', '14', '38DC051E122D11EC89909801A7B0D1FCH', '1');
INSERT INTO `um_user_roles` VALUES ('33', '14', '38DC051E122D11EC89909801A7B0D1FCH', '1');
INSERT INTO `um_user_roles` VALUES ('34', '14', '38DC051E122D11EC89909801A7B0D1FCH', '1');
INSERT INTO `um_user_roles` VALUES ('35', '14', 'DFB15FKAEEC611EG2E7C9801A7CXD1HK', '1');
INSERT INTO `um_user_roles` VALUES ('36', '14', 'DFB15FKAEEC611EG2E7C9801A7CXD1HK', '1');
INSERT INTO `um_user_roles` VALUES ('45', '14', '38DC051E122D11EC89909801A7B0D1FCH', '1');
INSERT INTO `um_user_roles` VALUES ('61', '14', '38DC051E122D11EC89909801A7B0D1FCH', '1');
INSERT INTO `um_user_roles` VALUES ('62', '14', 'DFB15FKAEEC611EG2E7C9801A7CXD1HK', '1');
INSERT INTO `um_user_roles` VALUES ('63', '14', 'DFB15FKAEEC611EG2E7C9801A7CXD1HK', '1');
INSERT INTO `um_user_roles` VALUES ('64', '14', 'DFB15FKAEEC611EG2E7C9801A7CXD1HK', '1');
INSERT INTO `um_user_roles` VALUES ('65', '13', 'DFB15FKAEEC611EG2E7C9801A7CXD1HK', '1');

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
-- Table structure for `uploads`
-- ----------------------------
DROP TABLE IF EXISTS `uploads`;
CREATE TABLE `uploads` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `file_type` varchar(250) NOT NULL,
  `file_name` varchar(250) NOT NULL,
  `category` varchar(25) NOT NULL COMMENT 'category = {''image'',''document''}',
  `is_private` tinyint(6) NOT NULL DEFAULT 0,
  `create_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_user` varchar(35) NOT NULL,
  `owner_user_id` int(10) NOT NULL,
  `user_class` varchar(25) DEFAULT NULL,
  `branch_id` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of uploads
-- ----------------------------
INSERT INTO `uploads` VALUES ('1', 'jpg', '1_621ee6d26a47c_20220302_100358.jpg', 'image', '0', '2022-03-02 10:38:58.000000', 'samsethy', '41', 'merchant', '1');
INSERT INTO `uploads` VALUES ('2', 'jpg', '1_621eedd52072a_20220302_110353.jpg', 'image', '0', '2022-03-02 11:08:53.000000', 'samsethy', '41', 'merchant', '1');
INSERT INTO `uploads` VALUES ('3', 'jpg', '1_621ef483d67bd_20220302_110323.jpg', 'image', '0', '2022-03-02 11:37:23.000000', 'samsethy', '41', 'merchant', '1');

-- ----------------------------
-- Table structure for `users`
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of users
-- ----------------------------

-- ----------------------------
-- Table structure for `vehicle_type`
-- ----------------------------
DROP TABLE IF EXISTS `vehicle_type`;
CREATE TABLE `vehicle_type` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `code` varchar(10) DEFAULT NULL,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `branch_id` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of vehicle_type
-- ----------------------------
INSERT INTO `vehicle_type` VALUES ('1', 'moto bike', 'Moto', '1');
INSERT INTO `vehicle_type` VALUES ('2', 'tuk tuk', 'TUK TUK', '1');
INSERT INTO `vehicle_type` VALUES ('3', 'moto', 'Moto', '1');
INSERT INTO `vehicle_type` VALUES ('4', 'motobike', 'motobike', '1');

-- ----------------------------
-- Table structure for `warehouses`
-- ----------------------------
DROP TABLE IF EXISTS `warehouses`;
CREATE TABLE `warehouses` (
  `branch_id` int(10) NOT NULL,
  `name` varchar(150) NOT NULL,
  `map_location` varchar(150) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `cp_name` varchar(50) DEFAULT NULL,
  `warehouse_type` varchar(50) NOT NULL DEFAULT 'Normal',
  `id` int(10) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of warehouses
-- ----------------------------
INSERT INTO `warehouses` VALUES ('1', 'Bro Express Warehouse', null, null, 'Chunheng', 'Normal', '1');

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
) ENGINE=InnoDB AUTO_INCREMENT=1097 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of websockets_statistics_entries
-- ----------------------------
INSERT INTO `websockets_statistics_entries` VALUES ('496', '1312272', '2', '3', '1', '2022-02-25 00:07:28', '2022-02-25 00:07:28');
INSERT INTO `websockets_statistics_entries` VALUES ('497', '1312272', '2', '3', '1', '2022-02-25 00:08:29', '2022-02-25 00:08:29');
INSERT INTO `websockets_statistics_entries` VALUES ('498', '1312272', '2', '3', '1', '2022-02-25 00:09:28', '2022-02-25 00:09:28');
INSERT INTO `websockets_statistics_entries` VALUES ('499', '1312272', '2', '3', '1', '2022-02-25 00:10:29', '2022-02-25 00:10:29');
INSERT INTO `websockets_statistics_entries` VALUES ('500', '1312272', '2', '3', '1', '2022-02-25 00:11:28', '2022-02-25 00:11:28');
INSERT INTO `websockets_statistics_entries` VALUES ('501', '1312272', '2', '3', '1', '2022-02-25 00:12:28', '2022-02-25 00:12:28');
INSERT INTO `websockets_statistics_entries` VALUES ('502', '1312272', '2', '4', '1', '2022-02-25 00:13:29', '2022-02-25 00:13:29');
INSERT INTO `websockets_statistics_entries` VALUES ('503', '1312272', '2', '2', '1', '2022-02-25 00:14:29', '2022-02-25 00:14:29');
INSERT INTO `websockets_statistics_entries` VALUES ('504', '1312272', '2', '3', '1', '2022-02-25 00:15:29', '2022-02-25 00:15:29');
INSERT INTO `websockets_statistics_entries` VALUES ('505', '1312272', '2', '3', '1', '2022-02-25 00:16:29', '2022-02-25 00:16:29');
INSERT INTO `websockets_statistics_entries` VALUES ('506', '1312272', '2', '3', '1', '2022-02-25 00:17:29', '2022-02-25 00:17:29');
INSERT INTO `websockets_statistics_entries` VALUES ('507', '1312272', '2', '3', '1', '2022-02-25 00:18:29', '2022-02-25 00:18:29');
INSERT INTO `websockets_statistics_entries` VALUES ('508', '1312272', '2', '3', '1', '2022-02-25 00:19:29', '2022-02-25 00:19:29');
INSERT INTO `websockets_statistics_entries` VALUES ('509', '1312272', '2', '3', '1', '2022-02-25 00:20:28', '2022-02-25 00:20:28');
INSERT INTO `websockets_statistics_entries` VALUES ('510', '1312272', '2', '3', '1', '2022-02-25 00:21:29', '2022-02-25 00:21:29');
INSERT INTO `websockets_statistics_entries` VALUES ('511', '1312272', '2', '3', '1', '2022-02-25 00:22:29', '2022-02-25 00:22:29');
INSERT INTO `websockets_statistics_entries` VALUES ('512', '1312272', '2', '3', '1', '2022-02-25 00:23:29', '2022-02-25 00:23:29');
INSERT INTO `websockets_statistics_entries` VALUES ('513', '1312272', '2', '3', '1', '2022-02-25 00:24:29', '2022-02-25 00:24:29');
INSERT INTO `websockets_statistics_entries` VALUES ('514', '1312272', '2', '3', '1', '2022-02-25 00:25:29', '2022-02-25 00:25:29');
INSERT INTO `websockets_statistics_entries` VALUES ('515', '1312272', '2', '3', '1', '2022-02-25 00:26:29', '2022-02-25 00:26:29');
INSERT INTO `websockets_statistics_entries` VALUES ('516', '1312272', '2', '3', '1', '2022-02-25 00:27:29', '2022-02-25 00:27:29');
INSERT INTO `websockets_statistics_entries` VALUES ('517', '1312272', '2', '3', '1', '2022-02-25 00:28:29', '2022-02-25 00:28:29');
INSERT INTO `websockets_statistics_entries` VALUES ('518', '1312272', '2', '3', '1', '2022-02-25 00:29:29', '2022-02-25 00:29:29');
INSERT INTO `websockets_statistics_entries` VALUES ('519', '1312272', '2', '2', '1', '2022-02-25 00:30:29', '2022-02-25 00:30:29');
INSERT INTO `websockets_statistics_entries` VALUES ('520', '1312272', '2', '3', '1', '2022-02-25 00:31:29', '2022-02-25 00:31:29');
INSERT INTO `websockets_statistics_entries` VALUES ('521', '1312272', '2', '3', '1', '2022-02-25 00:32:29', '2022-02-25 00:32:29');
INSERT INTO `websockets_statistics_entries` VALUES ('522', '1312272', '2', '3', '1', '2022-02-25 00:33:29', '2022-02-25 00:33:29');
INSERT INTO `websockets_statistics_entries` VALUES ('523', '1312272', '2', '3', '1', '2022-02-25 00:34:29', '2022-02-25 00:34:29');
INSERT INTO `websockets_statistics_entries` VALUES ('524', '1312272', '2', '3', '1', '2022-02-25 00:35:29', '2022-02-25 00:35:29');
INSERT INTO `websockets_statistics_entries` VALUES ('525', '1312272', '2', '2', '1', '2022-02-25 00:36:29', '2022-02-25 00:36:29');
INSERT INTO `websockets_statistics_entries` VALUES ('526', '1312272', '2', '3', '1', '2022-02-25 00:37:29', '2022-02-25 00:37:29');
INSERT INTO `websockets_statistics_entries` VALUES ('527', '1312272', '2', '3', '1', '2022-02-25 00:38:29', '2022-02-25 00:38:29');
INSERT INTO `websockets_statistics_entries` VALUES ('528', '1312272', '2', '4', '1', '2022-02-25 00:39:29', '2022-02-25 00:39:29');
INSERT INTO `websockets_statistics_entries` VALUES ('529', '1312272', '2', '3', '1', '2022-02-25 00:40:29', '2022-02-25 00:40:29');
INSERT INTO `websockets_statistics_entries` VALUES ('530', '1312272', '2', '3', '1', '2022-02-25 00:41:29', '2022-02-25 00:41:29');
INSERT INTO `websockets_statistics_entries` VALUES ('531', '1312272', '2', '3', '1', '2022-02-25 00:42:29', '2022-02-25 00:42:29');
INSERT INTO `websockets_statistics_entries` VALUES ('532', '1312272', '2', '3', '1', '2022-02-25 00:43:29', '2022-02-25 00:43:29');
INSERT INTO `websockets_statistics_entries` VALUES ('533', '1312272', '2', '3', '1', '2022-02-25 00:44:29', '2022-02-25 00:44:29');
INSERT INTO `websockets_statistics_entries` VALUES ('534', '1312272', '2', '3', '1', '2022-02-25 00:45:29', '2022-02-25 00:45:29');
INSERT INTO `websockets_statistics_entries` VALUES ('535', '1312272', '2', '3', '1', '2022-02-25 00:46:29', '2022-02-25 00:46:29');
INSERT INTO `websockets_statistics_entries` VALUES ('536', '1312272', '2', '3', '1', '2022-02-25 00:47:29', '2022-02-25 00:47:29');
INSERT INTO `websockets_statistics_entries` VALUES ('537', '1312272', '2', '3', '1', '2022-02-25 00:48:29', '2022-02-25 00:48:29');
INSERT INTO `websockets_statistics_entries` VALUES ('538', '1312272', '2', '3', '1', '2022-02-25 00:49:29', '2022-02-25 00:49:29');
INSERT INTO `websockets_statistics_entries` VALUES ('539', '1312272', '2', '3', '1', '2022-02-25 00:50:29', '2022-02-25 00:50:29');
INSERT INTO `websockets_statistics_entries` VALUES ('540', '1312272', '2', '3', '1', '2022-02-25 00:51:29', '2022-02-25 00:51:29');
INSERT INTO `websockets_statistics_entries` VALUES ('541', '1312272', '2', '3', '1', '2022-02-25 00:52:29', '2022-02-25 00:52:29');
INSERT INTO `websockets_statistics_entries` VALUES ('542', '1312272', '2', '3', '1', '2022-02-25 00:53:29', '2022-02-25 00:53:29');
INSERT INTO `websockets_statistics_entries` VALUES ('543', '1312272', '2', '2', '1', '2022-02-25 00:54:29', '2022-02-25 00:54:29');
INSERT INTO `websockets_statistics_entries` VALUES ('544', '1312272', '2', '3', '1', '2022-02-25 00:55:29', '2022-02-25 00:55:29');
INSERT INTO `websockets_statistics_entries` VALUES ('545', '1312272', '2', '4', '1', '2022-02-25 00:56:29', '2022-02-25 00:56:29');
INSERT INTO `websockets_statistics_entries` VALUES ('546', '1312272', '2', '3', '1', '2022-02-25 00:57:29', '2022-02-25 00:57:29');
INSERT INTO `websockets_statistics_entries` VALUES ('547', '1312272', '2', '3', '1', '2022-02-25 00:58:29', '2022-02-25 00:58:29');
INSERT INTO `websockets_statistics_entries` VALUES ('548', '1312272', '2', '3', '1', '2022-02-25 00:59:29', '2022-02-25 00:59:29');
INSERT INTO `websockets_statistics_entries` VALUES ('549', '1312272', '2', '3', '1', '2022-02-25 01:00:29', '2022-02-25 01:00:29');
INSERT INTO `websockets_statistics_entries` VALUES ('550', '1312272', '2', '2', '1', '2022-02-25 01:01:29', '2022-02-25 01:01:29');
INSERT INTO `websockets_statistics_entries` VALUES ('551', '1312272', '2', '3', '1', '2022-02-25 01:02:29', '2022-02-25 01:02:29');
INSERT INTO `websockets_statistics_entries` VALUES ('552', '1312272', '2', '3', '1', '2022-02-25 01:03:29', '2022-02-25 01:03:29');
INSERT INTO `websockets_statistics_entries` VALUES ('553', '1312272', '2', '3', '1', '2022-02-25 01:04:29', '2022-02-25 01:04:29');
INSERT INTO `websockets_statistics_entries` VALUES ('554', '1312272', '2', '3', '1', '2022-02-25 01:05:29', '2022-02-25 01:05:29');
INSERT INTO `websockets_statistics_entries` VALUES ('555', '1312272', '2', '4', '1', '2022-02-25 01:06:29', '2022-02-25 01:06:29');
INSERT INTO `websockets_statistics_entries` VALUES ('556', '1312272', '2', '4', '1', '2022-02-25 01:07:30', '2022-02-25 01:07:30');
INSERT INTO `websockets_statistics_entries` VALUES ('557', '1312272', '2', '2', '1', '2022-02-25 01:08:29', '2022-02-25 01:08:29');
INSERT INTO `websockets_statistics_entries` VALUES ('558', '1312272', '2', '4', '1', '2022-02-25 01:09:29', '2022-02-25 01:09:29');
INSERT INTO `websockets_statistics_entries` VALUES ('559', '1312272', '2', '2', '1', '2022-02-25 01:10:29', '2022-02-25 01:10:29');
INSERT INTO `websockets_statistics_entries` VALUES ('560', '1312272', '2', '3', '1', '2022-02-25 01:11:29', '2022-02-25 01:11:29');
INSERT INTO `websockets_statistics_entries` VALUES ('561', '1312272', '2', '3', '1', '2022-02-25 01:12:29', '2022-02-25 01:12:29');
INSERT INTO `websockets_statistics_entries` VALUES ('562', '1312272', '2', '4', '1', '2022-02-25 01:13:29', '2022-02-25 01:13:29');
INSERT INTO `websockets_statistics_entries` VALUES ('563', '1312272', '2', '3', '1', '2022-02-25 01:14:29', '2022-02-25 01:14:29');
INSERT INTO `websockets_statistics_entries` VALUES ('564', '1312272', '2', '3', '1', '2022-02-25 01:15:29', '2022-02-25 01:15:29');
INSERT INTO `websockets_statistics_entries` VALUES ('565', '1312272', '2', '3', '1', '2022-02-25 01:16:29', '2022-02-25 01:16:29');
INSERT INTO `websockets_statistics_entries` VALUES ('566', '1312272', '2', '3', '1', '2022-02-25 01:17:29', '2022-02-25 01:17:29');
INSERT INTO `websockets_statistics_entries` VALUES ('567', '1312272', '2', '3', '1', '2022-02-25 01:18:29', '2022-02-25 01:18:29');
INSERT INTO `websockets_statistics_entries` VALUES ('568', '1312272', '2', '3', '1', '2022-02-25 01:19:29', '2022-02-25 01:19:29');
INSERT INTO `websockets_statistics_entries` VALUES ('569', '1312272', '2', '3', '1', '2022-02-25 01:20:29', '2022-02-25 01:20:29');
INSERT INTO `websockets_statistics_entries` VALUES ('570', '1312272', '2', '3', '1', '2022-02-25 01:21:29', '2022-02-25 01:21:29');
INSERT INTO `websockets_statistics_entries` VALUES ('571', '1312272', '2', '3', '1', '2022-02-25 01:22:29', '2022-02-25 01:22:29');
INSERT INTO `websockets_statistics_entries` VALUES ('572', '1312272', '2', '3', '1', '2022-02-25 01:23:29', '2022-02-25 01:23:29');
INSERT INTO `websockets_statistics_entries` VALUES ('573', '1312272', '2', '4', '1', '2022-02-25 01:24:29', '2022-02-25 01:24:29');
INSERT INTO `websockets_statistics_entries` VALUES ('574', '1312272', '2', '12', '1', '2022-02-25 01:25:29', '2022-02-25 01:25:29');
INSERT INTO `websockets_statistics_entries` VALUES ('575', '1312272', '2', '3', '1', '2022-02-25 01:26:29', '2022-02-25 01:26:29');
INSERT INTO `websockets_statistics_entries` VALUES ('576', '1312272', '2', '5', '1', '2022-02-25 01:27:29', '2022-02-25 01:27:29');
INSERT INTO `websockets_statistics_entries` VALUES ('577', '1312272', '2', '4', '1', '2022-02-25 01:28:29', '2022-02-25 01:28:29');
INSERT INTO `websockets_statistics_entries` VALUES ('578', '1312272', '2', '2', '1', '2022-02-25 01:29:29', '2022-02-25 01:29:29');
INSERT INTO `websockets_statistics_entries` VALUES ('579', '1312272', '1', '11', '1', '2022-02-25 01:30:29', '2022-02-25 01:30:29');
INSERT INTO `websockets_statistics_entries` VALUES ('580', '1312272', '2', '4', '1', '2022-02-25 01:31:29', '2022-02-25 01:31:29');
INSERT INTO `websockets_statistics_entries` VALUES ('581', '1312272', '1', '2', '1', '2022-02-25 01:32:29', '2022-02-25 01:32:29');
INSERT INTO `websockets_statistics_entries` VALUES ('582', '1312272', '1', '2', '1', '2022-02-25 01:33:29', '2022-02-25 01:33:29');
INSERT INTO `websockets_statistics_entries` VALUES ('583', '1312272', '2', '10', '1', '2022-02-25 01:34:29', '2022-02-25 01:34:29');
INSERT INTO `websockets_statistics_entries` VALUES ('584', '1312272', '2', '3', '1', '2022-02-25 01:35:29', '2022-02-25 01:35:29');
INSERT INTO `websockets_statistics_entries` VALUES ('585', '1312272', '2', '3', '1', '2022-02-25 01:36:29', '2022-02-25 01:36:29');
INSERT INTO `websockets_statistics_entries` VALUES ('586', '1312272', '2', '5', '1', '2022-02-25 01:37:29', '2022-02-25 01:37:29');
INSERT INTO `websockets_statistics_entries` VALUES ('587', '1312272', '2', '3', '1', '2022-02-25 01:38:29', '2022-02-25 01:38:29');
INSERT INTO `websockets_statistics_entries` VALUES ('588', '1312272', '2', '4', '1', '2022-02-25 01:39:29', '2022-02-25 01:39:29');
INSERT INTO `websockets_statistics_entries` VALUES ('589', '1312272', '2', '3', '1', '2022-02-25 01:40:29', '2022-02-25 01:40:29');
INSERT INTO `websockets_statistics_entries` VALUES ('590', '1312272', '2', '3', '1', '2022-02-25 01:41:29', '2022-02-25 01:41:29');
INSERT INTO `websockets_statistics_entries` VALUES ('591', '1312272', '2', '3', '1', '2022-02-25 01:42:29', '2022-02-25 01:42:29');
INSERT INTO `websockets_statistics_entries` VALUES ('592', '1312272', '2', '3', '1', '2022-02-25 01:43:29', '2022-02-25 01:43:29');
INSERT INTO `websockets_statistics_entries` VALUES ('593', '1312272', '2', '3', '1', '2022-02-25 01:44:29', '2022-02-25 01:44:29');
INSERT INTO `websockets_statistics_entries` VALUES ('594', '1312272', '2', '3', '1', '2022-02-25 01:45:29', '2022-02-25 01:45:29');
INSERT INTO `websockets_statistics_entries` VALUES ('595', '1312272', '2', '11', '1', '2022-02-25 01:46:29', '2022-02-25 01:46:29');
INSERT INTO `websockets_statistics_entries` VALUES ('596', '1312272', '2', '3', '1', '2022-02-25 01:47:29', '2022-02-25 01:47:29');
INSERT INTO `websockets_statistics_entries` VALUES ('597', '1312272', '2', '4', '1', '2022-02-25 01:48:29', '2022-02-25 01:48:29');
INSERT INTO `websockets_statistics_entries` VALUES ('598', '1312272', '2', '3', '1', '2022-02-25 01:49:29', '2022-02-25 01:49:29');
INSERT INTO `websockets_statistics_entries` VALUES ('599', '1312272', '2', '3', '1', '2022-02-25 01:50:29', '2022-02-25 01:50:29');
INSERT INTO `websockets_statistics_entries` VALUES ('600', '1312272', '2', '3', '1', '2022-02-25 01:51:29', '2022-02-25 01:51:29');
INSERT INTO `websockets_statistics_entries` VALUES ('601', '1312272', '2', '3', '1', '2022-02-25 01:52:29', '2022-02-25 01:52:29');
INSERT INTO `websockets_statistics_entries` VALUES ('602', '1312272', '2', '2', '1', '2022-02-25 01:53:29', '2022-02-25 01:53:29');
INSERT INTO `websockets_statistics_entries` VALUES ('603', '1312272', '2', '3', '1', '2022-02-25 01:54:29', '2022-02-25 01:54:29');
INSERT INTO `websockets_statistics_entries` VALUES ('604', '1312272', '1', '3', '1', '2022-02-25 01:55:29', '2022-02-25 01:55:29');
INSERT INTO `websockets_statistics_entries` VALUES ('605', '1312272', '2', '3', '1', '2022-02-25 01:56:29', '2022-02-25 01:56:29');
INSERT INTO `websockets_statistics_entries` VALUES ('606', '1312272', '2', '3', '1', '2022-02-25 01:57:30', '2022-02-25 01:57:30');
INSERT INTO `websockets_statistics_entries` VALUES ('607', '1312272', '2', '12', '0', '2022-02-25 01:59:09', '2022-02-25 01:59:09');
INSERT INTO `websockets_statistics_entries` VALUES ('608', '1312272', '2', '10', '0', '2022-02-25 02:34:59', '2022-02-25 02:34:59');
INSERT INTO `websockets_statistics_entries` VALUES ('609', '1312272', '2', '2', '1', '2022-02-25 02:35:59', '2022-02-25 02:35:59');
INSERT INTO `websockets_statistics_entries` VALUES ('610', '1312272', '2', '3', '1', '2022-02-25 02:36:59', '2022-02-25 02:36:59');
INSERT INTO `websockets_statistics_entries` VALUES ('611', '1312272', '2', '3', '1', '2022-02-25 02:37:59', '2022-02-25 02:37:59');
INSERT INTO `websockets_statistics_entries` VALUES ('612', '1312272', '2', '3', '1', '2022-02-25 02:38:59', '2022-02-25 02:38:59');
INSERT INTO `websockets_statistics_entries` VALUES ('613', '1312272', '2', '3', '1', '2022-02-25 02:39:59', '2022-02-25 02:39:59');
INSERT INTO `websockets_statistics_entries` VALUES ('614', '1312272', '2', '3', '1', '2022-02-25 02:40:59', '2022-02-25 02:40:59');
INSERT INTO `websockets_statistics_entries` VALUES ('615', '1312272', '2', '3', '1', '2022-02-25 02:41:59', '2022-02-25 02:41:59');
INSERT INTO `websockets_statistics_entries` VALUES ('616', '1312272', '2', '3', '1', '2022-02-25 02:42:59', '2022-02-25 02:42:59');
INSERT INTO `websockets_statistics_entries` VALUES ('617', '1312272', '2', '3', '1', '2022-02-25 02:43:59', '2022-02-25 02:43:59');
INSERT INTO `websockets_statistics_entries` VALUES ('618', '1312272', '2', '3', '1', '2022-02-25 02:44:59', '2022-02-25 02:44:59');
INSERT INTO `websockets_statistics_entries` VALUES ('619', '1312272', '2', '3', '1', '2022-02-25 02:45:59', '2022-02-25 02:45:59');
INSERT INTO `websockets_statistics_entries` VALUES ('620', '1312272', '2', '3', '1', '2022-02-25 02:46:59', '2022-02-25 02:46:59');
INSERT INTO `websockets_statistics_entries` VALUES ('621', '1312272', '2', '3', '1', '2022-02-25 02:47:59', '2022-02-25 02:47:59');
INSERT INTO `websockets_statistics_entries` VALUES ('622', '1312272', '2', '3', '1', '2022-02-25 02:48:59', '2022-02-25 02:48:59');
INSERT INTO `websockets_statistics_entries` VALUES ('623', '1312272', '2', '3', '1', '2022-02-25 02:49:59', '2022-02-25 02:49:59');
INSERT INTO `websockets_statistics_entries` VALUES ('624', '1312272', '2', '3', '1', '2022-02-25 02:50:59', '2022-02-25 02:50:59');
INSERT INTO `websockets_statistics_entries` VALUES ('625', '1312272', '2', '3', '1', '2022-02-25 02:51:59', '2022-02-25 02:51:59');
INSERT INTO `websockets_statistics_entries` VALUES ('626', '1312272', '2', '2', '1', '2022-02-25 02:52:59', '2022-02-25 02:52:59');
INSERT INTO `websockets_statistics_entries` VALUES ('627', '1312272', '2', '11', '1', '2022-02-25 02:53:59', '2022-02-25 02:53:59');
INSERT INTO `websockets_statistics_entries` VALUES ('628', '1312272', '2', '3', '1', '2022-02-25 02:54:59', '2022-02-25 02:54:59');
INSERT INTO `websockets_statistics_entries` VALUES ('629', '1312272', '2', '3', '1', '2022-02-25 02:55:59', '2022-02-25 02:55:59');
INSERT INTO `websockets_statistics_entries` VALUES ('630', '1312272', '2', '3', '1', '2022-02-25 02:56:59', '2022-02-25 02:56:59');
INSERT INTO `websockets_statistics_entries` VALUES ('631', '1312272', '2', '3', '1', '2022-02-25 02:57:59', '2022-02-25 02:57:59');
INSERT INTO `websockets_statistics_entries` VALUES ('632', '1312272', '1', '11', '1', '2022-02-25 02:58:59', '2022-02-25 02:58:59');
INSERT INTO `websockets_statistics_entries` VALUES ('633', '1312272', '2', '3', '1', '2022-02-25 02:59:59', '2022-02-25 02:59:59');
INSERT INTO `websockets_statistics_entries` VALUES ('634', '1312272', '2', '0', '9', '2022-02-25 03:00:59', '2022-02-25 03:00:59');
INSERT INTO `websockets_statistics_entries` VALUES ('635', '1312272', '2', '3', '3', '2022-02-25 03:01:59', '2022-02-25 03:01:59');
INSERT INTO `websockets_statistics_entries` VALUES ('636', '1312272', '2', '0', '3', '2022-02-25 03:02:59', '2022-02-25 03:02:59');
INSERT INTO `websockets_statistics_entries` VALUES ('637', '1312272', '2', '3', '1', '2022-02-25 03:03:59', '2022-02-25 03:03:59');
INSERT INTO `websockets_statistics_entries` VALUES ('638', '1312272', '2', '3', '1', '2022-02-25 03:04:59', '2022-02-25 03:04:59');
INSERT INTO `websockets_statistics_entries` VALUES ('639', '1312272', '2', '2', '5', '2022-02-25 03:05:59', '2022-02-25 03:05:59');
INSERT INTO `websockets_statistics_entries` VALUES ('640', '1312272', '2', '2', '3', '2022-02-25 03:06:59', '2022-02-25 03:06:59');
INSERT INTO `websockets_statistics_entries` VALUES ('641', '1312272', '2', '3', '1', '2022-02-25 03:07:59', '2022-02-25 03:07:59');
INSERT INTO `websockets_statistics_entries` VALUES ('642', '1312272', '2', '3', '1', '2022-02-25 03:08:59', '2022-02-25 03:08:59');
INSERT INTO `websockets_statistics_entries` VALUES ('643', '1312272', '2', '3', '1', '2022-02-25 03:09:59', '2022-02-25 03:09:59');
INSERT INTO `websockets_statistics_entries` VALUES ('644', '1312272', '2', '3', '1', '2022-02-25 03:10:59', '2022-02-25 03:10:59');
INSERT INTO `websockets_statistics_entries` VALUES ('645', '1312272', '2', '3', '1', '2022-02-25 03:11:59', '2022-02-25 03:11:59');
INSERT INTO `websockets_statistics_entries` VALUES ('646', '1312272', '2', '3', '1', '2022-02-25 03:12:59', '2022-02-25 03:12:59');
INSERT INTO `websockets_statistics_entries` VALUES ('647', '1312272', '2', '3', '1', '2022-02-25 03:13:59', '2022-02-25 03:13:59');
INSERT INTO `websockets_statistics_entries` VALUES ('648', '1312272', '2', '3', '1', '2022-02-25 03:14:59', '2022-02-25 03:14:59');
INSERT INTO `websockets_statistics_entries` VALUES ('649', '1312272', '2', '3', '1', '2022-02-25 03:15:59', '2022-02-25 03:15:59');
INSERT INTO `websockets_statistics_entries` VALUES ('650', '1312272', '2', '2', '1', '2022-02-25 03:16:59', '2022-02-25 03:16:59');
INSERT INTO `websockets_statistics_entries` VALUES ('651', '1312272', '2', '9', '3', '2022-02-25 03:18:40', '2022-02-25 03:18:40');
INSERT INTO `websockets_statistics_entries` VALUES ('652', '1312272', '2', '3', '1', '2022-02-25 03:19:40', '2022-02-25 03:19:40');
INSERT INTO `websockets_statistics_entries` VALUES ('653', '1312272', '2', '3', '1', '2022-02-25 03:20:40', '2022-02-25 03:20:40');
INSERT INTO `websockets_statistics_entries` VALUES ('654', '1312272', '2', '1', '6', '2022-02-25 03:21:40', '2022-02-25 03:21:40');
INSERT INTO `websockets_statistics_entries` VALUES ('655', '1312272', '2', '3', '4', '2022-02-25 03:22:40', '2022-02-25 03:22:40');
INSERT INTO `websockets_statistics_entries` VALUES ('656', '1312272', '2', '3', '1', '2022-02-25 03:23:41', '2022-02-25 03:23:41');
INSERT INTO `websockets_statistics_entries` VALUES ('657', '1312272', '2', '3', '1', '2022-02-25 03:24:40', '2022-02-25 03:24:40');
INSERT INTO `websockets_statistics_entries` VALUES ('658', '1312272', '2', '3', '1', '2022-02-25 03:25:40', '2022-02-25 03:25:40');
INSERT INTO `websockets_statistics_entries` VALUES ('659', '1312272', '2', '2', '1', '2022-02-25 03:26:40', '2022-02-25 03:26:40');
INSERT INTO `websockets_statistics_entries` VALUES ('660', '1312272', '1', '1', '1', '2022-02-25 03:27:41', '2022-02-25 03:27:41');
INSERT INTO `websockets_statistics_entries` VALUES ('661', '1312272', '1', '1', '1', '2022-02-25 03:28:41', '2022-02-25 03:28:41');
INSERT INTO `websockets_statistics_entries` VALUES ('662', '1312272', '1', '1', '1', '2022-02-25 03:29:41', '2022-02-25 03:29:41');
INSERT INTO `websockets_statistics_entries` VALUES ('663', '1312272', '1', '1', '1', '2022-02-25 03:30:41', '2022-02-25 03:30:41');
INSERT INTO `websockets_statistics_entries` VALUES ('664', '1312272', '1', '1', '1', '2022-02-25 03:31:41', '2022-02-25 03:31:41');
INSERT INTO `websockets_statistics_entries` VALUES ('665', '1312272', '1', '1', '1', '2022-02-25 03:32:41', '2022-02-25 03:32:41');
INSERT INTO `websockets_statistics_entries` VALUES ('666', '1312272', '1', '1', '1', '2022-02-25 03:33:41', '2022-02-25 03:33:41');
INSERT INTO `websockets_statistics_entries` VALUES ('667', '1312272', '1', '1', '1', '2022-02-25 03:34:41', '2022-02-25 03:34:41');
INSERT INTO `websockets_statistics_entries` VALUES ('668', '1312272', '2', '1', '2', '2022-02-25 03:35:41', '2022-02-25 03:35:41');
INSERT INTO `websockets_statistics_entries` VALUES ('669', '1312272', '2', '3', '1', '2022-02-25 03:36:41', '2022-02-25 03:36:41');
INSERT INTO `websockets_statistics_entries` VALUES ('670', '1312272', '2', '3', '1', '2022-02-25 03:37:41', '2022-02-25 03:37:41');
INSERT INTO `websockets_statistics_entries` VALUES ('671', '1312272', '2', '3', '1', '2022-02-25 03:38:41', '2022-02-25 03:38:41');
INSERT INTO `websockets_statistics_entries` VALUES ('672', '1312272', '2', '3', '1', '2022-02-25 03:39:41', '2022-02-25 03:39:41');
INSERT INTO `websockets_statistics_entries` VALUES ('673', '1312272', '2', '3', '5', '2022-02-25 03:40:41', '2022-02-25 03:40:41');
INSERT INTO `websockets_statistics_entries` VALUES ('674', '1312272', '2', '3', '3', '2022-02-25 03:41:41', '2022-02-25 03:41:41');
INSERT INTO `websockets_statistics_entries` VALUES ('675', '1312272', '2', '4', '2', '2022-02-25 03:42:41', '2022-02-25 03:42:41');
INSERT INTO `websockets_statistics_entries` VALUES ('676', '1312272', '2', '3', '1', '2022-02-25 03:43:41', '2022-02-25 03:43:41');
INSERT INTO `websockets_statistics_entries` VALUES ('677', '1312272', '2', '3', '1', '2022-02-25 03:44:41', '2022-02-25 03:44:41');
INSERT INTO `websockets_statistics_entries` VALUES ('678', '1312272', '2', '3', '1', '2022-02-25 03:45:41', '2022-02-25 03:45:41');
INSERT INTO `websockets_statistics_entries` VALUES ('679', '1312272', '2', '2', '1', '2022-02-25 03:46:41', '2022-02-25 03:46:41');
INSERT INTO `websockets_statistics_entries` VALUES ('680', '1312272', '2', '3', '1', '2022-02-25 03:47:41', '2022-02-25 03:47:41');
INSERT INTO `websockets_statistics_entries` VALUES ('681', '1312272', '2', '3', '1', '2022-02-25 03:48:41', '2022-02-25 03:48:41');
INSERT INTO `websockets_statistics_entries` VALUES ('682', '1312272', '2', '3', '1', '2022-02-25 03:49:41', '2022-02-25 03:49:41');
INSERT INTO `websockets_statistics_entries` VALUES ('683', '1312272', '1', '3', '2', '2022-02-25 03:50:41', '2022-02-25 03:50:41');
INSERT INTO `websockets_statistics_entries` VALUES ('684', '1312272', '2', '2', '2', '2022-02-25 03:51:41', '2022-02-25 03:51:41');
INSERT INTO `websockets_statistics_entries` VALUES ('685', '1312272', '2', '3', '1', '2022-02-25 03:52:41', '2022-02-25 03:52:41');
INSERT INTO `websockets_statistics_entries` VALUES ('686', '1312272', '2', '3', '1', '2022-02-25 03:53:41', '2022-02-25 03:53:41');
INSERT INTO `websockets_statistics_entries` VALUES ('687', '1312272', '2', '3', '1', '2022-02-25 03:54:41', '2022-02-25 03:54:41');
INSERT INTO `websockets_statistics_entries` VALUES ('688', '1312272', '2', '3', '1', '2022-02-25 03:55:41', '2022-02-25 03:55:41');
INSERT INTO `websockets_statistics_entries` VALUES ('689', '1312272', '2', '3', '1', '2022-02-25 03:56:41', '2022-02-25 03:56:41');
INSERT INTO `websockets_statistics_entries` VALUES ('690', '1312272', '2', '3', '1', '2022-02-25 03:57:41', '2022-02-25 03:57:41');
INSERT INTO `websockets_statistics_entries` VALUES ('691', '1312272', '2', '3', '1', '2022-02-25 03:58:41', '2022-02-25 03:58:41');
INSERT INTO `websockets_statistics_entries` VALUES ('692', '1312272', '2', '3', '1', '2022-02-25 03:59:41', '2022-02-25 03:59:41');
INSERT INTO `websockets_statistics_entries` VALUES ('693', '1312272', '2', '3', '1', '2022-02-25 04:00:41', '2022-02-25 04:00:41');
INSERT INTO `websockets_statistics_entries` VALUES ('694', '1312272', '2', '3', '1', '2022-02-25 04:01:41', '2022-02-25 04:01:41');
INSERT INTO `websockets_statistics_entries` VALUES ('695', '1312272', '2', '3', '1', '2022-02-25 04:02:41', '2022-02-25 04:02:41');
INSERT INTO `websockets_statistics_entries` VALUES ('696', '1312272', '2', '3', '1', '2022-02-25 04:03:41', '2022-02-25 04:03:41');
INSERT INTO `websockets_statistics_entries` VALUES ('697', '1312272', '2', '3', '1', '2022-02-25 04:04:41', '2022-02-25 04:04:41');
INSERT INTO `websockets_statistics_entries` VALUES ('698', '1312272', '2', '2', '1', '2022-02-25 04:05:41', '2022-02-25 04:05:41');
INSERT INTO `websockets_statistics_entries` VALUES ('699', '1312272', '2', '3', '1', '2022-02-25 04:06:41', '2022-02-25 04:06:41');
INSERT INTO `websockets_statistics_entries` VALUES ('700', '1312272', '2', '10', '2', '2022-02-25 04:07:41', '2022-02-25 04:07:41');
INSERT INTO `websockets_statistics_entries` VALUES ('701', '1312272', '2', '4', '1', '2022-02-25 04:08:41', '2022-02-25 04:08:41');
INSERT INTO `websockets_statistics_entries` VALUES ('702', '1312272', '2', '4', '1', '2022-02-25 04:09:41', '2022-02-25 04:09:41');
INSERT INTO `websockets_statistics_entries` VALUES ('703', '1312272', '2', '3', '1', '2022-02-25 04:10:41', '2022-02-25 04:10:41');
INSERT INTO `websockets_statistics_entries` VALUES ('704', '1312272', '2', '3', '1', '2022-02-25 04:11:41', '2022-02-25 04:11:41');
INSERT INTO `websockets_statistics_entries` VALUES ('705', '1312272', '2', '2', '2', '2022-02-25 04:12:41', '2022-02-25 04:12:41');
INSERT INTO `websockets_statistics_entries` VALUES ('706', '1312272', '1', '3', '1', '2022-02-25 04:13:41', '2022-02-25 04:13:41');
INSERT INTO `websockets_statistics_entries` VALUES ('707', '1312272', '2', '4', '1', '2022-02-25 04:14:41', '2022-02-25 04:14:41');
INSERT INTO `websockets_statistics_entries` VALUES ('708', '1312272', '2', '2', '1', '2022-02-25 04:15:41', '2022-02-25 04:15:41');
INSERT INTO `websockets_statistics_entries` VALUES ('709', '1312272', '1', '3', '3', '2022-02-25 04:16:41', '2022-02-25 04:16:41');
INSERT INTO `websockets_statistics_entries` VALUES ('710', '1312272', '2', '2', '1', '2022-02-25 04:17:41', '2022-02-25 04:17:41');
INSERT INTO `websockets_statistics_entries` VALUES ('711', '1312272', '1', '3', '1', '2022-02-25 04:18:42', '2022-02-25 04:18:42');
INSERT INTO `websockets_statistics_entries` VALUES ('712', '1312272', '1', '4', '1', '2022-02-25 04:19:41', '2022-02-25 04:19:41');
INSERT INTO `websockets_statistics_entries` VALUES ('713', '1312272', '2', '12', '4', '2022-02-25 04:20:41', '2022-02-25 04:20:41');
INSERT INTO `websockets_statistics_entries` VALUES ('714', '1312272', '2', '3', '2', '2022-02-25 04:21:41', '2022-02-25 04:21:41');
INSERT INTO `websockets_statistics_entries` VALUES ('715', '1312272', '2', '2', '4', '2022-02-25 04:22:41', '2022-02-25 04:22:41');
INSERT INTO `websockets_statistics_entries` VALUES ('716', '1312272', '2', '3', '3', '2022-02-25 04:23:41', '2022-02-25 04:23:41');
INSERT INTO `websockets_statistics_entries` VALUES ('717', '1312272', '2', '3', '1', '2022-02-25 04:24:41', '2022-02-25 04:24:41');
INSERT INTO `websockets_statistics_entries` VALUES ('718', '1312272', '2', '3', '1', '2022-02-25 04:25:41', '2022-02-25 04:25:41');
INSERT INTO `websockets_statistics_entries` VALUES ('719', '1312272', '2', '3', '1', '2022-02-25 04:26:41', '2022-02-25 04:26:41');
INSERT INTO `websockets_statistics_entries` VALUES ('720', '1312272', '2', '3', '1', '2022-02-25 04:27:41', '2022-02-25 04:27:41');
INSERT INTO `websockets_statistics_entries` VALUES ('721', '1312272', '2', '3', '1', '2022-02-25 04:28:41', '2022-02-25 04:28:41');
INSERT INTO `websockets_statistics_entries` VALUES ('722', '1312272', '2', '2', '1', '2022-02-25 04:29:41', '2022-02-25 04:29:41');
INSERT INTO `websockets_statistics_entries` VALUES ('723', '1312272', '2', '3', '1', '2022-02-25 04:30:41', '2022-02-25 04:30:41');
INSERT INTO `websockets_statistics_entries` VALUES ('724', '1312272', '2', '3', '1', '2022-02-25 04:31:41', '2022-02-25 04:31:41');
INSERT INTO `websockets_statistics_entries` VALUES ('725', '1312272', '2', '3', '1', '2022-02-25 04:32:41', '2022-02-25 04:32:41');
INSERT INTO `websockets_statistics_entries` VALUES ('726', '1312272', '2', '4', '1', '2022-02-25 04:33:41', '2022-02-25 04:33:41');
INSERT INTO `websockets_statistics_entries` VALUES ('727', '1312272', '0', '2', '2', '2022-02-25 04:34:41', '2022-02-25 04:34:41');
INSERT INTO `websockets_statistics_entries` VALUES ('728', '1312272', '1', '2', '1', '2022-02-25 04:35:41', '2022-02-25 04:35:41');
INSERT INTO `websockets_statistics_entries` VALUES ('729', '1312272', '1', '2', '3', '2022-02-25 04:36:41', '2022-02-25 04:36:41');
INSERT INTO `websockets_statistics_entries` VALUES ('730', '1312272', '1', '2', '2', '2022-02-25 04:37:41', '2022-02-25 04:37:41');
INSERT INTO `websockets_statistics_entries` VALUES ('731', '1312272', '1', '3', '3', '2022-02-25 04:38:41', '2022-02-25 04:38:41');
INSERT INTO `websockets_statistics_entries` VALUES ('732', '1312272', '1', '2', '1', '2022-02-25 04:39:41', '2022-02-25 04:39:41');
INSERT INTO `websockets_statistics_entries` VALUES ('733', '1312272', '1', '2', '1', '2022-02-25 04:40:41', '2022-02-25 04:40:41');
INSERT INTO `websockets_statistics_entries` VALUES ('734', '1312272', '1', '2', '1', '2022-02-25 04:41:41', '2022-02-25 04:41:41');
INSERT INTO `websockets_statistics_entries` VALUES ('735', '1312272', '1', '1', '1', '2022-02-25 04:42:41', '2022-02-25 04:42:41');
INSERT INTO `websockets_statistics_entries` VALUES ('736', '1312272', '1', '2', '1', '2022-02-25 04:43:41', '2022-02-25 04:43:41');
INSERT INTO `websockets_statistics_entries` VALUES ('737', '1312272', '1', '2', '2', '2022-02-25 04:44:41', '2022-02-25 04:44:41');
INSERT INTO `websockets_statistics_entries` VALUES ('738', '1312272', '1', '2', '2', '2022-02-25 04:45:41', '2022-02-25 04:45:41');
INSERT INTO `websockets_statistics_entries` VALUES ('739', '1312272', '1', '2', '2', '2022-02-25 04:46:41', '2022-02-25 04:46:41');
INSERT INTO `websockets_statistics_entries` VALUES ('740', '1312272', '1', '2', '1', '2022-02-25 04:47:41', '2022-02-25 04:47:41');
INSERT INTO `websockets_statistics_entries` VALUES ('741', '1312272', '1', '2', '1', '2022-02-25 04:48:41', '2022-02-25 04:48:41');
INSERT INTO `websockets_statistics_entries` VALUES ('742', '1312272', '1', '2', '1', '2022-02-25 04:49:41', '2022-02-25 04:49:41');
INSERT INTO `websockets_statistics_entries` VALUES ('743', '1312272', '1', '2', '1', '2022-02-25 04:50:41', '2022-02-25 04:50:41');
INSERT INTO `websockets_statistics_entries` VALUES ('744', '1312272', '1', '2', '3', '2022-02-25 04:51:41', '2022-02-25 04:51:41');
INSERT INTO `websockets_statistics_entries` VALUES ('745', '1312272', '1', '2', '1', '2022-02-25 04:52:41', '2022-02-25 04:52:41');
INSERT INTO `websockets_statistics_entries` VALUES ('746', '1312272', '1', '2', '3', '2022-02-25 04:53:41', '2022-02-25 04:53:41');
INSERT INTO `websockets_statistics_entries` VALUES ('747', '1312272', '1', '2', '2', '2022-02-25 04:54:41', '2022-02-25 04:54:41');
INSERT INTO `websockets_statistics_entries` VALUES ('748', '1312272', '1', '2', '1', '2022-02-25 04:55:41', '2022-02-25 04:55:41');
INSERT INTO `websockets_statistics_entries` VALUES ('749', '1312272', '1', '2', '1', '2022-02-25 04:56:41', '2022-02-25 04:56:41');
INSERT INTO `websockets_statistics_entries` VALUES ('750', '1312272', '1', '2', '1', '2022-02-25 04:57:41', '2022-02-25 04:57:41');
INSERT INTO `websockets_statistics_entries` VALUES ('751', '1312272', '1', '2', '1', '2022-02-25 04:58:41', '2022-02-25 04:58:41');
INSERT INTO `websockets_statistics_entries` VALUES ('752', '1312272', '1', '2', '1', '2022-02-25 04:59:41', '2022-02-25 04:59:41');
INSERT INTO `websockets_statistics_entries` VALUES ('753', '1312272', '1', '2', '1', '2022-02-25 05:00:41', '2022-02-25 05:00:41');
INSERT INTO `websockets_statistics_entries` VALUES ('754', '1312272', '1', '2', '1', '2022-02-25 05:01:41', '2022-02-25 05:01:41');
INSERT INTO `websockets_statistics_entries` VALUES ('755', '1312272', '1', '1', '3', '2022-02-25 05:02:41', '2022-02-25 05:02:41');
INSERT INTO `websockets_statistics_entries` VALUES ('756', '1312272', '1', '2', '1', '2022-02-25 05:03:41', '2022-02-25 05:03:41');
INSERT INTO `websockets_statistics_entries` VALUES ('757', '1312272', '1', '2', '1', '2022-02-25 05:04:41', '2022-02-25 05:04:41');
INSERT INTO `websockets_statistics_entries` VALUES ('758', '1312272', '1', '2', '1', '2022-02-25 05:05:41', '2022-02-25 05:05:41');
INSERT INTO `websockets_statistics_entries` VALUES ('759', '1312272', '1', '2', '1', '2022-02-25 05:06:41', '2022-02-25 05:06:41');
INSERT INTO `websockets_statistics_entries` VALUES ('760', '1312272', '1', '2', '1', '2022-02-25 05:07:41', '2022-02-25 05:07:41');
INSERT INTO `websockets_statistics_entries` VALUES ('761', '1312272', '1', '3', '2', '2022-02-25 05:08:41', '2022-02-25 05:08:41');
INSERT INTO `websockets_statistics_entries` VALUES ('762', '1312272', '1', '2', '1', '2022-02-25 05:09:41', '2022-02-25 05:09:41');
INSERT INTO `websockets_statistics_entries` VALUES ('763', '1312272', '1', '2', '1', '2022-02-25 05:10:41', '2022-02-25 05:10:41');
INSERT INTO `websockets_statistics_entries` VALUES ('764', '1312272', '1', '2', '1', '2022-02-25 05:11:41', '2022-02-25 05:11:41');
INSERT INTO `websockets_statistics_entries` VALUES ('765', '1312272', '1', '2', '2', '2022-02-25 05:12:41', '2022-02-25 05:12:41');
INSERT INTO `websockets_statistics_entries` VALUES ('766', '1312272', '1', '1', '3', '2022-02-25 05:13:41', '2022-02-25 05:13:41');
INSERT INTO `websockets_statistics_entries` VALUES ('767', '1312272', '1', '2', '2', '2022-02-25 05:14:41', '2022-02-25 05:14:41');
INSERT INTO `websockets_statistics_entries` VALUES ('768', '1312272', '1', '2', '1', '2022-02-25 05:15:41', '2022-02-25 05:15:41');
INSERT INTO `websockets_statistics_entries` VALUES ('769', '1312272', '1', '1', '5', '2022-02-25 05:16:41', '2022-02-25 05:16:41');
INSERT INTO `websockets_statistics_entries` VALUES ('770', '1312272', '1', '2', '2', '2022-02-25 05:17:41', '2022-02-25 05:17:41');
INSERT INTO `websockets_statistics_entries` VALUES ('771', '1312272', '1', '2', '1', '2022-02-25 05:18:41', '2022-02-25 05:18:41');
INSERT INTO `websockets_statistics_entries` VALUES ('772', '1312272', '1', '1', '1', '2022-02-25 05:19:41', '2022-02-25 05:19:41');
INSERT INTO `websockets_statistics_entries` VALUES ('773', '1312272', '1', '2', '2', '2022-02-25 05:20:41', '2022-02-25 05:20:41');
INSERT INTO `websockets_statistics_entries` VALUES ('774', '1312272', '1', '2', '1', '2022-02-25 05:21:41', '2022-02-25 05:21:41');
INSERT INTO `websockets_statistics_entries` VALUES ('775', '1312272', '1', '2', '1', '2022-02-25 05:22:41', '2022-02-25 05:22:41');
INSERT INTO `websockets_statistics_entries` VALUES ('776', '1312272', '1', '2', '1', '2022-02-25 05:23:41', '2022-02-25 05:23:41');
INSERT INTO `websockets_statistics_entries` VALUES ('777', '1312272', '1', '2', '1', '2022-02-25 05:24:41', '2022-02-25 05:24:41');
INSERT INTO `websockets_statistics_entries` VALUES ('778', '1312272', '1', '2', '1', '2022-02-25 05:25:41', '2022-02-25 05:25:41');
INSERT INTO `websockets_statistics_entries` VALUES ('779', '1312272', '1', '2', '1', '2022-02-25 05:26:41', '2022-02-25 05:26:41');
INSERT INTO `websockets_statistics_entries` VALUES ('780', '1312272', '1', '2', '1', '2022-02-25 05:27:41', '2022-02-25 05:27:41');
INSERT INTO `websockets_statistics_entries` VALUES ('781', '1312272', '1', '2', '1', '2022-02-25 05:28:41', '2022-02-25 05:28:41');
INSERT INTO `websockets_statistics_entries` VALUES ('782', '1312272', '1', '3', '2', '2022-02-25 05:29:41', '2022-02-25 05:29:41');
INSERT INTO `websockets_statistics_entries` VALUES ('783', '1312272', '1', '2', '3', '2022-02-25 05:30:41', '2022-02-25 05:30:41');
INSERT INTO `websockets_statistics_entries` VALUES ('784', '1312272', '1', '2', '1', '2022-02-25 05:31:41', '2022-02-25 05:31:41');
INSERT INTO `websockets_statistics_entries` VALUES ('785', '1312272', '1', '1', '2', '2022-02-25 05:32:41', '2022-02-25 05:32:41');
INSERT INTO `websockets_statistics_entries` VALUES ('786', '1312272', '1', '2', '3', '2022-02-25 05:33:41', '2022-02-25 05:33:41');
INSERT INTO `websockets_statistics_entries` VALUES ('787', '1312272', '1', '2', '1', '2022-02-25 05:34:41', '2022-02-25 05:34:41');
INSERT INTO `websockets_statistics_entries` VALUES ('788', '1312272', '1', '2', '2', '2022-02-25 05:35:42', '2022-02-25 05:35:42');
INSERT INTO `websockets_statistics_entries` VALUES ('789', '1312272', '1', '1', '5', '2022-02-25 05:36:41', '2022-02-25 05:36:41');
INSERT INTO `websockets_statistics_entries` VALUES ('790', '1312272', '1', '3', '2', '2022-02-25 05:37:41', '2022-02-25 05:37:41');
INSERT INTO `websockets_statistics_entries` VALUES ('791', '1312272', '1', '1', '3', '2022-02-25 05:38:41', '2022-02-25 05:38:41');
INSERT INTO `websockets_statistics_entries` VALUES ('792', '1312272', '1', '3', '3', '2022-02-25 05:39:41', '2022-02-25 05:39:41');
INSERT INTO `websockets_statistics_entries` VALUES ('793', '1312272', '1', '2', '2', '2022-02-25 05:40:41', '2022-02-25 05:40:41');
INSERT INTO `websockets_statistics_entries` VALUES ('794', '1312272', '1', '2', '1', '2022-02-25 05:41:41', '2022-02-25 05:41:41');
INSERT INTO `websockets_statistics_entries` VALUES ('795', '1312272', '1', '2', '1', '2022-02-25 05:42:41', '2022-02-25 05:42:41');
INSERT INTO `websockets_statistics_entries` VALUES ('796', '1312272', '1', '2', '1', '2022-02-25 05:43:41', '2022-02-25 05:43:41');
INSERT INTO `websockets_statistics_entries` VALUES ('797', '1312272', '1', '2', '1', '2022-02-25 05:44:41', '2022-02-25 05:44:41');
INSERT INTO `websockets_statistics_entries` VALUES ('798', '1312272', '1', '2', '1', '2022-02-25 05:45:41', '2022-02-25 05:45:41');
INSERT INTO `websockets_statistics_entries` VALUES ('799', '1312272', '1', '2', '1', '2022-02-25 05:46:41', '2022-02-25 05:46:41');
INSERT INTO `websockets_statistics_entries` VALUES ('800', '1312272', '1', '1', '1', '2022-02-25 05:47:41', '2022-02-25 05:47:41');
INSERT INTO `websockets_statistics_entries` VALUES ('801', '1312272', '1', '3', '3', '2022-02-25 05:48:41', '2022-02-25 05:48:41');
INSERT INTO `websockets_statistics_entries` VALUES ('802', '1312272', '2', '2', '0', '2022-02-25 05:52:00', '2022-02-25 05:52:00');
INSERT INTO `websockets_statistics_entries` VALUES ('803', '1312272', '1', '2', '3', '2022-02-25 05:53:00', '2022-02-25 05:53:00');
INSERT INTO `websockets_statistics_entries` VALUES ('804', '1312272', '1', '2', '1', '2022-02-25 05:54:00', '2022-02-25 05:54:00');
INSERT INTO `websockets_statistics_entries` VALUES ('805', '1312272', '1', '2', '1', '2022-02-25 05:55:00', '2022-02-25 05:55:00');
INSERT INTO `websockets_statistics_entries` VALUES ('806', '1312272', '1', '2', '1', '2022-02-25 05:56:00', '2022-02-25 05:56:00');
INSERT INTO `websockets_statistics_entries` VALUES ('807', '1312272', '1', '1', '1', '2022-02-25 06:54:19', '2022-02-25 06:54:19');
INSERT INTO `websockets_statistics_entries` VALUES ('808', '1312272', '1', '2', '1', '2022-02-25 06:55:19', '2022-02-25 06:55:19');
INSERT INTO `websockets_statistics_entries` VALUES ('809', '1312272', '1', '2', '1', '2022-02-25 06:56:19', '2022-02-25 06:56:19');
INSERT INTO `websockets_statistics_entries` VALUES ('810', '1312272', '1', '2', '1', '2022-02-25 06:57:19', '2022-02-25 06:57:19');
INSERT INTO `websockets_statistics_entries` VALUES ('811', '1312272', '1', '2', '1', '2022-02-25 06:58:19', '2022-02-25 06:58:19');
INSERT INTO `websockets_statistics_entries` VALUES ('812', '1312272', '1', '2', '1', '2022-02-25 06:59:19', '2022-02-25 06:59:19');
INSERT INTO `websockets_statistics_entries` VALUES ('813', '1312272', '1', '2', '1', '2022-02-25 07:00:19', '2022-02-25 07:00:19');
INSERT INTO `websockets_statistics_entries` VALUES ('814', '1312272', '1', '2', '1', '2022-02-25 07:01:19', '2022-02-25 07:01:19');
INSERT INTO `websockets_statistics_entries` VALUES ('815', '1312272', '1', '2', '1', '2022-02-25 07:02:19', '2022-02-25 07:02:19');
INSERT INTO `websockets_statistics_entries` VALUES ('816', '1312272', '1', '2', '1', '2022-02-25 07:03:19', '2022-02-25 07:03:19');
INSERT INTO `websockets_statistics_entries` VALUES ('817', '1312272', '1', '2', '1', '2022-02-25 07:04:19', '2022-02-25 07:04:19');
INSERT INTO `websockets_statistics_entries` VALUES ('818', '1312272', '1', '2', '1', '2022-02-25 07:05:19', '2022-02-25 07:05:19');
INSERT INTO `websockets_statistics_entries` VALUES ('819', '1312272', '1', '2', '1', '2022-02-25 07:06:19', '2022-02-25 07:06:19');
INSERT INTO `websockets_statistics_entries` VALUES ('820', '1312272', '1', '2', '1', '2022-02-25 07:07:19', '2022-02-25 07:07:19');
INSERT INTO `websockets_statistics_entries` VALUES ('821', '1312272', '1', '2', '1', '2022-02-25 07:08:19', '2022-02-25 07:08:19');
INSERT INTO `websockets_statistics_entries` VALUES ('822', '1312272', '1', '1', '1', '2022-02-25 07:09:19', '2022-02-25 07:09:19');
INSERT INTO `websockets_statistics_entries` VALUES ('823', '1312272', '1', '2', '1', '2022-02-25 07:10:19', '2022-02-25 07:10:19');
INSERT INTO `websockets_statistics_entries` VALUES ('824', '1312272', '1', '2', '1', '2022-02-25 07:11:19', '2022-02-25 07:11:19');
INSERT INTO `websockets_statistics_entries` VALUES ('825', '1312272', '1', '2', '1', '2022-02-25 07:12:19', '2022-02-25 07:12:19');
INSERT INTO `websockets_statistics_entries` VALUES ('826', '1312272', '1', '2', '1', '2022-02-25 07:13:19', '2022-02-25 07:13:19');
INSERT INTO `websockets_statistics_entries` VALUES ('827', '1312272', '1', '2', '1', '2022-02-25 07:14:19', '2022-02-25 07:14:19');
INSERT INTO `websockets_statistics_entries` VALUES ('828', '1312272', '1', '2', '1', '2022-02-25 07:15:19', '2022-02-25 07:15:19');
INSERT INTO `websockets_statistics_entries` VALUES ('829', '1312272', '1', '2', '1', '2022-02-25 07:16:19', '2022-02-25 07:16:19');
INSERT INTO `websockets_statistics_entries` VALUES ('830', '1312272', '1', '2', '1', '2022-02-25 07:17:19', '2022-02-25 07:17:19');
INSERT INTO `websockets_statistics_entries` VALUES ('831', '1312272', '1', '2', '1', '2022-02-25 07:18:19', '2022-02-25 07:18:19');
INSERT INTO `websockets_statistics_entries` VALUES ('832', '1312272', '1', '2', '1', '2022-02-25 07:19:19', '2022-02-25 07:19:19');
INSERT INTO `websockets_statistics_entries` VALUES ('833', '1312272', '1', '2', '1', '2022-02-25 07:20:19', '2022-02-25 07:20:19');
INSERT INTO `websockets_statistics_entries` VALUES ('834', '1312272', '1', '2', '1', '2022-02-25 07:21:19', '2022-02-25 07:21:19');
INSERT INTO `websockets_statistics_entries` VALUES ('835', '1312272', '1', '2', '1', '2022-02-25 07:22:19', '2022-02-25 07:22:19');
INSERT INTO `websockets_statistics_entries` VALUES ('836', '1312272', '1', '2', '1', '2022-02-25 07:23:19', '2022-02-25 07:23:19');
INSERT INTO `websockets_statistics_entries` VALUES ('837', '1312272', '1', '1', '1', '2022-02-25 07:24:19', '2022-02-25 07:24:19');
INSERT INTO `websockets_statistics_entries` VALUES ('838', '1312272', '1', '2', '1', '2022-02-25 07:25:19', '2022-02-25 07:25:19');
INSERT INTO `websockets_statistics_entries` VALUES ('839', '1312272', '1', '2', '1', '2022-02-25 07:26:19', '2022-02-25 07:26:19');
INSERT INTO `websockets_statistics_entries` VALUES ('840', '1312272', '1', '2', '1', '2022-02-25 07:27:19', '2022-02-25 07:27:19');
INSERT INTO `websockets_statistics_entries` VALUES ('841', '1312272', '1', '2', '1', '2022-02-25 07:28:19', '2022-02-25 07:28:19');
INSERT INTO `websockets_statistics_entries` VALUES ('842', '1312272', '1', '2', '1', '2022-02-25 07:29:19', '2022-02-25 07:29:19');
INSERT INTO `websockets_statistics_entries` VALUES ('843', '1312272', '1', '2', '1', '2022-02-25 07:30:19', '2022-02-25 07:30:19');
INSERT INTO `websockets_statistics_entries` VALUES ('844', '1312272', '1', '2', '1', '2022-02-25 07:31:19', '2022-02-25 07:31:19');
INSERT INTO `websockets_statistics_entries` VALUES ('845', '1312272', '1', '2', '1', '2022-02-25 07:32:19', '2022-02-25 07:32:19');
INSERT INTO `websockets_statistics_entries` VALUES ('846', '1312272', '1', '2', '1', '2022-02-25 07:33:19', '2022-02-25 07:33:19');
INSERT INTO `websockets_statistics_entries` VALUES ('847', '1312272', '1', '2', '1', '2022-02-25 07:34:19', '2022-02-25 07:34:19');
INSERT INTO `websockets_statistics_entries` VALUES ('848', '1312272', '1', '2', '1', '2022-02-25 07:35:19', '2022-02-25 07:35:19');
INSERT INTO `websockets_statistics_entries` VALUES ('849', '1312272', '1', '2', '1', '2022-02-25 07:36:19', '2022-02-25 07:36:19');
INSERT INTO `websockets_statistics_entries` VALUES ('850', '1312272', '1', '2', '1', '2022-02-25 07:37:19', '2022-02-25 07:37:19');
INSERT INTO `websockets_statistics_entries` VALUES ('851', '1312272', '1', '2', '1', '2022-02-25 07:38:19', '2022-02-25 07:38:19');
INSERT INTO `websockets_statistics_entries` VALUES ('852', '1312272', '1', '2', '1', '2022-02-25 07:39:19', '2022-02-25 07:39:19');
INSERT INTO `websockets_statistics_entries` VALUES ('853', '1312272', '1', '1', '1', '2022-02-25 07:40:19', '2022-02-25 07:40:19');
INSERT INTO `websockets_statistics_entries` VALUES ('854', '1312272', '1', '2', '1', '2022-02-25 07:41:19', '2022-02-25 07:41:19');
INSERT INTO `websockets_statistics_entries` VALUES ('855', '1312272', '1', '2', '1', '2022-02-25 07:42:20', '2022-02-25 07:42:20');
INSERT INTO `websockets_statistics_entries` VALUES ('856', '1312272', '1', '2', '1', '2022-02-25 07:43:20', '2022-02-25 07:43:20');
INSERT INTO `websockets_statistics_entries` VALUES ('857', '1312272', '1', '2', '1', '2022-02-25 07:44:20', '2022-02-25 07:44:20');
INSERT INTO `websockets_statistics_entries` VALUES ('858', '1312272', '1', '2', '1', '2022-02-25 07:45:20', '2022-02-25 07:45:20');
INSERT INTO `websockets_statistics_entries` VALUES ('859', '1312272', '1', '2', '1', '2022-02-25 07:46:19', '2022-02-25 07:46:19');
INSERT INTO `websockets_statistics_entries` VALUES ('860', '1312272', '1', '2', '1', '2022-02-25 07:47:20', '2022-02-25 07:47:20');
INSERT INTO `websockets_statistics_entries` VALUES ('861', '1312272', '1', '2', '1', '2022-02-25 07:48:20', '2022-02-25 07:48:20');
INSERT INTO `websockets_statistics_entries` VALUES ('862', '1312272', '1', '2', '1', '2022-02-25 07:49:20', '2022-02-25 07:49:20');
INSERT INTO `websockets_statistics_entries` VALUES ('863', '1312272', '1', '2', '1', '2022-02-25 07:50:20', '2022-02-25 07:50:20');
INSERT INTO `websockets_statistics_entries` VALUES ('864', '1312272', '1', '2', '1', '2022-02-25 07:51:20', '2022-02-25 07:51:20');
INSERT INTO `websockets_statistics_entries` VALUES ('865', '1312272', '1', '2', '1', '2022-02-25 07:52:20', '2022-02-25 07:52:20');
INSERT INTO `websockets_statistics_entries` VALUES ('866', '1312272', '1', '2', '1', '2022-02-25 07:53:20', '2022-02-25 07:53:20');
INSERT INTO `websockets_statistics_entries` VALUES ('867', '1312272', '1', '2', '1', '2022-02-25 07:54:20', '2022-02-25 07:54:20');
INSERT INTO `websockets_statistics_entries` VALUES ('868', '1312272', '1', '2', '1', '2022-02-25 07:55:20', '2022-02-25 07:55:20');
INSERT INTO `websockets_statistics_entries` VALUES ('869', '1312272', '1', '1', '1', '2022-02-25 07:56:20', '2022-02-25 07:56:20');
INSERT INTO `websockets_statistics_entries` VALUES ('870', '1312272', '1', '2', '1', '2022-02-25 07:57:20', '2022-02-25 07:57:20');
INSERT INTO `websockets_statistics_entries` VALUES ('871', '1312272', '1', '2', '1', '2022-02-25 07:58:20', '2022-02-25 07:58:20');
INSERT INTO `websockets_statistics_entries` VALUES ('872', '1312272', '1', '2', '1', '2022-02-25 07:59:20', '2022-02-25 07:59:20');
INSERT INTO `websockets_statistics_entries` VALUES ('873', '1312272', '1', '2', '1', '2022-02-25 08:00:20', '2022-02-25 08:00:20');
INSERT INTO `websockets_statistics_entries` VALUES ('874', '1312272', '1', '2', '1', '2022-02-25 08:01:20', '2022-02-25 08:01:20');
INSERT INTO `websockets_statistics_entries` VALUES ('875', '1312272', '1', '2', '1', '2022-02-25 08:02:20', '2022-02-25 08:02:20');
INSERT INTO `websockets_statistics_entries` VALUES ('876', '1312272', '1', '2', '1', '2022-02-25 08:03:20', '2022-02-25 08:03:20');
INSERT INTO `websockets_statistics_entries` VALUES ('877', '1312272', '1', '2', '1', '2022-02-25 08:04:20', '2022-02-25 08:04:20');
INSERT INTO `websockets_statistics_entries` VALUES ('878', '1312272', '1', '2', '1', '2022-02-25 08:05:20', '2022-02-25 08:05:20');
INSERT INTO `websockets_statistics_entries` VALUES ('879', '1312272', '1', '2', '1', '2022-02-25 08:06:20', '2022-02-25 08:06:20');
INSERT INTO `websockets_statistics_entries` VALUES ('880', '1312272', '1', '2', '1', '2022-02-25 08:07:20', '2022-02-25 08:07:20');
INSERT INTO `websockets_statistics_entries` VALUES ('881', '1312272', '1', '2', '1', '2022-02-25 08:08:20', '2022-02-25 08:08:20');
INSERT INTO `websockets_statistics_entries` VALUES ('882', '1312272', '1', '2', '1', '2022-02-25 08:09:20', '2022-02-25 08:09:20');
INSERT INTO `websockets_statistics_entries` VALUES ('883', '1312272', '1', '2', '1', '2022-02-25 08:10:20', '2022-02-25 08:10:20');
INSERT INTO `websockets_statistics_entries` VALUES ('884', '1312272', '1', '1', '1', '2022-02-25 08:11:20', '2022-02-25 08:11:20');
INSERT INTO `websockets_statistics_entries` VALUES ('885', '1312272', '1', '2', '1', '2022-02-25 08:12:20', '2022-02-25 08:12:20');
INSERT INTO `websockets_statistics_entries` VALUES ('886', '1312272', '1', '2', '1', '2022-02-25 08:13:20', '2022-02-25 08:13:20');
INSERT INTO `websockets_statistics_entries` VALUES ('887', '1312272', '1', '2', '1', '2022-02-25 08:14:20', '2022-02-25 08:14:20');
INSERT INTO `websockets_statistics_entries` VALUES ('888', '1312272', '1', '2', '1', '2022-02-25 08:15:20', '2022-02-25 08:15:20');
INSERT INTO `websockets_statistics_entries` VALUES ('889', '1312272', '1', '2', '1', '2022-02-25 08:16:20', '2022-02-25 08:16:20');
INSERT INTO `websockets_statistics_entries` VALUES ('890', '1312272', '1', '2', '1', '2022-02-25 08:17:20', '2022-02-25 08:17:20');
INSERT INTO `websockets_statistics_entries` VALUES ('891', '1312272', '1', '2', '1', '2022-02-25 08:18:20', '2022-02-25 08:18:20');
INSERT INTO `websockets_statistics_entries` VALUES ('892', '1312272', '1', '2', '1', '2022-02-25 08:19:20', '2022-02-25 08:19:20');
INSERT INTO `websockets_statistics_entries` VALUES ('893', '1312272', '1', '2', '1', '2022-02-25 08:20:20', '2022-02-25 08:20:20');
INSERT INTO `websockets_statistics_entries` VALUES ('894', '1312272', '1', '2', '1', '2022-02-25 08:21:20', '2022-02-25 08:21:20');
INSERT INTO `websockets_statistics_entries` VALUES ('895', '1312272', '1', '2', '1', '2022-02-25 08:22:20', '2022-02-25 08:22:20');
INSERT INTO `websockets_statistics_entries` VALUES ('896', '1312272', '1', '2', '1', '2022-02-25 08:23:20', '2022-02-25 08:23:20');
INSERT INTO `websockets_statistics_entries` VALUES ('897', '1312272', '1', '2', '1', '2022-02-25 08:24:20', '2022-02-25 08:24:20');
INSERT INTO `websockets_statistics_entries` VALUES ('898', '1312272', '1', '2', '1', '2022-02-25 08:25:20', '2022-02-25 08:25:20');
INSERT INTO `websockets_statistics_entries` VALUES ('899', '1312272', '1', '2', '1', '2022-02-25 08:26:20', '2022-02-25 08:26:20');
INSERT INTO `websockets_statistics_entries` VALUES ('900', '1312272', '1', '1', '1', '2022-02-25 08:27:20', '2022-02-25 08:27:20');
INSERT INTO `websockets_statistics_entries` VALUES ('901', '1312272', '1', '1', '1', '2022-02-25 08:29:48', '2022-02-25 08:29:48');
INSERT INTO `websockets_statistics_entries` VALUES ('902', '1312272', '1', '2', '1', '2022-02-25 08:30:48', '2022-02-25 08:30:48');
INSERT INTO `websockets_statistics_entries` VALUES ('903', '1312272', '1', '2', '1', '2022-02-25 08:31:48', '2022-02-25 08:31:48');
INSERT INTO `websockets_statistics_entries` VALUES ('904', '1312272', '1', '2', '1', '2022-02-25 08:32:48', '2022-02-25 08:32:48');
INSERT INTO `websockets_statistics_entries` VALUES ('905', '1312272', '1', '2', '1', '2022-02-25 08:33:48', '2022-02-25 08:33:48');
INSERT INTO `websockets_statistics_entries` VALUES ('906', '1312272', '1', '2', '1', '2022-02-25 08:34:48', '2022-02-25 08:34:48');
INSERT INTO `websockets_statistics_entries` VALUES ('907', '1312272', '1', '2', '1', '2022-02-25 08:35:48', '2022-02-25 08:35:48');
INSERT INTO `websockets_statistics_entries` VALUES ('908', '1312272', '1', '2', '1', '2022-02-25 08:36:48', '2022-02-25 08:36:48');
INSERT INTO `websockets_statistics_entries` VALUES ('909', '1312272', '1', '1', '1', '2022-02-25 08:37:48', '2022-02-25 08:37:48');
INSERT INTO `websockets_statistics_entries` VALUES ('910', '1312272', '1', '2', '1', '2022-02-25 08:38:48', '2022-02-25 08:38:48');
INSERT INTO `websockets_statistics_entries` VALUES ('911', '1312272', '1', '2', '1', '2022-02-25 08:39:48', '2022-02-25 08:39:48');
INSERT INTO `websockets_statistics_entries` VALUES ('912', '1312272', '1', '3', '1', '2022-02-25 08:40:48', '2022-02-25 08:40:48');
INSERT INTO `websockets_statistics_entries` VALUES ('913', '1312272', '1', '2', '1', '2022-02-25 08:41:48', '2022-02-25 08:41:48');
INSERT INTO `websockets_statistics_entries` VALUES ('914', '1312272', '1', '2', '1', '2022-02-25 08:42:48', '2022-02-25 08:42:48');
INSERT INTO `websockets_statistics_entries` VALUES ('915', '1312272', '1', '2', '1', '2022-02-25 08:43:48', '2022-02-25 08:43:48');
INSERT INTO `websockets_statistics_entries` VALUES ('916', '1312272', '1', '2', '1', '2022-02-25 08:44:48', '2022-02-25 08:44:48');
INSERT INTO `websockets_statistics_entries` VALUES ('917', '1312272', '1', '2', '1', '2022-02-25 08:45:48', '2022-02-25 08:45:48');
INSERT INTO `websockets_statistics_entries` VALUES ('918', '1312272', '1', '2', '1', '2022-02-25 08:46:48', '2022-02-25 08:46:48');
INSERT INTO `websockets_statistics_entries` VALUES ('919', '1312272', '1', '2', '1', '2022-02-25 08:47:48', '2022-02-25 08:47:48');
INSERT INTO `websockets_statistics_entries` VALUES ('920', '1312272', '1', '2', '1', '2022-02-25 08:48:48', '2022-02-25 08:48:48');
INSERT INTO `websockets_statistics_entries` VALUES ('921', '1312272', '1', '2', '1', '2022-02-25 08:49:48', '2022-02-25 08:49:48');
INSERT INTO `websockets_statistics_entries` VALUES ('922', '1312272', '1', '2', '1', '2022-02-25 08:50:48', '2022-02-25 08:50:48');
INSERT INTO `websockets_statistics_entries` VALUES ('923', '1312272', '1', '1', '1', '2022-02-25 08:51:48', '2022-02-25 08:51:48');
INSERT INTO `websockets_statistics_entries` VALUES ('924', '1312272', '1', '2', '1', '2022-02-25 08:52:48', '2022-02-25 08:52:48');
INSERT INTO `websockets_statistics_entries` VALUES ('925', '1312272', '1', '2', '1', '2022-02-25 08:53:48', '2022-02-25 08:53:48');
INSERT INTO `websockets_statistics_entries` VALUES ('926', '1312272', '1', '2', '1', '2022-02-25 08:54:48', '2022-02-25 08:54:48');
INSERT INTO `websockets_statistics_entries` VALUES ('927', '1312272', '1', '2', '1', '2022-02-25 08:55:48', '2022-02-25 08:55:48');
INSERT INTO `websockets_statistics_entries` VALUES ('928', '1312272', '1', '2', '1', '2022-02-25 08:56:48', '2022-02-25 08:56:48');
INSERT INTO `websockets_statistics_entries` VALUES ('929', '1312272', '1', '2', '1', '2022-02-25 08:57:48', '2022-02-25 08:57:48');
INSERT INTO `websockets_statistics_entries` VALUES ('930', '1312272', '1', '2', '1', '2022-02-25 08:58:48', '2022-02-25 08:58:48');
INSERT INTO `websockets_statistics_entries` VALUES ('931', '1312272', '1', '2', '1', '2022-02-25 08:59:48', '2022-02-25 08:59:48');
INSERT INTO `websockets_statistics_entries` VALUES ('932', '1312272', '1', '2', '1', '2022-02-25 09:00:48', '2022-02-25 09:00:48');
INSERT INTO `websockets_statistics_entries` VALUES ('933', '1312272', '1', '2', '1', '2022-02-25 09:01:48', '2022-02-25 09:01:48');
INSERT INTO `websockets_statistics_entries` VALUES ('934', '1312272', '1', '2', '1', '2022-02-25 09:02:48', '2022-02-25 09:02:48');
INSERT INTO `websockets_statistics_entries` VALUES ('935', '1312272', '1', '2', '1', '2022-02-25 09:03:48', '2022-02-25 09:03:48');
INSERT INTO `websockets_statistics_entries` VALUES ('936', '1312272', '1', '2', '0', '2022-02-26 00:13:48', '2022-02-26 00:13:48');
INSERT INTO `websockets_statistics_entries` VALUES ('937', '1312272', '1', '2', '1', '2022-02-26 00:14:48', '2022-02-26 00:14:48');
INSERT INTO `websockets_statistics_entries` VALUES ('938', '1312272', '1', '2', '1', '2022-02-26 00:15:48', '2022-02-26 00:15:48');
INSERT INTO `websockets_statistics_entries` VALUES ('939', '1312272', '1', '2', '1', '2022-02-26 00:16:48', '2022-02-26 00:16:48');
INSERT INTO `websockets_statistics_entries` VALUES ('940', '1312272', '1', '2', '1', '2022-02-26 00:17:48', '2022-02-26 00:17:48');
INSERT INTO `websockets_statistics_entries` VALUES ('941', '1312272', '2', '10', '1', '2022-02-26 00:18:48', '2022-02-26 00:18:48');
INSERT INTO `websockets_statistics_entries` VALUES ('942', '1312272', '2', '3', '1', '2022-02-26 00:19:48', '2022-02-26 00:19:48');
INSERT INTO `websockets_statistics_entries` VALUES ('943', '1312272', '2', '3', '1', '2022-02-26 00:20:48', '2022-02-26 00:20:48');
INSERT INTO `websockets_statistics_entries` VALUES ('944', '1312272', '2', '3', '1', '2022-02-26 00:21:48', '2022-02-26 00:21:48');
INSERT INTO `websockets_statistics_entries` VALUES ('945', '1312272', '2', '2', '2', '2022-02-26 00:22:48', '2022-02-26 00:22:48');
INSERT INTO `websockets_statistics_entries` VALUES ('946', '1312272', '2', '3', '2', '2022-02-26 00:23:48', '2022-02-26 00:23:48');
INSERT INTO `websockets_statistics_entries` VALUES ('947', '1312272', '2', '3', '1', '2022-02-26 00:24:48', '2022-02-26 00:24:48');
INSERT INTO `websockets_statistics_entries` VALUES ('948', '1312272', '2', '3', '1', '2022-02-26 00:25:48', '2022-02-26 00:25:48');
INSERT INTO `websockets_statistics_entries` VALUES ('949', '1312272', '2', '3', '1', '2022-02-26 00:26:48', '2022-02-26 00:26:48');
INSERT INTO `websockets_statistics_entries` VALUES ('950', '1312272', '2', '3', '1', '2022-02-26 00:27:48', '2022-02-26 00:27:48');
INSERT INTO `websockets_statistics_entries` VALUES ('951', '1312272', '2', '3', '1', '2022-02-26 00:28:48', '2022-02-26 00:28:48');
INSERT INTO `websockets_statistics_entries` VALUES ('952', '1312272', '2', '2', '1', '2022-02-26 00:29:48', '2022-02-26 00:29:48');
INSERT INTO `websockets_statistics_entries` VALUES ('953', '1312272', '2', '3', '1', '2022-02-26 00:30:48', '2022-02-26 00:30:48');
INSERT INTO `websockets_statistics_entries` VALUES ('954', '1312272', '2', '3', '1', '2022-02-26 00:31:48', '2022-02-26 00:31:48');
INSERT INTO `websockets_statistics_entries` VALUES ('955', '1312272', '2', '3', '1', '2022-02-26 00:32:48', '2022-02-26 00:32:48');
INSERT INTO `websockets_statistics_entries` VALUES ('956', '1312272', '2', '3', '1', '2022-02-26 00:33:48', '2022-02-26 00:33:48');
INSERT INTO `websockets_statistics_entries` VALUES ('957', '1312272', '2', '3', '1', '2022-02-26 00:34:48', '2022-02-26 00:34:48');
INSERT INTO `websockets_statistics_entries` VALUES ('958', '1312272', '2', '3', '1', '2022-02-26 00:35:48', '2022-02-26 00:35:48');
INSERT INTO `websockets_statistics_entries` VALUES ('959', '1312272', '2', '3', '1', '2022-02-26 00:36:48', '2022-02-26 00:36:48');
INSERT INTO `websockets_statistics_entries` VALUES ('960', '1312272', '2', '3', '1', '2022-02-26 00:37:48', '2022-02-26 00:37:48');
INSERT INTO `websockets_statistics_entries` VALUES ('961', '1312272', '2', '3', '1', '2022-02-26 00:38:48', '2022-02-26 00:38:48');
INSERT INTO `websockets_statistics_entries` VALUES ('962', '1312272', '2', '3', '1', '2022-02-26 00:39:48', '2022-02-26 00:39:48');
INSERT INTO `websockets_statistics_entries` VALUES ('963', '1312272', '2', '3', '1', '2022-02-26 00:40:48', '2022-02-26 00:40:48');
INSERT INTO `websockets_statistics_entries` VALUES ('964', '1312272', '2', '3', '1', '2022-02-26 00:41:48', '2022-02-26 00:41:48');
INSERT INTO `websockets_statistics_entries` VALUES ('965', '1312272', '2', '3', '1', '2022-02-26 00:42:48', '2022-02-26 00:42:48');
INSERT INTO `websockets_statistics_entries` VALUES ('966', '1312272', '2', '3', '1', '2022-02-26 00:43:48', '2022-02-26 00:43:48');
INSERT INTO `websockets_statistics_entries` VALUES ('967', '1312272', '2', '3', '1', '2022-02-26 00:44:48', '2022-02-26 00:44:48');
INSERT INTO `websockets_statistics_entries` VALUES ('968', '1312272', '2', '3', '1', '2022-02-26 00:45:48', '2022-02-26 00:45:48');
INSERT INTO `websockets_statistics_entries` VALUES ('969', '1312272', '2', '2', '1', '2022-02-26 00:46:48', '2022-02-26 00:46:48');
INSERT INTO `websockets_statistics_entries` VALUES ('970', '1312272', '2', '3', '1', '2022-02-26 00:47:48', '2022-02-26 00:47:48');
INSERT INTO `websockets_statistics_entries` VALUES ('971', '1312272', '2', '3', '1', '2022-02-26 00:48:48', '2022-02-26 00:48:48');
INSERT INTO `websockets_statistics_entries` VALUES ('972', '1312272', '2', '3', '1', '2022-02-26 00:49:48', '2022-02-26 00:49:48');
INSERT INTO `websockets_statistics_entries` VALUES ('973', '1312272', '2', '3', '1', '2022-02-26 00:50:48', '2022-02-26 00:50:48');
INSERT INTO `websockets_statistics_entries` VALUES ('974', '1312272', '2', '3', '2', '2022-02-26 00:51:48', '2022-02-26 00:51:48');
INSERT INTO `websockets_statistics_entries` VALUES ('975', '1312272', '2', '3', '1', '2022-02-26 00:52:48', '2022-02-26 00:52:48');
INSERT INTO `websockets_statistics_entries` VALUES ('976', '1312272', '2', '3', '1', '2022-02-26 00:53:48', '2022-02-26 00:53:48');
INSERT INTO `websockets_statistics_entries` VALUES ('977', '1312272', '2', '3', '1', '2022-02-26 00:54:48', '2022-02-26 00:54:48');
INSERT INTO `websockets_statistics_entries` VALUES ('978', '1312272', '2', '3', '1', '2022-02-26 00:55:48', '2022-02-26 00:55:48');
INSERT INTO `websockets_statistics_entries` VALUES ('979', '1312272', '2', '3', '1', '2022-02-26 00:56:48', '2022-02-26 00:56:48');
INSERT INTO `websockets_statistics_entries` VALUES ('980', '1312272', '2', '3', '1', '2022-02-26 00:57:48', '2022-02-26 00:57:48');
INSERT INTO `websockets_statistics_entries` VALUES ('981', '1312272', '2', '3', '1', '2022-02-26 00:58:48', '2022-02-26 00:58:48');
INSERT INTO `websockets_statistics_entries` VALUES ('982', '1312272', '2', '2', '1', '2022-02-26 00:59:48', '2022-02-26 00:59:48');
INSERT INTO `websockets_statistics_entries` VALUES ('983', '1312272', '2', '3', '1', '2022-02-26 01:00:48', '2022-02-26 01:00:48');
INSERT INTO `websockets_statistics_entries` VALUES ('984', '1312272', '2', '3', '1', '2022-02-26 01:01:48', '2022-02-26 01:01:48');
INSERT INTO `websockets_statistics_entries` VALUES ('985', '1312272', '2', '3', '1', '2022-02-26 01:02:48', '2022-02-26 01:02:48');
INSERT INTO `websockets_statistics_entries` VALUES ('986', '1312272', '2', '3', '1', '2022-02-26 01:03:48', '2022-02-26 01:03:48');
INSERT INTO `websockets_statistics_entries` VALUES ('987', '1312272', '2', '3', '1', '2022-02-26 01:04:48', '2022-02-26 01:04:48');
INSERT INTO `websockets_statistics_entries` VALUES ('988', '1312272', '2', '3', '1', '2022-02-26 01:05:48', '2022-02-26 01:05:48');
INSERT INTO `websockets_statistics_entries` VALUES ('989', '1312272', '2', '3', '1', '2022-02-26 01:06:48', '2022-02-26 01:06:48');
INSERT INTO `websockets_statistics_entries` VALUES ('990', '1312272', '2', '3', '1', '2022-02-26 01:07:48', '2022-02-26 01:07:48');
INSERT INTO `websockets_statistics_entries` VALUES ('991', '1312272', '2', '3', '1', '2022-02-26 01:08:48', '2022-02-26 01:08:48');
INSERT INTO `websockets_statistics_entries` VALUES ('992', '1312272', '2', '3', '1', '2022-02-26 01:09:48', '2022-02-26 01:09:48');
INSERT INTO `websockets_statistics_entries` VALUES ('993', '1312272', '2', '3', '1', '2022-02-26 01:10:48', '2022-02-26 01:10:48');
INSERT INTO `websockets_statistics_entries` VALUES ('994', '1312272', '2', '3', '1', '2022-02-26 01:11:48', '2022-02-26 01:11:48');
INSERT INTO `websockets_statistics_entries` VALUES ('995', '1312272', '2', '3', '1', '2022-02-26 01:12:48', '2022-02-26 01:12:48');
INSERT INTO `websockets_statistics_entries` VALUES ('996', '1312272', '2', '3', '1', '2022-02-26 01:13:48', '2022-02-26 01:13:48');
INSERT INTO `websockets_statistics_entries` VALUES ('997', '1312272', '2', '3', '1', '2022-02-26 01:14:48', '2022-02-26 01:14:48');
INSERT INTO `websockets_statistics_entries` VALUES ('998', '1312272', '2', '3', '1', '2022-02-26 01:15:48', '2022-02-26 01:15:48');
INSERT INTO `websockets_statistics_entries` VALUES ('999', '1312272', '2', '3', '1', '2022-02-26 01:16:48', '2022-02-26 01:16:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1000', '1312272', '2', '3', '1', '2022-02-26 01:17:48', '2022-02-26 01:17:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1001', '1312272', '2', '3', '1', '2022-02-26 01:18:48', '2022-02-26 01:18:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1002', '1312272', '2', '3', '1', '2022-02-26 01:19:48', '2022-02-26 01:19:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1003', '1312272', '2', '3', '1', '2022-02-26 01:20:48', '2022-02-26 01:20:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1004', '1312272', '2', '3', '1', '2022-02-26 01:21:48', '2022-02-26 01:21:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1005', '1312272', '2', '2', '1', '2022-02-26 01:22:48', '2022-02-26 01:22:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1006', '1312272', '2', '3', '1', '2022-02-26 01:23:48', '2022-02-26 01:23:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1007', '1312272', '2', '3', '1', '2022-02-26 01:24:48', '2022-02-26 01:24:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1008', '1312272', '2', '3', '1', '2022-02-26 01:25:48', '2022-02-26 01:25:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1009', '1312272', '2', '3', '1', '2022-02-26 01:26:48', '2022-02-26 01:26:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1010', '1312272', '2', '3', '1', '2022-02-26 01:27:48', '2022-02-26 01:27:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1011', '1312272', '2', '3', '1', '2022-02-26 01:28:48', '2022-02-26 01:28:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1012', '1312272', '2', '3', '1', '2022-02-26 01:29:48', '2022-02-26 01:29:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1013', '1312272', '2', '3', '1', '2022-02-26 01:30:48', '2022-02-26 01:30:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1014', '1312272', '2', '3', '1', '2022-02-26 01:31:48', '2022-02-26 01:31:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1015', '1312272', '2', '3', '1', '2022-02-26 01:32:48', '2022-02-26 01:32:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1016', '1312272', '2', '3', '1', '2022-02-26 01:33:48', '2022-02-26 01:33:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1017', '1312272', '2', '3', '1', '2022-02-26 01:34:48', '2022-02-26 01:34:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1018', '1312272', '2', '3', '1', '2022-02-26 01:35:48', '2022-02-26 01:35:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1019', '1312272', '2', '3', '1', '2022-02-26 01:36:48', '2022-02-26 01:36:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1020', '1312272', '2', '3', '1', '2022-02-26 01:37:48', '2022-02-26 01:37:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1021', '1312272', '2', '2', '1', '2022-02-26 01:38:48', '2022-02-26 01:38:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1022', '1312272', '2', '3', '1', '2022-02-26 01:39:48', '2022-02-26 01:39:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1023', '1312272', '2', '3', '1', '2022-02-26 01:40:48', '2022-02-26 01:40:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1024', '1312272', '2', '3', '1', '2022-02-26 01:41:48', '2022-02-26 01:41:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1025', '1312272', '2', '3', '1', '2022-02-26 01:42:48', '2022-02-26 01:42:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1026', '1312272', '2', '3', '1', '2022-02-26 01:43:48', '2022-02-26 01:43:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1027', '1312272', '2', '3', '1', '2022-02-26 01:44:48', '2022-02-26 01:44:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1028', '1312272', '2', '3', '1', '2022-02-26 01:45:48', '2022-02-26 01:45:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1029', '1312272', '2', '3', '1', '2022-02-26 01:46:48', '2022-02-26 01:46:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1030', '1312272', '2', '3', '1', '2022-02-26 01:47:48', '2022-02-26 01:47:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1031', '1312272', '2', '3', '1', '2022-02-26 01:48:48', '2022-02-26 01:48:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1032', '1312272', '2', '3', '1', '2022-02-26 01:49:48', '2022-02-26 01:49:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1033', '1312272', '2', '3', '1', '2022-02-26 01:50:48', '2022-02-26 01:50:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1034', '1312272', '2', '3', '1', '2022-02-26 01:51:48', '2022-02-26 01:51:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1035', '1312272', '2', '3', '1', '2022-02-26 01:52:48', '2022-02-26 01:52:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1036', '1312272', '2', '2', '1', '2022-02-26 01:53:48', '2022-02-26 01:53:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1037', '1312272', '2', '3', '1', '2022-02-26 01:54:48', '2022-02-26 01:54:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1038', '1312272', '2', '3', '1', '2022-02-26 01:55:48', '2022-02-26 01:55:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1039', '1312272', '2', '3', '1', '2022-02-26 01:56:48', '2022-02-26 01:56:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1040', '1312272', '2', '3', '1', '2022-02-26 01:57:48', '2022-02-26 01:57:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1041', '1312272', '2', '3', '1', '2022-02-26 01:58:48', '2022-02-26 01:58:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1042', '1312272', '2', '3', '1', '2022-02-26 01:59:48', '2022-02-26 01:59:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1043', '1312272', '2', '3', '1', '2022-02-26 02:00:49', '2022-02-26 02:00:49');
INSERT INTO `websockets_statistics_entries` VALUES ('1044', '1312272', '2', '3', '1', '2022-02-26 02:01:48', '2022-02-26 02:01:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1045', '1312272', '2', '3', '1', '2022-02-26 02:02:48', '2022-02-26 02:02:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1046', '1312272', '2', '3', '1', '2022-02-26 02:03:48', '2022-02-26 02:03:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1047', '1312272', '2', '3', '1', '2022-02-26 02:04:48', '2022-02-26 02:04:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1048', '1312272', '2', '3', '1', '2022-02-26 02:05:48', '2022-02-26 02:05:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1049', '1312272', '2', '2', '2', '2022-02-26 02:06:48', '2022-02-26 02:06:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1050', '1312272', '2', '3', '1', '2022-02-26 02:07:49', '2022-02-26 02:07:49');
INSERT INTO `websockets_statistics_entries` VALUES ('1051', '1312272', '2', '3', '1', '2022-02-26 02:08:48', '2022-02-26 02:08:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1052', '1312272', '2', '3', '1', '2022-02-26 02:09:48', '2022-02-26 02:09:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1053', '1312272', '2', '3', '1', '2022-02-26 02:10:48', '2022-02-26 02:10:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1054', '1312272', '2', '3', '1', '2022-02-26 02:11:48', '2022-02-26 02:11:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1055', '1312272', '2', '3', '1', '2022-02-26 02:12:48', '2022-02-26 02:12:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1056', '1312272', '2', '3', '1', '2022-02-26 02:13:48', '2022-02-26 02:13:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1057', '1312272', '2', '3', '1', '2022-02-26 02:14:48', '2022-02-26 02:14:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1058', '1312272', '2', '3', '1', '2022-02-26 02:15:48', '2022-02-26 02:15:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1059', '1312272', '2', '3', '1', '2022-02-26 02:16:49', '2022-02-26 02:16:49');
INSERT INTO `websockets_statistics_entries` VALUES ('1060', '1312272', '2', '3', '1', '2022-02-26 02:17:48', '2022-02-26 02:17:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1061', '1312272', '2', '3', '1', '2022-02-26 02:18:48', '2022-02-26 02:18:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1062', '1312272', '2', '2', '1', '2022-02-26 02:19:48', '2022-02-26 02:19:48');
INSERT INTO `websockets_statistics_entries` VALUES ('1063', '1312272', '2', '3', '1', '2022-02-26 02:20:49', '2022-02-26 02:20:49');
INSERT INTO `websockets_statistics_entries` VALUES ('1064', '1312272', '2', '3', '1', '2022-02-26 02:21:49', '2022-02-26 02:21:49');
INSERT INTO `websockets_statistics_entries` VALUES ('1065', '1312272', '2', '3', '1', '2022-02-26 02:22:49', '2022-02-26 02:22:49');
INSERT INTO `websockets_statistics_entries` VALUES ('1066', '1312272', '2', '3', '1', '2022-02-26 02:23:49', '2022-02-26 02:23:49');
INSERT INTO `websockets_statistics_entries` VALUES ('1067', '1312272', '2', '3', '1', '2022-02-26 02:24:49', '2022-02-26 02:24:49');
INSERT INTO `websockets_statistics_entries` VALUES ('1068', '1312272', '2', '3', '1', '2022-02-26 02:25:49', '2022-02-26 02:25:49');
INSERT INTO `websockets_statistics_entries` VALUES ('1069', '1312272', '2', '1', '3', '2022-02-26 02:26:49', '2022-02-26 02:26:49');
INSERT INTO `websockets_statistics_entries` VALUES ('1070', '1312272', '2', '1', '1', '2022-02-26 02:27:49', '2022-02-26 02:27:49');
INSERT INTO `websockets_statistics_entries` VALUES ('1071', '1312272', '1', '2', '1', '2022-02-26 02:28:50', '2022-02-26 02:28:50');
INSERT INTO `websockets_statistics_entries` VALUES ('1072', '1312272', '1', '0', '1', '2022-02-26 02:29:49', '2022-02-26 02:29:49');
INSERT INTO `websockets_statistics_entries` VALUES ('1073', '1312272', '1', '1', '1', '2022-02-26 02:30:50', '2022-02-26 02:30:50');
INSERT INTO `websockets_statistics_entries` VALUES ('1074', '1312272', '1', '2', '1', '2022-02-26 02:31:49', '2022-02-26 02:31:49');
INSERT INTO `websockets_statistics_entries` VALUES ('1075', '1312272', '1', '3', '1', '2022-02-26 02:32:49', '2022-02-26 02:32:49');
INSERT INTO `websockets_statistics_entries` VALUES ('1076', '1312272', '1', '3', '4', '2022-02-26 02:33:49', '2022-02-26 02:33:49');
INSERT INTO `websockets_statistics_entries` VALUES ('1077', '1312272', '2', '1', '1', '2022-02-26 02:34:49', '2022-02-26 02:34:49');
INSERT INTO `websockets_statistics_entries` VALUES ('1078', '1312272', '2', '3', '4', '2022-02-26 02:35:49', '2022-02-26 02:35:49');
INSERT INTO `websockets_statistics_entries` VALUES ('1079', '1312272', '2', '3', '1', '2022-02-26 02:36:49', '2022-02-26 02:36:49');
INSERT INTO `websockets_statistics_entries` VALUES ('1080', '1312272', '2', '2', '3', '2022-02-26 02:37:49', '2022-02-26 02:37:49');
INSERT INTO `websockets_statistics_entries` VALUES ('1081', '1312272', '2', '3', '1', '2022-02-26 02:38:49', '2022-02-26 02:38:49');
INSERT INTO `websockets_statistics_entries` VALUES ('1082', '1312272', '2', '3', '1', '2022-02-26 02:39:49', '2022-02-26 02:39:49');
INSERT INTO `websockets_statistics_entries` VALUES ('1083', '1312272', '2', '2', '1', '2022-02-26 02:40:49', '2022-02-26 02:40:49');
INSERT INTO `websockets_statistics_entries` VALUES ('1084', '1312272', '2', '3', '1', '2022-02-26 02:41:49', '2022-02-26 02:41:49');
INSERT INTO `websockets_statistics_entries` VALUES ('1085', '1312272', '2', '3', '1', '2022-02-26 02:42:49', '2022-02-26 02:42:49');
INSERT INTO `websockets_statistics_entries` VALUES ('1086', '1312272', '2', '3', '1', '2022-02-26 02:43:49', '2022-02-26 02:43:49');
INSERT INTO `websockets_statistics_entries` VALUES ('1087', '1312272', '2', '3', '1', '2022-02-26 02:44:49', '2022-02-26 02:44:49');
INSERT INTO `websockets_statistics_entries` VALUES ('1088', '1312272', '2', '3', '1', '2022-02-26 02:45:49', '2022-02-26 02:45:49');
INSERT INTO `websockets_statistics_entries` VALUES ('1089', '1312272', '2', '3', '1', '2022-02-26 02:46:49', '2022-02-26 02:46:49');
INSERT INTO `websockets_statistics_entries` VALUES ('1090', '1312272', '2', '3', '1', '2022-02-26 02:47:49', '2022-02-26 02:47:49');
INSERT INTO `websockets_statistics_entries` VALUES ('1091', '1312272', '2', '11', '1', '2022-02-26 02:48:49', '2022-02-26 02:48:49');
INSERT INTO `websockets_statistics_entries` VALUES ('1092', '1312272', '2', '2', '1', '2022-02-26 02:49:49', '2022-02-26 02:49:49');
INSERT INTO `websockets_statistics_entries` VALUES ('1093', '1312272', '1', '2', '1', '2022-02-26 02:50:49', '2022-02-26 02:50:49');
INSERT INTO `websockets_statistics_entries` VALUES ('1094', '1312272', '1', '2', '1', '2022-02-26 02:51:49', '2022-02-26 02:51:49');
INSERT INTO `websockets_statistics_entries` VALUES ('1095', '1312272', '1', '2', '1', '2022-02-26 02:52:49', '2022-02-26 02:52:49');
INSERT INTO `websockets_statistics_entries` VALUES ('1096', '1312272', '1', '2', '1', '2022-02-26 02:53:49', '2022-02-26 02:53:49');

-- ----------------------------
-- Table structure for `zones`
-- ----------------------------
DROP TABLE IF EXISTS `zones`;
CREATE TABLE `zones` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `zone_code` varchar(15) NOT NULL,
  `zone_name` varchar(150) NOT NULL,
  `country_id` int(10) NOT NULL,
  `city_id` int(10) NOT NULL,
  `district_id` int(10) DEFAULT NULL,
  `commune_id` int(10) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'price = default price, generally for average item size or weight. ',
  `zone_type` varchar(30) DEFAULT NULL,
  `create_user` varchar(35) DEFAULT NULL,
  `create_date` timestamp NULL DEFAULT NULL,
  `description` varchar(150) DEFAULT NULL,
  `fast_price` decimal(10,2) DEFAULT NULL,
  `normal_price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=154 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of zones
-- ----------------------------
INSERT INTO `zones` VALUES ('57', '1', 'A1', 'ទន្លេបាសាក់', '14', '13', '37', '57', '0.00', 'Local', 'Puthea', '2021-11-23 10:37:14', null, null, null);
INSERT INTO `zones` VALUES ('58', '1', 'A2', 'បឹងកេងកងទី ១', '14', '13', '37', '58', '0.00', 'Local', 'Puthea', '2021-11-23 10:55:51', null, null, null);
INSERT INTO `zones` VALUES ('59', '1', 'A3', 'បឹងកេងកងទី ២', '14', '13', '37', '59', '0.00', 'Local', 'Puthea', '2021-11-23 10:57:56', null, null, null);
INSERT INTO `zones` VALUES ('60', '1', 'A4', 'បឹងកេងកងទី ៣', '14', '13', '37', '60', '0.00', 'Local', 'Puthea', '2021-11-23 10:59:23', null, null, null);
INSERT INTO `zones` VALUES ('61', '1', 'A5', 'អូឡាំពិក', '14', '13', '37', '61', '0.00', 'Local', 'Puthea', '2021-11-23 11:00:59', null, null, null);
INSERT INTO `zones` VALUES ('62', '1', 'A6', 'ទួលស្វាយព្រៃទី ១', '14', '13', '37', '62', '0.00', 'Local', 'Puthea', '2021-11-23 11:05:19', null, null, null);
INSERT INTO `zones` VALUES ('63', '1', 'A7', 'ទួលស្វាយព្រៃទី ២', '14', '13', '37', '59', '0.00', 'Local', 'Puthea', '2021-11-23 11:07:16', null, null, null);
INSERT INTO `zones` VALUES ('64', '1', 'A8', 'ទំនប់ទឹក', '14', '13', '37', '64', '0.00', 'Local', 'Puthea', '2021-11-23 11:08:10', null, null, null);
INSERT INTO `zones` VALUES ('65', '1', 'A9', 'ទួលទំពូងទី២', '14', '13', '37', '65', '0.00', 'Local', 'Puthea', '2021-11-23 11:11:09', null, null, null);
INSERT INTO `zones` VALUES ('66', '1', 'A10', 'ទួលទំពូងទី១', '14', '13', '37', '66', '0.00', 'Local', 'Puthea', '2021-11-23 11:13:21', null, null, null);
INSERT INTO `zones` VALUES ('67', '1', 'A11', 'បឹងត្របែក', '14', '13', '37', '67', '0.00', 'Local', 'Puthea', '2021-11-23 11:14:50', null, null, null);
INSERT INTO `zones` VALUES ('70', '1', 'A12', 'ផ្សាដើមថ្កូវ', '14', '13', '37', '68', '0.00', 'Local', 'Puthea', '2021-11-23 23:07:39', null, null, null);
INSERT INTO `zones` VALUES ('71', '1', 'B1', 'ដង្កោ', '14', '13', '38', '69', '0.00', 'Local', 'Puthea', '2021-11-24 00:15:28', null, null, null);
INSERT INTO `zones` VALUES ('72', '1', 'C1', 'ពងទឹក', '14', '13', '38', '70', '0.00', 'Local', 'Puthea', '2021-11-24 00:16:19', null, null, null);
INSERT INTO `zones` VALUES ('73', '1', 'C2', 'ព្រៃវែង', '14', '13', '38', '71', '0.00', 'Local', 'Puthea', '2021-11-24 00:17:14', null, null, null);
INSERT INTO `zones` VALUES ('74', '1', 'C3', 'ព្រៃស', '14', '13', '38', '72', '0.00', 'Local', 'Puthea', '2021-11-24 00:18:03', null, null, null);
INSERT INTO `zones` VALUES ('75', '1', 'C4', 'ក្រាំងពង្រ', '14', '13', '38', '73', '0.00', 'Local', 'Puthea', '2021-11-24 00:19:26', null, null, null);
INSERT INTO `zones` VALUES ('76', '1', 'C5', 'ប្រទះឡាង', '14', '13', '38', '74', '0.00', 'Local', 'Puthea', '2021-11-24 00:20:37', null, null, null);
INSERT INTO `zones` VALUES ('77', '1', 'C6', 'សាក់សំពៅ', '14', '13', '38', '75', '0.00', 'Local', 'Puthea', '2021-11-24 00:21:35', null, null, null);
INSERT INTO `zones` VALUES ('78', '1', 'A13', 'ជយ័ជំនះ', '14', '13', '38', '76', '0.00', 'Local', 'Puthea', '2021-11-24 00:28:00', null, null, null);
INSERT INTO `zones` VALUES ('79', '1', 'A14', 'ផ្សាចាស់', '14', '13', '38', '77', '0.00', 'Local', 'Puthea', '2021-11-24 00:28:57', null, null, null);
INSERT INTO `zones` VALUES ('80', '1', 'A15', 'ស្រះចក', '14', '13', '38', '147', '0.00', 'Local', 'Puthea', '2021-11-24 00:29:47', null, null, null);
INSERT INTO `zones` VALUES ('81', '1', 'A16', 'វត្តភ្នំ', '14', '13', '38', '78', '0.00', 'Local', 'Puthea', '2021-11-24 00:30:30', null, null, null);
INSERT INTO `zones` VALUES ('82', '1', 'A17', 'ផ្សាដេប៉ូទី១', '14', '13', '39', '79', '0.00', 'Local', 'Puthea', '2021-11-24 00:34:38', null, null, null);
INSERT INTO `zones` VALUES ('83', '1', 'A18', 'ផ្សាដេប៉ូទី២', '14', '13', '39', '80', '0.00', 'Local', 'Puthea', '2021-11-24 00:37:08', null, null, null);
INSERT INTO `zones` VALUES ('84', '1', 'A19', 'ផ្សាដេប៉ូទី៣', '14', '13', '39', '81', '0.00', 'Local', 'Puthea', '2021-11-24 00:38:56', null, null, null);
INSERT INTO `zones` VALUES ('85', '1', 'A20', 'ទឹកល្អក់ទី១', '14', '13', '39', '82', '0.00', 'Local', 'Puthea', '2021-11-24 00:39:51', null, null, null);
INSERT INTO `zones` VALUES ('86', '1', 'A21', 'ទឹកល្អក់ទី២', '14', '13', '39', '83', '0.00', 'Local', 'Puthea', '2021-11-24 00:43:42', null, null, null);
INSERT INTO `zones` VALUES ('87', '1', 'A22', 'ទឹកល្អក់ទី៣', '14', '13', '39', '84', '0.00', 'Local', 'Puthea', '2021-11-24 00:45:01', null, null, null);
INSERT INTO `zones` VALUES ('88', '1', 'B2', 'បឹងកក់ទី១', '14', '13', '39', '85', '0.00', 'Local', 'Puthea', '2021-11-24 00:59:08', null, null, null);
INSERT INTO `zones` VALUES ('89', '1', 'B3', 'ជើងអែក', '14', '13', '39', '86', '0.00', 'Local', 'Puthea', '2021-11-24 01:00:04', null, null, null);
INSERT INTO `zones` VALUES ('90', '1', 'B4', 'គងនយ', '14', '13', '39', '87', '0.00', 'Local', 'Puthea', '2021-11-24 01:01:02', null, null, null);
INSERT INTO `zones` VALUES ('91', '1', 'B5', 'ព្រែកកំពឹស', '14', '13', '39', '88', '0.00', 'Local', 'Puthea', '2021-11-24 01:01:47', null, null, null);
INSERT INTO `zones` VALUES ('92', '1', 'B6', 'រលួស', '14', '13', '39', '89', '0.00', 'Local', 'Puthea', '2021-11-24 01:02:59', null, null, null);
INSERT INTO `zones` VALUES ('93', '1', 'B7', 'ស្ពានថ្ម', '14', '13', '39', '90', '0.00', 'Local', 'Puthea', '2021-11-24 01:03:56', null, null, null);
INSERT INTO `zones` VALUES ('94', '1', 'B8', 'ទៀន', '14', '13', '39', '91', '0.00', 'Local', 'Puthea', '2021-11-24 01:05:12', null, null, null);
INSERT INTO `zones` VALUES ('95', '1', 'A23', 'អូឬស្សីទី១', '14', '13', '40', '92', '0.00', 'Local', 'Puthea', '2021-11-24 01:23:12', null, null, null);
INSERT INTO `zones` VALUES ('96', '1', 'A24', 'អូឬស្សីទី២', '14', '13', '40', '148', '0.00', 'Local', 'Puthea', '2021-11-24 01:23:49', null, null, null);
INSERT INTO `zones` VALUES ('97', '1', 'A25', 'អូឬស្សីទី៣', '14', '13', '40', '93', '0.00', 'Local', 'Puthea', '2021-11-24 01:25:32', null, null, null);
INSERT INTO `zones` VALUES ('98', '1', 'A26', 'អូឬស្សីទី៤', '14', '13', '40', '93', '0.00', 'Local', 'Puthea', '2021-11-24 01:26:19', null, null, null);
INSERT INTO `zones` VALUES ('99', '1', 'A27', 'មនោរម្យ', '14', '13', '40', '95', '0.00', 'Local', 'Puthea', '2021-11-24 01:27:08', null, null, null);
INSERT INTO `zones` VALUES ('100', '1', 'A28', 'មិត្តភាព', '14', '13', '40', '96', '0.00', 'Local', 'Puthea', '2021-11-24 01:27:43', null, null, null);
INSERT INTO `zones` VALUES ('101', '1', 'A29', 'វាលវង់', '14', '13', '40', '97', '0.00', 'Local', 'Puthea', '2021-11-24 01:28:26', null, null, null);
INSERT INTO `zones` VALUES ('102', '1', 'A30', 'បឹងព្រលិត', '14', '13', '40', '98', '0.00', 'Local', 'Puthea', '2021-11-24 01:29:02', null, null, null);
INSERT INTO `zones` VALUES ('103', '1', 'B9', 'ទួលសង្កែ', '14', '13', '41', '99', '0.00', 'Local', 'Puthea', '2021-11-24 01:30:41', null, null, null);
INSERT INTO `zones` VALUES ('104', '1', 'C7', 'ស្វាយប៉ាក', '14', '13', '41', '100', '0.00', 'Local', 'Puthea', '2021-11-24 01:46:06', null, null, null);
INSERT INTO `zones` VALUES ('105', '1', 'C8', 'គីឡូម៉ែតលេខ៦', '14', '13', '41', '101', '0.00', 'Local', 'Puthea', '2021-11-24 01:46:57', null, null, null);
INSERT INTO `zones` VALUES ('106', '1', 'C9', 'ឬស្សីកែង', '14', '13', '41', '102', '0.00', 'Local', 'Puthea', '2021-11-24 01:47:40', null, null, null);
INSERT INTO `zones` VALUES ('107', '1', 'C10', 'ច្រាំងចំរេះទី១', '14', '13', '41', '103', '0.00', 'Local', 'Puthea', '2021-11-24 01:48:35', null, null, null);
INSERT INTO `zones` VALUES ('108', '1', 'C11', 'ច្រាំងចំរេះទី២', '14', '13', '41', '104', '0.00', 'Local', 'Puthea', '2021-11-24 01:49:25', null, null, null);
INSERT INTO `zones` VALUES ('109', '1', 'C12', 'ភ្នំពេញថ្មី', '14', '13', '42', '105', '0.00', 'Local', 'Puthea', '2021-11-24 01:50:20', null, null, null);
INSERT INTO `zones` VALUES ('110', '1', 'C13', 'ទឹកថ្លា', '14', '13', '42', '106', '0.00', 'Local', 'Puthea', '2021-11-24 01:51:31', null, null, null);
INSERT INTO `zones` VALUES ('111', '1', 'C14', 'ឈ្នួល', '14', '13', '42', '107', '0.00', 'Local', 'Puthea', '2021-11-24 01:52:13', null, null, null);
INSERT INTO `zones` VALUES ('112', '1', 'C15', 'ក្រាំងថ្នង់', '14', '13', '42', '108', '0.00', 'Local', 'Puthea', '2021-11-24 01:52:59', null, null, null);
INSERT INTO `zones` VALUES ('113', '1', 'C16', 'ត្រពាំងក្រសាំង', '14', '13', '43', '109', '0.00', 'Local', 'Puthea', '2021-11-24 01:58:03', null, null, null);
INSERT INTO `zones` VALUES ('114', '1', 'C17', 'ភ្លើងឆេះរទិះ', '14', '13', '43', '110', '0.00', 'Local', 'Puthea', '2021-11-24 01:58:44', null, null, null);
INSERT INTO `zones` VALUES ('115', '1', 'C18', 'ចោមចៅ', '14', '13', '43', '111', '0.00', 'Local', 'Puthea', '2021-11-24 01:59:24', null, null, null);
INSERT INTO `zones` VALUES ('116', '1', 'C19', 'កាកាប', '14', '13', '43', '112', '0.00', 'Local', 'Puthea', '2021-11-24 02:00:19', null, null, null);
INSERT INTO `zones` VALUES ('117', '1', 'C20', 'សំរោងក្រោម', '14', '13', '43', '113', '0.00', 'Local', 'Puthea', '2021-11-24 02:01:05', null, null, null);
INSERT INTO `zones` VALUES ('118', '1', 'C21', 'បឹងធំ', '14', '13', '43', '114', '0.00', 'Local', 'Puthea', '2021-11-24 02:02:18', null, null, null);
INSERT INTO `zones` VALUES ('119', '1', 'C22', 'កំបូល', '14', '13', '43', '115', '0.00', 'Local', 'Puthea', '2021-11-24 02:02:57', null, null, null);
INSERT INTO `zones` VALUES ('120', '1', 'C23', 'កន្ទោក', '14', '13', '43', '116', '0.00', 'Local', 'Puthea', '2021-11-24 02:03:33', null, null, null);
INSERT INTO `zones` VALUES ('121', '1', 'C24', 'ឪឡោក', '14', '13', '43', '117', '0.00', 'Local', 'Puthea', '2021-11-24 02:04:13', null, null, null);
INSERT INTO `zones` VALUES ('122', '1', 'C25', 'ស្នើរ', '14', '13', '43', '118', '0.00', 'Local', 'Puthea', '2021-11-24 02:04:47', null, null, null);
INSERT INTO `zones` VALUES ('123', '1', 'C26', 'ព្រែកភ្នៅ', '14', '13', '44', '119', '0.00', 'Local', 'Puthea', '2021-11-24 02:21:42', null, null, null);
INSERT INTO `zones` VALUES ('124', '1', 'C27', 'ពញាពន់', '14', '13', '44', '120', '0.00', 'Local', 'Puthea', '2021-11-24 02:23:10', null, null, null);
INSERT INTO `zones` VALUES ('125', '1', 'C28', 'សំរោង', '14', '13', '44', '121', '0.00', 'Local', 'Puthea', '2021-11-24 02:33:22', null, null, null);
INSERT INTO `zones` VALUES ('126', '1', 'C29', 'គោករកា', '14', '13', '44', '122', '0.00', 'Local', 'Puthea', '2021-11-24 02:34:15', null, null, null);
INSERT INTO `zones` VALUES ('127', '1', 'C30', 'កន្សែង', '14', '13', '44', '123', '0.00', 'Local', 'Puthea', '2021-11-24 02:34:45', null, null, null);
INSERT INTO `zones` VALUES ('128', '1', 'A31', 'ផ្សារថ្មីទី១', '14', '13', '45', '124', '0.00', 'Local', 'Puthea', '2021-11-24 02:47:29', null, null, null);
INSERT INTO `zones` VALUES ('129', '1', 'A32', 'ផ្សារថ្មីទី២', '14', '13', '45', '125', '0.00', 'Local', 'Puthea', '2021-11-24 02:49:33', null, null, null);
INSERT INTO `zones` VALUES ('130', '1', 'A33', 'ផ្សារថ្មីទី៣', '14', '13', '45', '126', '0.00', 'Local', 'Puthea', '2021-11-24 02:50:21', null, null, null);
INSERT INTO `zones` VALUES ('131', '1', 'A34', 'បឹងរាំង', '14', '13', '45', '127', '0.00', 'Local', 'Puthea', '2021-11-24 02:52:56', null, null, null);
INSERT INTO `zones` VALUES ('132', '1', 'A35', 'ផ្សាកណ្ដាលទី១', '14', '13', '45', '128', '0.00', 'Local', 'Puthea', '2021-11-24 02:54:17', null, null, null);
INSERT INTO `zones` VALUES ('133', '1', 'A36', 'ផ្សាកណ្ដាលទី២', '14', '13', '45', '129', '0.00', 'Local', 'Puthea', '2021-11-24 02:55:23', null, null, null);
INSERT INTO `zones` VALUES ('134', '1', 'A37', 'ចតុមុខ', '14', '13', '45', '130', '0.00', 'Local', 'Puthea', '2021-11-24 02:56:46', null, null, null);
INSERT INTO `zones` VALUES ('135', '1', 'A38', 'ស្ទឹងមានជយ័', '14', '13', '46', '131', '0.00', 'Local', 'Puthea', '2021-11-24 02:59:43', null, null, null);
INSERT INTO `zones` VALUES ('136', '1', 'A39', 'បឹងទំពុន', '14', '13', '46', '132', '0.00', 'Local', 'Puthea', '2021-11-24 03:00:30', null, null, null);
INSERT INTO `zones` VALUES ('137', '1', 'B10', 'ចាក់អង្រែលើ', '14', '13', '46', '133', '0.00', 'Local', 'Puthea', '2021-11-24 03:01:31', null, null, null);
INSERT INTO `zones` VALUES ('138', '1', 'B11', 'ចាក់អង្រែក្រោម', '14', '13', '46', '134', '0.00', 'Local', 'Puthea', '2021-11-24 03:02:23', null, null, null);
INSERT INTO `zones` VALUES ('140', '1', 'C31', 'ជ្រោយចង្វារ', '14', '13', '47', '150', '0.00', 'Local', 'Puthea', '2021-11-24 03:23:03', null, null, null);
INSERT INTO `zones` VALUES ('141', '1', 'C32', 'ព្រែកលាប', '14', '13', '47', '136', '0.00', 'Local', 'Puthea', '2021-11-24 03:23:57', null, null, null);
INSERT INTO `zones` VALUES ('142', '1', 'C33', 'ព្រែកតាសេក', '14', '13', '47', '137', '0.00', 'Local', 'Puthea', '2021-11-24 03:24:57', null, null, null);
INSERT INTO `zones` VALUES ('143', '1', 'C34', 'កោះដាច់', '14', '13', '47', '138', '0.00', 'Local', 'Puthea', '2021-11-24 03:25:39', null, null, null);
INSERT INTO `zones` VALUES ('144', '1', 'C35', 'បាក់ខែង', '14', '13', '47', '139', '0.00', 'Local', 'Puthea', '2021-11-24 03:28:10', null, null, null);
INSERT INTO `zones` VALUES ('145', '1', 'B12', 'ច្បាអំពៅទី១', '14', '13', '48', '140', '0.00', 'Local', 'Puthea', '2021-11-24 03:29:07', null, null, null);
INSERT INTO `zones` VALUES ('146', '1', 'B13', 'ច្បាអំពៅទី២', '14', '13', '48', '141', '0.00', 'Local', 'Puthea', '2021-11-24 03:29:42', null, null, null);
INSERT INTO `zones` VALUES ('147', '1', 'B14', 'និរោធ', '14', '13', '48', '142', '0.00', 'Local', 'Puthea', '2021-11-24 03:30:27', null, null, null);
INSERT INTO `zones` VALUES ('148', '1', 'C36', 'ព្រែកប្រា', '14', '13', '48', '143', '0.00', 'Local', 'Puthea', '2021-11-24 03:31:10', null, null, null);
INSERT INTO `zones` VALUES ('149', '1', 'C37', 'វាលស្បូវ', '14', '13', '48', '144', '0.00', 'Local', 'Puthea', '2021-11-24 03:31:50', null, null, null);
INSERT INTO `zones` VALUES ('150', '1', 'C38', 'ព្រែកអែង', '14', '13', '48', '145', '0.00', 'Local', 'Puthea', '2021-11-24 03:32:29', null, null, null);
INSERT INTO `zones` VALUES ('151', '1', 'C39', 'ក្បាលកោះ', '14', '13', '48', '146', '0.00', 'Local', 'Puthea', '2021-11-24 03:33:04', null, null, null);
INSERT INTO `zones` VALUES ('152', '1', 'C40', 'ព្រែកថ្មី', '14', '13', '48', '149', '0.00', 'Local', 'Puthea', '2021-11-24 03:33:51', null, null, null);
INSERT INTO `zones` VALUES ('153', '1', 'KB001', 'Kabol', '14', '13', '39', '81', '0.00', 'Local', 'admin@gmail.com', '2021-12-24 08:47:26', null, null, null);

-- ----------------------------
-- Table structure for `zones1`
-- ----------------------------
DROP TABLE IF EXISTS `zones1`;
CREATE TABLE `zones1` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `zone_code` varchar(15) NOT NULL,
  `zone_name` varchar(150) NOT NULL,
  `country_id` int(10) NOT NULL,
  `city_id` int(10) NOT NULL,
  `district_id` int(10) DEFAULT NULL,
  `commune_id` int(10) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'price = default price, generally for average item size or weight. ',
  `zone_type` varchar(30) DEFAULT NULL,
  `create_user` varchar(35) DEFAULT NULL,
  `create_date` timestamp NULL DEFAULT NULL,
  `description` varchar(150) DEFAULT NULL,
  `fast_price` decimal(10,2) DEFAULT NULL,
  `normal_price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=350 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of zones1
-- ----------------------------
INSERT INTO `zones1` VALUES ('95', '1', 'A1 VRBT', 'Bus វិរៈ​ប៊ុន​ថាំ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('96', '1', 'A2 KPT', 'Bus កា​ពី​តូល', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('97', '1', 'A3 RMN', 'Bus រិទ្ធ​មុនី', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('98', '1', 'A4 SRY', 'Bus សូរិយា', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('99', '1', 'A5 KR', 'Kerry Express', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('100', '1', 'A6 ASBP', 'BUS អា​ស៊ី​បូពា៍', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('101', '1', 'A7 JAT', 'J and T', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('102', '1', 'A8', 'Bus សូរិយា', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('103', '1', 'A9 GTS', 'GTS ផ្សារ​ថ្មី', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('104', '1', 'C10 YLPT', 'យក​លុយ​ពី​TAXI', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('105', '1', 'C11 DTSNB', 'ដាក់​តាក់​ស៊ី​ណា​ក៏​បាន', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('106', '1', 'C12 DTSMLL', 'ដាក់​តាក់​ស៊ី ​មាន​លេខ​ឡាន', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('107', '1', 'C13 TD', 'ថ្ម​ដា', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('108', '1', 'C14 STDN', 'ស្តុប​ដេ​អិន', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('109', '1', 'C15 PDM', 'ផ្សា​រ​ឌុយ​មិច', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('110', '1', 'C16 PT', 'ផ្សារ​ថ្មី', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('111', '1', 'C17 PSL', 'ផ្សារ​ស៊ី​ឡិប', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('112', '1', 'C18 ORS', 'អូ​ឬ​ស្សី', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('113', '1', 'C19 PKPK', 'ផ្លូវ​កម្ពុជា​ក្រោម', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('114', '1', 'C20 STP', 'ស្តុប​ទេព​ផន', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('115', '1', 'C21 PDB', 'ផ្សារ​ដេប៉ូ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('116', '1', 'C22 SOLP', 'សា្តត​អូ​ឡាំ​ពេជ្រ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('117', '1', 'C23 TSP', 'ទួល​ស្វាយ​ព្រៃ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('118', '1', 'C24 BRKL', 'បុ​រី​កី​ឡា', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('119', '1', 'C25 PORS', 'ផ្សារ​អូរ​ឬស្សី', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('120', '1', 'C26 OLP', 'អូ​ឡាំ​ពេជ្រ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('121', '1', 'C27 VK', 'វត្ត​កោះ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('122', '1', 'C28 SLYT', 'សា​លា​យុ​គន្ធរ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('123', '1', 'C29 PNM', 'ផ្សារ​នាគ​មាស', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('124', '1', 'C30 POLP', 'ផ្សារ​អូរ​ឡាំ​ពិច', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('125', '1', 'C31 TS', 'ទួល​ស្លែង', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('126', '1', 'C32 PKRS', 'ផ្សារ​ឃ្លាំង​រំ​សេវ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('127', '1', 'C33 PDK', 'ផ្សារ​ដើម​គរ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('128', '1', 'C34 MDY', 'ម៉ុង​ឌី​យ៉ាល់', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('129', '1', 'C35 KRR', 'គិ​រី​រម្យ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('130', '1', 'C36 JSSMK', 'ជា​ស៊ីម​សាម​គ្គី', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('131', '1', 'C37 PLS', 'ពេទ្យ​លោក​សង្ឃ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('132', '1', 'C38 TL123', 'ទឹក​ល្អក់​ (១២៣)', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('133', '1', 'C39 BSL', 'បឹង​សា​ឡាង', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('134', '1', 'C40 STM', 'សន្ធរ​មុខ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('135', '1', 'C41 PKD', 'ផ្សារ​កណ្តាល', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('136', '1', 'C42 SLIFL', 'សា​លា IFL', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('137', '1', 'C43 SLRUPP', 'សា​លា RUPP', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('138', '1', 'C44 SN12', 'សំ​ណង់​១២', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('139', '1', 'C45 OBK', 'អូរ​បែក​ក្អម', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('140', '1', 'C46 PKK', 'ផ្សារ​កាប់​គោ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('141', '1', 'C47 PHL', 'ផ្សារ​ហេង​លី', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('142', '1', 'C48 SLST', 'ជិត​សា​លា​ស៊ី​តិច', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('143', '1', 'C49 BT', 'បាក់​ទូក', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('144', '1', 'C50 PSTM', 'ផ្សារ​ស៊ី​ធី​ម៉ល', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('145', '1', 'C51 SKD', 'ស្តុប​កោស​ដូង', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('146', '1', 'C52 JL', 'ចេន​ឡា', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('147', '1', 'C54 PKMJ', 'ពេទ្យ​កុមារ​ជាតិ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('148', '1', 'C55 BSD', 'ក្រោយ​ប្រេ​ស៊ី​ដង់', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('149', '1', 'C56 SLTN', 'សា​លា​តិច​ណូ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('150', '1', 'C57 TLK', 'ត្រ​ឡោក​បែក', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('151', '1', 'C58 TPR', 'ទួល​ស្វាយ​ព្រៃ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('152', '1', 'C59 SNK', 'ស្តុប NOKIA', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('153', '1', 'C60 ChT', 'ឈូក​ទិព្វ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('154', '1', 'C61 PSMK', 'ផ្សារ​សាម​គ្គី', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('155', '1', 'C62 SPC', 'ស្តុប​ពេទ្យ​ចិន', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('156', '1', 'C63 TTP', 'ទួល​ទំ​ពូង', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('157', '1', 'C64 BKK', 'បឹង​កេង​កង', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('158', '1', 'C65 BTB', 'បឹង​ត្រ​បែក', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('159', '1', 'C66 SBK', 'ស្ដុប​បូក​គោ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('160', '1', 'C67 CKM', 'ចំ​ការ​មន', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('161', '1', 'C68 AK42', 'អាគារ42 ជាន់', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('162', '1', 'C69 P271', 'ផ្លូវ​271', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('163', '1', 'C70 PPS', 'ផ្សារ​Pencil', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('164', '1', 'C71 VD', 'វ៉ាន់​ដា', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('165', '1', 'C72 SBK', 'ស្តុប​បូក​គោ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('166', '1', 'C73 SLBB', 'សា​លា​បៀល​ប្រាយ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('167', '1', 'C74 SLKH', 'សា​លា​ក្រហម', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('168', '1', 'C75 VBT', 'វត្ត​បទុម', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('169', '1', 'C76 SNJ', 'ស្តុប​ណាន​ជីន', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('170', '1', 'C77 UP', 'សា​លា​ពេទ្យ​UP', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('171', '1', 'C78 SRY', 'ផ្សារ​សូ​រិ​យា', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('172', '1', 'C79 SBS', 'ស្តុប​បា​សាក់', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('173', '1', 'C80 KNDY', 'កា​ណា​ឌី​យ៉ា', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('174', '1', 'C81 PSHN', 'ផ្លូវ​សី​ហនុ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('175', '1', 'C82 PNRD', 'ផ្លូវ​ន​រោ​ត្តម', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('176', '1', 'C83 TC', 'ទូត​ចិន', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('177', '1', 'C84 CTM', 'ច​តុ​មុខ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('178', '1', 'C85 SLSSV', 'សា​លា​ស៊ី​សុ​វ័ត្តិ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('179', '1', 'C86 KR', 'ក្រោយ​វាំង', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('180', '1', 'C87 AO1', 'Aeon 1', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('181', '1', 'C88 KP', 'កោះ​ពេជ្រ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('182', '1', 'C89 SLRULE', 'សា​លា​ Rule', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('183', '1', 'C90 NGW', 'Naga world', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('184', '1', 'C91 TVN', 'ទូត​វៀត​ណាម', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('185', '1', 'C92 VMR', 'វិ​មាន​ឯក​រាជ្យ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('186', '1', 'C93 PSVN', 'ផ្សារ​សុវណ្ណា', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('187', '1', 'C94 AKVN', 'អគារ​វឌ្ឍ​នៈ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('188', '1', 'C95 BT7', 'Beltie7', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('189', '1', 'C96 P360', 'ផ្លូវ​ 360', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('190', '1', 'C97 FD', 'Fast Delivery', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('191', '1', 'C98 SLVD', 'សា​លា​វ៉ាន់​ដា', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('192', '1', 'C99 PMST', 'ផ្លូវ​ម៉ៅ​សេ​ទុង', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('193', '1', 'C100 PRS', 'ពេទ្យ​រុ​ស្សី', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('194', '1', 'C101 Taxi', 'ដាក់​តាក់​ស៊ី​ណា​ក៏​បាន', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('195', '1', 'C102 Taxi', 'ដាក់​តាក់​ស៊ី ​មាន​លេខ​ឡាន', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('196', '1', 'C103 Taxi', 'យក​លុយ​ពី​TAXI​', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('197', '1', 'D110 PSJ', 'ពោធ៍​សែន​ជ័យ​', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('198', '1', 'D111 BPL', 'បឹង​ព្រ​លឹត', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('199', '1', 'D112 PDH', 'ផ្សារ​ដី​ហុយ​', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('200', '1', 'D113 PSJR', 'ផ្សារ​សេន​ជូ​រី', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('201', '1', 'D114 PCT', 'ពោធ៍​ចិន​តុង​', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('202', '1', 'D115 SS', 'សែន​សុខ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('203', '1', 'D116 TSK', 'ទួល​សង្កែ​', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('204', '1', 'D117 CK', 'Camko', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('205', '1', 'D118 BRCK', 'បុ​រី​កាំ​កូ​ស៊ី​ធី', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('206', '1', 'D119 RMCCV)', 'រង្វង់​មូល​ជ្រោយ​ចង្វារ​', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('207', '1', 'D120 PSMC', 'ផ្សារ​ស្ទឹង​មាន​ជ័យ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('208', '1', 'D121 SL', 'សូ​ឡា', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('209', '1', 'D122 VSKS', 'វត្ត​សន្សំ​កុ​សល​', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('210', '1', 'D123 P2004', 'ផ្លូវ​2004', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('211', '1', 'D124 P2002', 'ផ្លូវ​2002', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('212', '1', 'D125 PPS', 'ផ្សារ​ផេ​សេ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('213', '1', 'D126 PDTK', 'ផ្សារ​ដើម​ថ្កូវ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('214', '1', 'D127 BTP', 'បឹង​ទំ​ពុន', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('215', '1', 'D128 KTH', 'ក្បាល​ថ្នល់​', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('216', '1', 'D129 TK', 'ទួល​គោក', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('217', '1', 'D130 BCH', 'បឹង​ឈូក', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('218', '1', 'D131 VP', 'វត្ត​ភ្នំ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('219', '1', 'D132 SLVS', 'សា​លា​វេ​ស្ទើន​', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('220', '1', 'D133 CM', 'Camed', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('221', '1', 'D134 TTh', 'ទឹក​ថ្លា', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('222', '1', 'D135 RVMJN', 'រង្វង់​មូល​ជូត​ណាត​', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('223', '1', 'D135 PT', 'ផ្សារ​តូច', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('224', '1', 'D137 VNV', 'វត្ត​នាគ​វ័ន្ត', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('225', '1', 'D138 KM', 'កាល់​ម៉ែត្រ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('226', '1', 'D139 TK', 'ទួល​គោក', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('227', '1', 'D140 PMRT', 'ផ្លូវ​ម៉ុង​រទ្ធី', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('228', '1', 'D141 MD', 'មៃដា', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('229', '1', 'D142 SLIU', 'សា​លា IU', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('230', '1', 'D143 VT', 'វត្ត​ទូល', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('231', '1', 'D144 SLPK', 'សា​លា​ពញា​ក្រែក', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('232', '1', 'D145 KD', 'ខណ្ឌ​ដង្កោ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('233', '1', 'D146 PPC', 'ផ្សារ​ PC', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('234', '1', 'D147 PJYR', 'ផ្សារ​ជេន​យូ​រី', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('235', '1', 'D148 PSK', 'ភូមិ​សាម​គ្គី', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('236', '1', 'D149 PTPCH', 'ផ្សារ​ត្រ​ពាំង​ឈូក', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('237', '1', 'D150 SJ', 'ស្តាត​ចាស់​', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('238', '1', 'D151 PJ', 'ផ្សារ​ចាស់​', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('239', '1', 'D152 SLANV', 'សា​លា​អ​នុ​វត្ត​ជិត​ផ្លូវ​២០០២', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('240', '1', 'D153 ETV', 'ឥ​ន្រ្ត​ទេ​វី', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('241', '1', 'D154 VATM', 'វត្ត​អង់​តា​មិញ​', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('242', '1', 'D155 VDBP', 'វត្តដំបូកខ្ពស់', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('243', '1', 'D156 PMA', 'ផ្សារ​មាន់​អាំង​', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('244', '1', 'D157 JAL', 'ចាក់​អង្រែ​លើ​', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('245', '1', 'D158 JOR', 'ចាក់​អង្រែ​ក្រោម​', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('246', '1', 'D159', 'Pa​ra​gon', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('247', '1', 'D160 BK', 'បឹង​កក់​', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('248', '1', 'E165 CM', 'ផ្សារ​ឈូក​មាស​', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('249', '1', 'E166 CV2', 'ឈូក​វ៉ា​២', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('250', '1', 'E167 SROD', 'វត្ត​សំ​រោង​អណ្តែត', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('251', '1', 'E168 BBT', 'ផ្សារ​បឹង​បៃ​តង', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('252', '1', 'E169 PT', 'ផ្សារ​ព្រែក​ទា', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('253', '1', 'E170', 'CTN', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('254', '1', 'E173 RSK', 'សា​លា​ខណ្ឌ​ឬស្សី​កែវ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('255', '1', 'E174 KS', 'វត្ត​កៀន​ឃ្លាំង', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('256', '1', 'E175 PL', 'ព្រែក​លាប', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('257', '1', 'E176 RR', 'បុ​រី​រុង​រឿង', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('258', '1', 'E177 BL', 'ស្ពាន​បា​លេ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('259', '1', 'E178 CSPP', 'ផ្លូវ​ជា​សូ​ផា​រ៉ា', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('260', '1', 'E179 ANGKOR', 'បុ​រី​អង្គរ​ភ្នំ​ពេញ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('261', '1', 'E180 PPT', 'ភ្នំ​ពេញ​ថ្មី', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('262', '1', 'E181 SLNT', 'សា​លា​ន័រ​តុន', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('263', '1', 'E182 CC', 'ចោម​ចៅ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('264', '1', 'E183 JKD', 'ចំ​ការ​ដូង', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('265', '1', 'E184 JPV', 'ជម្ពូ​វន្ត័​', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('266', '1', 'E185 SBM', 'វត្ត​សំ​បូរ​មាស', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('267', '1', 'E186 AR1', 'ផ្សារ​ឯក​រាជ្រ​១', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('268', '1', 'E187 JKD', 'ពិ​ភព​ថ្មី​ចំ​ការ​ដូង', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('269', '1', 'E188 TPT', 'ផ្សារ​ទំ​ពាំង​ថ្លឹង​', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('270', '1', 'E189 VS', 'ផ្លូវ​វេង​ស្រេង​', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('271', '1', 'E190 TPR', 'ទួល​ពង្រ​', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('272', '1', 'E191 PHN', 'ផ្លូវ​ហា​ណួយ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('273', '1', 'D161 COR', 'ចាក់​អង្រែ​ក្រោម', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('274', '1', 'E192 CB', 'ច្បារ​អំ​ពៅ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('275', '1', 'E193 PP', 'ព្រែក​ប្រា', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('276', '1', 'E194 BS', 'បឹង​ស្នោរ​', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('277', '1', 'E195 TKM', 'តា​ខ្មៅ​', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('278', '1', 'E196', 'Aeon 2', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('279', '1', 'E197 SKHOTEL', 'សុ​ខា​ Hotel', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('280', '1', 'E198 PL', 'មុខ​ប្រ​លាន​', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('281', '1', 'E199 CM', 'ផ្សារ​ឈូក​មាស', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('282', '1', 'E200WPN', 'វត្ត​ពោធិ​ញាន​', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('283', '1', 'E201RSK', 'ឬ​ស្សី​កែវ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('284', '1', 'C104RP', 'royal palace', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('285', '1', 'E203KL7', 'ផ្សារ​គីឡូ​លេខ​ 7', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('286', '1', 'E204KL6', 'ផ្សារ​គី​ឡូ​លេខ​ 6', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('287', '1', 'E205271', 'ផ្លូវ​371', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('288', '1', 'F225CVM', 'ឈូក​រ៉ា​១', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('289', '1', 'F226KPP', 'គ្រេន​ភ្នំ​ពេញ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('290', '1', 'F227OD', 'អូ​ដឹម', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('291', '1', 'F228PS', 'ព្រៃ​សរ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('292', '1', 'F229STP2', 'បុ​រី​សន្តិ​ភាព​២', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('293', '1', 'F230KB', 'កំ​បូល​', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('294', '1', 'F231VS', 'បុ​រី​វាល​ស្បូវ​', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('295', '1', 'F232PP', 'ព្រែក​ភ្នៅ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('296', '1', 'F233WVS', 'វត្ត​វាល​ស្បូវ​', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('297', '1', 'F234SBKPJ', 'ស្រា​បៀរ​ក​ម្ពុ​ជា', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('298', '1', 'F235TNKS', 'ទំ​នប់​កប់​ស្រូវ​', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('299', '1', 'F236WS', 'វត្ត​ស្លែង', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('300', '1', 'F237PA', 'ព្រែក​អែង', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('301', '1', 'F238VMJJ', 'វិ​មាន​ឈ្នះ​ៗ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('302', '1', 'F239RVKS', 'វង្វង់​កួរ​ស្រូវ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('303', '1', 'F240PH', 'ព្រែក​ហូ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('304', '1', 'F241PHSM', 'ផ្លូវ​៦០​ម៉ែត្រ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('305', '1', 'F242SLYP', 'ស្ពាន​លី​យ៉ុង​ផាត់​', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('306', '1', 'F243HRVTKM', 'ហួស​រង្វ​ង់មូល​តា​ខ្មៅ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('307', '1', 'C105TS', 'ផ្លូវ​ត្រ​សក់​ផ្អែម​', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('308', '1', 'E206PL', 'ព្រែក​លាប​(បុ​រី​មេ​គង្គ​ Royal)', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('309', '1', 'E207KT', 'ក្រំាង​ធ្នង់', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('310', '1', 'E208WKK', 'វត្ត​គៀន​ឃ្លាំង​', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('311', '1', 'C106SDP', 'ផ្លូវ​សម្ដេច​ប៉ាន​', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('312', '1', 'D162SL', 'សរ​ឡា', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('313', '1', 'D163lB', 'លូ​ប្រាំ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('314', '1', 'D164S7MKR', 'ស្ពាន់​៧​មករា', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('315', '1', 'F244RVMKS', 'រង្វង់​មូល​គួរ​ស្រូវ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('316', '1', 'F245BJ', 'បែក​ចាន', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('317', '1', 'C107MNR', 'ផ្លូវ​មុន្នី​រ៉េត', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('318', '1', 'E209KNCT', 'កា​ណា​ស៊ី​ធី', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('319', '1', 'C108K2', 'ក្តាន់​២', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('320', '1', 'F246PJL3', 'ផ្លូវ​ជាតិ​លេខ​៣', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('321', '1', 'F247WJPK', 'វត្តចំពុះក្អែក', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('322', '1', 'C109MNV', 'ផ្លូវមុន្នីវង្ស', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('323', '1', 'E210TKS', 'តាំងក្រសាំង', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('324', '1', 'E211BSLT', 'បឹងសាឡាងថ្មី', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('325', '1', 'E212BRR', 'បុរីរីទ្ធ ទួលសង្កែ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('326', '1', 'E213PDK', 'ភូមិដើមខ្វិត', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('327', '1', 'E214PDOP', 'ផ្សារដើមអំពិល', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('328', '1', 'E215WPS', 'វត្តព្រែកឬស្សី', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('329', '1', 'E216PTKM', 'ផ្សារតាខ្មៅ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('330', '1', 'E217SPSR', 'ស្ពានព្រែកសំរោង', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('331', '1', 'E218BTSD', 'បន្ទាយសម្តេច', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('332', '1', 'E219KPSN', 'កំពុងសំណាញ់', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('333', '1', 'E220WTM', 'វត្តតាខ្មៅ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('334', '1', 'E221PRS', 'ភូមិឬស្សី', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('335', '1', 'E222SN', 'សូនី', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('336', '1', 'E223PJ', 'ព្រៃជ្រៃ', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);
INSERT INTO `zones1` VALUES ('337', '1', 'E224JA', 'ជើងឯក', '14', '13', null, null, '0.00', 'Local', null, null, null, null, null);

-- ----------------------------
-- Table structure for `zones_broexpress`
-- ----------------------------
DROP TABLE IF EXISTS `zones_broexpress`;
CREATE TABLE `zones_broexpress` (
  `zone_code` varchar(35) NOT NULL,
  `zone_name` varchar(150) NOT NULL,
  `country_id` int(10) NOT NULL,
  `city_id` int(10) NOT NULL,
  `zone_type` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of zones_broexpress
-- ----------------------------
INSERT INTO `zones_broexpress` VALUES ('A1 VRBT', 'Bus វិរៈ​ប៊ុន​ថាំ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('A2 KPT', 'Bus កា​ពី​តូល', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('A3 RMN', 'Bus រិទ្ធ​មុនី', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('A4 SRY', 'Bus សូរិយា', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('A5 KR', 'Kerry Express', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('A6 ASBP', 'BUS អា​ស៊ី​បូពា៍', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('A7 JAT', 'J and T', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('A8', 'Bus សូរិយា', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('A9 GTS', 'GTS ផ្សារ​ថ្មី', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C10 YLPT', 'យក​លុយ​ពី​TAXI', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C11 DTSNB', 'ដាក់​តាក់​ស៊ី​ណា​ក៏​បាន', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C12 DTSMLL', 'ដាក់​តាក់​ស៊ី ​មាន​លេខ​ឡាន', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C13 TD', 'ថ្ម​ដា', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C14 STDN', 'ស្តុប​ដេ​អិន', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C15 PDM', 'ផ្សា​រ​ឌុយ​មិច', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C16 PT', 'ផ្សារ​ថ្មី', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C17 PSL', 'ផ្សារ​ស៊ី​ឡិប', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C18 ORS', 'អូ​ឬ​ស្សី', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C19 PKPK', 'ផ្លូវ​កម្ពុជា​ក្រោម', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C20 STP', 'ស្តុប​ទេព​ផន', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C21 PDB', 'ផ្សារ​ដេប៉ូ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C22 SOLP', 'សា្តត​អូ​ឡាំ​ពេជ្រ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C23 TSP', 'ទួល​ស្វាយ​ព្រៃ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C24 BRKL', 'បុ​រី​កី​ឡា', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C25 PORS', 'ផ្សារ​អូរ​ឬស្សី', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C26 OLP', 'អូ​ឡាំ​ពេជ្រ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C27 VK', 'វត្ត​កោះ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C28 SLYT', 'សា​លា​យុ​គន្ធរ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C29 PNM', 'ផ្សារ​នាគ​មាស', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C30 POLP', 'ផ្សារ​អូរ​ឡាំ​ពិច', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C31 TS', 'ទួល​ស្លែង', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C32 PKRS', 'ផ្សារ​ឃ្លាំង​រំ​សេវ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C33 PDK', 'ផ្សារ​ដើម​គរ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C34 MDY', 'ម៉ុង​ឌី​យ៉ាល់', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C35 KRR', 'គិ​រី​រម្យ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C36 JSSMK', 'ជា​ស៊ីម​សាម​គ្គី', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C37 PLS', 'ពេទ្យ​លោក​សង្ឃ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C38 TL123', 'ទឹក​ល្អក់​ (១២៣)', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C39 BSL', 'បឹង​សា​ឡាង', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C40 STM', 'សន្ធរ​មុខ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C41 PKD', 'ផ្សារ​កណ្តាល', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C42 SLIFL', 'សា​លា IFL', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C43 SLRUPP', 'សា​លា RUPP', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C44 SN12', 'សំ​ណង់​១២', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C45 OBK', 'អូរ​បែក​ក្អម', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C46 PKK', 'ផ្សារ​កាប់​គោ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C47 PHL', 'ផ្សារ​ហេង​លី', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C48 SLST', 'ជិត​សា​លា​ស៊ី​តិច', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C49 BT', 'បាក់​ទូក', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C50 PSTM', 'ផ្សារ​ស៊ី​ធី​ម៉ល', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C51 SKD', 'ស្តុប​កោស​ដូង', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C52 JL', 'ចេន​ឡា', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C54 PKMJ', 'ពេទ្យ​កុមារ​ជាតិ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C55 BSD', 'ក្រោយ​ប្រេ​ស៊ី​ដង់', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C56 SLTN', 'សា​លា​តិច​ណូ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C57 TLK', 'ត្រ​ឡោក​បែក', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C58 TPR', 'ទួល​ស្វាយ​ព្រៃ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C59 SNK', 'ស្តុប NOKIA', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C60 ChT', 'ឈូក​ទិព្វ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C61 PSMK', 'ផ្សារ​សាម​គ្គី', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C62 SPC', 'ស្តុប​ពេទ្យ​ចិន', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C63 TTP', 'ទួល​ទំ​ពូង', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C64 BKK', 'បឹង​កេង​កង', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C65 BTB', 'បឹង​ត្រ​បែក', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C66 SBK', 'ស្ដុប​បូក​គោ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C67 CKM', 'ចំ​ការ​មន', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C68 AK42', 'អាគារ42 ជាន់', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C69 P271', 'ផ្លូវ​271', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C70 PPS', 'ផ្សារ​Pencil', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C71 VD', 'វ៉ាន់​ដា', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C72 SBK', 'ស្តុប​បូក​គោ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C73 SLBB', 'សា​លា​បៀល​ប្រាយ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C74 SLKH', 'សា​លា​ក្រហម', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C75 VBT', 'វត្ត​បទុម', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C76 SNJ', 'ស្តុប​ណាន​ជីន', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C77 UP', 'សា​លា​ពេទ្យ​UP', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C78 SRY', 'ផ្សារ​សូ​រិ​យា', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C79 SBS', 'ស្តុប​បា​សាក់', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C80 KNDY', 'កា​ណា​ឌី​យ៉ា', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C81 PSHN', 'ផ្លូវ​សី​ហនុ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C82 PNRD', 'ផ្លូវ​ន​រោ​ត្តម', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C83 TC', 'ទូត​ចិន', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C84 CTM', 'ច​តុ​មុខ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C85 SLSSV', 'សា​លា​ស៊ី​សុ​វ័ត្តិ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C86 KR', 'ក្រោយ​វាំង', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C87 AO1', 'Aeon 1', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C88 KP', 'កោះ​ពេជ្រ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C89 SLRULE', 'សា​លា​ Rule', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C90 NGW', 'Naga world', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C91 TVN', 'ទូត​វៀត​ណាម', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C92 VMR', 'វិ​មាន​ឯក​រាជ្យ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C93 PSVN', 'ផ្សារ​សុវណ្ណា', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C94 AKVN', 'អគារ​វឌ្ឍ​នៈ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C95 BT7', 'Beltie7', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C96 P360', 'ផ្លូវ​ 360', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C97 FD', 'Fast Delivery', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C98 SLVD', 'សា​លា​វ៉ាន់​ដា', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C99 PMST', 'ផ្លូវ​ម៉ៅ​សេ​ទុង', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C100 PRS', 'ពេទ្យ​រុ​ស្សី', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C101 Taxi', 'ដាក់​តាក់​ស៊ី​ណា​ក៏​បាន', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C102 Taxi', 'ដាក់​តាក់​ស៊ី ​មាន​លេខ​ឡាន', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C103 Taxi', 'យក​លុយ​ពី​TAXI​', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D110 PSJ', 'ពោធ៍​សែន​ជ័យ​', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D111 BPL', 'បឹង​ព្រ​លឹត', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D112 PDH', 'ផ្សារ​ដី​ហុយ​', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D113 PSJR', 'ផ្សារ​សេន​ជូ​រី', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D114 PCT', 'ពោធ៍​ចិន​តុង​', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D115 SS', 'សែន​សុខ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D116 TSK', 'ទួល​សង្កែ​', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D117 CK', 'Camko', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D118 BRCK', 'បុ​រី​កាំ​កូ​ស៊ី​ធី', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D119 RMCCV)', 'រង្វង់​មូល​ជ្រោយ​ចង្វារ​', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D120 PSMC', 'ផ្សារ​ស្ទឹង​មាន​ជ័យ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D121 SL', 'សូ​ឡា', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D122 VSKS', 'វត្ត​សន្សំ​កុ​សល​', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D123 P2004', 'ផ្លូវ​2004', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D124 P2002', 'ផ្លូវ​2002', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D125 PPS', 'ផ្សារ​ផេ​សេ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D126 PDTK', 'ផ្សារ​ដើម​ថ្កូវ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D127 BTP', 'បឹង​ទំ​ពុន', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D128 KTH', 'ក្បាល​ថ្នល់​', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D129 TK', 'ទួល​គោក', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D130 BCH', 'បឹង​ឈូក', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D131 VP', 'វត្ត​ភ្នំ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D132 SLVS', 'សា​លា​វេ​ស្ទើន​', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D133 CM', 'Camed', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D134 TTh', 'ទឹក​ថ្លា', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D135 RVMJN', 'រង្វង់​មូល​ជូត​ណាត​', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D135 PT', 'ផ្សារ​តូច', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D137 VNV', 'វត្ត​នាគ​វ័ន្ត', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D138 KM', 'កាល់​ម៉ែត្រ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D139 TK', 'ទួល​គោក', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D140 PMRT', 'ផ្លូវ​ម៉ុង​រទ្ធី', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D141 MD', 'មៃដា', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D142 SLIU', 'សា​លា IU', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D143 VT', 'វត្ត​ទូល', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D144 SLPK', 'សា​លា​ពញា​ក្រែក', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D145 KD', 'ខណ្ឌ​ដង្កោ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D146 PPC', 'ផ្សារ​ PC', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D147 PJYR', 'ផ្សារ​ជេន​យូ​រី', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D148 PSK', 'ភូមិ​សាម​គ្គី', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D149 PTPCH', 'ផ្សារ​ត្រ​ពាំង​ឈូក', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D150 SJ', 'ស្តាត​ចាស់​', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D151 PJ', 'ផ្សារ​ចាស់​', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D152 SLANV', 'សា​លា​អ​នុ​វត្ត​ជិត​ផ្លូវ​២០០២', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D153 ETV', 'ឥ​ន្រ្ត​ទេ​វី', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D154 VATM', 'វត្ត​អង់​តា​មិញ​', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D155 VDBP', 'វត្តដំបូកខ្ពស់', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D156 PMA', 'ផ្សារ​មាន់​អាំង​', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D157 JAL', 'ចាក់​អង្រែ​លើ​', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D158 JOR', 'ចាក់​អង្រែ​ក្រោម​', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D159', 'Pa​ra​gon', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D160 BK', 'បឹង​កក់​', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E165 CM', 'ផ្សារ​ឈូក​មាស​', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E166 CV2', 'ឈូក​វ៉ា​២', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E167 SROD', 'វត្ត​សំ​រោង​អណ្តែត', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E168 BBT', 'ផ្សារ​បឹង​បៃ​តង', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E169 PT', 'ផ្សារ​ព្រែក​ទា', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E170', 'CTN', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E173 RSK', 'សា​លា​ខណ្ឌ​ឬស្សី​កែវ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E174 KS', 'វត្ត​កៀន​ឃ្លាំង', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E175 PL', 'ព្រែក​លាប', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E176 RR', 'បុ​រី​រុង​រឿង', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E177 BL', 'ស្ពាន​បា​លេ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E178 CSPP', 'ផ្លូវ​ជា​សូ​ផា​រ៉ា', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E179 ANGKOR', 'បុ​រី​អង្គរ​ភ្នំ​ពេញ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E180 PPT', 'ភ្នំ​ពេញ​ថ្មី', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E181 SLNT', 'សា​លា​ន័រ​តុន', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E182 CC', 'ចោម​ចៅ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E183 JKD', 'ចំ​ការ​ដូង', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E184 JPV', 'ជម្ពូ​វន្ត័​', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E185 SBM', 'វត្ត​សំ​បូរ​មាស', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E186 AR1', 'ផ្សារ​ឯក​រាជ្រ​១', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E187 JKD', 'ពិ​ភព​ថ្មី​ចំ​ការ​ដូង', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E188 TPT', 'ផ្សារ​ទំ​ពាំង​ថ្លឹង​', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E189 VS', 'ផ្លូវ​វេង​ស្រេង​', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E190 TPR', 'ទួល​ពង្រ​', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E191 PHN', 'ផ្លូវ​ហា​ណួយ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D161 COR', 'ចាក់​អង្រែ​ក្រោម', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E192 CB', 'ច្បារ​អំ​ពៅ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E193 PP', 'ព្រែក​ប្រា', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E194 BS', 'បឹង​ស្នោរ​', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E195 TKM', 'តា​ខ្មៅ​', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E196', 'Aeon 2', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E197 SKHOTEL', 'សុ​ខា​ Hotel', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E198 PL', 'មុខ​ប្រ​លាន​', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E199 CM', 'ផ្សារ​ឈូក​មាស', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E200WPN', 'វត្ត​ពោធិ​ញាន​', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E201RSK', 'ឬ​ស្សី​កែវ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C104RP', 'royal palace', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E203KL7', 'ផ្សារ​គីឡូ​លេខ​ 7', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E204KL6', 'ផ្សារ​គី​ឡូ​លេខ​ 6', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E205271', 'ផ្លូវ​371', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('F225CVM', 'ឈូក​រ៉ា​១', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('F226KPP', 'គ្រេន​ភ្នំ​ពេញ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('F227OD', 'អូ​ដឹម', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('F228PS', 'ព្រៃ​សរ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('F229STP2', 'បុ​រី​សន្តិ​ភាព​២', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('F230KB', 'កំ​បូល​', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('F231VS', 'បុ​រី​វាល​ស្បូវ​', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('F232PP', 'ព្រែក​ភ្នៅ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('F233WVS', 'វត្ត​វាល​ស្បូវ​', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('F234SBKPJ', 'ស្រា​បៀរ​ក​ម្ពុ​ជា', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('F235TNKS', 'ទំ​នប់​កប់​ស្រូវ​', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('F236WS', 'វត្ត​ស្លែង', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('F237PA', 'ព្រែក​អែង', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('F238VMJJ', 'វិ​មាន​ឈ្នះ​ៗ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('F239RVKS', 'វង្វង់​កួរ​ស្រូវ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('F240PH', 'ព្រែក​ហូ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('F241PHSM', 'ផ្លូវ​៦០​ម៉ែត្រ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('F242SLYP', 'ស្ពាន​លី​យ៉ុង​ផាត់​', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('F243HRVTKM', 'ហួស​រង្វ​ង់មូល​តា​ខ្មៅ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C105TS', 'ផ្លូវ​ត្រ​សក់​ផ្អែម​', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E206PL', 'ព្រែក​លាប​(បុ​រី​មេ​គង្គ​ Royal)', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E207KT', 'ក្រំាង​ធ្នង់', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E208WKK', 'វត្ត​គៀន​ឃ្លាំង​', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C106SDP', 'ផ្លូវ​សម្ដេច​ប៉ាន​', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D162SL', 'សរ​ឡា', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D163lB', 'លូ​ប្រាំ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('D164S7MKR', 'ស្ពាន់​៧​មករា', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('F244RVMKS', 'រង្វង់​មូល​គួរ​ស្រូវ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('F245BJ', 'បែក​ចាន', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C107MNR', 'ផ្លូវ​មុន្នី​រ៉េត', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E209KNCT', 'កា​ណា​ស៊ី​ធី', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C108K2', 'ក្តាន់​២', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('F246PJL3', 'ផ្លូវ​ជាតិ​លេខ​៣', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('F247WJPK', 'វត្តចំពុះក្អែក', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('C109MNV', 'ផ្លូវមុន្នីវង្ស', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E210TKS', 'តាំងក្រសាំង', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E211BSLT', 'បឹងសាឡាងថ្មី', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E212BRR', 'បុរីរីទ្ធ ទួលសង្កែ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E213PDK', 'ភូមិដើមខ្វិត', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E214PDOP', 'ផ្សារដើមអំពិល', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E215WPS', 'វត្តព្រែកឬស្សី', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E216PTKM', 'ផ្សារតាខ្មៅ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E217SPSR', 'ស្ពានព្រែកសំរោង', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E218BTSD', 'បន្ទាយសម្តេច', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E219KPSN', 'កំពុងសំណាញ់', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E220WTM', 'វត្តតាខ្មៅ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E221PRS', 'ភូមិឬស្សី', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E222SN', 'សូនី', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E223PJ', 'ព្រៃជ្រៃ', '14', '13', 'Local');
INSERT INTO `zones_broexpress` VALUES ('E224JA', 'ជើងឯក', '14', '13', 'Local');

-- ----------------------------
-- Function structure for `encode_email`
-- ----------------------------
DROP FUNCTION IF EXISTS `encode_email`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `encode_email`(`email` VARCHAR(100)) RETURNS varchar(100) CHARSET utf8
BEGIN
  return REPLACE(email,'@','&U05;');
END
;;
DELIMITER ;

-- ----------------------------
-- Function structure for `encode_time`
-- ----------------------------
DROP FUNCTION IF EXISTS `encode_time`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `encode_time`(`mTime` VARCHAR(25)) RETURNS varchar(25) CHARSET utf8
BEGIN
 return replace(mTime,':','&U09;');
END
;;
DELIMITER ;

-- ----------------------------
-- Function structure for `getPriceListName`
-- ----------------------------
DROP FUNCTION IF EXISTS `getPriceListName`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `getPriceListName`(l_id int) RETURNS varchar(100) CHARSET utf8
BEGIN
   SET @lname = (SELECT `name` FROM price_list_names AS l WHERE l.id =l_id LIMIT 1);
   RETURN @lname;
END
;;
DELIMITER ;

-- ----------------------------
-- Function structure for `get_cod_amount`
-- ----------------------------
DROP FUNCTION IF EXISTS `get_cod_amount`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `get_cod_amount`(`cod` TINYINT, `price` DECIMAL(10,2), `cod_fee` DECIMAL(10,2)) RETURNS decimal(10,2)
BEGIN
  IF(cod =1) THEN 
     return (price - IFNULL(cod_fee,0));
  else return 0;
  end if;
END
;;
DELIMITER ;

-- ----------------------------
-- Function structure for `kg_within`
-- ----------------------------
DROP FUNCTION IF EXISTS `kg_within`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `kg_within`(`lower_kg` DECIMAL(10,2), `upper_kg` DECIMAL(10,2), `this_kg` DECIMAL(10,2)) RETURNS tinyint(4)
BEGIN
  IF (lower_kg <=0 AND upper_kg <=0) THEN
     return 1;
  ELSEIF (lower_kg <=0 AND upper_kg >0) THEN
     if (this_kg <= upper_kg) then
        return 1;
     else 
        return 0;
     end if;
  ELSEIF (lower_kg >0 AND upper_kg <=0) THEN
      if (this_kg > lower_kg) then 
         return 1;
      else 
         return 0;
      end if;  
  ELSEIF (lower_kg >0 AND upper_kg >0) THEN
     IF (lower_kg <= this_kg AND upper_kg >= this_kg) THEN
        return 1;
     ELSE 
        return 0;
     END IF;
  ELSE
     RETURN 0; #default   
  END IF;

END
;;
DELIMITER ;
