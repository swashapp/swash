console.log("modules/amazon/content.js");
import {Amazon} from './manifest.js';
Amazon.content_matches = ["*://*.amazon.com/*"]
Amazon.content = [
    {
        name: "links",
		url_match: "*://*.amazon.com/*",
        description: "",
		viewGroup: "UX",
        title: "Links clicked by user",
        type: "event",        
        is_enabled: true,
        events: [
            {
                selector: "a",
                event_name: "click"
            }
        ],
        objects: [
            {
                selector:"",
                properties: [
                    {
                        property: "innerHTML",
                        name: "text",
                        type: "text"
                    },
                    {
                        property: "href",
                        name: "url",
                        type: "url"
                    }
                ]
            },
            {
                selector:"#title",
                properties: [
                    {
                        property: "innerText",
                        name: "page_title",
                        type: "text"
                    }
                ]
            }
        ]
    },
    {
        name: "selectItem",
		url_match: "*://*.amazon.com/*",
        description: "",
		viewGroup: "UX",
        title: "Items selected by user",
        type: "event",        
        is_enabled: true,
        events: [
            {
                selector: "",
 //               event_name: "DOMContentLoaded"
                event_name: "load"
            }
        ],
        objects: [
            {
                selector:"#productTitle",
                properties: [
                    {
                        property: "innerText",
                        name: "title",
                        type: "text"
                    }
                ]
				
            },
            {
                selector:"#searchDropdownBox option:selected",
                properties: [
                    {
                        property: "text",
                        name: "category",
                        type: "text"
                    }
                ]
            },
            {
                selector:"#title",
                properties: [
                    {
                        property: "innerText",
                        name: "page_title",
                        type: "text"
                    }
                ]
            }
        ]
    },
    {
        name: "addToCart",
		url_match: "*://*.amazon.com/*",
        description: "Items added to cart",
		viewGroup: "UX",
        title: "Items added to cart",
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
                selector:"#productTitle",
                properties: [
                    {
                        property: "innerText",
                        name: "title",
                        type: "text"                
                    }
                ]
            },
            {
                selector:"#searchDropdownBox option:selected",
                properties: [
                    {
                        property: "text",
                        name: "category",
                        type: "text"
                    }
                ]
            },
            {
                selector:"#title",
                properties: [
                    {
                        property: "innerText",
                        name: "page_title",
                        type: "text"
                    }
                ]
            }
        ]
    },
    {
        name: "addToWishlist",
        description: "",
		url_match: "*://*.amazon.com/*",
		viewGroup: "UX",
        title: "Items added to wishlist",
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
                selector:"#productTitle",
                properties: [
                    {
                        property: "innerText",
                        name: "title",
                        type: "text"
                    }
                ]
            },
            {
                selector:"#searchDropdownBox option:selected",
                properties: [
                    {
                        property: "text",
                        name: "category",
                        type: "text"
                    }
                ]
            },
            {
                selector:"#title",
                properties: [
                    {
                        property: "innerText",
                        name: "page_title",
                        type: "text"
                    }
                ]
            }
        ]
    },
    {
        name: "buyNow",
        description: "",
		url_match: "*://*.amazon.com/*",
		viewGroup: "UX",
        title: "Items selected for buy",
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
                selector:"#productTitle",
                properties: [
                    {
                        property: "innerText",
                        name: "title",
                        type: "text"
                    }
                ]
            },
            {
                selector:"#searchDropdownBox option:selected",
                properties: [
                    {
                        property: "text",
                        name: "category",
                        type: "text"
                    }
                ]
            },
            {
                selector:"#title",
                properties: [
                    {
                        property: "innerText",
                        name: "page_title",
                        type: "text"
                    }
                ]
            }
        ]
    },
    
];