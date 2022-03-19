/*
Navicat MySQL Data Transfer

Source Server         : connection1
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : delivery_db

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2021-10-17 19:51:50
*/

SET FOREIGN_KEY_CHECKS=0;

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
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sender_price_list
-- ----------------------------
INSERT INTO `sender_price_list` VALUES ('1', '4', '0.00', '0.00', '3.50', 'TTP', '1', '1.50', '0.00', 'Normal', '2021-10-16', null, '1', 'fixed', 'admin@gmail.com', '2021-10-16 17:17:13.000000');
INSERT INTO `sender_price_list` VALUES ('2', '4', '0.00', '0.00', '3.50', 'TTP', '1', '1.50', '0.00', 'Fast', '2021-10-16', null, '1', 'fixed', 'admin@gmail.com', '2021-10-16 17:17:37.000000');
INSERT INTO `sender_price_list` VALUES ('3', '4', '0.00', '0.00', '3.50', 'all', '1', '1.50', '0.00', 'Fast', '2021-10-16', null, '1', 'fixed', 'admin@gmail.com', '2021-10-16 17:18:00.000000');
INSERT INTO `sender_price_list` VALUES ('7', '4', '0.00', '0.00', '3.50', 'BKK', '1', '1.20', '0.00', 'Normal', '2021-10-16', null, '1', 'fixed', 'admin@gmail.com', '2021-10-16 17:49:23.000000');
INSERT INTO `sender_price_list` VALUES ('8', '4', '0.00', '0.00', '3.50', 'BKK', '1', '1.20', '0.00', 'Fast', '2021-10-16', null, '1', 'fixed', 'admin@gmail.com', '2021-10-16 17:52:45.000000');
INSERT INTO `sender_price_list` VALUES ('9', '4', '0.00', '0.00', '3.50', 'BKK', '1', '1.20', '0.00', 'Fast', '2021-10-16', null, '1', 'fixed', 'admin@gmail.com', '2021-10-16 17:53:14.000000');
INSERT INTO `sender_price_list` VALUES ('10', '4', '0.00', '0.00', '3.50', 'BKK', '1', '1.20', '0.00', 'Fast', '2021-10-16', null, '1', 'fixed', 'admin@gmail.com', '2021-10-16 17:53:33.000000');
INSERT INTO `sender_price_list` VALUES ('11', '4', '0.00', '0.00', '3.50', 'BKK', '1', '1.30', '0.00', 'Normal', '2021-10-16', null, '1', 'fixed', 'admin@gmail.com', '2021-10-16 18:05:52.000000');
INSERT INTO `sender_price_list` VALUES ('12', '4', '0.00', '0.00', '3.50', 'all', '1', '1.50', '0.00', 'Fast', '2021-10-16', null, '1', 'fixed', 'admin@gmail.com', '2021-10-16 18:06:28.000000');
INSERT INTO `sender_price_list` VALUES ('13', '4', '0.00', '0.00', '3.50', 'all', '1', '1.50', '0.00', 'Fast', '2021-10-16', null, '1', 'fixed', 'admin@gmail.com', '2021-10-16 18:06:34.000000');
INSERT INTO `sender_price_list` VALUES ('15', '4', '0.00', '0.00', '2.00', 'all', '1', '1.50', '0.00', 'Normal', '2021-10-17', null, '1', 'fixed', 'admin@gmail.com', '2021-10-17 11:56:51.000000');
INSERT INTO `sender_price_list` VALUES ('16', '4', '0.00', '3.50', '8.00', 'all', '1', '2.00', '0.00', 'Normal', '2021-10-17', null, '1', 'fixed', 'admin@gmail.com', '2021-10-17 04:25:09.000000');
INSERT INTO `sender_price_list` VALUES ('17', '4', '0.00', '0.00', '2.00', 'CHK1', '1', '1.50', '0.00', 'Fast', '2021-10-17', null, '1', 'fixed', 'admin@gmail.com', '2021-10-17 06:35:21.000000');
