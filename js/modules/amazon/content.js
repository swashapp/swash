console.log("modules/amazon/content.js");
import {Amazon} from './manifest.js';
Amazon.content_matches = ["*://*.amazon.com/*"];
Amazon.content = [
    {
        name: "links",
        description: "",
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
                property: "innerHTML",
                name: "text",
				type: "text"
            },
            {
                selector:"",
                property: "href",
                name: "url",
				type: "url"
            },
            {
                selector:"#title",
                property: "innerText",
                name: "page_title",
				type: "text"
            }
        ]
    },
    {
        name: "selectItem",
        description: "",
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
                property: "innerText",
                name: "title",
				type: "text"
				
            },
            {
                selector:"#searchDropdownBox option:selected",
                property: "text",
                name: "category",
				type: "text"
            },
            {
                selector:"#title",
                property: "innerText",
                name: "page_title",
				type: "text"
            }
        ]
    },
    {
        name: "addToCart",
        description: "Items added to cart",
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
                property: "innerText",
                name: "title"
            },
            {
                selector:"#searchDropdownBox option:selected",
                property: "text",
                name: "category"
            },
            {
                selector:"#title",
                property: "innerText",
                name: "page_title"
            }
        ]
    },
    {
        name: "addToWishlist",
        description: "",
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
                property: "innerText",
                name: "title"
            },
            {
                selector:"#searchDropdownBox option:selected",
                property: "text",
                name: "category"
            },
            {
                selector:"#title",
                property: "innerText",
                name: "page_title"
            }
        ]
    },
    {
        name: "buyNow",
        description: "",
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
                property: "innerText",
                name: "title"
            },
            {
                selector:"#searchDropdownBox option:selected",
                property: "text",
                name: "category"
            },
            {
                selector:"#title",
                property: "innerText",
                name: "page_title"
            }
        ]
    },
    
];