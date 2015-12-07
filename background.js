
var target_urls = [], //pages to be refreshed
	tab_ids = [],
	refreshInterval = 10000; //miliseconds before sending refresh script
	storage = chrome.storage.sync;

//initialize extension based on storage
storage.get(null, function(items) {
	if (items.urls == undefined) {
		storage.set({'urls': []})
	}
	else {
		for (var i = 0; i < items.urls.length; i++){
			target_urls.push(items.urls[i])
		}
	}
	switch (items.interval) {
		case undefined:
			storage.set({'interval': 300000});
			break;
		default:
			refreshInterval = items.interval;
	}
});

//gets list of current tabs to be refreshed
function getTabs(callback) {
	if (target_urls.length > 0){
		chrome.tabs.query({"url": target_urls}, function(tabs) {
			callback(tabs);
		});
	}
};

//updates tab_ids array and send script to each tab
function sendScript() {
	tab_ids = []; //erases old tab ids

	getTabs(function(tab_obj) {
		for (var i = 0; i < Object.keys(tab_obj).length; i++){
		tab_ids.push(tab_obj[i]["id"])
		}

		if (tab_ids.length > 0) {
			for (var i = 0; i<tab_ids.length; i++){
				//if timer greater than 3 minutes, use script with mouse detection
				if (refreshInterval > 180000) {
					chrome.tabs.executeScript(tab_ids[i], {file: "pagescript_2.js"})
				}
				else { chrome.tabs.executeScript(tab_ids[i], {file: "pagescript.js"})}
			};
		}
	});
};

//start timer
var scriptTimer = setInterval(function() {
	sendScript();
	}, refreshInterval);

//update variables on storage change
chrome.storage.onChanged.addListener(function() {
	storage.get(null, function(items) {
		target_urls = items.urls;

		if (refreshInterval != items.interval){
			refreshInterval = items.interval;
			console.log('changing interval based on storage');
			clearInterval(scriptTimer);
			scriptTimer = setInterval(function() {
				sendScript();
				}, refreshInterval);	
		}
	});
});
