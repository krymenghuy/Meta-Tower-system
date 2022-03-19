/*
Navicat MySQL Data Transfer

Source Server         : connection1
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : delivery_db

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2021-10-16 15:22:58
*/

SET FOREIGN_KEY_CHECKS=0;

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
INSERT INTO `sender_code_control` VALUES ('1', '19', 'BRS');
