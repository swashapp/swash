console.log("modules/twitter/browsing.js");
import {Twitter} from './manifest.js';
Twitter.browsing_filter = {urls: ["https://twitter.com/*"]};
Twitter.browsing_extraInfoSpec= ["blocking"];

Twitter.browsing = [
    {
        name: "post_tweet",
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
		name: "search",
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
		name: "follow",
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
		name: "unfollow",
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
		name: "mute",
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
		name: "unmute",
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
		name: "like",
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
		name: "retweet",
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
		name: "visit",
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
		name: "inspectVisit",
        title: "visited pages",
        is_enabled: true,
		target_listener: "inspectVisit"
	},
	{
		name: "inspectReferrer",
        title: "User experiense",
        is_enabled: true,
		target_listener: "inspectReferrer"
	}
];