console.log("DataHandler.js");
import {Utils} from './Utils.js';


var DataHandler = (function() {
    'use strict';
    
    
    function getUserAgent()
    {
        return browser.runtime.getBrowserInfo();
    }

    function getAllInstalledPlugins()
    {
        return browser.management.getAll();
    }


    function getPlatformInfo()
    {
        return browser.runtime.getPlatformInfo();
    }
    
    
    
    function handle(message) {
        console.log("DataHandler", message);
        Utils.notify(message);
    }
    
    return {
        handle: handle
    };
}());
export {DataHandler};