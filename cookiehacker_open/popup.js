// by evilcos@gmail.com

const SEVENTY_YEARS = 365 * 70;
var URL = '';

function $(id) {
    return document.getElementById(id);
}

function getProtocol() {
    return URL.split('/')[0];
}

function getDomain() {
    return URL.split('/')[2];
}

function inj_cookies(cookies) {
    if (!cookies) {
        $('status').innerHTML = 'No Cookies Injected.';
        return;
    }
    if (!chrome.cookies) {
        chrome.cookies = chrome.experimental.cookies;
    }

    var expirationDate = new Date().setTime(new Date().getTime() / 1000 + SEVENTY_YEARS * 24 * 3600); //second

    var domain = $('domain').value;
    var url = getProtocol() + '//' + domain;

    var cc = cookies.split(';');
    for (i in cc) {
        var c = cc[i].replace(/^\s+|\s+$/g, "");
        if (!c) continue;
        var name = c.split('=')[0].replace(/^\s+|\s+$/g, "").replace(' ', '+');
        var value = c.split('=')[1].replace(/^\s+|\s+$/g, "").replace(' ', '+');
        chrome.cookies.set({
            'url': url,
            'name': name,
            'value': value,
            'path': '/',
            'domain': domain,
            'expirationDate': expirationDate
        });
    }
    $('status').innerHTML = 'OK.';
}

function init() {
    $('x').focus();
    $('x').value = localStorage.getItem('cookies');

    /*
     chrome.tabs.getCurrent(function(tab){
     alert(tab.url);
     });
     */
    chrome.tabs.getSelected(null, function (tab) {
        URL = tab.url;
        $('domain').value = getDomain();
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
    $('x').addEventListener('blur', function () {
        localStorage.setItem('cookies', $('x').value);
    });

    $('exec_btn').addEventListener('click', function () {
        inj_cookies($('x').value);
    });
}

document.addEventListener('DOMContentLoaded', init);