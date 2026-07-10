-- Employee education records (MHR profile)
-- Run this if you prefer SQL instead of: php artisan migrate

CREATE TABLE IF NOT EXISTS `employee_educations` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `emp_id` BIGINT UNSIGNED NOT NULL,
    `branch_id` INT NULL,
    `school_name` VARCHAR(200) NOT NULL,
    `location` VARCHAR(200) NULL,
    `start_year` SMALLINT UNSIGNED NULL,
    `finish_year` SMALLINT UNSIGNED NULL,
    `edu_level` VARCHAR(150) NULL,
    `major` VARCHAR(150) NULL,
    `subs_id` BINARY(16) NULL,
    `create_uid` INT NULL,
    `create_user` VARCHAR(50) NULL,
    `update_uid` INT NULL,
    `update_user` VARCHAR(50) NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `employee_educations_emp_id_index` (`emp_id`),
    CONSTRAINT `employee_educations_emp_id_foreign`
        FOREIGN KEY (`emp_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
