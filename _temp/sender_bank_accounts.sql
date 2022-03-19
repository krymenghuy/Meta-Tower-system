/*
Navicat MySQL Data Transfer

Source Server         : connection1
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : delivery_db

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2021-10-19 19:59:29
*/

SET FOREIGN_KEY_CHECKS=0;

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
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sender_bank_accounts
-- ----------------------------
INSERT INTO `sender_bank_accounts` VALUES ('21', '9', '1', 'ABA', '111', 'DDD', 'admin@gmail.com', '2021-10-19 12:33:58.000000', '1');
INSERT INTO `sender_bank_accounts` VALUES ('22', '9', '1', 'ACLEDA', '0222222', 'KKKK', 'admin@gmail.com', '2021-10-19 12:33:58.000000', '0');
