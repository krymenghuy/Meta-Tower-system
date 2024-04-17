let PusherClient = new function(){
    let mThis = this;
    this.branch_id = $('meta[name="sess_branch_id"]').attr('content');
    this.user_id = $('meta[name="sess_user_id"]').attr('content'); 
    
    this.current_view_name = '';
    this.backend_channel_name = ['houex.backend.',this.branch_id].join('');
    this.pusher_channel = {'bind':()=>{ return;}};

    //pusher_app_key are in .env file, and in main.js
    //cookie_name are set in main.js, app.js, vsapi.js, loginController.php, Master.blade.php, "login/index.blade.php" 
    let pusher_app_key = '105a036ea697941d67d1'; //process.env.PUSHER_APP_KEY
    let pusher = new Pusher(pusher_app_key,{
        cluster: 'mt1',
        useTLS:true,
        disableStats:true,
        // authEndpoint:"/dms/broadcast/auth",
        //authTransport:'ajax', //two options = {'ajax','jsonp'}. The default is "ajax"
        authorizer: function authorizer(channel, options){
            return {
                authorize: function authorize(socketId, callback) {
                    let p = {"socket_id":socketId,"channel_name":channel.name};
                    vsapi.call(`${main_view.base_url}/dms/broadcast/auth`,p).then(auth_data=>{
                        console.log('Pusher authorization succeeded!');
                        //NOTE: @auth_data ={"auth":"app_key:sig"} . For example,  @auth_data = {"auth":"b7351506ee87f3eec932:3c27d88c6944726d39052efd50770468b23b0e9987e981acbc5ed58ba4bb1d51"}
                        callback(null, auth_data);
                    });
                }
            };
        }
    });
 
    pusher.connection.bind('connected',(payload)=>{
        console.info('Web socket connection successful :)');
    });
 
    mThis.pusher_channel = pusher.subscribe(`private-${mThis.backend_channel_name}`);

    mThis.pusher_channel.bind('pusher:subscription_succeeded',(d)=>{
        console.info("Channel subscription succeeded");
    });

    mThis.pusher_channel.bind('pusher:subscription_error',(d)=>{
        console.error("Channel subscription error: "+d);
    });

    mThis.pusher_channel.bind('order_image_created',d=>{
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

    mThis.pusher_channel.bind('order_image_deleted',d=>{
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

    mThis.pusher_channel.bind('package_status_changed',(d) =>{
        let data = d.data;
        //Add new notification to the notif list
        main_view.addNotificationItem({'title':data.title,'message':data.message});
        let msg = DUtil.escapeHtml(data.message);
        if (data.status_id==8) toastr.success(msg,data.title);
        else if (data.status_id==9) toastr.warning(msg,data.title);
        else toastr.info(msg,data.title);

        if(PackageListComponent.self.is(':visible')){
            let tr = PackageListComponent.findRowByBarcode(data.bar_code?data.bar_code:data.barcode);
            PackageListComponent.displayDriverData(tr,{"driver_id":data.driver_id,"driver_name":data.driver_name,'status':data.status,'status_id':data.status_id});
        }
        if (TripListComponent.self.is(':visible')){
            TripListComponent.packageStatusChanged_eventHandler(data);
        }

    });

    // mThis.pusher_channel.bind('package_status_changed', (d)=>{
    //     TripListComponent.packageStatusChanged_eventHandler(d);
    // });

    mThis.pusher_channel.bind('order_created', (d)=>{ 
        main_view.addNotificationItem({'title':d.data.title,'message':d.data.message});
        PickupListComponent.orderCreated_eventHandler(d);
    });

    mThis.pusher_channel.bind('driver_accepted_order',(d) =>{
        let data = d.data;
        toastr.success(DUtil.escapeHtml(data.message),data.title?data.title:'Order Accepted');
        main_view.addNotificationItem({'title':data.title,'message':data.message});

        if(PickupListComponent.tblPickups.is(':visible')){
            let tr = PickupListComponent.findRowByOrdderId(data.order_id);
            PickupListComponent.updatePickupStatus(tr,data);
        }
    });

    mThis.pusher_channel.bind( 'driver_canceled_order',(d) =>{
        let data = d.data;
        toastr.success(DUtil.escapeHtml(data.message),data.title?data.title:'Order Canceled');
        main_view.addNotificationItem({'title':data.title,'message':data.message});

        if(PickupListComponent.tblPickups.is(':visible')){
            let tr = PickupListComponent.findRowByOrdderId(data.order_id);
            PickupListComponent.updatePickupStatus(tr,data);
        }
    });

    mThis.pusher_channel.bind('pickup_driver_changed',(d) =>{
        let data = d.data;
        if(PickupListComponent.tblPickups.is(':visible')){
            toastr.success(DUtil.escapeHtml(data.message),'Pickup Driver Changed',data.title?data.title:'Pickup Driver Changed');
            main_view.addNotificationItem({'title':data.title,'message':data.message});

            let tr = PickupListComponent.findRowByOrdderId(data.order_id);
            PickupListComponent.updatePickupStatus(tr,data);
        }
    });

    mThis.pusher_channel.bind( 'order_status_changed',(d) =>{
        let data = d.data;

        if(PickupListComponent.tblPickups.is(':visible')){
            main_view.addNotificationItem({'title':data.title,'message':data.message});
            toastr.success(DUtil.escapeHtml(data.message),data.title?data.title:'Order Status');

            let tr = mThis.findRowByOrdderId(data.order_id);
            mThis.updatePickupStatus(tr,data);
        } 
    });
                    
    mThis.pusher_channel.bind('order_deleted',(d) =>{
        let data = d.data;
        toastr.error(DUtil.escapeHtml(data.message),'Order Deleted',data.title?data.title:'Order Deleted');
        main_view.addNotificationItem({'title':data.title,'message':data.message});
        if(PickupListComponent.tblPickups.is(':visible')){
            let tr = mThis.findRowByOrdderId(data.order_id);
            tr.remove();
            PickupListComponent.tblPickups.find('tr.package_list[data-orderid="'+data.order_id +'"]').remove();
        }
    });
 

    mThis.pusher_channel.bind('message_received', function(data) {
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
}