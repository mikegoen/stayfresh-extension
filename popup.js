var targetUrls;

//add to html list
function addItem(text){
	var m = document.createElement('li');
	m.textContent = text;
	mylist = document.getElementById('url-list');
	mylist.appendChild(m);
};

// get urls on popup load
chrome.storage.sync.get(null, function(items) {
	//update html list
	for (var i = 0; i < items.urls.length; i++){
			addItem(items.urls[i])
		}	

	targetUrls = items.urls
});

function getActiveTab(callback) {
	chrome.tabs.query({'currentWindow': true, 'active': true}, function(tab){
		callback(tab);
	});
};

//button function that adds url to storage and popup list
function addUrl(){
	getActiveTab(function(tab) {
		addItem(tab[0]['url']); //add to html popup list
		targetUrls.push(tab[0]['url']); //add to global variable

		//delete old url array, then add updated one
		chrome.storage.sync.remove('urls', function() {
			chrome.storage.sync.set({'urls': targetUrls});
		});
	});
};

//button function that clears url list and storage
function clearUrls() {
	chrome.storage.sync.remove('urls', function() {
			chrome.storage.sync.set({'urls': []});
		});

	var pagelist = document.getElementById('url-list');

	while (pagelist.firstChild) {
		pagelist.removeChild(pagelist.firstChild);
	}
};

document.addEventListener('DOMContentLoaded', function() {
	var addButton = document.getElementById('add-url');
	var clearButton = document.getElementById('clear-all');
	addButton.addEventListener('click', addUrl);
	clearButton.addEventListener('click', clearUrls);
});
