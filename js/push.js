console.log("push.js");
var STREAM_ID = "UUSJ4StCQHKOKvYzCgZ-hw";
var API_KEY = "QageytBgRGG5DFRdFA47hQ9sjWw-YjTyu7as4wR-zlEA";
var PUSH_ID = "lgknlkgnlkdgnflkgnoevneo";
var settings = {};
// Create the client and give the API key to use by default
var client = new StreamrClient({
  apiKey: API_KEY
})

// Subscribe to a stream
const subscription = client.subscribe(
    {
        stream: STREAM_ID
    },
    function(message) {
        // This function will be called when new messages occur
        console.log(JSON.stringify(message));
		if(message.pushId != PUSH_ID)
			return;
		
		browser.notifications.create({
			"type": "basic",
			"title": message.title,
			"message": message.content,
			"iconUrl": message.iconUrl
  });

    }
)