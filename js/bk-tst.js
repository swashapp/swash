console.log("Hello world!");
try {
	browser.runtime.onMessage.addListener(notify);
}
catch(err) {
	console.log(err);
}

function tst(message,sender, sendResponse) {
	console.log("test");
	alert("test");
}

function notify(message,sender, sendResponse) {
  browser.notifications.create({
    "type": "basic",
    "iconUrl": browser.extension.getURL("link.png"),
    "title": message.type,
    "message": JSON.stringify(message)
  });
    sendResponse({response: "Response from background script"});

}
