// Checks the browser and adds classes to the body to reflect it.
// Internet explorer: ie + ie9|ie8|ie7
// Mozilla: mozilla
// Firefox:  firefox + firefox36|firefox35|firefox20
// Chrome: chrome + chrome5|chrome4
// Safari: safari + safari5|safari4
// Opera: opera + opera10|opera96
jQuery(document).ready(function($){
   
	var userAgent = navigator.userAgent.toLowerCase();
	$.browser.chrome = /chrome/.test(navigator.userAgent.toLowerCase()); 
	
	if ($.browser.msie) {
		$('body').addClass('ie');
		$('body').addClass('ie' + $.browser.version.substring(0,1));
	}
	
	if ($.browser.chrome) {
		$('body').addClass('chrome');
		userAgent = userAgent.substring(userAgent.indexOf('chrome/') +7);
		userAgent = userAgent.substring(0,1);
		$('body').addClass('chrome' + userAgent);
		$.browser.safari = false;
	}
	
	if ($.browser.safari) {
		$('body').addClass('safari');
		userAgent = userAgent.substring(userAgent.indexOf('version/') +8);
		userAgent = userAgent.substring(0,1);
		$('body').addClass('safari' + userAgent);
	}
	
	if ($.browser.mozilla) {
		if(navigator.userAgent.toLowerCase().indexOf('firefox') != -1) {
			$('body').addClass('firefox');
			userAgent = userAgent.substring(userAgent.indexOf('firefox/') +8);
			userAgent = userAgent.substring(0,3).replace('.','');
			$('body').addClass('firefox' + userAgent);
		}	else
			$('body').addClass('mozilla');
	}
	
	if ($.browser.opera) {
		$('body').addClass('opera' + $.browser.version.substring(0,3).replace('.',''));
	}    
});