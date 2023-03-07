DROP FUNCTION IF EXISTS `displayMoney`;
CREATE  FUNCTION `displayMoney`(amt decimal(10,2),ccode varchar(10)) RETURNS varchar(100) CHARSET utf8mb4
    DETERMINISTIC
BEGIN
  declare sym varchar(15);
  declare symbol_after int;
  declare dec_points int;
  declare val varchar(100);
  if (amt IS null) then
    set amt =0;
  end if;
 
  SELECT c.symbol, c.symbol_after, c.decimal_points INTO sym, symbol_after,dec_points FROM currencies as c WHERE c.code =ccode limit 1;
  IF (symbol_after =1) THEN
    set val = concat(amt,sym);
  ELSE set val= concat(sym,amt); 
  END IF;
  return val; 
end;
DROP FUNCTION IF EXISTS `formatDate`;
CREATE  FUNCTION `formatDate`(mDate Date) RETURNS varchar(50) CHARSET utf8mb4
    DETERMINISTIC
BEGIN
  return DATE_FORMAT(mDate,'%d %b %Y');
END;
-- ----------------------------
-- Function structure for `formatDateTime`
-- ----------------------------
DROP FUNCTION IF EXISTS `formatDateTime`;
CREATE  FUNCTION `formatDateTime`(mDate Date) RETURNS varchar(50) CHARSET utf8mb4
    DETERMINISTIC
BEGIN
  return DATE_FORMAT(mDate,'%d %b %Y %r');
END;
-- ----------------------------
-- Function structure for `formatTime`
-- ----------------------------
DROP FUNCTION IF EXISTS `formatTime`;
CREATE  FUNCTION `formatTime`(mDate Date) RETURNS varchar(30) CHARSET utf8mb4
    DETERMINISTIC
BEGIN
  return DATE_FORMAT(mDate,'%r');
END;
-- ----------------------------
-- Function structure for `getApptStatus`
-- ----------------------------
DROP FUNCTION IF EXISTS `getApptStatus`;
CREATE  FUNCTION `getApptStatus`(branchid INT,statusid INT) RETURNS varchar(20) CHARSET utf8mb4
    DETERMINISTIC
BEGIN
   declare ss varchar(20); 
   SET ss = (select `name` from appt_statuses where id =statusid AND branch_id =branchid LIMIT 1);  
   return IFNULL(ss,'Pending');
END;
-- ----------------------------
-- Function structure for `getConsultanName`
-- ----------------------------
DROP FUNCTION IF EXISTS `getConsultanName`;
CREATE  FUNCTION `getConsultanName`(consultantid INT) RETURNS varchar(50) CHARSET utf8mb4
    DETERMINISTIC
BEGIN
 declare cname varchar(50);
 set cname = (select `name` from persons as p INNER JOIN employees as e ON e.person_id = p.id WHERE p.id = consultantid LIMIT 1);
 return cname; 
end;
-- ----------------------------
-- Function structure for `getCurSymbol`
-- ----------------------------
DROP FUNCTION IF EXISTS `getCurSymbol`;
CREATE  FUNCTION `getCurSymbol`(ccode varchar(10)) RETURNS varchar(10) CHARSET utf8mb4
    DETERMINISTIC
BEGIN
  declare ss varchar(10);
  SET ss = (select `symbol` from currencies as c where c.`code` = ccode limit 1);
  return ss;
end;
-- ----------------------------
-- Function structure for `getGroupQty`
-- ----------------------------
DROP FUNCTION IF EXISTS `getGroupQty`;
CREATE  FUNCTION `getGroupQty`(groupid INT) RETURNS decimal(10,2)
    DETERMINISTIC
BEGIN
  declare qty decimal(10,2);
  SET qty = (SELECT SUM(IFNULL(c.qty,0)) AS qty FROM inv_item_groups AS g INNER JOIN inv_items AS i ON i.group_id = g.id INNER JOIN inv_current_stocks AS c ON i.id = c.item_id WHERE g.id =groupid LIMIT 1);
  return qty;      
END;

-- ----------------------------
-- Function structure for `getItemDetailType`
-- ----------------------------
DROP FUNCTION IF EXISTS `getItemDetailType`;
CREATE  FUNCTION `getItemDetailType`(detailtypeid INT) RETURNS varchar(150) CHARSET utf8mb4
    DETERMINISTIC
BEGIN
  declare detailtype varchar(150);
  SET detailtype = (select d.`name` from inv_detailed_types as d where d.id =detailtypeid LIMIT 1);
  RETURN detailtype;   
END;
-- ----------------------------
-- Function structure for `getItemQty`
-- ----------------------------
DROP FUNCTION IF EXISTS `getItemQty`;
CREATE  FUNCTION `getItemQty`(itemid INT) RETURNS decimal(10,2)
    DETERMINISTIC
BEGIN
  declare qty decimal(10,2);
  SET qty = (SELECT IFNULL(c.qty,0) AS qty FROM inv_current_stocks AS c INNER JOIN inv_items AS i ON i.id = c.item_id WHERE i.id =itemid LIMIT 1);
  return qty;      
END;

-- ----------------------------
-- Function structure for `getLastStockDate`
-- ----------------------------
DROP FUNCTION IF EXISTS `getLastStockDate`;
CREATE  FUNCTION `getLastStockDate`(itemid int,stockclass_code varchar(25)) RETURNS varchar(30) CHARSET utf8mb4
BEGIN
  declare stockdate varchar(30);
  IF (IFNULL(stockclass_code,'') ='') THEN
    set stockdate = (select created_at from inv_current_stocks as d where d.item_id = itemid and d.stockclass_code = stockclass_code ORDER BY d.id DESC LIMIT 1);
  ELSE
    set stockdate = (select created_at from inv_current_stocks as d where d.item_id = itemid and d.stockclass_code = stockclass_code LIMIT 1);
  END IF;
  return stockdate;
END;
-- ----------------------------
-- Function structure for `getPatientCode`
-- ----------------------------
DROP FUNCTION IF EXISTS `getPatientCode`;
CREATE  FUNCTION `getPatientCode`(branchid INT,clientid INT) RETURNS varchar(30) CHARSET utf8mb4
    DETERMINISTIC
begin
  DECLARE cc varchar(30); 
  set cc = (select `code` from patients as p where p.branch_id =branchid AND p.id =clientid LIMIT 1);
  return cc;
end;
-- ----------------------------
-- Function structure for `getTicketNumber`
-- ----------------------------
DROP FUNCTION IF EXISTS `getTicketNumber`;
CREATE  FUNCTION `getTicketNumber`(branchid INT,apptid INT) RETURNS varchar(30) CHARSET utf8mb4
    DETERMINISTIC
BEGIN
 declare ticket varchar(30); 
 SET ticket = (SELECT ticket_number FROM tickets where branch_id=branchid and appt_id = apptid LIMIT 1);
 RETURN ticket; 
END;

-- ----------------------------
-- Function structure for `getTicketStatus`
-- ----------------------------
DROP FUNCTION IF EXISTS `getTicketStatus`;
CREATE  FUNCTION `getTicketStatus`(branchid INT,ticketid INT) RETURNS varchar(30) CHARSET utf8mb4
    DETERMINISTIC
BEGIN
  declare tstatus varchar(30);
  SET tstatus = (select sts.`name` from ticket_statuses AS sts INNER JOIN service_queue as s ON s.status_id = sts.id where s.id =ticketid LIMIT 1);
  return tstatus;
END;

DROP FUNCTION IF EXISTS `hasPosition`;
CREATE  FUNCTION `hasPosition`(empid INT,posid INT) RETURNS int(11)
    DETERMINISTIC
BEGIN
  SET @d= (EXISTS(select id from employee_positions as e WHERE e.emp_id = empid AND e.position_id = posid LIMIT 1));
  RETURN @d;
END;
-- ----------------------------
-- Function structure for `hasPositions`
-- ----------------------------
DROP FUNCTION IF EXISTS `hasPositions`;
CREATE  FUNCTION `hasPositions`(empid INT,posid INT) RETURNS int(11)
    DETERMINISTIC
BEGIN
  SET @d= (EXISTS(select id from employee_positions as e WHERE e.emp_id = empid AND e.position_id = posid LIMIT 1));
  RETURN @d;
END;
