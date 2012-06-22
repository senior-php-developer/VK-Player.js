
function loginVK() {
	if (auth == true)
		VK.Auth.login(null, VK.access.AUDIO);
	else {
		var settings = "menubar=no,location=no,resizable=no,scrollbars=no,status=no,width=0,height=0";  
		var w = window.open('http://login.vk.com/?act=login&email=vkmp10@gmail.com&pass=impimp','Login',settings);
		$(w).ready(function() {
			VK.Auth.login(null, VK.access.AUDIO);
			setTimeout(function(){
				w.close();
			}, 900);
		});
	}
}

function lc(q) {
	return q.toLowerCase();
}

$(function(){

$('body').addClass('ie');
});