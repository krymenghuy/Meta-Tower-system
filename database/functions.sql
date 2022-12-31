-- ----------------------------
-- Function structure for `formatDateTime`
-- ----------------------------

DROP FUNCTION IF EXISTS `formatDateTime`;
CREATE  FUNCTION `formatDateTime`(mDate Date) RETURNS varchar(50) DETERMINISTIC
BEGIN
  return DATE_FORMAT(mDate,'%d %b %Y %r');
END;


-- ----------------------------
-- Function structure for `formatTime`
-- ----------------------------

DROP FUNCTION IF EXISTS `formatTime`;
CREATE  FUNCTION `formatTime`(mDate Date) RETURNS varchar(30) DETERMINISTIC
BEGIN
  return DATE_FORMAT(mDate,'%r');
END;


-- ----------------------------
-- Function structure for `getApptStatus`
-- ----------------------------

DROP FUNCTION IF EXISTS `getApptStatus`;
CREATE  FUNCTION `getApptStatus`(branchid INT,statusid INT) RETURNS varchar(20) DETERMINISTIC
BEGIN
   declare ss varchar(20); 
   SET ss = (select `name` from appt_statuses where id =statusid AND branch_id =branchid LIMIT 1);  
   return IFNULL(ss,'Pending');
END;


-- ----------------------------
-- Function structure for `getConsultanName`
-- ----------------------------

DROP FUNCTION IF EXISTS `getConsultanName`;
CREATE  FUNCTION `getConsultanName`(consultantid INT) RETURNS varchar(50) DETERMINISTIC
BEGIN
 declare cname varchar(50);
 set cname = (select `name` from persons as p INNER JOIN employees as e ON e.person_id = p.id WHERE p.id = consultantid LIMIT 1);
 return cname; 
end;


-- ----------------------------
-- Function structure for `getPatientCode`
-- ----------------------------

DROP FUNCTION IF EXISTS `getPatientCode`;
CREATE  FUNCTION `getPatientCode`(branchid INT,clientid INT) RETURNS varchar(30) DETERMINISTIC
begin
  DECLARE cc varchar(30); 
  set cc = (select `code` from patients as p where p.branch_id =branchid AND p.id =clientid LIMIT 1);
  return cc;
end;


-- ----------------------------
-- Function structure for `getTicketNumber`
-- ----------------------------

DROP FUNCTION IF EXISTS `getTicketNumber`;
CREATE  FUNCTION `getTicketNumber`(branchid INT,apptid INT) RETURNS varchar(30) DETERMINISTIC
BEGIN
 declare ticket varchar(30); 
 SET ticket = (SELECT ticket_number FROM service_queue where branch_id=branchid and appt_id = apptid LIMIT 1);
 RETURN ticket; 
END;


-- ----------------------------
-- Function structure for `getTicketStatus`
-- ----------------------------

DROP FUNCTION IF EXISTS `getTicketStatus`;
CREATE  FUNCTION `getTicketStatus`(branchid INT,ticketid INT) RETURNS varchar(30) DETERMINISTIC
BEGIN
  declare tstatus varchar(30);
  SET tstatus = (select sts.`name` from ticket_statuses AS sts INNER JOIN service_queue as s ON s.status_id = sts.id where s.id =ticketid LIMIT 1);
  return tstatus;
END;


-- ----------------------------
-- Function structure for `hasPosition`
-- ----------------------------
DROP FUNCTION IF EXISTS `hasPosition`;
CREATE  FUNCTION `hasPosition`(empid INT,posid INT) RETURNS int(11) DETERMINISTIC
BEGIN
  SET @d= (EXISTS(select id from employee_positions as e WHERE e.emp_id = empid AND e.position_id = posid LIMIT 1));
  RETURN @d;
END;
 

-- ----------------------------
-- Function structure for `hasPositions`
-- ----------------------------

DROP FUNCTION IF EXISTS `hasPositions`;
CREATE  FUNCTION `hasPositions`(empid INT,posid INT) RETURNS int(11) DETERMINISTIC
BEGIN
  SET @d= (EXISTS(select id from employee_positions as e WHERE e.emp_id = empid AND e.position_id = posid LIMIT 1));
  RETURN @d;
END;