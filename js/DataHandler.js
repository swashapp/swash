console.log("DataHandler.js");
var DataHandler = (function() {
    'use strict';

    function notify(message){
        browser.notifications.create({
            "type": "basic",
            "iconUrl": browser.extension.getURL("icons/surf48.png"),
            "title": message.module + ":" + message.source,
            "message": JSON.stringify(message)
        });
    }
    
    function handle(message) {
        console.log(message);
        notify(message);
    }

    
    return {
        handle: handle
    };
}());
export {DataHandler};