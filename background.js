
var refresherObjects = [],
		storage = chrome.storage.local;

//initialize extension from storage
storage.get(null, function(items) {
	Object.keys(items).forEach(function(key) {
		if (key != 'pause'){
			refresherObjects.push(new Refresher(items[key], key));
		}
	});
	if (items.pause == false) {
		refresherObjects.forEach(function(obj) {
			obj.startInterval();
		});
	}
});

//get active tabs matching url
function getTabs(url, callback) {
	var queryObj = {};
	queryObj['url'] =	url;
	chrome.tabs.query(queryObj, function(tabs) {
		callback(tabs);
	});
};

//define conscructor for refresher object
var Refresher = function(milliseconds, url) {
	this.milliseconds = milliseconds;
	this.url = url;
	var newUrl = this.url;
	this.startInterval = function() {
		this.interval = setInterval( function() {
			var tab_ids = [];
			getTabs(newUrl, function(tab_obj) {
				for (var i = 0; i < Object.keys(tab_obj).length; i++){
					tab_ids.push(tab_obj[i]["id"]);
				}
				if (tab_ids.length > 0) {
					for (var i = 0; i<tab_ids.length; i++){
						chrome.tabs.executeScript(tab_ids[i], {file: "pagescript.js"});
					}
				}
			});
		}, milliseconds);
	}
	this.clearInterval = function() {
		clearInterval(this.interval);
	}
}

chrome.storage.onChanged.addListener(function() {
	storage.get(null, function(items) {
		console.log('storage change');
		console.log(items);

		//re-create timers on storage change
		refresherObjects.forEach(function(obj) {
			obj.clearInterval();
		});
		refresherObjects = [];
		Object.keys(items).forEach(function(key) {
			if (key != 'pause') {
				refresherObjects.push(new Refresher(items[key], key));
			}
		});
		refresherObjects.forEach(function(obj) {
				obj.startInterval();
		});

		//stop timers if paused
		if (items.pause == true) {
			refresherObjects.forEach(function(obj) {
				obj.clearInterval();
			});
		}
	});
});
