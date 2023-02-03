    
    var PusherClient = new function(){
        let mThis = this;
        this.branch_id = $('meta[name="sess_branch_id"]').attr('content');
        this.user_id = $('meta[name="sess_user_id"]').attr('content'); 
       
        this.current_view_name = '';
        this.backend_channel_name = ['vsmclinic.backend.',this.branch_id].join('');
        this.pusher_channel = {'bind':()=>{ return;}};


         //###begin::connect and then subscript to backend channel (Using internet-based Pusher service)
           //let csrf_token = $('meta[name="csrf-token"]').attr('content'); //not yet used
           //begin::get access token from cookie
                    // let cookie_name = 'vsmclinic997891zb';
                    // let access_token = null;
                    // let c_match = document.cookie.match(new RegExp('(^| )' + cookie_name + '=([^;]+)'));
                    // if (c_match) access_token = c_match[2]; 
            //end::get access token from cookie

            //pusher_app_key are in .env file, and in main.js
            //cookie_name are set in main.js, app.js, vsapi.js, loginController.php, Master.blade.php, "login/index.blade.php" 
            let pusher_app_key = 'b7351506ee87f3eec932'; //process.env.PUSHER_APP_KEY
            let pusher = new Pusher(pusher_app_key,{
                cluster: 'mt1',
                useTLS:true,
                disableStats:true,
               // authEndpoint:"/api/broadcast/auth",
                //authTransport:'ajax', //two options = {'ajax','jsonp'}. The default is "ajax"
                authorizer: function authorizer(channel, options){
                    return {
                            authorize: function authorize(socketId, callback) {
                                let p = {"socket_id":socketId,"channel_name":channel.name};
                                vsapi.call(`${main_view.base_url}/api/broadcast/auth`,p).then(auth_data=>{
                                    console.log('Pusher authorization succeeded!');
                                    //NOTE: @auth_data ={"auth":"app_key:sig"} . For example,  @auth_data = {"auth":"b7351506ee87f3eec932:3c27d88c6944726d39052efd50770468b23b0e9987e981acbc5ed58ba4bb1d51"}
                                    callback(null, auth_data);
                                    // if(res.status_code===200){
                                    //     //console.error(JSON.stringify(res.data));
                                    //     callback(null, res.data);
                                    // }else {
                                    //     console.error(res.error_message); 
                                    // }
                                });

                            }

                    };
                }

            });
 
            pusher.connection.bind('connected',(payload)=>{
                //console.info('Connected to web socket with payload ' + JSON.stringify(payload));
                console.info('Web socket connection successful :)');
            });
 
            //begin::Channel subscription
                mThis.pusher_channel = pusher.subscribe(`private-${mThis.backend_channel_name}`);

                mThis.pusher_channel.bind('pusher:subscription_succeeded',(d)=>{
                        console.info("Channel subscription succeeded");
                });

                mThis.pusher_channel.bind('pusher:subscription_error',(d)=>{
                        console.error("Channel subscription error: "+d);
                });

            mThis.pusher_channel.bind('appointment_created',d=>{
                    //d.img = {id,imgage_url}
                    let data = d.data;
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: data.message,
                        toast:true,
                        showConfirmButton: false,
                        timer:2000,
                        showClass: {
                            popup: 'animate__animated animate__fadeInDown'
                        },
                    });
        
                    let order_id = data.order?data.order.id:0;
                    let image_count = (data.order || {}).image_count; 
                    OrderImagesComponent.addImage(order_id,data.img,image_count);
            });

            mThis.pusher_channel.bind('payment_received',d=>{
                //d.img = {id,imgage_url}
                let data = d.data;
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: data.message,
                    toast:true,
                    showConfirmButton: false,
                    timer:2000,
                    showClass: {
                        popup: 'animate__animated animate__fadeInDown'
                    },
                });
    
                let order_id = data.order_id;
                OrderImagesComponent.removeImage(order_id,data.image_id,data.image_count);
            });
 

           
 

            //subscript to Pusher event
            mThis.pusher_channel.bind('message_received', function(data) {
                //alert(JSON.stringify(data));
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: JSON.stringify(data),
                    toast:true,
                    showConfirmButton: false,
                    timer:2000,
                    showClass: {
                        popup: 'animate__animated animate__fadeInDown'
                    },
                });
            });

         //end::Channel subscription

        //###end::connect and then subecribe to backend channel
    }

   