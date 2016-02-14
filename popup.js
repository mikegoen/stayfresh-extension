var refresh_interval = document.getElementById('interval');
var storage = chrome.storage.local;

// get info on popup load
storage.get(null, function(items) {
	Object.keys(items).forEach(function(key) {
		if (key != 'pause'){
			addItem(key, items[key]);
		} else if (items[key] == true) {
			$('#pause').text('PAUSED click to resume');
			$('#pause').removeClass('pause-off');
			$('#pause').addClass('pause-on');
		}
	});
});

//add to list of pages being refreshed
function addItem(urlText, time) {
	var timeText;
	if (time < 60000) {
		timeText = time / 1000 + ' seconds';
	} else if (time == 60000) {
		timeText = '1 minute';
	} else {
		timeText = time / 60000 + ' minutes';
	}
	var item = "<p class='url-item'>"+"<a>"+urlText+"</a>"+
				"<br><span class='delete'>Delete</span>Time: "+timeText+"</p>";
	$('#url-list').append(item);

	//apply delete function on new element
	$('.delete').click(function() {
		var url = $(this).siblings().text();
		storage.remove(url);
		$(this).parent().remove();
	})
}

function getActiveTab(callback) {
	chrome.tabs.query({'currentWindow': true, 'active': true}, function(tab){
		callback(tab);
	});
};

//button function that adds page to storage and html list for refresh
function addUrl(){
	getActiveTab(function(tab) {
		var pageUrl = tab[0]['url'];
		addItem(pageUrl, refresh_interval.value); //add to html popup list
		var urlTimer = {};
		urlTimer[pageUrl] = refresh_interval.value;
		storage.set(urlTimer);
	});
};

//button function adding all pages with host name
function addUrlHost() {
	getActiveTab(function(tab) {
		page_url = tab[0]['url'];

		//slice url to host only, ending with /* to be parsed by executeScript()
		host_url = page_url.slice(0, page_url.indexOf('/', 8)) + '/*';

		addItem(host_url, refresh_interval.value);
		var urlTimer = {};
		urlTimer[host_url] = refresh_interval.value;
		storage.set(urlTimer);
	});
}

$('#pause').click(function() {
	if ($(this).hasClass('pause-off')){
		storage.set({'pause': true})
		$(this).text('PAUSED click to resume');
	} else {
		storage.set({'pause': false})
		$(this).text('Pause Refresh');
	}
	$(this).toggleClass('pause-on');
	$(this).toggleClass('pause-off');
});

document.addEventListener('DOMContentLoaded', function() {
	var addButton = document.getElementById('add-url');
	var addAllButton = document.getElementById('add-all');

	addButton.addEventListener('click', addUrl);
	addAllButton.addEventListener('click', addUrlHost);
});
