import {streamConfig} from './streamConfig.js';
import {storageHelper} from './storageHelper.js';


// Create the client and give the API key to use by default
var pushStream = (function() {
    var client = new StreamrClient({
      apiKey: streamConfig.PUSH_API_KEY
    })
    
    var subscription;
    
    async function callback(message) {
            // This function will be called when new messages occur
            let configs = await storageHelper.retrieveConfigs();    
            let pushId = configs.Id;
            if(message.pushId != pushId)
                return;
            
            browser.notifications.create({
                "type": "basic",
                "title": message.title,
                "message": message.content,
                "iconUrl": message.iconUrl
      });

    }
    
    // Subscribe to a stream
    function subscribe(){
        if(!subscription || subscription.state=="unsubscribed") {
            subscription = client.subscribe(
            {
                stream: streamrConf.PUSH_STREAM_ID
            },callback);            
        }
    }
    
    function unsubscribe(){
        if(subscription)
            client.unsubscribe(subscription)
    }
    
    
    return {
        subscribe: subscribe,
        unsubscribe: unsubscribe
    };
                
}());


export {pushStream};
    
    