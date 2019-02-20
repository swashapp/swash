console.log("DataHandler.js");
import {Utils} from './Utils.js';


var DataHandler = (function() {
    'use strict';
    
    function handle(message) {
        console.log("DataHandler", message);
        Utils.notify(message);
    }

    
    

/*

var STREAM_ID = '************************'
var API_KEY = '**********************************'
var settings = {};
// Create the client and give the API key to use by default
var client = new StreamrClient({
  apiKey: API_KEY
})

// Wrap event generation and producion into this method
function produceNewEvent(msg) {
  
  // Produce the event to the Stream
  console.log("produceNewEvent ", msg);
  client.produceToStream(STREAM_ID, msg)
    .then(() => {
      console.log('Sent successfully: ' + JSON.stringify(msg))
    })
    .catch((err) => {
      console.errorlog(err)
    })
}
*/
    
    return {
        handle: handle
    };
}());
export {DataHandler};