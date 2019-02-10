console.log("Hello world!");
	browser.runtime.onMessage.addListener(notify);


function notify(message,sender, sendResponse) {
  browser.notifications.create({
    "type": "basic",
    "iconUrl": browser.extension.getURL("link.png"),
    "title": message.type,
    "message": JSON.stringify(message)
  });
    sendResponse({response: "Response from background script"});

}
