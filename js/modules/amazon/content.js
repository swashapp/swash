console.log("modules/amazon/content.js");
import {Amazon} from './manifest.js';
Amazon.content_matches = ["*://*.amazon.com/*"];
Amazon.content = [
    {
        name: "links",
        description: "",
        title: "Links clicked by user",
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
                name: "text"
            },
            {
                selector:"",
                property: "href",
                name: "url"
            },
            {
                selector:"title",
                property: "innerHTML",
                name: "page_title"
            }
        ]
    },
    {
        name: "selectItem",
        description: "",
        title: "Items selected by user",
        is_enabled: true,
        events: [
            {
                selector: "",
                event_name: "DOMContentLoaded"
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
                selector:"title",
                property: "innerHTML",
                name: "page_title"
            }
        ]
    },
    {
        name: "addToCard",
        description: "Items added to card",
        title: "",
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
                selector:"title",
                property: "innerHTML",
                name: "page_title"
            }
        ]
    },
    {
        name: "addToWishlist",
        description: "",
        title: "Items added to wishlist",
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
                selector:"title",
                property: "innerHTML",
                name: "page_title"
            }
        ]
    },
    {
        name: "buyNow",
        description: "",
        title: "Items selected for buy",
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
                selector:"title",
                property: "innerHTML",
                name: "page_title"
            }
        ]
    },
    
];