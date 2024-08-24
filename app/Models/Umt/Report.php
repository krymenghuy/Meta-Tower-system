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
            return $row;
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
        $prn_id = saveData($ss,'um_permissions',['id'=>$prn_id],$inputs,[],0,false);
        if($prn_id){
            //Set permission_id in table "reports" that links to table "um_permissions"
            $rpt_inputs['permission_id'] = $prn_id;
            $rpt_inputs['app_id'] = $bin_app_id;
            $rpt_inputs['category_id'] = 1;
            $report_id = saveData($ss,'reports',['id'=>$report_id],$rpt_inputs,[],0,false);
        }
        return DV::depends($prn_id, ['id'=>$prn_id, 'report_id'=>$report_id, 'name'=>$prn_name]); 
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
