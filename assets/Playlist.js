function Playlist() {
	var tracks = [];
	
	if (typeof localStorage == 'undefined') localStorage = {};
	
	this.add = function(art, t, url, i) {
		if (typeof i == 'undefined') i = tracks.length;
		tracks.push([art, t, url]);
		this.save();
		$('#playlist .list').append('<div data-url="'+url+'" class="row"><div class="track"><b>'+art+'</b><br><span class="title">'+t+'</span></div><div class="info"><a data-index="'+i+'" title="Remove"><img src="assets/img/delete.png"></a></div>');
	}
	
	this.del = function(i) {
		tracks.splice(i,1);
		this.save();
	}
	
	this.load = function() {
		if (!localStorage.playlist || localStorage.getItem('playlist') == '') return;
		var load = localStorage.getItem('playlist').split('::');
		for(var k in load) {
			var a = load[k].split(';;');
			this.add(a[0], a[1], a[2]);
		}
	}
	
	this.save = function() {
		var save = [];
		for(var k in tracks) {
			save.push(tracks[k].join(';;'));
		}
		localStorage.setItem('playlist',save.join('::'));
	}
	
	
	
	
	
	
	
	
}