 
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
) ENGINE=InnoDB AUTO_INCREMENT=2004 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of um_sessions
-- ----------------------------
INSERT INTO `um_sessions` VALUES ('1840', '1', 'DXM20FKAEFC711EH2E7C9801A7BZD311', 'Bory', '2', '2023-02-02 11:04:47', '2023-02-02 11:04:47', 'TWY286rzc1Oucpp07znsiww3n89D8dF5UkwK8P', 'ukswNQRSy9ek72svrQlPHIs8RGQu68D3oMXCJ8', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpaXMiOm51bGwsImF1ZCI6bnVsbCwiaWF0IjoxNjc1MzEwNjg3LCJuYmYiOjE2NzUzMTA2ODcsImV4cCI6MTY3NTMxNDI4NywibGFuZyI6ImVuIiwiaWQiOjIsInVzZXJfY2xhc3MiOiJhZG1pbiIsIm9mZmljaWFsX2lkIjpudWxsLCJvZmZpY2lhbF9jb2RlIjpudWxsLCJsb2dpbl9uYW1lIjoiQm9yeSIsImJyYW5jaF9pZCI6MSwiZnVsbF9uYW1lIjoiQm9yeSIsInN0YXR1cyI6ImFjdGl2ZSIsImlzX2xvY2tlZCI6MCwiZW1haWwiOm51bGwsInBob25lX251bWJlciI6bnVsbCwib3RwX2NvZGUiOm51bGx9.YsJr6g2Lqu2QLmArmZ3-tTLHU7jP2ceDspbDvCXD4Zg', null, 'en');
INSERT INTO `um_sessions` VALUES ('1982', '1', 'DXM20FKAEFC711EH2E7C9801A7BZD311', 'sam', '4', '2023-03-20 19:49:20', '2023-03-20 19:49:20', '203n6I9eh82Ulmi32FAlGOpaNJ2vooN5w634oU', 'S9wjDJs5CWk9Yf1PhM578wndkcaoCx8EHpn9kD', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpaXMiOm51bGwsImF1ZCI6bnVsbCwiaWF0IjoxNjc5MzE2NTYwLCJuYmYiOjE2NzkzMTY1NjAsImV4cCI6MTY3OTMyNzM2MCwibGFuZyI6ImVuIiwiaWQiOjQsInVzZXJfY2xhc3MiOiJhZG1pbiIsIm9mZmljaWFsX2lkIjpudWxsLCJvZmZpY2lhbF9jb2RlIjpudWxsLCJsb2dpbl9uYW1lIjoic2FtIiwiYnJhbmNoX2lkIjoxLCJmdWxsX25hbWUiOiJzYW0iLCJzdGF0dXMiOiJhY3RpdmUiLCJpc19sb2NrZWQiOjAsImVtYWlsIjpudWxsLCJwaG9uZV9udW1iZXIiOm51bGwsIm90cF9jb2RlIjpudWxsfQ.FQBl_5dutCxYYSw8ByBJDeV_a5r4cuoTF5vqm2kCPWk', null, 'en');
INSERT INTO `um_sessions` VALUES ('2003', '1', 'DXM20FKAEFC711EH2E7C9801A7BZD311', 'admin@gmail.com', '1', '2023-04-04 22:33:11', '2023-04-04 22:33:11', 'h8xvaYWXeoR4XNUG5E35CXabQ5er3NPTJJqDUC', 'qsh7w35FhgRZ83jfrZwmQ5ohBtZVy56b3g8n8G', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpaXMiOm51bGwsImF1ZCI6bnVsbCwiaWF0IjoxNjgwNjIyMzkxLCJuYmYiOjE2ODA2MjIzOTEsImV4cCI6MTY4MDY2NjE5MSwibGFuZyI6ImVuIiwiaWQiOjEsInVzZXJfY2xhc3MiOiJhZG1pbiIsIm9mZmljaWFsX2lkIjpudWxsLCJvZmZpY2lhbF9jb2RlIjoiMDAwMSIsImxvZ2luX25hbWUiOiJhZG1pbkBnbWFpbC5jb20iLCJicmFuY2hfaWQiOjEsImZ1bGxfbmFtZSI6IlNhbXNldGh5Iiwic3RhdHVzIjoiYWN0aXZlIiwiaXNfbG9ja2VkIjowLCJlbWFpbCI6bnVsbCwicGhvbmVfbnVtYmVyIjoiMDEyNTc4OTAiLCJvdHBfY29kZSI6bnVsbH0.gYW8TIO3KeAedcBdTD8NrPzZhAo-KXIk4YYRNGvJ2D8', null, 'en');

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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of vendors
-- ----------------------------
INSERT INTO `vendors` VALUES ('1', '1', 'General Vendor', '023767676', null, null, null, null, null, null, null);

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
