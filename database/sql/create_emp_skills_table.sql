-- Employee skill assignments (MHR)
-- Run this if you prefer SQL instead of: php artisan migrate

CREATE TABLE IF NOT EXISTS `emp_skills` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `emp_id` INT NULL,
    `skill_id` INT NULL,
    `rate` DECIMAL(10,2) DEFAULT 0.00,
    `branch_id` INT NULL,
    `subs_id` BLOB NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `create_uid` INT NULL,
    `update_uid` INT NULL,
    `create_user` VARCHAR(50) NULL,
    `update_user` VARCHAR(50) NULL,
    PRIMARY KEY (`id`),
    KEY `emp_skills_emp_id_index` (`emp_id`),
    KEY `emp_skills_skill_id_index` (`skill_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
