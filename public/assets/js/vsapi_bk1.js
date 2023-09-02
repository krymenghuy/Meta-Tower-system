"use strict";

const vsapi = (function () {
  const api = {};

  let defaultLoader = null;
  window.addEventListener('DOMContentLoaded', e => {
    defaultLoader = document.getElementById('vs_loader');
  });

  // Debounce function implementation
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  //handleCustomerErrorCode() will handle only error code such as status_code = 401|402|403. It does not handle status 200 and 405 (custom validation error code)
  function handleCustomerErrorCode(res,url=null){
    if ([401,402,403].indexOf(res.status_code)>=0){
      //401: User authentication failed
      //status 403: 'CSRF Token is not correct'
      //status: 402: Token expired
      window.location.href = '/';
    }else if (res.status_code === 405) {
      throw new Error('Error status 405: method not allowed at url ' + url);
    } else if (res.status_code === 500) {
      throw new Error('Error status 500 at ' + url);
    } else return res;
  }

  async function handleDebouncedFetch(url, options, loader, agent) {
    try {
      
      // if (loader && loader instanceof jQuery) {
      //   loader.show();
      // } else if (loader) {
      //   loader.style.display = 'block';
      // }

      const response = await fetch(url, options);
      const res = await response.json();

      if (response.ok){
        //handle custom's error code
        if([200,405].indexOf(res.status_code) >=0) return res;
        return handleCustomerErrorCode(res,url);
      } 
      else throw new Error(JSON.stringify(response));

    } catch (error) {
      console.error(error + ' Error at url =>  ' + url);
      throw error;
    } finally {
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
  const debouncedGet = debounce(api.get, 300);   // 300ms debounce delay

  api.get = async (url, params = null, loader = null, agent = null) => {
    loader = loader === null ? defaultLoader : false;
    return handleDebouncedFetch(url, {}, loader, agent);
  };

  api.post = async (url, data = {}, agent = null, loader = null) => {
    loader = loader === null ? defaultLoader : false;
    let access_token = null;
    let cookie = document.cookie.split('; ').find(row => row.startsWith('vsksm997878za'));
    if(cookie) access_token = cookie.split('=')[1];

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
    if(cookie) access_token = cookie.split('=')[1];

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
