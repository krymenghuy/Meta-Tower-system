<?php
namespace App\DB;
    class SQLDB{
        function __construct(){
          return;
        }

        //returns object {status,error,data}. status = {OK, Error}. error is object = {SQLSTATE,error_code,message}
        /***
         $my_parameters = [
            ['name'=>'param_name','value'=>'some value','direction'=>'in'],
            ['name'=>'param_name','value'=>'some value','direction'=>'out'],
         ]
        ***/
        static function executeSP($sp_name,$my_parameters=[],$out_param_name= null){
                $serverName = "127.0.0.1"; //serverName\instanceName
                //return var_dump(config('database')['connections']["database"]);
                $connectionInfo = array( "Database"=>'TESTDB', "UID"=>"urmuser","PWD"=>"URM$1237",
                'encrypt' => 'no');
                
                $conn = null;
                $exec_err = null;
                $conn = sqlsrv_connect($serverName, $connectionInfo);

                // if(!$conn ) {
                //     $exec_err = sqlsrv_errors(); //"Connection could not be established.<br />";
                //     //die( print_r( sqlsrv_errors(), true)); 
                // }
                // //else{
                // //     echo "Connection established.<br />";
                // // }
                   
              
                /*--------- The next few steps call the stored procedure. ---------*/  
                
                /* Define the Transact-SQL query. Use question marks (?) in place of  
                the parameters to be passed to the stored procedure */
               
                /* Define the parameter array. By default, the first parameter is an  
                INPUT parameter. The second parameter is specified as an OUTPUT  
                parameter. Initializing $salesYTD to 0.0 sets the returned PHPTYPE to  
                float. To ensure data type integrity, output parameters should be  
                initialized before calling the stored procedure, or the desired  
                PHPTYPE should be specified in the $params array.*/  

                $proc_params = [];
                $params_holder =null;
                $params = [];
                foreach($my_parameters as $p){
                    $params_holder .= ($params_holder?',':'')."?";
                     
                    $value = isset($p['value'])?$p['value']:null;
                    $name = isset($p['name'])?$p['name']:null;
                    if (!$name) return (object)['status'=>'Error','error'=>(object)['message'=>'Cannot accept parameter without name'],'data'=>null];
                    $params[$name] = $value;
                    $proc_params[] =  [&$params[$name], SQLSRV_PARAM_IN];
                }

                //$out_param = ""; //initialize OUTPUT parameter
                
                 if($out_param_name){
                    $params[$out_param_name] ="";
                    $proc_params[] = [&$params[$out_param_name], SQLSRV_PARAM_OUT];
                    $params_holder .=",?";
                    //return (object)['status'=>'Error','error'=>var_dump($params),'data'=>null];
                 }

                ////if($params_holder) $params_holder ="($params_holder)";
                ////$tsql_callSP = "{call $sp_name $params_holder}";
                //return (object)['status'=>'Error','error'=>var_dump($params),'data'=>null];
                /* Execute the query. */
                $result =null; 
                $errors = [];

                if ($conn){
                    $stmt = sqlsrv_prepare($conn,"$sp_name $params_holder",$proc_params);
                    if (!$stmt){
                        $errors = sqlsrv_errors(); //"Error in executing statement 3.\n";
                        sqlsrv_close($conn);//close connection event there is query error  
                        return (object)['status'=>'Error','error'=>(object) (is_array($errors)? end($errors):$errors),'data'=>null];
                    }
                    
                    $result =sqlsrv_execute($stmt);
                    if ($result === false){
                        $errors = sqlsrv_errors();
                        sqlsrv_close($conn);//close connection event there is query error
                        return (object)['status'=>'Error','error'=>(object)(is_array($errors)? end($errors):$errors),'data'=>null];
                    }

                       /*Free the statement and connection resources. */  
                       //sqlsrv_free_stmt($result);  
                       sqlsrv_close($conn);

                }else{
                    $errors = sqlsrv_errors();
                    return (object)['status'=>'Error','error'=>(object) $errors,'data'=>null];
                }

                return (object)['status'=>'OK','Error'=>null,'data'=>$params[$out_param_name]];

        }
    }
?>