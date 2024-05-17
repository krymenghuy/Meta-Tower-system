<?php

namespace App\Models\abm;
use App\Models\UM;
use App\Models\PublicStorage;
use App\Models\DV;
use App\Models\JDV;
use DB;


class SenderClass //extends Model
{
    protected $id = null;
    protected $userInfo = null;
   protected static $img_dir = 'sender_class';

    function __construct($id=null,$userInfo=null){
        $this->id =$id;
        $this->userInfo = $userInfo;
   }
   
    function save_sc($arr,$id=null,$ss=null){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
         $v_rule = [
          'id'=>'0|identify=1',
          'sender_id'=>'1|number|exists=sender.id',
          'sender_class'=>'0|string|default=oversea'
    
    
        ];
        $res = validateObject($arr,$v_rule,true,[],$ss->lang,false,null);
        if($res->error) return DV::error($res->error);
        $id = $id ?? $res->id;
        $inputs= $res->values;
        $id = saveData($ss,'sender_classes',[],$inputs,[],1,false);
    
        return DV::depends($id,['action'=>'saved']);
    
      }
      
}
