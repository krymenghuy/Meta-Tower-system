<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\PublicStorage;
use App\Models\DV;
use App\Models\Person;

Use Session;
use Carbon\Carbon;
use DB;

class LoanApplication extends Model
{
    use HasFactory;
    protected $person;
    function __construct(){
       $this->person = new Person();
    }

    static function person_id($loan_app_id,$byCol =null){
       $rows = [];
       if($byCol ==='nid')
         $rows = DB::table('persons as p')->where('p.n_id',$loan_app_id)->selectRaw("p.id as person_id")->limit(1)->get();
       else
         $rows = DB::table('loan_applications as a')->where('a.id',$loan_app_id)->selectRaw("a.person_id")->limit(1)->get();  
       foreach($rows as $row) return $row->person_id;
       return null; 
    }

    function getPersonIdByNID($branch_id,$nid){
      $rows = DB::table('persons as p')->where('branch_id',$branch_id)->where('n_id',$nid)->selectRaw("id")->limit(1)->get();
      foreach($rows as $row) return $row->id;
      return null;
    }

    //getApplicantInfo() returns object {'personal_data','academic_data'}
    function getApplicantInfo($d){
      $ss = UM::getUserInfoByToken($d,-1);
      if($ss->status_code !=200) return DV::emptyResult($ss->status_code,null); //user not authenticated
      $branch_id = $ss->branch_id;
      $nid = isset($d->nid)?$d->nid:null;
    
       $p= new \App\Models\Person();
       $person_id = $this->getPersonIdByNID($branch_id,$nid);
       return (object)['personal_data'=>$p->getPersonInfo($branch_id,$person_id),'academic_data'=>$this->getAcademicData($branch_id,$person_id)];
    }
    
   function getAcademicData($branch_id, $person_id){
     $cols = "d.student_code,d.cgpa, p.major_name,d.program_id,p.level_id,p.degree_name, p.name AS program_name";
     $rows = DB::table('student_details AS d')->join('academic_programs as p','p.id','=','d.program_id')->where('branch_id',$branch_id)->where('person_id',$person_id)->selectRaw($cols)->limit(1)->get();
     foreach($rows as $row) return $row;
     return null;
   }

   function saveDocument($d){
    $ss = UM::getUserInfoByToken($d,-1);
    if($ss->status_code !=200) return $ss; //user not authenticated
      $branch_id = $ss->branch_id;
      $loan_app_id =isset( $d->loan_app_id)? $d->loan_app_id:null;
      $file_type =isset( $d->file_type)? $d->file_type:null; 
      $file_content =isset( $d->file_content)? $d->file_content:null;
      $description =isset( $d->description)? $d->description:null;
      $person_id = self::person_id($loan_app_id);
      return $this->saveDocument_local($ss,$loan_app_id,$person_id,$file_type,$file_content,$description);
   }

   function saveDocument_local($ss,$loan_app_id,$person_id,$file_type,$file_content,$description){
      $branch_id = $ss->branch_id;
      $res = PrivateStorage::saveFile($branch_id,'loan',$file_type,$file_content,'document',null);
      $res->id= null;
      if($res->status =='OK'){
        DB::table('loan_app_documents')->insert([
          'branch_id'=>$branch_id,
          'loan_app_id'=>$loan_app_id,
          'person_id'=>$person_id,
          'file_type'=>$res->file_type,
          'file_name'=>$res->file_name,
          'directory'=>$res->directory,
          'category'=>'document',
          'description'=>$description,
          'create_user'=>$ss->login_name,
          'create_date'=>getNowTime()
        ]);
        $res->id =DB::getPdo()->lastInsertId();
      } 
      return $res;
   } 

   function deleteProfilePicture($d){
    $ss = UM::getUserInfoByToken($d,-1);
    if($ss->status_code !=200) return $ss; //user not authenticated
      $branch_id = $ss->branch_id;
      $person_id = $d->person_id;

      $rows = DB::table('persons')->where('branch_id',$branch_id)->where('id',$person_id)->selectRaw("file_type,file_name")->limit(1)->get();
      foreach($rows as $row){
          $file_path = PublicStorage::getDiskPath($branch_id,'person','image').$row->file_name;
          deleteFile($file_path);  
      }
        return null;
   }

   function saveProfilePicture($d){
    $ss = UM::getUserInfoByToken($d,-1);
    if($ss->status_code !=200) return $ss; //user not authenticated
      $branch_id = $ss->branch_id;
      $person_id = isset($d->person_id)?$d->person_id:null;
      if(empty($person_id)) $person_id = self::person_id(isset($d->loan_app_id)?$d->loan_app_id:null);
      $file_type = $d->file_type;
      $photo_data = $d->photo_data;

      $res = PublicStorage::saveImage($branch_id,'person',$file_type,$photo_data);
      if($res->status =='OK'){
          DB::table('persons')->where('id',$person_id)->update(['file_type'=>$res->file_type,'file_name'=>$res->file_name]);
          return $res;
      }
      return $res;
   }

    function getComboItems_active_loan($d){
      $ss = UM::getUserInfoByToken($d,-1);
      if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        $loan_app_id = isset($d->loan_app_id)?$d->loan_app_id:null;

        $person_id = self::person_id($loan_app_id);
        $rows = DB::table('loans AS l')->where('branch_id',$branch_id)->where('person_id',$person_id)->selectRaw("l.id, l.loan_code AS loan_name")->get();
        return $rows;
    }

    //getformOptions
   

    //extendArray | extendObject() |
    //extend props of a given array or object in general
    function extendDetails($row,$data){
        foreach($data as $key=>$value){
          $row->{$key} = $value;
        }
        return $row; 
    }

    function getStudentInfo($person_id){
       $cols ="d.id as student_id,d.student_code,d.program_id,p.name as program_name,p.id as program_id,p.degree_name, p.major_name,p.level_id,d.cgpa";
       $rows = DB::table('student_details as d')->join('academic_programs as p','p.id','=','d.program_id')->where('d.person_id',$person_id)->selectRaw($cols)->limit(1)->get();
       foreach($rows as $row) return $row;
       return null;
    }

    //saveAcademicInfo() | saveAcademicDetails()
    function saveStudentDetails($ss,$d,$person_id){
      $branch_id = $ss->branch_id;
      if(!isset($d->admission_date)) $d->admission_date = null;
      $d->student_id = isset($d->student_id)?$d->student_id:null;
      $d->student_code = isset($d->student_code)?$d->student_code:null;
      
      $id = $this->getStudentDetailId($person_id);
      $inputs = array(
        'person_id'=>$person_id,
        'student_id'=>$d->student_id,
        'student_code'=>$d->student_code,
        'program_id'=>$d->program_id,
        'cgpa'=>$d->cgpa,
        'admission_date'=>$d->admission_date,
        'create_user'=>$ss->login_name,
        'create_date'=>getNowTime()
      );

      if ($id > 0)
         DB::table('student_details')->where('id',$id)->update($inputs);
      else
         {
          DB::table('student_details')->insert($inputs);
          $id = DB::getPdo()->lastInsertId();
         }

      return DV::success(['id'=>$id]);
    }

    function getStudentDetailId($person_id){
        $rows = DB::table('student_details as d')->where('person_id',$person_id)->selectRaw('id')->limit(1)->get();
        foreach($rows as $row) return $row->id;
        return null;
    }

    //getLoanApplicationInfo() | getApplicationInfo()  returns full application details for editing or viewing purpose
    function getLoanApplicationInfo($d){
      $ss = UM::getUserInfoByToken($d,-1);
      if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        $loan_app_id = isset($d->loan_app_id)?$d->loan_app_id:NULL;
        $remarks = isset($d->remarks)?$d->remarks:null;
        $referrer_id = isset($d->referrer_id)?$d->referrer_id:null;
        $guarantor_id = isset($d->guarantor_id)?$d->guarantor_id:null; 
        $estimated_net_monthly_income = isset($d->estimated_net_monthly_income)?$d->estimated_net_monthly_income:0;
 
        $person_id = self::person_id($loan_app_id);

        $selectCols ="p.id as person_id, a.id,p.address,p.file_name,p.first_name,p.last_name, p.first_name_kh,p.last_name_kh,p.sex,p.phone_number,p.email,p.date_of_birth,p.phone_number1,p.n_id,p.adr_house,p.adr_street,p.adr_city_id,p.adr_district_id,p.adr_commune_id,p.occupation_id,p.cp_name,p.cp_phone_number,p.cp_relationship, DATE_FORMAT(p.emp_start_date,'%d %b %Y') as emp_start_date, p.emp_org_id, p.emp_position,p.emp_industry_id,emp_org_type_id,
        a.id as loan_app_id, DATE_FORMAT(a.first_pmt_date,'%d %b %Y') AS first_pmt_date, DATE_FORMAT(a.request_date,'%d %b %Y') AS request_date,a.request_amount,a.status_id, a.loan_id, a.approved_amount,a.referrer_id,a.purpose_id,a.loan_type_id,a.payback_method_id,a.monthly_interest_rate,a.period_months,a.minimum_installment,a.remarks as remarks";
        $rows = DB::table('persons AS p')->join('loan_applications AS a','a.person_id','=','p.id')->where('a.branch_id',$branch_id)->where("a.id",$loan_app_id)->selectRaw($selectCols)->limit(1)->get();
        
        //begin:: Add additional fields (student info columns)
          foreach($rows as $row){
            $studentInfo = $this->getStudentInfo($person_id);
            $this->extendDetails($row,$studentInfo);
            //get list of attachements, if any
            $row->documents = $this->getDocuments_local($branch_id,$loan_app_id);

            $url = PublicStorage::getUrl($branch_id,'person','image').$row->file_name;
            $row->image_url = htmlspecialchars($url);
            $row->file_name = null;
            return $row; 
          } 
        //end:: Add additional fields (student info columns)
        return null;
    }

    //$d = {'personal_data','emp_data','request_data'}
    function saveLoanApplication($d){
      $ss = UM::getUserInfoByToken($d,501);
      if($ss->status_code !=200) return $ss; //user not authenticated
         
        $branch_id = $ss->branch_id;
        if(empty($branch_id)) return DV::error('Failed to save Loan Application details because branch ID is invalid.');

        $personal_data = isset($d->personal_data)? (object)$d->personal_data:(object)[];
        $emp_data = isset($d->emp_data)? (object)$d->emp_data:null;
        $request_data = isset($d->request_data)?(object)$d->request_data:(object)[];
      
        $err = DV::getErrors($personal_data,['first_name'=>'string','last_name'=>'string','first_name_kh'=>'string','last_name_kh'=>'string','sex'=>['F','M','O'],'date_of_birth'=>'date','email'=>'email','phone_number'=>'phone'],'person');
        if($err) return DV::error($err);
       
        //employment data is optional @emp_data
        if ($emp_data){
          $err = DV::getErrors($emp_data,['start_date'=>'date','emp_org_id'=>'positive','position'=>'string'],'employment');
          if($err) return DV::error($err);
        }
        
        $err = DV::getErrors($request_data,['payback_method_id'=>'positive','loan_type_id'=>'positive','request_amount'=>'positive','purpose_id'=>'positive','monthly_interest_rate'=>'number','period_months'=>'positive','first_pmt_date'=>'date'],'loan_request');
        if($err) return DV::error($err);

       
        $loan_app_id = isset($d->loan_app_id)?$d->loan_app_id:null;
         
        $person_id = null;
        if ($loan_app_id > 0)
        {
            if (!UM::allowed(-1,0)) return DV::error('Permission 202 is required to modify loan application');
            $person_id = self::person_id($loan_app_id);
        }
        else {
            if (!UM::allowed(-1,0)) return DV::error('Permission 200 is required to create loan application');
            if($d->person_id > 0 ) $person_id = $d->person_id;
            if (!isset($personal_data->n_id) || !$personal_data->n_id) return DV::error('NID is unexpectedly empty or NULL');
            if (!$person_id || $person_id<=0) $person_id = self::person_id($personal_data->n_id,'nid'); 
        }

        //$photoData = isset($d->photoData)?$d->photoData:null;
        //if(!$photoData) $photoData = $photoData = isset($d->photo_data)?$d->photo_data:null;
        $personal_data->emp_data = $emp_data;
        $res = $this->person->savePerson($ss,$personal_data,$person_id);

        if($res->status === 'OK'){
             $new_id = $res->person_id;

             //Save person's employment info Optionally
             //if ($emp_data) $this->saveEmploymentData($ss,$emp_data,$new_id);

              //save documents attachments  
              $docs = isset($d->documents)?$d->documents:[];  
              
              $request_data->loan_app_id = $loan_app_id;
             
              //save details such as request_amount, request_date, status_id, etc =>table "loan_applications"
              $m = $this->saveLoanRequestData($ss,$request_data,$new_id);
              if($m->status==='OK') {
                 $this->saveDocuments($ss,$docs,$m->loan_app_id,$new_id);
              }else return $m;

            return DV::success(['person_id'=>$new_id,'id'=>$loan_app_id]);  
        }else return $res;
         
      } 
 
      //set_loan_app_code()
      static function set_application_code($ss,$loan_app_id){
          $branch_id = $ss->branch_id;
          $rows = DB::table("loan_app_code_control")->where('branch_id',$ss->branch_id)->selectRaw("last_id,prefix")->limit(1)->get();
          $next_num = 0;
          $prefix=null;
          foreach($rows as $row){
            $next_num = $row->last_id;
            $prefix =$row->prefix;
          }
          $next_num++;
          $new_code = $prefix.$branch_id.formatNumber($next_num,5); 
          $cnt = DB::table('loan_applications')->where('id',$loan_app_id)->update(array('code'=>$new_code));
          //if($cnt<=0){
             $m = DB::table('loan_app_code_control AS c')->where('c.branch_id',$branch_id)->update(array('last_id'=>$next_num));
             if($m<=0) DB::table('loan_app_code_control')->insert(array('branch_id'=>$branch_id,'prefix'=>NULL,'last_id'=>$next_num));
          //} 
          //return $prefix.$branch_id.formatNumber(1,$len);
          return null;
      }

      //saveLoanApp() | saveLoanApplication()| saveLoanRequestInfo() 
      function saveLoanRequestData($ss,$d,$person_id){
         $branch_id = $ss->branch_id;
         $loan_app_id = isset($d->loan_app_id)?$d->loan_app_id:null;
         $loan_id = isset($d->loan_id)?$d->loan_id:null;

         $estimated_net_monthly_income = isset($d->estimated_net_monthly_income)?$d->estimated_net_monthly_income:0;

         $loan_type_id = isset($d->loan_type_id)?$d->loan_type_id:null;
         $request_amount = isset($d->request_amount)?$d->request_amount:0;
         $approved_amount = isset($d->approved_amount)?$d->approved_amount:0;
         $first_pmt_date = isset($d->first_pmt_date)?$d->first_pmt_date:null;
         $minimum_installment = isset($d->minimum_installment)?$d->minimum_installment:0;
         $monthly_interest_rate = isset($d->monthly_interest_rate)?$d->monthly_interest_rate:0;
         $period_months = isset($d->period_months)?$d->period_months:0;
         $payback_method_id = isset($d->payback_method_id)?$d->payback_method_id:0;

         $purpose_id = isset($d->purpose_id)?$d->purpose_id:null;
         $purpose = isset($d->purpose)?$d->purpose:null;
         $remarks = isset($d->remarks)?$d->remarks:null;
         
         $first_pmt_date = convertDate($first_pmt_date);
         if(!(bool)strtotime($first_pmt_date)) return DV::error('First payment date is not valid!');
         if($first_pmt_date < date('Y-m-d')) return DV::error('First payment cannot be earlier than loan disburse date');
         if(empty($branch_id)) DV::error('Failed to save Loan Request Details because branch_id is not valid');

         $inputs = [
           'person_id'=>$person_id,
           'estimated_net_monthly_income'=>$estimated_net_monthly_income,
           'loan_type_id'=>$loan_type_id,
           'loan_id'=>$loan_id, //In case of add loan ONLY
           'request_amount'=>$request_amount,
           'first_pmt_date'=>$first_pmt_date,
           'minimum_installment'=>$minimum_installment,
           'approved_amount'=>$approved_amount,
           'monthly_interest_rate'=>$monthly_interest_rate,
           'period_months'=>$period_months,
           'payback_method_id'=>$payback_method_id,
           'purpose_id'=>$purpose_id,
           'inactive'=>0,
           //'purpose'=>$purpose,
           'remarks'=>$remarks,
           'create_date'=>getNowTime(),
           'create_user'=>$ss->login_name
         ];
  
         if(!$loan_app_id || empty($loan_app_id)){
             $inputs['request_date'] = getNowTime();
             $inputs['branch_id'] =$branch_id;
             DB::table('loan_applications')->insert($inputs);
             $loan_app_id = DB::getPdo()->lastInsertId();
             self::set_application_code($ss,$loan_app_id);
         } else {
             DB::table('loan_applications')->where('id',$loan_app_id)->update($inputs);
         }

         return DV::success(['loan_app_id'=>$loan_app_id]);
      }

      function getDocuments($d){
        $ss = UM::getUserInfoByToken($d,201);
        if ($ss->status_code ===403) return [];
        else if($ss->status_code !=200) return $ss; //user not authenticated

          $branch_id = $ss->branch_id;
          $loan_app_id= $d->loan_app_id;
          return getDocuments_local($branch_id,$loan_app_id);
          //$rows = DB::table('loan_app_documents AS l')->where('branch_id',$branch_id)->where('loan_app_id',$loan_app_id)->selectRaw("l.id,l.loan_app_id,l.description,l.category")->get();
          //return $rows;
      }
      
      function getDocuments_local($branch_id,$loan_app_id){
        $rows = DB::table('loan_app_documents AS l')->where('branch_id',$branch_id)->where('loan_app_id',$loan_app_id)->selectRaw("l.id,l.loan_app_id,l.description,l.category")->get();
        return $rows;
    }

      //getFileContent()
      function getDocumentContent($d){
        $ss = UM::getUserInfoByToken($d,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated

        $branch_id = $ss->branch_id;
        $id= isset($d->id)?$d->id:null;
        $file_path = null;
        $rows = DB::table('loan_app_documents')->where('branch_id',$branch_id)->where('id',$id)->selectRaw('file_type,file_name,directory')->limit(1)->get();
        foreach($rows as $row) $file_path = $row->directory.$row->file_name;
        $content = null;
        $file_type = null;
        if ($file_path){
          $file_type = $row->file_type;
          $content = PrivateStorage::get($file_path);
        } 
        return (object)['file_content'=>$content,'file_type'=>$file_type];  
      } 

      //getApplicationList()
      function getLoanApplicationList($d){
        $ss = UM::getUserInfoByToken($d,-1); //201
        if ($ss->status_code != 200) return DV::emptyResult($ss->status_code,[]);
        
        $branch_id = $ss->branch_id;
        $search_value = isset($d->search_value)?$d->search_value:null;
        $more_wheres = "1=1";
        $like_name = escape_like_str($search_value);
        if($search_value) $more_wheres ="p.n_id ='$search_value' OR (CONCAT(p.last_name,' ',p.first_name) LIKE '%$like_name%' OR p.phone_number ='$search_value') OR a.code ='$search_value'";
        $cols = "a.id,a.code AS loan_app_code,a.person_id,a.request_amount,p.n_id,CONCAT(p.last_name,' ',p.first_name) AS name,p.first_name,p.last_name, p.sex,p.phone_number,p.phone_number1,p.email,
        a.request_amount, a.approved_amount,DATE_FORMAT(a.request_date,'%d %b %Y') As request_date,a.remarks, a.estimated_net_monthly_income,a.minimum_installment,a.status_id,p.address,ss.name AS status";
        $rows= DB::table('loan_applications AS a')->join('persons as p','p.id','=','a.person_id')->join('loan_app_statuses AS ss','ss.id','=','a.status_id')->where('a.branch_id', $branch_id)->whereRaw($more_wheres)->whereRaw('status_id <3')->selectRaw($cols)->get();
        return $rows;
      }

      function getProps($branch_id,$loan_app_id,$cols=null){
        if(!$cols || empty($cols)) $cols ="a.id,a.status_id,a.request_amount";
         $rows = DB::table('loan_applications AS a')->where('a.branch_id',$branch_id)->where('a.id',$loan_app_id)->selectRaw($cols)->limit(1)->get();
         foreach($rows as $row) return $row;
         return null;
      }

      function deleteLoanApplication($d){
        $ss = UM::getUserInfoByToken($d,201);
        if ($ss->status_code ===403) return [];
        else if($ss->status_code !=200) return $ss; //user not authenticated
            $loan_app_id = isset($d->loan_app_id)?$d->loan_app_id:null;
            $branch_id = $ss->branch_id;
            $p = $this->getProps($branch_id,$loan_app_id,"a.status_id");
            if(!$p) return DV::error('Loan Application ID is not valid');
            if($p->status_id >=2) return DV::error('Cannot delete because Loan Application already approved or disbursed'); 
            DB::table('loan_app_documents')->where('loan_app_id',$loan_app_id)->delete();
            DB::table('loan_applications')->where('id',$loan_app_id)->delete();
           return DV::success();
      }

      //deleteDocument() deleteAttachment()
      function deleteDocument_local($branch_id,$id){
          $rows = DB::table('loan_app_documents AS l')->where('branch_id',$branch_id)->where('l.id',$id)->selectRaw("l.`id`,l.`directory`,file_name,file_type")->get();
          foreach($rows as $row){
            $file_path = $row->directory.$row->file_name;
            $res = deleteFile($file_path);
            $rows = DB::table('loan_app_documents')->where('branch_id',$branch_id)->where('id',$id)->delete();
          }
          return DV::success(); 
      }

      function deleteDocument($d){
        $ss = UM::getUserInfoByToken($d,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated

        $branch_id = $ss->branch_id;
        $loan_app_id = isset($d->loan_app_id)?$d->loan_app_id:null;
        $id = isset($d->id)?$d->id:null;

        $p = $this->getProps($branch_id,$loan_app_id,"a.status_id");
        if(!$p) return DV::error('Loan Application ID is not valid');
        if($p->status_id >1) return DV::error('Cannot modify data because the Loan Application is already approved!');
        return $this->deleteDocument_local($branch_id,$id);  
      }
  
      //saveDocuments() is locally
      function saveDocuments($ss,$docs,$loan_app_id,$person_id){
          $branch_id = $ss->branch_id;
          $arr = (array)($docs); 
          $i=0;
          $c= null;
          $success_cnt = 0;
          do{
            if(!isset($arr[$i])) break;
            $c = (object)$arr[$i];
                  if(isset($c->file_content)){
                     if($c->id>0){
                       $this->deleteDocument_local($branch_id,$c->id);
                     } 
                    $res = $this->saveDocument_local($ss,$loan_app_id,$person_id,$c->file_type,$c->file_content,$c->description);
                    if($res->status =='OK') $success_cnt++;
             }

            $i++;
          }while($c);

          return DV::success(['success_count'=>$success_cnt]);
      }

      function approveLoanApp($d){
        $ss = UM::getUserInfoByToken($d,203);
        if($ss->status_code !=200) return $ss; //user not authenticated

          $branch_id = $ss->branch_id;
          $loan_app_id = isset($d->loan_app_id)?$d->loan_app_id:null;
          $personal_data = isset($d->personal_data)? (object)$d->personal_data:(object)[];
          //$academic_data = isset($d->academic_data)? (object)$d->academic_data:(object)[];
          $request_data = isset($d->request_data)?(object)$d->request_data:(object)[];
      
        //$err = DV::getErrors($personal_data,['first_name'=>'string','last_name'=>'string','first_name_kh'=>'string','last_name_kh'=>'string','sex'=>['F','M','O'],'date_of_birth'=>'date','email'=>'email','phone_number'=>'phone'],'person');
        //if($err) return DV::error($err);

        //$err = DV::getErrors($academic_data,['student_code'=>'string','program_id'=>'psitive'],'academic_info');
        //if($err) return DV::error($err);
          
          $err = DV::getErrors($request_data,['payback_method_id'=>'positive','loan_type_id'=>'psitive','request_amount'=>'positive','purpose_id'=>'positive','monthly_interest_rate'=>'number','period_months'=>'positive','first_pmt_date'=>'date'],'loan_request');
          if($err) return DV::error($request_data->amount);
         
          if(empty($branch_id)) return DV::error('Branch ID is invalid.');
          $first_pmt_date = convertDate($request_data->first_pmt_date);
          if(!(bool)strtotime($first_pmt_date)) return DV::error("First payment date $first_pmt_date  is not valid");
          $p = $this->getProps($branch_id,$loan_app_id,null);
          if(!$p) return DV::error('Loan Application ID is not valid');
          if($p->status_id >1) return DV::error('This Loan Application is already approved!');

          $status_id =2; 

          DB::table('loan_applications')->where('branch_id',$branch_id)->where('id',$loan_app_id)->update([
            'request_amount'=>$request_data->request_amount,
            'approved_amount'=>$request_data->request_amount,
            'monthly_interest_rate'=>$request_data->monthly_interest_rate,
            'period_months'=>$request_data->period_months,
            'loan_type_id'=>$request_data->purpose_id,
            'first_pmt_date'=>$first_pmt_date,
            'minimum_installment'=>$request_data->minimum_installment,
            'payback_method_id'=>$request_data->payback_method_id,
            'remarks'=>$request_data->remarks,
            'status_id'=>$status_id,'auth_user'=>$ss->login_name,'auth_date'=>getNowTime()
          ]);
         return DV::success();
      }
  
       
}
