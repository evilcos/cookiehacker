// by evilcos@gmail.com

var URL = '';

function $(id){return document.getElementById(id);}

function inj_cookies(cookies){
	if(!cookies){
		$('status').innerHTML = 'No Cookies Injected.';
		return;
	}
	if (!chrome.cookies) {
	  chrome.cookies = chrome.experimental.cookies;
	}
	
	d = new Date();;
	expired = 365*70; // 70years
	//d.setTime(d.getTime()+expired*24*3600*1000); //millisecond
	//e = d.toGMTString();
	e = d.setTime(d.getTime()/1000+expired*24*3600); //second
	
	
	domain = URL.split('/')[2];
	if($('domain').value != domain){
		domain = $('domain').value;
	}
	url = URL.split('/')[0] + '//' + domain;
	
	cc = cookies.split(';');
	for(i in cc){
		c = cc[i].replace(/^\s+|\s+$/g, "");
		if(!c) continue;
		k = c.split('=')[0].replace(/^\s+|\s+$/g, "").replace(' ', '+');
		v = c.split('=')[1].replace(/^\s+|\s+$/g, "").replace(' ', '+');
		chrome.cookies.set({
			'url': url,
			'name': k,
			'value': v,
			'path': '/',
			'domain': $('domain').value,
			'expirationDate': e,
		});
	};
	$('status').innerHTML = 'OK.';
	
}


function init(){
	$('x').focus();
	$('x').value = localStorage.getItem('cookies');

/*
chrome.tabs.getCurrent(function(tab){ 
	alert(tab.url); 
});
*/
chrome.tabs.getSelected(null,function(tab) {  
    URL = tab.url;
	$('domain').value = URL.split('/')[2];
});
/*
	chrome.cookies.getAll({}, function(cookies) {
		for (var i in cookies) {
		  cache_i(cookies[i]);
		}
	});
	下面这样不行！
	$('exec_btn').onclick = function(){
		eval($('x').value);
	};
*/
	$('x').addEventListener('blur', function(){
		localStorage.setItem('cookies',$('x').value);
	});
	
	$('exec_btn').addEventListener('click', function () {
		inj_cookies($('x').value);
	});
}
document.addEventListener('DOMContentLoaded', init);
