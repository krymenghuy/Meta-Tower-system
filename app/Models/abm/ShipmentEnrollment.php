<?php

namespace App\Models\Abm;

use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use App\Models\Dms\PublicStorage;
use App\Models\DV;
use App\Models\UM;
use App\Models\JDV;
use DB;

class ShipmentEnrollment
{
    protected static $img_dir ='student';
    // protected static $xlsx_cols =[ 
    //     '1' => 'first_name',
    //     '2' => 'last_name',
    //     '3' => 'sex',
    //     '4' => 'dob',
    //     '5' => 'email',
    //     '6' => 'code',
    //     '7' => 'phone',
    //     '8' => 'parent_phone',
    //     '9' => 'parent_address',
    // ];
    protected static $xlsx_cols =[ 
        '23' => 'Waybill_no',
        '24' => 'shipment_date',
        '30' => 'product', 
        '49' => 'dest_country',
        '68' => 'carrier_weight',
        '71' => 'carrier_amount',
        // '8' => 'parent_phone',
        // '9' => 'parent_address',
    ];

    static function programExists($id){
        return DB::table('main_programs as p')->where('id',$id)->value('id');
    }
    static function getFormOptions(){
        $branch_id =1;
        return (object)[
            'programs'=>DB::table('main_programs as p')->where('branch_id',$branch_id)->selectRaw('p.id,p.name as program_name')->get(),
            'categories'=>DB::table('uniform_category AS c')->selectRaw('id,name')->get()
        ];
    }

    static function getEnrollmentInfo($ss,$student_id){
       $st = DB::table('students as st')->where('id',$student_id)->selectRaw('CONCAT(last_name,\' \',first_name) as name, st.sex,st.phone as phone_number')->first(); 
       $levels = DB::table('student_programs as sp')->join('program_levels as l','l.program_id','=','sp.program_id')->where('sp.student_id',$student_id)->selectRaw('l.id, l.name as level_name')->get();
       return (object)[
         'levels'=>$levels,
         'student'=> $st
       ];
    }

    static function getCategoryBySex($sex){
        $sex = strtolower($sex);
        if($sex ==='m' || $sex ==='male') return 1;
        else return 2;
    }

    static function import($d,$ss,$id=null){
        // return $d;
        $v_rule = [
            'file' => '1|string',
        ];
        $program_id = isset($d['program_id'])?$d['program_id']:null;
        // if(!self::programExists($program_id)) return DV::error('Program ID does not exist');
        $res = validateObject($d,$v_rule,false,[],$ss->lang,0,null);
        // return $res;

        if($res->error) return DV::error($res->error);

        $inputs = $res->values;
        ini_set('max_execution_time', 3000);
        ini_set('max_input_time', 3000);

        $base64 = str_replace('data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,','',$inputs['file']);
        $x = PublicStorage::savefile($ss->branch_id,'supplier_bills','xlsx',$base64,'document');
        
        if($x->status =='OK'){

            $i = 0;
            $um = new UM();
            $rows = self::readExcel(public_path('/uploads/public/'.$ss->branch_id.'_data/supplier_bills/documents/'.$x->file_name));
            
            // if($rowCount > 3){
            //     //$deleteRows = $rowCount - 3;
            //     DB::table('students_imports')
            //     ->orderByRaw('id asc')
            //     ->limit(1)
            //     ->delete();
            // }

            // $folderPath = public_path('/uploads/public/'.$ss->branch_id.'_data/students/documents');
            // $filesInDatabase = DB::table('students_imports')->pluck('file_name');
            // $filesInFolder = glob($folderPath . '/*');

            // foreach ($filesInFolder as $filePath) {
            //     $fileName = basename($filePath);
            //     if (!in_array($fileName, $filesInDatabase->toArray())) {
            //         unlink($filePath);
            //     }
            // }
            
            //return DV::error("test = ".print_r($rows,true));
            //Check if there are duplicate IDs or name
            $x_res = self::validateShipments($rows);
            // return $x_res;
            if($x_res->error){
                PublicStorage::delete($ss->branch_id,'supplier_bills','xlsx',$x->file_name); 
                return DV::error($x_res->error);
            } 
            $shipment_count = 0;
            $Waybill_no_arr = []; 
            foreach ($x_res->shipments as $row_index=>$inputs){
                $Waybill_no_arr [] = $inputs['Waybill_no'];
                $shipment_count = $row_index + 1 ;
            }
            $shipment_un_Waybill_no =[];
            $has = 0;
            $non = 0;
            foreach ($Waybill_no_arr as $i=>$Waybill_no){
                $check = isExist('os_shipments',$id,['qr_code'=>$Waybill_no]);
                if($check) {
                    $has ++;
                }
                if(!$check) {
                    $shipment_un_Waybill_no [$i+3] = $Waybill_no;
                    $non ++;
                }
            }
            if($non > 0){
                // $mesege = 'System dont have Shipment or Supplyer QR code yet ! Please Enter Supplyer QR code in Shipment: '."\n"; 
                $data = [];
                foreach ($shipment_un_Waybill_no as $i=>$Waybill_no){
                    $data [] = $Waybill_no;
                } 
                PublicStorage::delete($ss->branch_id,'supplier_bills','xlsx',$x->file_name); 
                // $error = ['error'=>$shipment_un_Waybill_no];
                return (object)['status'=>'error','status_code'=>405,'error_message'=>$non.' Supplyer QR code don\'t have in System yet ! Please Enter Supplyer QR code in Shipment befor validation:','data'=>$data];
                // return [ 'error'=>'System dont have Supplyer QR code yet : ('.$shipment_un_Waybill_no.')! Please Enter Supplyer QR code.'];
                return DV::error($mesege);
            }

            $arr = [
                'file_name' => $x->file_name,
                'create_uid' => $ss->id,
                'update_uid' => $ss->id,
                'create_user' => $ss->full_name,
                'update_user' => $ss->full_name,
                'branch_id' => $ss->branch_id,
                'create_date'=>getNowTime()
            ];
            DB::table('os_bill_validation_sessions')->insert($arr);
            $rowCount = DB::table('os_bill_validation_sessions AS s')->count('s.id');

            $success_cnt =0;
            $unacceptable_count =0;
            foreach ($x_res->shipments as $inputs){
                $Waybill_no_arr [] = $inputs['Waybill_no'];
                $Waybill_no = $inputs['Waybill_no'];
                // $check = isExist('os_bill_validation',$id,['waybill_no'=>$Waybill_no]);
                // if($check) return DV::error('Requirement is already to save...');
                // if(!$check) {
                $shipment_info = DB::table('os_shipments as os')->join('loc_countries as loc','loc.id','=','os.to_country_id')->where('os.qr_code',$Waybill_no)->selectRaw('os.total_weight , os.total_price , os.item_type , loc.name as country_name')->take(1)->first();
                $info = (object) $shipment_info;
                if($shipment_info){
                    // $student_prog_id =DB::table('os_bill_validation')->where('student_id',$student_id)->where('program_id',$program_id)->value('id');
                    $inputs['shipment_date'] = convertDate($inputs['shipment_date']);
                    $inputs['jto_weight'] = $info->total_weight;
                    $inputs['jto_amount'] = $info->total_price;
                    $inputs['session_id'] = $rowCount;
                    $inputs['unacceptable_price'] = 0;
                    if($inputs['jto_amount'] - $inputs['carrier_amount'] > 0.03 || $inputs['jto_amount'] - $inputs['carrier_amount'] < -0.03 ){ 
                        $unacceptable_count++ ;
                        $inputs['unacceptable_price'] = 1;
                        $inputs['jto_weight'] - $inputs['carrier_weight'] > 0.03 || $inputs['jto_weight'] - $inputs['carrier_weight'] < -0.03 ? $inputs['unacceptable_weight'] = 1 : $inputs['unacceptable_weight'] = 0 ;
                        $inputs['dest_country'] == $info->country_name ? $inputs['wrong_country'] = 0 : $inputs['wrong_country'] = 1 ;
                        $info->item_type == 'non_doc'? $info->item_type = 'D' : $info->item_type = 'P';
                        $inputs['product'] == $info->item_type ? $inputs['wrong_type'] = 0 : $inputs['wrong_type'] = 1 ;
                    }
                    $id = saveData($ss,'os_bill_validation',['id'=>null],$inputs,[],1,0);
                    // $inputs['jto_amount'] - $inputs['carrier_amount'] > 0.03 || $inputs['jto_amount'] - $inputs['carrier_amount'] < -0.03 ? $unacceptable_count++ : $unacceptable_count;
                    
                    $success_cnt++;                    

                }
                    
                // }
            }
            
            $arr = [
                'shipment_count' => $shipment_count,
                'match_count' => $success_cnt,
                'unacceptable_count' => $unacceptable_count,
            ];
            DB::table('os_bill_validation_sessions')->where('id',$rowCount)->update($arr);

            // $file_name = DB::table('os_bill_validation_sessions')->where('id',$rowCount)->take(1)->value('file_name');
            // if($file_name){
            //     PublicStorage::delete($ss->branch_id,'supplier_bills','xlsx',$file_name); 
            //     // $inputs['photo_file_name']=null;
            // }
            // $x = PublicStorage::savefile($ss->branch_id,'supplier_bills','xlsx',$base64,'document');

            return DV::depends(1,[
                'shipment_count' => $shipment_count,
                'match_count' => $success_cnt,
                'unacceptable_count' => $unacceptable_count,
                'file_name'=>$x->file_name ,
                'save'=>$id ,
                'session_id'=>$rowCount
            ]);

        }
        return DV::error('Something went wrong when the system was trying to import shipments!');
    }

    static function checkDuplicateShipment($shipments,$Waybill_no){
       $i=0;
       $c = null;
       do{
         if(!isset($shipments[$i])) break;
         $c = (object)$shipments[$i];
         //return print_r($c,true);
         if(strtolower($c->Waybill_no) == strtolower($Waybill_no)){
             return 'Student named '.$name.' with ID '.$code.' has the same ID with another student in the Excel Sheet';
         }
         $i++;
       }while($c);
       return null;
    }

    static function validateShipments($shipments){
        $sts = [];
        foreach($shipments as $row_index =>$row){
            // return row;
          if($row_index >= 2){
            $this_shipment = [];
            foreach($row as $idx => $cell_value){
                //NOTE: if($idx < 9) => we allow only 9 columns at Max
                if($idx < 73){ 
                    if($idx == 23) $this_shipment[self::$xlsx_cols[23]] = $cell_value;
                    if($idx == 24) $this_shipment[self::$xlsx_cols[24]] = $cell_value;
                    if($idx == 30) $this_shipment[self::$xlsx_cols[30]] = $cell_value;
                    if($idx == 49) $this_shipment[self::$xlsx_cols[49]] = $cell_value;
                    if($idx == 68) $this_shipment[self::$xlsx_cols[68]] = $cell_value;
                    if($idx == 71) $this_shipment[self::$xlsx_cols[71]] = $cell_value;
                }
            }
            // return $this_shipment;
            if($this_shipment == null)
            return (object)['error'=>'Wrong file formart! The System can\'t validate this file','shipments'=>0];   
            // $sts[] = $this_student;  

            // $this_student['first_name'] = 'I' ? $sts[] = $this_student:$sts[] = null;

            $Waybill_no = isset($this_shipment['Waybill_no'])? $this_shipment['Waybill_no'] : null;
            // $first_name = isset($this_student['first_name'])? $this_student['first_name'] : null;
            // $last_name = isset($this_student['last_name'])? $this_student['last_name'] : null;
            // $phone_number = isset($this_student['phone'])? $this_student['phone']:null;

            // return (object)['error'=>print_r($this_student,true)];
            if(isset($this_shipment['Waybill_no'])){
                $err = self::checkDuplicateShipment($sts,$Waybill_no);
                if($err) 
                   return (object)['error'=>$err,'shipments'=>[]];
                else 
                $sts[] = $this_shipment;  
            }
           
          } 
        }
        return (object)['error'=>null,'shipments'=>$sts];
    }

    static function readExcel($file_name){
        $spreadsheet = IOFactory::load($file_name);
        $worksheet = $spreadsheet->getActiveSheet();
        return $worksheet->toArray();
    }

    static function save($arr=[],$id=null,$ss=null,$isResgister=null){
        // $id = $id?$id:$this->id;
        // $ss =$ss?$ss:$this->user_info;
        $v_rule = [
            'program_id'=>'1|number|exists=main_programs.id',
            'first_name' => '1|string|0-150',
            'last_name' => '1|string|0-150',
            'sex' => '0|choice|M,F,O',
            'dob' => '1|date',
            'email' => '0|email|0-120',
            'code' => '1|string|1-30|text=Student ID is required',
            'phone' => '0|phone|0-150',
            'parent_phone' => '1|phone|1-100',
            'parent_address' => '1|string|0-350',
            'category_id' => '1|number',
            'photo' => '0|image',
            // 'nationality_id'=>'0|number|exists=loc_countries.id',
        ];

        $img_char = ['+',':',',',';','=','/','\\','?'];
        $email = ['.','@'];
        $address =['#'];
        $res = validateObject($arr,$v_rule,1,['photo' => $img_char,'email'=>$email,'address'=>$address],$ss->lang,false,null);
        if($res->error)return DV::error($res->error);

        $um = new UM();
        $inputs = $res->values;
        $code = $inputs['code'];
        $image = $inputs['photo'];
        unset($inputs['photo']);
        $program_id =$inputs['program_id'];
        unset($inputs['program_id']);
        $inputs['dob'] = convertDate($inputs['dob']);

        $str_id ='1=1';
        if($id > 0){
            $str_id ='st.id <> '.$id;
            $existing = DB::table('students as st')->where('code',$code)->whereRaw($str_id)->selectRaw('CONCAT(last_name,\' \',first_name) AS name')->take(1)->first();
            if($existing) return DV::error('Student ID '.$code.' already belongs to another student named '.$existing->name);
        }else{
            $st = DB::table('students as st')->join('student_programs as sp','sp.student_id','=','st.id')->where('sp.program_id',$program_id)->where('st.code',$code)->selectRaw('st.id,CONCAT(last_name,\' \',first_name) AS name')->take(1)->first();
            if($st) return DV::error('Student ID '.$code.' already enrolled in this program');
        }

        // if(!$id){
        //     $str_where ='1=2';
        //     //$str_where = '(st.code =\''.$inputs['code'].'\' OR st.phone =\''.$inputs['phone'].'\' or parent_phone =\''.$inputs['parent_phone'].'\') ';
        //     $str_where = '(st.code =\''.$inputs['code'].'\')';
        //     $student_existing = DB::table('students as st')->whereRaw($str_where)->selectRaw('st.id,st.code,phone')->first();
            
        //     if($student_existing){
        //         return DV::error('Based on the Student ID, the student already exists');
        //     }
        // }
        $to_delete_image = $id && (!$image || isImage($image));
        if( $to_delete_image){
            $prev_photo_file = DB::table('students as st')->where('id',$id)->take(1)->value('photo_file_name');
            if($prev_photo_file){
                PublicStorage::delete($ss->branch_id,self::$img_dir,'image',$prev_photo_file); 
                $inputs['photo_file_name']=null;
            }
        }

        $category_id =isset($inputs['category_id'])?$inputs['category_id']:null;
        if (!isset($inputs['sex'])) $inputs['sex'] = $category_id ==1?'M':'F';
        $id = saveData($ss,'students',['id' =>$id],$inputs,[],1,false);
        if($id > 0){
            $student_prog_id =DB::table('student_programs')->where('student_id',$id)->where('program_id',$program_id)->value('id');
            saveData($ss,'student_programs',['id'=>$student_prog_id],['program_id'=>$program_id,'student_id'=>$id],[],0,true);                            

            $user_id = DB::table('um_users')->where('official_id',$id)->update([
                'login_name' => $inputs['first_name'].$inputs['code']
            ]);
            $mx = PublicStorage::saveImage($ss->branch_id,self::$img_dir,null,$image,null,['id' => $id,'store'=>'students.photo_file_name']);
            if($mx->status ==='OK') $inputs['image_url'] = $mx->image_url;  
            if(!$isResgister){
                $arr= [
                    'login_name' =>$inputs['code'],
                    'user_class' => 'student',
                    'role_id' => 2,
                    'official_id' => $id,
                    'official_code' => $inputs['code'],
                    'email' => $inputs['email'],
                    'password' => "123456",
                    'full_name' => $inputs['first_name'].' '.$inputs['last_name'],
                ];
                $um->saveUser($arr,$ss);
            }
        }
        return DV::depends($id,["id" => $id,"action"=>$id?'Updated':'Created']);
    }

    static function getDefaultUserImage(){
        return PublicStorage::getUrl(1,'default','image').'user.png';
    }

    static function getList($arr,$ss){
        $d = (object)$arr;
        $searh_value = isset($d->search_value)?$d->search_value:null;
        $program_id = isset($d->program_id)?$d->program_id:null;
        $level_id = isset($d->level_id)?$d->level_id:null;
        $str_search ='1=1';
        $str_dept ='1=1';
        $str_level ='3=3';
        if ($program_id > 0) $str_dept ='m.id ='.$program_id;
        if ($level_id > 0) $str_level ='gs.level_id ='.$level_id;
        if($searh_value){
             $searh_value = escape_like_str($searh_value);
             $str_search ='(st.code =\''.$searh_value.'\' OR st.phone =\''.$searh_value.'\' OR CONCAT(st.last_name,\' \',st.first_name) LIKE \'%'.$searh_value.'%\')';
        }
       
        $rows = DB::table('students AS st')->join('student_programs as p','p.student_id','=','st.id')->join('main_programs as m','m.id','=','p.program_id')->where('st.branch_id',$ss->branch_id)->whereRaw($str_level)->whereRaw($str_search)->whereRaw($str_dept)->selectRaw('st.id,m.name as program_name,m.id as program_id,st.first_name,st.last_name,sex,formatDate(dob) AS date_of_birth,st.email,st.code,st.phone as phone_number,st.parent_phone,parent_address,st.photo_file_name')
                ->orderByRaw('st.last_name ASC,st.code ASC')
                ->get();
        foreach($rows as $row){
            $url = null;
            if($row->photo_file_name) $url = PublicStorage::getUrl($ss->branch_id,self::$img_dir,'image').$row->photo_file_name;
            unset($row->photo_file_name);
            $row->image_url = validateUrl($url,self::getDefaultUserImage()); 
        }
        return $rows;
    }

    static function getDetails($id,$ss){
        $row = DB::table('students as s')
            ->join('uniform_category as u','s.category_id','=','u.id')
            ->selectRaw('s.first_name,s.last_name,s.sex,s.dob,email,s.code,s.phone,s.parent_phone,s.parent_address,s.photo_file_name,u.id as category_id')
            ->where('s.id',$id)->where('s.branch_id',$ss->branch_id)
            ->get()->first();
        if (!$row->photo_file_name) $row->image_url = self::getDefaultUserImage();    
        else{
            $url = null;
            if($row->photo_file_name) $url = PublicStorage::getUrl(1,self::$img_dir,'image').$row->photo_file_name;
            //$url = validateUrl($url,null);
            $row->image_url = validateUrl($url,self::getDefaultUserImage()); 
        }
        unset($row->photo_file_name);
        return $row;
    }

    static function deleteImage($id,$ss){
        $filename = DB::table('students')->where('id',$id)->where('branch_id',$ss->branch_id)->take(1)->value('photo_file_name');
        if($filename) PublicStorage::delete($ss->branch_id,self::$img_dir,'image',$filename);
        $x = DB::table('students')->where('id',$id)->where('branch_id',$ss->branch_id)->update([
            'photo_file_name' => null,
        ]);
        return DV::success(['message' => 'Image deleted']);
    }

    static function delete($id,$program_id,$arr, $ss){
        $filename = DB::table('students')->where('id',$id)->where('branch_id',$ss->branch_id)->take(1)->value('photo_file_name');
        if($filename) PublicStorage::delete($ss->branch_id,self::$img_dir,'image',$filename);
        $level_ids = DB::table('student_programs as p')->where('p.student_id',$id)->where('p.program_id',$program_id)->join('program_levels as l','l.program_id','=','p.program_id')->selectRaw('l.id')->pluck('l.id');
       
       
        $x = DB::table('student_programs')->where('student_id',$id)->where('program_id',$program_id)->delete();
        $test_id = DB::table('student_programs')->where('student_id',$id)->take(1)->value('id');
        DB::table('grade_sheet')->where('student_id',$id)->whereIn('level_id',$level_ids)->delete();
        
        if(!$test_id){
            $x = DB::table('students')->where('id',$id)->delete();
            $user = DB::table('um_users')->where('official_id',$id)->selectRaw('id,full_name,user_class')->take(1)->first();
            if($user){
                DB::table('um_users')->where('id',$user->id)->delete();
                DB::table('um_user_roles')->where('user_id',$user->id)->delete();
            }
        }
        return DV::depends($test_id,['students'=>self::getList($arr,$ss)],'Failed to delete student');
    }

    static function studentID($ss){
        $rows = DB::table('students')->where('branch_id',$ss->branch_id)->selectRaw('code')->get();
        return$rows;
    }

    static function getStudentByID($ss,$id){
        $st = DB::table('students')->where('id',$id)->selectRaw('CONCAT( last_name, \' \', first_name) AS name')->first();
        return $st? $st->name:'';
    }
}
