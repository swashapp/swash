console.log("modules/search/content.js");
import {Search} from './manifest.js';
Search.content_matches = ["*://www.google.com/search?*", "*://www.bing.com/*", "*://*.yahoo.com/*", "*://search.aol.com/aol/*", "*://www.ask.com/*", "*://*.baidu.com/*", "*://duckduckgo.com/*"];
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
                selector:".bkWMgd .g .rc",
				conditions: [{parent: {contain: false, val: ".related-question-pair"}}],
                name: "searchResult",
				indexName: "rank",
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
                selector:".ads-ad",
                name: "adsResult",
				indexName: "rank",
                properties: [
                    {
                        selector: ".ad_cclk a.V0MxL",
                        property: "href",
                        name: "link",
                        type: "url"
                    },
                    {
                        selector: ".ad_cclk a h3",
                        property: "innerText",
                        name: "title",
                        type: "text"
                    },
                    {
                        selector: ".ads-creative",
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
				conditions: [{parent: {contain: false, val: ".related-question-pair"}}],
                event_name: "click"
            },
			{
                selector: ".g .rc .r",
				conditions: [{parent: {contain: false, val: ".related-question-pair"}}],
                event_name: "contextmenu"
            }
        ],
        objects: [
			{
                selector:"#", //event properties
                properties: [
                    {
                        property: "index",
                        name: "rank",
                        type: "text"
                    }
                ]
            },
            {
                selector:"", 
                properties: [
                    {
                        selector: ".iUh30",
                        property: "innerText",
                        name: "link",
                        type: "text"
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
                selector:".bkWMgd .g .rc",
				conditions: [{parent: {contain: false, val: ".related-question-pair"}}],
                name: "searchResult",
				indexName: "rank",
                properties: [
                    {
                        selector: ".r .iUh30",
                        property: "innerText",
                        name: "link",
                        type: "text"
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
                selector:".ads-ad",
                name: "adsResult",
				indexName: "rank",
                properties: [
                    {
                        selector: ".ad_cclk .ads-visurl cite",
                        property: "innerText",
                        name: "link",
                        type: "text"
                    },
                    {
                        selector: ".ad_cclk a h3",
                        property: "innerText",
                        name: "title",
                        type: "text"
                    },
                    {
                        selector: ".ads-creative",
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
        name: "googleAdsClickedLink",
		url_match: "*://www.google.com/search?*",
        description: "This item collects advertising links clicked by user from Google search result",
		viewGroup: "Google",
        title: "Ads clicked link",
        type: "event",        
        is_enabled: true,
        events: [
            {
                selector: ".ad_cclk",
                event_name: "click"
            },
			{
                selector: ".ad_cclk",
                event_name: "contextmenu"
            }
        ],
        objects: [
			{
                selector:"#", //event properties
                properties: [
                    {
                        property: "index",
                        name: "rank",
                        type: "text"
                    }
                ]
            },		
			{
                selector:"#", //event properties
                properties: [
                    {
                        property: "index",
                        name: "rank",
                        type: "text"
                    }
                ]
            },
            {
                selector:"",
                properties: [
                    {
                        selector: ".ads-visurl cite",
                        property: "innerText",
                        name: "link",
                        type: "text"
                    },
                    {
                        selector: ".ad_cclk a h3",
                        property: "innerText",
                        name: "title",
                        type: "text"
                    },
                    {
                        selector: ".ads-creative",
                        property: "innerText",
                        name: "description",
                        type: "text"
                    }
                ]
            },
			{
                selector:".bkWMgd .g .rc",
				conditions: [{parent: {contain: false, val: ".related-question-pair"}}],
                name: "searchResult",
				indexName: "rank",
                properties: [
                    {
                        selector: ".r .iUh30",
                        property: "innerText",
                        name: "link",
                        type: "text"
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
                selector:".ads-ad",
                name: "adsResult",
				indexName: "rank",
                properties: [
                    {
                        selector: ".ad_cclk .ads-visurl cite",
                        property: "innerText",
                        name: "link",
                        type: "text"
                    },
                    {
                        selector: ".ad_cclk a h3",
                        property: "innerText",
                        name: "title",
                        type: "text"
                    },
                    {
                        selector: ".ads-creative",
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
				indexName: "rank",
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
                selector:"#b_results .b_ad .sb_add",
                name: "adsResult",
				indexName: "rank",
                properties: [
                    {
                        selector: ".b_caption .b_adurl cite",
                        property: "innerText",
                        name: "link",
                        type: "text"
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
            },
			{
                selector: ".b_algo h2",
                event_name: "contextmenu"
            }
        ],
        objects: [
			{
                selector:"#", //event properties
                properties: [
                    {
                        property: "index",
                        name: "rank",
                        type: "text"
                    }
                ]
            },		
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
                selector:"#b_results .b_algo",
                name: "searchResult",
				indexName: "rank",
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
                selector:"#b_results .b_ad .sb_add",
                name: "adsResult",
				indexName: "rank",
                properties: [
                    {
                        selector: ".b_caption .b_adurl cite",
                        property: "innerText",
                        name: "link",
                        type: "text"
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
        name: "bingAdsClickedLink",
		url_match: "*://www.bing.com/*",
        description: "This item collects Ads links clicked by user from Bing search result",
		viewGroup: "Bing",
        title: "Ads clicked link",
        type: "event",        
        is_enabled: true,
        events: [
            {
                selector: ".b_ad .sb_add",
                event_name: "click"
            },
			{
                selector: ".b_ad .sb_add",
                event_name: "contextmenu"
            }
        ],
        objects: [
			{
                selector:"#", //event properties
                properties: [
                    {
                        property: "index",
                        name: "rank",
                        type: "text"
                    }
                ]
            },		
            {
                selector:"",
                properties: [
                    {
						selector:".b_caption .b_adurl cite",
                        property: "innerText",
                        name: "link",
                        type: "text"
                    },
                    {
						selector:"h2 a",
                        property: "innerText",
                        name: "title",
                        type: "text"
                    }
                ]
            },
			{				
                selector:"#b_results .b_algo",
                name: "searchResult",
				indexName: "rank",
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
                selector:"#b_results .b_ad .sb_add",
                name: "adsResult",
				indexName: "rank",
                properties: [
                    {
                        selector: ".b_caption .b_adurl cite",
                        property: "innerText",
                        name: "link",
                        type: "text"
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
				indexName: "rank",
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
                selector:".ads .compTitle",
                name: "adsResult",
				indexName: "rank",
                properties: [
                    {
                        selector: "a.ad-domain",
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
        name: "yahooClickedLink",
		url_match: "*://*.yahoo.com/*",
        description: "This item collects links clicked by user from Yahoo search result",
		viewGroup: "Yahoo",
        title: "clicked link",
        type: "event",        
        is_enabled: true,
        events: [
            {
                selector: ".algo .compTitle",
                event_name: "click"
			},
			{
                selector: ".algo .compTitle",
                event_name: "contextmenu"
            }
        ],
        objects: [
			{
                selector:"#", //event properties
                properties: [
                    {
                        property: "index",
                        name: "rank",
                        type: "text"
                    }
                ]
            },		
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
                selector:".algo",
                name: "searchResult",
				indexName: "rank",
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
                selector:".ads .compTitle",
                name: "adsResult",
				indexName: "rank",
                properties: [
                    {
                        selector: "a.ad-domain",
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
        name: "yahooAdsClickedLink",
		url_match: "*://*.yahoo.com/*",
        description: "This item collects links clicked by user from Yahoo search result",
		viewGroup: "Yahoo",
        title: "Ads clicked link",
        type: "event",        
        is_enabled: true,
        events: [
            {
                selector: ".ads .compTitle",
                event_name: "click"
            },
			{
                selector: ".ads .compTitle",
                event_name: "contextmenu"
            }
        ],
        objects: [
			{
                selector:"#", //event properties
                properties: [
                    {
                        property: "index",
                        name: "rank",
                        type: "text"
                    }
                ]
            },            
			{
                selector:"",
                properties: [
                    {
						selector:".ad-domain",
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
                selector:".algo",
                name: "searchResult",
				indexName: "rank",
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
                selector:".ads .compTitle",
                name: "adsResult",
				indexName: "rank",
                properties: [
                    {
                        selector: "a.ad-domain",
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
				indexName: "rank",
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
                selector:".ads",
                name: "adsResult",
				indexName: "rank",
                properties: [
                    {
                        selector: ".compTitle div .ad-domain",
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
                selector: ".algo .compTitle",
                event_name: "click"
            },
			{
                selector: ".algo .compTitle",
                event_name: "contextmenu"
            }
        ],
        objects: [
			{
                selector:"#", //event properties
                properties: [
                    {
                        property: "index",
                        name: "rank",
                        type: "text"
                    }
                ]
            },		
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
                selector:".algo",
                name: "searchResult",
				indexName: "rank",
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
                selector:".ads",
                name: "adsResult",
				indexName: "rank",
                properties: [
                    {
                        selector: ".compTitle div .ad-domain",
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
        name: "aolAdsClickedLink",
		url_match: "*://search.aol.com/aol/*",
        description: "This item collects Ads links clicked by user from AOL search result",
		viewGroup: "AOL",
        title: "Ads clicked link",
        type: "event",        
        is_enabled: true,
        events: [
            {
                selector: ".ads .compTitle",
                event_name: "click"
            },
			{
                selector: ".ads .compTitle",
                event_name: "contextmenu"
            }
        ],
        objects: [
			{
                selector:"#", //event properties
                properties: [
                    {
                        property: "index",
                        name: "rank",
                        type: "text"
                    }
                ]
            },		
            {
                selector:"",
                properties: [
                    {
						selector:"div .ad-domain",
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
                selector:".algo",
                name: "searchResult",
				indexName: "rank",
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
                selector:".ads",
                name: "adsResult",
				indexName: "rank",
                properties: [
                    {
                        selector: ".compTitle div .ad-domain",
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
				indexName: "rank",
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
            },
			{
                selector: ".PartialSearchResults-item-title",
                event_name: "contextmenu"
            }
        ],
        objects: [
			{
                selector:"#", //event properties
                properties: [
                    {
                        property: "index",
                        name: "rank",
                        type: "text"
                    }
                ]
            },		
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
                selector:".PartialSearchResults-item",
                name: "searchResult",
				indexName: "rank",
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
	//Baidu
	{
        name: "baiduSearchResult",
		url_match: "*://*.baidu.com/*",
        description: "This item collects Baidu search results, search category, page number and corresponding search query",
		viewGroup: "Baidu",
        title: "Search Result",
        type: "event",
		readyAt: "DOMChange",
        observingTargetNode: "#wrapper_wrapper",
        observingConfig: { attributes: false, childList: true, subtree: true },
        is_enabled: true,
        events: [
            {
                selector: ".",
                event_name: "."
            }
        ],
        objects: [
            {
                selector:".result",
                name: "searchResult",
				indexName: "rank",
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
        name: "baiduClickedLink",
		url_match: "*://*.baidu.com/*",
        description: "This item collects links clicked by user from Baidu search result",
		viewGroup: "Baidu",
        title: "clicked link",
        type: "event",        
        is_enabled: true,
		readyAt: "DOMChange",
        observingTargetNode: "#wrapper_wrapper",
        observingConfig: { attributes: false, childList: true, subtree: true },
        events: [
            {
                selector: ".result",
                event_name: "click"
            }
        ],
        objects: [
			{
                selector:"#", //event properties
                properties: [
                    {
                        property: "index",
                        name: "rank",
                        type: "text"
                    }
                ]
            },		
            {
                selector:"",
                properties: [
                    {
						selector:".f13 a",
                        property: "innerText",
                        name: "link",
                        type: "text"
                    },
                    {
						selector:".t",
                        property: "innerText",
                        name: "title",
                        type: "text"
                    }
                ]
            },
			{
                selector:".result",
                name: "searchResult",
				indexName: "rank",
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
	//duckduckgo
    {
        name: "duckduckgoSearchResult",
		url_match: "*://duckduckgo.com/?*",
        description: "This item collects DuckDuckGo search results, search category, page number and corresponding search query",
		viewGroup: "DuckDuckGo",
        title: "Search Result",
        type: "event",
   		readyAt: "DOMChange",
        observingTargetNode: ".results--main",
        observingConfig: { attributes: false, childList: true, subtree: true },
        is_enabled: true,
        events: [
            {                
                event_name: ".",
                selector: ".",
            }
        ],
        objects: [
            {
                selector:".results .result.results_links_deep",
                name: "searchResult",
				indexName: "rank",
                properties: [
                    {
                        selector: ".result__body .result__title a",
                        property: "href",
                        name: "link",
                        type: "url"
                    },
                    {
                        selector: ".result__body .result__title a",
                        property: "innerText",
                        name: "title",
                        type: "text"
                    },
                    {
                        selector: ".result__body .result__snippet",
                        property: "innerText",
                        name: "description",
                        type: "text"
                    }
                ]
            },
			{
                selector:".results--ads .result.results_links",
                name: "adsResult",
				indexName: "rank",
                properties: [
                    {
                        selector: ".result__body .result__extras .result__extras__url a",
                        property: "innerText",
                        name: "link",
                        type: "text"
                    },
                    {
                        selector: ".result__body .result__title a",
                        property: "innerText",
                        name: "title",
                        type: "text"
                    },
                    {
                        selector: ".result__body .result__snippet",
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
                        selector: "#search_form_input",
                        property: "value",
                        name: "query",
                        type: "text"
                    },
					{
                        selector: "#duckbar_static .zcm__item a.is-active",
                        property: "innerText",
                        name: "category",
                        type: "text"
                    }
                ]
            }
        ]
    },
    {
        name: "duckduckgoClickedLink",
		url_match: "*://duckduckgo.com/?*",
        description: "This item collects links clicked by user from DuckDuckGo search result",
		viewGroup: "DuckDuckGo",
        title: "clicked link",
        type: "event",
		readyAt: "DOMChange",
        observingTargetNode: ".results--main",
        observingConfig: { attributes: false, childList: true, subtree: true },
        is_enabled: true,
        events: [
            {
                selector: ".results .result.results_links_deep",
                event_name: "click"
            },
			{
                selector: ".results .result.results_links_deep",
                event_name: "contextmenu"
            }
        ],
        objects: [
			{
                selector:"#", //event properties
                properties: [
                    {
                        property: "index",
                        name: "rank",
                        type: "text"
                    }
                ]
            },
            {
                selector:"", 
                properties: [
                    {
                        selector: ".result__body .result__title a",
                        property: "href",
                        name: "link",
                        type: "url"
                    },
                    {
                        selector: ".result__body .result__title a",
                        property: "innerText",
                        name: "title",
                        type: "text"
                    }
                ]
            },
			{
                selector:".results .result.results_links_deep",
                name: "searchResult",
				indexName: "rank",
                properties: [
                    {
                        selector: ".result__body .result__title a",
                        property: "href",
                        name: "link",
                        type: "url"
                    },
                    {
                        selector: ".result__body .result__title a",
                        property: "innerText",
                        name: "title",
                        type: "text"
                    },
                    {
                        selector: ".result__body .result__snippet",
                        property: "innerText",
                        name: "description",
                        type: "text"
                    }
                ]
            },
			{
                selector:".results--ads .result.results_links",
                name: "adsResult",
				indexName: "rank",
                properties: [
                    {
                        selector: ".result__body .result__extras .result__extras__url a",
                        property: "innerText",
                        name: "link",
                        type: "text"
                    },
                    {
                        selector: ".result__body .result__title a",
                        property: "innerText",
                        name: "title",
                        type: "text"
                    },
                    {
                        selector: ".result__body .result__snippet",
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
                        selector: "#search_form_input",
                        property: "value",
                        name: "query",
                        type: "text"
                    },
					{
                        selector: "#duckbar_static .zcm__item a.is-active",
                        property: "innerText",
                        name: "category",
                        type: "text"
                    }
                ]
            }
        ]
    },
	{
        name: "duckduckgoAdsClickedLink",
		url_match: "*://duckduckgo.com/*",
        description: "This item collects advertising links clicked by user from DuckDuckGo search result",
		viewGroup: "DuckDuckGo",
        title: "Ads clicked link",
		readyAt: "DOMChange",
        observingTargetNode: ".results--main",
        observingConfig: { attributes: false, childList: true, subtree: true },
        type: "event",        
        is_enabled: true,
        events: [
            {
                selector: ".results--ads .result.results_links",
                event_name: "click"
            },
			{
                selector: ".results--ads .result.results_links",
                event_name: "contextmenu"
            }
        ],
        objects: [				
			{
                selector:"#", //event properties
                properties: [
                    {
                        property: "index",
                        name: "rank",
                        type: "text"
                    }
                ]
            },
            {
                selector:"", 
                properties: [
                    {
                        selector: ".result__body .result__title a",
                        property: "href",
                        name: "link",
                        type: "url"
                    },
                    {
                        selector: ".result__body .result__title a",
                        property: "innerText",
                        name: "title",
                        type: "text"
                    }
                ]
            },
			{
                selector:".results .result.results_links_deep",
                name: "searchResult",
				indexName: "rank",
                properties: [
                    {
                        selector: ".result__body .result__title a",
                        property: "href",
                        name: "link",
                        type: "url"
                    },
                    {
                        selector: ".result__body .result__title a",
                        property: "innerText",
                        name: "title",
                        type: "text"
                    },
                    {
                        selector: ".result__body .result__snippet",
                        property: "innerText",
                        name: "description",
                        type: "text"
                    }
                ]
            },
			{
                selector:".results--ads .result.results_links",
                name: "adsResult",
				indexName: "rank",
                properties: [
                    {
                        selector: ".result__body .result__extras .result__extras__url a",
                        property: "innerText",
                        name: "link",
                        type: "text"
                    },
                    {
                        selector: ".result__body .result__title a",
                        property: "innerText",
                        name: "title",
                        type: "text"
                    },
                    {
                        selector: ".result__body .result__snippet",
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
                        selector: "#search_form_input",
                        property: "value",
                        name: "query",
                        type: "text"
                    },
					{
                        selector: "#duckbar_static .zcm__item a.is-active",
                        property: "innerText",
                        name: "category",
                        type: "text"
                    }
                ]
            }
        ]		
	},
];