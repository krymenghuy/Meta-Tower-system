SET @app_id = 'DXM20FKAEFC711EH2E7C9801A7BZD311';
SET @app_name ='DMS';
SET @app_name_kh ='DMS';

SET @mobile1_app_id ='ZAM20FKAEFC722EH2E7M9801B7BZD899';
SET @mobile1_app_name ='Parent App';
SET @mobile1_app_name_kh ='Parent App';

SET @mobile2_app_id ='584C7FF2122D11EC89909801A8B0D7XKD';
SET @mobile2_app_name ='Student App';
SET @mobile2_app_name_kh ='Student App';

SET @first_subscriber_name ='KSM';
SET @subscriber_contact_person_name ='leng';

DROP TABLE IF EXISTS `um_applications`;
CREATE TABLE `um_applications` (
  `app_id` varchar(50) NOT NULL,
  `name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `um_applications` VALUES (@app_id, @app_name);

INSERT INTO `um_applications` VALUES (@mobile1_app_id, @mobile1_app_name);
INSERT INTO `um_applications` VALUES (@mobile2_app_id, @mobile2_app_name);

## Create um_branches 
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

INSERT INTO `um_branches` VALUES ('1', @first_subscriber_name, @first_subscriber_name,NULL, 'png', '#458 Street 24BT Sangkat Boeung Tompon Khan Meanchey Phnom Penh Cambodia', '012222333', @subscriber_contact_person_name, null, null, null, null, null, null, 'ផ្ទះលេខ៤៥៨ ផ្លូវ២៤BT សង្កាត់បឹងទំពន់ ខណ្ឌមានជ័យ រាធធានីភ្នំពេញ', 'infopucedukh', '', '2022-05-11 14:30:08.139686', NULL);

#Create um_user
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
  `is_system_admin` TINYINT default 0,
  `lang` varchar(15) DEFAULT 'en',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

INSERT INTO `um_users` VALUES ('1', 'admin@gmail.com', '01257890', null, '$2y$10$9s0nFmOKK6xEc8c63nT7KeQSGb4UoUio39dTBoQKrArZ3TlRh7LYK', '2022-04-27 09:22:49.732640', @app_id, null, '1', 'Admin', '0', 'active', 'Samsethy', null, 'admin', 'admin@gmail.com', '3', '2021-09-13 04:00:26', '0001', null, null,'en');

##crate um_app_modules
DROP TABLE IF EXISTS `um_app_modules`;
CREATE TABLE `um_app_modules` (
  `id` int(10) NOT NULL,
  `parent_mod_id` INT(10) NULL,
  `app_id` varchar(50) DEFAULT NULL,
  `ref_code` varchar(20) DEFAULT '',
  `module_name` varchar(150) NOT NULL,
  `module_name_native` varchar(150) DEFAULT NULL,
  `icon_image` varchar(100) DEFAULT '',
  `target_url` varchar(150) DEFAULT NULL,
  `hidden` tinyint(6) NOT NULL DEFAULT 0,
  `disabled` tinyint(6) NOT NULL DEFAULT 0,
  `display_order` int(10) DEFAULT 0,
  `branch_id` int(10) NULL default 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=333 DEFAULT CHARSET=utf8;

INSERT INTO `um_app_modules` VALUES ('100',0, @app_id, 'UMT', 'User Management', 'User Management', 'user.png', '', '0', '0', '1', '0');
INSERT INTO `um_app_modules` VALUES ('101',0, @app_id, 'RMT', 'Role Management', 'Role Management', '', null, '0', '0', null, '0');
INSERT INTO `um_app_modules` VALUES ('102',0, @app_id, 'DRM', 'Location Management', 'Locations', 'shop.png', '', '0', '0', '6', '0');
INSERT INTO `um_app_modules` VALUES ('103',0, @app_id, 'SETTINGS', 'Settings', 'Settings', 'settings.png', '', '1', '0', '8', '0');
INSERT INTO `um_app_modules` VALUES ('104',0, @app_id, 'MSETTINGS', 'Mobile Settings', 'Mobile Settings', 'users.png', '', '1', '0', '7', '0');
INSERT INTO `um_app_modules` VALUES ('105',0, @app_id, 'COM', 'Company Profile', 'Company Profile', '', null, '0', '0', null, '0');
INSERT INTO `um_app_modules` VALUES ('106',0, @app_id, 'BIMG', 'Brand Images', 'Brand Images', '', null, '0', '0', null, '0');

#create table um_role_modules
DROP TABLE IF EXISTS `um_role_modules`;
CREATE TABLE `um_role_modules` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `role_id` int(10) NOT NULL,
  `module_id` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8;

INSERT INTO `um_role_modules` (role_id,module_id) VALUES (1,100);
INSERT INTO `um_role_modules` (role_id,module_id) VALUES (1,101);
INSERT INTO `um_role_modules` (role_id,module_id) VALUES (1,102);
INSERT INTO `um_role_modules` (role_id,module_id) VALUES (1,103);
INSERT INTO `um_role_modules` (role_id,module_id) VALUES (1,104);
INSERT INTO `um_role_modules` (role_id,module_id) VALUES (1,105);
INSERT INTO `um_role_modules` (role_id,module_id) VALUES (1,106);

## create um_permissions table  
DROP TABLE IF EXISTS `um_permissions`;
CREATE TABLE `um_permissions` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `module_id` int(10) NOT NULL,
  `app_id` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=220 DEFAULT CHARSET=utf8;

INSERT INTO `um_permissions` VALUES ('100', 'Create user', '100', @app_id);
INSERT INTO `um_permissions` VALUES ('101', 'Delete user', '100', @app_id);
INSERT INTO `um_permissions` VALUES ('102', 'Create role', '101', @app_id);
INSERT INTO `um_permissions` VALUES ('103', 'Delete role', '101', @app_id);
INSERT INTO `um_permissions` VALUES ('104', 'Modify role name', '101', @app_id);
insert into  `um_permissions`  VALUES(105,'Add or remove user permissions',101,@app_id);
insert into  `um_permissions`  VALUES(106,'Set User Status as Active or Inactive',100,@app_id);
insert into  `um_permissions`  VALUES(107,'Add role members',101,@app_id);
insert into  `um_permissions`  VALUES(108,'Delete role members',101,@app_id);
insert into  `um_permissions`  VALUES(109,'Reset user password',100,@app_id);
insert into  `um_permissions`  VALUES(110,'Change Login name',100,@app_id);

#create um_role_permissions
DROP TABLE IF EXISTS `um_role_permissions`;
CREATE TABLE `um_role_permissions` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `permission_id` int(10) NOT NULL,
  `role_id` int(10) NOT NULL,
  `branch_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=243 DEFAULT CHARSET=utf8;

INSERT INTO `um_role_permissions` VALUES ('1','100', '1', '1');
INSERT INTO `um_role_permissions` VALUES ('2','101', '1', '2');
INSERT INTO `um_role_permissions` VALUES ('3','102', '1', '2');
INSERT INTO `um_role_permissions` VALUES ('4','103', '1', '2');
INSERT INTO `um_role_permissions` VALUES ('5','104', '1', '2');

#create table um_roles

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

INSERT INTO `um_roles` VALUES (@app_id, '1', 'Super Admin', '1', null, '2021-09-11 09:54:38', 'superadmin');
INSERT INTO `um_roles` VALUES (@app_id, '2', 'Admin', '1', null, '2021-09-11 09:52:44', 'Admin');

#create um_user_role table
DROP TABLE IF EXISTS `um_user_roles`;
CREATE TABLE `um_user_roles` (
  `user_id` int(10) NOT NULL,
  `role_id` int(10) NOT NULL,
  `app_id` varchar(50) NOT NULL,
  `is_primary_role` TINYINT NOT NULL DEFAULT 0,
  `branch_id` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `um_user_roles` VALUES ('1', '1', @app_id, 0,'1');
 

#create work location table
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
   PRIMARY KEY (`id`),
  `lang` varchar(50) DEFAULT 'en'
) ENGINE=InnoDB AUTO_INCREMENT=1342 DEFAULT CHARSET=utf8;

