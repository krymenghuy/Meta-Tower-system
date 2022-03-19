/*
Navicat MySQL Data Transfer

Source Server         : connection1
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : delivery_db

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2021-12-09 16:31:10
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
  `payment_date` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `description` varchar(150) NOT NULL,
  `amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `payee_id` int(10) DEFAULT NULL,
  `payee_type` varchar(25) DEFAULT NULL,
  `payee_name` varchar(150) DEFAULT NULL,
  `pmt_method` varchar(20) NOT NULL DEFAULT '',
  `cashier_name` varchar(35) NOT NULL,
  `create_user` varchar(35) NOT NULL,
  `create_date` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `create_uid` int(10) DEFAULT NULL,
  `pmt_type` varchar(30) DEFAULT NULL,
  `file_name` varchar(350) DEFAULT NULL,
  `file_type` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of cash_disbursements
-- ----------------------------
INSERT INTO `cash_disbursements` VALUES ('4', '1', '2021-11-24 11:59:46.000000', 'Pay to vendor', '51.98', '5', 'sender', 'Ly Huot', 'ABA', 'admin@gmail.com', 'admin@gmail.com', '2021-11-24 11:59:46.000000', null, 'Payment to Vendor', null, null);
INSERT INTO `cash_disbursements` VALUES ('5', '1', '2021-11-28 13:01:35.000000', 'Pay to vendor', '30.00', '38', 'sender', 'Meng Korng', 'Cash', 'admin@gmail.com', 'admin@gmail.com', '2021-11-28 13:01:35.000000', null, 'Payment to Vendor', null, null);
INSERT INTO `cash_disbursements` VALUES ('6', '1', '2021-11-28 13:01:47.000000', 'Pay to vendor', '20.00', '37', 'sender', 'Rattana Hak', 'Cash', 'admin@gmail.com', 'admin@gmail.com', '2021-11-28 13:01:47.000000', null, 'Payment to Vendor', null, null);
INSERT INTO `cash_disbursements` VALUES ('7', '1', '2021-11-28 13:01:57.000000', 'Pay to vendor', '10.00', '39', 'sender', 'Seng Kimly', 'Cash', 'admin@gmail.com', 'admin@gmail.com', '2021-11-28 13:01:57.000000', null, 'Payment to Vendor', null, null);
INSERT INTO `cash_disbursements` VALUES ('8', '1', '2021-11-28 13:26:42.000000', 'Pay to vendor', '10.00', '39', 'sender', 'Seng Kimly', 'Cash', 'admin@gmail.com', 'admin@gmail.com', '2021-11-28 13:26:42.000000', null, 'Payment to Vendor', null, null);
INSERT INTO `cash_disbursements` VALUES ('9', '1', '2021-11-28 13:26:49.000000', 'Pay to vendor', '10.00', '40', 'sender', 'អូន ធីដា', 'Cash', 'admin@gmail.com', 'admin@gmail.com', '2021-11-28 13:26:49.000000', null, 'Payment to Vendor', null, null);
INSERT INTO `cash_disbursements` VALUES ('10', '1', '2021-11-29 13:27:18.000000', 'Pay to vendor', '28.00', '37', 'sender', 'Rattana Hak', 'ABA', 'admin@gmail.com', 'admin@gmail.com', '2021-11-29 13:27:18.000000', null, 'Payment to Vendor', null, null);
INSERT INTO `cash_disbursements` VALUES ('11', '1', '2021-12-02 17:14:29.000000', 'Pay to vendor', '66.00', '38', 'sender', 'Meng Korng', 'ABA', 'admin@gmail.com', 'admin@gmail.com', '2021-12-02 17:14:29.000000', null, 'Payment to Vendor', null, null);
INSERT INTO `cash_disbursements` VALUES ('12', '1', '2021-12-02 17:14:38.000000', 'Pay to vendor', '42.00', '37', 'sender', 'Rattana Hak', 'ABA', 'admin@gmail.com', 'admin@gmail.com', '2021-12-02 17:14:38.000000', null, 'Payment to Vendor', null, null);
INSERT INTO `cash_disbursements` VALUES ('13', '1', '2021-12-02 17:14:53.000000', 'Pay to vendor', '43.00', '39', 'sender', 'Seng Kimly', 'ABA', 'admin@gmail.com', 'admin@gmail.com', '2021-12-02 17:14:53.000000', null, 'Payment to Vendor', null, null);
INSERT INTO `cash_disbursements` VALUES ('14', '1', '2021-12-02 17:15:06.000000', 'Pay to vendor', '10.00', '40', 'sender', 'អូន ធីដា', 'ABA', 'admin@gmail.com', 'admin@gmail.com', '2021-12-02 17:15:06.000000', null, 'Payment to Vendor', null, null);
INSERT INTO `cash_disbursements` VALUES ('15', '1', '2021-12-03 22:22:48.000000', 'Pay to vendor', '54.00', '39', 'sender', 'Seng Kimly', 'ABA', 'admin@gmail.com', 'admin@gmail.com', '2021-12-03 22:22:48.000000', null, 'Payment to Vendor', null, null);
INSERT INTO `cash_disbursements` VALUES ('16', '1', '2021-12-04 00:10:38.000000', 'Pay to vendor', '32.00', '38', 'sender', 'Meng Korng', 'ABA', 'admin@gmail.com', 'admin@gmail.com', '2021-12-04 00:10:38.000000', null, 'Payment to Vendor', null, null);
INSERT INTO `cash_disbursements` VALUES ('17', '1', '2021-12-05 16:52:14.519339', 'Pay to vendor', '98.00', '38', 'sender', 'Meng Korng', 'ABA', 'admin@gmail.com', 'admin@gmail.com', '2021-12-05 16:52:14.519339', null, 'Payment to Vendor', '/home3/parrotcloudapps/public_html/uploads/companies/1_data/transactions_vendor/1_trx_img_20211205_041214.jpg', 'jpg');
INSERT INTO `cash_disbursements` VALUES ('18', '1', '2021-12-05 16:51:51.819165', 'Pay to vendor', '23.00', '41', 'sender', 'Madam Q Homestore', 'ABA', 'admin@gmail.com', 'admin@gmail.com', '2021-12-05 16:51:51.819165', null, 'Payment to Vendor', '/home3/parrotcloudapps/public_html/uploads/companies/1_data/transactions_vendor/1_trx_img_20211205_041251.jpg', 'jpg');
INSERT INTO `cash_disbursements` VALUES ('19', '1', '2021-12-05 16:52:40.976139', 'Pay to vendor', '42.00', '37', 'sender', 'Rattana Hak', 'ABA', 'admin@gmail.com', 'admin@gmail.com', '2021-12-05 16:52:40.976139', null, 'Payment to Vendor', '/home3/parrotcloudapps/public_html/uploads/companies/1_data/transactions_vendor/1_trx_img_20211205_041240.jpg', 'jpg');
INSERT INTO `cash_disbursements` VALUES ('20', '1', '2021-12-05 16:53:04.883299', 'Pay to vendor', '10.00', '40', 'sender', 'អូន ធីដា', 'ABA', 'admin@gmail.com', 'admin@gmail.com', '2021-12-05 16:53:04.883299', null, 'Payment to Vendor', '/home3/parrotcloudapps/public_html/uploads/companies/1_data/transactions_vendor/1_trx_img_20211205_041204.png', 'png');
INSERT INTO `cash_disbursements` VALUES ('21', '1', '2021-12-05 16:56:37.810224', 'Pay to vendor', '87.00', '39', 'sender', 'Seng Kimly', 'ABA', 'admin@gmail.com', 'admin@gmail.com', '2021-12-05 16:56:37.810224', null, 'Payment to Vendor', '/home3/parrotcloudapps/public_html/uploads/companies/1_data/transactions_vendor/1_trx_img_20211205_041237.jpg', 'jpg');

-- ----------------------------
-- Table structure for `cash_disbursements_attachments`
-- ----------------------------
DROP TABLE IF EXISTS `cash_disbursements_attachments`;
CREATE TABLE `cash_disbursements_attachments` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `trx_id` int(10) NOT NULL,
  `upload_id` int(10) NOT NULL,
  `create_user` varchar(35) DEFAULT NULL,
  `create_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
  `payment_date` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `cashier_name` varchar(50) NOT NULL,
  `pmt_type` varchar(20) NOT NULL DEFAULT '' COMMENT 'driver payment, sender payment',
  `pmt_method` varchar(35) NOT NULL,
  `create_user` varchar(35) NOT NULL,
  `create_date` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `update_user` varchar(35) DEFAULT NULL,
  `update_date` time DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `description` varchar(150) DEFAULT NULL,
  `file_name` varchar(350) DEFAULT NULL,
  `file_type` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of cash_receipts
-- ----------------------------
INSERT INTO `cash_receipts` VALUES ('13', '1', 'Khit Puthea', 'driver', '27', '2021-11-28 12:58:26.000000', 'admin@gmail.com', 'driver payment', 'Cash', 'admin@gmail.com', '2021-11-28 12:58:26.000000', null, null, '60.00', 'Payment received', null, null);
INSERT INTO `cash_receipts` VALUES ('14', '1', 'Phoeun Sopha', 'driver', '28', '2021-11-28 13:25:03.000000', 'admin@gmail.com', 'driver payment', 'Cash', 'admin@gmail.com', '2021-11-28 13:25:03.000000', null, null, '20.00', 'Payment received', null, null);
INSERT INTO `cash_receipts` VALUES ('15', '1', 'Phoeun Sopha', 'driver', '28', '2021-11-29 13:22:52.000000', 'admin@gmail.com', 'driver payment', 'ACLEDA', 'admin@gmail.com', '2021-11-29 13:22:52.000000', null, null, '28.00', 'Payment received', null, null);
INSERT INTO `cash_receipts` VALUES ('16', '1', 'Phoeun Sopha', 'driver', '28', '2021-12-01 21:24:11.000000', 'admin@gmail.com', 'driver payment', 'ABA', 'admin@gmail.com', '2021-12-01 21:24:11.000000', null, null, '168.50', 'Payment received', null, null);
INSERT INTO `cash_receipts` VALUES ('17', '1', 'Khit Puthea', 'driver', '27', '2021-12-01 21:24:24.000000', 'admin@gmail.com', 'driver payment', 'ABA', 'admin@gmail.com', '2021-12-01 21:24:24.000000', null, null, '34.50', 'Payment received', null, null);
INSERT INTO `cash_receipts` VALUES ('18', '1', 'Khit Puthea', 'driver', '27', '2021-12-02 16:58:38.000000', 'admin@gmail.com', 'driver payment', 'ABA', 'admin@gmail.com', '2021-12-02 16:58:38.000000', null, null, '70.89', 'Payment received', null, null);
INSERT INTO `cash_receipts` VALUES ('19', '1', 'Phoeun Sopha', 'driver', '28', '2021-12-02 17:03:47.000000', 'admin@gmail.com', 'driver payment', 'ABA', 'admin@gmail.com', '2021-12-02 17:03:47.000000', null, null, '101.50', 'Payment received', null, null);
INSERT INTO `cash_receipts` VALUES ('20', '1', 'Phoeun Sopha', 'driver', '28', '2021-12-03 22:20:05.000000', 'admin@gmail.com', 'driver payment', 'Cash', 'admin@gmail.com', '2021-12-03 22:20:05.000000', null, null, '61.41', 'Payment received', null, null);
INSERT INTO `cash_receipts` VALUES ('21', '1', 'Khit Puthea', 'driver', '27', '2021-12-04 00:08:14.000000', 'admin@gmail.com', 'driver payment', 'ABA', 'admin@gmail.com', '2021-12-04 00:08:14.000000', null, null, '34.76', 'Payment received', null, null);
INSERT INTO `cash_receipts` VALUES ('22', '1', 'Khit Puthea', 'driver', '27', '2021-12-04 15:59:49.000000', 'admin@gmail.com', 'driver payment', 'ABA', 'admin@gmail.com', '2021-12-04 15:59:49.000000', null, null, '136.63', 'Payment received', null, null);
INSERT INTO `cash_receipts` VALUES ('23', '1', 'Phoeun Sopha', 'driver', '28', '2021-12-04 16:00:03.000000', 'admin@gmail.com', 'driver payment', 'ABA', 'admin@gmail.com', '2021-12-04 16:00:03.000000', null, null, '141.80', 'Payment received', null, null);

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
  `create_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
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
-- Table structure for `delivery`
-- ----------------------------
DROP TABLE IF EXISTS `delivery`;
CREATE TABLE `delivery` (
  `branch_id` int(10) NOT NULL,
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `order_id` int(10) DEFAULT NULL COMMENT 'order_id is linked to "orders" table',
  `driver_id` int(10) DEFAULT NULL,
  `status_id` tinyint(6) DEFAULT NULL,
  `depart_time` timestamp(6) NULL DEFAULT current_timestamp(6) COMMENT 'time at which the package is scanned to take out',
  `notes` varchar(200) DEFAULT NULL,
  `package_count` int(10) NOT NULL DEFAULT 0,
  `delivered_count` int(10) NOT NULL DEFAULT 0,
  `failed_count` int(10) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `create_date` timestamp(6) NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `update_date` timestamp(6) NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `fleet_tracking_number` varchar(35) DEFAULT '' COMMENT 'fleet_tracking_number is used by delivery company to track each driver progoess',
  `warehouse_id` int(10) DEFAULT NULL,
  `vehicle_type` varchar(25) DEFAULT NULL,
  `delivery_type` varchar(25) DEFAULT NULL,
  `ctd_count` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of delivery
-- ----------------------------
INSERT INTO `delivery` VALUES ('1', '45', null, '27', '3', '2021-12-02 07:00:00.000000', null, '2', '0', '0', 'admin@gmail.com', '2021-12-02 16:49:24.995216', 'admin@gmail.com', '2021-12-02 16:49:24.995216', '100003', '1', 'motobike', 'Normal', null);
INSERT INTO `delivery` VALUES ('1', '47', null, '0', '1', '2021-12-02 07:00:00.000000', null, '0', '0', null, 'admin@gmail.com', '2021-12-02 16:38:42.000000', 'admin@gmail.com', '2021-12-02 16:38:42.625223', '', '1', 'motobike', 'Normal', null);
INSERT INTO `delivery` VALUES ('1', '48', null, '0', '1', '2021-12-02 07:00:00.000000', null, '0', '0', null, 'admin@gmail.com', '2021-12-02 16:40:20.000000', 'admin@gmail.com', '2021-12-02 16:40:20.552084', '', '1', 'motobike', 'Normal', null);
INSERT INTO `delivery` VALUES ('1', '49', null, '28', '3', '2021-12-02 07:00:00.000000', null, '6', '0', '0', 'admin@gmail.com', '2021-12-02 16:49:09.255749', 'admin@gmail.com', '2021-12-02 16:49:09.255749', '100004', '1', 'motobike', 'Normal', null);
INSERT INTO `delivery` VALUES ('1', '50', null, '27', '3', '2021-12-02 07:00:00.000000', null, '2', '0', '0', 'admin@gmail.com', '2021-12-02 16:48:06.007200', 'admin@gmail.com', '2021-12-02 16:48:06.007200', '100005', '1', 'motobike', 'Normal', null);
INSERT INTO `delivery` VALUES ('1', '51', null, '28', '3', '2021-12-03 07:00:00.000000', null, '7', '0', '0', 'admin@gmail.com', '2021-12-03 20:46:01.617753', 'admin@gmail.com', '2021-12-03 20:46:01.617753', '100006', '1', 'motobike', 'Normal', null);
INSERT INTO `delivery` VALUES ('1', '52', null, '27', '3', '2021-12-04 07:00:00.000000', null, '3', '0', '0', 'admin@gmail.com', '2021-12-04 00:05:29.124532', 'admin@gmail.com', '2021-12-04 00:05:29.124532', '100007', '1', 'motobike', 'Normal', null);
INSERT INTO `delivery` VALUES ('1', '53', null, '28', '3', '2021-12-04 07:00:00.000000', null, '5', '0', '0', 'admin@gmail.com', '2021-12-04 15:52:40.993075', 'admin@gmail.com', '2021-12-04 15:52:40.993075', '100008', '1', 'motobike', 'Normal', null);
INSERT INTO `delivery` VALUES ('1', '54', null, '27', '3', '2021-12-04 07:00:00.000000', null, '5', '0', '0', 'admin@gmail.com', '2021-12-04 15:54:54.999431', 'admin@gmail.com', '2021-12-04 15:54:54.999431', '100009', '1', 'motobike', 'Normal', null);
INSERT INTO `delivery` VALUES ('1', '55', null, '28', '2', '2021-12-06 00:00:00.000000', null, '1', '0', '0', 'admin@gmail.com', '2021-12-06 13:17:53.407703', 'admin@gmail.com', '2021-12-06 13:17:53.000000', '100010', '1', 'motobike', 'Normal', null);
INSERT INTO `delivery` VALUES ('1', '56', null, '28', '2', '2021-12-06 13:32:53.000000', null, '1', '0', '0', 'admin@gmail.com', '2021-12-06 13:32:53.315164', 'admin@gmail.com', '2021-12-06 13:32:53.000000', '100011', '1', 'motobike', 'Normal', null);

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
-- Table structure for `delivery_statuses_del`
-- ----------------------------
DROP TABLE IF EXISTS `delivery_statuses_del`;
CREATE TABLE `delivery_statuses_del` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(25) NOT NULL,
  `display_name` varchar(50) DEFAULT NULL,
  `protected` tinyint(6) DEFAULT NULL,
  `is_outstanding` tinyint(6) NOT NULL DEFAULT 1 COMMENT 'is_outstanding=0 = > failed or succeeded=> this delivery task or package is not in Outstanding tasks',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of delivery_statuses_del
-- ----------------------------
INSERT INTO `delivery_statuses_del` VALUES ('1', 'pending', 'Pending', '1', '0');
INSERT INTO `delivery_statuses_del` VALUES ('2', 'otw', 'On The Way', '1', '0');
INSERT INTO `delivery_statuses_del` VALUES ('3', 'delivered', 'Delivered', '1', '0');
INSERT INTO `delivery_statuses_del` VALUES ('4', 'failed', 'Failed', '1', '0');
INSERT INTO `delivery_statuses_del` VALUES ('5', 'delayed', 'Delayed', '1', '0');

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
  `update_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `create_user` varchar(35) DEFAULT NULL,
  `create_date` timestamp(6) NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `sex` varchar(10) DEFAULT NULL,
  `shift` varchar(15) DEFAULT '',
  `allow_fast_delivery` tinyint(4) DEFAULT NULL,
  `delivery_commission_type` varchar(15) DEFAULT NULL,
  `pickup_commission_type` varchar(15) DEFAULT NULL,
  `role` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of driver
-- ----------------------------
INSERT INTO `driver` VALUES ('27', '1', 'Khit Puthea', 'ឃិត ពុទ្ធា', null, '077312154', '001', null, '#458 St.24BT, Sangkat Boeung Tompon, Khan Meanchey, Phnom Penh, Cambodia', 'motobike', 'កំពង់ចាម 030390', null, null, null, 'full time', '0.00', '0.00', null, null, null, '10001', 'farmersonexpress01@gmail.com', 'active', 'admin@gmail.com', '2021-12-07 00:58:11.251638', 'Puthea', '2021-12-07 00:58:11.251638', 'M', 'FD', '0', null, null, null);
INSERT INTO `driver` VALUES ('28', '1', 'Phoeun Sopha', 'ភឿន សុផា', null, '081802428', '002', null, 'ខេត្ត កំពង់ចាម', 'motobike', 'គំពង់ចាម 030390', null, null, null, 'full time', '0.00', '0.00', null, null, null, '10002', null, 'active', 'admin@gmail.com', '2021-12-07 00:58:11.251638', 'Puthea', '2021-12-07 00:58:11.251638', 'M', 'FD', '0', null, null, null);

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
INSERT INTO `driver_code_control` VALUES ('2', '1', '3', null);

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
INSERT INTO `driver_commissions` VALUES ('17', '1', '27', 'normal', '0.00', '0.00', '0.12', '0.13', '0', '1', 'admin@gmail.com', '2021-11-28 13:09:27.000000', '1');
INSERT INTO `driver_commissions` VALUES ('18', '1', '27', 'fast', '0.00', '0.00', '0.13', '0.25', '0', '1', 'admin@gmail.com', '2021-11-28 13:09:27.000000', '1');
INSERT INTO `driver_commissions` VALUES ('19', '1', '28', 'normal', '0.00', '0.00', '0.13', '0.13', '0', '1', 'admin@gmail.com', '2021-11-28 13:09:48.000000', '1');
INSERT INTO `driver_commissions` VALUES ('20', '1', '28', 'fast', '0.00', '0.00', '0.13', '0.25', '0', '1', 'admin@gmail.com', '2021-11-28 13:09:48.000000', '1');

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
  `create_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
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
  `create_date` timestamp(6) NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of exchange_rates
-- ----------------------------
INSERT INTO `exchange_rates` VALUES ('1', '4100.0000', '4100.0000', null, '0', '', '2021-10-21 00:44:20.466559');

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
  `create_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
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
  `create_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(35) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `branch_id` int(10) DEFAULT NULL,
  `map_location` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `loc_cities_country_id_foreign` (`country_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of loc_cities
-- ----------------------------
INSERT INTO `loc_cities` VALUES ('13', '14', 'ក្រុងភ្នំពេញ', 'ក្រុងភ្នំពេញ', 'Puthea', '2021-11-21 18:45:27.646528', null, '1', null);

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
  `create_date` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `loc_communes_country_id_foreign` (`country_id`),
  KEY `loc_communes_city_id_foreign` (`city_id`),
  KEY `loc_communes_district_id_foreign` (`district_id`)
) ENGINE=InnoDB AUTO_INCREMENT=151 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of loc_communes
-- ----------------------------
INSERT INTO `loc_communes` VALUES ('57', '14', '13', '37', 'ទន្លេបាសាក់', '1', 'ទន្លេបាសាក់', null, 'Puthea', '2021-11-21 18:57:18');
INSERT INTO `loc_communes` VALUES ('58', '14', '13', '37', 'បឹងកេងកងទី ១', '1', 'បឹងកេងកងទី ១', null, 'Puthea', '2021-11-21 19:00:18');
INSERT INTO `loc_communes` VALUES ('59', '14', '13', '37', 'បឹងកេងកងទី ២', '1', 'បឹងកេងកងទី ២', null, 'Puthea', '2021-11-21 19:00:30');
INSERT INTO `loc_communes` VALUES ('60', '14', '13', '37', 'បឹងកេងកងទី ៣', '1', 'បឹងកេងកងទី ៣', null, 'Puthea', '2021-11-21 19:00:53');
INSERT INTO `loc_communes` VALUES ('61', '14', '13', '37', 'អូឡាំពិក', '1', 'អូឡាំពិក', null, 'Puthea', '2021-11-21 19:01:34');
INSERT INTO `loc_communes` VALUES ('62', '14', '13', '37', 'ទួលស្វាយព្រៃទី ១', '1', 'ទួលស្វាយព្រៃទី ១', null, 'Puthea', '2021-11-21 19:01:53');
INSERT INTO `loc_communes` VALUES ('63', '14', '13', '37', 'ទួលស្វាយព្រៃទី ២', '1', 'ទួលស្វាយព្រៃទី ២', null, 'Puthea', '2021-11-21 19:02:08');
INSERT INTO `loc_communes` VALUES ('64', '14', '13', '37', 'ទំនប់ទឹក', '1', 'ទំនប់ទឹក', null, 'Puthea', '2021-11-21 19:02:24');
INSERT INTO `loc_communes` VALUES ('65', '14', '13', '37', 'ទួលទំពូងទី២', '1', 'ទួលទំពូងទី២', null, 'Puthea', '2021-11-21 19:02:38');
INSERT INTO `loc_communes` VALUES ('66', '14', '13', '37', 'ទួលទំពូងទី១', '1', 'ទួលទំពូងទី១', null, 'Puthea', '2021-11-21 19:02:51');
INSERT INTO `loc_communes` VALUES ('67', '14', '13', '37', 'បឹងត្របែក', '1', 'បឹងត្របែក', null, 'Puthea', '2021-11-21 19:03:03');
INSERT INTO `loc_communes` VALUES ('68', '14', '13', '37', 'ផ្សាដើមថ្កូវ', '1', 'ផ្សាដើមថ្កូវ', null, 'Puthea', '2021-11-21 19:03:13');
INSERT INTO `loc_communes` VALUES ('69', '14', '13', '38', 'ដង្កោ', '1', 'ដង្កោ', null, 'Puthea', '2021-11-22 10:33:12');
INSERT INTO `loc_communes` VALUES ('70', '14', '13', '38', 'ពងទឹក', '1', 'ពងទឹក', null, 'Puthea', '2021-11-22 10:34:15');
INSERT INTO `loc_communes` VALUES ('71', '14', '13', '38', 'ព្រៃវែង', '1', 'ព្រៃវែង', null, 'Puthea', '2021-11-22 10:34:27');
INSERT INTO `loc_communes` VALUES ('72', '14', '13', '38', 'ព្រៃស', '1', 'ព្រៃស', null, 'Puthea', '2021-11-22 10:34:45');
INSERT INTO `loc_communes` VALUES ('73', '14', '13', '38', 'ក្រាំងពង្រ', '1', 'ក្រាំងពង្រ', null, 'Puthea', '2021-11-22 10:34:54');
INSERT INTO `loc_communes` VALUES ('74', '14', '13', '38', 'ប្រទះឡាង', '1', 'ប្រទះឡាង', null, 'Puthea', '2021-11-22 10:35:11');
INSERT INTO `loc_communes` VALUES ('75', '14', '13', '38', 'សាក់សំពៅ', '1', 'សាក់សំពៅ', null, 'Puthea', '2021-11-22 10:35:23');
INSERT INTO `loc_communes` VALUES ('76', '14', '13', '38', 'ជយ័ជំនះ', '1', 'ជយ័ជំនះ', null, 'Puthea', '2021-11-22 10:35:34');
INSERT INTO `loc_communes` VALUES ('77', '14', '13', '38', 'ផ្សាចាស់', '1', 'ផ្សាចាស់', null, 'Puthea', '2021-11-22 10:35:54');
INSERT INTO `loc_communes` VALUES ('78', '14', '13', '38', 'វត្តភ្នំ', '1', 'វត្តភ្នំ', null, 'Puthea', '2021-11-22 10:36:09');
INSERT INTO `loc_communes` VALUES ('79', '14', '13', '39', 'ផ្សាដេប៉ូទី១', '1', 'ផ្សាដេប៉ូទី១', null, 'Puthea', '2021-11-22 10:37:43');
INSERT INTO `loc_communes` VALUES ('80', '14', '13', '39', 'ផ្សាដេប៉ូទី២', '1', 'ផ្សាដេប៉ូទី២', null, 'Puthea', '2021-11-22 10:48:19');
INSERT INTO `loc_communes` VALUES ('81', '14', '13', '39', 'ផ្សាដេប៉ូទី៣', '1', 'ផ្សាដេប៉ូទី៣', null, 'Puthea', '2021-11-22 10:48:31');
INSERT INTO `loc_communes` VALUES ('82', '14', '13', '39', 'ទឹកល្អក់ទី១', '1', 'ទឹកល្អក់ទី១', null, 'Puthea', '2021-11-22 10:48:43');
INSERT INTO `loc_communes` VALUES ('83', '14', '13', '39', 'ទឹកល្អក់ទី២', '1', 'ទឹកល្អក់ទី២', null, 'Puthea', '2021-11-22 10:48:55');
INSERT INTO `loc_communes` VALUES ('84', '14', '13', '39', 'ទឹកល្អក់ទី៣', '1', 'ទឹកល្អក់ទី៣', null, 'Puthea', '2021-11-22 10:49:06');
INSERT INTO `loc_communes` VALUES ('85', '14', '13', '39', 'បឹងកក់ទី១', '1', 'បឹងកក់ទី១', null, 'Puthea', '2021-11-22 10:49:17');
INSERT INTO `loc_communes` VALUES ('86', '14', '13', '39', 'ជើងអែក', '1', 'ជើងអែក', null, 'Puthea', '2021-11-22 10:49:53');
INSERT INTO `loc_communes` VALUES ('87', '14', '13', '39', 'គងនយ', '1', 'គងនយ', null, 'Puthea', '2021-11-22 10:50:06');
INSERT INTO `loc_communes` VALUES ('88', '14', '13', '39', 'ព្រែកកំពឹស', '1', 'ព្រែកកំពឹស', null, 'Puthea', '2021-11-22 10:50:16');
INSERT INTO `loc_communes` VALUES ('89', '14', '13', '39', 'រលួស', '1', 'រលួស', null, 'Puthea', '2021-11-22 10:50:27');
INSERT INTO `loc_communes` VALUES ('90', '14', '13', '39', 'ស្ពានថ្ម', '1', 'ស្ពានថ្ម', null, 'Puthea', '2021-11-22 10:50:39');
INSERT INTO `loc_communes` VALUES ('91', '14', '13', '39', 'ទៀន', '1', 'ទៀន', null, 'Puthea', '2021-11-22 10:50:53');
INSERT INTO `loc_communes` VALUES ('92', '14', '13', '40', 'អូឬស្សីទី១', '1', 'អូឬស្សីទី១', null, 'Puthea', '2021-11-22 10:51:40');
INSERT INTO `loc_communes` VALUES ('93', '14', '13', '40', 'អូឬស្សីទី៣', '1', 'អូឬស្សីទី៣', null, 'Puthea', '2021-11-22 10:52:11');
INSERT INTO `loc_communes` VALUES ('94', '14', '13', '40', 'អូឬស្សីទី៤', '1', 'អូឬស្សីទី៤', null, 'Puthea', '2021-11-22 10:52:11');
INSERT INTO `loc_communes` VALUES ('95', '14', '13', '40', 'មនោរម្យ', '1', 'មនោរម្យ', null, 'Puthea', '2021-11-22 10:52:23');
INSERT INTO `loc_communes` VALUES ('96', '14', '13', '40', 'មិត្តភាព', '1', 'មិត្តភាព', null, 'Puthea', '2021-11-22 10:52:32');
INSERT INTO `loc_communes` VALUES ('97', '14', '13', '40', 'វាលវង់', '1', 'វាលវង់', null, 'Puthea', '2021-11-22 10:52:41');
INSERT INTO `loc_communes` VALUES ('98', '14', '13', '40', 'បឹងព្រលិត', '1', 'បឹងព្រលិត', null, 'Puthea', '2021-11-22 10:52:51');
INSERT INTO `loc_communes` VALUES ('99', '14', '13', '41', 'ទួលសង្កែ', '1', 'ទួលសង្កែ', null, 'Puthea', '2021-11-22 10:53:08');
INSERT INTO `loc_communes` VALUES ('100', '14', '13', '41', 'ស្វាយប៉ាក', '1', 'ស្វាយប៉ាក', null, 'Puthea', '2021-11-22 10:53:21');
INSERT INTO `loc_communes` VALUES ('101', '14', '13', '41', 'គីឡូម៉ែតលេខ៦', '1', 'គីឡូម៉ែតលេខ៦', null, 'Puthea', '2021-11-22 10:53:32');
INSERT INTO `loc_communes` VALUES ('102', '14', '13', '41', 'ឬស្សីកែង', '1', 'ឬស្សីកែង', null, 'Puthea', '2021-11-22 10:53:43');
INSERT INTO `loc_communes` VALUES ('103', '14', '13', '41', 'ច្រាំងចំរេះទី១', '1', 'ច្រាំងចំរេះទី១', null, 'Puthea', '2021-11-22 10:53:53');
INSERT INTO `loc_communes` VALUES ('104', '14', '13', '41', 'ច្រាំងចំរេះទី២', '1', 'ច្រាំងចំរេះទី២', null, 'Puthea', '2021-11-22 10:54:03');
INSERT INTO `loc_communes` VALUES ('105', '14', '13', '42', 'ភ្នំពេញថ្មី', '1', 'ភ្នំពេញថ្មី', null, 'Puthea', '2021-11-22 10:54:23');
INSERT INTO `loc_communes` VALUES ('106', '14', '13', '42', 'ទឹកថ្លា', '1', 'ទឹកថ្លា', null, 'Puthea', '2021-11-22 10:54:34');
INSERT INTO `loc_communes` VALUES ('107', '14', '13', '42', 'ឈ្នួល', '1', 'ឈ្នួល', null, 'Puthea', '2021-11-22 10:54:47');
INSERT INTO `loc_communes` VALUES ('108', '14', '13', '42', 'ក្រាំងថ្នង់', '1', 'ក្រាំងថ្នង់', null, 'Puthea', '2021-11-22 10:55:00');
INSERT INTO `loc_communes` VALUES ('109', '14', '13', '43', 'ត្រពាំងក្រសាំង', '1', 'ត្រពាំងក្រសាំង', null, 'Puthea', '2021-11-22 10:55:24');
INSERT INTO `loc_communes` VALUES ('110', '14', '13', '43', 'ភ្លើងឆេះរទិះ', '1', 'ភ្លើងឆេះរទិះ', null, 'Puthea', '2021-11-22 10:55:43');
INSERT INTO `loc_communes` VALUES ('111', '14', '13', '43', 'ចោមចៅ', '1', 'ចោមចៅ', null, 'Puthea', '2021-11-22 10:55:43');
INSERT INTO `loc_communes` VALUES ('112', '14', '13', '43', 'កាកាប', '1', 'កាកាប', null, 'Puthea', '2021-11-22 10:55:52');
INSERT INTO `loc_communes` VALUES ('113', '14', '13', '43', 'សំរោងក្រោម', '1', 'សំរោងក្រោម', null, 'Puthea', '2021-11-22 10:56:02');
INSERT INTO `loc_communes` VALUES ('114', '14', '13', '43', 'បឹងធំ', '1', 'បឹងធំ', null, 'Puthea', '2021-11-22 10:56:11');
INSERT INTO `loc_communes` VALUES ('115', '14', '13', '43', 'កំបូល', '1', 'កំបូល', null, 'Puthea', '2021-11-22 10:56:22');
INSERT INTO `loc_communes` VALUES ('116', '14', '13', '43', 'កន្ទោក', '1', 'កន្ទោក', null, 'Puthea', '2021-11-22 10:56:32');
INSERT INTO `loc_communes` VALUES ('117', '14', '13', '43', 'ឪឡោក', '1', 'ឪឡោក', null, 'Puthea', '2021-11-22 10:56:42');
INSERT INTO `loc_communes` VALUES ('118', '14', '13', '43', 'ស្នើរ', '1', 'ស្នើរ', null, 'Puthea', '2021-11-22 10:56:51');
INSERT INTO `loc_communes` VALUES ('119', '14', '13', '44', 'ព្រែកភ្នៅ', '1', 'ព្រែកភ្នៅ', null, 'Puthea', '2021-11-22 10:57:08');
INSERT INTO `loc_communes` VALUES ('120', '14', '13', '44', 'ពញាពន់', '1', 'ពញាពន់', null, 'Puthea', '2021-11-22 10:57:18');
INSERT INTO `loc_communes` VALUES ('121', '14', '13', '44', 'សំរោង', '1', 'សំរោង', null, 'Puthea', '2021-11-22 10:57:27');
INSERT INTO `loc_communes` VALUES ('122', '14', '13', '44', 'គោករកា', '1', 'គោករកា', null, 'Puthea', '2021-11-22 10:57:38');
INSERT INTO `loc_communes` VALUES ('123', '14', '13', '44', 'កន្សែង', '1', 'កន្សែង', null, 'Puthea', '2021-11-22 10:57:47');
INSERT INTO `loc_communes` VALUES ('124', '14', '13', '45', 'ផ្សារថ្មីទី១', '1', 'ផ្សារថ្មីទី១', null, 'Puthea', '2021-11-22 10:58:06');
INSERT INTO `loc_communes` VALUES ('125', '14', '13', '45', 'ផ្សារថ្មីទី២', '1', 'ផ្សារថ្មីទី២', null, 'Puthea', '2021-11-22 10:58:18');
INSERT INTO `loc_communes` VALUES ('126', '14', '13', '45', 'ផ្សារថ្មីទី៣', '1', 'ផ្សារថ្មីទី៣', null, 'Puthea', '2021-11-22 10:58:34');
INSERT INTO `loc_communes` VALUES ('127', '14', '13', '45', 'បឹងរាំង', '1', 'បឹងរាំង', null, 'Puthea', '2021-11-22 10:58:45');
INSERT INTO `loc_communes` VALUES ('128', '14', '13', '45', 'ផ្សាកណ្ដាលទី១', '1', 'ផ្សាកណ្ដាលទី១', null, 'Puthea', '2021-11-22 10:58:54');
INSERT INTO `loc_communes` VALUES ('129', '14', '13', '45', 'ផ្សាកណ្ដាលទី២', '1', 'ផ្សាកណ្ដាលទី២', null, 'Puthea', '2021-11-22 10:59:03');
INSERT INTO `loc_communes` VALUES ('130', '14', '13', '45', 'ចតុមុខ', '1', 'ចតុមុខ', null, 'Puthea', '2021-11-22 10:59:17');
INSERT INTO `loc_communes` VALUES ('131', '14', '13', '46', 'ស្ទឹងមានជយ័', '1', 'ស្ទឹងមានជយ័', null, 'Puthea', '2021-11-22 10:59:50');
INSERT INTO `loc_communes` VALUES ('132', '14', '13', '46', 'បឹងទំពុន', '1', 'បឹងទំពុន', null, 'Puthea', '2021-11-22 11:00:01');
INSERT INTO `loc_communes` VALUES ('133', '14', '13', '46', 'ចាក់អង្រែលើ', '1', 'ចាក់អង្រែលើ', null, 'Puthea', '2021-11-22 11:00:10');
INSERT INTO `loc_communes` VALUES ('134', '14', '13', '46', 'ចាក់អង្រែក្រោម', '1', 'ចាក់អង្រែក្រោម', null, 'Puthea', '2021-11-22 11:00:21');
INSERT INTO `loc_communes` VALUES ('136', '14', '13', '47', 'ព្រែកលាប', '1', 'ព្រែកលាប', null, 'Puthea', '2021-11-22 11:00:50');
INSERT INTO `loc_communes` VALUES ('137', '14', '13', '47', 'ព្រែកតាសេក', '1', 'ព្រែកតាសេក', null, 'Puthea', '2021-11-22 11:01:09');
INSERT INTO `loc_communes` VALUES ('138', '14', '13', '47', 'កោះដាច់', '1', 'កោះដាច់', null, 'Puthea', '2021-11-22 11:01:09');
INSERT INTO `loc_communes` VALUES ('139', '14', '13', '47', 'បាក់ខែង', '1', 'បាក់ខែង', null, 'Puthea', '2021-11-22 11:02:59');
INSERT INTO `loc_communes` VALUES ('140', '14', '13', '48', 'ច្បាអំពៅទី១', '1', 'ច្បាអំពៅទី១', null, 'Puthea', '2021-11-22 11:03:49');
INSERT INTO `loc_communes` VALUES ('141', '14', '13', '48', 'ច្បាអំពៅទី២', '1', 'ច្បាអំពៅទី២', null, 'Puthea', '2021-11-22 11:03:59');
INSERT INTO `loc_communes` VALUES ('142', '14', '13', '48', 'និរោធ', '1', 'និរោធ', null, 'Puthea', '2021-11-22 11:04:09');
INSERT INTO `loc_communes` VALUES ('143', '14', '13', '48', 'ព្រែកប្រា', '1', 'ព្រែកប្រា', null, 'Puthea', '2021-11-22 11:04:29');
INSERT INTO `loc_communes` VALUES ('144', '14', '13', '48', 'វាលស្បូវ', '1', 'វាលស្បូវ', null, 'Puthea', '2021-11-22 11:04:30');
INSERT INTO `loc_communes` VALUES ('145', '14', '13', '48', 'ព្រែកអែង', '1', 'ព្រែកអែង', null, 'Puthea', '2021-11-22 11:04:51');
INSERT INTO `loc_communes` VALUES ('146', '14', '13', '48', 'ក្បាលកោះ', '1', 'ក្បាលកោះ', null, 'Puthea', '2021-11-22 11:05:05');
INSERT INTO `loc_communes` VALUES ('147', '14', '13', '38', 'ស្រះចក', '1', 'ស្រះចក', null, 'Puthea', '2021-11-22 11:08:13');
INSERT INTO `loc_communes` VALUES ('148', '14', '13', '40', 'អូឬស្សីទី២', '1', 'អូឬស្សីទី២', null, 'Puthea', '2021-11-22 11:10:43');
INSERT INTO `loc_communes` VALUES ('149', '14', '13', '48', 'ព្រែកថ្មី', '1', 'ព្រែកថ្មី', null, 'Puthea', '2021-11-22 11:13:40');
INSERT INTO `loc_communes` VALUES ('150', '14', '13', '47', 'ជ្រោយចង្វារ', '1', 'ជ្រោយចង្វារ', null, 'Puthea', '2021-11-23 15:20:41');

-- ----------------------------
-- Table structure for `loc_countries`
-- ----------------------------
DROP TABLE IF EXISTS `loc_countries`;
CREATE TABLE `loc_countries` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `name_kh` varchar(100) NOT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `create_date` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `branch_id` int(10) NOT NULL,
  `map_location` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of loc_countries
-- ----------------------------
INSERT INTO `loc_countries` VALUES ('14', 'Cambodia', 'Cambodia', 'Puthea', '2021-11-21 18:30:12.000000', '1', null);

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
  `create_date` timestamp(6) NULL DEFAULT current_timestamp(6),
  `map_location` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `branch_id` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `loc_districts_city_id_foreign` (`city_id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of loc_districts
-- ----------------------------
INSERT INTO `loc_districts` VALUES ('35', '12', 'ខណ្ឌចំការមន', 'ខណ្ឌចំការមន', 'Puthea', '2021-11-21 18:40:17.000000', null, '1');
INSERT INTO `loc_districts` VALUES ('36', '12', 'ខណ្ឌ័ដង្កោ', 'ខណ្ឌ័ដង្កោ', 'Puthea', '2021-11-21 18:40:59.000000', null, '1');
INSERT INTO `loc_districts` VALUES ('37', '13', 'ខណ្ឌ័ចំការមន', 'ខណ្ឌ័ចំការមន', 'Sopha', '2021-11-21 18:42:11.000000', null, '1');
INSERT INTO `loc_districts` VALUES ('38', '13', 'ខណ្ឌ័ដង្កោ', 'ខណ្ឌ័ដង្កោ', 'Sopha', '2021-11-21 18:42:27.000000', null, '1');
INSERT INTO `loc_districts` VALUES ('39', '13', 'ខណ្ឌ័ទួលគក', 'ខណ្ឌ័ទួលគក', 'Puthea', '2021-11-21 18:44:55.000000', null, '1');
INSERT INTO `loc_districts` VALUES ('40', '13', 'ខណ្ឌ័៧មករា', 'ខណ្ឌ័៧មករា', 'Puthea', '2021-11-21 18:49:35.000000', null, '1');
INSERT INTO `loc_districts` VALUES ('41', '13', 'ខណ្ឌ័ឬស្សីកែវ', 'ខណ្ឌ័ឬស្សីកែវ', 'Puthea', '2021-11-21 18:50:18.000000', null, '1');
INSERT INTO `loc_districts` VALUES ('42', '13', 'ខណ្ឌ័សែនសុខ', 'ខណ្ឌ័សែនសុខ', 'Puthea', '2021-11-21 18:50:40.000000', null, '1');
INSERT INTO `loc_districts` VALUES ('43', '13', 'ខណ្ឌ័ពោសែនជយ័', 'ខណ្ឌ័ពោសែនជយ័', 'Puthea', '2021-11-21 18:50:54.000000', null, '1');
INSERT INTO `loc_districts` VALUES ('44', '13', 'ខណ្ឌ័ព្រែកភ្នៅ', 'ខណ្ឌ័ព្រែកភ្នៅ', 'Puthea', '2021-11-21 18:51:16.000000', null, '1');
INSERT INTO `loc_districts` VALUES ('45', '13', 'ខណ្ឌ័ដូនពេញ', 'ខណ្ឌ័ដូនពេញ', 'Puthea', '2021-11-21 18:51:37.000000', null, '1');
INSERT INTO `loc_districts` VALUES ('46', '13', 'ខណ្ឌ័មានជយ័', 'ខណ្ឌ័មានជយ័', 'Puthea', '2021-11-21 18:51:58.000000', null, '1');
INSERT INTO `loc_districts` VALUES ('47', '13', 'ខណ្ឌ័ជ្រោយចង្វារ', 'ខណ្ឌ័ជ្រោយចង្វារ', 'Puthea', '2021-11-21 18:52:15.000000', null, '1');
INSERT INTO `loc_districts` VALUES ('48', '13', 'ខណ្ឌ័ច្បាអំពៅ', 'ខណ្ឌ័ច្បាអំពៅ', 'Puthea', '2021-11-21 18:52:32.000000', null, '1');

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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `create_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `description` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of mobile_brand_images
-- ----------------------------
INSERT INTO `mobile_brand_images` VALUES ('9', '38DC051E122D11EC89909801A7B0D1FCH', '1', 'E:\\LaravelApps\\DMS\\public/uploads/companies/1_data/brand_mobile/1_brand_pic_20211130_121156.png', 'png', null, 'admin@gmail.com', '2021-11-30 12:29:56.000000', null);
INSERT INTO `mobile_brand_images` VALUES ('11', '584C7FF2122D11EC89909801A8B0D7XKD', '1', 'E:\\LaravelApps\\DMS\\public/uploads/companies/1_data/brand_mobile/1_brand_pic_20211130_121119.png', 'png', null, 'admin@gmail.com', '2021-11-30 12:31:19.000000', null);
INSERT INTO `mobile_brand_images` VALUES ('12', '584C7FF2122D11EC89909801A8B0D7XKD', '1', 'E:\\LaravelApps\\DMS\\public/uploads/companies/1_data/brand_mobile/1_brand_pic_20211130_121127.png', 'png', null, 'admin@gmail.com', '2021-11-30 12:31:27.000000', null);

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
  `create_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
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
  `message` varchar(200) NOT NULL,
  `category` varchar(35) NOT NULL,
  `action_name` varchar(35) NOT NULL COMMENT 'db_action_type = ''Add'',''Update'',''Delete'',''Select''',
  `to_user_group_id` int(10) DEFAULT NULL,
  `to_user_id` int(10) DEFAULT NULL,
  `notif_date` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of notifications
-- ----------------------------

-- ----------------------------
-- Table structure for `oauth_access_tokens`
-- ----------------------------
DROP TABLE IF EXISTS `oauth_access_tokens`;
CREATE TABLE `oauth_access_tokens` (
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
-- Records of oauth_access_tokens
-- ----------------------------

-- ----------------------------
-- Table structure for `oauth_auth_codes`
-- ----------------------------
DROP TABLE IF EXISTS `oauth_auth_codes`;
CREATE TABLE `oauth_auth_codes` (
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
-- Records of oauth_auth_codes
-- ----------------------------

-- ----------------------------
-- Table structure for `oauth_clients`
-- ----------------------------
DROP TABLE IF EXISTS `oauth_clients`;
CREATE TABLE `oauth_clients` (
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
-- Records of oauth_clients
-- ----------------------------
INSERT INTO `oauth_clients` VALUES ('1', null, 'Laravel Personal Access Client', 'limsUtcYz3lAkqEkI34yveI6lxEeRPSc2LcsXhRz', null, 'http://localhost', '1', '0', '0', '2021-09-02 05:44:17', '2021-09-02 05:44:17');
INSERT INTO `oauth_clients` VALUES ('2', null, 'Laravel Password Grant Client', 'ViGwqyG270Gkc5snHfROEUKCrFxd10rpVUuN1Bqh', 'users', 'http://localhost', '0', '1', '0', '2021-09-02 05:44:17', '2021-09-02 05:44:17');

-- ----------------------------
-- Table structure for `oauth_personal_access_clients`
-- ----------------------------
DROP TABLE IF EXISTS `oauth_personal_access_clients`;
CREATE TABLE `oauth_personal_access_clients` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `client_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of oauth_personal_access_clients
-- ----------------------------
INSERT INTO `oauth_personal_access_clients` VALUES ('1', '1', '2021-09-02 05:44:17', '2021-09-02 05:44:17');

-- ----------------------------
-- Table structure for `oauth_refresh_tokens`
-- ----------------------------
DROP TABLE IF EXISTS `oauth_refresh_tokens`;
CREATE TABLE `oauth_refresh_tokens` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `access_token_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `revoked` tinyint(1) NOT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_refresh_tokens_access_token_id_index` (`access_token_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of oauth_refresh_tokens
-- ----------------------------

-- ----------------------------
-- Table structure for `order`
-- ----------------------------
DROP TABLE IF EXISTS `order`;
CREATE TABLE `order` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `branch_id` int(10) NOT NULL,
  `request_date` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `delivery_condition` varchar(30) DEFAULT NULL COMMENT 'delivery_condition = {VIP,MA,AA, AT}. VIP immediate pickup, MA = Picked in morning an delivered Afternoon, AT = Picked Afternoon and deliver Tomorrow, AA= Pick Afternoon and deliver in the Afternoon',
  `sender_id` int(10) NOT NULL,
  `sender_type_id` int(10) NOT NULL,
  `request_vehicle_type` varchar(30) NOT NULL,
  `product_type` varchar(30) NOT NULL COMMENT 'product_type ={mixed, @specific_category }',
  `qty` decimal(10,0) DEFAULT 0,
  `pickup_address` varchar(200) DEFAULT NULL COMMENT 'pickup_address = {use old one, new entry, pin}',
  `pickup_location` varchar(150) DEFAULT '' COMMENT 'digital map location',
  `create_user` varchar(50) DEFAULT NULL,
  `create_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `update_user` varchar(50) DEFAULT NULL,
  `status_id` int(10) DEFAULT NULL COMMENT 'status ={Arrived at warehouse,pending,picked,accepted, Done, Partially Done, }',
  `driver_id` int(10) DEFAULT NULL,
  `pickup_time` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `order_canceled` tinyint(6) NOT NULL DEFAULT 0 COMMENT 'if order_canceled =1 => status_id = 7 (Canceled)',
  `code` varchar(30) DEFAULT NULL,
  `tracking_number` varchar(30) DEFAULT NULL,
  `delivery_type` varchar(15) DEFAULT 'Normal' COMMENT 'delivery_type = {Normal,Fast}',
  `pickup_date` timestamp(6) NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `pickup_notes` varchar(100) DEFAULT NULL,
  `pickup_method` varchar(20) DEFAULT 'Driver' COMMENT 'pickup_method = {driver,None}.  pickup_method =  "Driver" means the goods are picked by driver, otherwise, the goods are brought in by Seller or sender etc',
  `request_pickup_time` timestamp(6) NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `completed` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of order
-- ----------------------------
INSERT INTO `order` VALUES ('50', '1', '2021-12-02 15:44:57.122004', 'Normal', '37', '1', 'Moto', 'ខោហ្គេន', '2', 'កាពីតូលទួលទំពូង', '', 'admin@gmail.com', '2021-12-02 15:44:57.122004', '2021-12-02 15:44:57.122004', null, '4', '0', '2021-12-02 15:44:57.122004', '0', 'BR0000000050', null, 'Normal', '2021-12-02 15:44:57.122004', null, 'None', '2021-12-02 15:44:57.122004', '1');
INSERT INTO `order` VALUES ('51', '1', '2021-12-02 15:52:32.103108', 'Normal', '40', '2', 'Moto', 'គ្រឿងសំអាង', '1', 'អូទ្បាំពិច', '', 'admin@gmail.com', '2021-12-02 15:52:32.103108', '2021-12-02 15:52:32.103108', null, '4', '0', '2021-12-02 15:52:32.103108', '0', 'BR0000000051', null, 'Normal', '2021-12-02 15:52:32.103108', null, 'None', '2021-12-02 15:52:32.103108', '1');
INSERT INTO `order` VALUES ('52', '1', '2021-12-02 16:07:53.162432', 'VIP', '39', '1', 'Moto', 'ខោអាវ', '3', 'ស្ទឹងមានជ័យ', '', 'admin@gmail.com', '2021-12-02 16:07:53.162432', '2021-12-02 16:07:53.162432', null, '4', '28', '2021-12-02 16:07:53.162432', '0', 'BR0000000052', null, 'Normal', '2021-12-02 16:07:53.162432', null, 'Driver', '2021-12-02 16:07:53.162432', '1');
INSERT INTO `order` VALUES ('53', '1', '2021-12-02 16:03:46.918852', 'Normal', '38', '1', 'Moto', 'ត្រង់ឌឺ', '3', 'បេនទ្បានផ្សារថ្មី', '', 'admin@gmail.com', '2021-12-02 16:03:46.918852', '2021-12-02 16:03:46.918852', null, '4', '27', '2021-12-02 16:03:46.918852', '0', 'BR0000000053', null, 'Normal', '2021-12-02 16:03:46.918852', null, 'Driver', '2021-12-02 16:03:46.918852', '1');
INSERT INTO `order` VALUES ('54', '1', '2021-12-02 15:58:44.969112', 'VIP', '41', '2', 'Moto', 'ខោអាវ', '1', 'ដំបូកខ្ពស់', '', 'admin@gmail.com', '2021-12-02 15:58:44.969112', '2021-12-02 15:58:44.969112', null, '4', '27', '2021-12-02 15:58:44.969112', '0', 'BR0000000054', null, 'Normal', '2021-12-02 15:58:44.969112', null, 'Driver', '2021-12-02 15:58:44.969112', '1');
INSERT INTO `order` VALUES ('56', '1', '2021-12-03 01:23:48.482348', 'VIP', '37', '1', 'Moto', 'Shoes', '2', 'វត្តដំបូកខ្ពស់', '', 'admin@gmail.com', '2021-12-03 01:23:48.482348', '2021-12-03 01:23:48.482348', null, '4', '0', '2021-12-03 01:23:48.482348', '0', 'BR0000000056', null, 'Normal', '2021-12-03 01:23:48.482348', null, 'None', '2021-12-03 01:23:48.482348', '1');
INSERT INTO `order` VALUES ('57', '1', '2021-12-03 20:42:07.300142', 'MA', '39', '1', 'TUK TUK', 'costmetic', '2', null, '', 'admin@gmail.com', '2021-12-03 20:42:07.300142', '2021-12-03 20:42:07.300142', null, '4', '27', '2021-12-03 20:42:07.300142', '0', 'BR0000000057', null, 'Normal', '2021-12-03 20:42:07.300142', null, 'Driver', '2021-12-03 20:42:07.300142', '1');
INSERT INTO `order` VALUES ('58', '1', '2021-12-04 00:00:19.029021', 'Normal', '39', '1', 'Moto', 'shoes', '1', 'rtgy4hy6hju6jh6ju', '', 'admin@gmail.com', '2021-12-04 00:00:19.029021', '2021-12-04 00:00:19.029021', null, '4', '27', '2021-12-04 00:00:19.029021', '0', 'BR0000000058', null, 'Normal', '2021-12-04 00:00:19.029021', null, 'Driver', '2021-12-04 00:00:19.029021', '1');
INSERT INTO `order` VALUES ('59', '1', '2021-12-04 14:59:39.839962', 'Normal', '39', '1', 'Moto', 'ខោអាវ', '3', 'ស្ទឹងមានជ័យ', '', 'admin@gmail.com', '2021-12-04 14:59:39.839962', '2021-12-04 14:59:39.839962', null, '4', '0', '2021-12-04 14:59:39.839962', '0', 'BR0000000059', null, 'Normal', '2021-12-04 14:59:39.839962', null, 'None', '2021-12-04 14:59:39.839962', '1');
INSERT INTO `order` VALUES ('60', '1', '2021-12-04 15:04:48.748218', 'VIP', '37', '1', 'Moto', 'ខោហ្គេន', '2', 'បេនទ្បានទួលទំពូង', '', 'admin@gmail.com', '2021-12-04 15:04:48.748218', '2021-12-04 15:04:48.748218', null, '4', '27', '2021-12-04 15:04:48.748218', '0', 'BR0000000060', null, 'Normal', '2021-12-04 15:04:48.748218', null, 'Driver', '2021-12-04 15:04:48.748218', '1');
INSERT INTO `order` VALUES ('61', '1', '2021-12-04 15:07:48.222507', 'Normal', '41', '2', 'Moto', 'ខោអាវ', '1', 'បឹងទំពន់', '', 'admin@gmail.com', '2021-12-04 15:07:48.222507', '2021-12-04 15:07:48.222507', null, '4', '28', '2021-12-04 15:07:48.222507', '0', 'BR0000000061', null, 'Normal', '2021-12-04 15:07:48.222507', null, 'Driver', '2021-12-04 15:07:48.222507', '1');
INSERT INTO `order` VALUES ('62', '1', '2021-12-04 15:09:07.739458', 'Normal', '40', '2', 'Moto', 'គ្រឿងក្រអូប', '1', 'អូទ្បាំពិច', '', 'admin@gmail.com', '2021-12-04 15:09:07.739458', '2021-12-04 15:09:07.739458', null, '4', '28', '2021-12-04 15:09:07.739458', '0', 'BR0000000062', null, 'Normal', '2021-12-04 15:09:07.739458', null, 'Driver', '2021-12-04 15:09:07.739458', '1');
INSERT INTO `order` VALUES ('63', '1', '2021-12-04 15:15:05.023977', 'VIP', '38', '1', 'Moto', 'រត្រង់ឌឺកាត់សក់', '3', 'បេនទ្បានផ្សារថ្មី', '', 'admin@gmail.com', '2021-12-04 15:15:05.023977', '2021-12-04 15:15:05.023977', null, '4', '28', '2021-12-04 15:15:05.023977', '0', 'BR0000000063', null, 'Normal', '2021-12-04 15:15:05.023977', null, 'Driver', '2021-12-04 15:15:05.023977', '1');
INSERT INTO `order` VALUES ('64', '1', '2021-12-05 19:02:20.257475', 'Normal', '37', '1', 'Moto', 'ខោហ្គេន', '4', 'Seim Reap', '', 'admin@gmail.com', '2021-12-05 19:02:20.257475', '2021-12-05 19:02:20.257475', null, '4', '0', '2021-12-05 19:02:20.257475', '0', 'BR0000000064', null, 'Normal', '2021-12-05 19:02:20.257475', null, 'None', '2021-12-05 19:02:20.257475', '1');
INSERT INTO `order` VALUES ('65', '1', '2021-12-05 19:12:40.591084', 'Normal', '41', '2', 'Moto', 'ខោអាវ', '1', 'Phnom Penh', '', 'admin@gmail.com', '2021-12-05 19:12:40.591084', '2021-12-05 19:12:40.591084', null, '4', '28', '2021-12-05 19:12:40.591084', '0', 'BR0000000065', null, 'Normal', '2021-12-05 19:12:40.591084', null, 'Driver', '2021-12-05 19:12:40.591084', '1');
INSERT INTO `order` VALUES ('66', '1', '2021-12-05 19:49:18.503651', 'VIP', '38', '1', 'Moto', 'ត្រង់ឌឺ', '6', 'Kandal Province', '', 'admin@gmail.com', '2021-12-05 19:49:18.503651', '2021-12-05 19:49:18.503651', null, '4', '0', '2021-12-05 19:49:18.503651', '0', 'BR0000000066', null, 'Normal', '2021-12-05 19:49:18.503651', null, 'None', '2021-12-05 19:49:18.503651', '1');
INSERT INTO `order` VALUES ('67', '1', '2021-12-05 20:01:19.424462', 'VIP', '39', '1', 'Moto', 'ខោអាវ', '8', 'Phnom Pengh', '', 'admin@gmail.com', '2021-12-05 20:01:19.424462', '2021-12-05 20:01:19.424462', null, '4', '0', '2021-12-05 20:01:19.424462', '0', 'BR0000000067', null, 'Normal', '2021-12-05 20:01:19.424462', null, 'None', '2021-12-05 20:01:19.424462', '0');
INSERT INTO `order` VALUES ('68', '1', '2021-12-05 18:47:51.349699', 'Normal', '40', '2', 'Moto', 'គ្រឿងសំអាង', '1', 'Olympic Phnom Penh', '', 'admin@gmail.com', '2021-12-05 18:47:51.349699', '2021-12-05 18:47:51.349699', null, '4', '0', '2021-12-05 18:47:51.349699', '0', 'BR0000000068', null, 'Normal', '2021-12-05 18:47:51.349699', null, 'None', '2021-12-05 18:47:51.349699', '1');
INSERT INTO `order` VALUES ('69', '1', '2021-12-06 09:40:02.132231', 'VIP', '39', '1', 'Moto', 'ខោអាវ', '8', 'Phnom Pengh (ស្ទឹងមានជ័យ)', '', 'admin@gmail.com', '2021-12-06 09:40:02.132231', '2021-12-06 09:40:02.132231', null, '2', '28', '2021-12-06 09:40:02.132231', '0', 'BR0000000069', null, 'Normal', '2021-12-06 09:40:02.132231', null, 'Driver', '2021-12-06 09:40:02.132231', null);
INSERT INTO `order` VALUES ('70', '1', '2021-12-06 09:39:55.465299', 'VIP', '37', '1', 'Moto', 'ខោអាវហ្គេន', '4', 'Seim Reap (បេនទ្បានផ្សារថ្មី)', '', 'admin@gmail.com', '2021-12-06 09:39:55.465299', '2021-12-06 09:39:55.465299', null, '2', '28', '2021-12-06 09:39:55.465299', '0', 'BR0000000070', null, 'Normal', '2021-12-06 09:39:55.465299', null, 'Driver', '2021-12-06 09:39:55.465299', null);
INSERT INTO `order` VALUES ('71', '1', '2021-12-06 09:39:46.379262', 'Normal', '38', '1', 'Moto', 'ត្រង់ឌឺ', '6', 'Kandal Province (បេនទ្បានផ្សារថ្មី)', '', 'admin@gmail.com', '2021-12-06 09:39:46.379262', '2021-12-06 09:39:46.379262', null, '2', '27', '2021-12-06 09:39:46.379262', '0', 'BR0000000071', null, 'Normal', '2021-12-06 09:39:46.379262', null, 'Driver', '2021-12-06 09:39:46.379262', null);
INSERT INTO `order` VALUES ('72', '1', '2021-12-06 09:39:36.839360', 'Normal', '40', '2', 'Moto', 'គ្រឿងសំអាង', '1', 'Olympic Phnom Penh', '', 'admin@gmail.com', '2021-12-06 09:39:36.839360', '2021-12-06 09:39:36.839360', null, '2', '27', '2021-12-06 09:39:36.839360', '0', 'BR0000000072', null, 'Normal', '2021-12-06 09:39:36.839360', null, 'Driver', '2021-12-06 09:39:36.839360', null);
INSERT INTO `order` VALUES ('73', '1', '2021-12-06 09:42:02.662921', 'Normal', '41', '2', 'Moto', 'គ្រឿងសំអាង', '1', 'Phnom Penh', '', 'admin@gmail.com', '2021-12-06 09:42:02.662921', '2021-12-06 09:42:02.662921', null, '4', '0', '2021-12-06 09:42:02.662921', '0', 'BR0000000073', null, 'Normal', '2021-12-06 09:42:02.662921', null, 'None', '2021-12-06 09:42:02.662921', '1');
INSERT INTO `order` VALUES ('74', '1', '2021-12-06 13:27:40.407140', 'None', '39', '1', 'TUK TUK', 'Clothing', '1', 'Phnom Pengh', '', 'admin@gmail.com', '2021-12-06 13:27:40.407140', '2021-12-06 13:27:40.407140', null, '4', '0', '2021-12-06 13:27:40.407140', '0', 'BR0000000074', null, 'Normal', '2021-12-06 13:27:40.407140', null, 'None', '2021-12-06 13:27:40.407140', '1');
INSERT INTO `order` VALUES ('75', '1', '2021-12-06 19:30:39.612082', 'None', '39', '1', 'Moto', 'Electronics', '1', 'Phnom Pengh', '', 'admin@gmail.com', '2021-12-06 19:30:39.612082', '2021-12-06 19:30:39.612082', null, '4', '0', '2021-12-06 19:30:39.612082', '0', 'BR0000000075', null, 'Normal', '2021-12-06 19:30:39.612082', null, 'None', '2021-12-06 19:30:39.612082', '1');
INSERT INTO `order` VALUES ('76', '1', '2021-12-06 21:17:38.524948', 'None', '37', '1', 'Moto', 'Clothing', '1', 'Seim Reap', '', 'admin@gmail.com', '2021-12-06 21:17:38.524948', '2021-12-06 21:17:38.524948', null, '4', '0', '2021-12-06 21:17:38.524948', '0', 'BR0000000076', null, 'Normal', '2021-12-06 21:17:38.524948', null, 'None', '2021-12-06 21:17:38.524948', '1');
INSERT INTO `order` VALUES ('77', '1', '2021-12-06 21:33:25.732879', 'None', '38', '1', 'Moto', 'Clothing', '1', 'Kandal Province', '', 'admin@gmail.com', '2021-12-06 21:33:25.732879', '2021-12-06 21:33:25.732879', null, '4', '0', '2021-12-06 21:33:25.732879', '0', 'BR0000000077', null, 'Normal', '2021-12-06 21:33:25.732879', null, 'None', '2021-12-06 21:33:25.732879', '1');
INSERT INTO `order` VALUES ('78', '1', '2021-12-06 21:38:21.876789', 'None', '38', '1', 'Moto', 'Clothing', '1', 'Kandal Province', '', 'admin@gmail.com', '2021-12-06 21:38:21.876789', '2021-12-06 21:38:21.876789', null, '4', '0', '2021-12-06 21:38:21.876789', '0', 'BR0000000078', null, 'Normal', '2021-12-06 21:38:21.876789', null, 'None', '2021-12-06 21:38:21.876789', '1');
INSERT INTO `order` VALUES ('79', '1', '2021-12-07 20:21:10.612102', 'None', '39', '1', 'Moto', 'Cosmetics', '2', 'Phnom Pengh', '', 'admin@gmail.com', '2021-12-07 20:21:10.612102', '2021-12-07 20:21:10.612102', null, '1', null, '2021-12-07 20:21:10.612102', '0', 'BR0000000079', null, 'Normal', '2021-12-07 20:21:10.612102', null, 'Driver', '2021-12-07 20:21:10.612102', null);
INSERT INTO `order` VALUES ('80', '1', '2021-12-08 12:56:58.649351', 'None', '46', '2', 'Moto', 'Electronics', '2', 'Testing', '', 'admin@gmail.com', '2021-12-08 12:56:58.649351', '2021-12-08 12:56:58.649351', null, '1', null, '2021-12-08 12:56:58.649351', '0', 'BR0000000080', null, 'Normal', '2021-12-08 12:56:58.649351', null, 'Driver', '2021-12-08 12:56:58.649351', null);

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
  `dim_x` decimal(10,0) DEFAULT 0,
  `dim_y` decimal(10,0) DEFAULT 0,
  `dim_h` decimal(10,0) DEFAULT NULL,
  `weight_kg` decimal(10,2) DEFAULT 0.00,
  `cod` tinyint(6) DEFAULT 0,
  `price` decimal(10,2) DEFAULT 0.00,
  `df_payer` varchar(20) DEFAULT '',
  `forwarding_cost` decimal(10,2) DEFAULT 0.00,
  `delivery_fee` decimal(10,2) DEFAULT 0.00,
  `create_user` varchar(35) NOT NULL,
  `create_date` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `package_name` varchar(50) DEFAULT NULL,
  `actual_kg` decimal(10,2) DEFAULT 0.00,
  `billed_kg` decimal(10,2) DEFAULT 0.00,
  `cod_fee` decimal(10,2) DEFAULT 0.00,
  `zone_name` varchar(50) DEFAULT NULL,
  `delivery_type` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of order_receivers
-- ----------------------------
INSERT INTO `order_receivers` VALUES ('26', '1', '74', '012555666', '012555666', 'C30', 'address testing', '25', '12', '9', '0.00', '1', '120.00', 'Receiver', '0.00', '0.00', 'admin@gmail.com', '2021-12-06 13:27:08.000000', null, '0.00', '0.46', '0.00', null, 'Normal');
INSERT INTO `order_receivers` VALUES ('27', '1', '75', '012567672', '012567672', 'C23', 'fe', '12', '56', '19', '0.00', '1', '135.00', 'Sender', '0.00', '0.00', 'admin@gmail.com', '2021-12-06 19:30:01.000000', null, '3.00', '3.00', '0.00', null, 'Normal');
INSERT INTO `order_receivers` VALUES ('28', '1', '76', '012678789', '012678789', 'C18', 'asdghjgh', '12', '67', '8', '0.00', '1', '120.00', 'Sender', '0.00', '0.00', 'admin@gmail.com', '2021-12-06 21:07:38.000000', null, '0.00', '1.07', '0.00', null, 'Normal');
INSERT INTO `order_receivers` VALUES ('29', '1', '77', '023436346', '023436346', 'C23', '01223242', '12', '5', '67', '0.00', '1', '55.00', 'Sender', '0.00', '0.00', 'admin@gmail.com', '2021-12-06 21:31:51.000000', null, '1.00', '1.00', '0.00', null, 'Normal');
INSERT INTO `order_receivers` VALUES ('30', '1', '78', '0125676867', '0125676867', 'C23', 'dfgdfhd', '12', '7', '23', '0.00', '1', '128.00', 'Sender', '0.00', '0.00', 'admin@gmail.com', '2021-12-06 21:37:58.000000', null, '1.00', '1.00', '0.00', null, 'Normal');
INSERT INTO `order_receivers` VALUES ('31', '1', '79', '012567657`', '012567657`', 'C23', 'sdfdggfd', '0', '0', '0', '0.00', '0', '135.00', 'Sender', '0.00', '0.00', 'admin@gmail.com', '2021-12-07 13:21:10.000000', null, '0.00', '0.00', '0.00', null, 'Normal');
INSERT INTO `order_receivers` VALUES ('32', '1', '80', '01256756867', '01256756867', 'C23', 'dsgdfgdf', '0', '0', '0', '0.00', '0', '125.00', 'Sender', '0.00', '-1.00', 'admin@gmail.com', '2021-12-08 05:56:58.000000', null, '0.00', '0.00', '0.00', null, 'Normal');

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
  `cod` int(6) DEFAULT 0 COMMENT 'COD = Cash On Delivery. if cod =0 => Customer or receiver will pay the Price of package, Otherwise driver do not need to collect payment from Customer or receiver',
  `cod_fee` decimal(10,2) DEFAULT 0.00,
  `df_payer` varchar(20) DEFAULT 'Receiver' COMMENT 'df_payer = {Receiver,Sender}',
  `delivery_fee` decimal(10,2) NOT NULL DEFAULT 0.00,
  `forwarding_cost` decimal(10,2) NOT NULL DEFAULT 0.00,
  `create_date` timestamp(6) NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `update_date` timestamp(6) NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
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
  `delivery_time` timestamp(6) NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `arrival_time` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `outstanding` tinyint(6) DEFAULT 1,
  `applied_fixed_price` tinyint(6) DEFAULT 0,
  `pickup_time` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `delivery_notes` varchar(100) DEFAULT NULL,
  `agent_notes` varchar(150) DEFAULT NULL,
  `pickup_driver_id` int(11) DEFAULT NULL,
  `additional_fee` decimal(10,2) DEFAULT NULL,
  `base_fee` decimal(10,2) DEFAULT NULL,
  `tax_percent` decimal(10,2) DEFAULT NULL,
  `tax_amount` decimal(10,2) DEFAULT NULL,
  `adjust_amount` decimal(10,2) DEFAULT NULL,
  `warehouse_id` int(10) DEFAULT NULL,
  `driver_total` decimal(10,2) DEFAULT NULL,
  `sender_total` decimal(10,2) DEFAULT NULL,
  `exchange_rate` decimal(10,2) DEFAULT NULL,
  `driver_id` int(11) DEFAULT NULL,
  `driver_pmt_notes` varchar(150) DEFAULT NULL,
  `sender_pmt_notes` varchar(150) DEFAULT NULL,
  `driver_adjust_amount` decimal(10,2) DEFAULT NULL,
  `sender_adjust_amount` decimal(10,2) DEFAULT NULL,
  `driver_pmt_status_id` tinyint(4) DEFAULT NULL,
  `driver_trx_id` int(11) DEFAULT NULL,
  `sender_net_amount` decimal(10,2) DEFAULT NULL,
  `sender_trx_id` int(11) DEFAULT NULL,
  `sender_pmt_status_id` tinyint(4) DEFAULT NULL,
  `sender_confirmed` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_speedy` (`id`,`branch_id`,`qr_code`,`delivery_id`,`sender_id`,`order_id`,`driver_id`)
) ENGINE=InnoDB AUTO_INCREMENT=127 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of package
-- ----------------------------
INSERT INTO `package` VALUES ('75', '1', '1161A8872896BC9', '077225568', null, '10.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '50', '50', '1', null, 'Receiver', '0.00', '0.00', '2021-12-02 17:14:38.902125', '2021-12-02 17:14:38.902125', 'ស្ពានអាកាស៧មករា（យកខោ១ពីភ្ញៀវវិញផង', 'C13', 'ទឹកថ្លា', '077225568', '077225568', null, '0', 'Normal', '37', 'Rattana Hak', 'VIP', '016 285 878', null, '0.00', '0.00', 'BR0000000050', '2021-12-02 17:14:38.902125', '2021-12-02 17:14:38.902125', '0', '0', '2021-12-02 17:14:38.902125', null, null, '0', null, '2.00', '0.00', '0.00', null, '1', '12.00', '0.00', '41000.00', '27', null, null, '0.00', '0.00', '1', '18', null, '12', '1', null);
INSERT INTO `package` VALUES ('76', '1', '1161A887289798C', '069239561', null, '32.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '50', '50', '1', '0.00', 'Receiver', '0.00', '0.00', '2021-12-02 17:14:38.902716', '2021-12-02 17:14:38.902716', 'បុរីហេងមានជ័យ ច្បារអំពៅ', 'B12', 'ច្បាអំពៅទី១', '069239561', '069239561', null, '0', 'Normal', '37', 'Rattana Hak', 'VIP', '016 285 878', null, '0.00', '0.00', 'BR0000000050', '2021-12-02 17:14:38.902716', '2021-12-02 17:14:38.902716', '0', '0', '2021-12-02 17:14:38.902716', null, null, '0', null, '1.50', '0.00', '0.00', null, '1', '33.50', '0.00', '41000.00', '27', null, null, '0.00', '0.00', '1', '18', null, '12', '1', null);
INSERT INTO `package` VALUES ('77', '1', '1161A88860DD1A8', '095646930', null, '10.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '51', '49', '1', null, 'Receiver', '0.00', '0.00', '2021-12-02 17:15:06.795496', '2021-12-02 17:15:06.795496', 'វត្តទួល', 'C9', 'ឬស្សីកែង', '095646930', '095646930', null, '0', 'Normal', '40', 'អូន ធីដា', 'Normal', '087 823 080', null, '0.00', '0.00', 'BR0000000051', '2021-12-02 17:15:06.795496', '2021-12-02 17:15:06.795496', '0', '0', '2021-12-02 17:15:06.795496', null, null, '0', null, '2.00', '0.00', '0.00', null, '1', '12.00', '0.00', '41000.00', '28', null, null, '0.00', '0.00', '1', '19', null, '14', '1', null);
INSERT INTO `package` VALUES ('78', '1', '1161A88AC4EC4D9', '011657985', null, '23.00', '', '0.00', '0.00', '0.00', '0.00', '11', '0', 'Rejected from Customer', 'admin@gmail.com', null, 'admin@gmail.com', null, '54', '49', '1', '0.00', 'Receiver', '0.65', '0.00', '2021-12-02 16:49:09.253818', '2021-12-02 16:49:09.000000', 'BKK1', 'A2', 'បឹងកេងកងទី ១', '011657985', '011657985', null, '0', 'Normal', '41', 'Madam Q Homestore', 'Normal', '093488777', null, '0.00', '8.00', 'BR0000000054', '2021-12-02 16:49:09.253818', '2021-12-02 16:49:09.000000', '0', '0', '2021-12-02 16:49:09.253818', null, null, null, null, '1.00', '0.00', '0.00', null, '1', '24.65', '0.00', '41000.00', '28', null, null, null, null, null, null, null, null, null, null);
INSERT INTO `package` VALUES ('79', '1', '1161A88B4947670', '086722237', null, '43.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '53', '49', '1', '0.00', 'Receiver', '0.00', '0.00', '2021-12-02 17:14:29.884892', '2021-12-02 17:14:29.884892', 'ផ្សារចោមចៅ', 'C18', 'ចោមចៅ', '086722237', '086722237', null, '0', 'Normal', '38', 'Meng Korng', 'VIP', '015 877 768', null, '0.00', '0.00', 'BR0000000053', '2021-12-02 17:14:29.884892', '2021-12-02 17:14:29.884892', '0', '0', '2021-12-02 17:14:29.884892', null, null, null, null, '2.00', '0.00', '0.00', null, '1', '45.00', '0.00', '41000.00', '28', null, null, '0.00', '0.00', '1', '19', null, '11', '1', null);
INSERT INTO `package` VALUES ('80', '1', '1161A88B949BF61', '012889964', null, '32.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '53', '52', '1', '0.00', 'Receiver', '0.26', '0.00', '2021-12-04 00:10:38.197011', '2021-12-04 00:10:38.197011', 'ស្ពានអាកាសស្តុបដីហុយ', 'C13', 'ទឹកថ្លា', '012889964', '012889964', null, '0', 'Normal', '38', 'Meng Korng', 'VIP', '015 877 768', null, '0.00', '5.00', 'BR0000000053', '2021-12-04 00:10:38.197011', '2021-12-04 00:10:38.197011', '0', '0', '2021-12-04 00:10:38.197011', null, null, null, null, '2.50', '0.00', '0.00', null, '1', '34.76', '0.00', '41000.00', '27', null, null, '0.00', '0.00', '1', '21', null, '16', '1', null);
INSERT INTO `package` VALUES ('81', '1', '1161A88BF2E0079', '086666626', null, '23.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '53', '45', '1', '0.00', 'Receiver', '0.39', '0.00', '2021-12-02 17:14:29.885640', '2021-12-02 17:14:29.885640', 'ព្រៃស', 'C3', 'ព្រៃស', '086666626', '086666626', null, '0', 'Normal', '38', 'Meng Korng', 'VIP', '015 877 768', null, '0.00', '6.00', 'BR0000000053', '2021-12-02 17:14:29.885640', '2021-12-02 17:14:29.885640', '0', '0', '2021-12-02 17:14:29.885640', null, null, null, null, '2.00', '0.00', '0.00', null, '1', '25.39', '0.00', '41000.00', '27', null, null, '0.00', '0.00', '1', '18', null, '11', '1', null);
INSERT INTO `package` VALUES ('82', '1', '1161A88C6CECD54', '070876906', null, '34.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '52', '51', '1', '0.00', 'Receiver', '0.00', '0.00', '2021-12-03 22:22:48.103549', '2021-12-03 22:22:48.103549', 'ក្រោយវត្តព្រះពុទ្ទ', 'A16', 'វត្តភ្នំ', '070876906', '070876906', null, '0', 'Normal', '39', 'Seng Kimly', 'VIP', '088 585 8586', null, '0.00', '0.00', 'BR0000000052', '2021-12-03 22:22:48.103549', '2021-12-03 22:22:48.103549', '0', '0', '2021-12-03 22:22:48.103549', null, null, null, null, '1.00', '0.00', '0.00', null, '1', '35.00', '0.00', '41000.00', '28', null, null, '0.00', '0.00', '1', '20', null, '15', '1', null);
INSERT INTO `package` VALUES ('83', '1', '1161A88C999D99C', '015662926', null, '43.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '52', '49', '1', '0.00', 'Receiver', '0.00', '0.00', '2021-12-02 17:14:53.211214', '2021-12-02 17:14:53.211214', 'អូឡាំពិក', 'A5', 'អូឡាំពិក', '015662926', '015662926', null, '0', 'Normal', '39', 'Seng Kimly', 'VIP', '088 585 8586', null, '0.00', '0.00', 'BR0000000052', '2021-12-02 17:14:53.211214', '2021-12-02 17:14:53.211214', '0', '0', '2021-12-02 17:14:53.211214', null, null, null, null, '1.50', '0.00', '0.00', null, '1', '44.50', '0.00', '41000.00', '28', null, null, '0.00', '0.00', '1', '19', null, '13', '1', null);
INSERT INTO `package` VALUES ('84', '1', '1161A88CE92751A', '010515220', null, '10.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '52', '51', '1', '0.00', 'Receiver', '0.00', '0.00', '2021-12-03 22:22:48.104158', '2021-12-03 22:22:48.104158', 'ចំការដូង', 'A38', 'ស្ទឹងមានជយ័', '010515220', '010515220', null, '0', 'Normal', '39', 'Seng Kimly', 'VIP', '088 585 8586', null, '0.00', '0.00', 'BR0000000052', '2021-12-03 22:22:48.104158', '2021-12-03 22:22:48.104158', '0', '0', '2021-12-03 22:22:48.104158', null, null, null, null, '1.50', '0.00', '0.00', null, '1', '11.50', '0.00', '41000.00', '28', null, null, '0.00', '0.00', '1', '20', null, '15', '1', null);
INSERT INTO `package` VALUES ('85', '1', '1161A8A2AFBD901', '67876867', null, '32.00', '', '23.00', '50.00', '32.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '56', '51', '0', '0.00', 'Receiver', '0.41', '0.00', '2021-12-03 22:20:05.307436', '2021-12-03 22:20:05.307436', 'បុរីហេងមានជ័យ ច្បារអំពៅ', 'B12', 'ច្បាអំពៅទី១', '67876867', '67876867', null, '0', 'Normal', '37', 'Rattana Hak', 'VIP', '016 285 878', null, '0.00', '6.12', 'BR0000000056', '2021-12-03 22:20:05.307436', '2021-12-03 22:20:05.307436', '0', '0', '2021-12-03 22:20:05.307436', null, null, '0', null, '1.50', '0.00', '0.00', null, '1', '1.91', '0.00', '41000.00', '28', null, null, '0.00', null, '1', '20', null, null, null, null);
INSERT INTO `package` VALUES ('86', '1', '1161A8A2AFBEBFD', '6756756', null, '10.00', '', '0.00', '0.00', '0.00', '0.00', '9', '0', 'hjymmkumikjyuyj', 'admin@gmail.com', null, 'admin@gmail.com', null, '56', '52', '0', null, 'Receiver', '0.00', '0.00', '2021-12-04 00:04:44.699156', '2021-12-04 00:04:44.000000', 'ស្ពានអាកាស៧មករា（យកខោ១ពីភ្ញៀវវិញផង', 'C13', 'ទឹកថ្លា', '6756756', '6756756', null, '0', 'Normal', '37', 'Rattana Hak', 'VIP', '016 285 878', null, '0.00', '0.00', 'BR0000000056', '2021-12-04 00:04:44.699156', '2021-12-04 00:04:44.000000', '1', '0', '2021-12-04 00:04:44.699156', null, null, '0', null, '2.00', '0.00', '0.00', null, '1', '2.00', '0.00', '41000.00', '27', null, null, null, null, null, null, null, null, null, null);
INSERT INTO `package` VALUES ('87', '1', '1161AA1E81B2B98', '015662926', null, '43.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '57', '51', '0', '0.00', 'Receiver', '0.00', '0.00', '2021-12-03 22:22:48.104591', '2021-12-03 22:22:48.104591', 'អូឡាំពិក', 'A5', 'អូឡាំពិក', '015662926', '015662926', null, '0', 'Normal', '39', 'Seng Kimly', 'VIP', '088 585 8586', null, '0.00', '0.00', 'BR0000000057', '2021-12-03 22:22:48.104591', '2021-12-03 22:22:48.104591', '0', '0', '2021-12-03 22:22:48.104591', null, null, null, null, '1.50', '0.00', '0.00', null, '1', '1.50', '0.00', '41000.00', '28', null, null, '0.00', '0.00', '1', '20', null, '15', '1', null);
INSERT INTO `package` VALUES ('88', '1', '1161AA1EAF48E5E', '010515220', null, '10.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '57', '51', '1', '0.00', 'Receiver', '0.00', '0.00', '2021-12-03 22:22:48.105000', '2021-12-03 22:22:48.105000', 'ស្ទឹងមានជ័យ', 'A38', 'ស្ទឹងមានជយ័', '010515220', '010515220', null, '0', 'Normal', '39', 'Seng Kimly', 'VIP', '088 585 8586', null, '0.00', '0.00', 'BR0000000057', '2021-12-03 22:22:48.105000', '2021-12-03 22:22:48.105000', '0', '0', '2021-12-03 22:22:48.105000', null, null, null, null, '1.50', '0.00', '0.00', null, '1', '11.50', '0.00', '41000.00', '28', null, null, '0.00', '0.00', '1', '20', null, '15', '1', null);
INSERT INTO `package` VALUES ('89', '1', '1161AA4D2306D87', '788990764', null, '90.00', '', '0.00', '0.00', '0.00', '0.00', '10', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '58', '52', '1', '0.00', 'Receiver', '0.65', '0.00', '2021-12-04 00:05:29.122298', '2021-12-04 00:05:29.000000', 'ui7j7ij', 'C36', 'ព្រែកប្រា', '788990764', '788990764', null, '0', 'Normal', '39', 'Seng Kimly', 'VIP', '088 585 8586', null, '0.00', '8.00', 'BR0000000058', '2021-12-04 00:05:29.122298', '2021-12-04 00:05:29.000000', '1', '0', '2021-12-04 00:05:29.122298', null, null, null, null, '2.00', '0.00', '0.00', null, '1', '92.65', '0.00', '41000.00', '27', null, null, null, null, null, null, null, null, null, null);
INSERT INTO `package` VALUES ('90', '1', '1161AB1E7E73BCB', '010515220', null, '10.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '59', '54', '1', null, 'Receiver', '0.00', '0.00', '2021-12-05 16:51:18.452051', '2021-12-05 16:51:18.452051', 'ស្ទឹងមានជ័យ', 'A38', 'ស្ទឹងមានជយ័', '010515220', '010515220', null, '0', 'Normal', '39', 'Seng Kimly', 'VIP', '088 585 8586', null, '0.00', '0.00', 'BR0000000059', '2021-12-05 16:51:18.452051', '2021-12-05 16:51:18.452051', '0', '0', '2021-12-05 16:51:18.452051', null, null, '0', null, '1.50', '0.00', '0.00', null, '1', '11.50', '0.00', '41000.00', '27', null, null, '0.00', '0.00', '1', '22', null, '21', '1', null);
INSERT INTO `package` VALUES ('91', '1', '1161AB1E7E74CB9', '015662926', null, '43.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '59', '54', '1', null, 'Receiver', '0.00', '0.00', '2021-12-05 16:51:18.452587', '2021-12-05 16:51:18.452587', 'អូឡាំពិក', 'A5', 'អូឡាំពិក', '015662926', '015662926', null, '0', 'Normal', '39', 'Seng Kimly', 'VIP', '088 585 8586', null, '0.00', '0.00', 'BR0000000059', '2021-12-05 16:51:18.452587', '2021-12-05 16:51:18.452587', '0', '0', '2021-12-05 16:51:18.452587', null, null, '0', null, '1.50', '0.00', '0.00', null, '1', '44.50', '0.00', '41000.00', '27', null, null, '0.00', '0.00', '1', '22', null, '21', '1', null);
INSERT INTO `package` VALUES ('92', '1', '1161AB1E7E756FB', '070876906', null, '34.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '59', '54', '1', null, 'Receiver', '0.00', '0.00', '2021-12-05 16:51:18.453016', '2021-12-05 16:51:18.453016', 'ក្រោយវត្តព្រះពុទ្ទ', 'A16', 'វត្តភ្នំ', '070876906', '070876906', null, '0', 'Normal', '39', 'Seng Kimly', 'VIP', '088 585 8586', null, '0.00', '0.00', 'BR0000000059', '2021-12-05 16:51:18.453016', '2021-12-05 16:51:18.453016', '0', '0', '2021-12-05 16:51:18.453016', null, null, '0', null, '1.00', '0.00', '0.00', null, '1', '35.00', '0.00', '41000.00', '27', null, null, '0.00', '0.00', '1', '22', null, '21', '1', null);
INSERT INTO `package` VALUES ('93', '1', '1161AB20E80E122', '077225568', null, '10.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '60', '54', '1', '0.00', 'Receiver', '0.00', '0.00', '2021-12-05 16:50:54.079559', '2021-12-05 16:50:54.079559', 'ស្ពានអាកាស៧មករា（យកខោ១ពីភ្ញៀវវិញផង', 'C13', 'ទឹកថ្លា', '077225568', '077225568', null, '0', 'Normal', '37', 'Rattana Hak', 'VIP', '016 285 878', null, '0.00', '0.00', 'BR0000000060', '2021-12-05 16:50:54.079559', '2021-12-05 16:50:54.079559', '0', '0', '2021-12-05 16:50:54.079559', null, null, null, null, '2.00', '0.00', '0.00', null, '1', '12.00', '0.00', '41000.00', '27', null, null, '0.00', '0.00', '1', '22', null, '19', '1', null);
INSERT INTO `package` VALUES ('94', '1', '1161AB2120B668D', '069239561', null, '32.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '60', '54', '1', '0.00', 'Receiver', '0.13', '0.00', '2021-12-05 16:50:54.080059', '2021-12-05 16:50:54.080059', 'បុរីហេងមានជ័យ ច្បារអំពៅ', 'B12', 'ច្បាអំពៅទី១', '069239561', '069239561', null, '0', 'Normal', '37', 'Rattana Hak', 'VIP', '016 285 878', null, '0.00', '4.00', 'BR0000000060', '2021-12-05 16:50:54.080059', '2021-12-05 16:50:54.080059', '0', '0', '2021-12-05 16:50:54.080059', null, null, null, null, '1.50', '0.00', '0.00', null, '1', '33.63', '0.00', '41000.00', '27', null, null, '0.00', '0.00', '1', '22', null, '19', '1', null);
INSERT INTO `package` VALUES ('95', '1', '1161AB21D435FCF', '011657985', null, '23.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '61', '53', '1', '0.00', 'Receiver', '0.65', '0.00', '2021-12-05 16:50:40.765314', '2021-12-05 16:50:40.765314', 'បឹងគេងកង១', 'A2', 'បឹងកេងកងទី ១', '011657985', '011657985', null, '0', 'Normal', '41', 'Madam Q Homestore', 'Normal', '093488777', null, '0.00', '8.00', 'BR0000000061', '2021-12-05 16:50:40.765314', '2021-12-05 16:50:40.765314', '0', '0', '2021-12-05 16:50:40.765314', null, null, null, null, '1.00', '0.00', '0.00', null, '1', '24.65', '0.00', '41000.00', '28', null, null, '0.00', '0.00', '1', '23', null, '18', '1', null);
INSERT INTO `package` VALUES ('96', '1', '1161AB2223B441B', '095646930', null, '10.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '62', '53', '1', '0.00', 'Receiver', '0.00', '0.00', '2021-12-05 16:51:05.206640', '2021-12-05 16:51:05.206640', 'វត្តទួល', 'C9', 'ឬស្សីកែង', '095646930', '095646930', null, '0', 'Normal', '40', 'អូន ធីដា', 'Normal', '087 823 080', null, '0.00', '0.00', 'BR0000000062', '2021-12-05 16:51:05.206640', '2021-12-05 16:51:05.206640', '0', '0', '2021-12-05 16:51:05.206640', null, null, null, null, '2.00', '0.00', '0.00', null, '1', '12.00', '0.00', '41000.00', '28', null, null, '0.00', '0.00', '1', '23', null, '20', '1', null);
INSERT INTO `package` VALUES ('97', '1', '1161AB22732FBB8', '086722237', null, '43.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '63', '53', '1', '0.00', 'Receiver', '0.00', '0.00', '2021-12-05 16:50:29.265253', '2021-12-05 16:50:29.265253', 'ផ្សារចោមចៅ', 'C18', 'ចោមចៅ', '086722237', '086722237', null, '0', 'Normal', '38', 'Meng Korng', 'VIP', '015 877 768', null, '0.00', '0.00', 'BR0000000063', '2021-12-05 16:50:29.265253', '2021-12-05 16:50:29.265253', '0', '0', '2021-12-05 16:50:29.265253', null, null, null, null, '2.00', '0.00', '0.00', null, '1', '45.00', '0.00', '41000.00', '28', null, null, '0.00', '0.00', '1', '23', null, '17', '1', null);
INSERT INTO `package` VALUES ('98', '1', '1161AB234893773', '012889964', null, '32.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '63', '53', '1', '0.00', 'Receiver', '0.26', '0.00', '2021-12-05 16:50:29.266684', '2021-12-05 16:50:29.266684', 'ស្ពានអាកាសស្តុបដីហុយ', 'C13', 'ទឹកថ្លា', '012889964', '012889964', null, '0', 'Normal', '38', 'Meng Korng', 'VIP', '015 877 768', null, '0.00', '5.00', 'BR0000000063', '2021-12-05 16:50:29.266684', '2021-12-05 16:50:29.266684', '0', '0', '2021-12-05 16:50:29.266684', null, null, null, null, '2.50', '0.00', '0.00', null, '1', '34.76', '0.00', '41000.00', '28', null, null, '0.00', '0.00', '1', '23', null, '17', '1', null);
INSERT INTO `package` VALUES ('99', '1', '1161AB2389058B3', '086666626', null, '23.00', '', '0.00', '0.00', '0.00', '0.00', '8', '0', null, 'admin@gmail.com', null, 'admin@gmail.com', null, '63', '53', '1', '0.00', 'Receiver', '0.39', '0.00', '2021-12-05 16:50:29.267064', '2021-12-05 16:50:29.267064', 'ព្រៃស', 'C3', 'ព្រៃស', '086666626', '086666626', null, '0', 'Normal', '38', 'Meng Korng', 'VIP', '015 877 768', null, '0.00', '6.00', 'BR0000000063', '2021-12-05 16:50:29.267064', '2021-12-05 16:50:29.267064', '0', '0', '2021-12-05 16:50:29.267064', null, null, null, null, '2.00', '0.00', '0.00', null, '1', '25.39', '0.00', '41000.00', '28', null, null, '0.00', '0.00', '1', '23', null, '17', '1', null);
INSERT INTO `package` VALUES ('101', '1', '1161ACA6785EBA6', '011657985', null, '10.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, '', null, '68', null, '1', null, 'Receiver', '0.65', '0.00', '2021-12-06 02:11:13.000000', '2021-12-05 19:11:13.789260', 'បឹងគេងកង១', 'A2', 'បឹងកេងកងទី ១', '011657985', '011657985', null, '0', 'normal', '40', 'អូន ធីដា', 'Normal', '087 823 080', null, '0.00', '8.00', 'BR0000000068', '2021-12-05 19:11:13.789260', '2021-12-05 19:11:13.789260', '1', '0', '2021-12-05 19:11:13.789260', null, null, '0', null, '1.00', '0.00', '0.00', null, '1', '11.65', '0.00', '41000.00', null, null, null, null, null, null, null, null, null, null, null);
INSERT INTO `package` VALUES ('102', '1', '1161ACA9FE844B3', '077225568', null, '10.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, '', null, '64', null, '1', null, 'Receiver', '0.13', '0.00', '2021-12-06 02:06:45.000000', '2021-12-05 19:06:45.469098', 'ស្ពានអាកាស៧មករា（យកខោ១ពីភ្ញៀវវិញផង', 'C13', 'ទឹកថ្លា', '077225568', '077225568', null, '0', 'normal', '37', 'Rattana Hak', 'VIP', '016 285 878', null, '0.00', '4.00', 'BR0000000064', '2021-12-05 19:06:45.469098', '2021-12-05 19:06:45.469098', '1', '0', '2021-12-05 19:06:45.469098', null, null, '0', null, '2.00', '0.00', '0.00', null, '1', '12.13', '0.00', '41000.00', null, null, null, null, null, null, null, null, null, null, null);
INSERT INTO `package` VALUES ('103', '1', '1161ACA9FE8541E', '069239561', null, '32.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, '', null, '64', null, '1', null, 'Receiver', '0.00', '0.00', '2021-12-06 02:04:17.000000', '2021-12-05 19:04:17.843072', 'បុរីហេងមានជ័យ ច្បារអំពៅ', 'B12', 'ច្បាអំពៅទី១', '069239561', '069239561', null, '0', 'fast', '37', 'Rattana Hak', 'VIP', '016 285 878', null, '0.00', '0.00', 'BR0000000064', '2021-12-05 19:04:17.843072', '2021-12-05 19:04:17.843072', '1', '0', '2021-12-05 19:04:17.843072', null, null, '0', null, '2.00', '0.00', '0.00', null, '1', '34.00', '0.00', '41000.00', null, null, null, null, null, null, null, null, null, null, null);
INSERT INTO `package` VALUES ('104', '1', '1161ACA9FE86063', '069777875', null, '20.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, 'admin@gmail.com', null, '64', null, '0', '0.00', 'Sender', '0.13', '0.00', '2021-12-05 19:32:37.192830', '2021-12-06 02:32:37.000000', 'ទួលទំពូង', 'A10', 'ទួលទំពូងទី១', '069777875', '069777875', null, '0', 'normal', '37', 'Rattana Hak', 'VIP', '016 285 878', null, '0.00', '4.00', 'BR0000000064', '2021-12-05 19:32:37.192830', '2021-12-05 19:32:37.192830', '1', '0', '2021-12-05 19:32:37.192830', null, null, '0', null, '1.00', '0.00', '0.00', null, '1', '0.00', '1.13', '41000.00', null, null, null, null, null, null, null, null, null, null, null);
INSERT INTO `package` VALUES ('105', '1', '1161ACA9FE868DE', '086511117', null, '25.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, '', null, '64', null, '1', null, 'Receiver', '0.00', '0.00', '2021-12-06 02:04:53.000000', '2021-12-05 19:04:53.765439', 'វត្តតាំងក្រសាំង', 'C15', 'ក្រាំងថ្នង់', '086511117', '086511117', null, '0', 'normal', '37', 'Rattana Hak', 'VIP', '016 285 878', null, '0.00', '0.00', 'BR0000000064', '2021-12-05 19:04:53.765439', '2021-12-05 19:04:53.765439', '1', '0', '2021-12-05 19:04:53.765439', null, null, '0', null, '2.00', '0.00', '0.00', null, '1', '27.00', '0.00', '41000.00', null, null, null, null, null, null, null, null, null, null, null);
INSERT INTO `package` VALUES ('106', '1', '1161ACACB89003A', '011657985', null, '23.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, '', null, '65', null, '1', '0.00', 'Receiver', '0.65', '0.00', '2021-12-06 02:12:40.000000', '2021-12-05 19:12:40.590576', 'បឹងគេងកង១', 'A2', 'បឹងកេងកងទី ១', '011657985', '011657985', null, '0', 'normal', '41', 'Madam Q Homestore', 'Normal', '093488777', null, '0.00', '8.00', 'BR0000000065', '2021-12-05 19:12:40.590576', null, '1', '0', '2021-12-05 07:00:00.000000', null, null, null, null, '1.00', '0.00', '0.00', null, '1', '24.65', '0.00', '41000.00', null, null, null, null, null, null, null, null, null, null, null);
INSERT INTO `package` VALUES ('107', '1', '1161ACAF43AE4A9', '069294099', null, '21.50', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, 'admin@gmail.com', null, '66', null, '1', '0.00', 'Receiver', '0.00', '0.00', '2021-12-05 19:30:37.534755', '2021-12-06 02:30:37.000000', 'ផ្សារព្រៃទា', 'C2', 'ព្រៃវែង', '069294099', '069294099', null, '0', 'normal', '38', 'Meng Korng', 'VIP', '015 877 768', null, '0.00', '0.00', 'BR0000000066', '2021-12-05 19:30:37.534755', '2021-12-05 19:30:37.534755', '1', '0', '2021-12-05 19:30:37.534755', null, null, '0', null, '2.00', '0.00', '0.00', null, '1', '23.50', '0.00', '41000.00', null, null, null, null, null, null, null, null, null, null, null);
INSERT INTO `package` VALUES ('108', '1', '1161ACAF43AFDDA', '081668888', null, '22.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, 'admin@gmail.com', null, '66', null, '1', '0.00', 'Receiver', '0.39', '0.00', '2021-12-05 19:30:58.229008', '2021-12-06 02:30:58.000000', 'បុរីវិមានភ្នំពេញ ផ្លូវជាសុផារ៉ា', 'C12', 'ភ្នំពេញថ្មី', '081668888', '081668888', null, '0', 'normal', '38', 'Meng Korng', 'VIP', '015 877 768', null, '0.00', '6.00', 'BR0000000066', '2021-12-05 19:30:58.229008', '2021-12-05 19:30:58.229008', '1', '0', '2021-12-05 19:30:58.229008', null, null, '0', null, '2.00', '0.00', '0.00', null, '1', '24.39', '0.00', '41000.00', null, null, null, null, null, null, null, null, null, null, null);
INSERT INTO `package` VALUES ('109', '1', '1161ACAF43B1291', '010673658', null, '21.50', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, 'admin@gmail.com', null, '66', null, '1', '0.00', 'Receiver', '0.00', '0.00', '2021-12-05 19:31:09.373784', '2021-12-06 02:31:09.000000', 'អូឬស្សី', 'A23', 'អូឬស្សីទី១', '010673658', '010673658', null, '0', 'normal', '38', 'Meng Korng', 'VIP', '015 877 768', null, '0.00', '0.00', 'BR0000000066', '2021-12-05 19:31:09.373784', '2021-12-05 19:31:09.373784', '1', '0', '2021-12-05 19:31:09.373784', null, null, '0', null, '1.00', '0.00', '0.00', null, '1', '22.50', '0.00', '41000.00', null, null, null, null, null, null, null, null, null, null, null);
INSERT INTO `package` VALUES ('110', '1', '1161ACAF43B2418', '086666626', null, '23.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, 'admin@gmail.com', null, '66', null, '1', '0.00', 'Receiver', '0.39', '0.00', '2021-12-05 19:31:16.701190', '2021-12-06 02:31:16.000000', 'ព្រៃស', 'C3', 'ព្រៃស', '086666626', '086666626', null, '0', 'normal', '38', 'Meng Korng', 'VIP', '015 877 768', null, '0.00', '6.00', 'BR0000000066', '2021-12-05 19:31:16.701190', '2021-12-05 19:31:16.701190', '1', '0', '2021-12-05 19:31:16.701190', null, null, '0', null, '2.00', '0.00', '0.00', null, '1', '25.39', '0.00', '41000.00', null, null, null, null, null, null, null, null, null, null, null);
INSERT INTO `package` VALUES ('111', '1', '1161ACAF43B39E2', '012889964', null, '32.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, 'admin@gmail.com', null, '66', null, '1', '0.00', 'Receiver', '0.26', '0.00', '2021-12-05 19:36:47.834035', '2021-12-06 02:36:47.000000', 'ស្ពានអាកាសស្តុបដីហុយ', 'C13', 'ទឹកថ្លា', '012889964', '012889964', null, '0', 'fast', '38', 'Meng Korng', 'VIP', '015 877 768', null, '0.00', '5.00', 'BR0000000066', '2021-12-05 19:36:47.834035', '2021-12-05 19:36:47.834035', '1', '0', '2021-12-05 19:36:47.834035', null, null, '0', null, '2.50', '0.00', '0.00', null, '1', '34.76', '0.00', '41000.00', null, null, null, null, null, null, null, null, null, null, null);
INSERT INTO `package` VALUES ('112', '1', '1161ACAF43B4F52', '086722237', null, '43.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, 'admin@gmail.com', null, '66', null, '1', '0.00', 'Receiver', '0.00', '0.00', '2021-12-05 19:31:30.108610', '2021-12-06 02:31:30.000000', 'ផ្សារចោមចៅ', 'C18', 'ចោមចៅ', '086722237', '086722237', null, '0', 'normal', '38', 'Meng Korng', 'VIP', '015 877 768', null, '0.00', '0.00', 'BR0000000066', '2021-12-05 19:31:30.108610', '2021-12-05 19:31:30.108610', '1', '0', '2021-12-05 19:31:30.108610', null, null, '0', null, '2.00', '0.00', '0.00', null, '1', '45.00', '0.00', '41000.00', null, null, null, null, null, null, null, null, null, null, null);
INSERT INTO `package` VALUES ('113', '1', '1161ACB81F67F2F', '09857272', null, '10.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, 'admin@gmail.com', null, '67', null, '1', '0.00', 'Receiver', '0.13', '0.00', '2021-12-05 20:02:27.716260', '2021-12-06 03:02:27.000000', 'ផ្សារទួលគោក', 'B9', 'ទួលសង្កែ', '09857272', '09857272', null, '0', 'normal', '39', 'Seng Kimly', 'VIP', '088 585 8586', null, '0.00', '4.00', 'BR0000000067', '2021-12-05 20:02:27.716260', '2021-12-05 20:02:27.716260', '1', '0', '2021-12-05 20:02:27.716260', null, null, '0', null, '1.50', '0.00', '0.00', null, '1', '11.63', '0.00', '41000.00', null, null, null, null, null, null, null, null, null, null, null);
INSERT INTO `package` VALUES ('114', '1', '1161ACB81F68BFB', '016935657', null, '10.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, 'admin@gmail.com', null, '67', null, '0', '0.00', 'Sender', '0.26', '0.00', '2021-12-05 20:02:35.889687', '2021-12-06 03:02:35.000000', 'បឹងត្របែកផ្លាហ្សា', 'A11', 'បឹងត្របែក', '016935657', '016935657', null, '0', 'normal', '39', 'Seng Kimly', 'VIP', '088 585 8586', null, '0.00', '5.00', 'BR0000000067', '2021-12-05 20:02:35.889687', '2021-12-05 20:02:35.889687', '1', '0', '2021-12-05 20:02:35.889687', null, null, '0', null, '1.00', '0.00', '0.00', null, '1', '0.00', '1.26', '41000.00', null, null, null, null, null, null, null, null, null, null, null);
INSERT INTO `package` VALUES ('115', '1', '1161ACB81F696AD', '0712971571', null, '10.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, 'admin@gmail.com', null, '67', null, '0', '0.00', 'Sender', '0.00', '0.00', '2021-12-05 20:02:46.830647', '2021-12-06 03:02:46.000000', 'រតនគិរី ផ្ញើតាមទ្បាន', 'C23', 'កន្ទោក', '0712971571', '0712971571', null, '0', 'normal', '39', 'Seng Kimly', 'VIP', '088 585 8586', null, '0.00', '0.00', 'BR0000000067', '2021-12-05 20:02:46.830647', '2021-12-05 20:02:46.830647', '1', '0', '2021-12-05 20:02:46.830647', null, null, '0', null, '2.00', '0.00', '0.00', null, '1', '0.00', '2.00', '41000.00', null, null, null, null, null, null, null, null, null, null, null);
INSERT INTO `package` VALUES ('116', '1', '1161ACB81F69F53', '010360472', null, '13.50', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, 'admin@gmail.com', null, '67', null, '1', '0.00', 'Receiver', '0.00', '0.00', '2021-12-05 20:02:59.576828', '2021-12-06 03:02:59.000000', 'សាលាNorth bridge', 'A38', 'ស្ទឹងមានជយ័', '010360472', '010360472', null, '0', 'fast', '39', 'Seng Kimly', 'VIP', '088 585 8586', null, '0.00', '0.00', 'BR0000000067', '2021-12-05 20:02:59.576828', '2021-12-05 20:02:59.576828', '1', '0', '2021-12-05 20:02:59.576828', null, null, '0', null, '1.50', '0.00', '0.00', null, '1', '15.00', '0.00', '41000.00', null, null, null, null, null, null, null, null, null, null, null);
INSERT INTO `package` VALUES ('117', '1', '1161ACB81F6A97D', '070388757', null, '7.50', '', '0.00', '0.00', '0.00', '0.00', '6', '0', '', 'admin@gmail.com', null, 'admin@gmail.com', null, '67', '55', '1', '0.00', 'Receiver', '0.00', '0.00', '2021-12-06 13:17:53.413339', '2021-12-06 13:17:53.000000', 'ពោធិ៍ចិនតុង', 'C18', 'ចោមចៅ', '070388757', '070388757', null, '0', 'fast', '39', 'Seng Kimly', 'VIP', '088 585 8586', null, '0.00', '0.00', 'BR0000000067', '2021-12-06 13:17:53.000000', '2021-12-06 13:17:53.413339', '1', '0', '2021-12-06 13:17:53.413339', null, null, '0', null, '2.50', '0.00', '0.00', null, '1', '10.00', '0.00', '41000.00', '28', null, null, null, null, null, null, null, null, null, null);
INSERT INTO `package` VALUES ('118', '1', '1161ACB81F6B41E', '010515220', null, '10.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, 'admin@gmail.com', null, '67', null, '1', '0.00', 'Sender', '0.00', '0.00', '2021-12-05 20:03:12.745140', '2021-12-06 03:03:12.000000', 'ស្ទឹងមានជ័យ', 'A38', 'ស្ទឹងមានជយ័', '010515220', '010515220', null, '0', 'fast', '39', 'Seng Kimly', 'VIP', '088 585 8586', null, '0.00', '0.00', 'BR0000000067', '2021-12-05 20:03:12.745140', '2021-12-05 20:03:12.745140', '1', '0', '2021-12-05 20:03:12.745140', null, null, '0', null, '1.50', '0.00', '0.00', null, '1', '10.00', '1.50', '41000.00', null, null, null, null, null, null, null, null, null, null, null);
INSERT INTO `package` VALUES ('119', '1', '1161ACB81F6BFFD', '015662926', null, '43.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, 'admin@gmail.com', null, '67', null, '1', '0.00', 'Receiver', '0.00', '0.00', '2021-12-05 20:03:31.839202', '2021-12-06 03:03:31.000000', 'អូឡាំពិក', 'A5', 'អូឡាំពិក', '015662926', '015662926', null, '0', 'fast', '39', 'Seng Kimly', 'VIP', '088 585 8586', null, '0.00', '0.00', 'BR0000000067', '2021-12-05 20:03:31.839202', '2021-12-05 20:03:31.839202', '1', '0', '2021-12-05 20:03:31.839202', null, null, '0', null, '1.50', '0.00', '0.00', null, '1', '44.50', '0.00', '41000.00', null, null, null, null, null, null, null, null, null, null, null);
INSERT INTO `package` VALUES ('120', '1', '1161ACB81F6CA47', '070876906', null, '34.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', '', 'admin@gmail.com', null, 'admin@gmail.com', null, '67', null, '1', '0.00', 'Receiver', '0.00', '0.00', '2021-12-05 20:03:43.330702', '2021-12-06 03:03:43.000000', 'ក្រោយវត្តព្រះពុទ្ទ', 'A16', 'វត្តភ្នំ', '070876906', '070876906', null, '0', 'normal', '39', 'Seng Kimly', 'VIP', '088 585 8586', null, '0.00', '0.00', 'BR0000000067', '2021-12-05 20:03:43.330702', '2021-12-05 20:03:43.330702', '1', '0', '2021-12-05 20:03:43.330702', null, null, '0', null, '1.00', '0.00', '0.00', null, '1', '35.00', '0.00', '41000.00', null, null, null, null, null, null, null, null, null, null, null);
INSERT INTO `package` VALUES ('121', '1', '1161AD787AA2344', '011657985', null, '23.00', '', '0.00', '0.00', '0.00', '0.00', '5', '0', 'បញ្ចប់ដោយបុក្គលិកការិយាលយ័', 'admin@gmail.com', null, 'admin@gmail.com', null, '73', null, '1', '0.00', 'Receiver', '0.00', '0.00', '2021-12-06 13:47:18.353542', '2021-12-06 13:47:18.000000', 'បឹងគេងកង១', 'A2', 'បឹងកេងកងទី ១', '011657985', '011657985', null, '0', 'normal', '41', 'Madam Q Homestore', 'Normal', '093488777', null, '0.00', '0.00', 'BR0000000073', '2021-12-06 13:47:18.353542', '2021-12-06 13:47:18.353542', '1', '0', '2021-12-06 13:47:18.353542', null, null, '0', null, '1.00', '0.00', '0.00', null, '1', '1.00', '0.00', '41000.00', null, null, null, null, null, null, null, null, null, null, null);
INSERT INTO `package` VALUES ('122', '1', '1161ADAD5C615BA', '012555666', null, '120.00', '', '25.00', '12.00', '9.00', '0.00', '6', '0', '', 'admin@gmail.com', null, 'admin@gmail.com', null, '74', '56', '1', '0.00', 'Receiver', '0.00', '0.00', '2021-12-06 13:32:53.319961', '2021-12-06 13:32:53.000000', 'address testing', 'C23', 'កន្ទោក', '012555666', '012555666', null, '0', 'normal', '39', 'Seng Kimly', 'VIP', '088 585 8586', null, '0.00', '0.46', 'BR0000000074', '2021-12-06 13:32:53.000000', '2021-12-06 13:32:53.319961', '1', '0', '2021-12-06 13:32:53.319961', null, null, '0', null, '0.00', '0.00', '0.00', null, '1', '2.00', '0.00', '41000.00', '28', null, null, null, null, null, null, null, null, null, null);
INSERT INTO `package` VALUES ('123', '1', '1161AE026F93640', '012567673', null, '135.00', '', '56.00', '12.00', '19.00', '0.00', '5', '0', '', 'admin@gmail.com', null, 'admin@gmail.com', null, '75', null, '1', '0.00', 'Sender', '0.00', '0.00', '2021-12-06 21:00:06.947782', '2021-12-06 21:00:06.000000', 'fe', 'C23', 'កន្ទោក', '012567673', '012567673', null, '0', 'normal', '39', 'Seng Kimly', 'VIP', '088 585 8586', null, '3.00', '3.00', 'BR0000000075', '2021-12-06 21:00:06.947782', '2021-12-06 21:00:06.947782', '1', '0', '2021-12-06 21:00:06.947782', null, null, '0', null, '2.00', '0.00', '0.00', null, '1', '135.00', '2.00', '41000.00', null, null, null, null, null, null, null, null, null, null, null);
INSERT INTO `package` VALUES ('124', '1', '1161AE1B827E40E', '012678789', null, '120.00', '', '12.00', '67.00', '8.00', '0.00', '5', '0', '', 'admin@gmail.com', null, '', null, '76', null, '1', '0.00', 'Sender', '0.00', '0.00', '2021-12-06 21:17:38.000000', '2021-12-06 21:17:38.520358', 'asdghjgh', 'C23', 'កន្ទោក', '012678789', '012678789', null, '0', 'normal', '37', 'Rattana Hak', 'VIP', '016 285 878', null, '1.00', '1.07', 'BR0000000076', '2021-12-06 21:17:38.520358', null, '1', '0', '2021-12-06 00:00:00.000000', null, null, '0', null, '2.00', '0.00', '0.00', null, '1', null, '2.00', '41000.00', null, null, null, null, null, null, null, null, null, null, null);
INSERT INTO `package` VALUES ('125', '1', '1161AE1F35B08F1', '023436346', null, '54.00', '', '12.00', '5.00', '67.00', '0.00', '5', '0', '', 'admin@gmail.com', null, '', null, '77', null, '1', '0.00', 'Sender', '0.00', '0.00', '2021-12-06 21:33:25.000000', '2021-12-06 21:33:25.727994', '01223242', 'C23', 'កន្ទោក', '023436346', '023436346', null, '0', 'normal', '38', 'Meng Korng', 'VIP', '015 877 768', null, '1.00', '1.00', 'BR0000000077', '2021-12-06 21:33:25.727994', null, '1', '0', '2021-12-06 00:00:00.000000', null, null, '0', null, '2.00', '0.00', '0.00', null, '1', null, '2.00', '41000.00', null, null, null, null, null, null, null, null, null, null, null);
INSERT INTO `package` VALUES ('126', '1', '1161AE205DD4097', '0125676867', null, '128.00', '', '12.00', '7.00', '23.00', '0.00', '5', '0', '', 'admin@gmail.com', null, 'admin@gmail.com', null, '78', null, '1', '0.00', 'Sender', '0.00', '0.00', '2021-12-07 17:59:12.128338', '2021-12-07 10:59:12.000000', 'dfgdfhd', 'C23', 'កន្ទោក', '0125676867', '0125676867', null, '0', 'normal', '38', 'Meng Korng', 'VIP', '015 877 768', null, '1.00', '1.00', 'BR0000000078', '2021-12-07 17:59:12.128338', '2021-12-07 17:59:12.128338', '1', '0', '2021-12-07 17:59:12.128338', null, null, '0', null, '2.00', '0.00', '0.00', null, '1', '128.00', '2.00', '41000.00', null, null, null, null, null, null, null, null, null, null, null);

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
  `create_date` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of package_statuses
-- ----------------------------
INSERT INTO `package_statuses` VALUES ('0', 'Canceled', '12', '1', '0', '0', 'pickup');
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
  `zone_code` varchar(15) DEFAULT '',
  `price` decimal(10,2) DEFAULT NULL,
  `delivery_type` varchar(25) DEFAULT NULL,
  `base_price` decimal(10,2) DEFAULT NULL,
  `id` bigint(10) NOT NULL AUTO_INCREMENT,
  `sender_id` int(11) DEFAULT NULL,
  `price_option` varchar(15) DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `create_date` timestamp(6) NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `zone_codes` varchar(500) DEFAULT NULL,
  `sender_ids` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=99 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of price_list
-- ----------------------------
INSERT INTO `price_list` VALUES ('1', '0.00', '-1.00', '3.00', '2021-11-27', null, '1', '', '0.00', 'Normal', '1.00', '73', '0', 'fixed', 'admin@gmail.com', '2021-11-27 16:22:18.000000', '|A1|A10|A11|A12|A13|A14|A15|A16|A17|A18|A19|A2|A20|A21|A22|A23|A24|A25|A26|A27|A28|A29|A3|A30|A31|A32|A33|A34|A35|A36|A37|A38|A39|A4|A5|A6|A7|A8|A9|', '|35|34|33|36|');
INSERT INTO `price_list` VALUES ('1', '0.13', '3.00', '-1.00', '2021-11-27', null, '1', '', '0.00', 'Normal', '1.00', '74', '0', 'per_kg', 'admin@gmail.com', '2021-11-27 17:12:41.000000', '|A1|A10|A11|A12|A13|A14|A15|A16|A17|A18|A19|A2|A20|A21|A22|A23|A24|A25|A26|A27|A28|A29|A3|A30|A31|A32|A33|A34|A35|A36|A37|A38|A39|A4|A5|A6|A7|A8|A9|', '|35|34|36|');
INSERT INTO `price_list` VALUES ('1', '0.00', '-1.00', '3.00', '2021-11-27', null, '1', '', '0.00', 'Fast', '1.50', '75', '0', 'fixed', 'admin@gmail.com', '2021-11-27 16:23:03.000000', '|A1|A10|A11|A12|A13|A14|A15|A16|A17|A18|A19|A2|A20|A21|A22|A23|A24|A25|A26|A27|A28|A29|A3|A30|A31|A32|A33|A34|A35|A36|A37|A38|A39|A4|A5|A6|A7|A8|A9|', '|35|34|33|36|');
INSERT INTO `price_list` VALUES ('1', '0.13', '3.00', '-1.00', '2021-11-25', null, '1', '', '0.00', 'Fast', '1.50', '76', '0', 'per_kg', 'Puthea', '2021-11-25 19:03:32.000000', '|A1|A10|A11|A12|A13|A14|A15|A16|A17|A18|A19|A2|A20|A21|A22|A23|A24|A25|A26|A27|A28|A29|A3|A30|A31|A32|A33|A34|A35|A36|A37|A38|A39|A4|A5|A6|A7|A8|A9|', '|35|34|33|36|');
INSERT INTO `price_list` VALUES ('1', '0.00', '-1.00', '3.00', '2021-11-27', null, '1', '', '0.00', 'Normal', '1.50', '77', '0', 'fixed', 'admin@gmail.com', '2021-11-27 16:35:28.000000', '|B1|B10|B11|B12|B13|B14|B2|B3|B4|B5|B6|B7|B8|B9|', '|35|34|33|36|');
INSERT INTO `price_list` VALUES ('1', '0.13', '3.00', '-1.00', '2021-11-27', null, '1', '', '0.00', 'Normal', '1.50', '78', '0', 'per_kg', 'admin@gmail.com', '2021-11-27 15:59:06.000000', '|B1|B10|B11|B12|B13|B14|B2|B3|B4|B5|B6|B7|B8|B9|', '|35|34|33|36|');
INSERT INTO `price_list` VALUES ('1', '0.00', '-1.00', '3.00', '2021-11-27', null, '1', '', '0.00', 'Fast', '2.00', '79', '0', 'fixed', 'admin@gmail.com', '2021-11-27 16:22:49.000000', '|B1|B10|B11|B12|B13|B14|B2|B3|B4|B5|B6|B7|B8|B9|', '|35|34|33|36|');
INSERT INTO `price_list` VALUES ('1', '0.13', '3.00', '-1.00', '2021-11-25', null, '1', '', '0.00', 'Fast', '2.00', '80', '0', 'per_kg', 'Puthea', '2021-11-25 19:09:24.000000', '|B1|B10|B11|B12|B13|B14|B2|B3|B4|B5|B6|B7|B8|B9|', '|35|34|33|36|');
INSERT INTO `price_list` VALUES ('1', '0.00', '-1.00', '3.00', '2021-11-27', null, '1', '', '0.00', 'Normal', '2.00', '81', '0', 'fixed', 'admin@gmail.com', '2021-11-27 16:21:35.000000', '|C1|C10|C11|C12|C13|C14|C15|C16|C17|C18|C19|C2|C20|C21|C22|C23|C24|C25|C26|C27|C28|C29|C3|C30|C31|C32|C33|C34|C35|C36|C37|C38|C39|C4|C40|C5|C6|C7|C8|C9|', '|35|34|33|36|');
INSERT INTO `price_list` VALUES ('1', '0.13', '3.00', '-1.00', '2021-11-27', null, '1', '', '0.00', 'Normal', '2.00', '82', '0', 'per_kg', 'admin@gmail.com', '2021-11-27 16:00:24.000000', '|C1|C10|C11|C12|C13|C14|C15|C16|C17|C18|C19|C2|C20|C21|C22|C23|C24|C25|C26|C27|C28|C29|C3|C30|C31|C32|C33|C34|C35|C36|C37|C38|C39|C4|C40|C5|C6|C7|C8|C9|', '|35|34|33|36|');
INSERT INTO `price_list` VALUES ('1', '0.00', '-1.00', '3.00', '2021-11-27', null, '1', '', '0.00', 'Fast', '2.50', '83', '0', 'fixed', 'admin@gmail.com', '2021-11-27 16:22:37.000000', '|C1|C10|C11|C12|C13|C14|C15|C16|C17|C18|C19|C2|C20|C21|C22|C23|C24|C25|C26|C27|C28|C29|C3|C30|C31|C32|C33|C34|C35|C36|C37|C38|C39|C4|C40|C5|C6|C7|C8|C9|', '|35|34|33|36|');
INSERT INTO `price_list` VALUES ('1', '0.13', '3.00', '-1.00', '2021-11-25', null, '1', '', '0.00', 'Fast', '2.50', '84', '0', 'per_kg', 'Puthea', '2021-11-25 19:19:13.000000', '|C1|C10|C11|C12|C13|C14|C15|C16|C17|C18|C19|C2|C20|C21|C22|C23|C24|C25|C26|C27|C28|C29|C3|C30|C31|C32|C33|C34|C35|C36|C37|C38|C39|C4|C40|C5|C6|C7|C8|C9|', '|35|34|33|36|');
INSERT INTO `price_list` VALUES ('1', '0.00', '-1.00', '3.00', '2021-11-27', null, '1', '', '0.00', 'Normal', '1.00', '85', '0', 'fixed', 'admin@gmail.com', '2021-11-27 20:10:33.000000', '|A1|A10|A11|A12|A13|A14|A15|A16|A17|A18|A19|A2|A20|A21|A22|A23|A24|A25|A26|A27|A28|A29|A3|A30|A31|A32|A33|A34|A35|A36|A37|A38|A39|A4|A5|A6|A7|A8|A9|', '|38|37|39|40|');
INSERT INTO `price_list` VALUES ('1', '0.13', '3.00', '-1.00', '2021-11-27', null, '1', '', '0.00', 'Normal', '1.00', '86', '0', 'per_kg', 'admin@gmail.com', '2021-11-27 20:11:39.000000', '|A1|A10|A11|A12|A13|A14|A15|A16|A17|A18|A19|A2|A20|A21|A22|A23|A24|A25|A26|A27|A28|A29|A3|A30|A31|A32|A33|A34|A35|A36|A37|A38|A39|A4|A5|A6|A7|A8|A9|', '|38|37|39|40|');
INSERT INTO `price_list` VALUES ('1', '0.00', '-1.00', '3.00', '2021-11-27', null, '1', '', '0.00', 'Fast', '1.50', '87', '0', 'fixed', 'admin@gmail.com', '2021-11-27 20:12:37.000000', '|A1|A10|A11|A12|A13|A14|A15|A16|A17|A18|A19|A2|A20|A21|A22|A23|A24|A25|A26|A27|A28|A29|A3|A30|A31|A32|A33|A34|A35|A36|A37|A38|A39|A4|A5|A6|A7|A8|A9|', '|38|37|39|40|');
INSERT INTO `price_list` VALUES ('1', '0.13', '3.00', '-1.00', '2021-11-27', null, '1', '', '0.00', 'Fast', '1.50', '88', '0', 'per_kg', 'admin@gmail.com', '2021-11-27 20:13:35.000000', '|A1|A10|A11|A12|A13|A14|A15|A16|A17|A18|A19|A2|A20|A21|A22|A23|A24|A25|A26|A27|A28|A29|A3|A30|A31|A32|A33|A34|A35|A36|A37|A38|A39|A4|A5|A6|A7|A8|A9|', '|38|37|39|40|');
INSERT INTO `price_list` VALUES ('1', '0.00', '-1.00', '3.00', '2021-11-27', null, '1', '', '0.00', 'Normal', '1.50', '89', '0', 'fixed', 'admin@gmail.com', '2021-11-27 20:16:13.000000', '|B1|B10|B11|B12|B13|B14|B2|B3|B4|B5|B6|B7|B8|B9|', '|38|37|39|40|');
INSERT INTO `price_list` VALUES ('1', '0.13', '3.00', '-1.00', '2021-11-27', null, '1', '', '0.00', 'Normal', '1.50', '90', '0', 'per_kg', 'admin@gmail.com', '2021-11-27 20:17:24.000000', '|B1|B10|B11|B12|B13|B14|B2|B3|B4|B5|B6|B7|B8|B9|', '|38|37|39|40|');
INSERT INTO `price_list` VALUES ('1', '0.00', '-1.00', '3.00', '2021-11-27', null, '1', '', '0.00', 'Fast', '2.00', '91', '0', 'fixed', 'admin@gmail.com', '2021-11-27 20:49:47.000000', '|B1|B10|B11|B12|B13|B14|B2|B3|B4|B5|B6|B7|B8|B9|', '|38|37|39|40|');
INSERT INTO `price_list` VALUES ('1', '0.13', '3.00', '-1.00', '2021-11-27', null, '1', '', '0.00', 'Fast', '2.00', '92', '0', 'per_kg', 'admin@gmail.com', '2021-11-27 20:50:21.000000', '|B1|B10|B11|B12|B13|B14|B2|B3|B4|B5|B6|B7|B8|B9|', '|38|37|39|40|');
INSERT INTO `price_list` VALUES ('1', '0.00', '-1.00', '3.00', '2021-11-27', null, '1', '', '0.00', 'Normal', '2.00', '93', '0', 'fixed', 'admin@gmail.com', '2021-11-27 20:52:39.000000', '|C1|C10|C11|C12|C13|C14|C15|C16|C17|C18|C19|C2|C20|C21|C22|C23|C24|C25|C26|C27|C28|C29|C3|C30|C31|C32|C33|C34|C35|C36|C37|C38|C39|C4|C40|C5|C6|C7|C8|C9|', '|38|37|39|40|');
INSERT INTO `price_list` VALUES ('1', '0.13', '3.00', '-1.00', '2021-11-27', null, '1', '', '0.00', 'Normal', '2.00', '94', '0', 'per_kg', 'admin@gmail.com', '2021-11-27 20:53:38.000000', '|C1|C10|C11|C12|C13|C14|C15|C16|C17|C18|C19|C2|C20|C21|C22|C23|C24|C25|C26|C27|C28|C29|C3|C30|C31|C32|C33|C34|C35|C36|C37|C38|C39|C4|C40|C5|C6|C7|C8|C9|', '|38|37|39|40|');
INSERT INTO `price_list` VALUES ('1', '0.00', '-1.00', '3.00', '2021-11-27', null, '1', '', '0.00', 'Fast', '2.50', '95', '0', 'fixed', 'admin@gmail.com', '2021-11-27 21:01:06.000000', '|C1|C10|C11|C12|C13|C14|C15|C16|C17|C18|C19|C2|C20|C21|C22|C23|C24|C25|C26|C27|C28|C29|C3|C30|C31|C32|C33|C34|C35|C36|C37|C38|C39|C4|C40|C5|C6|C7|C8|C9|', '|38|37|39|40|');
INSERT INTO `price_list` VALUES ('1', '0.13', '3.00', '-1.00', '2021-11-27', null, '1', '', '0.00', 'Fast', '2.50', '96', '0', 'per_kg', 'admin@gmail.com', '2021-11-27 21:01:56.000000', '|C1|C10|C11|C12|C13|C14|C15|C16|C17|C18|C19|C2|C20|C21|C22|C23|C24|C25|C26|C27|C28|C29|C3|C30|C31|C32|C33|C34|C35|C36|C37|C38|C39|C4|C40|C5|C6|C7|C8|C9|', '|38|37|39|40|');
INSERT INTO `price_list` VALUES ('1', '0.00', '-1.00', '3.00', '2021-11-28', null, '1', '', '0.00', 'Normal', '1.00', '97', '0', 'fixed', 'admin@gmail.com', '2021-11-28 15:57:34.000000', '|A1|A10|A11|A12|A13|A14|A15|A16|A17|A18|A19|A2|A20|A21|A22|A23|A24|A25|A26|A27|A28|A29|A3|A30|A31|A32|A33|A34|A35|A36|A37|A38|A39|A4|A5|A6|A7|A8|A9|', '|41|');
INSERT INTO `price_list` VALUES ('1', '0.13', '3.00', '-1.00', '2021-11-28', null, '1', '', '0.00', 'Normal', '1.00', '98', '0', 'per_kg', 'admin@gmail.com', '2021-11-28 15:59:11.000000', '|A1|A10|A11|A12|A13|A14|A15|A16|A17|A18|A19|A2|A20|A21|A22|A23|A24|A25|A26|A27|A28|A29|A3|A30|A31|A32|A33|A34|A35|A36|A37|A38|A39|A4|A5|A6|A7|A8|A9|', '|41|');

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
  `create_date` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of product_types
-- ----------------------------
INSERT INTO `product_types` VALUES ('1', '1', 'Cosmetics', 'Admin', '2021-12-06 11:29:02.179061');
INSERT INTO `product_types` VALUES ('2', '1', 'Clothing', 'Admin', '2021-12-06 11:29:16.360678');
INSERT INTO `product_types` VALUES ('3', '1', 'Electronics', 'Admin', '2021-12-06 11:29:45.810582');

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
  `create_date` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `code` varchar(25) DEFAULT '',
  `branch_id` int(10) DEFAULT NULL,
  `status_code` varchar(20) DEFAULT 'active',
  `update_user` varchar(35) DEFAULT NULL,
  `update_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `commission` decimal(10,2) DEFAULT NULL,
  `commission_type` varchar(15) DEFAULT 'per_item' COMMENT 'commission_type = {''per_item'',''per_referal''}',
  `sex` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sales_agents
-- ----------------------------
INSERT INTO `sales_agents` VALUES ('1', '1', 'Lim Vannak', null, '011657985', 'vannaksuceedgmailcom', null, null, null, null, '#278 St90 Sangkat Buoeng Tompun Khan Meanchey Phnom Penh', 'admin@gmail.com', '2021-12-02 15:22:52.000000', 'A100007', '1', 'Active', null, '2021-12-02 15:22:52.298684', '0.08', 'per_item', null);
INSERT INTO `sales_agents` VALUES ('5', '1', 'Kim Chandara', null, '012765768', 'chandaragmailcom', null, null, null, null, '#123 St260 Sangkat BKK1 Khan Chamkarmon Phnom Penh', 'admin@gmail.com', '2021-12-02 15:24:33.000000', 'A100011', '1', 'Active', null, '2021-12-02 15:24:33.530404', '0.08', 'per_item', null);
INSERT INTO `sales_agents` VALUES ('6', '2', 'Lim racksmey', null, '089 798653', 'NA', null, null, null, null, '#12 St34 Sangkat Toul Sangke Khan Russey Keo Phnom Penh', 'admin@gmail.com', '2021-12-02 15:26:21.000000', 'A100012', '1', 'Active', null, null, '0.08', 'per_item', null);
INSERT INTO `sales_agents` VALUES ('7', '2', 'Ros Sabay', null, '0897689876', 'NA', null, null, null, null, 'Takeo', 'admin@gmail.com', '2021-12-02 15:28:02.000000', 'A100013', '1', 'Active', null, null, '0.08', 'per_item', null);
INSERT INTO `sales_agents` VALUES ('8', '2', 'Heng Samnang', null, '098765432', 'NA', null, null, null, null, 'Phnom Penh', 'admin@gmail.com', '2021-12-02 15:28:39.000000', 'A100014', '1', 'Active', null, null, '0.08', 'per_item', null);
INSERT INTO `sales_agents` VALUES ('9', '1', 'Reak Chamreourn', null, '098765432', 'NA', null, null, null, null, 'Prey Veng', 'admin@gmail.com', '2021-12-02 15:29:22.000000', 'A100015', '1', 'Active', null, null, '0.08', 'per_item', null);

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
  `create_date` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `code` varchar(25) DEFAULT '',
  `zone_code` varchar(15) DEFAULT NULL,
  `map_location` varchar(150) DEFAULT NULL,
  `branch_id` int(10) DEFAULT NULL,
  `status_code` varchar(20) DEFAULT 'active',
  `update_user` varchar(35) DEFAULT NULL,
  `update_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `sales_agent_id` int(11) DEFAULT NULL,
  `photo_file_name` varchar(250) DEFAULT NULL,
  `photo_file_type` varchar(7) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sender
-- ----------------------------
INSERT INTO `sender` VALUES ('33', '1', 'បងស្រី លីតា Lita', 'បងស្រី លីតា Lita', '010​989805', null, null, null, null, null, 'ផ្សាស្ទឹងមានជយ័ថ្មី', 'Fashion and Clothing', null, 'Puthea', '2021-12-07 00:58:11.236403', '10001', null, null, '1', 'active', 'Puthea', '2021-12-07 00:58:11.236403', null, '/home3/parrotcloudapps/public_html/uploads/companies/1_data/merchants/1_profile_pic_20211202_101251.jpg', 'jpg');
INSERT INTO `sender` VALUES ('34', '1', 'បងស្រី ពិសិដ្ឋរៀម', 'បងស្រី ពិសិដ្ឋរៀម', '012​982009', null, null, null, null, null, 'បុរី​ ប៉េងហួត វាលស្បូវ', 'Cosmetics', null, 'Puthea', '2021-12-07 00:58:11.236403', '10002', null, null, '1', 'active', 'Puthea', '2021-12-07 00:58:11.236403', null, '/home3/parrotcloudapps/public_html/uploads/companies/1_data/merchants/1_profile_pic_20211202_101251.jpg', 'jpg');
INSERT INTO `sender` VALUES ('35', '1', 'កញ្ញា ស្រីពេជ្រ', 'កញ្ញា ស្រីពេជ្រ', '093​758446', null, null, null, null, null, 'បុរី ភពថ្មីចំការដូង', 'Cosmetics', null, 'Puthea', '2021-12-07 00:58:11.236403', '10003', null, null, '1', 'active', 'Puthea', '2021-12-07 00:58:11.236403', null, '/home3/parrotcloudapps/public_html/uploads/companies/1_data/merchants/1_profile_pic_20211202_101251.jpg', 'jpg');
INSERT INTO `sender` VALUES ('36', '1', 'អូន ដាវី', 'អូន ដាវី', '099403489', null, null, null, null, null, 'ទល់មុខពេទ្យរ៉ូសុី', 'Fashion and Clothing', null, 'Puthea', '2021-12-07 00:58:11.236403', '10004', null, null, '1', 'active', 'Puthea', '2021-12-07 00:58:11.236403', null, '/home3/parrotcloudapps/public_html/uploads/companies/1_data/merchants/1_profile_pic_20211202_101251.jpg', 'jpg');
INSERT INTO `sender` VALUES ('37', '1', 'Rattana Hak', 'Rattana Hak', '016285878', null, null, null, null, null, 'Seim Reap', 'Online Sale', null, 'admin@gmail.com', '2021-12-07 00:58:11.236403', '10005', null, null, '1', 'active', null, '2021-12-07 00:58:11.236403', null, '/home3/parrotcloudapps/public_html/uploads/companies/1_data/merchants/1_profile_pic_20211202_101251.jpg', 'jpg');
INSERT INTO `sender` VALUES ('38', '1', 'Meng Korng', 'Meng Korng', '015877768', null, null, null, null, null, 'Kandal Province', 'Online Sale', null, 'admin@gmail.com', '2021-12-07 00:58:11.236403', '10006', null, null, '1', 'active', null, '2021-12-07 00:58:11.236403', null, '/home3/parrotcloudapps/public_html/uploads/companies/1_data/merchants/1_profile_pic_20211202_101251.jpg', 'jpg');
INSERT INTO `sender` VALUES ('39', '1', 'Seng Kimly', 'Seng Kimly', '0885858586', null, null, null, null, null, 'Phnom Pengh', 'Online Sale', null, 'admin@gmail.com', '2021-12-07 00:58:11.236403', '10007', null, null, '1', 'active', null, '2021-12-07 00:58:11.236403', null, '/home3/parrotcloudapps/public_html/uploads/companies/1_data/merchants/1_profile_pic_20211202_101251.jpg', 'jpg');
INSERT INTO `sender` VALUES ('40', '2', 'អូន ធីដា', 'អូន ធីដា', '087823080', null, null, null, null, null, 'Olympic Phnom Penh', 'Online Sale', null, 'admin@gmail.com', '2021-12-07 00:58:11.236403', '10008', null, null, '1', 'active', null, '2021-12-07 00:58:11.236403', null, '/home3/parrotcloudapps/public_html/uploads/companies/1_data/merchants/1_profile_pic_20211202_101251.jpg', 'jpg');
INSERT INTO `sender` VALUES ('41', '2', 'Madam Q Homestore', 'Madam Q Homestore', '093488777', null, null, null, null, null, 'Phnom Penh', 'Online Sale', null, 'admin@gmail.com', '2021-12-02 17:31:51.542494', '10009', null, null, '1', 'active', null, '2021-12-02 17:31:51.542494', null, '/home3/parrotcloudapps/public_html/uploads/companies/1_data/merchants/1_profile_pic_20211202_101251.jpg', 'jpg');
INSERT INTO `sender` VALUES ('42', '2', 'Super Sales ABC', 'Super Sales ABC', '012555777', null, null, null, null, null, null, null, null, 'self register', '2021-12-02 17:31:51.542494', '10010', null, null, '1', 'active', null, '2021-12-02 17:31:51.542494', null, '/home3/parrotcloudapps/public_html/uploads/companies/1_data/merchants/1_profile_pic_20211202_101251.jpg', 'jpg');
INSERT INTO `sender` VALUES ('43', null, 'Danny', 'ដានី', '012555771', null, null, null, null, null, 'Chamkaman', 'Food Shop', null, 'self register', '2021-12-02 17:31:51.542494', '10011', null, null, '1', 'active', '012555771', '2021-12-02 17:31:51.542494', null, '/home3/parrotcloudapps/public_html/uploads/companies/1_data/merchants/1_profile_pic_20211202_101251.jpg', 'jpg');
INSERT INTO `sender` VALUES ('44', '2', 'Bopha', 'Bopha', '012555666', 'bopha@gmail.com', null, null, null, null, 'Testing', null, null, 'self register', '2021-12-02 17:31:51.542494', '10012', null, null, '1', 'active', null, '2021-12-02 17:31:51.542494', null, '/home3/parrotcloudapps/public_html/uploads/companies/1_data/merchants/1_profile_pic_20211202_101251.jpg', 'jpg');
INSERT INTO `sender` VALUES ('45', '2', 'Benee', 'Benee', '066999988', 'benee@gmail.com', null, null, null, null, 'TEsting', null, null, 'self register', '2021-12-02 17:31:51.542494', '10013', null, null, '1', 'active', null, '2021-12-02 17:31:51.542494', null, '/home3/parrotcloudapps/public_html/uploads/companies/1_data/merchants/1_profile_pic_20211202_101251.jpg', 'jpg');
INSERT INTO `sender` VALUES ('46', '2', 'Jackie', 'Jackie', '+855967174940', 'jackie@bro.com', null, null, null, null, 'Testing', null, null, 'self register', '2021-12-06 09:41:45.693855', '10014', null, null, '1', 'active', null, '2021-12-06 09:41:45.693855', null, null, null);
INSERT INTO `sender` VALUES ('49', '2', 'Lim Vannak', 'Lim Vannak', '011657985', null, null, null, null, null, null, null, null, 'self register', '2021-12-06 15:01:32.490117', '10017', null, null, '1', 'active', null, '2021-12-06 15:01:32.490117', null, null, null);
INSERT INTO `sender` VALUES ('65', '2', 'ME', 'ME', '010428632', null, null, null, null, null, null, null, null, 'self register', '2021-12-06 16:39:59.551181', '10033', null, null, '1', 'active', null, '2021-12-06 16:39:59.551181', null, null, null);

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
  `create_date` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `is_primary` tinyint(6) NOT NULL DEFAULT 0 COMMENT 'is_primary = 1 => the account is used as primary account',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sender_bank_accounts
-- ----------------------------
INSERT INTO `sender_bank_accounts` VALUES ('21', '9', '1', 'ABA', '111', 'DDD', 'admin@gmail.com', '2021-10-21 12:29:17.000000', '1');
INSERT INTO `sender_bank_accounts` VALUES ('22', '9', '1', 'ACLEDA', '0222222', 'cbnbn', 'admin@gmail.com', '2021-10-21 12:29:17.000000', '0');
INSERT INTO `sender_bank_accounts` VALUES ('23', '6', '1', 'ABA', '00997878', 'Samsethy', 'admin@gmail.com', '2021-10-21 12:30:11.000000', '1');
INSERT INTO `sender_bank_accounts` VALUES ('24', '6', '1', 'ACLEDA', '00002086877878', 'samsethy THOUN', 'admin@gmail.com', '2021-10-21 12:30:11.000000', '0');
INSERT INTO `sender_bank_accounts` VALUES ('25', '26', '1', 'ABA BANK', '000151572', 'LIM VANNAK', 'Sopha', '2021-11-06 18:02:52.000000', '1');
INSERT INTO `sender_bank_accounts` VALUES ('26', '27', '1', 'ABA BANK', '000151572', 'LIM VANNAK', 'Sopha', '2021-11-06 18:30:44.000000', '1');
INSERT INTO `sender_bank_accounts` VALUES ('27', '28', '1', 'ABA BANK', '000151572', 'LIM VANNAK', 'Sopha', '2021-11-06 19:39:08.000000', '1');
INSERT INTO `sender_bank_accounts` VALUES ('28', '33', '1', 'ABA', '000257469', 'SEM SOLITA', 'Puthea', '2021-11-23 19:28:58.000000', '1');
INSERT INTO `sender_bank_accounts` VALUES ('29', '34', '1', 'ABA', '000298000', 'TOUCH PISETHRAMY', 'Puthea', '2021-11-23 19:29:49.000000', '1');
INSERT INTO `sender_bank_accounts` VALUES ('30', '35', '1', 'ABA', '000842441', 'SEM SREYPICH', 'Puthea', '2021-11-23 19:30:03.000000', '1');
INSERT INTO `sender_bank_accounts` VALUES ('31', '36', '1', 'ABA', '500158818', 'CHIN DAVY', 'Puthea', '2021-11-25 16:54:45.000000', '1');
INSERT INTO `sender_bank_accounts` VALUES ('57', '43', '1', 'Bank C', '000123321', 'Bank 3C', '012555771', '2021-11-30 11:17:58.000000', '0');
INSERT INTO `sender_bank_accounts` VALUES ('58', '43', '1', 'back r', '000897678', 'bnk Er', '012555771', '2021-11-30 12:14:58.000000', '1');
INSERT INTO `sender_bank_accounts` VALUES ('59', '43', '1', 'Bank J', '000234567', 'Janson', '012555771', '2021-11-30 12:17:15.000000', '1');
INSERT INTO `sender_bank_accounts` VALUES ('60', '43', '1', 'Bank S', '12345678901', 'Sosan', '012555771', '2021-11-30 12:18:21.000000', '1');
INSERT INTO `sender_bank_accounts` VALUES ('61', '43', '1', 'BankW', '09784326578', 'Asana', '012555771', '2021-11-30 12:19:56.000000', '1');
INSERT INTO `sender_bank_accounts` VALUES ('62', '43', '1', 'Acleda', '000888999', 'Channy', '012555771', '2021-12-01 16:58:06.000000', '1');

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
INSERT INTO `sender_base_price` VALUES ('3', '1', '9', '0.00', '2021-10-18', '1', null, 'chunheng', '2021-10-28 10:36:30.000000', 'all', '2021-10-28', 'chunheng', 'all');
INSERT INTO `sender_base_price` VALUES ('4', '1', '5', '1.00', '2021-10-18', '1', null, 'admin@gmail.com', '2021-10-25 08:52:13.917567', '', '2021-10-19', 'admin@gmail.com', 'all');
INSERT INTO `sender_base_price` VALUES ('5', '1', '1', '0.80', '2021-10-18', '1', null, 'admin@gmail.com', '2021-10-25 08:52:13.917567', '', '2021-10-21', 'admin@gmail.com', 'all');

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
INSERT INTO `sender_code_control` VALUES ('1', '33', null);

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
  `create_date` timestamp(6) NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
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
INSERT INTO `sender_price_list` VALUES ('1', '4', '0.00', '0.00', '3.50', 'TTP', '1', '1.50', '0.00', 'Normal', '2021-10-16', null, '1', 'fixed', 'admin@gmail.com', '2021-10-17 00:17:13.000000');
INSERT INTO `sender_price_list` VALUES ('2', '4', '0.00', '0.00', '3.50', 'TTP', '1', '1.50', '0.00', 'Fast', '2021-10-16', null, '1', 'fixed', 'admin@gmail.com', '2021-10-17 00:17:37.000000');
INSERT INTO `sender_price_list` VALUES ('3', '4', '0.00', '0.00', '3.50', 'all', '1', '1.50', '0.00', 'Fast', '2021-10-16', null, '1', 'fixed', 'admin@gmail.com', '2021-10-17 00:18:00.000000');
INSERT INTO `sender_price_list` VALUES ('7', '4', '0.00', '0.00', '3.50', 'BKK', '1', '1.20', '0.00', 'Normal', '2021-10-16', null, '1', 'fixed', 'admin@gmail.com', '2021-10-17 00:49:23.000000');
INSERT INTO `sender_price_list` VALUES ('8', '4', '0.00', '0.00', '3.50', 'BKK', '1', '1.20', '0.00', 'Fast', '2021-10-16', null, '1', 'fixed', 'admin@gmail.com', '2021-10-17 00:52:45.000000');
INSERT INTO `sender_price_list` VALUES ('9', '4', '0.00', '0.00', '3.50', 'BKK', '1', '1.20', '0.00', 'Fast', '2021-10-16', null, '1', 'fixed', 'admin@gmail.com', '2021-10-17 00:53:14.000000');
INSERT INTO `sender_price_list` VALUES ('10', '4', '0.00', '0.00', '3.50', 'BKK', '1', '1.20', '0.00', 'Fast', '2021-10-16', null, '1', 'fixed', 'admin@gmail.com', '2021-10-17 00:53:33.000000');
INSERT INTO `sender_price_list` VALUES ('11', '4', '0.00', '0.00', '3.50', 'BKK', '1', '1.30', '0.00', 'Normal', '2021-10-16', null, '1', 'fixed', 'admin@gmail.com', '2021-10-17 01:05:52.000000');
INSERT INTO `sender_price_list` VALUES ('12', '4', '0.00', '0.00', '3.50', 'all', '1', '1.50', '0.00', 'Fast', '2021-10-16', null, '1', 'fixed', 'admin@gmail.com', '2021-10-17 01:06:28.000000');
INSERT INTO `sender_price_list` VALUES ('13', '4', '0.00', '0.00', '3.50', 'all', '1', '1.50', '0.00', 'Fast', '2021-10-16', null, '1', 'fixed', 'admin@gmail.com', '2021-10-17 01:06:34.000000');
INSERT INTO `sender_price_list` VALUES ('15', '4', '0.00', '0.00', '2.00', 'all', '1', '1.50', '0.00', 'Normal', '2021-10-19', null, '1', 'fixed', 'admin@gmail.com', '2021-10-19 20:42:16.000000');
INSERT INTO `sender_price_list` VALUES ('16', '4', '0.15', '3.50', '8.00', 'all', '1', '2.00', '0.00', 'Normal', '2021-10-28', null, '1', 'per_kg', 'chunheng', '2021-10-28 11:40:25.000000');
INSERT INTO `sender_price_list` VALUES ('17', '4', '0.00', '0.00', '2.00', 'CHK1', '1', '1.50', '0.00', 'Fast', '2021-10-17', null, '1', 'fixed', 'admin@gmail.com', '2021-10-17 13:35:21.000000');
INSERT INTO `sender_price_list` VALUES ('19', '4', '0.00', '0.00', '3.00', 'BKK', '1', '0.00', '2.00', 'Fast', '2021-10-28', null, '1', 'fixed', 'chunheng', '2021-10-28 11:33:19.000000');
INSERT INTO `sender_price_list` VALUES ('20', '4', '0.15', '3.00', '5.00', 'BKK', '1', '0.00', '2.00', 'Fast', '2021-10-28', null, '1', 'per_kg', 'chunheng', '2021-10-28 11:34:42.000000');
INSERT INTO `sender_price_list` VALUES ('21', '5', '0.00', '0.00', '3.00', 'BKK', '1', '0.00', '1.00', 'Normal', '2021-10-28', null, '1', 'fixed', 'chunheng', '2021-10-28 11:58:01.000000');
INSERT INTO `sender_price_list` VALUES ('22', '5', '0.00', '0.00', '3.00', 'CHK1', '1', '0.00', '1.00', 'Normal', '2021-10-28', null, '1', 'fixed', 'chunheng', '2021-10-28 11:58:23.000000');
INSERT INTO `sender_price_list` VALUES ('23', '10', '0.00', '-1.00', '0.00', 'BKK', '1', '1.00', '1.00', 'Normal', '2021-10-29', null, '1', 'fixed', 'admin@gmail.com', '2021-10-29 10:41:27.000000');
INSERT INTO `sender_price_list` VALUES ('24', '6', '0.00', '0.00', '3.00', 'all', '1', '0.00', '1.20', 'Normal', '2021-10-29', null, '1', 'per_kg', 'admin@gmail.com', '2021-10-29 14:54:32.000000');
INSERT INTO `sender_price_list` VALUES ('25', '6', '0.16', '3.00', '-1.00', 'all', '1', '0.00', '1.20', 'Normal', '2021-10-29', null, '1', 'per_kg', 'admin@gmail.com', '2021-10-29 14:54:59.000000');
INSERT INTO `sender_price_list` VALUES ('26', '6', '0.00', '0.00', '3.00', 'TTP', '1', '0.00', '1.10', 'Normal', '2021-10-29', null, '1', 'per_kg', 'admin@gmail.com', '2021-10-29 16:07:32.000000');
INSERT INTO `sender_price_list` VALUES ('27', '6', '0.15', '3.00', '0.00', 'TTP', '1', '0.15', '1.20', 'Normal', '2021-10-29', null, '1', 'per_kg', 'admin@gmail.com', '2021-10-29 16:14:35.000000');
INSERT INTO `sender_price_list` VALUES ('28', '5', '0.40', '-1.00', '0.00', 'BKK', '1', '0.00', '1.00', 'Normal', '2021-11-05', null, '1', 'per_kg', 'Sopha', '2021-11-06 00:18:58.000000');
INSERT INTO `sender_price_list` VALUES ('29', '27', '0.00', '-1.00', '3.00', 'BKK001', '1', '0.00', '1.00', 'Normal', '2021-11-06', null, '1', 'fixed', 'Sopha', '2021-11-06 19:29:13.000000');
INSERT INTO `sender_price_list` VALUES ('30', '27', '0.12', '3.00', '-1.00', 'BKK001', '1', '0.00', '1.00', 'Normal', '2021-11-06', null, '1', 'per_kg', 'Sopha', '2021-11-06 19:30:13.000000');

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
INSERT INTO `settings_number` VALUES ('14', '1', 'EXCHANGE_RATE_BUY', '41000.00', null, null);
INSERT INTO `settings_number` VALUES ('15', '1', 'EXCHANGE_RATE_SELL', '41000.00', null, null);
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
INSERT INTO `trip_num_control` VALUES ('1', '12', null, '2021', '12');

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
INSERT INTO `um_branches` VALUES ('1', 'Dolgoal Co., Ltd', 'ក្រុមហ៊ុនដឹកជញ្ជូន ដល់ហ្គោល', '/home3/parrotcloudapps/public_html/uploads/companies/1_data/identity/1_logo_20211127_071130.png', 'png', '#458 Street 24BT Sangkat Boeung Tompon Khan Meanchey Phnom Penh Cambodia', '011 657985', 'Lim Vannak', null, '០093 488777', null, null, null, null, 'ផ្ទះលេខ៤៥៨ ផ្លូវ២៤BT សង្កាត់បឹងទំពន់ ខណ្ឌមានជ័យ រាធធានីភ្នំពេញ', 'dolgoalgmailcom', 'admin@gmail.com', '2021-12-02 16:12:50.000000', 'www.broexpress.com');

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
  `create_date` timestamp(6) NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `user_class` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of um_roles
-- ----------------------------
INSERT INTO `um_roles` VALUES ('DFB15FKAEEC611EG2E7C9801A7CXD1HK', '1', 'Admins', '1', null, '2021-09-10 22:54:38.909419', 'admin_support');
INSERT INTO `um_roles` VALUES ('DFB15FKAEEC611EG2E7C9801A7CXD1HK', '7', 'HR Officers', '1', null, '2021-09-10 22:52:44.677796', 'admin_support');
INSERT INTO `um_roles` VALUES ('DFB15FKAEEC611EG2E7C9801A7CXD1HK', '13', 'Drivers', '1', 'admin@gmail.com', '2021-09-10 15:54:18.000000', 'driver');
INSERT INTO `um_roles` VALUES ('DFB15FKAEEC611EG2E7C9801A7CXD1HK', '14', 'Merchant', '1', 'admin@gmail.com', '2021-09-10 17:21:22.000000', 'merchant');

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
  `start_time` timestamp(6) NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `last_active_time` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `session_id` varchar(50) DEFAULT NULL,
  `csrf_code` varchar(50) DEFAULT NULL,
  `access_token` varchar(50) DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL COMMENT 'status ={online,offline}',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=711 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of um_sessions
-- ----------------------------
INSERT INTO `um_sessions` VALUES ('197', '1', 'DFB15FKAEEC611EG2E7C9801A7CXD1HK', 'samsethy1', '4', '2021-09-10 12:59:17.000000', '2021-09-10 12:59:17.000000', 'UNZNry9u17ZbSMUYgT9sd9UxRCTcZFNzGsLQ56', '8Vz1KHME8wmmWm6DHLeDRkyspc8SRlZvQzesuc', 'YsLT9quYd78Ihp9zZimUp99S8mV8h75RJ7c1bW', null);
INSERT INTO `um_sessions` VALUES ('221', '1', 'DFB15FKAEEC611EG2E7C9801A7CXD1HK', '012528131', '5', '2021-09-12 02:59:56.000000', '2021-09-12 02:59:56.000000', '19092kEq8j8s57JQ6YCcNa88GFSltTcjH8O3qy', 'RC3L3x4h8f936SDVM7arFvVNBXmCmH8xONDH4k', 'u7UBa96cX3K78HK9G4oZg9UJU69ca7yJ1neabL', null);
INSERT INTO `um_sessions` VALUES ('441', '1', '38DC051E122D11EC89909801A7B0D1FCH', '0967174940', '17', '2021-10-22 06:54:24.000000', '2021-10-22 06:54:24.000000', 'w62b4Hx119PYw81gkUfZTKpxTkD8SKx92kG1vd', 'qRK08H3TA4N4Ei68NMiTk8A94FNcg3MxE85h6O', 'PBgVT114XlcxtzZY2uUELMQDCZc7n2IQbsUCic', null);
INSERT INTO `um_sessions` VALUES ('447', '1', '584C7FF2122D11EC89909801A8B0D7XKD', '02356767', '18', '2021-10-27 09:17:34.000000', '2021-10-27 09:17:34.000000', 'QlFwEPLyD3Y0h5VWPFW8e69gzr0kHT7q4QV4z3', '8KGchrebkAMuLSRuoO91L3Uj15EsosY8GfiF9B', 'm3AMr02oaJCYAVM077Xh9P23kT1gJoe7lZ7eUY', null);
INSERT INTO `um_sessions` VALUES ('622', '1', '38DC051E122D11EC89909801A7B0D1FCH', '012333222', '33', '2021-11-28 17:03:29.000000', '2021-11-28 17:03:29.000000', 'L44538vGoTAeEjHpb4Jt5BfWzGwuFPLQL10bDK', 'XoUy9Ef4eoqMf71tBBWR8A9mHSYCSra1C4n66W', 'hO91HWFsYcFhOAbXfpv2TGsMM9nqvPsuPHzpd6', null);
INSERT INTO `um_sessions` VALUES ('630', '1', '38DC051E122D11EC89909801A7B0D1FCH', '012555777', '34', '2021-11-29 08:42:40.000000', '2021-11-29 08:42:40.000000', 'oULYjZ33S8EfQljE5OW9y8XAb6QzjRU4P7u7rP', 'DOffP3m66I497B4n9q2oYunUMLaiscKf1twPB2', '7nPOBVDwB96wVpeYtgSR4L47jVgTZD24F4XzTk', null);
INSERT INTO `um_sessions` VALUES ('632', '1', 'DFB15FKAEEC611EG2E7C9801A7CXD1HK', 'chunheng', '31', '2021-11-29 12:40:29.000000', '2021-11-29 12:40:29.000000', 'w2YGKpoveN3cxkUe3SfSbxo7S78sZNX5gF5C89', '2t1SwWK0uffkLmdspnMw9RhfeMlTusoK0i73e1', '01niQKGVVWgz95x2O5zhR3MahsHsXfUyGo24EC', null);
INSERT INTO `um_sessions` VALUES ('669', '1', '38DC051E122D11EC89909801A7B0D1FCH', '017777888', '35', '2021-12-05 11:40:16.000000', '2021-12-05 11:40:16.000000', 'r1Ee44MaoW7aB3NeL7Jb4kXCre0JKKl8gs26lu', 'FHbYJD8ZR68FC933qjxD75uPqwkwmFluJG0jy9', 'Q5TGCj9tc182DLEFOw7874BHVuBBhfC59G4iTC', null);
INSERT INTO `um_sessions` VALUES ('704', '1', '584C7FF2122D11EC89909801A8B0D7XKD', '081802428', '35', '2021-12-07 11:29:19.000000', '2021-12-07 11:29:19.000000', 'VWRYZhlfHSBrcnAiUtRATAEk7epyWhQC1sAfHy', 'W93771hPq7AvLe4RFf781E3eS4llmYb386jysu', 'E2A8PlkO6CArXgvIUHKYCOP1spDyBNHnN936FA', null);
INSERT INTO `um_sessions` VALUES ('707', '1', '38DC051E122D11EC89909801A7B0D1FCH', '010428632', '61', '2021-12-08 04:55:28.000000', '2021-12-08 04:55:28.000000', 'fR4AuoXZPQGVbFFPkEq1F6zb03EXWl42k7U7rg', 'tzLBaf7iaBF71zWoVrM8lUknp3H07NVcM3s772', '27x8cPEmS1ixUtXZJUjA5M2b2TaVx6ToxPzCTg', null);
INSERT INTO `um_sessions` VALUES ('710', '1', 'DFB15FKAEEC611EG2E7C9801A7CXD1HK', 'admin@gmail.com', '1', '2021-12-08 12:35:53.000000', '2021-12-08 12:35:53.000000', 'L8CNnDzeb2K43oA3XUviUW1V1at2Z5AAMx07Gq', 'r0Qb26U5rVV1vOM4iu3k4hJmw6OiyI6U1P56QY', '75b3MYHJ39Hzds54z7N9V61NbzYw7i2E9jF86O', null);

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
  `create_date` timestamp(6) NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `official_code` varchar(20) DEFAULT NULL,
  `work_location_id` int(10) DEFAULT NULL,
  `otp_code` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of um_users
-- ----------------------------
INSERT INTO `um_users` VALUES ('1', 'admin@gmail.com', '01257890', null, '$2y$10$9s0nFmOKK6xEc8c63nT7KeQSGb4UoUio39dTBoQKrArZ3TlRh7LYK', '2021-09-12 17:00:26.003673', 'DFB15FKAEEC611EG2E7C9801A7CXD1HK', null, '1', 'Admin', '0', 'active', 'Samsethy', null, 'admin_support', 'admin@gmail.com', '3', '2021-09-12 17:00:26.003673', '0001', null, null);
INSERT INTO `um_users` VALUES ('16', '012567677', '02346567', 'ddgmailcom', '$2y$10$8/thDTlCF/L.ahg6jWPB2OgSY5CxwkzL9upccAEYzzxLsNJep/6le', '2021-12-01 19:03:26.262506', '38DC051E122D11EC89909801A7B0D1FCH', null, '1', 'Standard', '0', 'active', 'SOME STORE NAME', '1', 'merchant', 'admin@gmail.com', '1', '2021-12-01 19:03:26.262506', '00001', null, null);
INSERT INTO `um_users` VALUES ('17', '0967174940', '0967174940', 'lyhuot@gmail.com', '$2y$10$riWHu0z/MKVrWk7/aA0YFOMsHfvXNRWnpYl9yFZVl0Hc3r8zVR.9C', '2021-12-01 18:50:36.053668', '38DC051E122D11EC89909801A7B0D1FCH', null, '1', 'Standard', '0', 'active', 'Ly Huot', '5', 'merchant', 'admin@gmail.com', '1', '2021-12-01 18:50:36.053668', '0000005', null, null);
INSERT INTO `um_users` VALUES ('30', '012567878', '012567878', null, '$2y$10$YF4bIIm.3DGrnFziV975a.bgwtIk7YNGAcGXjgVPci4L/LoeoGVWW', '2021-10-20 02:22:13.911183', '38DC051E122D11EC89909801A7B0D1FCH', null, '1', 'Standard', '0', 'active', 'Samsethy', '9', 'merchant', 'admin@gmail.com', '1', '2021-10-20 02:22:13.911183', 'BRS10004', null, null);
INSERT INTO `um_users` VALUES ('31', 'Puthea', null, null, '$2y$10$NXj3hX33srN9UB5/MhPf9./L6tkOdiMMcdVRSIdLh8giY4LSHxAcq', '2021-11-27 15:33:18.183871', 'DFB15FKAEEC611EG2E7C9801A7CXD1HK', null, '1', 'Standard', '0', 'active', 'Chunheng', null, 'admin_support', 'admin@gmail.com', '1', '2021-11-27 15:33:18.183871', null, null, null);
INSERT INTO `um_users` VALUES ('32', 'sopha', null, null, '$2y$10$FLYjDz2HxEkWcPGsiIZH5OUtiaWbb6HvQwMd9S8aiPWZLxQAMxj2W', null, 'DFB15FKAEEC611EG2E7C9801A7CXD1HK', null, '1', 'Standard', '0', 'active', 'sopha', null, 'admin_support', 'chunheng', '31', '2021-11-05 11:53:29.000000', null, null, null);
INSERT INTO `um_users` VALUES ('35', '081802428', '081802428', null, '$2y$10$pKjvxuQprUMqXQa/L7.piOelfVBB.5..NPoP1kspgElXrw0qcZkrm', '2021-12-07 14:14:16.287757', '584C7FF2122D11EC89909801A8B0D7XKD', null, '1', 'Standard', '0', 'active', 'Phoeun Sopha', '28', 'driver', 'admin@gmail.com', '1', '2021-12-07 14:14:16.287757', '10002', null, null);
INSERT INTO `um_users` VALUES ('37', '012555771', '012555771', null, '$2y$10$z8yka7MYeOlmGthsN59PO.9Dyh1t/ZIrwmAquP2lODx3zorRGInja', '2021-12-02 07:29:21.458657', '38DC051E122D11EC89909801A7B0D1FCH', null, '1', 'standard', '0', 'active', 'ABC Bakery', '43', 'merchant', 'self register', null, '2021-12-02 07:29:21.458657', '10011', null, null);
INSERT INTO `um_users` VALUES ('38', '016 285 878', '016 285 878', null, '$2y$10$HL/JNrSxS24rgQTxR74Cr.MfrLuAv.UHLEMVXzaDXoPjh5tXpjuFi', null, '38DC051E122D11EC89909801A7B0D1FCH', null, '1', 'Standard', '0', 'active', 'Rattana Hak', '37', 'merchant', 'admin@gmail.com', '1', '2021-11-29 16:38:28.000000', '10005', null, null);
INSERT INTO `um_users` VALUES ('39', '012555666', '012555666', 'bopha@gmail.com', '$2y$10$L1HELwh4lJBVl7Rynj.dzOhNSL5XXslShaFxddWc6qFLI7eFlHMFq', null, '38DC051E122D11EC89909801A7B0D1FCH', null, '1', 'standard', '0', 'active', 'Bopha', '44', 'merchant', 'self register', null, '2021-12-02 08:06:30.000000', '10012', null, '55');
INSERT INTO `um_users` VALUES ('40', '066999988', '066999988', 'benee@gmail.com', '$2y$10$Hw.8oeLSr/QfX7brPCHwF.o0KbpFpWrpq03I3Vt2fGm9p8ee18ZHq', null, '38DC051E122D11EC89909801A7B0D1FCH', null, '1', 'standard', '0', 'active', 'Benee', '45', 'merchant', 'self register', null, '2021-12-02 08:08:33.000000', '10013', null, '69');
INSERT INTO `um_users` VALUES ('41', 'samsethy', null, null, '$2y$10$ke.nm3SaAKQKawZZ1Bqtr.JQwE2Nw4qxnFIKUg5Pg/GvJQzh82yau', null, 'DFB15FKAEEC611EG2E7C9801A7CXD1HK', null, '1', 'Standard', '0', 'active', 'samsethy', null, 'admin_support', 'admin@gmail.com', '1', '2021-12-03 23:15:16.000000', null, null, null);
INSERT INTO `um_users` VALUES ('42', '+855967174940', '+855967174940', 'jackie@bro.com', '$2y$10$jvIm8W8ULtSmnuuKwUgIeeEMJBte2JQ70iUhVbEkZpZlJcw5jHxoG', null, '38DC051E122D11EC89909801A7B0D1FCH', null, '1', 'standard', '0', 'active', 'Jackie', '46', 'merchant', 'self register', null, '2021-12-06 16:41:45.000000', '10014', null, '80');
INSERT INTO `um_users` VALUES ('45', '011657985', '011657985', null, '$2y$10$5iLt38YMxuarsMFU.cnQQuKHFe4iU7GhQQMNyKtn6uFVwUBExs3Aq', null, '38DC051E122D11EC89909801A7B0D1FCH', null, '1', 'standard', '0', 'active', 'Lim Vannak', '49', 'merchant', 'self register', null, '2021-12-06 15:01:32.000000', '10017', null, '437088');
INSERT INTO `um_users` VALUES ('61', '010428632', '010428632', null, '$2y$10$uiPp29Een5Nv2FQ9hoD5jex6A.UT.G3xB5R0khKSeWVnVSxThUAgy', '2021-12-06 16:41:44.231042', '38DC051E122D11EC89909801A7B0D1FCH', null, '1', 'standard', '0', 'active', 'ME', '65', 'merchant', 'self register', null, '2021-12-06 16:41:44.231042', '10033', null, null);

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
-- Table structure for `vehicle_type`
-- ----------------------------
DROP TABLE IF EXISTS `vehicle_type`;
CREATE TABLE `vehicle_type` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `code` varchar(10) DEFAULT NULL,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `branch_id` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of vehicle_type
-- ----------------------------
INSERT INTO `vehicle_type` VALUES ('1', 'motobike', 'Moto', '1');
INSERT INTO `vehicle_type` VALUES ('2', 'tuktuk', 'TUK TUK', '1');

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
  `create_date` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `description` varchar(150) DEFAULT NULL,
  `fast_price` decimal(10,2) DEFAULT NULL,
  `normal_price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=153 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of zones
-- ----------------------------
INSERT INTO `zones` VALUES ('57', '1', 'A1', 'ទន្លេបាសាក់', '14', '13', '37', '57', '0.00', 'Local', 'Puthea', '2021-11-22 22:37:14.000000', null, null, null);
INSERT INTO `zones` VALUES ('58', '1', 'A2', 'បឹងកេងកងទី ១', '14', '13', '37', '58', '0.00', 'Local', 'Puthea', '2021-11-22 22:55:51.000000', null, null, null);
INSERT INTO `zones` VALUES ('59', '1', 'A3', 'បឹងកេងកងទី ២', '14', '13', '37', '59', '0.00', 'Local', 'Puthea', '2021-11-22 22:57:56.000000', null, null, null);
INSERT INTO `zones` VALUES ('60', '1', 'A4', 'បឹងកេងកងទី ៣', '14', '13', '37', '60', '0.00', 'Local', 'Puthea', '2021-11-22 22:59:23.000000', null, null, null);
INSERT INTO `zones` VALUES ('61', '1', 'A5', 'អូឡាំពិក', '14', '13', '37', '61', '0.00', 'Local', 'Puthea', '2021-11-22 23:00:59.000000', null, null, null);
INSERT INTO `zones` VALUES ('62', '1', 'A6', 'ទួលស្វាយព្រៃទី ១', '14', '13', '37', '62', '0.00', 'Local', 'Puthea', '2021-11-22 23:05:19.000000', null, null, null);
INSERT INTO `zones` VALUES ('63', '1', 'A7', 'ទួលស្វាយព្រៃទី ២', '14', '13', '37', '59', '0.00', 'Local', 'Puthea', '2021-11-22 23:07:16.000000', null, null, null);
INSERT INTO `zones` VALUES ('64', '1', 'A8', 'ទំនប់ទឹក', '14', '13', '37', '64', '0.00', 'Local', 'Puthea', '2021-11-22 23:08:10.000000', null, null, null);
INSERT INTO `zones` VALUES ('65', '1', 'A9', 'ទួលទំពូងទី២', '14', '13', '37', '65', '0.00', 'Local', 'Puthea', '2021-11-22 23:11:09.000000', null, null, null);
INSERT INTO `zones` VALUES ('66', '1', 'A10', 'ទួលទំពូងទី១', '14', '13', '37', '66', '0.00', 'Local', 'Puthea', '2021-11-22 23:13:21.000000', null, null, null);
INSERT INTO `zones` VALUES ('67', '1', 'A11', 'បឹងត្របែក', '14', '13', '37', '67', '0.00', 'Local', 'Puthea', '2021-11-22 23:14:50.000000', null, null, null);
INSERT INTO `zones` VALUES ('70', '1', 'A12', 'ផ្សាដើមថ្កូវ', '14', '13', '37', '68', '0.00', 'Local', 'Puthea', '2021-11-23 11:07:39.000000', null, null, null);
INSERT INTO `zones` VALUES ('71', '1', 'B1', 'ដង្កោ', '14', '13', '38', '69', '0.00', 'Local', 'Puthea', '2021-11-23 12:15:28.000000', null, null, null);
INSERT INTO `zones` VALUES ('72', '1', 'C1', 'ពងទឹក', '14', '13', '38', '70', '0.00', 'Local', 'Puthea', '2021-11-23 12:16:19.000000', null, null, null);
INSERT INTO `zones` VALUES ('73', '1', 'C2', 'ព្រៃវែង', '14', '13', '38', '71', '0.00', 'Local', 'Puthea', '2021-11-23 12:17:14.000000', null, null, null);
INSERT INTO `zones` VALUES ('74', '1', 'C3', 'ព្រៃស', '14', '13', '38', '72', '0.00', 'Local', 'Puthea', '2021-11-23 12:18:03.000000', null, null, null);
INSERT INTO `zones` VALUES ('75', '1', 'C4', 'ក្រាំងពង្រ', '14', '13', '38', '73', '0.00', 'Local', 'Puthea', '2021-11-23 12:19:26.000000', null, null, null);
INSERT INTO `zones` VALUES ('76', '1', 'C5', 'ប្រទះឡាង', '14', '13', '38', '74', '0.00', 'Local', 'Puthea', '2021-11-23 12:20:37.000000', null, null, null);
INSERT INTO `zones` VALUES ('77', '1', 'C6', 'សាក់សំពៅ', '14', '13', '38', '75', '0.00', 'Local', 'Puthea', '2021-11-23 12:21:35.000000', null, null, null);
INSERT INTO `zones` VALUES ('78', '1', 'A13', 'ជយ័ជំនះ', '14', '13', '38', '76', '0.00', 'Local', 'Puthea', '2021-11-23 12:28:00.000000', null, null, null);
INSERT INTO `zones` VALUES ('79', '1', 'A14', 'ផ្សាចាស់', '14', '13', '38', '77', '0.00', 'Local', 'Puthea', '2021-11-23 12:28:57.000000', null, null, null);
INSERT INTO `zones` VALUES ('80', '1', 'A15', 'ស្រះចក', '14', '13', '38', '147', '0.00', 'Local', 'Puthea', '2021-11-23 12:29:47.000000', null, null, null);
INSERT INTO `zones` VALUES ('81', '1', 'A16', 'វត្តភ្នំ', '14', '13', '38', '78', '0.00', 'Local', 'Puthea', '2021-11-23 12:30:30.000000', null, null, null);
INSERT INTO `zones` VALUES ('82', '1', 'A17', 'ផ្សាដេប៉ូទី១', '14', '13', '39', '79', '0.00', 'Local', 'Puthea', '2021-11-23 12:34:38.000000', null, null, null);
INSERT INTO `zones` VALUES ('83', '1', 'A18', 'ផ្សាដេប៉ូទី២', '14', '13', '39', '80', '0.00', 'Local', 'Puthea', '2021-11-23 12:37:08.000000', null, null, null);
INSERT INTO `zones` VALUES ('84', '1', 'A19', 'ផ្សាដេប៉ូទី៣', '14', '13', '39', '81', '0.00', 'Local', 'Puthea', '2021-11-23 12:38:56.000000', null, null, null);
INSERT INTO `zones` VALUES ('85', '1', 'A20', 'ទឹកល្អក់ទី១', '14', '13', '39', '82', '0.00', 'Local', 'Puthea', '2021-11-23 12:39:51.000000', null, null, null);
INSERT INTO `zones` VALUES ('86', '1', 'A21', 'ទឹកល្អក់ទី២', '14', '13', '39', '83', '0.00', 'Local', 'Puthea', '2021-11-23 12:43:42.000000', null, null, null);
INSERT INTO `zones` VALUES ('87', '1', 'A22', 'ទឹកល្អក់ទី៣', '14', '13', '39', '84', '0.00', 'Local', 'Puthea', '2021-11-23 12:45:01.000000', null, null, null);
INSERT INTO `zones` VALUES ('88', '1', 'B2', 'បឹងកក់ទី១', '14', '13', '39', '85', '0.00', 'Local', 'Puthea', '2021-11-23 12:59:08.000000', null, null, null);
INSERT INTO `zones` VALUES ('89', '1', 'B3', 'ជើងអែក', '14', '13', '39', '86', '0.00', 'Local', 'Puthea', '2021-11-23 13:00:04.000000', null, null, null);
INSERT INTO `zones` VALUES ('90', '1', 'B4', 'គងនយ', '14', '13', '39', '87', '0.00', 'Local', 'Puthea', '2021-11-23 13:01:02.000000', null, null, null);
INSERT INTO `zones` VALUES ('91', '1', 'B5', 'ព្រែកកំពឹស', '14', '13', '39', '88', '0.00', 'Local', 'Puthea', '2021-11-23 13:01:47.000000', null, null, null);
INSERT INTO `zones` VALUES ('92', '1', 'B6', 'រលួស', '14', '13', '39', '89', '0.00', 'Local', 'Puthea', '2021-11-23 13:02:59.000000', null, null, null);
INSERT INTO `zones` VALUES ('93', '1', 'B7', 'ស្ពានថ្ម', '14', '13', '39', '90', '0.00', 'Local', 'Puthea', '2021-11-23 13:03:56.000000', null, null, null);
INSERT INTO `zones` VALUES ('94', '1', 'B8', 'ទៀន', '14', '13', '39', '91', '0.00', 'Local', 'Puthea', '2021-11-23 13:05:12.000000', null, null, null);
INSERT INTO `zones` VALUES ('95', '1', 'A23', 'អូឬស្សីទី១', '14', '13', '40', '92', '0.00', 'Local', 'Puthea', '2021-11-23 13:23:12.000000', null, null, null);
INSERT INTO `zones` VALUES ('96', '1', 'A24', 'អូឬស្សីទី២', '14', '13', '40', '148', '0.00', 'Local', 'Puthea', '2021-11-23 13:23:49.000000', null, null, null);
INSERT INTO `zones` VALUES ('97', '1', 'A25', 'អូឬស្សីទី៣', '14', '13', '40', '93', '0.00', 'Local', 'Puthea', '2021-11-23 13:25:32.000000', null, null, null);
INSERT INTO `zones` VALUES ('98', '1', 'A26', 'អូឬស្សីទី៤', '14', '13', '40', '93', '0.00', 'Local', 'Puthea', '2021-11-23 13:26:19.000000', null, null, null);
INSERT INTO `zones` VALUES ('99', '1', 'A27', 'មនោរម្យ', '14', '13', '40', '95', '0.00', 'Local', 'Puthea', '2021-11-23 13:27:08.000000', null, null, null);
INSERT INTO `zones` VALUES ('100', '1', 'A28', 'មិត្តភាព', '14', '13', '40', '96', '0.00', 'Local', 'Puthea', '2021-11-23 13:27:43.000000', null, null, null);
INSERT INTO `zones` VALUES ('101', '1', 'A29', 'វាលវង់', '14', '13', '40', '97', '0.00', 'Local', 'Puthea', '2021-11-23 13:28:26.000000', null, null, null);
INSERT INTO `zones` VALUES ('102', '1', 'A30', 'បឹងព្រលិត', '14', '13', '40', '98', '0.00', 'Local', 'Puthea', '2021-11-23 13:29:02.000000', null, null, null);
INSERT INTO `zones` VALUES ('103', '1', 'B9', 'ទួលសង្កែ', '14', '13', '41', '99', '0.00', 'Local', 'Puthea', '2021-11-23 13:30:41.000000', null, null, null);
INSERT INTO `zones` VALUES ('104', '1', 'C7', 'ស្វាយប៉ាក', '14', '13', '41', '100', '0.00', 'Local', 'Puthea', '2021-11-23 13:46:06.000000', null, null, null);
INSERT INTO `zones` VALUES ('105', '1', 'C8', 'គីឡូម៉ែតលេខ៦', '14', '13', '41', '101', '0.00', 'Local', 'Puthea', '2021-11-23 13:46:57.000000', null, null, null);
INSERT INTO `zones` VALUES ('106', '1', 'C9', 'ឬស្សីកែង', '14', '13', '41', '102', '0.00', 'Local', 'Puthea', '2021-11-23 13:47:40.000000', null, null, null);
INSERT INTO `zones` VALUES ('107', '1', 'C10', 'ច្រាំងចំរេះទី១', '14', '13', '41', '103', '0.00', 'Local', 'Puthea', '2021-11-23 13:48:35.000000', null, null, null);
INSERT INTO `zones` VALUES ('108', '1', 'C11', 'ច្រាំងចំរេះទី២', '14', '13', '41', '104', '0.00', 'Local', 'Puthea', '2021-11-23 13:49:25.000000', null, null, null);
INSERT INTO `zones` VALUES ('109', '1', 'C12', 'ភ្នំពេញថ្មី', '14', '13', '42', '105', '0.00', 'Local', 'Puthea', '2021-11-23 13:50:20.000000', null, null, null);
INSERT INTO `zones` VALUES ('110', '1', 'C13', 'ទឹកថ្លា', '14', '13', '42', '106', '0.00', 'Local', 'Puthea', '2021-11-23 13:51:31.000000', null, null, null);
INSERT INTO `zones` VALUES ('111', '1', 'C14', 'ឈ្នួល', '14', '13', '42', '107', '0.00', 'Local', 'Puthea', '2021-11-23 13:52:13.000000', null, null, null);
INSERT INTO `zones` VALUES ('112', '1', 'C15', 'ក្រាំងថ្នង់', '14', '13', '42', '108', '0.00', 'Local', 'Puthea', '2021-11-23 13:52:59.000000', null, null, null);
INSERT INTO `zones` VALUES ('113', '1', 'C16', 'ត្រពាំងក្រសាំង', '14', '13', '43', '109', '0.00', 'Local', 'Puthea', '2021-11-23 13:58:03.000000', null, null, null);
INSERT INTO `zones` VALUES ('114', '1', 'C17', 'ភ្លើងឆេះរទិះ', '14', '13', '43', '110', '0.00', 'Local', 'Puthea', '2021-11-23 13:58:44.000000', null, null, null);
INSERT INTO `zones` VALUES ('115', '1', 'C18', 'ចោមចៅ', '14', '13', '43', '111', '0.00', 'Local', 'Puthea', '2021-11-23 13:59:24.000000', null, null, null);
INSERT INTO `zones` VALUES ('116', '1', 'C19', 'កាកាប', '14', '13', '43', '112', '0.00', 'Local', 'Puthea', '2021-11-23 14:00:19.000000', null, null, null);
INSERT INTO `zones` VALUES ('117', '1', 'C20', 'សំរោងក្រោម', '14', '13', '43', '113', '0.00', 'Local', 'Puthea', '2021-11-23 14:01:05.000000', null, null, null);
INSERT INTO `zones` VALUES ('118', '1', 'C21', 'បឹងធំ', '14', '13', '43', '114', '0.00', 'Local', 'Puthea', '2021-11-23 14:02:18.000000', null, null, null);
INSERT INTO `zones` VALUES ('119', '1', 'C22', 'កំបូល', '14', '13', '43', '115', '0.00', 'Local', 'Puthea', '2021-11-23 14:02:57.000000', null, null, null);
INSERT INTO `zones` VALUES ('120', '1', 'C23', 'កន្ទោក', '14', '13', '43', '116', '0.00', 'Local', 'Puthea', '2021-11-23 14:03:33.000000', null, null, null);
INSERT INTO `zones` VALUES ('121', '1', 'C24', 'ឪឡោក', '14', '13', '43', '117', '0.00', 'Local', 'Puthea', '2021-11-23 14:04:13.000000', null, null, null);
INSERT INTO `zones` VALUES ('122', '1', 'C25', 'ស្នើរ', '14', '13', '43', '118', '0.00', 'Local', 'Puthea', '2021-11-23 14:04:47.000000', null, null, null);
INSERT INTO `zones` VALUES ('123', '1', 'C26', 'ព្រែកភ្នៅ', '14', '13', '44', '119', '0.00', 'Local', 'Puthea', '2021-11-23 14:21:42.000000', null, null, null);
INSERT INTO `zones` VALUES ('124', '1', 'C27', 'ពញាពន់', '14', '13', '44', '120', '0.00', 'Local', 'Puthea', '2021-11-23 14:23:10.000000', null, null, null);
INSERT INTO `zones` VALUES ('125', '1', 'C28', 'សំរោង', '14', '13', '44', '121', '0.00', 'Local', 'Puthea', '2021-11-23 14:33:22.000000', null, null, null);
INSERT INTO `zones` VALUES ('126', '1', 'C29', 'គោករកា', '14', '13', '44', '122', '0.00', 'Local', 'Puthea', '2021-11-23 14:34:15.000000', null, null, null);
INSERT INTO `zones` VALUES ('127', '1', 'C30', 'កន្សែង', '14', '13', '44', '123', '0.00', 'Local', 'Puthea', '2021-11-23 14:34:45.000000', null, null, null);
INSERT INTO `zones` VALUES ('128', '1', 'A31', 'ផ្សារថ្មីទី១', '14', '13', '45', '124', '0.00', 'Local', 'Puthea', '2021-11-23 14:47:29.000000', null, null, null);
INSERT INTO `zones` VALUES ('129', '1', 'A32', 'ផ្សារថ្មីទី២', '14', '13', '45', '125', '0.00', 'Local', 'Puthea', '2021-11-23 14:49:33.000000', null, null, null);
INSERT INTO `zones` VALUES ('130', '1', 'A33', 'ផ្សារថ្មីទី៣', '14', '13', '45', '126', '0.00', 'Local', 'Puthea', '2021-11-23 14:50:21.000000', null, null, null);
INSERT INTO `zones` VALUES ('131', '1', 'A34', 'បឹងរាំង', '14', '13', '45', '127', '0.00', 'Local', 'Puthea', '2021-11-23 14:52:56.000000', null, null, null);
INSERT INTO `zones` VALUES ('132', '1', 'A35', 'ផ្សាកណ្ដាលទី១', '14', '13', '45', '128', '0.00', 'Local', 'Puthea', '2021-11-23 14:54:17.000000', null, null, null);
INSERT INTO `zones` VALUES ('133', '1', 'A36', 'ផ្សាកណ្ដាលទី២', '14', '13', '45', '129', '0.00', 'Local', 'Puthea', '2021-11-23 14:55:23.000000', null, null, null);
INSERT INTO `zones` VALUES ('134', '1', 'A37', 'ចតុមុខ', '14', '13', '45', '130', '0.00', 'Local', 'Puthea', '2021-11-23 14:56:46.000000', null, null, null);
INSERT INTO `zones` VALUES ('135', '1', 'A38', 'ស្ទឹងមានជយ័', '14', '13', '46', '131', '0.00', 'Local', 'Puthea', '2021-11-23 14:59:43.000000', null, null, null);
INSERT INTO `zones` VALUES ('136', '1', 'A39', 'បឹងទំពុន', '14', '13', '46', '132', '0.00', 'Local', 'Puthea', '2021-11-23 15:00:30.000000', null, null, null);
INSERT INTO `zones` VALUES ('137', '1', 'B10', 'ចាក់អង្រែលើ', '14', '13', '46', '133', '0.00', 'Local', 'Puthea', '2021-11-23 15:01:31.000000', null, null, null);
INSERT INTO `zones` VALUES ('138', '1', 'B11', 'ចាក់អង្រែក្រោម', '14', '13', '46', '134', '0.00', 'Local', 'Puthea', '2021-11-23 15:02:23.000000', null, null, null);
INSERT INTO `zones` VALUES ('140', '1', 'C31', 'ជ្រោយចង្វារ', '14', '13', '47', '150', '0.00', 'Local', 'Puthea', '2021-11-23 15:23:03.000000', null, null, null);
INSERT INTO `zones` VALUES ('141', '1', 'C32', 'ព្រែកលាប', '14', '13', '47', '136', '0.00', 'Local', 'Puthea', '2021-11-23 15:23:57.000000', null, null, null);
INSERT INTO `zones` VALUES ('142', '1', 'C33', 'ព្រែកតាសេក', '14', '13', '47', '137', '0.00', 'Local', 'Puthea', '2021-11-23 15:24:57.000000', null, null, null);
INSERT INTO `zones` VALUES ('143', '1', 'C34', 'កោះដាច់', '14', '13', '47', '138', '0.00', 'Local', 'Puthea', '2021-11-23 15:25:39.000000', null, null, null);
INSERT INTO `zones` VALUES ('144', '1', 'C35', 'បាក់ខែង', '14', '13', '47', '139', '0.00', 'Local', 'Puthea', '2021-11-23 15:28:10.000000', null, null, null);
INSERT INTO `zones` VALUES ('145', '1', 'B12', 'ច្បាអំពៅទី១', '14', '13', '48', '140', '0.00', 'Local', 'Puthea', '2021-11-23 15:29:07.000000', null, null, null);
INSERT INTO `zones` VALUES ('146', '1', 'B13', 'ច្បាអំពៅទី២', '14', '13', '48', '141', '0.00', 'Local', 'Puthea', '2021-11-23 15:29:42.000000', null, null, null);
INSERT INTO `zones` VALUES ('147', '1', 'B14', 'និរោធ', '14', '13', '48', '142', '0.00', 'Local', 'Puthea', '2021-11-23 15:30:27.000000', null, null, null);
INSERT INTO `zones` VALUES ('148', '1', 'C36', 'ព្រែកប្រា', '14', '13', '48', '143', '0.00', 'Local', 'Puthea', '2021-11-23 15:31:10.000000', null, null, null);
INSERT INTO `zones` VALUES ('149', '1', 'C37', 'វាលស្បូវ', '14', '13', '48', '144', '0.00', 'Local', 'Puthea', '2021-11-23 15:31:50.000000', null, null, null);
INSERT INTO `zones` VALUES ('150', '1', 'C38', 'ព្រែកអែង', '14', '13', '48', '145', '0.00', 'Local', 'Puthea', '2021-11-23 15:32:29.000000', null, null, null);
INSERT INTO `zones` VALUES ('151', '1', 'C39', 'ក្បាលកោះ', '14', '13', '48', '146', '0.00', 'Local', 'Puthea', '2021-11-23 15:33:04.000000', null, null, null);
INSERT INTO `zones` VALUES ('152', '1', 'C40', 'ព្រែកថ្មី', '14', '13', '48', '149', '0.00', 'Local', 'Puthea', '2021-11-23 15:33:51.000000', null, null, null);

-- ----------------------------
-- Function structure for `encode_email`
-- ----------------------------
DROP FUNCTION IF EXISTS `encode_email`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `encode_email`(email varchar(100)) RETURNS varchar(100) CHARSET utf8
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
CREATE DEFINER=`root`@`localhost` FUNCTION `encode_time`(mTime varchar(25)) RETURNS varchar(25) CHARSET utf8
BEGIN
 return replace(mTime,':','&U09;');
END
;;
DELIMITER ;

-- ----------------------------
-- Function structure for `kg_within`
-- ----------------------------
DROP FUNCTION IF EXISTS `kg_within`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `kg_within`(lower_kg decimal(10,2), upper_kg decimal(10,2), this_kg decimal(10,2)) RETURNS tinyint(4)
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
