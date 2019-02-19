console.log("modules/surfing/manifest.js");
import {AllModules} from '../../modules.js';
var Surfing = (function() {
    'use strict';
    
    return {
        name: "surfing",
        description: "This module configure general surfing configuration of surf-streamr",
        path: "/surfing",
        URL: ["https://authsaz"],
        functions: ["browsing"],
        privacy_level: 3,
        status: "enabled",
        icons: ["","",""],
        version: 1,
        changelog: []
    };
}());
AllModules.push(Surfing);