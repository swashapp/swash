var Facebook = (function() {
    'use strict';
    
    return {
        name: "facebook",
        description: "This module look through all the user activities on facebook and capture those activities that user have permitted",
        path: "/facebook",
        URL: "https://www.facebook.com",
        functions: ["browsing", "apiCall"],
        apiConfig: {
            redirect_url: browser.identity.getRedirectURL(),
            client_id: "355488065290314",
            api_endpoint: "https://graph.facebook.com/v3.2",
            auth_url: 'https://www.facebook.com/v3.2/dialog/oauth',
            validation_uri: "/debug_token",
        },
        privacy_level: 3,
        status: "enabled",
        icons: ["","",""],
        version: 1,
        changelog: []
    };
}());
AllModules.push(Facebook);