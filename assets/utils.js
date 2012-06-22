function in_array (needle, haystack) {
	for (key in haystack) {
		if (haystack.hasOwnProperty(key))
		if ((lc(haystack[key]).indexOf(lc(needle)) != -1) || (lc(needle).indexOf(lc(haystack[key])) != -1))
			return true; 
		}
  return false;
}

function sortFunction(a, b) {
	return b.dur - a.dur
}

function cap(str) {
  return str.replace( /(^|\s|\.)(.)/g , function(m,p1,p2){ return p1+p2.toUpperCase(); } );
};

// trim whitespaces
function trim(q) {
	return q.replace(/^\s*/g, "").replace(/\s*$/, "").replace(/(\s)+/g," ");
}

function btrim(str) {
	return trim(str.replace(/\(|\)|\[|\]|\||\.|,|'|"|\-|_|\&|\+/g,' ')).toLowerCase();
}

// trim numbers
function tnum(q) {
	return q.replace(/\d+/g,'');
}

// trim brackets and its content
function tbr(q) {
	return q.replace(/(\(|\[).*(\)|\])?/gi,'');
}

// remove spaces
function nsp(q) {
	return q.replace(/ /g,'').toLowerCase();
}

// lower case
function lc(q) {
	return q.toLowerCase();
}

function cleanU(str) {
	str = str.replace(/[\u0000-\u001f]/g,'').replace(/[\u007f-\u00bf]/g,'');
	str = str.replace(/[\u00c0-\u00c6\u00e0-\u00e6]/g,'a').replace(/[\u00c8-\u00cb\u00e8-\u00eb]/g,'e');
	return str;
}

function cleanArray(w1, w2) {
	for(var k in w1)
		if (w1[k].length == 1 || shit.indexOf(w1[k]) != -1) w1.splice(k,1);
		
	for(var k in w2)
		if (w2[k].length == 1 || shit.indexOf(w2[k]) != -1) w2.splice(k,1);
}

function cleanComp(str) {
	str = str.replace(/\-/g,' ');
	str = str.replace(/&/g,' ');
	return str;
}

// returns completely clean title without remixes, edits, feats and track numbers, passes to cleanName then
function cleanTitle(str) {
	str = tbr(str); // remove brackets content
	str = str.replace(/[\w]+ (remix|mix|rmx|edit).*/gi,''); // remove (this), 1 word before and everything after
	str = str.replace(/( feat| ft\.| vocals by| vip).*/gi,''); // remove (this) and everything after
	str = str.replace(/(full version|remix|remi| mix|rmx| edit)/gi,''); //remove (this)
	str = str.replace(/(mp3|wav|flac|ogg)/gi,'');
	str = str.replace(/^(A1 |B1 |C1 |D1 |E1 |F1 |G1 |A2 |B2 |C2 |D2 |E2 |F2 |AA |BB |AB |B )/gi,'');
	str = str.replace(/^([0-5][0-9]\s*)+/,'');
	return cleanName(str);
}

// removes clean name without unicodes, hex codes, special characters, but with (*) if any
function cleanName(str) {	
	str = cleanU(str);
	var hex = /&#(.+);/.exec(str);
	if (hex != null) str = unescape(str.replace(/&#(.+);/,"%"+dechex(hex[1])));
	str = str.replace(/\[.*\]/g,""); //trim content of square brackets
	str = str.replace(/('|`|’)s/gi,'s').replace(/('|`|’)t/gi,'');
	str = str.replace(/(\(|\)|\[|\]|\{|\}|@|:|_|,|'|`|’|\+|\|)+/g,' '); // replace with space
	str = str.replace(/(!|#|%|\^|\*|"|\\|\/|\?|<|>|\.)+/g,''); // remove
	str = str.replace(/(http.?\/\/.*)/gi,'').replace(/club\d+/gi,''); // remove spam
	return trim(str);
}

function cleanRemix(str) {
	str = str.replace(/(full version|remix|remi|mix|rmx|edit|vip)/gi,'');
	str = str.replace(/(mp3|wav|flac|ogg)/gi,'');
	str = str.replace(/^([0-5][0-9]\s*)+/,'');
	return cleanName(str);
}

function cleanArtist(str) {
	str = str.replace(/^(A1 |B1 |C1 |D1 |E1 |F1 |G1 |A2 |B2 |C2 |D2 |E2 |F2 |AA |BB |AB |B )/gi,'');
	return trim(str);
}

// cleaning arguments for VK
function cleanArgsVk(str) {	
	str = decodeURIComponent(str);
	str = str.replace(/'t/,'').replace(/'s/,'s');
	str = str.replace(/(&|\.|\$)+/g,' ');
	str = str.replace(/(&|\?|:|"|'|@|\+|#)+/g,'');
	return trim(str);
}

function cleanArgsLfm(q) {
	return encURI(q);
}

function encURI(q) {
	q = encodeURIComponent(q);
	return q;
}

function decURI(q) {
	try {
		q = decodeURIComponent(q);
		return q;
	} catch (error) {
		return '';
	}
}

function short(str, lim) {
	if (str.length > lim) {
		var stop = str.substr(0,lim).lastIndexOf(' ');
		str = str.substring(0,stop);
	}
	return str;	
}

function mkTime(dur) {
	var m = parseInt(dur/60);
	var s = dur % 60;
	var duration = (m > 9 ? m : '0'+m) +':'+ (s > 9 ? s : "0"+s);
	return duration;
}


function setHash(str, str2) {
	var s = str.replace(/ /g,'+');
	if (typeof str2 != 'undefined')
		s += '/'+ cleanHash(str2.replace(/ /g,'+'));
	location.hash = '#'+s;
}

function cleanHash(q) {
	q = q.replace(/('|`|\||#|%|\^|\*|\\|\/|\?)+/g,''); // replace with space
	return trim(q);
}


function checkSupport() {
	if (!Modernizr.localstorage) {
		$('body').append('<div id="overlay"><div class="info"></div></div>');
		$('#overlay .info').html('<h1>Your browser is outdated!</h1>\
														 <p>Your browser does not support <b>localStorage</b>.</p> \
														 <p>Please gran supported browsers from one of the vendors below:</p>\
														 <div class="browsers"><a href="http://www.google.com/chrome/"><div class="chrome"></div></a>\
														 <a href="http://www.mozilla.com"><div class="firefox"></div></a>\
														 <a href="http://www.apple.com/safari"><div class="safari"></div></a>\
														 <a href="http://www.opera.com"><div class="opera"></div></a></div>');
		return false;
	}
	return true;	
}


function getMovie(movieName) {
	if (navigator.appName.indexOf("Microsoft") != -1) {
		return window[movieName];
	} else {
		return document[movieName];
	}
}