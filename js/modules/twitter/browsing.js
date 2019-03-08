console.log("modules/twitter/browsing.js");
import {Twitter} from './manifest.js';
Twitter.browsing_filter = {urls: ["https://twitter.com/*"]};
Twitter.browsing_extraInfoSpec= ["blocking"];

Twitter.browsing = [
    {
        name: "Post Tweet",
        title: "Post a new tweet",
        is_enabled: true,        
        description: "",
        patterns: [
			{
				method: "POST",
				url_pattern: "https://twitter.com/i/tweet/create",
				pattern_type: "exact",
				param: [
					{
						type: "form",
						key: "status",
						name: "text"
					}
				]
			}
		]
	},
	{
		name: "Search",
		title: "Twitter Search",
        is_enabled: true,
		description: "",
		patterns: [
			{
				method: "GET",
				url_pattern: "https:\/\/twitter\.com\/hashtag\/([^?]+)\?src=hash",
				pattern_type: "regex",
				param: [
					{
						type: "regex",
						group: 1,
						name: "hashtag"
					}
				]
			},
			{
				method: "GET",
				url_pattern: "https:\/\/twitter\.com\/search\?q=([^&]+)&src=typd",
				pattern_type: "regex",
				param: [
					{
						type: "regex",
						group: 1,
						name: "q"
					}
				]
			}
		]
	},
	{
		name: "Follow",
		title: "Follow action",
        is_enabled: true,
		description: "",
		patterns: [
			{
				method: "POST",
				url_pattern: "https://api.twitter.com/1.1/friendships/create.json",
				pattern_type: "exact",
				param: [
					{
						type: "form",
						key: "user_id",
						name: "user_id"
					}
				]
			}
		]
	},
	{
		name: "Unfollow",
		title: "Unfollow action",
        is_enabled: true,
		description: "",
		patterns: [
			{
				method: "POST",
				url_pattern: "https://api.twitter.com/1.1/friendships/destroy.json",
				pattern_type: "exact",
				param: [
					{
						type: "form",
						key: "user_id",
						name: "user_id"
					}
				]
			}
		]
	},
	{
		name: "Mute",
		title: "Mute action",
        is_enabled: true,
		description: "",
		patterns: [
			{
				method: "POST",
				url_pattern: "https://twitter.com/i/user/mute",
				pattern_type: "exact",
				param: [
					{
						type: "form",
						key: "user_id",
						name: "user_id"
					}
				]
			}
		]
	},
	{
		name: "Unmute",
		title: "Unmute action",
        is_enabled: true,
		description: "",
		patterns: [
			{
				method: "POST",
				url_pattern: "https://twitter.com/i/user/unmute",
				pattern_type: "exact",
				param: [
					{
						type: "form",
						key: "user_id",
						name: "user_id"
					}
				]
			}
		]			
	},
	{
		name: "Like",
		title: "Like action",
        is_enabled: true,
		description: "",
		patterns: [
			{
				method: "POST",
				url_pattern: "https://api.twitter.com/1.1/favorites/create.json",
				pattern_type: "exact",
				param: [
					{
						type: "form",
						key: "id",
						name: "tweet_id"
					}
				]
			}
		]
	},
	{
		name: "Retweet",
		title: "Retweet",
        is_enabled: true,
		description: "",
		patterns: [
			{
				method: "POST",
				url_pattern: "https:\/\/twitter\.com\/i\/tweet\/html\?id=([0-9]+)&modal=retweet",
				pattern_type: "regex",
				param: [
					{
						type: "regex",
						group: 1,
						name: "tweet_id"
					}
				]
			}
		]
	},
	{
		name: "Visit",
		title: "Visit User page",
        is_enabled: true,
		description: "",
		patterns: [
			{
				method: "GET",
				url_pattern: "https:\/\/twitter\.com\/([_A-Za-z0-9]+)$",
				pattern_type: "regex",
				param: [
					{
						type: "regex",
						group: 1,
						name: "username"
					}
				]
			}
		]
	},
	{
		name: "Page Visit",
        title: "visited pages",
        is_enabled: true,
		target_listener: "inspectVisit"
	},
	{
		name: "Visiting Graph",
        title: "User experience",
        is_enabled: true,
		target_listener: "inspectReferrer"
	}
];