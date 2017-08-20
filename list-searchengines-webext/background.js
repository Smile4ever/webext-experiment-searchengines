/// Static variables

function clickToolbarButton(){
	console.log("logging browser.searchengines...");
	console.log(browser.searchengines);
	
	// Works, but I would like to have the option to call list without parameter as well
	browser.searchengines.list({}).then((engines) => {
		console.log(engines);
		for(let engine of engines){
			console.log("getting engine from webextension... " + engine.name);
		}
	}).catch(console.error);
	
	// Doesn't work yet
	browser.searchengines.getDefaultEngines({}).then((engines) => {
		console.log(engines);
		for(let engine of engines){
			console.log("getting default engine from webextension... " + engine.name);
		}
	}).catch(console.error);
}

browser.browserAction.onClicked.addListener(clickToolbarButton);


/// Helper functions
function onError(error) {
	//console.log(`Error: ${error}`);
}

function notify(message){
	browser.notifications.create(message.substring(0, 20),
	{
		type: "basic",
		iconUrl: browser.extension.getURL("icons/list-searchengines64.png"),
		title: "List Searchengines",
		message: message
	});
}
