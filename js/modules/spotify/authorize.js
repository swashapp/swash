import {spotify} from './manifest.js';

// TODO: remove scopes that are not necessary
spotify.apiConfig = {
            client_id: "39c1107e38e04d0a85546f34327e87bb",			
            api_endpoint: "https://api.spotify.com/v1",
            auth_url: 'https://accounts.spotify.com/authorize',
            access_token_regex: "access_token=([^&]*)",
            scopes: [   "user-read-playback-state",
                        "playlist-read-collaborative",
                        "user-top-read",
                        "user-read-currently-playing",
                        "playlist-read-private",
                        "user-follow-read",
						"user-read-recently-played",
						"user-library-read",
						"user-read-private"
                        ]
        }
spotify.validate_token = {
    name: "validate_token",
    description: "",
    method: "GET",
    endpoint: "https://api.spotify.com/v1",
    URI: "/me",
    token_param_name:"id",
    content_type: "application/x-www-form-urlencoded",
    response_type: "json",
    required_jpath:"$.id",
	bearer: true
}
