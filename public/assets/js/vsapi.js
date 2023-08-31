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

  async function handleDebouncedFetch(url, options, loader, agent) {
    try {
      if (loader && loader instanceof jQuery) {
        loader.show();
      } else if (loader) {
        loader.style.display = 'block';
      }

      const response = await fetch(url, options);
      const data = await response.json();

      if (!response.ok) {
        if (data.status_code === 401 || data.status_code === 402) {
          window.location.href = '/';
        } else if (data.status_code === 403) {
          console.error('Error status 403 at url ' + url);
          window.location.href = '/';
        } else if (data.status_code === 405) {
          console.error('Error status 405: method not allowed at url ' + url);
        } else if (data.status_code === 500) {
          console.error('Error status 500 at ' + url);
        }
        throw new Error(JSON.stringify(data));
      }

      return data;
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
    const access_token = document.cookie.split('; ').find(row => row.startsWith('vsksm997878za')).split('=')[1];

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
    const access_token = document.cookie.split('; ').find(row => row.startsWith('vsksm997878za')).split('=')[1];

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
