<?php

namespace App\Http\Controllers\Umt;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\Umt\AuthService;
use App\Models\DV;
use App\Models\JDV;
use DB;
class DataImportController extends Controller
{
    function importData(Request $req){
       $ss = AuthService::verifyAuth($req,-1);
       if($ss->status_code !==200) return JDV::raw($ss);
       $type = strtolower($req->type);
       switch($type){
         case 'module':{
            return JDV::raw($this->importModules($ss,$req->data));
         }
         case 'permission':{
            return JDV::raw($this->importPermissions($ss,$req->data));
         }
         case 'report':{
            return JDV::raw($this->importReports($ss,$req->data));
         }
         case 'branches':{
            return JDV::raw($this->importBranches($ss,$req->data));
         }
         case 'user':{
            return JDV::raw($this->importUsers($ss,$req->data));
         }
         default:
         return JDV::error('Unknown data type'); 
       }
    }

    function importModules($ss,$data){
      $success_cnt = 0 ;
      $items = (array)$data;
      $already_exists_count = 0 ;
      $table = 'um_app_modules';
      foreach($items as $row){
         $item_id = $row['id']; 
         $test_id =  DB::table($table)->where('id',$item_id)->where('name',$row['name'])->value('id');
         if(!$test_id){
           $inputs = $row;
           if (isset($inputs['app_id'])) $inputs['app_id'] = hex2bin($inputs['app_id']);
          
           DB::table($table)->where('id',$row['id'])->delete();
           $test_id = saveData($ss,$table,['id'=>null],$inputs,[],0,false);
           if($test_id){
              DB::table($table)->where('id',$test_id)->update(['id'=>$item_id]);
              $success_cnt++;
           }
         }else $already_exists_count++; 
        
      }

      return DV::depends(1,['success_count'=>$success_cnt,'exists_count'=>$already_exists_count]);
  }

    function importPermissions($ss,$data){
        $success_cnt = 0 ;
        $items = (array)$data;
        $already_exists_count = 0 ;
        $table = 'um_permissions';
        foreach($items as $row){
           $item_id = $row['id']; 
           $test_id =  DB::table($table)->where('id',$item_id)->where('name',$row['name'])->value('id');
           if(!$test_id){
             $inputs = $row;
             if (isset($inputs['app_id'])) $inputs['app_id'] = hex2bin($inputs['app_id']);
            
             DB::table($table)->where('id',$row['id'])->delete();
             $test_id = saveData($ss,$table,['id'=>null],$inputs,[],0,false);
             if($test_id){
                DB::table($table)->where('id',$test_id)->update(['id'=>$item_id]);
                $success_cnt++;
             }
           }else $already_exists_count++; 
          
        }

        return DV::depends(1,['success_count'=>$success_cnt,'exists_count'=>$already_exists_count]);
    }

    function importReports($ss,$data){
      $success_cnt = 0 ;
      $items = (array)$data;
      $already_exists_count = 0 ;
      $table = 'um_permissions';
      foreach($items as $row){
         $item_id = $row['id']; 
         $test_id =  DB::table($table)->where('id',$item_id)->where('name',$row['name'])->value('id');
         if(!$test_id){
           $inputs = $row;
           if (isset($inputs['app_id'])) $inputs['app_id'] = hex2bin($inputs['app_id']);
           $rpt_code = $inputs['code'];
           $rpt_params = $inputs['params'];
           $rpt_export_pdf = $inputs['exportPDF'];
           $rpt_export_excel = $inputs['exportExcel'];
           $rpt_code = $inputs['code'];
           $report_group = $inputs['reportGroup'];
           unset($inputs['code']);

           DB::table($table)->where('id',$row['id'])->delete();
           $test_id = saveData($ss,$table,['id'=>null],$inputs,[],0,false);
           if($test_id){
              DB::table($table)->where('id',$test_id)->update(['id'=>$item_id]);

               //Add report to table "reports"
               $inputs['code']= $rpt_code;
               $inputs['params']= $rpt_params;
               $inputs['excelPDF']= $rpt_export_pdf;
               $inputs['excelExcel']= $rpt_export_excel;
               $inputs['permission_id']= $test_id;
               $inputs['category']= $report_group;
               self::addReport($inputs);
              $success_cnt++;
           }
         }else $already_exists_count++; 
        
      }

      return DV::depends(1,['success_count'=>$success_cnt,'exists_count'=>$already_exists_count]);
  }
     
  static function appExists($app_id){
    return DB::table('um_applications')->where('id',hex2bin($app_id))->value('id');
  }

  static function moduleExists($app_id, $module_id){
   return DB::table('um_app_modules')->where('app_id',hex2bin($app_id))->where('id',$module_id)->value('id');
 }

  function syncReports(Request $req){
   $ss = AuthService::verifyAuth($req,-1);
   if($ss->status_code !==200) return JDV::raw($ss);
      $app_id = $req->app_id;
      $bin_app_id = $app_id ? hex2bin($app_id): null;
      $query = DB::table('reports as rpt')->selectRaw('id,name, permission_id,module_id');
      $sync_count = 0;
      $create_count = 0;
      $missing_module_count =0;

      if(!$bin_app_id) return JDV::error('App Id is required to check for existing report list');
      if(!self::appExists($app_id)) return JDV::error('The provided App ID does not exist');
      if($bin_app_id) $query->where('app_id',$bin_app_id);
      $rows = $query->get();
      foreach($rows as $row){
          $id = $row->id;
          $prn_id = $row->permission_id;
          $update = true;
          if ($prn_id){
            $prnInfo = DB::table('um_permissions as p')->where('p.id',$prn_id)->where('app_id',$bin_app_id)->selectRaw('p.id,p.name,p.category')->first();
            $update = $prnInfo ? true: false;
          }else {
             //try find report in table um_permissions by name
             $prnInfo = DB::table('um_permissions as p')->where('p.name',$row->name)->where('app_id',$bin_app_id)->selectRaw('p.id,p.name,p.category')->first();
             if($prnInfo){
                $prn_id = $prnInfo->id;
                $update =true;
             }else $update = false;

          }

          if($update){
             //$id is the primary key ID of table "reports" that provide report list to Report Center
             //$prn_id is ID in table "um_permissions"
             DB::table('reports')->where('app_id',$bin_app_id)->where('id',$id)->update([
                'permission_id'=>$prn_id
             ]);
             $sync_count++;
          }else{
             $module_id = null;
             if (!self::moduleExists($app_id, $row->module_id)){
                $missing_module_count++;
                $report_center_name = 'Report Center';
                $module_id = DB::table('um_app_modules AS m')->where('app_id',$bin_app_id)->where('name',$report_center_name)->value('id');
             } 

             if($module_id){
               $inputs = [
                  'name'=>$row->name,
                  'app_id'=>$bin_app_id,
                  'module_id'=>$module_id,
                  'category'=>'Report'
               ];
               $new_prn_id = saveData($ss,'um_permissions',['id'=>null],$inputs,[],0,false);
               if($new_prn_id){
                  $create_count++;
                  DB::table('reports')->where('id',$id)->update([
                  'permission_id'=>$new_prn_id,
                  'module_id'=>$module_id
                  ]);
               }
             }
          
          }
         
         //self::syncToPermissions();
      }

      return JDV::result(['create_count'=>$create_count,'sync_count'=>$sync_count,'missing_module_count'=> $missing_module_count]);
  }

   // static function syncToPermissions(){
   //     return null;
   // }

   static function addReport($inputs){

   } 
}
