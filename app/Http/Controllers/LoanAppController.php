<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LoanApplication;
use App\Models\JDV;
use App\Models\UM;
use Carbon\Carbon;
use App\Models\PrivateStorage;
use App\Models\PublicStorage;
use DB;
use Session;
use Storage;

class LoanAppController extends Controller
{ 

  function getForm_options(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return JDV::emptyResult();  
    $branch_id = $ss->branch_id;
    $data =(object)[];
    $data->positions = $this->getComboItems_position();
    $data->emp_organizations = $this->getComboItems_org();
    $data->industries = $this->getComboItems_industry();

    $data->industries =DB::table('industries AS i')->selectRaw("i.id,i.name as industry")->get();
    $data->cities =DB::table('loc_cities AS c')->selectRaw("c.id,c.name AS city_name")->get();
    $data->occupations =DB::table('occupations AS c')->selectRaw("c.id,c.name AS occupation")->get();
    $data->loan_purposes =DB::table('loan_purposes AS p')->selectRaw("p.id,p.name AS loan_purpose")->get();
    $data->loan_types =DB::table('loan_types AS t')->selectRaw("t.id,t.name AS loan_type")->get();
    $data->payback_options =DB::table('payback_options AS t')->selectRaw("t.id,t.name AS payback_option")->get();
    $data->credit_officers =DB::table('credit_officers AS co')->where('branch_id',$branch_id)->selectRaw("co.id,co.name")->get();
    return JDV::json($data);
  }

  function getComboItems_industry(){
    //$ss = getSessionInfo($d);
    //if(!$ss) return '#350'; //user not authenticated
    //if (!prn_allowed(-1)) return '@'; //need permission to do this task
    //$branch_id = sanitize($ss->branch_id);
    $id =isset($d->id)?sanitize($d->id):0;
    return DB::table('industries as i')->whereRaw('IFNULL(inactive,0) =0')->selectRaw("i.id,i.name as industry")->get();
     
}

function getComboItems_position(){
    //$ss = getSessionInfo($d);
    //if(!$ss) return '#350'; //user not authenticated
    //if (!prn_allowed(-1)) return '@'; //need permission to do this task
    $branch_id = Session::get('branch_id',0);
    $id =isset($d->id)?sanitize($d->id):0;
    return DB::table('positions as l')->whereRaw('IFNULL(l.inactive,0) =0')->where('l.branch_id',$branch_id)->selectRaw("l.id,l.name as position_title")->get();
}

    function getComboItems_org(){
        //$ss = getSessionInfo($d);
        //if(!$ss) return '#350'; //user not authenticated
        //if (!prn_allowed(-1)) return '@'; //need permission to do this task
        $branch_id = Session::get('branch_id',0);
        $id =isset($d->id)?sanitize($d->id):0;
        return DB::table('organizations as org')->whereRaw('IFNULL(org.inactive,0) =0')->where('org.branch_id',$branch_id)->selectRaw("org.id,org.name as emp_org_name")->get();
    }

    function getEmpOrgDetails($org_id){
       $rows = DB::table('organizations as org')->where('id',$org_id)->selectRaw("org.id,org.name,org.org_type_id,org.industry_id")->take(1)->get();
       foreach($rows as $row) return $row;
       return (object)['name'=>'NA','id'=>null,'industry_id'=>null,'org_type_id'=>null];
    }
  
    function credit_officer_exists($id=0){
       if(!$id) return false;
       return DB::table('credit_officers as co')->where('id',$id)->selectRaw('id')->take(1)->exists();
    }
 
    function saveLoanApplication(Request $req) { 
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return $ss; //user not authenticated
      $branch_id = $ss->branch_id;
      $save_guarantor_error =null;

      $d =$req->all();
      $res = getValuesBySection($d['personal_data'],
      [
        'person_id'=>'0|identity=1',
        'date_of_birth'=>"1|date|text=date of birth is required",
        "national_id"=>"1|string|5-25|text=national ID length is betweeen ? and ?::5;25",
        'first_name'=>'1|string|0-50|text=first name is required',
        'last_name'=>'1|string|0-50|default|text=last name is required',
        'first_name_kh'=>'0|string|0-50',
        'last_name_kh'=>'0|string|0-50|',
        'sex'=>'1|choice|M,F|text=sex is not correct',
        'phone_number'=>'1|phone|0|text=phone number is required',
        'phone_number1'=>'0|phone|',
        'occupation_id'=>'0|number|',
        'email'=>'0|email|',
        'emp_start_date'=>'0|date|default=',
        'emp_org_id'=>'0|positive',
        'emp_position'=>'0|string',
        'address'=>'0|string',
        'adr_street'=>'0|string',
        'adr_house'=>'0|string',
        'adr_city_id'=>'0|number',
        'adr_district_id'=>'0|number',
        'adr_commune_id'=>'0|number',
        'cp_name'=>'0|string',
        'cp_relationship'=>'0|string',
        'cp_phone_number'=>'0|phone',
        'inactive'=>'1|default=0'
        ],
        true,
        ['last_name'=>['$','.','-'],'email'=>'email'],$ss->lang,false,
        ["$ss->branch_id|persons|first_name,last_name,sex|id=person_id|text=person already exists"]);  
          
        if ($res->error) return JDV::error($res->error);
        
        $emp = $this->getEmpOrgDetails($res->values['emp_org_id']);
        $emp_start_date = convertDate($res->values['emp_start_date']);
        if (!(bool)strtotime($emp_start_date)) $emp_start_date = date('Y-m-d');
        $res->values['emp_start_date'] = $emp_start_date; 
        $res->values['emp_industry_id'] = $emp->industry_id;
        $res->values['emp_org_type_id']= $emp->org_type_id;

        //loan_principal is the same as request_amount 
        $res1 = getValuesBySection($d['request_data'],
        [
            'loan_app_id'=>'0|identity=1',
            'currency_code'=>'0|string|default=USD', 
            'loan_type_id'=>'1|positive|text=loan type is required',
            'payback_method_id'=>'1|positive|text=Payback method is required',
            'loan_tenure'=>'1|positive|text=Loan tenure is required',
            'loan_tenure_unit'=>'1|choice|days,weeks,months,years',
            'principal'=>"1|positive|text=loan amount is required",
            "request_date"=>"1|date|text=request date is required",
            //'period_months'=>'1|number|text=loan periods in months is required',
            //'monthly_interest_rate'=>'1|number|default=0|text=period interest is required',
            'period_interest_rate'=>'1|number|default=0|text=monthly interest is required',
            'compound_cycle'=>'1|choice|daily,weekly,monthly,yearly',
            'purpose_id'=>'0|positive',
            'remarks'=>'0|string',
            //'minimum_installment'=>'0|number',
            //'first_pmt_date'=>'1|date|text=first payment date is required',
            'lawyer_fee'=>'0|number|default=0',
            'cbc_fee'=>'0|number|default=0',
            'admin_fee'=>'0|number|default=0',
            'start_date'=>'0|date',
            'first_pmt_date'=>'0|date',
            'credit_officer_id'=>'0|number|default=0',
            //'referrer_id'=>'0|number|default=0',
            'inactive'=>'1|default=0'
            ],
            true,
            ['remarks'=>['$','.','-'],'email'=>'email'],
            $ss->lang,false,
          );

      if ($res1->error) return JDV::error($res1->error);
      
      //begin:: Check start_date and first_pmt_date
          $start_date = isset($res1->values['start_date'])? convertDate($res1->values['start_date']):null;
          $first_pmt_date = isset($res1->values['first_pmt_date'])?convertDate($res1->values['first_pmt_date']):null;
          if((bool)strtotime($start_date) && (bool)strtotime($first_pmt_date)){
            if($start_date > $first_pmt_date) return JDV::error("Start date should be earlier than first payment date");
          }else{
            if(!(bool)strtotime($start_date))  $res1->values['start_date'] = null;
            if(!(bool)strtotime($first_pmt_date))  $res1->values['first_pmt_date'] = null;
          }
          $res1->values['first_pmt_date'] = $first_pmt_date;
          $res1->values['start_date'] = $start_date;
          $credit_officer_id =   $res1->values['credit_officer_id'];
          if($credit_officer_id> 0) if (!$this->credit_officer_exists($credit_officer_id)) return JDV::error('Credit officer identity is not valid');
       //end:: Check start_date and first_pmt_date

      $person_id = $res->person_id;
      $person_id = saveData($ss,"persons",['id'=>$person_id],$res->values,[],1);
      if ($person_id > 0) {
        $loan_app_id = $res1->loan_app_id;
        if (!isset($res1->values['request_date'])) $res1->values['request_date'] = getNowTime();
        //ensure that loan's principal is the same as request amount
        //if (!isset($res1->values['principal'])) 
        $res1->values['request_amount'] = $res1->values['principal'];
        $loan_app_id = saveData($ss,'loan_applications',['id'=>$loan_app_id],$res1->values,['borrower_id'=>$person_id],1);

        if($loan_app_id > 0){
            $mStat = $this->set_application_code($ss,$loan_app_id);
            $new_code =null;
            if ($mStat) $new_code = $mStat?$mStat->code:'';

            $collaterals =isset($d['collaterals'])? $d['collaterals']:[];
            $this->saveCollaterals_internal($ss,$collaterals,$loan_app_id,null);
            $documents =isset($d['documents'])? $d['documents']:[];
            $this->saveDocuments_internal($ss,$documents,$loan_app_id,null);

            $guarantors =isset($d['guarantors'])? $d['guarantors']:[];

            $g_res = $this->saveGuarantors_internal($ss,$guarantors,$loan_app_id,null);
            //Track down on error in saving Guarantors, if any
            $save_guarantor_error = isset($g_res->errors[0])? $g_res->errors[0] : null;
        }
      } 
      $minor_errors = [];
      if ($save_guarantor_error) $minor_errors[] = $save_guarantor_error;
      return JDV::success(['person_id'=>$person_id,'loan_app_id'=>$loan_app_id,'code'=>$new_code,'errors'=>$minor_errors]);
      //return makeJsonResponse($d,$ss);
    }
    
    //set_loan_app_code()
    function set_application_code($ss,$loan_app_id){
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
      return (object)['status'=>'OK','code'=>$new_code];
  }


    function saveCollaterals_internal($ss,$collaterals,$loan_app_id=null, $loan_id =null){
      if(empty($loan_app_id) && empty($loan_id)) return null;

      $coll_docs_errors = [];
      $coll_ids = [];
      foreach($collaterals as $item){
        unset($item['collateral_type']);
        $item['loan_app_id'] = $loan_app_id;
        $item['loan_id'] = $loan_id;
        $item['branch_id'] = $ss->branch_id;
        $item['create_uid'] = $ss->user_id;
        $item['create_user'] = $ss->full_name;
        $item['inactive'] =0;

        $attachments = isset($item['attachments'])?$item['attachments']:[];
        if(isset($attachments[0])){
           unset($item['attachments']);
        }
        if(isset($item['temp_id'])){
          unset($item['temp_id']);
        }
        if(isset($item['id'])){
          unset($item['id']);
        }

        DB::table('collaterals')->insert($item);
        $coll_id = DB::getPdo()->lastInsertId();

        if ($coll_id > 0){
                //Error in creating attachment file
               
                foreach($attachments as $doc){
                      //documents or images about Collateral is stored in directory "/loan/documents"
                      //$doc['file_type'] can be file extension, or file's mime_type. method PrivateStorage::saveFile() will convert to file extension accordingly
                      $res = PrivateStorage::saveFile($ss->branch_id,'loan',$doc['file_type'],$doc['file_content'],'all');
                      if($res->status ==='OK'){
                        DB::table('collaterals')->where('id',$coll_id)->update([
                          'file_name'=>$res->file_name,
                          'file_ext'=>$res->extension,
                          'file_mime_type'=>$res->extension
                        ]);

                      }else $coll_docs_errors[] = $res->error_message;
                }//end:: for each collateral's attachments as array
               $coll_ids[] = $coll_id; 
        } //end if:: collateral item was saved successfully
             
       
      }//end:: for each collateral
      return (object)(['errors'=>$coll_docs_errors,'status'=>'OK','ids'=> $coll_ids]);
    }
   
    function getGuarantors_internal($ss,$loan_app_id=null,$loan_id = null){
      $str_id ="1=1";
      if ($loan_app_id > 0) $str_id =" g.loan_app_id =$loan_app_id";
      else if ($loan_id > 0) $str_id =" g.loan_id =$loan_id";
       $rows = DB::table('guarantors as g')->whereRaw($str_id)->where('g.branch_id',$ss->branch_id)->selectRaw("g.id,g.name,g.phone_number,g.address,g.national_id,g.description")->take(1)->get();
      return $rows; 
    }

    function getDocuments_internal($ss,$loan_app_id=null, $loan_id = null){
      $str_id ="1=1";
      if ($loan_app_id > 0) $str_id =" d.loan_app_id =$loan_app_id";
      else if ($loan_id > 0) $str_id =" d.loan_id =$loan_id";
      $rows = DB::table('loan_documents as d')->whereRaw($str_id)->where('branch_id',$ss->branch_id)->selectRaw("d.id,d.description,'' AS url")->get();
      return $rows; 
    }

    function getCollaterals_internal($ss,$loan_app_id=null, $loan_id= null){
      $str_id ="1=1";
      if ($loan_app_id > 0) $str_id =" c.loan_app_id =$loan_app_id";
      else if ($loan_id > 0) $str_id =" c.loan_id =$loan_id";
 
     $rows = DB::table('collaterals AS c')->join('collateral_types as t','t.id','=','c.collateral_type_id')->whereRaw($str_id)->where('branch_id',$ss->branch_id)->selectRaw("c.id, c.collateral_type_id, t.name as collateral_type, c.identification_number, c.owner_name, getCurSymbol(c.currency_code,'$') AS currency_symbol, c.estimate_value, c.expiration_date, c.description")->get();
     return $rows; 
  }
 
   //$doc_type ={document,collateral}
  function downloadFile($doc_type,$loan_app_id=0,$file_id=0){
      $branch_id = Session('branch_id',0);
      
      $mimeType =null;
      $rows = [];
      if($doc_type ==='document')
        $rows = DB::table('loan_documents as d')->where('d.id',$file_id)->where('branch_id',$branch_id)->selectRaw("d.id,d.file_name,d.file_ext,d.file_mime_type")->take(1)->get();
      else if ($doc_type==='collateral')
        $rows = DB::table('collaterals as d')->where('d.id',$file_id)->where('branch_id',$branch_id)->selectRaw("d.id,d.file_name,d.file_ext,d.file_mime_type")->take(1)->get();
      $file_name = null;
      foreach($rows as $row){
        $file_name =$row->file_name;
        $mimeType = $row->file_mime_type;
      }

      if(!$file_name){
         echo "File not found!";
         return;
      }

       $res= PrivateStorage::readFileContent($branch_id,"loan","document",$file_name,0);
       if($res->error) {
          echo $res->error;
          return;
       }else{
          //$mimeType ="application/vnd.openxmlformats-officedocument.wordprocessingml.document";
          header('Content-type: '.$mimeType);
          header('Content-Disposition: attachment; filename='.$file_name);
          echo $res->contents;
       } 
       
  }

  function downloadDocument(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return $ss; //user not authenticated
      $branch_id = $ss->branch_id;
      $loan_app_id = $req->loan_app_id;
      $file_id = $req->file_id;
      $rows = DB::table('loan_documents as d')->where('id',$file_id)->where('branch_id',$branch_id)->selectRaw("d.id,d.file_name,d.file_ext,d.directory,d.file_mime_type")->take(1)->get();
      foreach($rows as $row){
        $file_path = $row->directory.$row->file_name; 
        //PrivateStorage::getFile($file_path);
      }
      return null;
  }

  //saveLoanDocument()| saveAttachment()
   function saveDocument(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return $ss; //user not authenticated
      $branch_id = $ss->branch_id;
      $loan_app_id = $req->loan_app_id;
      $loan_id = $req->loan_id;
      $file = $req->file;
      //First use $loan_id (if it is positive), otherwise, use $loan_app_id as key field
      $res = $this->saveDocuments_internal($ss,[$file],$loan_app_id,$loan_id);
      if(isset($res->errors[0])) return JDV::error($res->errors[0]);
      $new_id = $res->ids[0];
      return JDV::success(['id'=>$new_id]); 
   }

   function saveCollateral(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return $ss; //user not authenticated
    $branch_id = $ss->branch_id;
    $loan_app_id = $req->loan_app_id;
    $loan_id = $req->loan_id;
    $collateral = $req->collateral;
    //validate collateral inputs
    $res = JDV::getErrors($collateral,['collateral_type_id'=>'1|positive|text=Collateral type is not valid','description'=>'1|string|250|text=Description is required','identification_number'=>'1|string|default=NA','estimate_value'=>'1|number']);
    if($res->error) return JDV::error($res->error);

    //First use $loan_id (if it is positive), otherwise, use $loan_app_id as key field
    $res= $this->saveCollaterals_internal($ss,[$collateral],$loan_app_id,$loan_id);
    //$res = ['errors'=>[]]
    if(isset($res->errors[0])) return JDV::error($res->errors[0]);
    $new_id = $res->ids[0];
    return JDV::success(['id'=>$new_id]);
 }
 
   //First use $loan_id (if it is positive), otherwise, use $loan_app_id as key field
    function saveDocuments_internal($ss,$documents,$loan_app_id=null,$loan_id=null){
      if(empty($loan_app_id) && empty($loan_id)) return (object)['errors'=>[],'status'=>'OK'];
      $doc_ids = [];
      $errors = [];  
      foreach($documents as $doc){
        $user_class ="loan";
        $category ="all";
        $res = PrivateStorage::saveFile($ss->branch_id,$user_class,$doc['file_type'],$doc['file_content'],$category,null);
        if ($res->status ==='OK') {
            $inputs = [
              'branch_id'=>$ss->branch_id,
              'category'=>$category,
              'file_name'=>$res->file_name,
              'file_ext'=>$res->extension,
              'directory'=>$res->directory,
              'file_mime_type'=>$res->mime_type,
              'description'=>$doc['description']
            ];

            $inputs['loan_app_id'] =$loan_app_id;
            $inputs['loan_id'] =$loan_id;
            DB::table('loan_documents')->insert($inputs);
            $doc_id = DB::getPdo()->lastInsertId();
            $doc_ids[] = $doc_id;
        }else $errors[] = $res->error_message;
      }
      return (object)['errors'=>$errors,'status'=>'OK','ids'=>$doc_ids];;
    }

    //$g is $guarantor
    function saveGuarantor_one($ss,$g,$loan_app_id=null,$loan_id=null){
       $id = isset($g['id'])?$g['id']:null;
       $national_id = isset($g['national_id'])?$g['national_id']:null;
       $g['person_id'] = getDataValue('persons',['national_id'=>$national_id],"id");
       
       //for simpicity, if name is empty exit function silently
       $name = (isset($g['name']))?$g['name']:null;
       if(!$name){
         //delete guarantors when one of guarantors' name is empty
         DB::table('guarantors')->where('branch_id',$ss->branch_id)->where('id',$id)->delete();
         return (object)['status'=>'OK','error_message'=>null,'id'=>[]];
       }

       //set default values for type_id, description
       if(!isset($g['type_id']))$g['type_id']=0;
       if(!isset($g['description']))$g['description']='';
       $res = JDV::getErrors($g,['name'=>'0|string|text=Guarantor name cannot be empty','phone_number'=>'name|phone||text=Guarantor phone number cannot be empty','address'=>'name|string|text=address is required'],false,$ss->lang);
       if($res->error) return (object)['status'=>'Error','error_message'=>$res->error];

       $inputs = [
        'branch_id'=>$ss->branch_id,
        'loan_id'=>$loan_id,
        'loan_app_id'=>$loan_app_id,
        'person_id'=>$g['person_id'],
        'name'=>$name, //$g['name'],
        'national_id'=>$g['national_id'],
        'phone_number'=>$g['phone_number'],
        'address'=>$g['address'],
        'type_id'=>$g['type_id'],
        'description'=>$g['description'],
        'create_user'=>$ss->full_name,
        'create_date'=>getNowTime(),
        'create_uid'=>$ss->user_id,
       ];

      if ($id > 0){
        $inputs = [
          'name'=>$g['name'],
          'national_id'=>$g['national_id'],
          'phone_number'=>$g['phone_number'],
          'address'=>$g['address'],
          'person_id'=>$g['person_id'],
          'type_id'=>$g['type_id'],
          'description'=>$g['description'],
          'update_user'=>$ss->full_name,
          'update_date'=>getNowTime(),
          'update_uid'=>$ss->user_id
         ];
         DB::table('guarantors')->where('id',$id)->update($inputs);
      }else{
         DB::table('guarantors')->insert($inputs);
         $id = DB::getPdo()->lastInsertId();
      }
      return (object)['status'=>'OK','error_message'=>null,'id'=>$id];;
    }

    function saveGuarantors_internal($ss,$guarantors=[],$loan_app_id=null,$loan_id=null){
      if(empty($loan_app_id) && empty($loan_id)) return (object)['errors'=>[],'status'=>'OK'];
      $ids = [];
      $errors = [];  
      foreach($guarantors as $g){
        $res = $this->saveGuarantor_one($ss,$g,$loan_app_id,$loan_id);
        if($res->status ==='OK'){
           $ids[] = $res->id;
        } else $errors[] = $res->error_message; 
      }    
      return (object)['errors'=>$errors,'status'=>'OK','ids'=>$ids];;
    }


    function deleteCollateral(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return $ss; //user not authenticated
      $branch_id = $ss->branch_id;
      $collateral_id = $req->collateral_id;
      $err = $this->deleteCollateral_one($ss,$collateral_id);
      if ($err) return JDV::error($err);
      return JDV::success(['collateral_id'=>$collateral_id]);
    }
   
    protected function deleteCollateral_one($ss,$collateral_id=null){
      $rows = DB::table('collaterals as c')->where("c.id",$collateral_id)->where('c.branch_id',$ss->branch_id)->selectRaw("c.id,c.file_name,c.file_ext")->take(1)->get();
      foreach($rows as $row){
         $user_class ="loan";
         $category="document";
         $err = PrivateStorage::deleteFile($ss->branch_id,$user_class,$category,$row->file_name);
      }
      DB::table('collaterals')->where('id',$collateral_id)->where('branch_id',$ss->branch_id)->delete();
      return null;
    }

    protected function deleteDocument_one($ss,$file_id=null){
      $rows = DB::table('loan_documents as c')->where("c.id",$file_id)->where('c.branch_id',$ss->branch_id)->selectRaw("c.id,c.file_name,c.file_ext")->take(1)->get();
      foreach($rows as $row){
         $user_class ="loan";
         $category="document";
         $err = PrivateStorage::deleteFile($ss->branch_id,$user_class,$category,$row->file_name);
      }
      DB::table('loan_documents')->where('id',$file_id)->where('branch_id',$ss->branch_id)->delete();
      return null;
    }

    protected function deleteCollaterals_internal($ss,$loan_app_id=null,$loan_id = null){
      //if (empty($loan_app_id) && empty($loan_id)) return (object)['errors'=>[],'status'=>"OK"];
      $branch_id = $ss->branch_id;
      $errors = [];
      $str_id = "1=1";
      if ($loan_app_id > 0) $str_id ="c.loan_app_id =$loan_app_id";
      else if ($loan_id > 0) $str_id ="c.loan_id =$loan_id";
      else return (object)['errors'=>[],'status'=>"OK"]; //Not delete anything, and return OK

      $rows = DB::table('collaterals AS c')->whereRaw($str_id)->where('c.branch_id',$branch_id)->selectRaw("c.id")->get();
      foreach($rows as $coll) $this->deleteCollateral_one($ss,$coll->id);  
      return (object)['errors'=>$errors,'status'=>"OK"];
    }

    protected function deleteDocuments_internal($ss,$loan_app_id=null,$loan_id = null){
      //if (empty($loan_app_id) && empty($loan_id)) return (object)['errors'=>[],'status'=>"OK"];
      $branch_id = $ss->branch_id;
      
      $str_id = "1=1";
      if ($loan_app_id > 0) $str_id ="doc.loan_app_id =$loan_app_id";
      else if ($loan_id > 0) $str_id ="doc.loan_id =$loan_id";
      else return (object)['errors'=>[],'status'=>"OK"]; //Not delete anything, and return OK

      $rows = DB::table('loan_documents AS doc')->whereRaw($str_id)->where('doc.branch_id',$branch_id)->selectRaw("doc.id,doc.file_name,doc.file_ext")->get();
      
      $user_class ='loan';
      $category ='document';
      $path = PrivateStorage::path($branch_id,$user_class,$category);
      $errors = [];

      foreach($rows as $row){
          $err = $this->deleteDocument_one($ss,$row->id);
          if($err) $errors[] = $err;
      }
      return (object)['errors'=>$errors,'status'=>"OK"];
    }

    protected function deletePerson_internal($ss,$loan_app_id){
        return null;  
    }

    function deleteLoanApplication(Request $req) { 
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        $loan_app_id = isset($req->loan_app_id)?$req->loan_app_id:0;
        if($loan_app_id == 0) $loan_app_id = isset($req->id)?$req->id:0;
        DB::table('loan_applications')->where('id',$loan_app_id)->where('branch_id',$branch_id)->delete();
        DB::table('collaterals')->where('loan_app_id',$loan_app_id)->where('branch_id',$branch_id)->delete();
        $this->deletePerson_internal($ss,$loan_app_id);

        $this->deleteCollaterals_internal($ss,$loan_app_id);
        $res = $this->deleteDocuments_internal($ss,$loan_app_id);
        if($res->status ==='OK')
          return JDV::success(['loan_app_id'=>$loan_app_id,'doc_errors'=>$res->errors]);
        else return JDV::error($res->error_message);
    }
    
    //getApplicationInfo()
    function getLoanApplicationInfo (Request $req) { 
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return JDV::emptyResult($ss); //user not authenticated
      $branch_id = $ss->branch_id;
      $loan_app_id = $req->loan_app_id;
      $cols = "p.file_name, a.id as loan_app_id, p.id as person_id, CONCAT(p.last_name,' ',p.first_name) AS name, p.first_name,p.last_name,p.last_name_kh, p.first_name_kh,p.sex,DATE_FORMAT(p.date_of_birth,'%d %b %Y') AS date_of_birth, p.phone_number,p.phone_number1, p.email,p.national_id,DATE_FORMAT(p.emp_start_date,'%d %b %Y') AS emp_start_date, p.emp_org_id, p.emp_position, p.emp_org_type_id, p.cp_name, p.cp_relationship, p.cp_phone_number,p.occupation_id, p.adr_city_id, p.adr_district_id, p.adr_commune_id, adr_house, adr_street,p.address, a.request_amount, a.principal, date_format(a.start_date,'%d-%b-%Y') as start_date, date_format(a.first_pmt_date,'%d-%b-%Y') as first_pmt_date, a.loan_type_id, a.purpose_id, a.period_interest_rate,a.compound_cycle, a.loan_tenure,a.loan_tenure_unit, a.payback_method_id, a.status_id, a.minimum_installment, a.remarks,a.credit_officer_id";
      $rows = DB::table('loan_applications AS a')->join('persons as p','p.id','=','a.borrower_id')->where('a.id',$loan_app_id)->selectRaw($cols)->take(1)->get();
      
      $user_class="person";
      $base_url = PublicStorage::getUrl($branch_id,$user_class,'image');
      foreach($rows as $row){
        $row->image_url = $base_url.$row->file_name;
        //unset($row->file_name);  unset($row->file_type);
        $row->documents = $this->getDocuments_internal($ss,$loan_app_id);
        $row->collaterals = $this->getCollaterals_internal($ss,$loan_app_id);
        $row->guarantors = $this->getGuarantors_internal($ss,$loan_app_id);
        return JDV::json($row);
      }
      return JDV::json(null);
    }
     
    function deleteDocument(Request $req) { 
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        $file_id = $req->file_id;
        //$loan_app_id = $req->loan_app_id;
        //$loan_id = $req->loan_id;
        $err = $this->deleteDocument_one($ss,$file_id);
        if(isset($err))  return JDV::error($err);
        return JDV::success(); 
    }
    
    function getDocuments(Request $req) { 
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        $loan_app_id = $req->loan_app_id;
        $loan_id = $req->loan_id;
        $r = $this->getDocuments_internal($ss,$loan_app_id,$loan_id);
        return JDV::json($r); 
    }
 
    function getCollaterals(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        $loan_app_id = $req->loan_app_id;
        $loan_id = $req->loan_id;
        $r = $this->getCollaterals_internal($ss,$loan_app_id,$loan_id);
        return JDV::json($r); 
    }

    //$p = {'person_id','file_type','file_content'}
    function saveProfilePicture(Request $req) { 
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        $person_id = $req->person_id;
        //$loan_app_id = $req->loan_app_id;

        //base64 image data
        $file_content = $req->file_content;
        $file_type = isset($req->file_type)?$req->file_type:'';
        $user_class ="person"; 
        $res = PublicStorage::saveImage($branch_id,$user_class,$file_type,$file_content);
        if($res->status ==='OK'){
           DB::table('persons')->where('id',$person_id)->update([
            'file_name'=>$res->file_name,
            'file_type'=>$res->file_type
           ]);
           return JDV::success();   
        } else return JDV::error($res->error_message); 
    }
  
    
    function getLoanApplicationList(Request $req) { 
      $ss = UM::getUserInfoByToken($req,-1); //201
      if ($ss->status_code != 200) return JDV::emptyResult($ss->status_code,[]);
      
      $branch_id = $ss->branch_id;
      $search_value = isset($req->search_value)?$req->search_value:null;
      $more_wheres = "1=1";
      $like_name = escape_like_str($search_value);
      if($search_value) $more_wheres ="p.national_id ='$search_value' OR (CONCAT(p.last_name,' ',p.first_name) LIKE '%$like_name%' OR p.phone_number ='$search_value') OR a.code ='$search_value'";
      $cols = "a.id,a.code AS loan_app_code, has_collateral(a.branch_id,a.id) AS has_collateral, a.borrower_id as person_id,a.request_amount,p.national_id,CONCAT(p.last_name,' ',p.first_name) AS name,p.first_name,p.last_name, p.sex,p.phone_number,p.phone_number1,p.email,
      a.request_amount, a.principal,a.monthly_interest_rate,a.period_months,a.payback_method_id,DATE_FORMAT(a.request_date,'%d %b %Y') As request_date,a.remarks, a.estimated_net_monthly_income,a.minimum_installment,a.credit_officer_id,a.status_id,p.address,ss.name AS status";
      $rows= DB::table('loan_applications AS a')->join('persons as p','p.id','=','a.borrower_id')->join('loan_app_statuses AS ss','ss.id','=','a.status_id')->where('a.branch_id', $branch_id)->whereRaw($more_wheres)->whereRaw('status_id <3')->selectRaw($cols)->get();
      return JDV::json($rows);
   }

}
