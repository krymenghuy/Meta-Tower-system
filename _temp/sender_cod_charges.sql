/*
Navicat MySQL Data Transfer

Source Server         : connection1
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : delivery_db

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2021-10-28 17:25:36
*/

SET FOREIGN_KEY_CHECKS=0;

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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sender_cod_charges
-- ----------------------------
INSERT INTO `sender_cod_charges` VALUES ('6', '0.05', '2021-10-28', '2021-10-28', 'chunheng', '2021-10-28 16:41:48.123723', '1', '1', '1', '0', 'sfdgfdg', 'chunheng', '2021-10-28 16:41:48.123723');
INSERT INTO `sender_cod_charges` VALUES ('5', '0.05', '2021-10-28', '2021-10-28', 'chunheng', '2021-10-28 16:41:48.123723', '1', '2', '1', '0', 'fdgdfg', 'chunheng', '2021-10-28 16:41:48.123723');
INSERT INTO `sender_cod_charges` VALUES ('6', '0.02', '2021-10-28', '2021-10-28', 'chunheng', '2021-10-28 16:41:48.123723', '1', '3', '1', '0', 'sdfgfdg', 'chunheng', '2021-10-28 16:41:48.123723');
INSERT INTO `sender_cod_charges` VALUES ('1', '0.03', '2021-10-28', '2021-10-28', 'chunheng', '2021-10-28 16:41:48.123723', '1', '5', '1', '0', 'sdfgfgh', 'chunheng', '2021-10-28 16:41:48.123723');
INSERT INTO `sender_cod_charges` VALUES ('10', '0.03', '2021-10-28', '2021-10-28', 'chunheng', '2021-10-28 16:41:48.123723', '1', '6', '1', '0', 'sdfdg', 'chunheng', '2021-10-28 16:41:48.123723');
INSERT INTO `sender_cod_charges` VALUES ('6', '0.07', '2021-10-28', '2021-10-28', 'chunheng', '2021-10-28 09:45:04.000000', '1', '9', '1', 'Normal', null, 'chunheng', '2021-10-28 09:45:04.000000');
INSERT INTO `sender_cod_charges` VALUES ('10', '0.20', '2021-10-28', '2021-10-28', 'chunheng', '2021-10-28 10:12:30.000000', '1', '15', '1', 'Normal', null, 'chunheng', '2021-10-28 10:12:30.000000');
INSERT INTO `sender_cod_charges` VALUES ('9', '1.00', '2021-10-28', '2021-10-28', 'chunheng', '2021-10-28 10:13:07.000000', '1', '16', '1', 'Normal', null, 'chunheng', '2021-10-28 10:13:07.000000');
