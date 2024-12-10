-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Dec 10, 2024 at 01:54 AM
-- Server version: 8.3.0
-- PHP Version: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hr_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
CREATE TABLE IF NOT EXISTS `employees` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `name_kh` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone_number` varchar(12) DEFAULT NULL,
  `sex` varchar(30) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `position_id` int DEFAULT NULL,
  `salary` decimal(10,0) DEFAULT NULL,
  `joining_date` date DEFAULT NULL,
  `nssf_id` varchar(50) DEFAULT NULL,
  `nid` varchar(50) NOT NULL,
  `apply_payroll_tax` tinyint DEFAULT '0' COMMENT '0. tax\r\n1. non tax\r\n',
  `status_id` int NOT NULL COMMENT 'status_id: 10 = Active, 20 =Resigned, 21 = Terminated ',
  `photo_file_name` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `create_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `create_uid` int DEFAULT NULL,
  `update_uid` int DEFAULT NULL,
  `create_user` varchar(50) DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL,
  `branch_id` int DEFAULT NULL,
  `subs_id` blob NOT NULL,
  `code` varchar(11) DEFAULT NULL,
  `work_shift_id` int DEFAULT NULL,
  `emp_type_id` int NOT NULL,
  `marital_status` varchar(35) DEFAULT NULL,
  `spouse_name` varchar(150) DEFAULT NULL,
  `spouse_emp_id` int DEFAULT NULL,
  `spouse_occ_code` varchar(30) DEFAULT NULL,
  `passport_number` varchar(30) DEFAULT NULL,
  `nationality_id` int DEFAULT NULL,
  `birth_country_id` int DEFAULT NULL,
  `birth_city_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `name`, `name_kh`, `email`, `phone_number`, `sex`, `date_of_birth`, `address`, `position_id`, `salary`, `joining_date`, `nssf_id`, `nid`, `apply_payroll_tax`, `status_id`, `photo_file_name`, `created_at`, `updated_at`, `create_date`, `update_date`, `create_uid`, `update_uid`, `create_user`, `update_user`, `branch_id`, `subs_id`, `code`, `work_shift_id`, `emp_type_id`, `marital_status`, `spouse_name`, `spouse_emp_id`, `spouse_occ_code`, `passport_number`, `nationality_id`, `birth_country_id`, `birth_city_id`) VALUES
(1, 'Sok San', 'Sok San', 'soksan@gmail.com', '098765432', 'M', '1990-01-01', 'Cambodia', 1, 10000000, '2024-09-01', '1234567234', '12345678', 0, 10, '0_file_06732d6dec6ac120241112_111134.png', '2024-11-12 04:17:34', '2024-11-12 04:17:34', '2024-11-12 04:17:34', '2024-11-12 04:17:34', 1, 1, 'Admin', 'Admin', 1, 0x1f70f792e749483492d8830538cc77e1, 'LC100015', 1, 3, NULL, NULL, NULL, NULL, NULL, 14, NULL, NULL),
(2, 'Lim Yoona', 'Lim Yoona', 'limyoona@gmail.com', '0912345679', 'F', '1995-02-02', 'Korea', 2, 5000000, '2024-09-01', '112345674', '123456798', 0, 10, '0_file_06732d7390665720241112_111105.png', '2024-11-12 04:19:05', '2024-11-12 04:19:05', '2024-11-12 04:19:05', '2024-11-12 04:19:05', 1, 1, 'Admin', 'Admin', 2, 0x1f70f792e749483492d8830538cc77e1, 'LC100016', 1, 3, NULL, NULL, NULL, NULL, NULL, 14, NULL, NULL),
(3, 'Oh Lala', 'Oh Lala', 'ohlala@gmail.com', '091234563', 'M', '2003-03-03', 'Cambodia', 6, 5000000, '2024-09-10', '1234567766', '12345674123', 0, 10, '0_file_06732d79da678420241112_111145.png', '2024-11-12 04:20:45', '2024-11-12 04:20:45', '2024-11-12 04:20:45', '2024-11-12 04:20:45', 1, 1, 'Admin', 'Admin', 1, 0x1f70f792e749483492d8830538cc77e1, 'LC100017', 1, 3, NULL, NULL, NULL, NULL, NULL, 14, NULL, NULL),
(4, 'Ling', 'Ling', 'ling@gmail.com', '0912345666', 'M', '2004-04-04', 'Cambodia', 6, 4500000, '2024-09-01', '12345672342', '123456712345', 1, 10, '0_file_06732d7f4eb98c20241112_111112.png', '2024-11-12 04:22:12', '2024-11-12 04:22:12', '2024-11-12 04:22:12', '2024-11-12 04:22:12', 1, 1, 'Admin', 'Admin', 2, 0x1f70f792e749483492d8830538cc77e1, 'LC100018', 1, 1, NULL, NULL, NULL, NULL, NULL, 14, NULL, NULL),
(5, 'Jhonshon', 'Jhonshon', 'jhonshon@gmail.com', '0912345688', 'M', '1995-05-05', 'USA', 8, 2000000, '2024-10-10', '1234567898777', '123456784', 0, 10, '0_file_06732d854141cf20241112_111148.png', '2024-11-12 04:23:48', '2024-11-12 04:23:48', '2024-11-12 04:23:48', '2024-11-12 04:23:48', 1, 1, 'Admin', 'Admin', 1, 0x1f70f792e749483492d8830538cc77e1, 'LC100019', 1, 3, NULL, NULL, NULL, NULL, NULL, 14, NULL, NULL),
(6, 'Kim Nana', 'Kim Nana', 'kimnana@gmail.com', '091234556', 'F', '1997-07-27', 'Cambodian', 4, 2000000, '2024-09-01', '12345674651', '123456783', 0, 20, '0_file_06732d8ba6d56a20241112_111130.png', '2024-11-12 04:25:30', '2024-11-12 04:25:30', '2024-11-12 04:25:30', '2024-11-12 04:25:30', 1, 1, 'Admin', 'Admin', 1, 0x1f70f792e749483492d8830538cc77e1, 'LC100020', 1, 2, NULL, NULL, NULL, NULL, NULL, 14, NULL, NULL),
(7, 'Ko ko', 'Ko ko', 'koko@gmail.com', '0912345633', 'M', '1997-07-27', 'Cambodia', 6, 4000000, '2024-11-05', '12345687654', '1234567234', 0, 10, '0_file_06732d9352c8dd20241112_111133.png', '2024-11-12 04:27:33', '2024-11-12 04:27:33', '2024-11-12 04:27:33', '2024-11-12 04:27:33', 1, 1, 'Admin', 'Admin', 1, 0x1f70f792e749483492d8830538cc77e1, 'LC100021', 1, 3, NULL, NULL, NULL, NULL, NULL, 14, NULL, NULL),
(8, 'Willam Jame', 'Willam Jame', 'willamjame@gmail.com', '0912345623', 'O', '2002-01-01', 'USA', 8, 4000000, '2024-12-01', '12345677667', '123456781', 0, 10, '0_file_06732db8b2194d20241112_111131.png', '2024-11-12 04:37:31', '2024-11-12 04:37:31', '2024-11-12 04:37:31', '2024-11-12 04:37:31', 1, 1, 'Admin', 'Admin', 1, 0x1f70f792e749483492d8830538cc77e1, 'LC100022', 1, 3, NULL, NULL, NULL, NULL, NULL, 14, NULL, NULL),
(9, 'OK Ok', 'OK Ok', 'okok@gmail.com', '08765432', 'M', '2004-04-27', 'Cambodia', 7, 2000000, '2024-09-01', '123456776555', '123456782', 0, 10, '0_file_06732ed64e883620241112_121140.png', '2024-11-12 05:53:40', '2024-12-09 08:57:02', '2024-11-12 05:53:40', '2024-11-12 05:53:40', 1, 1, 'Admin', 'Admin', 1, 0x1f70f792e749483492d8830538cc77e1, 'LC100023', 1, 3, 'Married', 'Socheta', NULL, 'Housekeeper', '0123456654', 14, NULL, NULL),
(10, 'Jack', 'Jack', 'jack@gmail.com', '0912345334', 'M', '1999-01-01', 'USA', 8, 1000000, '2024-10-10', '12345677653', '123456766', 0, 10, '0_file_06733273f6b64720241112_051131.png', '2024-11-12 10:00:31', '2024-12-09 08:20:51', '2024-11-12 10:00:31', '2024-11-12 10:00:31', 1, 1, 'Admin', 'Admin', 2, 0x1f70f792e749483492d8830538cc77e1, 'LC100024', 1, 3, 'Single', NULL, NULL, NULL, '12345679800', 14, NULL, NULL),
(11, 'Keo Bona', 'Keo Bona', 'keobona@gmail.com', '091234523', 'M', '2001-01-01', 'Cambodia', 5, 6000000, '2024-12-10', '12345672342', '123456776', 0, 10, '0_file_067340e30f29e920241113_091152.png', '2024-11-13 02:25:52', '2024-11-13 02:25:52', '2024-11-13 02:25:52', '2024-11-13 02:25:52', 1, 1, 'Admin', 'Admin', 1, 0x1f70f792e749483492d8830538cc77e1, 'LC100025', 1, 2, NULL, NULL, NULL, NULL, NULL, 14, NULL, NULL),
(12, 'Mey Mey', 'Mey Mey', 'meymey@gmail.com', '091234532', 'F', '2002-02-10', 'Cambodia', 8, 1000000, '2024-12-10', '12345677668', '123456732', 0, 10, '0_file_067492b006ce1c20241129_091124.png', '2024-11-29 02:46:24', '2024-12-09 08:48:25', '2024-11-29 02:46:24', '2024-11-29 02:46:24', 1, 1, 'Admin', 'Admin', 1, 0x1f70f792e749483492d8830538cc77e1, 'LC100026', 1, 3, 'Single', NULL, NULL, NULL, '0123454356', 14, NULL, NULL),
(13, 'Kim Dara', 'គីម តារា', 'kimdara@gmail.com', '0912387654', 'M', '1991-01-01', 'Takeo Cambodia', 6, 4000000, '2025-01-01', '123456776522', '12345678221', 0, 10, '0_file_06756a5d91334f20241209_031201.png', '2024-12-09 08:10:01', '2024-12-09 08:57:51', '2024-12-09 08:10:01', '2024-12-09 08:10:01', 1, 1, 'Admin', 'Admin', 1, 0x1f70f792e749483492d8830538cc77e1, 'LC100027', 1, 3, 'Married', 'Srey Sros', NULL, 'Teacher', '12345679876', 14, NULL, NULL),
(14, 'No No', 'ណូ ណូ', 'nono@gmail.com', '0962345345', 'M', '1990-01-01', 'Phnom Penh  Cambodia', 3, 25000000, '2025-01-01', '123456754345', '123454345', 0, 10, '0_file_06756aeb91923a20241209_031253.png', '2024-12-09 08:47:53', '2024-12-09 09:44:18', '2024-12-09 08:47:53', '2024-12-09 08:47:53', 1, 1, 'Admin', 'Admin', 1, 0x1f70f792e749483492d8830538cc77e1, 'LC100028', 1, 3, 'Married', 'Ok Ok', 9, 'Ux Ui Design', '123456798754', 14, NULL, NULL);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
