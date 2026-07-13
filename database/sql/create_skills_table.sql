-- Master skill catalog (MHR)
-- Run this if you prefer SQL instead of: php artisan migrate

CREATE TABLE IF NOT EXISTS `skills` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(100) NULL,
    `description` VARCHAR(1000) NULL,
    `image_file_name` VARCHAR(1000) NULL,
    `count_member` INT DEFAULT 0,
    `branch_id` INT NULL,
    `subs_id` BLOB NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `create_uid` INT NULL,
    `update_uid` INT NULL,
    `create_user` VARCHAR(50) NULL,
    `update_user` VARCHAR(50) NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
