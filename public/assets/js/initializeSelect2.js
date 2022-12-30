 
 window.addEventListener('load',function(){
	        //ensure search box can be typed or focus mouse cursor on bootstrap Modal dialog
            $.fn.modal.Constructor.prototype._enforceFocus = function() { return;};
			
            //Convert normal Select box to Select2. css class "modal-select2" for Select box on modal dialog only,
            $(document).find('select.select2').select2({
              width:'resolve'
              // event 'select2:close' is used instead of 'blur' event
            }).on('select2:close',function(e){
                if(Validator){
                  if(typeof Validator.onLostFocus_select2==='function') Validator.onLostFocus_select2($(this));
                }
            });

            $(document).find('select.modal-select2').select2({
              width:'100%'
              // event 'select2:close' is used instead of 'blur' event
            }).on('select2:close',function(e){
                if(Validator){
                   if(typeof Validator.onLostFocus_select2==='function') Validator.onLostFocus_select2($(this));
                }
            });  
			
 });