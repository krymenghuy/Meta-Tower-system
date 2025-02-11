<?php
namespace App\Services\GarbageCollector;
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
    static function setYesterday(){
        $yesterday = date('Y-m-d', strtotime('-3 days'));
        return DB::table('last_gc_time')->where('id',1)->update(['last_gc_time'=>$yesterday]); 
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
             
            //  //Clean package_tracks, leave the last 10 days
            //  $before_date = date('Y-m-d', strtotime('-10 days'));
            //  $pt_count = self::deletePackageTracks($before_date);
            
             //Clean general_tracks, leave the last 10 days
             $before_date = date('Y-m-d', strtotime('-5 days'));
             $gt_count = self::deleteGeneralTracks($before_date); 
           
            //  $before_date = date('Y-m-d', strtotime('-2 days'));
            //  $photo_count = self::deletePackagePhotos($before_date); 
         
            //  $before_date = date('Y-m-d', strtotime('-7 months'));
            //  $archiveInfo = self::archivePackages($before_date);
            //  //DB::statement(DB::raw('UPDATE last_gc_time SET last_gc_time =\''.getNowTime().'\' WHERE id =1'));
            Log::info('Garbage Collector successfully cleaned up data at '.date('d M Y h:i'));
            Log::info($notif_count.' notifications deleted. '.$gt_count.' general tracks deleted ');
     
        }catch(\Throwable $e){
           Log::error('Error in GarbageCollector::cleanAll() method');
           Log::error($e->getMessage());
           Log::error($e->getTraceAsString());
        }
    }

    static function archivePackages($before_date) {
        try {
            $count = 0 ;
            // Begin a database transaction
            DB::beginTransaction();
               
            // Fetch records from the 'package' table created before $before_date in chunks
            DB::table('package')
                ->where('create_date', '<', $before_date)
                ->orderBy('id') // Add an orderBy clause based on your primary key
                ->chunk(200, function ($packages) use(&$count) {
                    foreach ($packages as $p) {
                        // Use an array cast to convert the stdClass object to an array
                        $data = (array)$p;
                        // Batch insert fetched records into the 'archived_package' table
                        $x = DB::table('archived_package')->insert($data);
                         if($x){
                            // Delete copied records from the 'package' table
                            DB::table('package')->where('id', $p->id)->delete();
                            $count++;
                         } 
                        
                    }
                });
    
            // Commit the database transaction
            DB::commit();
    
            // Return the total count of processed records
            return (object)['date'=>$before_date,'count'=>$count];
    
        } catch (\Exception $e) {
            // Rollback the database transaction in case of error
            DB::rollback();
            Log::error('Error in GarbageCollector::archivepackages() method');
            Log::error($e->getMessage());
            Log::error($e->getTraceAsString());
        }
    }
     
    //  static function archivePackages($before_date) {
    //     try {
    //         // Begin a database transaction
    //         DB::beginTransaction();
    
    //         // Fetch records from the 'package' table created before $before_date
    //         $packages = DB::table('package')
    //             ->where('create_date', '<', $before_date)
    //             ->get();
    
    //         // Check if there are records to move
    //         if (!isset($packages[0])  || empty($packages)) {
    //             return 0;  // No records to move, return null
    //         }
    //         // Batch insert fetched records into the 'archived_package' table
    //         //Log::info(json_encode($records));
    //         foreach($packages as $p){
    //             DB::table('archived_package')->insert((array)$p);
    //            // Delete copied records from the 'package' table
    //             //$package_id = array_column($p, 'id');  // Assuming 'id' is the primary key column
    //             DB::table('package')->where('id', $p->id)->delete();
    //         }

    //         // Commit the database transaction
    //         DB::commit();
    
    //         return $packages->count(); // Successful operation, return null
    
    //     } catch (\Exception $e) {
    //         // Rollback the database transaction in case of error
    //         DB::rollback();
    //         Log::error('Error in GarbageCollector::archivepackages() method');
    //         Log::error($e->getMessage());
    //         Log::error($e->getTraceAsString());
    //     }
    // }
 
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
