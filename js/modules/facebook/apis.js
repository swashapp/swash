api_list = [
	{
		name: "userInfo",
		description: "",
		method: "GET",
		URI: "/me",
		content_type: "application/x-www-form-urlencoded",
		permissions: ["email","user_birthday","user_hometown","user_location"],
		params:{
			fields: "id,name,email,about,address,age_range,birthday,education,favorite_athletes,favorite_teams,first_name,gender,hometown,interested_in,languages,last_name,location,meeting_for,middle_name,quotes,relationship_status,religion,sports"
		},
		response_type: "json",
		verifyResponse() {
			
		}
	},
	{
		name: "userLikes",
		description: "All the Pages this person has liked",
		method: "GET",
		URI: "/me/likes",
		content_type: "application/x-www-form-urlencoded",
		permissions: ["user_likes"],
		params:{			
		},
		response_type: "json",
		verifyResponse(response) {
			return new Promise((resolve, reject) => {
				if (response.status != 200) {
					reject("Token validation error");
				}
				response.json().then((json) => {				
					resolve(json.data);
				});
			});
		}
	},
	{
		name: "UserAccounts",
		description: "Pages the User has a role on",
		method: "GET",
		URI: "/me/accounts",
		content_type: "application/x-www-form-urlencoded",
		permissions: ["pages_show_list"],
		params:{
		},
		response_type: "json",
		verifyResponse(response) {
			return new Promise((resolve, reject) => {
				if (response.status != 200) {
					reject("Token validation error");
				}
				response.json().then((json) => {
					res = [];
					for(item of json.data) {
						var newItem = {
							category: item.category,
							category_list: item.category_list,
							name: item.name,
							id: item.id
						}
						res.push(newItem);
					}
					
					resolve(res);
				});
			});
		}
		
	},
	{
		name: "UserAdStudies",
		description: "Ad studies that this User's can view.",
		method: "GET",
		URI: "/me/ad_studies",
		content_type: "application/x-www-form-urlencoded",
		permissions: ["ads_read"],
		params:{
		},
		response_type: "json",
		verifyResponse(response) {
			return new Promise((resolve, reject) => {
				if (response.status != 200) {
					reject("Token validation error");
				}
				response.json().then((json) => {					
					resolve(json.data);
				});
			});
		}
	},
	{
		name: "UserAdaccounts",
		description: "The advertising accounts to which this person has access",
		method: "GET",
		URI: "/me/adaccounts",
		content_type: "application/x-www-form-urlencoded",
		permissions: ["ads_management"],
		params:{
		},
		response_type: "json",
		verifyResponse(response) {
			return new Promise((resolve, reject) => {
				if (response.status != 200) {
					reject("Token validation error");
				}
				response.json().then((json) => {					
					resolve(json.data);
				});
			});
		}
	},
	{
		name: "UserAdcontracts",
		description: "The User's ad contracts.",
		method: "GET",
		URI: "/me/adcontracts",
		content_type: "application/x-www-form-urlencoded",
		permissions: ["ads_read"],
		params:{
		},
		response_type: "json",
		verifyResponse(response) {
			return new Promise((resolve, reject) => {
				if (response.status != 200) {
					reject("Token validation error");
				}
				response.json().then((json) => {					
					resolve(json.data);
				});
			});
		}
	},
	{
		name: "UserBooks",
		description: "Books listed in someone's Facebook profile.",
		method: "GET",
		URI: "/me/books",
		content_type: "application/x-www-form-urlencoded",
		permissions: [],
		params:{
		},
		response_type: "json",
		verifyResponse(response) {
			return new Promise((resolve, reject) => {
				if (response.status != 200) {
					reject("Token validation error");
				}
				response.json().then((json) => {					
					resolve(json.data);
				});
			});
		}
	},
	{
		name: "business_management",
		description: "GET business activities related to the user.",
		method: "GET",
		URI: "/me/business_activities",
		content_type: "application/x-www-form-urlencoded",
		permissions: ["business_management"],
		params:{
		},
		response_type: "json",
		verifyResponse(response) {
			return new Promise((resolve, reject) => {
				if (response.status != 200) {
					reject("Token validation error");
				}
				response.json().then((json) => {					
					resolve(json.data);
				});
			});
		}
	},
	{
		name: "UserBusinessUsers",
		description: "Get business users that a personal user has.",
		method: "GET",
		URI: "/me/business_users",
		content_type: "application/x-www-form-urlencoded",
		permissions: [],
		params:{
		},
		response_type: "json",
		verifyResponse(response) {
			return new Promise((resolve, reject) => {
				if (response.status != 200) {
					reject("Token validation error");
				}
				response.json().then((json) => {					
					resolve(json.data);
				});
			});
		}
	},
	{
		name: "UserBusinesses",
		description: "Businesses associated with the user",
		method: "GET",
		URI: "/me/businesses",
		content_type: "application/x-www-form-urlencoded",
		permissions: ["business_management"],
		params:{
		},
		response_type: "json",
		verifyResponse(response) {
			return new Promise((resolve, reject) => {
				if (response.status != 200) {
					reject("Token validation error");
				}
				response.json().then((json) => {					
					resolve(json.data);
				});
			});
		}
	},
	{
		name: "UserCustomLabels",
		description: "",
		method: "GET",
		URI: "/me/custom_labels",
		content_type: "application/x-www-form-urlencoded",
		permissions: [],
		params:{
		},
		response_type: "json",
		verifyResponse(response) {
			return new Promise((resolve, reject) => {
				if (response.status != 200) {
					reject("Token validation error");
				}
				response.json().then((json) => {					
					resolve(json.data);
				});
			});
		}
	},
	{
		name: "UserDomains",
		description: "The domains the user admins",
		method: "GET",
		URI: "/me/domains",
		content_type: "application/x-www-form-urlencoded",
		permissions: "email,user_birthday,user_hometown,user_location",
		params:{			
		},
		response_type: "json",
		verifyResponse(response) {
			return new Promise((resolve, reject) => {
				if (response.status != 200) {
					reject("Token validation error");
				}
				response.json().then((json) => {					
					resolve(json.data);
				});
			});
		}
	},
	{
		name: "UserFamily",
		description: "A person's family relationships.",
		method: "GET",
		URI: "/me/family",
		content_type: "application/x-www-form-urlencoded",
		permissions: [],
		params:{
		},
		response_type: "json",
		verifyResponse(response) {
			return new Promise((resolve, reject) => {
				if (response.status != 200) {
					reject("Token validation error");
				}
				response.json().then((json) => {					
					resolve(json.data);
				});
			});
		}
	},
	{
		name: "UserFavoriteRequests",
		description: "Developers' favorite requests to the Graph API.",
		method: "GET",
		URI: "/me/favorite_requests",
		content_type: "application/x-www-form-urlencoded",
		permissions: [],
		params:{
		},
		response_type: "json",
		verifyResponse(response) {
			return new Promise((resolve, reject) => {
				if (response.status != 200) {
					reject("Token validation error");
				}
				response.json().then((json) => {					
					resolve(json.data);
				});
			});
		}
	},
	{
		name: "UserPublishedPosts",
		description: "shows only the posts that were published by this person.",
		method: "GET",
		URI: "/me/posts",
		content_type: "application/x-www-form-urlencoded",
		permissions: ["user_posts"],
		params:{
		},
		response_type: "json",
		verifyResponse(response) {
			return new Promise((resolve, reject) => {
				if (response.status != 200) {
					reject("Token validation error");
				}
				response.json().then((json) => {					
					resolve(json.data);
				});
			});
		}
	},
	{
		name: "UserTaggedPosts",
		description: "shows only the posts that this person was tagged in.",
		method: "GET",
		URI: "/me/tagged",
		content_type: "application/x-www-form-urlencoded",
		permissions: ["user_posts"],
		params:{
		},
		response_type: "json",
		verifyResponse(response) {
			return new Promise((resolve, reject) => {
				if (response.status != 200) {
					reject("Token validation error");
				}
				response.json().then((json) => {					
					resolve(json.data);
				});
			});
		}
	},
	{
		name: "UserFriends",
		description: "get the User's friends who have installed the app making the query",
		method: "GET",
		URI: "/me/friends",
		content_type: "application/x-www-form-urlencoded",
		permissions: ["friends"],
		params:{
		},
		response_type: "json",
		verifyResponse(response) {
			return new Promise((resolve, reject) => {
				if (response.status != 200) {
					reject("Token validation error");
				}
				response.json().then((json) => {					
					resolve(json.data);
				});
			});
		}
	},
	{
		name: "UserGames",
		description: "Games a person likes.",
		method: "GET",
		URI: "/me/games",
		content_type: "application/x-www-form-urlencoded",
		permissions: [],
		params:{
		},
		response_type: "json",
		verifyResponse(response) {
			return new Promise((resolve, reject) => {
				if (response.status != 200) {
					reject("Token validation error");
				}
				response.json().then((json) => {					
					resolve(json.data);
				});
			});
		}
	},
	{
		name: "UserMovies",
		description: "Movies this person likes",
		method: "GET",
		URI: "/me/movies",
		content_type: "application/x-www-form-urlencoded",
		permissions: [],
		params:{
		},
		response_type: "json",
		verifyResponse(response) {
			return new Promise((resolve, reject) => {
				if (response.status != 200) {
					reject("Token validation error");
				}
				response.json().then((json) => {					
					resolve(json.data);
				});
			});
		}
	},
	{
		name: "UserMusics",
		description: "Music this person likes.",
		method: "GET",
		URI: "/me/music",
		content_type: "application/x-www-form-urlencoded",
		permissions: [],
		params:{
		},
		response_type: "json",
		verifyResponse(response) {
			return new Promise((resolve, reject) => {
				if (response.status != 200) {
					reject("Token validation error");
				}
				response.json().then((json) => {					
					resolve(json.data);
				});
			});
		}
	},
	{
		name: "UserPhotos",
		description: "Photos the person is tagged in or has uploaded",
		method: "GET",
		URI: "/me/photos/uploaded",
		content_type: "application/x-www-form-urlencoded",
		permissions: ["user_photos"],
		params:{
		},
		response_type: "json",
		verifyResponse(response) {
			return new Promise((resolve, reject) => {
				if (response.status != 200) {
					reject("Token validation error");
				}
				response.json().then((json) => {					
					resolve(json.data);
				});
			});
		}
	},
	{
		name: "UserTaggedPlaces",
		description: "Tagged Places for a Facebook User.",
		method: "GET",
		URI: "/me/tagged_places",
		content_type: "application/x-www-form-urlencoded",
		permissions: ["tagged_places"],
		params:{
		},
		response_type: "json",
		verifyResponse(response) {
			return new Promise((resolve, reject) => {
				if (response.status != 200) {
					reject("Token validation error");
				}
				response.json().then((json) => {					
					resolve(json.data);
				});
			});
		}
	},
	{
		name: "UserTelevision",
		description: "TV shows this person likes",
		method: "GET",
		URI: "/me/television",
		content_type: "application/x-www-form-urlencoded",
		permissions: "email,user_birthday,user_hometown,user_location",
		params:{
			fields: "id,name,email,about,address,age_range,birthday,education,favorite_athletes,favorite_teams,first_name,gender,hometown,interested_in,languages,last_name,location,meeting_for,middle_name,quotes,relationship_status,religion,sports"
		},
		response_type: "json",
		verifyResponse(response) {
			return new Promise((resolve, reject) => {
				if (response.status != 200) {
					reject("Token validation error");
				}
				response.json().then((json) => {					
					resolve(json.data);
				});
			});
		}
	},
	{
		name: "UserVideos",
		description: "Videos the person is tagged in or uploaded",
		method: "GET",
		URI: "/me/videos",
		content_type: "application/x-www-form-urlencoded",
		permissions: ["user_videos"],
		params:{
		},
		response_type: "json",
		verifyResponse(response) {
			return new Promise((resolve, reject) => {
				if (response.status != 200) {
					reject("Token validation error");
				}
				response.json().then((json) => {					
					resolve(json.data);
				});
			});
		}
	}
]


function fbCall(apiInfo)
{
	let gettingItem = retrieveData(config.name);
	gettingItem.then(item => {
		access_token = item[config.name].tokenInfo.token;
		endpoint = config.apiConfig.api_endpoint;
		return apiCall(endpoint, apiInfo, access_token).then(apiInfo.verifyResponse).then(resp => console.log(resp));				
	})
}

function fbListCall(apiInfoList)
{
	let gettingItem = retrieveData(config.name);
	gettingItem.then(item => {
		access_token = item[config.name].tokenInfo.token;
		endpoint = config.apiConfig.api_endpoint;
		for(apiInfo of apiInfoList)
		{			
			apiCall(endpoint, apiInfo, access_token).then(apiInfo.verifyResponse).then(resp => console.log(resp));				
		}
	})	
}

function fbBatchCall(apiInfoList)
{
	let gettingItem = retrieveData(config.name);
	gettingItem.then(item => {
		access_token = item[config.name].tokenInfo.token;
		endpoint = config.apiConfig.api_endpoint;
		var batch = [];
		for(apiInfo of apiInfoList)
		{
			switch(apiInfo.method)
			{
				case "GET":
					item = {
						method: apiInfo.method,
						relative_url: apiInfo.URI.concat("?", serialize(apiInfo.params))			
					}	
					break;
				case "POST":
					item = {
						method: apiInfo.method,
						relative_url: apiInfo.URI,
						body: serialize(apiInfo.params)
					}
					break;
				default:
			}
			batch.push(item);			
		}
		aInfo = {
			method: "POST",
			URI: "/",
			content_type: "application/x-www-form-urlencoded",
			params: {
				batch: JSON.stringify(batch)
			}
		}
		apiCall(endpoint, aInfo, access_token).then(verifyBatchResponse).then(resp => console.log(resp));				
	})	
}

function verifyBatchResponse(response) {
	return new Promise((resolve, reject) => {
		if (response.status != 200) {
			reject("Token validation error");
		}
		response.json().then((json) => {				
			resolve(json.data);
		});
	});	
}
