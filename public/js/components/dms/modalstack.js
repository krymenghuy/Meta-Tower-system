 $(document).ready(function() {
	$('.modal').on('show.bs.modal', function(event) {
    var idx = $('.modal:visible').length;
    $(this).css('z-index', 1040 + (10 * idx));
	});
	
	$('.modal').on('shown.bs.modal', function(event) {
		var idx = ($('.modal:visible').length) -1; // raise backdrop after animation.
		$('.modal-backdrop').not('.stacked').css('z-index', 1039 + (10 * idx));
		$('.modal-backdrop').not('.stacked').addClass('stacked');
	});	
  });