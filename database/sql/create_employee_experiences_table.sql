-- Employee work experience records (MHR profile)
-- Run this if you prefer SQL instead of: php artisan migrate

CREATE TABLE IF NOT EXISTS `employee_experiences` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `emp_id` BIGINT UNSIGNED NOT NULL,
    `branch_id` INT NULL,
    `start_date` DATE NULL,
    `end_date` DATE NULL,
    `period` VARCHAR(150) NULL,
    `position` VARCHAR(200) NOT NULL,
    `organization_id` INT UNSIGNED NULL,
    `description` VARCHAR(500) NULL,
    `subs_id` BINARY(16) NULL,
    `create_uid` INT NULL,
    `create_user` VARCHAR(50) NULL,
    `update_uid` INT NULL,
    `update_user` VARCHAR(50) NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `employee_experiences_emp_id_index` (`emp_id`),
    KEY `employee_experiences_organization_id_index` (`organization_id`),
    CONSTRAINT `employee_experiences_emp_id_foreign`
        FOREIGN KEY (`emp_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
