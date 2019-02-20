console.log("DataHandler.js");
import {Utils} from './Utils.js';


var DataHandler = (function() {
    'use strict';
    
    function handle(message) {
        console.log("DataHandler", message);
        Utils.notify(message);
    }
    
    return {
        handle: handle
    };
}());
export {DataHandler};