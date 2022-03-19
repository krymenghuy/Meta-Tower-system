'use strict'
 /*** script for v-control-group class ***/
 $('div.v-control-group').each(function() {   
    $(this).find('.v-select').on('mouseover',function(e) {
        let label = $(this).prev('span.v-label');
        label.addClass('v-label-focus'); 
     }).on('mouseleave',function(e){
        let label = $(this).prev('span.v-label');
        label.removeClass('v-label-focus'); 
     });
});