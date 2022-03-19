window.addEventListener('load',function(){
           //Set Default Home View => supposed to be dashboard, but now show Pickup List instead
// <<<<<<< HEAD
           DashboardComponent.show({'title':'Dashboard'});
// =======
//             PickupListComponent.show({'title':'Pickup Center'});
// >>>>>>> c1ed4f56b5eb7d45ce133a35e34806d1588e82e4
           //ensure search box can be typed or focus mouse cursor on bootstrap Modal dialog
           $.fn.modal.Constructor.prototype._enforceFocus = function() { return;};
           //Convert normal Select box to Select2. css class "modal-select2" for Select box on modal dialog only,
            $(document).find('select.select2').select2({
              width:'resolve'
            });
            $(document).find('select.modal-select2').select2({
              width:'100%'
            });  
});
