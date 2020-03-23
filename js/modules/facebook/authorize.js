import {facebook} from './manifest.js';
facebook.apiConfig = {
    redirect_url: "",
    client_id: "355488065290314",
    api_endpoint: "https://graph.facebook.com/v3.2",
    auth_url: 'https://www.facebook.com/v3.2/dialog/oauth',
	access_token_regex: "access_token=([^&]*)",
	scopes: ["email", "user_likes", "pages_show_list", "ads_read", "ads_management", "business_management", "user_posts", "user_videos"]//, "user_photos", "tagged_places"
}

facebook.validate_token = {
    name: "validate_token",
    description: "",
    method: "GET",
    endpoint: "https://graph.facebook.com/v3.2",
    URI: "/debug_token",
    content_type: "application/x-www-form-urlencoded",
    permissions: ["email"],
    token_param_name:"input_token",
    response_type: "json",
    required_jpath:"$.data.user_id",
}
