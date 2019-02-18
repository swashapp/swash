Amazon.content_filter = [""];
Amazon.content = [
    {
        name: "links",
        description: "",
        title: "",
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
        title: "",
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
        name: "selectItem",
        description: "",
        title: "",
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
        name: "selectItem",
        description: "",
        title: "",
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
        name: "selectItem",
        description: "",
        title: "",
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