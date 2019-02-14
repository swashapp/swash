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
        title: "",
        events: [
            {
                selector: "",   // object
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