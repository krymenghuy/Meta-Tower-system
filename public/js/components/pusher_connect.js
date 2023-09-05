var PusherClient = new function () {
    let mThis = this;
    this.branch_id = $('meta[name="sess_branch_id"]').attr('content');
    this.user_id = $('meta[name="sess_user_id"]').attr('content');

    this.current_view_name = '';
    this.backend_channel_name = ['vsksmkidsworld.backend.', this.branch_id].join('');
    this.pusher_channel = { 'bind': () => { return; } };

    //###begin::connect and then subscript to backend channel (Using internet-based Pusher service)
    //pusher_app_key are in .env file, and in main.js
    //cookie_name are set in main.js, app.js, vsapi.js, loginController.php, Master.blade.php, "login/index.blade.php" 
    const pusher_app_key = '23c76a62b1a7d4f37586'; //process.env.PUSHER_APP_KEY
    Pusher.logToConsole = true;
    const pusher = new Pusher(pusher_app_key, {
        cluster: 'ap1',
        useTLS: true,
        debug:true,
        //disableStats: false,
        authorizer: function authorizer(channel, options) {
            return {
                authorize: function authorize(socketId, callback) {
                    const p = { "socket_id": socketId, "channel_name": channel.name };
                    vsapi.call(`${main_view.base_url}/api/broadcast/auth`, p).then(res => {
                        console.log('Pusher authorization succeeded!');
                        //res.data is supposed to be the @auth_datas
                        /** IMPORTANT NOTE: the wierd thing is that in the PushController
                           $auth = $pusher->socket_auth($channel_name, $socket_id);
                            $auth is undexpectedly a JSON string, not an object, that needs to be put into json_decode() and then respond to frontent using JDV::result(json_decode($auth))  => that makes Channel subecruption succeeded
                         */
                        const auth_data =res.data;
                        //NOTE: @auth_data ={"auth":"app_key:sig"} . For example,  @auth_data = {"auth":"b7351506ee87f3eec932:3c27d88c6944726d39052efd50770468b23b0e9987e981acbc5ed58ba4bb1d51"}
                        //callback('Some problem occurred during channel authentication!',res.data);
                        callback(null,res.data);
                    });
                }
            };
        }
    });

    pusher.connection.bind('connected', (payload) => {
        console.info('Web socket connection successful :)');
    });

    //begin::Channel subscription
    mThis.pusher_channel = pusher.subscribe(`private-${mThis.backend_channel_name}`);  
    mThis.pusher_channel.bind('pusher:subscription_succeeded', (d) => {
        console.info("Channel subscription succeeded");
    });
 
    mThis.pusher_channel.bind('pusher:subscription_error', (d) => {
        console.error("Channel subscription error: " + d);
    });
    // mThis.pusher_channel.bind('appointment_created', d => {
    //     let data = d.data;
    //     Swal.fire({
    //         position: 'top-end',
    //         icon: 'success',
    //         title: data.message,
    //         toast: true,
    //         showConfirmButton: false,
    //         timer: 2000,
    //         showClass: {
    //             popup: 'animate__animated animate__fadeInDown'
    //         },
    //     });

    //     let order_id = data.order ? data.order.id : 0;
    //     let image_count = (data.order || {}).image_count;
    //     OrderImagesComponent.addImage(order_id, data.img, image_count);
    // });

  this.audioQueue = [];
  this.isPlaying = false; // Track if audio is currently playing
  this.audioDelay = 5000; // Set the delay between audio playback in milliseconds

  this.playing = false; // Add a flag to track if audio is currently playing

    this.playAudio = () => {
        if (this.playing || this.audioQueue.length === 0) {
            return; // Exit the function if audio is already playing or the queue is empty
        }

        this.playing = true; // Set the flag to indicate audio is playing
        const nextAudio = this.audioQueue.shift();
        const audioPlayer = new Audio(nextAudio.file_url);

        audioPlayer.addEventListener('ended', () => {
            // Add the current audio back to the end of the queue for continuous looping
            this.audioQueue.push(nextAudio);
            this.playing = false; // Reset the flag to indicate audio has finished playing
            this.playAudio(); // Play the next audio immediately
        });

        audioPlayer.play().catch(() => {
            // Handle autoplay error here
            cv_interact.warning("Please enable autoplay in your browser settings to hear the audio.");
            this.playing = false; // Reset the flag on autoplay error
        });
    };

     
    //subscript to Pusher event
    mThis.pusher_channel.bind('message_received', function (data) {
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: JSON.stringify(data),
            toast: true,
            showConfirmButton: false,
            timer: 2000,
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
        });
    });

   // Pusher event handler for 'pickup_call'
   mThis.pusher_channel.bind('pickup_call', function (data) {
    const d = data.data;
    if (!mThis.audioQueue) mThis.audioQueue = [];
    mThis.audioQueue.push({ 'student_id': d.student_id, 'file_url': d.file_url });
  
    // Trigger playAudio() when the 'pickup_call' event is received
    mThis.playAudio();
  });

    // Pusher event handler for 'student_scan_out'
   mThis.pusher_channel.bind('student_scan_out', function (data) {
    const d = data.data;
    // Remove the student from the audio queue based on student_id
    mThis.audioQueue = mThis.audioQueue.filter(item => item.student_id !== d.student_id);
  });

    //end::Channel subscription
    //###end::connect and then subecribe to backend channel
}