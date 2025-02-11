<?php
namespace App\Services;
use DB;
//use DV;
use XPublicStorage;
//use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;

class GarbageCollector {
    protected static $package_photo_dir ='package';
    //protected $id =null, $user_info = null;
    // function __construct($id=null,$user_info=null){
    //     $this->id = $id;
    //     $this->user_info = $user_info;
    // }
    
    // static function last_clean_dates(){
    //     return DB::table('last_clean_dates as d')->selectRaw('notif_date,package_tracks_date,general_tracks_date,package_photos_date,package_archive_date')->first();
    // }

    /** Get last clean date and time */
    static function getGCTime(){
        return DB::table('last_gc_time')->where('id',1)->take(1)->value('last_gc_time'); 
    }
    static function cleanAll(){
        try{
            $last_gc_time = self::getGCTime();
            if(!$last_gc_time) return null;
            $today = date('Y-m-d');
            if (convertDate($last_gc_time) >= $today) return;
            DB::table('last_gc_time')->where('id',1)->update(['last_gc_time'=>getNowTime()]);  
            $before_date = date('Y-m-d', strtotime('-5 days'));
            $notif_count = self::deleteNotifications($before_date);
             
             //Clean package_tracks, leave the last 10 days
             $before_date = date('Y-m-d', strtotime('-10 days'));
             $pt_count = self::deletePackageTracks($before_date);
            
             //Clean general_tracks, leave the last 10 days
             $before_date = date('Y-m-d', strtotime('-5 days'));
             $gt_count = self::deleteGeneralTracks($before_date); 
           
             $before_date = date('Y-m-d', strtotime('-1 days'));
             $photo_count = self::deletePackagePhotos($before_date); 
         
             $before_date = date('Y-m-d', strtotime('-12 months'));
             $p_count = self::archivePackages($before_date);
             //DB::statement(DB::raw('UPDATE last_gc_time SET last_gc_time =\''.getNowTime().'\' WHERE id =1'));
            Log::info('Garbage Collector successfully cleaned up data at '.date('d M Y h:i'));
            Log::info($notif_count.' notifications deleted. '.$pt_count.' package tracks deleted. '.$gt_count.' general tracks deleted. '.$photo_count. ' package photos deleted. '.$p_count.' packages were archived');
     
        }catch(\Throwable $e){
           Log::error('Error in GarbageCollector::cleanAll() method');
           Log::error($e->getMessage());
           Log::error($e->getTraceAsString());
        }
    }

     static function archivePackages($before_date) {
        try {
            // Begin a database transaction
            DB::beginTransaction();
    
            // Fetch records from the 'package' table created before $before_date
            $records = DB::table('package')
                ->where('create_date', '<', $before_date)
                ->get()
                ->toArray();
    
            // Check if there are records to move
            if (empty($records)) {
                return 0;  // No records to move, return null
            }
            // Batch insert fetched records into the 'archived_package' table
            DB::table('archived_package')->insert($records);
    
            // Delete copied records from the 'package' table
            $idsToDelete = array_column($records, 'id');  // Assuming 'id' is the primary key column
            DB::table('package')->whereIn('id', $idsToDelete)->delete();
    
            // Commit the database transaction
            DB::commit();
    
            return count($records);  // Successful operation, return null
    
        } catch (\Exception $e) {
            // Rollback the database transaction in case of error
            DB::rollback();
            Log::error('Error in GarbageCollector::archivepackages() method');
            Log::error($e->getMessage());
            Log::error($e->getTraceAsString());
        }
    }
 
    static function deletePackagePhotos($before_date){
        $str_date = 'DATE(m.create_date) <=\''.$before_date.'\'';
        $rows = DB::table('order_images as m')->whereRaw($str_date)->selectRaw('m.id,m.branch_id,m.file_name')->get();
        $ids = [];
        foreach($rows as $row){
            if($row->file_name) XPublicStorage::delete($row->branch_id,self::$package_photo_dir,'image',$row->file_name);
            $ids[] = $row->id;
        }
        $cnt = DB::table('order_images')->whereIn('id',$ids)->delete();
        return $cnt;
    }

    static function deleteGeneralTracks($before_date){
        $str_date = 'DATE(create_date) <=\''.$before_date.'\'';
        return DB::table('general_tracks')->whereRaw($str_date)->delete();
    }

    static function deletePackageTracks($before_date){
        $str_date = 'DATE(create_date) <=\''.$before_date.'\'';
        return DB::table('package_tracks')->whereRaw($str_date)->delete();
    }

    static function deleteNotifications($before_date){
        $str_date = 'DATE(create_date) <=\''.$before_date.'\'';
        DB::table('notifications')->whereRaw($str_date)->delete();
        return DB::table('notification_reads')->whereRaw($str_date)->delete();
    }
}
?>
