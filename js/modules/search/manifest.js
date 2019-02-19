import {AllModules} from '../../modules.js';
var Search = (function() {
    'use strict';
    
    return {
        name: "search",
        description: "This module look through all the user activities on facebook and capture those activities that user have permitted",
        path: "/search",
        URL: ["https://www.google.com","https://search.yahoo.com","https://www.aol.com/","http://www.bing.com/","https://www.ask.com/"],
        data: ["browsing"],
        privacy_level: 3,
        status: "enabled",
        icons: ["","",""],
        version: 1,
        changelog: []
    };
}());
AllModules.push(Search);
export {Search};