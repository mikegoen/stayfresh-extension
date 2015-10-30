var targetUrls;
var refresh_interval = document.getElementById('interval'); 
var storage = chrome.storage.sync;

// get info on popup load
storage.get(null, function(items) {
	//update page list
	for (var i = 0; i < items.urls.length; i++){
			addItem(items.urls[i])
		}	
	targetUrls = items.urls;
	refresh_interval.value = items.interval;
});

//add to page list
function addItem(text){
	var m = document.createElement('li');
	m.textContent = text;
	mylist = document.getElementById('url-list');
	mylist.appendChild(m);
};

function getActiveTab(callback) {
	chrome.tabs.query({'currentWindow': true, 'active': true}, function(tab){
		callback(tab);
	});
};

//button function that adds page to storage and popup list
function addUrl(){
	getActiveTab(function(tab) {
		addItem(tab[0]['url']); //add to html popup list
		targetUrls.push(tab[0]['url']); //add to global variable

		//update storage
		storage.remove('urls', function() {
			storage.set({'urls': targetUrls});
		});
	});
};

//button function adding all pages with host name
function addUrlHost() {
	getActiveTab(function(tab) {
		page_url = tab[0]['url'];
		//slice url to host only, ending with /* to be parsed by executeScript() 
		host_url = page_url.slice(0, page_url.indexOf('/', 8)) + '/*';
		
		addItem(host_url);
		targetUrls.push(host_url);
		//update storage
		storage.remove('urls', function() {
			storage.set({'urls': targetUrls});
		});
	});
}

//button function that clears url list and storage
function clearUrls() {
	storage.remove('urls', function() {
			storage.set({'urls': []});
		});

	var pagelist = document.getElementById('url-list');

	while (pagelist.firstChild) {
		pagelist.removeChild(pagelist.firstChild);
	}
};

document.addEventListener('DOMContentLoaded', function() {
	var addButton = document.getElementById('add-url');
	var clearButton = document.getElementById('clear-all');
	var addAllButton = document.getElementById('add-all');

	addButton.addEventListener('click', addUrl);
	clearButton.addEventListener('click', clearUrls);
	addAllButton.addEventListener('click', addUrlHost);

	refresh_interval.addEventListener('input', function() {
		storage.set({'interval': Number(refresh_interval.value)});
	});

});
