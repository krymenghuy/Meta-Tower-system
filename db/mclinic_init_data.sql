delete from departments;
insert into departments (id,branch_id,name,create_user,create_uid,created_at) values(1,1,'General','Admin',1,now());
insert into departments (id,branch_id,name,create_user,create_uid,created_at) values(2,1,'Skin Care','Admin',1,now());
insert into departments (id,branch_id,name,create_user,create_uid,created_at) values(3,1,'Cosmetic Surgery','Admin',1,now());

delete from contact_channels;
insert into contact_channels (id,branch_id,name,create_user,create_uid,created_at) values(1,0,'Other','Admin',1,now());
insert into contact_channels (id,branch_id,name,create_user,create_uid,created_at) values(2,0,'Phone','Admin',1,now());
insert into contact_channels (id,branch_id,name,create_user,create_uid,created_at) values(3,0,'Facebook','Admin',1,now());
insert into contact_channels (id,branch_id,name,create_user,create_uid,created_at) values(4,0,'Telegram','Admin',1,now());
insert into contact_channels (id,branch_id,name,create_user,create_uid,created_at) values(5,0,'Walkin','Admin',1,now());

delete from positions;
insert into positions (id,branch_id,department_id,name,create_user,create_uid,created_at) values(1,1,1,'Receiptionist','Admin',1,now());
insert into positions (id,branch_id,department_id,name,create_user,create_uid,created_at) values(2,1,1,'Skin Care Consultant','Admin',1,now());
insert into positions (id,branch_id,department_id,name,create_user,create_uid,created_at) values(3,1,1,'Surgoen','Admin',1,now());
insert into positions (id,branch_id,department_id,name,create_user,create_uid,created_at) values(4,1,1,'Accountant','Admin',1,now());
 