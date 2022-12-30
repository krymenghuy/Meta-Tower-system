##do not delete first two persons who are consultants
delete from persons where id >2;
delete from patients;
delete from patient_code_control;
delete from appointments;
delete from patient_medical_conditions;
delete from patient_vital_signs; 
delete from leads;