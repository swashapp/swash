console.log("modules/amazon/content.js");
import {Amazon} from './manifest.js';
Amazon.content_matches = ["*://*.amazon.com/*"]
Amazon.content = [
	{
        name: "searchQuery",
		url_match: "*://www.amazon.com/*",
        description: "This item collects Amazon search query and search category",
		viewGroup: "UX",
        title: "Search Query",
        type: "event",        
        is_enabled: true,
        events: [
            {
                selector: "#nav-search input[type=submit]",
                event_name: "click"
            },
			{
                selector: "#twotabsearchtextbox",
                event_name: "keydown",
				keyCode: 13
            }
        ],
        objects: [
            {
                selector:"#nav-search",
                properties: [
                    {
                        selector: "#twotabsearchtextbox",
                        property: "value",
                        name: "query",
                        type: "text"
                    },
                    {
                        selector: "#searchDropdownBox option:checked",
                        property: "innerText",
                        name: "category",
                        type: "text"
                    }
                ]
            }
		]
    },
	{
        name: "searchSuggestionSelect",
		url_match: "*://www.amazon.com/*",
        description: "This item collects a search suggestion that has been selected by user",
		viewGroup: "UX",
        title: "Search Suggestion",
        type: "event",
		readyAt: "DOMChange",
        observingTargetNode: "#nav-belt",
        observingConfig: { attributes: false, childList: true, subtree: true },
        is_enabled: true,
        events: [            
			{
                selector: ".s-suggestion",
                event_name: "click"
            }
        ],
        objects: [
            {
                selector:"#nav-search",
                properties: [                   
                    {
                        selector: "#searchDropdownBox option:checked",
                        property: "innerText",
                        name: "category",
                        type: "text"
                    }
                ]
            },
			{
                selector:"",
                properties: [
                    {
                        property: "innerText",
                        name: "query",
                        type: "text"
                    },
					{
                        property: "value",
                        name: "query",
                        type: "text"
                    }
                ]
            }
		]
    },
    {
        name: "searchResult",
		url_match: "*://www.amazon.com/s*",
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
                        selector: "h2 a",
                        property: "href",
                        name: "link",
                        type: "url"
                    },
                    {
                        selector: "h2 a",
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
			},
            {
                selector:"body",
                properties: [
                    {
                        selector: "#searchDropdownBox option:checked",
                        property: "innerText",
                        name: "category",
                        type: "text"
                    },
					{
                        selector: ".a-pagination .a-selected a",
                        property: "innerText",
                        name: "pageNumber",
                        type: "text"
                    }
                ]
            }
        ]
    },
	{
        name: "clickSearchResult",
		url_match: "*://*.amazon.com/s*",
        description: "This item collects information about a search result link that has been clicked by user",
		viewGroup: "UX",
        title: "clicked search results",
        type: "event",        
        is_enabled: true,
        events: [
            {
                selector: ".s-result-list.sg-row .s-result-item h2 a",
                event_name: "click"
            },
			{
                selector: ".s-result-list.sg-row .s-result-item h2 a",
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
                        property: "href",
                        name: "link",
                        type: "url"
                    },
                    {
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
                        selector: "#twotabsearchtextbox",
                        property: "value",
                        name: "query",
                        type: "text"
                    },
                    {
                        selector: "#searchDropdownBox option:checked",
                        property: "innerText",
                        name: "category",
                        type: "text"
                    },
					{
                        selector: ".a-pagination .a-selected a",
                        property: "innerText",
                        name: "pageNumber",
                        type: "text"
                    }
                ]
            }
        ]
    },
    {
        name: "selectedItem",
		url_match: "*://*.amazon.com/*",
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
				selector: "#dp-container",	
				isRequired: true,
                properties: [
                    {
						selector:"#productTitle",
                        property: "innerText",
                        name: "title",
                        type: "text"
                    },
					{
						selector:"#averageCustomerReviews .a-icon-star",
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
				selector: "#nav-search",
				properties: [
                    {
						selector:"#searchDropdownBox option:checked",
                        property: "innerText",
                        name: "category",
                        type: "text"
                    },
					{
						selector:"#twotabsearchtextbox",
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
		url_match: "*://*.amazon.com/*",
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
				selector: "#dp-container",	
				isRequired: true,
                properties: [
                    {
						selector:"#productTitle",
                        property: "innerText",
                        name: "title",
                        type: "text"
                    },
					{
						selector:"#averageCustomerReviews .a-icon-star",
                        property: "innerText",
                        name: "rate",
                        type: "text"
                    },
					{
						selector:"#price_inside_buybox",
                        property: "innerText",
                        name: "price",
                        type: "text"
                    }
                ]
				
            },
			{
				selector: "#nav-search",
				properties: [
                    {
						selector:"#searchDropdownBox option:checked",
                        property: "innerText",
                        name: "category",
                        type: "text"
                    },
					{
						selector:"#twotabsearchtextbox",
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
		url_match: "*://*.amazon.com/*",
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
				selector: "#dp-container",	
				isRequired: true,
                properties: [
                    {
						selector:"#productTitle",
                        property: "innerText",
                        name: "title",
                        type: "text"
                    },
					{
						selector:"#averageCustomerReviews .a-icon-star",
                        property: "innerText",
                        name: "rate",
                        type: "text"
                    },
					{
						selector:"#price_inside_buybox",
                        property: "innerText",
                        name: "price",
                        type: "text"
                    }
                ]
				
            },
			{
				selector: "#nav-search",
				properties: [
                    {
						selector:"#searchDropdownBox option:checked",
                        property: "innerText",
                        name: "category",
                        type: "text"
                    },
					{
						selector:"#twotabsearchtextbox",
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
		url_match: "*://*.amazon.com/*",
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
				selector: "#dp-container",	
				isRequired: true,
                properties: [
                    {
						selector:"#productTitle",
                        property: "innerText",
                        name: "title",
                        type: "text"
                    },
					{
						selector:"#averageCustomerReviews .a-icon-star",
                        property: "innerText",
                        name: "rate",
                        type: "text"
                    },
					{
						selector:"#price_inside_buybox",
                        property: "innerText",
                        name: "price",
                        type: "text"
                    }
                ]
				
            },
			{
				selector: "#nav-search",
				properties: [
                    {
						selector:"#searchDropdownBox option:checked",
                        property: "innerText",
                        name: "category",
                        type: "text"
                    },
					{
						selector:"#twotabsearchtextbox",
                        property: "value",
                        name: "query",
                        type: "text"
                    }
				]
			}
        ]
    },
    
];