/*
Navicat MySQL Data Transfer

Source Server         : connection1
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : delivery_db

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2021-10-17 19:52:01
*/

SET FOREIGN_KEY_CHECKS=0;

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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of price_list
-- ----------------------------
INSERT INTO `price_list` VALUES ('1', '0.12', '1.00', '2.20', '2021-10-17', null, '1', 'BKK', '0.99', 'Normal', '0.00', '25', null, 'fixed', 'admin@gmail.com', '2021-10-17 12:13:00.000000');
INSERT INTO `price_list` VALUES ('1', '0.15', '-1.00', '0.00', '2021-10-17', null, '1', 'CHK1', '1.20', 'Fast', '0.00', '31', null, 'per_kg', 'admin@gmail.com', '2021-10-17 12:00:57.000000');
INSERT INTO `price_list` VALUES ('1', '0.15', '-1.00', '0.00', '2021-10-17', null, '1', 'CHK1', '1.20', 'Normal', '0.00', '32', null, 'fixed', 'admin@gmail.com', '2021-10-17 12:01:34.000000');
INSERT INTO `price_list` VALUES ('1', '0.16', '-1.00', '5.00', '2021-10-17', null, '1', 'BKK', '0.00', 'Normal', '0.00', '33', null, 'per_kg', 'admin@gmail.com', '2021-10-17 12:14:34.000000');
INSERT INTO `price_list` VALUES ('1', '0.00', '0.00', '5.00', '2021-10-17', null, '1', 'all', '1.50', 'Normal', '0.00', '34', null, 'fixed', 'admin@gmail.com', '2021-10-17 12:16:23.000000');
INSERT INTO `price_list` VALUES ('1', '0.00', '5.00', '-1.00', '2021-10-17', null, '1', 'all', '2.50', 'Normal', '0.00', '35', null, 'fixed', 'admin@gmail.com', '2021-10-17 12:16:44.000000');
INSERT INTO `price_list` VALUES ('1', '0.00', '-1.00', '5.00', '2021-10-17', null, '1', 'all', '1.80', 'Fast', '0.00', '37', null, 'fixed', 'admin@gmail.com', '2021-10-17 12:18:07.000000');
INSERT INTO `price_list` VALUES ('1', '0.00', '5.00', '-1.00', '2021-10-17', null, '1', 'all', '2.00', 'Fast', '0.00', '38', null, 'fixed', 'admin@gmail.com', '2021-10-17 12:18:48.000000');
