<?php

namespace App\Models;

use DV;
//use XAuthService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
// use Illuminate\Pagination\LengthAwarePaginator;
use DB;
use Vsd\Database\DBX;
use Illuminate\Support\Facades\Log;
use App\Models\Formal\Promotion;
 use XUMTSettings;
 use XUser;
use Config;

class Notifier
{
    protected static $show_notif_by_category = 1;
    protected static $admin_user_class = 'admin';

    /* =====================================================
     | EDV Promotion categories
     ===================================================== */
    protected static $promotion_categories = [
        'student_app_promotion',
        'parent_app_promotion',
        'school_promotion',
        'promotion'
    ];

    protected static $default_notif_category = 'school_app_default';

    /* =====================================================
     | Admin Notification Wrapper
     ===================================================== */
    public static function notify_admin(string $event_name, $cdata): void
    {
        try {
            $payload = is_array($cdata) ? $cdata : (array)$cdata;

            if (config('queue.default') === 'sync') {
                self::notify_admin_sync($event_name, $payload);
                return;
            }
            \App\Jobs\NotifyAdminJob::dispatch($event_name, $payload);

        } catch (\Throwable $e) {
            Log::warning('notify_admin fallback to sync', [
                'event' => $event_name,
                'error' => $e->getMessage(),
            ]);

            self::notify_admin_sync($event_name, $cdata);
        }
    }

  /**
 *  $category can be provided via $data->category or via the third parameter $category_id directly
  * $scope = {subs_id, $branch_id, $role|target_role}
*/
public static function notify_mobile($scope, $data = [], $category_id = null): void
{
    try {
        $scopeArr = is_array($scope) ? $scope : (array)$scope;
        $dataArr  = is_array($data)  ? $data  : (array)$data;

        if (config('queue.default') === 'sync') {
            self::notify_mobile_sync($scopeArr, $dataArr, $category_id);
            return;
        }

        \App\Jobs\NotifyMobileJob::dispatch($scopeArr, $dataArr, $category_id);

    } catch (\Throwable $e) {
        Log::warning('notify_mobile fallback to sync', [
            'error' => $e->getMessage(),
        ]);

        self::notify_mobile_sync($scope, $data, $category_id);
    }
}

  /** This function is intended to be used for non-Admin users, or mobile users (Those uses have official_id) $byCol = official_id|login_name   */
  static function getUserId(
    string $subs_id,
    string $officialIdOrLogin,
    string $byCol = 'official_id',
    ?string $user_class = null
) {
    if (!in_array($byCol, ['official_id', 'login_name'], true)) {
        return null;
    }

    // Normalize inputs
    $subs_id = strtolower($subs_id);
    $officialIdOrLogin = (string) $officialIdOrLogin;
    $user_class = $user_class ? strtolower($user_class) : 'any';

    $cacheKey = implode(':', [
        'uid',
        $subs_id,
        $byCol,
        $officialIdOrLogin,
        $user_class
    ]);

    return Cache::remember($cacheKey, 600, function () use (
        $subs_id,
        $officialIdOrLogin,
        $byCol,
        $user_class
    ) {
        $q = XUser::query()
            ->whereRaw(DBX::whereBinary('subs_id', $subs_id))
            ->where($byCol, $byCol==='official_id'? (int)$officialIdOrLogin: $officialIdOrLogin);

        if ($user_class !== 'any') {
            $q->where('user_class', $user_class);
        }

        return $q->value('id'); // returns null or int
    });
}

   static function getCategory($category){
      $cache_key = 'notifCat_' . $category;
      $data = Cache::get($cache_key);
      $field = 'notif_category';
      if ($data !== null) return $data;
      
      $value = $category; 
      if ($category && is_numeric($category) && $category > 0) $field = 'id';
      $row = DB::table('notif_categories as c')
                ->where($field, $value)
                ->selectRaw('id, notif_category AS name')
                ->first();
      if (!$row) {
          $row = (object) ['id' => 1, 'name'=>'default'];
      }
      Cache::put($cache_key, $row, 60*30); // Cache for 30 minutes
      return $row;
  }

  public static function notify_mobile_sync($scope,$data=[],$category_id = null){
    $i=0;
    $c = null;
    $responses = [];
    $scopeInfo = (object)$scope;
    $subs_id = $scopeInfo->subs_id ?? getCurrentSubsId(true);

    $bin_subs_id = $subs_id? hex2bin($subs_id) : null;
    $branch_id = $scopeInfo->branch_id ?? null;
    $target_role = $scopeInfo->role ?? ($scopeInfo->target_role ?? null); 
    $persists = $scopeInfo->persists ?? null;

    $default_title = 'Edvance';
    $str_topic ='';
    //$lower_subs_id = strtolower($subs_id); // old code line
    //$lower_subs_id = $subs_id ? strtolower($subs_id) : null; // new code
    do{
        if(!isset($data[$i])) break;
        $c = (object)$data[$i];
        $str_topic = null;
        if (!$bin_subs_id){
          if(isset($c->subs_id)) $bin_subs_id = hex2bin($c->subs_id);
        }
        if(!$branch_id) $branch_id = $c->branch_id ?? null;
        if(!$target_role) $target_role = $c->role ?? ( $c->target_role ?? null);
        $category = $c->category ?? 'default';
        $title = $c->title ?? $default_title;
        $message = $c->message ?? null;
        $icon_name = $c->icon ?? '';
        $persists = $persists ?? ($c->persists ??  0);
        $user_class = strtolower($c->user_class ?? '');
        
        $user_id = isset($c->user_id) ? $c->user_id : null;
        //Cancel notification when there is $official_id provided, but the $user_id is not found! => It means that a merchant has profile, but does not have login account on mobile app yet
        $cancel_notif = false;
        if($user_id == null || $user_id ==''){
          $official_id = $c->target_user_id ?? null;
          if($official_id > 0){
            $user_id = self::getUserId($subs_id,$official_id,'official_id',$user_class);
            if(!$user_id){
              $cancel_notif =true;
              //Log::info("Notify to user_class =$c->user_class, target_user_id = $official_id, user_id = \"No mobile login yet\" , message =$c->message ");
            }
          }
        }
        // if($cancel_notif){
        //   \Log::info('Notif canceled for '.$user_class.' with official_id: '.$official_id.' and found user_id: '.$user_id. ' event: '.($c->event ?? 'no event'));
        // }
        if(!$cancel_notif){
          $target_role = $c->role ?? ($c->target_role  ?? null);
          $user_class = $c->user_class ?? null;
          $image_url = $c->image_url ?? null;
          $photo_file_name = $c->photo_file_name ?? null;
          $custom_data = $c->data ?? ['event'=>'general'];
          $event_name = $c->event ?? ($c->event_name ?? null);
          if ($custom_data) $event_name = $event_name ?? ($custom_data->event_name ?? null);
          //This is important to mobile app to detect event by name and update screens. such as "package_status_changed"
          $custom_data = ['event'=>$event_name];

          $detail_id = $c->detail_id ?? null;
          $str_topic = createFirebaseTopic($subs_id,$user_id,$branch_id,$user_class);
          // if($user_id===null || $user_id=='' || $user_id ==0)
          //   $str_topic = $lower_subs_id.'_'.$branch_id.'_'.topic_prefix($user_class).'_general';
          // else
          //   $str_topic = $lower_subs_id.'_'.$branch_id.'_'.topic_prefix($user_class).'_private_'.$user_id;
        
        if (!empty($custom_data)){
          array_walk($custom_data, function(&$value) {
              $value = strval($value);
          });
        } else $custom_data= null;

            $isSlient = (!$message || trim($message) =='') ? 1 : 0;
            $messageInfo = [
              'message' => [
                  'topic' => $str_topic,
                  'notification' => $isSlient? null:  [
                    'title' => $title,
                    'body' => $message,
                ],
                  'data'=>$custom_data,
                  'android' => [
                      'notification' => [
                          'icon' => $icon_name,
                          //'color'=>'#ff0000',
                          'sound' => 'default',
                      ],
                      'priority' => 'high',
                  ],
                  'apns' => [
                      'payload' => [
                          'aps' => [
                              'sound' => 'default',
                              'content-available' => $isSlient? 1:0, // 1 = Indicates a silent push notification
                          ],
                      ],
                  ],
              ],
          ];
        
          // \Log::info(' info : '.json_encode(['user_id'=>$user_id, 'topic'=>$str_topic]));
          // \Log::info(' notif object : '.json_encode($messageInfo));

              //$res = self::fcm_send($messageInfo); // old code line
              $responses[] = self::fcm_send($messageInfo); // new code for improvement
              if($persists){
                  //$app_id = getAppIdByUserClass($user_class);
                  try{
                    $category_id = $category_id ?? self::getCategory($category)->id;
                    $category_id = $category_id ?? 1;
                    $expiry_time = Carbon::now()->addDay(3);

                    $inputs = [
                      'subs_id'=>$bin_subs_id,
                      'role_name'=>$target_role,
                      "user_class"=>$user_class,
                      //'app_id'=>hex2bin($app_id),
                      'branch_id'=>$branch_id,
                      'detail_id'=>$detail_id,
                      'photo_file_name'=>$photo_file_name, 
                      'user_id'=>$user_id,
                      'title'=>isset($c->title)?$c->title:'DMS',
                      'message'=>isset($c->message)?$c->message:'',
                      'image_url'=>$image_url,
                      'expiry_time'=>$expiry_time,
                      'category_id'=>$category_id,
                      // 'create_date'=>getNowTime()
                    ];
                    $notif_id = null;
                    $nowTime =getNowTime();
                    if($detail_id && $category_id > 0) $notif_id = DB::table('notifications')->where('detail_id',$detail_id)->where('category_id',$category_id)->value('id');
                    $ss = $ss ?? XAuthService::user();
                    if (!$ss){
                      $ss = (object)[
                        'subs_id'=>$subs_id,
                        'user_id'=>0,
                        'full_name'=>'Guest',
                        'login_name'=>'Guest',
                        DBX::createdAt() => $nowTime,
                        DBX::updatedAt() => $nowTime
                      ];
                    }
                    DBX::saveData($ss,'notifications',['id'=>$notif_id],$inputs,[],$subs_id? 1 :0,false);
                  }catch(\Exception $e){
                    Log::error('Notifier Error: problem in saving notification message');
                    Log::error($e->getMessage());
                    Log::error($e->getTraceAsString());
                  }
              }
        }
        $i++;
    }while($c);
    return [
        'topic' => $str_topic,
        'result' => $responses,
    ];
    //$x = json_decode($responses);
    //if(!$x || gettype($x) ==='String') return (object)['topic'=>$str_topic,'result'=>$x];
    //$x->topic = $str_topic;
    //return $x;
 }

    public static function notify_admin_sync($event_name, $cdata)
    {
        $data = (object)$cdata;
        $subs_id = $data->subs_id ?? getCurrentSubsId(true);
        $branch_id = $data->branch_id ?? null;
        $data->subs_id = $subs_id;

        $persists = $data->persist ?? $data->persists ?? 1;
        $data->sender_id = $data->sender_id ?? ($data->user_id ?? null);
        $role_name = $data->role_name ?? null;

        $succeeded = true;

        try {
            switch ($event_name) {

                case 'message_received':
                    event(new \App\Events\MessageReceived($data));
                    break;

                case 'attendance_scanned':
                    broadcast(new \App\Events\AttendanceScanned($data));
                    break;

                case 'announcement_posted':
                    broadcast(new \App\Events\AnnouncementPosted($data));
                    break;

                default:
                    $succeeded = false;
            }

        } catch (\Throwable $e) {
            Log::error($e->getMessage());
        }

        if ($succeeded) {
            $user_id = $data->target_user_id ?? ($data->user_id ?? 0);

            $ss = (object)[
                'subs_id' => $subs_id,
                'user_id' => $user_id,
                'role_name' => $role_name,
                'branch_id' => $branch_id,
                'user_class' => self::$admin_user_class
            ];

            if ($persists) self::saveNotification_admin($ss, $data);
        }
    }

    /* =====================================================
     | Sanitize text
     ===================================================== */
  static function sanitizeString($inputString) {
      $sanitizedString = '';
      try {
          //$sanitizedString = preg_replace('/(?:\\\\x[0-9A-Fa-f]{2})+|[[:cntrl:][:punct:]]/u', '', $inputString); // This is too strong regex. it remove punctuation, moji etc
          $sanitizedString = preg_replace('/[^\PC\s]/u', '', $inputString);
          return mb_convert_encoding($sanitizedString, 'UTF-8');
      } catch (\Throwable $e) {
          Log::error("Error sanitizing string at method Notifier::sanitizeString() : {$e->getMessage()}\r\n{$e->getTraceAsString()}");
          return mb_convert_encoding($inputString, 'UTF-8'); // Return original string on error
      }
    }

    /* =====================================================
     | Category resolver
     ===================================================== */
   static function getNotifCategory($category){
      $cacheKey = "notif_category_{$category}";
      $row = Cache::remember($cacheKey, 15, function() use ($category) {
          return DB::table('notif_categories as c')
              ->where('notif_category', $category)
              ->selectRaw('id, notif_category AS name')
              ->first();
      });
      if (!$row) {
          return (object)[
              'id' => 1,
              'name' => 'default'
          ];
      }
      return $row;
    }

    /* =====================================================
     | Save admin notification
     ===================================================== */
    static function saveNotification_admin($userInfo, $d)
    {
        if (!$userInfo) return;

        $subs_id = $userInfo->subs_id ?? getCurrentSubsId(true);
        if (!$subs_id) return;

        $app_id = getAppIdByUserClass($userInfo->user_class);
        $category_id = self::getNotifCategory('default')->id;

        DB::table('notifications')->insert([
            'subs_id' => DBX::hexToBinary($subs_id),
            'app_id' => DBX::hexToBinary($app_id),
            'branch_id' => $userInfo->branch_id,
            'role_name' => $userInfo->role_name,
            'user_class' => $userInfo->user_class,
            'user_id' => $userInfo->user_id,
            'title' => $d->title ?? 'Notification',
            'message' => self::sanitizeString($d->message ?? ''),
            'image_url' => $d->image_url ?? null,
            'expiry_time' => convertDate(Carbon::now()->addDays(2)),
            'category_id' => $category_id,
            'create_date' => getNowTime()
        ]);
    }

    /* =====================================================
     | Promotion resolver
     ===================================================== */
    static function isPromotion($category)
    {
        return strpos($category, '_promotion') !== false
            || in_array($category, self::$promotion_categories);
    }

    /* =====================================================
     | Notification list (optimized)
     ===================================================== */
    static function getNotificationListByUser(array $arr, $ss = null, int $use_cache = 1)
{
    $ss = $ss ?? XAuthService::user();
    if (!$ss) {
        return collect();
    }

    $d = (object) $arr;

    $user_id    = (int) ($ss->user_id ?? 0);
    $user_class = strtolower((string) ($ss->user_class ?? ''));
    $branch_id  = (int) ($ss->branch_id ?? 0);
    $subs_id    = (string) ($ss->subs_id ?? '');
    $category   = strtolower((string) ($d->category ?? ''));

    $created_at = DBX::createdAt();

    $cache_key = 'notifls:' . md5(json_encode([
        'u' => $user_id,
        'c' => $user_class,
        'b' => $branch_id,
        's' => $subs_id,
        'k' => $category
    ]));

    if ($use_cache && ($cached = Cache::get($cache_key)) !== null) {
        return $cached;
    }

    $query = DB::table('notifications AS n')
        ->join('notif_categories AS c', 'c.id', '=', 'n.category_id')
        ->where('n.user_class', $user_class);

    if ($user_id > 0) {
        $query->where(function ($q) use ($user_id) {
            $q->where('n.user_id', $user_id)
              ->orWhereNull('n.user_id')
              ->orWhere('n.user_id', 0);
        });
    } else {
        $query->where(function ($q) {
            $q->whereNull('n.user_id')
              ->orWhere('n.user_id', 0);
        });
    }

    if (!XUMTSettings::correctUserClass($user_class)) {
        $query->whereNotExists(function ($q) use ($user_id) {
            $q->select(DB::raw(1))
              ->from('notification_reads AS nr')
              ->whereColumn('nr.notif_id', 'n.id')
              ->where('nr.user_id', $user_id);
        });
    } else {
        $query->whereDate("n.$created_at", '=', date('Y-m-d'));
    }
    if ($subs_id !== '') {
        $query->whereRaw(DBX::whereBinary('n.subs_id',$subs_id));
    }

    if ($category !== '') {
        $query->where('c.notif_category', $category);
    }
    $query->select([
        'n.id',
        'n.detail_id',
        'n.message',
        'n.title',
        'n.image_url',
        'n.photo_file_name',
        'c.text_color',
        'c.title_color',
    ]);

    // Safe derived columns
    $query->selectRaw("
        CASE 
            WHEN n.user_id IS NULL OR n.user_id = 0 THEN 'all'
            ELSE 'me'
        END AS target_user
    ");

    $query->selectRaw(DBX::formatDate("n.$created_at", 'create_date'));
    $query->selectRaw(DBX::formatTimeOnly("n.$created_at", 'time',true));

    $data = $query->orderBy('n.id', 'desc')->get();

    if (self::isPromotion($category)) {
        foreach ($data as $row) {
            if (!empty($row->detail_id)) {
                $row->image_url = Promotion::photo(
                    $ss,
                    $row->detail_id,
                    $row->photo_file_name
                );
            }
        }
    }

    Cache::put($cache_key, $data, 5);

    return $data;
}

    /* =====================================================
     | Mark single notification read
     ===================================================== */
  static function getUnreadCount($user_id, $user_class = null)
  {
    if (!$user_id)
      return 0;
    $str_user_class = "1=1";
    $cach_key = 'unreadnotif_' . $user_id;
    $cnt = Cache::get($cach_key);
    if ($cnt !== null) {
      //Log::info('cached unread-count = '.$cnt);
      return $cnt;
    }
    if ($user_class)
      $str_user_class = 'n.user_class =\'' . $user_class . '\'';
    $col_is_read = DBX::getSubquerySQL('notification_reads','id',['notif_id'=>'db:n.id','user_id'=>$user_id]);
    $rows = DB::table('notifications AS n')->whereRaw($str_user_class)->where('n.user_id', $user_id)->whereRaw($col_is_read.' =0')->selectRaw('COUNT(n.id) AS cnt')->get();
    foreach ($rows as $row) {
      Cache::put($cach_key, $row->cnt, 35);
      //Log::info('queried unread-count = '.$row->cnt);
      return $row->cnt;
    }
    Cache::put($cach_key, 0, 35);
    return 0;
  }

  /** Notifier:: details() return Promotion details with Description and Image Url for mobile popup screen */
  static function details($id,$ss){
      $subs_id = $ss->subs_id;
      $row = DB::table('notifications as n')->join('notif_categories as c','c.id','=','n.category_id')
      ->where('n.id',$id)
      //->whereRaw(DBX::whereBinary('n.subs_id',$subs_id))
      ->selectRaw('n.id,n.detail_id,c.notif_category as category')->first();
      if(!$row) return null;
      $cat = strtolower($row->category);
      if(in_array($cat,self::$promotion_categories)){
        return Promotion::details($row->detail_id,$ss);
      } else return null;
  }

    static function markRead($notif_id, $user_id)
    {
        if (!$notif_id) return DV::error("Notification ID missing");

        DB::table('notification_reads')
            ->where('notif_id', $notif_id)
            ->where('user_id', $user_id)
            ->delete();

        DB::table('notification_reads')->insert([
            'user_id' => $user_id,
            'notif_id' => $notif_id
        ]);

        return null;
    }

    /* =====================================================
     | Mark all read (optimized)
     ===================================================== */
    static function markReadAll($user_id)
    {
        if (!$user_id) return null;

        $createdAt = DBX::createdAt();
        $startDate = dateAdd('day', -90, date('Y-m-d'), 'Y-m-d');
        $dateCond = DBX::whereDate("n.$createdAt", '>=', $startDate);

        $notifIds = DB::table('notifications AS n')
            ->whereIn('n.user_id', [$user_id, 0])
            ->where('n.is_read', 0)
            ->whereRaw($dateCond)
            ->pluck('n.id');

        if ($notifIds->isEmpty()) return null;

        $alreadyRead = DB::table('notification_reads')
            ->where('user_id', $user_id)
            ->whereIn('notif_id', $notifIds)
            ->pluck('notif_id');

        $toInsert = $notifIds->diff($alreadyRead);

        if ($toInsert->isEmpty()) return null;

        DB::table('notification_reads')->insert(
            $toInsert->map(fn ($id) => [
                'user_id' => $user_id,
                'notif_id' => $id
            ])->toArray()
        );

        return null;
    }


static function clearNotifications($ss=null){
    $str_branch_id = $ss?'branch_id ='.$ss->branch_id : '1=1';
    $start_date = dateAdd('day',-10,date('Y-m-d'),'Y-m-d');
    $create_date_field = DBX::createdAt();
    $str_date = DBX::whereDate($create_date_field, '<=',$start_date);
    $q =  DB::table('notifications')->whereRaw($str_date)->whereRaw($str_branch_id);
    $notif_count = $q->count('notifications.id');
    $q->delete();

    $qr = DB::table('notification_reads')->whereRaw(DBX::whereBinary('n.subs_id',$ss->subs_id))->whereRaw($str_date)->whereRaw($str_branch_id);
    $qr_count = $qr->count('notification_reads.id');
    $qr->delete();
    $today = date('Y-m-d');
    DB::table('notif_last_clearing_date')->whereRaw(DBX::whereBinary('n.subs_id',$ss->subs_id))->delete();
    DB::table('notif_last_clearing_date')->whereRaw(DBX::whereBinary('n.subs_id',$ss->subs_id))->insert(['last_clearing_date'=>$today]);
 
    return DV::success(['deleted'=>$notif_count,'read_notif_deleted'=>$qr_count,'message'=>$notif_count. ' notifications were deleted!']);
}


    /* =====================================================
     | Firebase project config
     ===================================================== */
  static function getFirebaseProjectId()
  {
      return Config::get('app.fcm_project_id');
  }
 
static function fcm_send($messageInfo)
{
    $serviceAccountFile = base_path('Firebase/service_account_key.json');
    $accessToken = self::getCachedFirebaseAccessToken($serviceAccountFile);

    if (!$accessToken) {
        Log::error('FCM send failed: no access token');
        return null;
    }

    $projectId = self::getFirebaseProjectId();
    $url = "https://fcm.googleapis.com/v1/projects/$projectId/messages:send";

    $headers = [
        'Authorization: Bearer ' . $accessToken,
        'Content-Type: application/json',
    ];

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_HTTPHEADER     => $headers,
        CURLOPT_RETURNTRANSFER => true,
        //CURLOPT_SSL_VERIFYPEER => false, // old code line
        CURLOPT_SSL_VERIFYPEER => true, //added as improved code
        CURLOPT_SSL_VERIFYHOST => 2,//added as improved code
        CURLOPT_POSTFIELDS     => json_encode($messageInfo),
        CURLOPT_TIMEOUT        => 8, //new code line. before it was 5
    ]);

    $result = curl_exec($ch);
    curl_close($ch);

    return $result;
}

protected static function generateJWT(string $serviceAccountFile): string
{
    $serviceAccount = json_decode(file_get_contents($serviceAccountFile), true);
    $now = time();

    $header = json_encode(['alg' => 'RS256', 'typ' => 'JWT']);
    $payload = json_encode([
        'iss'   => $serviceAccount['client_email'],
        'scope' => 'https://www.googleapis.com/auth/cloud-platform',
        'aud'   => 'https://oauth2.googleapis.com/token',
        'iat'   => $now,
        'exp'   => $now + 3600,
    ]);

    $base64UrlHeader  = rtrim(strtr(base64_encode($header), '+/', '-_'), '=');
    $base64UrlPayload = rtrim(strtr(base64_encode($payload), '+/', '-_'), '=');

    openssl_sign(
        $base64UrlHeader . '.' . $base64UrlPayload,
        $signature,
        $serviceAccount['private_key'],
        'sha256'
    );

    $base64UrlSignature = rtrim(strtr(base64_encode($signature), '+/', '-_'), '=');

    return $base64UrlHeader . '.' . $base64UrlPayload . '.' . $base64UrlSignature;
}

protected static function fetchFirebaseAccessToken(string $serviceAccountFile): ?array
{
    $jwt = self::generateJWT($serviceAccountFile);

    $ch = curl_init('https://oauth2.googleapis.com/token');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => ['Content-Type: application/x-www-form-urlencoded'],
        CURLOPT_POSTFIELDS     => http_build_query([
            'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            'assertion'  => $jwt,
        ]),
        CURLOPT_TIMEOUT        => 5,
    ]);

    $response = curl_exec($ch);
    curl_close($ch);

    $data = json_decode($response, true);
    if (!$data || empty($data['access_token'])) {
        Log::error('Firebase OAuth token fetch failed', ['response' => $response]);
        return null;
    }

    return $data; // contains access_token + expires_in
}
  protected static function getCachedFirebaseAccessToken(string $serviceAccountFile): ?string
  {
      $projectId = self::getFirebaseProjectId();
      if (!$projectId) return null;

      $cacheKey = 'firebase:fcm:access_token:' . $projectId;
      $lockKey  = 'firebase:fcm:token-lock:' . $projectId;

      // Fast path
      $cached = Cache::get($cacheKey);
      if (
          is_array($cached)
          && !empty($cached['token'])
          && time() < ($cached['expires_at'] - 60)
      ) {
          return $cached['token'];
      }

      try {
          return Cache::lock($lockKey, 10)->block(5, function () use ($cacheKey, $serviceAccountFile) {

              // Double check after lock
              $cached = Cache::get($cacheKey);
              if (
                  is_array($cached)
                  && !empty($cached['token'])
                  && time() < ($cached['expires_at'] - 60)
              ) {
                  return $cached['token'];
              }

              $tokenData = self::fetchFirebaseAccessToken($serviceAccountFile);
              if (!$tokenData) return null;

              Cache::put(
                  $cacheKey,
                  [
                      'token'      => $tokenData['access_token'],
                      'expires_at' => time() + $tokenData['expires_in'],
                  ],
                  max(60, $tokenData['expires_in'] - 60)
              );

              return $tokenData['access_token'];
          });
      } catch (\Throwable $e) {
          Log::error('Firebase token lock failure', ['error' => $e->getMessage()]);
          return null;
      }
  }

}
