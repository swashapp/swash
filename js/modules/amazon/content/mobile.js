console.log("modules/amazon/content/mobile.js");
import {amazon} from '../manifest.js';
amazon.mobile = [
	{
        name: "searchQuery",
		url_match: "*://www.amazon.*/*",
        description: "This item collects Amazon search query and search category",
		viewGroup: "UX",
        title: "Search Query",
        type: "event",        
        is_enabled: true,
        events: [
            {
                selector: "#nav-search-form input[type=submit]",
                event_name: "click"
            },
			{
                selector: "#nav-search-keywords",
                event_name: "keydown",
				keyCode: 13
            }
        ],
        objects: [
            {
                selector:"#nav-search-form",
                properties: [
                    {
                        selector: "#nav-search-keywords",
                        property: "value",
                        name: "query",
                        type: "text"
                    }
                ]
            }
		]
    },
	{
        name: "searchSuggestionSelect",
		url_match: "*://www.amazon.*/*",
        description: "This item collects a search suggestion that has been selected by user",
		viewGroup: "UX",
        title: "Search Suggestion",
        type: "event",
		readyAt: "DOMChange",
        observingTargetNode: "#nav-search-form",
        observingConfig: { attributes: false, childList: true, subtree: true },
        is_enabled: true,
        events: [            
			{
                selector: ".suggest_row",
                event_name: "click"
            }
        ],
        objects: [            
			{
                selector:"",
                properties: [
                    {
                        property: "innerText",
                        name: "query",
                        type: "text"
                    }
                ]
            }
		]
    },
    {
        name: "searchResult",
		url_match: "*://www.amazon.*/s*",
        description: "This item collects Amazon search results, search category, and corresponding search query",
		viewGroup: "UX",
        title: "Search Result",
        type: "event",        
        is_enabled: true,
        events: [
            {
                selector: "window",
                event_name: "DOMContentLoaded"
            }
        ],
        objects: [
            {
                selector:".s-result-list.sg-row .s-result-item",
                name: "searchResult",
				indexName: "rank",
                properties: [
                    {
                        selector: "a[title=status-badge]",
                        property: "href",
                        name: "link",
                        type: "url"
                    },
                    {
                        selector: "a h2",
                        property: "innerText",
                        name: "title",
                        type: "text"
                    },
                    {
                        selector: ".a-price .a-offscreen",
                        property: "innerText",
                        name: "price",
                        type: "text"
                    },
					{
                        selector: ".a-icon-star-small",
                        property: "innerText",
                        name: "rate",
                        type: "text"
                    }
                ]
            },
			{
				selector:"title",
                properties: [
                    {
                        property: "innerText",
                        name: "query",
                        type: "text"
                    }
				]
			}
        ]
    },
	{
        name: "clickSearchResult",
		url_match: "*://*.amazon.*/s*",
        description: "This item collects information about a search result link that has been clicked by user",
		viewGroup: "UX",
        title: "clicked search results",
        type: "event",        
        is_enabled: true,
        events: [
            {
                selector: ".s-result-list.sg-row .s-result-item",
                event_name: "click"
            },
			{
                selector: ".s-result-list.sg-row .s-result-item",
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
                        selector: "a[title=status-badge]",
						property: "href",
                        name: "link",
                        type: "url"
                    },
                    {
						selector: "a h2",
                        property: "innerText",
                        name: "title",
                        type: "text"
                    }
                ]
            },
            {
                selector:"#nav-search-form",
                properties: [
                    {
                        selector: "#nav-search-keywords",
                        property: "value",
                        name: "query",
                        type: "text"
                    }
                ]
            }
        ]
    },
    {
        name: "selectedItem",
		url_match: "*://*.amazon.*/*",
        description: "This item collects product title, product category and page title for products in amazon web pages that has been selected by user",
		viewGroup: "UX",
        title: "Selected Items",
        type: "event",        
        is_enabled: true,
        events: [
            {
                selector: "window",
                event_name: "DOMContentLoaded"
            }
        ],
        objects: [
            {
				selector: "#productTitleGroupAnchor",	
				isRequired: true,
                properties: [
                    {
						selector:"#title",
                        property: "innerText",
                        name: "title",
                        type: "text"
                    },
					{
						selector:"#acrCustomerReviewLink .a-icon-star-mini",
                        property: "innerText",
                        name: "rate",
                        type: "text"
                    },
					{
						selector:"#priceblock_ourprice",
                        property: "innerText",
                        name: "price",
                        type: "text"
                    }
                ]
				
            },
			{
                selector:"#nav-search-form",
                properties: [
                    {
                        selector: "#nav-search-keywords",
                        property: "value",
                        name: "query",
                        type: "text"
                    }
                ]
            }
        ]
    },
    {
        name: "addToCart",
		url_match: "*://*.amazon.*/*",
        description: "This item collects all products in amazon web pages that has been added to the cart by user",
		viewGroup: "UX",
        title: "Items in cart",
        type: "event",        
        is_enabled: true,
        events: [
            {
                selector: "#add-to-cart-button",
                event_name: "click"
            },
            {
                selector: "#add-to-cart-button",
                event_name: "submit"
            }
        ],
        objects: [
            {
				selector: "#productTitleGroupAnchor",	
				isRequired: true,
                properties: [
                    {
						selector:"#title",
                        property: "innerText",
                        name: "title",
                        type: "text"
                    },
					{
						selector:"#acrCustomerReviewLink .a-icon-star-mini",
                        property: "innerText",
                        name: "rate",
                        type: "text"
                    },
					{
						selector:"#priceblock_ourprice",
                        property: "innerText",
                        name: "price",
                        type: "text"
                    }
                ]
				
            },
			{
                selector:"#nav-search-form",
                properties: [
                    {
                        selector: "#nav-search-keywords",
                        property: "value",
                        name: "query",
                        type: "text"
                    }
                ]
            },
			{
				selector: "#feature-bullets",
				properties: [
                    {
                        property: "innerText",
                        name: "features",
                        type: "text"
                    }
				]
			}
        ]
    },
    {
        name: "addToWishlist",
        description: "This item collects all products in amazon web pages that has been added by user in wish list",
		url_match: "*://*.amazon.*/*",
		viewGroup: "UX",
        title: "Items in wishlist",
        type: "event",        
        is_enabled: true,
        events: [
            {
                selector: "#add-to-wishlist-button-submit",
                event_name: "click"
            },
            {
                selector: "#add-to-wishlist-button-submit",
                event_name: "submit"
            }
        ],
        objects: [
            {
				selector: "#productTitleGroupAnchor",	
				isRequired: true,
                properties: [
                    {
						selector:"#title",
                        property: "innerText",
                        name: "title",
                        type: "text"
                    },
					{
						selector:"#acrCustomerReviewLink .a-icon-star-mini",
                        property: "innerText",
                        name: "rate",
                        type: "text"
                    },
					{
						selector:"#priceblock_ourprice",
                        property: "innerText",
                        name: "price",
                        type: "text"
                    }
                ]
				
            },
			{
                selector:"#nav-search-form",
                properties: [
                    {
                        selector: "#nav-search-keywords",
                        property: "value",
                        name: "query",
                        type: "text"
                    }
                ]
            }
        ]
    },
    {
        name: "buyNow",
        description: "This item collects all products in amazon web pages that has been selected by user for buying",
		url_match: "*://*.amazon.*/*",
		viewGroup: "UX",
        title: "Items for buy",
        type: "event",        
        is_enabled: true,
        events: [
            {
                selector: "#buy-now-button",
                event_name: "click"
            },
            {
                selector: "#buy-now-button",
                event_name: "submit"
            }
        ],
        objects: [
            {
				selector: "#productTitleGroupAnchor",	
				isRequired: true,
                properties: [
                    {
						selector:"#title",
                        property: "innerText",
                        name: "title",
                        type: "text"
                    },
					{
						selector:"#acrCustomerReviewLink .a-icon-star-mini",
                        property: "innerText",
                        name: "rate",
                        type: "text"
                    },
					{
						selector:"#priceblock_ourprice",
                        property: "innerText",
                        name: "price",
                        type: "text"
                    }
                ]
				
            },
			{
                selector:"#nav-search-form",
                properties: [
                    {
                        selector: "#nav-search-keywords",
                        property: "value",
                        name: "query",
                        type: "text"
                    }
                ]
            }
        ]
    },
    
];