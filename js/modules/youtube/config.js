config = {
	name: "youtube",
	description: "This module look through all the user activities on Youtube and capture those activities that user have permitted",
	path: "/youtube",
	URL: "https://www.youtube.com",
	data: ["browsing", "apiCall"],
	apiConfig: {
		redirect_url: browser.identity.getRedirectURL(),
		client_id: "279095781364-1q6ki5adn4ufvfu0689hh3pl8u1upqoi.apps.googleusercontent.com",
		api_endpoint: "https://www.googleapis.com/youtube/v3",
        validation_endpoint: "https://www.googleapis.com/oauth2/v3",
		auth_url: 'https://accounts.google.com/o/oauth2/v2/auth',
		validation_uri: "/tokeninfo",
	}
}
