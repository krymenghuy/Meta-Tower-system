/*
Navicat MySQL Data Transfer

Source Server         : connection1
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : delivery_db

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2021-10-20 17:45:07
*/

SET FOREIGN_KEY_CHECKS=0;

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
