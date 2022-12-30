<?php

public function save_category(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return $ss; //user not authenticated
    $branch_id = $ss->branch_id;
    
    $res = getValues($req,
        ['id'=>'0|identity=1|default=0',
            'name'=>'1|string|3-30|default=name|text=please enter category name',
            'name_kh'=>'0|string',
            'description'=>'0|string',
            'file_name'=>'0|string',
            'file_type'=>'0|string',
            'is_active'=>'0|number',
        ],1,
        0,
        $ss->lang,null,
        [
            "$ss->branch_id|categories|name|id=id|text=? ?cannot be duplicate::Category;"
        ]
        
    );
    
    if($res->error) return JDV::error($res->error);
    $inputs = $res->values;
    
    // $inputs = setCommonFields($res->values,$ss,'create', true); //not insert branch_id if true
    if($res->id > 0){
        $inputs = setCommonFields($res->values,$ss,'update');
        DB::table('categories')->where('id', $inputs['id'])->update($inputs);
    }else{
        $inputs = setCommonFields($res->values,$ss,'create');
        DB::table('categories')->insert($inputs);
    
        $new_id = DB::getPDO()->lastInsertId();
    
        if($new_id > 0){
            if($req->photo_data){
                $kk = PublicStorage::saveImage($branch_id, $ss->user_class, $req->file_type, $req->photo_data);
                
                if($kk->status === 'OK'){
                    $brand = DB::table('categories')->where('id', $new_id)->update([
                        'file_name'=>$kk->file_name,
                        'file_type'=>$kk->ex
                    ]);
                }else{
                    return JDV::error($kk->error_message);
                }
            }
        }    
        
    }
    
    
    return JDV::success();
    
    }
?>