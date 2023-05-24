<?php
namespace App\Services;
use DB;
  
class SKUService {

    protected static function getItemInfo($item_id=null){
      if($item_id>0){
        $rows = DB::table("inv_items as i")->join('inv_item_groups as g','g.id','=','i.group_id')->join('inv_categories as c','c.id','=','g.category_id')->where('i.id',$item_id)->selectRaw("i.id, g.id as group_id, g.name as group_name,c.name as category")->take(1)->get();
        foreach($rows as $row) return $row;
      }
      return (object)['category'=>'cat','group_name'=>'gp','group_id'=>0,'id'=>0];
    }

    static function createSKU($branch_id,$item_id=null,$expiration_date = null,$group_name=null,$category=null){
           if(!$group_name && !$category){
                $c = self::getItemInfo($item_id);
                $group_name = $c->group_name;
                $category = $c->category;
           }

           // Generate a random unique identifier
            $unique_id = uniqid();
            
            // If no expiration date is provided, use the current timestamp
            if (empty($expiration_date)) {
                $expiration_date = date('ymdHis');
            } else {
                // Format the expiration date as a string without separators
                $expiration_date = date('ymd', strtotime($expiration_date));
            }

            // Combine the product group name, category, and expiration date (or unique ID if no expiration date)
            $sku = strtoupper(substr($group_name, 0, 3)) . '-' . strtoupper(substr($category, 0, 4)) . '-' . strtoupper($expiration_date) . '-' . strtoupper(substr($unique_id, -3));
            
            // Check if SKU already exists in the database
            $sku_exists = self::checkSKUExists($branch_id,$sku);
            
            // If the SKU already exists, generate a new SKU recursively
            if ($sku_exists) {
                $sku = self::createSKU($branch_id,null, $expiration_date,$group_name, $category);
            }
            return $sku;
    }

    static function checkSKUExists($branch_id,$sku) {
        return DB::table("inv_skus as k")->where('k.branch_id',$branch_id)->where('sku',$sku)->select("item_id")->take(1)->exists();
    }

}

?>