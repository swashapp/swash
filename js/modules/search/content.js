console.log("modules/search/content.js");
import {Search} from './manifest.js';
Search.content_matches = ["*://www.google.com/search?*", "*://www.bing.com/*", "*://*.yahoo.com/*", "*://search.aol.com/aol/*", "*://www.ask.com/*", "*://*.baidu.com/*"];
Search.content = [
	//google
    {
        name: "googleSearchResult",
		url_match: "*://www.google.com/search?*",
        description: "This item collects Google search results, search category, page number and corresponding search query",
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
                selector:".g .rc",
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
                    },
					{
                        selector: ".hdtb-mitem.hdtb-msel.hdtb-imb",
                        property: "innerText",
                        name: "category",
                        type: "text"
                    }
                ]
            }
        ]
    },
    {
        name: "googleClickedLink",
		url_match: "*://www.google.com/search?*",
        description: "This item collects links clicked by user from Google search result",
		viewGroup: "Google",
        title: "clicked link",
        type: "event",        
        is_enabled: true,
        events: [
            {
                selector: ".g .rc .r",
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
                    },
					{
                        selector: ".hdtb-mitem.hdtb-msel.hdtb-imb",
                        property: "innerText",
                        name: "category",
                        type: "text"
                    }
                ]
            }
        ]
    },
	//bing
	{
        name: "bingSearchResult",
		url_match: "*://www.bing.com/*",
        description: "This item collects Bing search results, search category, page number and corresponding search query",
		viewGroup: "Bing",
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
                selector:"#b_results .b_algo",
                name: "searchResult",
                properties: [
                    {
                        selector: "a",
                        property: "href",
                        name: "link",
                        type: "url"
                    },
                    {
                        selector: "a",
                        property: "innerText",
                        name: "title",
                        type: "text"
                    },
                    {
                        selector: ".b_caption p",
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
                        selector: "#sb_form_q",
                        property: "value",
                        name: "query",
                        type: "text"
                    },
                    {
                        selector: ".sb_pagS.sb_pagS_bp.b_widePag.sb_bp",
                        property: "innerText",
                        name: "pageNumber",
                        type: "text"
                    },
					{
                        selector: ".b_active a",
                        property: "innerText",
                        name: "category",
                        type: "text"
                    }
                ]
            }
        ]
    },
    {
        name: "bingClickedLink",
		url_match: "*://www.bing.com/*",
        description: "This item collects links clicked by user from Bing search result",
		viewGroup: "Bing",
        title: "clicked link",
        type: "event",        
        is_enabled: true,
        events: [
            {
                selector: ".b_algo h2",
                event_name: "click"
            }
        ],
        objects: [
            {
                selector:"",
                properties: [
                    {
						selector:"a",
                        property: "href",
                        name: "link",
                        type: "url"
                    },
                    {
						selector:"a",
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
                        selector: "#sb_form_q",
                        property: "value",
                        name: "query",
                        type: "text"
                    },
                    {
                        selector: ".sb_pagS.sb_pagS_bp.b_widePag.sb_bp",
                        property: "innerText",
                        name: "pageNumber",
                        type: "text"
                    },
					{
                        selector: ".b_active a",
                        property: "innerText",
                        name: "category",
                        type: "text"
                    }
                ]
            }
        ]
    },
	//yahoo
	{
        name: "yahooSearchResult",
		url_match: "*://*.yahoo.com/*",
        description: "This item collects Yahoo search results, search category, page number and corresponding search query",
		viewGroup: "Yahoo",
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
                selector:".algo",
                name: "searchResult",
                properties: [
                    {
                        selector: ".title a",
                        property: "href",
                        name: "link",
                        type: "url"
                    },
                    {
                        selector: ".title",
                        property: "innerText",
                        name: "title",
                        type: "text"
                    },
                    {
                        selector: ".compText p",
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
                        selector: "#yschsp",
                        property: "value",
                        name: "query",
                        type: "text"
                    },
                    {
                        selector: ".compPagination strong",
                        property: "innerText",
                        name: "pageNumber",
                        type: "text"
                    },
					{
                        selector: ".compList.visible-pivots .active",
                        property: "innerText",
                        name: "category",
                        type: "text"
                    }
                ]
            }
        ]
    },
    {
        name: "yahooClickedLink",
		url_match: "*://*.yahoo.com/*",
        description: "This item collects links clicked by user from Yahoo search result",
		viewGroup: "Yahoo",
        title: "clicked link",
        type: "event",        
        is_enabled: true,
        events: [
            {
                selector: "#web .compTitle .title",
                event_name: "click"
            }
        ],
        objects: [
            {
                selector:"",
                properties: [
                    {
						selector:"a",
                        property: "href",
                        name: "link",
                        type: "url"
                    },
                    {
						selector:"a",
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
                        selector: "#yschsp",
                        property: "value",
                        name: "query",
                        type: "text"
                    },
                    {
                        selector: ".compPagination strong",
                        property: "innerText",
                        name: "pageNumber",
                        type: "text"
                    },
					{
                        selector: ".compList.visible-pivots .active",
                        property: "innerText",
                        name: "category",
                        type: "text"
                    }
                ]
            }
        ]
    },
	//aol
	{
        name: "aolSearchResult",
		url_match: "*://search.aol.com/aol/*",
        description: "This item collects AOL search results, search category, page number and corresponding search query",
		viewGroup: "AOL",
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
                selector:".algo",
                name: "searchResult",
                properties: [
                    {
                        selector: ".compTitle div span",
                        property: "innerText",
                        name: "link",
                        type: "text"
                    },
                    {
                        selector: ".title",
                        property: "innerText",
                        name: "title",
                        type: "text"
                    },
                    {
                        selector: ".compText p",
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
                        selector: "#yschsp",
                        property: "value",
                        name: "query",
                        type: "text"
                    },
                    {
                        selector: ".compPagination strong",
                        property: "innerText",
                        name: "pageNumber",
                        type: "text"
                    },
					{
                        selector: ".compList.visible-pivots .active",
                        property: "innerText",
                        name: "category",
                        type: "text"
                    }
                ]
            }
        ]
    },
    {
        name: "aolClickedLink",
		url_match: "*://search.aol.com/aol/*",
        description: "This item collects links clicked by user from AOL search result",
		viewGroup: "AOL",
        title: "clicked link",
        type: "event",        
        is_enabled: true,
        events: [
            {
                selector: "#web .compTitle",
                event_name: "click"
            }
        ],
        objects: [
            {
                selector:"",
                properties: [
                    {
						selector:"div span",
                        property: "innerText",
                        name: "link",
                        type: "text"
                    },
                    {
						selector:".title a",
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
                        selector: "#yschsp",
                        property: "value",
                        name: "query",
                        type: "text"
                    },
                    {
                        selector: ".compPagination strong",
                        property: "innerText",
                        name: "pageNumber",
                        type: "text"
                    },
					{
                        selector: ".compList.visible-pivots .active",
                        property: "innerText",
                        name: "category",
                        type: "text"
                    }
                ]
            }
        ]
    },
	//ask
	{
        name: "askSearchResult",
		url_match: "*://www.ask.com/*",
        description: "This item collects Ask search results, search category, page number and corresponding search query",
		viewGroup: "Ask",
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
                selector:".PartialSearchResults-item",
                name: "searchResult",
                properties: [
                    {
                        selector: ".PartialSearchResults-item-title a",
                        property: "href",
                        name: "link",
                        type: "url"
                    },
                    {
                        selector: ".PartialSearchResults-item-title a",
                        property: "innerText",
                        name: "title",
                        type: "text"
                    },
                    {
                        selector: ".PartialSearchResults-item-abstract",
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
                        selector: ".PartialSearchBox-input",
                        property: "value",
                        name: "query",
                        type: "text"
                    },
                    {
                        selector: ".PartialWebPagination-pgsel",
                        property: "innerText",
                        name: "pageNumber",
                        type: "text"
                    },
					{
                        selector: ".PartialChannelNavigation-nav-links .active",
                        property: "innerText",
                        name: "category",
                        type: "text"
                    }
                ]
            }
        ]
    },
    {
        name: "askClickedLink",
		url_match: "*://www.ask.com/*",
        description: "This item collects links clicked by user from Ask search result",
		viewGroup: "Ask",
        title: "clicked link",
        type: "event",        
        is_enabled: true,
        events: [
            {
                selector: ".PartialSearchResults-item-title",
                event_name: "click"
            }
        ],
        objects: [
            {
                selector:"",
                properties: [
                    {
						selector:"a",
                        property: "href",
                        name: "link",
                        type: "url"
                    },
                    {
						selector:"a",
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
                        selector: ".PartialSearchBox-input",
                        property: "value",
                        name: "query",
                        type: "text"
                    },
                    {
                        selector: ".PartialWebPagination-pgsel",
                        property: "innerText",
                        name: "pageNumber",
                        type: "text"
                    },
					{
                        selector: ".PartialChannelNavigation-nav-links .active",
                        property: "innerText",
                        name: "category",
                        type: "text"
                    }
                ]
            }
        ]
    },
	//Baidu
	{
        name: "askSearchResult",
		url_match: "*://*.baidu.com/*",
        description: "This item collects Baidu search results, search category, page number and corresponding search query",
		viewGroup: "Baidu",
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
                selector:".result",
                name: "searchResult",
                properties: [
                    {
                        selector: ".f13 a",
                        property: "innerText",
                        name: "link",
                        type: "text"
                    },
                    {
                        selector: ".t",
                        property: "innerText",
                        name: "title",
                        type: "text"
                    },
                    {
                        selector: ".c-abstract",
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
                        selector: "#kw",
                        property: "value",
                        name: "query",
                        type: "text"
                    },
                    {
                        selector: "#page .pc",
                        property: "innerText",
                        name: "pageNumber",
                        type: "text"
                    },
					{
                        selector: ".s_tab_inner b",
                        property: "innerText",
                        name: "category",
                        type: "text"
                    }
                ]
            }
        ]
    },
    {
        name: "askClickedLink",
		url_match: "*://*.baidu.com/*",
        description: "This item collects links clicked by user from Baidu search result",
		viewGroup: "Baidu",
        title: "clicked link",
        type: "event",        
        is_enabled: true,
        events: [
            {
                selector: ".result .t",
                event_name: "click"
            }
        ],
        objects: [
            {
                selector:"",
                properties: [
                    {
						selector:"a",
                        property: "href",
                        name: "link",
                        type: "url"
                    },
                    {
						selector:"a",
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
                        selector: "#kw",
                        property: "value",
                        name: "query",
                        type: "text"
                    },
                    {
                        selector: "#page .pc",
                        property: "innerText",
                        name: "pageNumber",
                        type: "text"
                    },
					{
                        selector: ".s_tab_inner b",
                        property: "innerText",
                        name: "category",
                        type: "text"
                    }
                ]
            }
        ]
    },
];