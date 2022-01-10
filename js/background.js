// clear storage data when tab reloads
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
	console.log("reloaded");
	localStorage.clear();
});