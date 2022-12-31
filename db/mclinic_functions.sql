-- ----------------------------
-- Function structure for `formatDate`
-- ----------------------------
DROP FUNCTION IF EXISTS `formatDate`;
CREATE  FUNCTION `formatDate`(mDate Date) RETURNS varchar(50) CHARSET utf8
BEGIN
  return DATE_FORMAT(mDate,'%d %b %Y');
END;
 
-- ----------------------------
-- Function structure for `formatDateTime`
-- ----------------------------
DROP FUNCTION IF EXISTS `formatDateTime`;
CREATE  FUNCTION `formatDateTime`(mDate Date) RETURNS varchar(50) CHARSET utf8mb4
BEGIN
  return DATE_FORMAT(mDate,'%d %b %Y %r');
END;
 
-- ----------------------------
-- Function structure for `formatTime`
-- ----------------------------
DROP FUNCTION IF EXISTS `formatTime`;
CREATE  FUNCTION `formatTime`(mDate Date) RETURNS varchar(30) CHARSET utf8
BEGIN
  return DATE_FORMAT(mDate,'%r');
END;


 