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
        name: "Video Time Duration",
        description: "",
        title: "video time duration",
        type: "event",        
        is_enabled: true,
        events: [
            {
                selector: "",   // window
                event_name: "beforeunload"
            }
        ],
        objects: [
            {
                selector:".ytp-time-duration",
                property: "innerHTML",
                name: "duration",
				type: "text"
            },
            {
                selector:".ytp-time-current",
                property: "innerHTML",
                name: "current",
				type: "text"
            },
            {
                selector:"title",
                property: "innerHTML",
                name: "page_title",
				type: "text"
            }
        ]
    },
    
];