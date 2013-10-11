function AudioSearch() {
	var query = '';
	var sort = 1;
	var offset = 0;
	var found = {};
	var cur = null;
	var list = {artist:'',title:''}
	var url = 'http://ws.audioscrobbler.com/2.0/?api_key=7f0ae344d4754c175067118a5975ab15&format=json&';
	
	this.getArtists = function(){
		found = {};
		query = cleanArgsLfm($('.search .query').val());
		if (query == '') return;
		$.getJSON(url+'method=artist.search&artist='+query+'&callback=?',function(j){
			as.onGetArtists(j);
		});	
	}
	
	this.onGetArtists = function(d) {
		var i = 0;
		$('.live').empty();
		$(d.results.artistmatches.artist).each(function(){
			i++;
			if (i > 10) return false;
			if (typeof this.image != 'undefined') {
				var img = this.image[1]['#text'];
				var img2 = this.image[3]['#text'];
			}
			else	var img = '';
			if (img == '') img = img2 = 'assets/img/musicalnote.png';
			var name = decURI(this.name);
			var url = this.url;
			$('.live').append('<div class="artist" data-artist="'+name+'" data-img="'+img2+'"><span>'+name+'</span><img src="'+img+'"></div>');
		
		});
		$('.live').slideDown();
		$('.search .query').addClass('active');
	}
	
	this.getSimilar = function() {
		$('.live').hide();
		$('.artists').empty();
		list.artist = $(this).attr('data-artist') || hash.artist;
		$('.search .query').val(list.artist);
		var q = cleanArgsLfm(list.artist);
		var img = $(this).attr('data-img');
		setHash(list.artist);
		//$('.artists').html('<div class="artist active" data-artist="'+list.artist+'" style="background-image: url('+img+')"><div class="name">'+list.artist+'</div></div>');
		$.getJSON(url+'method=artist.getsimilar&artist='+q+'&callback=?',function(j){
			as.onGetSimilar(j);
		});	
		
		
	
	}
	
	this.onGetSimilar = function(d) {
		$(d.similarartists.artist).each(function(){
			if (typeof this.image != 'undefined') var img = this.image[3]['#text'];
			else	var img = '';
			if (img == '') img = img2 = 'assets/img/musicalnote.png';
			$('.artists').append('<div class="artist" data-artist="'+this.name+'" style="background-image: url('+img+')"><div class="name">'+this.name+'</div></div>');
		});
		$('.artists').slideDown();
		as.getTopTracks(list.artist);	
	}
	
	this.getTopTracks = function(art) {
		found = [];
		$('.results').empty();		
		setHash(art);
		art = cleanArgsLfm(art);
		list.artist = art;
		$.getJSON(url+'method=artist.gettoptracks&artist='+art+'&callback=?',function(j){
			as.onGetTopTracks(j);
		});	
	}
	
	
	this.onGetTopTracks = function(d) {
		
		$(d.toptracks.track).each(function(){
			var title = cleanTitle(this.name);
			if (!in_array(title, found)) {
				if (cleanHash(title) == hash.title) var c = 'active'; else var c = '';
				$('.results').append("<div class='row "+c+"' data-artist='"+this.artist.name+"' data-title='"+title+"'><div class='track'><b>"+this.artist.name+"</b><br><span class='title'>"+cap(title)+"</span></div><div class='info'></div></div>");		
				found.push(title);
			}			
		});
		$("<div class='row more'>More Tracks</div>").appendTo('.results').click(function(){
			as.getList(list.artist);
		});
		$('#accordion').css('visibility','visible');
		$('.results .active').click();
		$('.jp-player').show();
	
	}

	this.getList = function(art) {
		found = [];
		$('.results').empty();
		$.get('fetch.php?q='+art, as.onGetList);	
	}
	
	this.onGetList = function(e) {
		var data = $("#content", cleanU(e));
		var artist = trim($('.pagehead .breadcrumb a', data).eq(1).text());
		
		var tracks = $('.modulechartstracks .chart6month tr td.subjectCell div', data).toArray();
		var i = 0, k = 0;
		setTimeout(function(){
			for (var step = i+50; i<step; i++){
				var t = tracks[i];
				var title = $(t).find('> a').text() || '';
				
				if (title.toLowerCase().indexOf('podcast') != -1) continue; // remove podcasts		
				
				title = cleanTitle(title.replace(/\-/g,' '));
		
				if (title == '' || title == undefined) continue;
				if (!in_array(title, found)) {
					$('.results').append("<div class='row' data-artist='"+artist+"' data-title='"+title+"'><div class='track'><b>"+artist+"</b> <br><span class='title'>"+cap(title)+"</span></div><div class='info'></div></div>");
					found.push(title);
					k++;
				}
			}
			if (i >= tracks.length || k > 150)
				$('.progress').hide();
			else
				setTimeout(arguments.callee, 0);
				
		}, 0);
	}
	
	this.getFiles = function(t) {
		list.artist = t.attr('data-artist');
		list.title = t.attr('data-title');
		var q = cleanArgsVk(list.artist+' '+list.title);
		cur = t;
		VK.Api.call('audio.search', {q: q, sort: 0, count: 200, offset: 0, v: 3, test_mode: 1}, as.onGetFiles);
	}
	
	this.onGetFiles = function(data) {	
		if (typeof data.error != 'undefined') {
			if (data.error.error_code == 11) VK.Auth.login(null, VK.access.AUDIO);
			if (data.error.error_code == 7) VK.Auth.login(null, VK.access.AUDIO);
			console.log(data.error);
			return;
		}
		var total = data.response[0];
		if (total == 0) {
			$('.row.active').next().click();
			return;
		}
		var sort = new Array();
		for (key in data.response) {
			var d = data.response[key];
			if (typeof(d.duration) == 'undefined') continue;
			if (d.duration < 160 || d.duration > 900) continue;
			if (sort[d.duration] == null) sort[d.duration] = 1;
			else sort[d.duration]++; 
		}
		var keys = arsort(sort, 'SORT_NUMERIC');
		var dur = keys[0];
		var i = 0;
		
		for (key in data.response) {
			i++;
			var d = data.response[key];
			if (typeof(d.title) == 'undefined') continue
			if (d.duration == dur) {
				var duration = parseInt(d.duration / 60) + ":" + ( (d.duration % 60) > 9 ? d.duration % 60 : "0" + d.duration % 60 );
				cur.attr('data-url', d.url);
				cur.find('.info').html('<span class="dur">'+duration+'</span><a class="add" title="To Playlist" data-url="'+d.url+'"><img src="assets/img/playlist.gif"></a><img src=assets/img/download.gif></a><a title=Download class="dragout" target=_blank href="'+d.url+'" data-downloadurl="audio/mpeg:'+list.artist+' - '+list.title+'.mp3:'+d.url+'"><img src=assets/img/dl.gif></a> ');
				break;
			}
		}
		$('.dragout').dragout();		
		cur.click();
	}
}
