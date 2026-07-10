-- Add audit / multi-tenant columns required by DBX::saveData (matches employee_skills)

ALTER TABLE `employee_educations`
    ADD COLUMN `subs_id` BINARY(16) NULL AFTER `major`,
    ADD COLUMN `create_uid` INT NULL AFTER `branch_id`,
    ADD COLUMN `create_user` VARCHAR(50) NULL AFTER `create_uid`,
    ADD COLUMN `update_uid` INT NULL AFTER `create_user`,
    ADD COLUMN `update_user` VARCHAR(50) NULL AFTER `update_uid`;
