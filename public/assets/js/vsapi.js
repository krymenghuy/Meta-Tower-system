"use strict";

const vsapi = (function () {
  const api = {};

  const maxRetries = 3; // Maximum number of retries
  let retryCount = 0;
  const retryDelay = 1000; // Initial retry delay in milliseconds (1 second)
 
  let defaultLoader = null;
  let connectionLostAlertCount = 0; // Counter for connection lost alerts
  let isAPICallInProgress = false; // Flag to track ongoing API calls

  window.addEventListener('DOMContentLoaded', e => {
    defaultLoader = document.getElementById('vs_loader');
  });

  // Listen for online and offline events
  window.addEventListener('online', () => {
    connectionLostAlertCount = 0; // Reset the alert count when the user is online
  });

  window.addEventListener('offline', () => {
    // Increment the alert count when the user is offline
    connectionLostAlertCount++;
    toastr.warning('It seems your connection is temporarily lost');
    // Show connection lost alert up to 3 times
    if (connectionLostAlertCount <= 3) {
      cv_interact.warning('It seems your connection is lost');
    } else if (connectionLostAlertCount === 4) {
      // Log the user out after the 4th alert
      window.location.href = '/';
    }
  });

  // Debounce function implementation
  function debounce(func, wait) {
    let timeout;

    return function (...args) {
      if (!isAPICallInProgress) {
        // If there is no ongoing API call, execute the function immediately
        func.apply(this, args);
      } else {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          func.apply(this, args);
        }, wait);
      }
    };
  }

  // Check for network-related errors
  function isNetworkError(error) {
    return (
      error instanceof TypeError && (
        error.message.includes('Failed to fetch') ||
        error.message.includes('ERR_CONNECTION_REFUSED') ||
        error.message.includes('ERR_NETWORK_CHANGED') ||
        error.message.includes('Failed to load resource')
      )
    );
  }

  //handleCustomerErrorCode() will handle only error code such as status_code = 401|402|403. It does not handle status 200 and 405 (custom validation error code)
  function handleCustomerErrorCode(res, url = null) {
    res = res ? res : {};
    const status_code = res.status_code;
    if ([401, 402, 403].indexOf(status_code) >= 0) {
      // 401: User authentication failed
      // status 403: 'CSRF Token is not correct'
      // status: 402: Token expired
      window.location.href = '/';
    } else if (status_code === 405) {
      throw new Error('Error status 405: method not allowed at url ' + url);
    } else if (status_code === 500) {
      throw new Error('Error status 500 at ' + url);
    } else return res;
  }
 
  async function handleDebouncedFetch(url, options, loader, agent) {
    try {
      isAPICallInProgress = true; // Set the flag to true when an API call starts

      const response = await fetch(url, options);
      //const res = await response.json();

      if (response.status === 429) {
        // Handle the 429 error here
        toastr.error('It seems unusal that you have made too many requests or too many clicks. Wait a moment for server to respond :)');
        // You can implement retry logic or show a message to the user
       
          if (retryCount < maxRetries) {
            // Calculate the next retry delay using exponential backoff
            const nextRetryDelay = retryDelay * Math.pow(2, retryCount);
            // Increment the retry count
            retryCount++;
    
            // Wait for the specified delay and then retry
            await new Promise(resolve => setTimeout(resolve, nextRetryDelay));
            return handleDebouncedFetch(url, options, loader, agent);
          } else {
            console.error('429 Too Many Requests: Max retries exceeded');
            throw new Error('429 Too Many Requests');
          }
          

      } else if (response.ok) {
        retryCount=0;
        const res = await response.json();
        if ([200, 405].indexOf(res.status_code) >= 0) return res;
        return handleCustomerErrorCode(res, url);
        // Handle successful response
      } else {
          // Handle other non-429 error codes here
          //console.error('HTTP error:', response.status);

          if (isNetworkError(response)) {
            return {};
          } else throw new Error(JSON.stringify(response));
      }
      
    } catch (error) {
      if (isNetworkError(error)) {
        // This is a network-related error, you can handle it here
        toastr.error('It seems your connection is temporarily lost');
        cv_interact.warning('It seems your connection is lost');
        return {};
      } else {
        // in production mode, disable this error show
        console.error(error + ' Error at url =>  ' + url);
        // throw error;
      }
    } finally {
      isAPICallInProgress = false; // Reset the flag when the API call is completed

      if (loader && loader instanceof jQuery) {
        loader.hide();
      } else if (loader) {
        loader.style.display = 'none';
      }
      if (agent && (agent instanceof jQuery || agent.classList)) {
        if (agent instanceof jQuery) agent.removeClass('btn-working');
        else agent.classList.remove('btn-working');
      }
    }
  }

  // Create debounced versions of vsapi.call(), vsapi.post(), and vsapi.get()
  const debouncedCall = debounce(api.call, 300); // 300ms debounce delay
  const debouncedPost = debounce(api.post, 300); // 300ms debounce delay
  const debouncedGet = debounce(api.get, 300); // 300ms debounce delay

  api.get = async (url, params = null, loader = null, agent = null) => {
    loader = loader === null ? defaultLoader : false;
    return handleDebouncedFetch(url, {}, loader, agent);
  };

  api.post = async (url, data = {}, agent = null, loader = null) => {
    loader = loader === null ? defaultLoader : false;
    let access_token = null;
    let cookie = document.cookie.split('; ').find(row => row.startsWith('vsksm997878za'));
    if (cookie) access_token = cookie.split('=')[1];

    const options = {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`
      }
    };

    if (agent && (agent instanceof jQuery || agent.classList)) {
      if (agent instanceof jQuery) agent.addClass('btn-working');
      else agent.classList.add('btn-working');
    }

    return handleDebouncedFetch(url, options, loader, agent);
  };

  api.call = async (url, data = {}, agent = null, loader = null) => {
    loader = loader === null ? defaultLoader : false;
    let access_token = null;
    let cookie = document.cookie.split('; ').find(row => row.startsWith('vsksm997878za'));
    if (cookie) access_token = cookie.split('=')[1];

    const options = {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`
      }
    };

    if (agent && (agent instanceof jQuery || agent.classList)) {
      if (agent instanceof jQuery) agent.addClass('btn-working');
      else agent.classList.add('btn-working');
    }

    return handleDebouncedFetch(url, options, loader, agent);
  };

  // Export the debounced functions
  api.debouncedCall = debouncedCall;
  api.debouncedPost = debouncedPost;
  api.debouncedGet = debouncedGet;

  // Return the modified api object
  return api;
})();