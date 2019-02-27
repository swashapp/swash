console.log("modules/youtube/content.js");
import {Youtube} from './manifest.js';
Youtube.content_matches = ["*://*.youtube.com/*"];
Youtube.content = [
//    {
//        name: "",
//        description: "",
//        title: "",
//        events: [
//            {
//                selector: "",
//                event_name: ""
//           }
//        ],
//        objects: [
//            {
//                selector:"",
//                property: "value",
//                name: ""
//            }
//        ]
//    },
    {
        name: "",
        description: "",
        title: "video time duration",
        is_enabled: true,
        events: [
            {
                selector: "",   // window
                event_name: "unload"
            }
        ],
        objects: [
            {
                selector:".ytp-time-duration",
                property: "innerHTML",
                name: "duration"
            },
            {
                selector:".ytp-time-current",
                property: "innerHTML",
                name: "current"
            },
            {
                selector:"title",
                property: "innerHTML",
                name: "page_title"
            }
        ]
    },
    
];