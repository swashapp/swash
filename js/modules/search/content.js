console.log("modules/search/content.js");
import {Search} from './manifest.js';
Search.content_matches = ["*://www.google.com/search?*"];
Search.content = [
    {
        name: "searchResult",
        description: "",
		viewGroup: "Google",
        title: "Search Result",
        type: "event",        
        is_enabled: true,
        events: [
            {
                selector: "window",
                event_name: "load"
            }
        ],
        objects: [
            {
                selector:".srg .g .rc",
                name: "searchResult",
                properties: [
                    {
                        selector: ".r a",
                        property: "href",
                        name: "link",
                        type: "url"
                    },
                    {
                        selector: ".r .LC20lb",
                        property: "innerText",
                        name: "title",
                        type: "text"
                    },
                    {
                        selector: ".s .st",
                        property: "innerText",
                        name: "description",
                        type: "text"
                    }
                ]
            },
            {
                selector:"body",
                properties: [
                    {
                        selector: "input.gLFyf",
                        property: "value",
                        name: "query",
                        type: "text"
                    },
                    {
                        selector: ".cur",
                        property: "innerText",
                        name: "pageNumber",
                        type: "text"
                    }
                ]
            }
        ]
    },
    {
        name: "clickedLink",
        description: "",
		viewGroup: "Google",
        title: "clicked link",
        type: "event",        
        is_enabled: true,
        events: [
            {
                selector: ".srg .g .rc .r",
                event_name: "click"
            }
        ],
        objects: [
            {
                selector:"",
                properties: [
                    {
                        selector: ".iUh30",
                        property: "innerText",
                        name: "link",
                        type: "url"
                    },
                    {
                        selector: ".LC20lb",
                        property: "innerText",
                        name: "title",
                        type: "text"
                    }
                ]
            },
            {
                selector:"body",
                properties: [
                    {
                        selector: "input.gLFyf",
                        property: "value",
                        name: "query",
                        type: "text"
                    },
                    {
                        selector: ".cur",
                        property: "innerText",
                        name: "pageNumber",
                        type: "text"
                    }
                ]
            }
        ]
    },
];