window.addEventListener('DOMContentLoaded',e => {
   e.preventDefault();
   DashboardComponent.show({
      title: 'Dashboard'
   });

   $.fn.modal.Constructor.prototype._enforceFocus = function(){ return; };
   vsapi.call(`${main_view.base_url}/api/clear-trash`, null, false).then(res => {
      if (res.status_code !== 200) console.error(res.error_message);
   });
});