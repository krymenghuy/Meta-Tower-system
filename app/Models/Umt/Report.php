<?php

namespace App\Models\Umt;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use App\Models\DV;
use App\Models\DBX;
use DB;
class Report //extends Model
{
    //use HasFactory;
    protected $id = null, $userInfo = null;
    function __construct($id = null,$userInfo=null)
    {
       $this->id = $id;
       $this->userInfo = $userInfo;   
    }

    static function list($arr, $ss= null){
        $d = (object)$arr;
        $app_id = $d->app_id ?? null;
        $bin_app_id = $app_id? hex2bin($app_id): null; 
        $search_value = $d->search_value ?? null;
        $str_search = $search_value ? ' app.name LIKE \'%'.escape_like_str($search_value).'%\'': '3=3';
        $rows = DB::table('um_permissions as p')->join('um_applications as app','app.id','=','p.app_id')->join('um_app_modules as m','m.id','=','p.module_id')->where('category','Report')->where('app.id', $bin_app_id )->whereRaw($str_search)
        ->selectRaw( DBX::getHEX('app.id','app_id').',p.id, p.name, app.name AS app_name,m.id as module_id, m.name AS module_name')->get();
        return $rows;
    }

    static function details($id)
    {
        $row = DB::table('um_permissions as p')
            ->join('um_applications as app', 'app.id', '=', 'p.app_id')
            ->join('um_app_modules as m', 'm.id', '=', 'p.module_id')
            ->where('p.id', $id)
            ->selectRaw(DBX::getHEX('app.id', 'app_id') . ', p.id, p.name, app.name AS app_name, m.name AS module_name, m.id AS module_id, p.category')
            ->first();
    
        if (!$row) {
            return null;
        }
    
        $rpt_info = DB::table('reports as r')
            ->where('permission_id', $id)
            ->selectRaw('r.id AS rpt_id, r.code,r.category AS report_group, r.export_excel, r.export_pdf, r.export_csv, r.params, r.display_order')
            ->first();
    
        if ($rpt_info) {
            foreach ($rpt_info as $key => $value) {
                $row->$key = $value;
            }
        }
        $row->actions = self::getActionsAsString($id);
        return $row;
    }
    

    static function appExists($bin_app_id){
        return DB::table('um_applications')->where('id',$bin_app_id)->value('name');
    }

    function save($arr,$id = null, $ss = null){
        $ss =$ss ?? $this->userInfo;
        $prn_id = $id ?? $this->id;
        $v_rule = [
            //'number'=>'0|positive',
            'name'=>'1|string|1-250',
            'module_id'=>'1|number|exists=um_app_modules.id',
            'app_id'=>'1|string',
            'category'=>'1|string|default=Report'
        ];
        
        $rpt_rule = [
           'app_id'=>'1|string',
           'report_group'=>'1|string|1-250|text=Report Group or Report Category cannot be empty and must be less than 250 characters',
           'module_id'=>'1|number|exists=um_app_modules.id',
           'code'=>'1|string|text=Report Code cannot be empty',
           'name'=>'1|string|1-250',
           'params'=>'0|string',
           'actions'=>'0|string|0-1000',
           'export_excel'=>'0|number|default=0',
           'export_pdf'=>'0|number|default=0',
           'export_csv'=>'0|number|default=0',
           'display_order'=>'0|number|default=0'
        ];

        /** validate input data for table "reports" that provide list of reports to Report Center */
        $res = validateObject($arr,$rpt_rule,true,[],$ss->lang,false,null);
        if($res->error) return DV::error($res->error);
        //$rpt_inputs for saving into table "reports" that provides listing to "Report Center" 
        $rpt_inputs = $res->values;
        $str_actions = $rpt_inputs['actions'];
        unset($rpt_inputs['actions']);
        $actions = array_filter(explode('|', $str_actions), function($value) {
            return !is_null($value) && $value !== '';
        });
        
        $rpt_inputs['category'] = $rpt_inputs['report_group'];
        $rpt_name = $rpt_inputs['name'];
        $rpt_code = $rpt_inputs['code'];
        unset($rpt_inputs['report_group']);
        $report_id = $arr['report_id'] ?? 0;
      
        $app_id = $rpt_inputs['app_id'];
        $bin_app_id = $app_id? hex2bin($app_id) : null;
        if(!$bin_app_id) return DV::error('App ID is required');
        if( !self::appExists($bin_app_id)) return DV::error('App ID does not exist');
        $rpt_inputs['app_id'] = $bin_app_id;  

        if(!$report_id){
            $report_id = DB::table('reports')->where('code',$rpt_code)->where('app_id',$bin_app_id)->value('id');
            if(!$report_id) $report_id = DB::table('reports')->where('name',$rpt_name)->where('app_id',$bin_app_id)->value('id');
        }
        
        //*** validate input data for table um_permissions (for saving report as a permission )*/
        $res = validateObject($arr, $v_rule,true,[],$ss->lang,false,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $inputs['app_id'] = $bin_app_id;
        $prn_name = $inputs['name'];
        unset($inputs['actions']); 
        $prn_id = saveData($ss,'um_permissions',['id'=>$prn_id],$inputs,[],0,false);
        if($prn_id){
            //Set permission_id in table "reports" that links to table "um_permissions"
            $rpt_inputs['permission_id'] = $prn_id;
            $rpt_inputs['app_id'] = $bin_app_id;
            $rpt_inputs['category_id'] = 1;
            $report_id = saveData($ss,'reports',['id'=>$report_id],$rpt_inputs,[],0,false);

            //save Report's actions such as "VIEW, PRINT, EXPORT_PDF, EXPORT_EXCEL, EXPORT_CSV"
                DB::table('um_permission_actions')->where('permission_id',$prn_id)->delete();
                $cnt =0;
                foreach($actions as $action){
                    DB::table('um_permission_actions')->insert([
                        'permission_id'=>$prn_id,
                        'action_name'=>$action
                    ]);
                    $cnt++;
                }
               if(isset($actions[0])) 
                 DB::table('um_role_permissions')->where('permission_id',$prn_id)->whereNotIn('action_name',$actions)->delete();
               else DB::table('um_role_permissions')->where('permission_id',$prn_id)->whereNotIn('action_name',['primary'])->delete();
               DB::table('um_permissions')->where('id',$prn_id)->update(['action_count'=>$cnt]);
     
        }
        return DV::depends($prn_id, ['id'=>$prn_id, 'report_id'=>$report_id, 'name'=>$prn_name]); 
    }

    static function getReportActionNames() {
        return DB::table('um_report_actions')->orderBy('display_order')->pluck('name')->toArray(); 
        // return DB::table('um_permission_actions as pa')
        //     ->whereRaw("COALESCE(pa.permission_id, 0) = 0") // Replace NULL with 0 and check if it's 0
        //     ->distinct('pa.action_name') // Ensure uniqueness for action_name
        //     ->orderBy('pa.display_order') // Sort results
        //     ->pluck('pa.action_name'); // Retrieve the action names
    }

    static function getActionsWithStatus($id, $role_id, $allowed = null) {
            $table_name = 'um_report_actions';
            $actions = DB::table($table_name.' as pa')
            //->where('pa.permission_id', $id)
            ->orderBy('pa.display_order')
            ->pluck('pa.name')
            ->toArray();

            if (!isset($actions[0])) {
                if ($allowed === null) {
                    $allowed = DB::table('um_role_permissions as rp')
                        ->where('rp.permission_id', $id)
                        ->where('role_id', $role_id)
                        ->where('action_name', 'primary')
                        ->select('permission_id')
                        ->first() ? 1 : 0;
                }
                return [(object)['action_name' => 'primary', 'status_id' => $allowed]];
            } else {
                // Replace "view" with "primary" (In context of report, there is View permission, but database table "um_role_permision.action_name" store value as "primary" )
                $actions = array_map(function ($action_name) {
                    return $action_name === 'view' ? 'primary' : $action_name;
                }, $actions);
            }
  
        // Fetch all role permissions for the given role and permission in a single query
        $rolePermissions = DB::table('um_role_permissions as rp')
            ->where('rp.role_id', $role_id)
            ->where('rp.permission_id', $id)
            ->pluck('rp.action_name')
            ->toArray(); // Convert to an array for faster lookup
    
        // Map the actions with their status
        return array_map(function ($action_name) use ($rolePermissions) {
            return (object)[
                'action_name' => strtolower($action_name),
                'status_id' => in_array(strtolower($action_name), $rolePermissions) ? 1 : 0,
            ];
        }, $actions);
    }

    /** if @allowed is not NULL, it means the Report is single action such as "Allowed or Denied". There are no sub actions such as "view, print, export_pdf, export_excel" */
    static function getActionsWithStatusAsString($id, $role_id, $allowed = null) {
        if ($allowed !== null){
            return 'primary:'.$allowed;
        }
        $actions = self::getActionsWithStatus($id, $role_id,$allowed);
        $prns = [];
        foreach ($actions as $action) {
            $status = $action->status_id ?? 0;
            $prns[] = $action->action_name . ':' . $status;
        }
        return implode('|', $prns);
    }
     
    static function getActions($id=null) {
        if(!$id){
            return DB::table('um_report_actions as pa')
            ->orderBy('display_order')
            ->pluck('pa.name')
            ->toArray();
        }else{
            return DB::table('um_permission_actions as pa')
            ->where('pa.permission_id', $id)
            ->orderBy('display_order')
            ->pluck('pa.action_name')
            ->toArray();
        }
       
    }

    static function getActionsAsString($id){
        $actions = self::getActions($id);
        return implode('|',$actions);
    }

    function delete($id,$ss=null){
        $ss = $ss?? $this->userInfo;
        DB::table('um_permissions')->where('id',$id)->delete();
        DB::table('um_role_permissions')->where('id',$id)->delete();
        DB::table('um_user_permissions')->where('id',$id)->delete();
        DB::table('reports')->where('permission_id',$id)->delete();
        return DV::depends(1);
    }
   
    static function getFormOptions($id,$ss){
        $str_app_id = DBX::getHEX('app.id','value');
        $str_app_id1= DBX::getHEX('m.app_id','app_id');
        return (object)[
           'report'=> $id? self::details($id):null,
           'apps' => DB::table('um_applications as app')->selectRaw($str_app_id.',app.name as label')->get(),
           'modules'=> DB::table('um_app_modules as m')->where('hidden',0)->selectRaw('m.id AS value,m.name AS label,'.$str_app_id1)->get(),
           'categories'=>[
             ['value'=>'Report', 'label'=>'Report'],
           ]
        ];
    }
}
