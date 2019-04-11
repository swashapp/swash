function handleShown(e, moduleName) {
	e.loadConfig(moduleName);
}

function handleHidden(e) {
  
}


function handleResponse(message) {
	for(let panel of message) {
		browser.devtools.panels.create(
		  panel,
		  "../icons/surf38.png",
		  "/devtools/net-panel.html"
		).then((newPanel) => {
			newPanel.onShown.addListener((e) => handleShown(e, panel));
			newPanel.onHidden.addListener(handleHidden);
		}); 
	}
}

function handleError(error) {
  console.log(`Error: ${error}`);
}

let message = {
	obj: "Devtools",
	func: "panelList",
	params: []
}

browser.runtime.sendMessage(message).then(handleResponse, handleError);  





