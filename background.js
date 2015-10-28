var target_urls = [], //pages to be refreshed
	tab_ids = [],
	refreshInterval = 10; //minutes before sending refresh script

//updates extension based on storage
chrome.storage.sync.get(null, function(items) {
	if (items.urls == undefined) {
		items.urls = []
	}
	else {
		for (var i = 0; i < items.urls.length; i++){
			target_urls.push(items.urls[i])
		}
	}
});

//gets list of current tabs
function getTabs(callback) {
	chrome.tabs.query({"url": target_urls}, function(tabs) {
		callback(tabs);
	});
};

//populates tab_ids array based on the target_urls array
function updateTabs() {
	tab_ids = []; //erases old tab ids
	getTabs(function(tab_obj) {
		for (var i = 0; i < Object.keys(tab_obj).length; i++){
		tab_ids.push(tab_obj[i]["id"])
		}
	});
};

//iterate through tab_ids, send script to each tab
function sendScript() {
	for (var i = 0; i<tab_ids.length; i++){
		chrome.tabs.executeScript(tab_ids[i], {file: "pagescript.js"})
	};
};

//start timer that updates the list of all chrome tab id's every minute
chrome.alarms.create("tabs_alarm", {"when": Date.now(), "periodInMinutes": 1});

//timer to send scripts to selected tabs at set interval
chrome.alarms.create("script_alarm", {"when": Date.now(), "periodInMinutes": refreshInterval});

chrome.alarms.onAlarm.addListener(function alarmAction(alarm) {
	if (alarm['name'] == 'tabs_alarm') updateTabs();
	if (alarm['name'] == 'script_alarm') sendScript();
});

//update variables on storage change
chrome.storage.onChanged.addListener(function() {
	chrome.storage.sync.get(null, function(items) {
		target_urls = items.urls;
	});
});
