$(function(){
	
	checkSupport();
	
	live = {open:0, close:0}
	hash = {artist:'',title:''}
	auth = false;
	as = new AudioSearch();
	plist = new Playlist();
	
	VK.init({apiId:1902594, nameTransportPath: '/xd_receiver.html', status: true});
	VK.Observer.subscribe('auth.login', function(response) {
		auth = true;
		$('#vk-login').hide();
		VK.Api.call('audio.search', {q: 'spor', sort: 0, count: 10, offset: 0, v: 3, test_mode: 1}, function(r){
			if (typeof r.error != 'undefined' && r.error.error_code == 7)	{
				$('#vk-login').show().find('.container').css('top',240).css('left',$(window).width()/2-150).show().find('.login').hide();
			}
		});
	});
		
	setTimeout(function(){
		if (!auth)	$('#vk-login').show().find('.container').css('top',240).css('left',$(window).width()/2-150).show();
	}, 2000);
	


	$("#jp").jPlayer({volume: 0.6,	swfPath: 'http://cdn.airy.me', cssSelectorAncestor: "#jp-interface"});
	$("#jp").bind($.jPlayer.event.ended, function(e){
		$('.row.active').next().click();
	});
	
	$("#accordion").accordion();
		
	$('.live .artist').live('click',as.getSimilar);
	
	$('.artists .artist').live('click',function(e){
		if ($(e.target).is('img')) return;
		$('.artists .active').removeClass('active');
		$(this).addClass('active');
		as.getTopTracks($(this).attr('data-artist'));
	});

	$(".results .row, #playlist .row").live('click',function(e){
		if ($(e.target).is('img')) return;
		$('.row').removeClass('active');
		$(this).addClass('active');
		if (typeof $(this).attr('data-url') != 'undefined') {
			var file = $(this).attr('data-url');
			$("#jp").jPlayer("setMedia", {mp3:file}).jPlayer("play");
		}
		else
			as.getFiles($(this));
	});

	$('.results .source').live('click', function(e) {
		var tracks = $(this).parent().parent()[0].tracks;
		var src = $(this).parent().parent()[0].source;
		src++;
		if (src > 2) src = 0;
		$(this).parent().parent()[0].source = src;
		var tr = tracks[src];
		$(this).parent().find('.dur').text(makeDur(tr.d));
		$(this).parent().parent().attr('data-url', tr.s);
		$(this).next().attr('href', tr.s).attr('data-downloadurl', 'audio/mpeg:track2:'+tr.s);
		e.preventDefault();
		$(this).parent().parent().click();

	});	
	
	$('.search .query').keydown(function(event){
		clearTimeout(live.open);
		if (event.keyCode == '13')
			as.getArtists();
		else if (event.keyCode == '27')
			$('.live').hide();
		else
			live.open = setTimeout(as.getArtists, 400);
	});
	
	$('.results .info a.add').live('click',function(e){
		var url = $(this).attr('data-url');
		var artist = $(this).parent().prev().find('b').text();
		var title = $(this).parent().prev().find('.title').text();
		plist.add(artist, title, url);
		e.preventDefault();
	});

	$('#playlist .info a').live('click',function(e) {
		plist.del($(this).attr('data-index'));
		$(this).parent().parent().remove();
	});
	

	$('.audio .live, .video .live').mouseout(function(){live.close = setTimeout(closeLive, 800)});
	$('.audio .live, .video .live').mouseover(function(){clearTimeout(live.close)});
	
	if (location.hash.length > 0) {
		var arr = location.hash.replace('#','').split('/');
		hash.artist = arr[0].replace(/\+/g,' ');
		if (typeof arr[1] != 'undefined') hash.title = arr[1].replace(/\+/g,' ');
		$('.search .query').val(hash.artist);
		as.getSimilar();
	}
	
	$('.social .share').click(function(){
		FB.ui({
			method: 'stream.publish',
			message: 'All music ever now available on facebook',
			attachment: {name: 'YAMP', caption: 'Yet Another Music Player', description: 'Find artists, listen to music, add to playlists and access this great player from anywhere.', href: 'http://apps.facebook.com/airy-player/'}, 
			action_links: [{text: 'YAMP', href: 'http://apps.facebook.com/airy-player/'}]
		}, function(response) {
			if (response && response.post_id) {
				alert('Post was published.');
			}
		});
	});
	$('.social .bookmark').click(function(){
		FB.ui({
			method: 'bookmark.add'	
		}, function(){
		
		});	
	});
	$('.social .invite').click(function(){
		var dialog = {method: 'fbml.dialog', display: 'dialog', width: '800', height: '500',
		fbml: '<fb:request-form action="http://apps.airy.me/yamp" method="POST" invite="true" type="YAMP" content="Hey, why dont you try this amazing music player I found on Facebook!"><fb:multi-friend-selector showborder="false" actiontext="Invite your friends to use YAMP!" cols="3" /></fb:request-form></fb:fbml>'
  };
		FB.ui(dialog);
	});
	
	plist.load();
});

function closeLive() {
	$('.live').hide();
}

function authVK() {
	VK.Auth.login(null, VK.access.AUDIO);
}

function checkSupport() {
	if (!Modernizr.localstorage) {
		$('body').append('<div id="overlay"><div class="info"></div></div>');
		$('#overlay .info').html('<h1>Your browser is outdated!</h1>\
														 <p>Your browser does not support <b>localStorage</b>.</p> \
														 <p>Please grab supported browser from one of the vendors below:</p>\
														 <div class="browsers"><a href="http://www.google.com/chrome/" target="_blank"><div class="chrome"></div></a>\
														 <a href="http://www.mozilla.com" target="_blank"><div class="firefox"></div></a>\
														 <a href="http://www.apple.com/safari" target="_blank"><div class="safari"></div></a>\
														 <a href="http://www.opera.com" target="_blank"><div class="opera"></div></a></div>');
		return false;
	}
	return true;	
}

//swfobject.embedSWF("assets/bridge.swf", "downloader", "300", "120", "9.0.0", "expressInstall.swf", {}, {allowScriptAccess:"always"}, {});

function flashFunction(str) {
	getMovie("downloader").alert(str);
}

function makeDur(dur) {
	return parseInt(dur / 60) + ":" + ( (dur % 60) > 9 ? dur % 60 : "0" + dur % 60 );
}
