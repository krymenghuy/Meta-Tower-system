-- Employee document records (MHR profile)
-- Run this if you prefer SQL instead of: php artisan migrate

CREATE TABLE IF NOT EXISTS `employee_documents` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `emp_id` BIGINT UNSIGNED NOT NULL,
    `branch_id` INT NULL,
    `document_type_id` INT UNSIGNED NOT NULL,
    `remarks` VARCHAR(255) NULL,
    `ext` VARCHAR(20) NULL,
    `original_file_name` VARCHAR(255) NULL,
    `file_name` VARCHAR(255) NULL,
    `category` VARCHAR(50) NULL,
    `subs_id` BINARY(16) NULL,
    `create_uid` INT NULL,
    `create_user` VARCHAR(50) NULL,
    `update_uid` INT NULL,
    `update_user` VARCHAR(50) NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `employee_documents_emp_id_index` (`emp_id`),
    KEY `employee_documents_document_type_id_index` (`document_type_id`),
    CONSTRAINT `employee_documents_emp_id_foreign`
        FOREIGN KEY (`emp_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
