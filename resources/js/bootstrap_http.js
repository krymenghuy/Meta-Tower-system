window._ = require('lodash');

/**
 * We'll load jQuery and the Bootstrap jQuery plugin which provides support
 * for JavaScript based Bootstrap features such as modals and tabs. This
 * code may be modified to fit the specific needs of your application.
 */

// try {
//     window.Popper = require('popper.js').default;
//     window.$ = window.jQuery = require('jquery'); // jquery already loaded 
//     require('bootstrap');
// } catch (e) {}

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

window.axios = require('axios');
let user_token = $('meta[name="csrf-token"]').attr('content');
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
if (user_token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = user_token;
    //set access token ( token that is received then user sucessfully logged in). This token is stored encrypted in cookie named "da337_acctk_1298XA" 
    //window.axios.defaults.headers.common['acc_tk_dms'] = _getCookieValue('da337_acctk_1298XA');
    //Web Admin users use DMS system by loggin in Web application, so they are authenticated using login_name and password, 
    //but Srever also generates access_token stored in table um_sessions too. And the generated access_token is stored in cookie named "da337_acctk_1298XA"
    //Websocket authenticates user the same way as Mobile app api, but NOTE that the access_token here is different format from Mobile app api's bearerToken because
    //this token is stored in cookie with = sign in it. therefore, we use Hephers:getSessionInfo() to digest it. Hephers:getSessionInfo() looks for "acc_tk_dms"
    //For Mobile api authentication, we use UM->getUserInfoByToken($request). It looks for $request->bearerToken()  

    //***start: read cookie for access token
    let cookie_name = 'da337_acctk_1298XA';
    let access_token = null;
    let c_match = document.cookie.match(new RegExp('(^| )' + cookie_name + '=([^;]+)'));
    if (c_match) access_token = c_match[2];
    //*** end:: read cookie for access token 
    window.axios.defaults.headers.common['Authorization'] = "Bearer " + access_token;
} else {
    console.error('CSRF TOKEN not found in Master page!');
}
/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

import Echo from 'laravel-echo';

window.Pusher = require('pusher-js');
/** connecting to public Channel **/
// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: process.env.MIX_PUSHER_APP_KEY,
//     cluster: process.env.MIX_PUSHER_APP_CLUSTER,
//     forceTLS: false,
//     //disableStats: false,
//     wsHost:window.location.hostname,
//     wsPort:6001
// });

///** connecting to private Channel **/
////let user_token = document.head.querySelector('meta[name="csrf-token"]').attr('content').content;
////window.Laravel = {'csrfToken':user_token};

// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: process.env.MIX_PUSHER_APP_KEY,
//     cluster: process.env.MIX_PUSHER_APP_CLUSTER,
//     //disableStats: false,
//     httpHost:window.location.hostname,
//     wsHost:window.location.hostname,
//     wsPort:6001, // process.env.WEBSOCKETS_PORT,
//     wssPort: 6001, //process.env.WEBSOCKETS_PORT,
//     forceTLS:true,
//     enabledTransports: ['ws', 'wss','https','http'],
//     encrypted: true,
//     authEndpoint: '/api/broadcast/auth',
//     auth: {
//         headers: {
//             'X-CSRF-TOKEN': user_token, 
//             Accept: 'application/json',
//             Authorization: 'Bearer '+user_token
//             // branch_id:1,
//             // user_id:1
//         },
//     },
// });


window.Echo = new Echo({
    broadcaster: 'pusher',
    key: process.env.MIX_PUSHER_APP_KEY,
    cluster: process.env.MIX_PUSHER_APP_CLUSTER,
    //disableStats: false,
    httpHost: window.location.hostname,
    wsHost: window.location.hostname,
    wsPort: 6001,// process.env.WEBSOCKETS_PORT,
    wssPort: 6001,// process.env.WEBSOCKETS_PORT,
    //forceTLS:true,
    useTLS: false,
    enabledTransports: ['ws', 'wss'],
    //encrypted: true,
    authorizer: (channel, options) => {
        return {
            authorize: (socketId, callback) => {
                axios.post('/api/broadcast/auth', {
                    socket_id: socketId,
                    channel_name: channel.name
                })
                    .then(response => {
                        if (response.status == 403)
                            console.log("axios unable to subscribe to channel " + channel.name + ". Response data => " + JSON.stringify(response.data));
                        else if (response.status == 200) {
                            if (response.data == "Forbidden")
                                console.log("axios unable to subscribe to channel " + channel.name + ". Response data => " + JSON.stringify(response));
                            else
                                console.log("axios successfully subscribed to channel " + channel.name + " successfully. Response data => " + JSON.stringify(response.data));
                        }
                        else console.log("axios unable to subscribe to channel " + channel.name + ". Response data => " + JSON.stringify(response.data));
                        callback(false, response.data);
                    })
                    .catch(error => {
                        console.error("axios encountered error in connecting to web socket. Error => " + JSON.stringify(error));
                        callback(true, error);
                    });
            }
        };
    },
});

// window.Echo.connector.pusher.connection.bind('connecting', (payload) => {
//     /**
//      * All dependencies have been loaded and Channels is trying to connect.
//      * The connection will also enter this state when it is trying to reconnect after a connection failure.
//      */

//     let p = payload;
//     if (payload != null && typeof payload == 'object') p = JSON.stringify(p);
//     console.log('connecting...', p);

// });

window.Echo.connector.pusher.connection.bind('connected', (payload) => {
    /**
     * The connection to Channels is open and authenticated with your app.
     */

    let p = payload;
    if (payload != null && typeof payload == 'object') p = JSON.stringify(p);
    console.log('connected', p);
});

window.Echo.connector.pusher.connection.bind('unavailable', (payload) => {

    /**
     *  The connection is temporarily unavailable. In most cases this means that there is no internet connection.
     *  It could also mean that Channels is down, or some intermediary is blocking the connection. In this state,
     *  pusher-js will automatically retry the connection every 15 seconds.
     */

    let p = payload;
    if (payload != null && typeof payload == 'object') p = JSON.stringify(p);
    console.log('Websocket unavailable ', p ? p : ' NULL is returned ');
});

window.Echo.connector.pusher.connection.bind('failed', (payload) => {
    /**
     * Channels is not supported by the browser.
     * This implies that WebSockets are not natively available and an HTTP-based transport could not be found.
     */
    let p = payload;
    if (payload != null && typeof payload == 'object') p = JSON.stringify(p);
    console.log('failed', p);

});

window.Echo.connector.pusher.connection.bind('disconnected', (payload) => {
    /**
     * The Channels connection was previously connected and has now intentionally been closed
     */

    let p = payload;
    if (payload != null && typeof payload == 'object') p = JSON.stringify(p);
    console.log('disconnected...', p);

});

window.Echo.connector.pusher.connection.bind('message', (payload) => {
    /**
     * Ping received from server
     */

    let p = payload;
    if (payload != null && typeof payload == 'object') p = JSON.stringify(p);
    console.log('message', p);
});

